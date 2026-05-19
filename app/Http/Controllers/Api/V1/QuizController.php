<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class QuizController extends Controller
{
    /**
     * Submit a quiz attempt.
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $validator = Validator::make($request->all(), [
            'answers' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth('api')->user();
        $questions = $quiz->questions;

        if ($questions->isEmpty()) {
            return response()->json(['error' => 'This quiz has no questions.'], 400);
        }

        $totalQuestions = $questions->count();
        $correctCount = 0;
        $studentAnswers = $request->answers;
        $detailedResults = [];

        foreach ($questions as $question) {
            // Note: correct_answer is retrievable on the Model instance even if hidden in JSON
            $correctAnswer = $question->correct_answer;
            $submittedAnswer = $studentAnswers[$question->id] ?? null;

            $isCorrect = (trim(strtolower($submittedAnswer)) === trim(strtolower($correctAnswer)));
            if ($isCorrect) {
                $correctCount++;
            }

            $detailedResults[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'submitted_answer' => $submittedAnswer,
                'is_correct' => $isCorrect,
            ];
        }

        $score = ($correctCount / $totalQuestions) * 100;
        $isPassed = ($score >= 70.00);

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $user->id,
            'score' => $score,
            'is_passed' => $isPassed,
        ]);

        return response()->json([
            'message' => 'Quiz attempt submitted successfully.',
            'attempt_id' => $attempt->id,
            'score' => round($score, 2),
            'is_passed' => $isPassed,
            'correct_count' => $correctCount,
            'total_questions' => $totalQuestions,
            'results' => $detailedResults,
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
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts);
    }
}
