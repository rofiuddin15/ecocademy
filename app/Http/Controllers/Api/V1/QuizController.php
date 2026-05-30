<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use App\Models\Module;
use App\Models\QuizQuestion;
use App\Models\QuizOption;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    /**
     * Store a new quiz with its questions and options.
     */
    public function store(Request $request, Module $module)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.sequence' => 'nullable|integer',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $quiz = Quiz::create([
                'module_id' => $module->id,
                'title' => $request->title,
                'instructions' => $request->instructions,
            ]);

            foreach ($request->questions as $idx => $qData) {
                $question = QuizQuestion::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $qData['question_text'],
                    'sequence' => $qData['sequence'] ?? ($idx + 1),
                ]);

                foreach ($qData['options'] as $optData) {
                    QuizOption::create([
                        'question_id' => $question->id,
                        'option_text' => $optData['option_text'],
                        'is_correct' => $optData['is_correct'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Quiz created successfully',
                'quiz' => $quiz->load('questions.options')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create quiz: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing quiz with its questions and options.
     * Note: This replaces all existing questions and options for simplicity.
     */
    public function update(Request $request, Quiz $quiz)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.question_text' => 'required|string',
            'questions.*.sequence' => 'nullable|integer',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        try {
            DB::beginTransaction();

            $quiz->update([
                'title' => $request->title,
                'instructions' => $request->instructions,
            ]);

            // Delete old questions (options will cascade if foreign keys are set up, but let's be explicit)
            foreach ($quiz->questions as $oldQuestion) {
                $oldQuestion->options()->delete();
                $oldQuestion->delete();
            }

            // Create new questions
            foreach ($request->questions as $idx => $qData) {
                $question = QuizQuestion::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $qData['question_text'],
                    'sequence' => $qData['sequence'] ?? ($idx + 1),
                ]);

                foreach ($qData['options'] as $optData) {
                    QuizOption::create([
                        'question_id' => $question->id,
                        'option_text' => $optData['option_text'],
                        'is_correct' => $optData['is_correct'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Quiz updated successfully',
                'quiz' => $quiz->load('questions.options')
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update quiz: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a quiz.
     */
    public function destroy(Quiz $quiz)
    {
        try {
            DB::beginTransaction();
            foreach ($quiz->questions as $question) {
                $question->options()->delete();
                $question->delete();
            }
            $quiz->delete();
            DB::commit();
            return response()->json(['message' => 'Quiz deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete quiz: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Submit a quiz attempt.
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array', // Format: {"question_id_1": "option_id_a", "question_id_2": "option_id_c"}
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth('api')->user();
        $questions = $quiz->questions()->with('options')->get();

        if ($questions->isEmpty()) {
            return response()->json(['error' => 'This quiz has no questions.'], 400);
        }

        $totalQuestions = $questions->count();
        $correctCount = 0;
        $studentAnswers = $request->answers;
        $answersToSave = [];

        foreach ($questions as $question) {
            $selectedOptionId = $studentAnswers[$question->id] ?? null;
            
            // Find option in question options list
            $selectedOption = $question->options->firstWhere('id', $selectedOptionId);
            
            $isCorrect = false;
            if ($selectedOption && $selectedOption->is_correct) {
                $isCorrect = true;
                $correctCount++;
            }

            $answersToSave[] = [
                'question_id' => $question->id,
                'selected_option_id' => $selectedOptionId,
                'is_correct' => $isCorrect,
                'option_text' => $selectedOption ? $selectedOption->option_text : null,
            ];
        }

        $score = ($correctCount / $totalQuestions) * 100;
        $isPassed = ($score >= 70.00);

        // Create Attempt
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $user->id,
            'score' => $score,
            'is_passed' => $isPassed,
        ]);

        // Save Attempt Answers
        foreach ($answersToSave as $ans) {
            if ($ans['selected_option_id']) {
                QuizAttemptAnswer::create([
                    'attempt_id' => $attempt->id,
                    'question_id' => $ans['question_id'],
                    'selected_option_id' => $ans['selected_option_id'],
                    'is_correct' => $ans['is_correct'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Quiz attempt submitted successfully.',
            'attempt_id' => $attempt->id,
            'score' => round($score, 2),
            'is_passed' => $isPassed,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'results' => array_map(function($a) {
                return [
                    'question_id' => $a['question_id'],
                    'selected_option_id' => $a['selected_option_id'],
                    'is_correct' => $a['is_correct'],
                ];
            }, $answersToSave),
        ]);
    }

    /**
     * Get attempts history for a quiz.
     */
    public function attempts(Quiz $quiz)
    {
        $user = auth('api')->user();
        
        $attempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('user_id', $user->id)
            ->with('answers')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts);
    }
}
