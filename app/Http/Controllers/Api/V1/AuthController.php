<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     */
    public function __construct()
    {
        // Guard API is applied in routing or via middleware, but we can configure it here if needed.
    }

    /**
     * Register a new User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|string|in:student,instructor,admin',
            'bio' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'bio' => $request->bio,
        ]);

        // Assign Spatie Role matching the role string
        // Check if role exists first (it should be seeded)
        if (Role::where('name', $request->role)->exists()) {
            $user->assignRole($request->role);
        }

        $token = auth('api')->login($user);

        return $this->respondWithToken($token);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $credentials = $request->only(['email', 'password']);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized / Email or Password wrong'], 401);
        }

        // Catat log aktivitas login
        ActivityLog::record(
            userId:   auth('api')->user()->id,
            action:   'login',
            metadata: ['email' => $request->email],
            ipAddress: $request->ip(),
        );

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user()->load('roles'));
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $user = auth('api')->user();

        // Catat log aktivitas logout sebelum invalidate token
        if ($user) {
            ActivityLog::record(
                userId:   $user->id,
                action:   'logout',
                ipAddress: request()->ip(),
            );
        }

        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Update the authenticated user's profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'bio' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->bio = $request->bio;

        if ($request->has('password') && !empty($request->password)) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($user->avatar) {
                $oldPath = public_path(str_replace(url('/'), '', $user->avatar));
                if (file_exists($oldPath)) {
                    @unlink($oldPath);
                }
            }

            $file = $request->file('avatar');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/avatars'), $fileName);
            $user->avatar = url('uploads/avatars/' . $fileName);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Delete the authenticated user's account.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAccount()
    {
        $user = auth('api')->user();

        // Delete avatar if exists
        if ($user->avatar) {
            $path = public_path(str_replace(url('/'), '', $user->avatar));
            if (file_exists($path)) {
                @unlink($path);
            }
        }

        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully'
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user()->load('roles')
        ]);
    }
}
