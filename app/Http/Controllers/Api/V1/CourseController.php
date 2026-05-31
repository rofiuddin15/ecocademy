<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Course::query()->with(['category', 'instructor', 'skills', 'partners', 'modules']);

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search in title/description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Standard user sees only published ones.
        // Instructors can see all their own courses. Admins can see all.
        $user = auth('api')->user();
        if (!$user || (!$user->hasRole('admin') && !$user->hasRole('instructor'))) {
            $query->where('is_published', true);
        } elseif ($user->hasRole('instructor') && !$user->hasRole('admin')) {
            $query->where(function($q) use ($user) {
                $q->where('is_published', true)
                  ->orWhere('instructor_id', $user->id);
            });
        }

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'duration' => 'nullable|integer',
            'score' => 'nullable|integer',
            'rating' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'level' => 'nullable|string|max:100',
            'full_description' => 'nullable|string',
            'skills' => 'nullable|array',
            'partners' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($request->file('image'));
            $image->cover(1280, 720);
            $encoded = $image->toWebp(85);
            $filename = 'courses/' . uniqid() . '.webp';
            \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $encoded->toString());
            $imagePath = '/storage/' . $filename;
        }

        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'instructor_id' => auth('api')->id(),
            'is_published' => false,
            'duration' => $request->duration ?? 0,
            'score' => $request->score ?? 0,
            'rating' => $request->rating ?? 5.00,
            'image' => $imagePath,
            'level' => $request->level,
            'full_description' => $request->full_description,
        ]);

        if ($request->has('skills')) {
            foreach ($request->skills as $skillName) {
                $course->skills()->create(['name' => $skillName]);
            }
        }

        if ($request->has('partners')) {
            $course->partners()->sync($request->partners);
        }

        return response()->json($course->load(['category', 'instructor', 'skills', 'partners']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        $user = auth('api')->user();
        if (!$course->is_published) {
            if (!$user || ($user->id !== $course->instructor_id && !$user->hasRole('admin'))) {
                return response()->json(['error' => 'This course is not published or access denied.'], 403);
            }
        }

        // Load modules (with materials & quiz), milestones, skills, partners, and pblDetail
        return response()->json($course->load(['category', 'instructor', 'modules.materials', 'modules.quiz.questions.options', 'milestones', 'skills', 'partners', 'pblDetail']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $user = auth('api')->user();
        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized action. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'is_published' => 'sometimes|boolean',
            'duration' => 'nullable|integer',
            'score' => 'nullable|integer',
            'rating' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'level' => 'nullable|string|max:100',
            'full_description' => 'nullable|string',
            'skills' => 'nullable|array',
            'partners' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $dataToUpdate = $request->only([
            'title', 'description', 'category_id', 'is_published',
            'score', 'rating', 'level',
            'full_description'
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($course->image && str_starts_with($course->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $course->image);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }

            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($request->file('image'));
            $image->cover(1280, 720);
            $encoded = $image->toWebp(85);
            $filename = 'courses/' . uniqid() . '.webp';
            \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $encoded->toString());
            $dataToUpdate['image'] = '/storage/' . $filename;
        }

        if ($request->has('duration')) {
            $dataToUpdate['duration'] = $request->duration ?? 0;
        }

        $course->update($dataToUpdate);

        if ($request->has('skills')) {
            $course->skills()->delete();
            foreach ($request->skills as $skillName) {
                $course->skills()->create(['name' => $skillName]);
            }
        }

        if ($request->has('partners')) {
            $course->partners()->sync($request->partners);
        }

        return response()->json($course->load(['category', 'instructor', 'skills', 'partners']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $user = auth('api')->user();
        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized action. You do not own this course.'], 403);
        }

        $course->deleteOrFail();

        return response()->json(['message' => 'Course deleted successfully']);
    }

    /**
     * Toggle public publication of a course.
     */
    public function publish(Request $request, Course $course)
    {
        $user = auth('api')->user();
        if ($course->instructor_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json(['error' => 'Unauthorized action. You do not own this course.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'is_published' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $course->update([
            'is_published' => $request->is_published
        ]);

        return response()->json([
            'message' => $request->is_published ? 'Course published successfully' : 'Course unpublished successfully',
            'course' => $course
        ]);
    }
}
