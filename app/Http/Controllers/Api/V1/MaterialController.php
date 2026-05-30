<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MaterialController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'module_id' => 'required|exists:modules,id',
            'title' => 'required|string|max:150',
            'content_type' => 'required|in:video,article,pdf',
            'content_url' => 'nullable|string|max:255',
            'body_text' => 'nullable|string',
            'sequence' => 'required|integer',
            'duration_minutes' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $module = Module::findOrFail($request->module_id);
        $user = auth('api')->user();

        if ($module->course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $material = Material::create([
            'module_id' => $request->module_id,
            'title' => $request->title,
            'content_type' => $request->content_type,
            'content_url' => $request->content_url,
            'body_text' => $request->body_text,
            'sequence' => $request->sequence,
            'duration_minutes' => $request->duration_minutes,
        ]);

        $module->course->recalculateDuration();

        return response()->json($material, 201);
    }

    public function update(Request $request, Material $material)
    {
        $module = $material->module;
        $user = auth('api')->user();

        if ($module->course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'content_type' => 'sometimes|required|in:video,article,pdf',
            'content_url' => 'nullable|string|max:255',
            'body_text' => 'nullable|string',
            'sequence' => 'sometimes|required|integer',
            'duration_minutes' => 'sometimes|required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $material->update($request->only(['title', 'content_type', 'content_url', 'body_text', 'sequence', 'duration_minutes']));
        
        $module->course->recalculateDuration();

        return response()->json($material);
    }

    public function destroy(Material $material)
    {
        $module = $material->module;
        $user = auth('api')->user();

        if ($module->course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized. You do not own this course.'], 403);
        }

        $material->delete();
        
        $module->course->recalculateDuration();

        return response()->json(['message' => 'Material deleted successfully']);
    }
}
