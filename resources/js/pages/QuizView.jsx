import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const QuizView = () => {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({}); // { question_id: option_id }
    const [attempts, setAttempts] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { score, is_passed, correct_count }
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const fetchQuizAndAttempts = async () => {
        try {
            const courseResponse = await api.get(`/courses/${courseId}`);
            setCourse(courseResponse.data);

            const activeModule = courseResponse.data.modules?.find(m => m.id === moduleId);
            if (activeModule && activeModule.quiz) {
                setQuiz(activeModule.quiz);
                
                // Fetch attempts log
                const attemptsResponse = await api.get(`/quizzes/${activeModule.quiz.id}/attempts`);
                setAttempts(attemptsResponse.data);
            }
        } catch (error) {
            console.error('Error fetching quiz:', error);
            setFeedbackMsg('Gagal memuat kuis.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizAndAttempts();
    }, [courseId, moduleId]);

    const handleOptionChange = (questionId, optionId) => {
        setAnswers({
            ...answers,
            [questionId]: optionId,
        });
    };

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();
        
        // Ensure all questions are answered
        const questionCount = quiz.questions?.length || 0;
        const answeredCount = Object.keys(answers).length;
        if (answeredCount < questionCount) {
            alert('Harap selesaikan seluruh pertanyaan sebelum mengirimkan.');
            return;
        }

        setIsSubmitting(true);
        setFeedbackMsg('');

        try {
            const response = await api.post(`/quizzes/${quiz.id}/submit`, {
                answers
            });
            setResult(response.data);
            
            // Re-fetch attempts log
            const attemptsResponse = await api.get(`/quizzes/${quiz.id}/attempts`);
            setAttempts(attemptsResponse.data);
        } catch (error) {
            console.error('Error submitting quiz:', error);
            setFeedbackMsg('Terjadi kesalahan saat memproses jawaban kuis.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setResult(null);
        setAnswers({});
        setFeedbackMsg('');
    };

    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
                <span className="material-symbols-outlined text-primary text-[40px] animate-spin">sync</span>
                <p className="text-label-sm text-on-surface-variant">Memuat data kuis...</p>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="py-20 text-center bg-white rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-[48px] text-error mb-3">error</span>
                <p className="text-body-md text-on-surface-variant font-bold">Kuis tidak ditemukan untuk modul ini.</p>
                <Link to={`/dashboard/courses/${courseId}`} className="mt-4 inline-block text-primary font-semibold hover:underline">Kembali ke Kelas</Link>
            </div>
        );
    }

    return (
        <>
            {/* Back Button */}
            <Link to={`/dashboard/courses/${courseId}`} className="flex items-center gap-2 mb-6 text-primary hover:opacity-85 font-semibold">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>Kembali ke Kelas</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Quiz Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm">
                        <div className="mb-6 pb-6 border-b border-outline-variant/20">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-label-sm mb-4">Ujian Evaluasi</span>
                            <h1 className="text-[28px] font-bold text-primary mb-2">{quiz.title}</h1>
                            <p className="text-body-md text-on-surface-variant leading-relaxed">{quiz.instructions || 'Selesaikan pertanyaan pilihan ganda berikut untuk menguji pemahaman Anda.'}</p>
                        </div>

                        {feedbackMsg && (
                            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 text-label-sm font-medium">
                                {feedbackMsg}
                            </div>
                        )}

                        {result ? (
                            /* Quiz Score Result View */
                            <div className="text-center py-12 space-y-6">
                                <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-surface-container-low border-2 border-outline-variant">
                                    <span className="text-[44px] font-extrabold text-primary">{result.score}</span>
                                </div>
                                
                                <div>
                                    <h2 className={`text-[24px] font-bold ${result.is_passed ? 'text-green-600' : 'text-error'}`}>
                                        {result.is_passed ? 'Selamat, Anda Lulus!' : 'Maaf, Anda Belum Lulus.'}
                                    </h2>
                                    <p className="text-body-md text-on-surface-variant mt-2">
                                        Jawaban Benar: <strong className="text-primary">{result.correct_count}</strong> dari {quiz.questions?.length} soal.
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 pt-4">
                                    <button 
                                        onClick={handleRetry}
                                        className="border-2 border-primary text-primary px-6 py-2.5 rounded-lg text-label-sm font-bold hover:bg-surface-container-low transition-colors"
                                    >
                                        Coba Lagi
                                    </button>
                                    <Link 
                                        to={`/dashboard/courses/${courseId}`}
                                        className="bg-primary text-on-primary hover:bg-primary-container px-6 py-2.5 rounded-lg text-label-sm font-bold hover:scale-95 transition-all inline-block shadow-sm"
                                    >
                                        Kembali ke Kelas
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* Quiz Questions Form */
                            <form onSubmit={handleSubmitQuiz} className="space-y-8">
                                {quiz.questions
                                    ?.sort((a, b) => a.sequence - b.sequence)
                                    .map((question, qIdx) => (
                                        <div key={question.id} className="space-y-4">
                                            <h4 className="text-body-lg font-bold text-primary">
                                                {qIdx + 1}. {question.question_text}
                                            </h4>

                                            <div className="space-y-2">
                                                {question.options?.map((option) => (
                                                    <label 
                                                        key={option.id}
                                                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                                                            answers[question.id] === option.id 
                                                                ? 'border-secondary bg-secondary-container/10' 
                                                                : 'border-outline-variant/35 hover:bg-surface-container-low/40'
                                                        }`}
                                                    >
                                                        <input 
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={option.id}
                                                            checked={answers[question.id] === option.id}
                                                            onChange={() => handleOptionChange(question.id, option.id)}
                                                            className="mt-1 accent-secondary"
                                                        />
                                                        <span className="text-body-md text-on-surface leading-relaxed">{option.option_text}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary text-on-primary hover:bg-primary-container h-[48px] rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-98 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="material-symbols-outlined animate-spin">sync</span>
                                    ) : (
                                        <>
                                            <span>Kirimkan Jawaban</span>
                                            <span className="material-symbols-outlined">send</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar Attempt History */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
                        <h3 className="text-headline-md font-headline-md text-primary mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">history</span>
                            Riwayat Percobaan
                        </h3>
                        {attempts.length === 0 ? (
                            <p className="text-body-md text-on-surface-variant/80">Belum ada percobaan pengerjaan untuk kuis ini.</p>
                        ) : (
                            <div className="space-y-3">
                                {attempts
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map((attempt, idx) => (
                                        <div 
                                            key={attempt.id} 
                                            className="p-4 rounded-lg border border-outline-variant/20 flex justify-between items-center bg-surface-container-lowest"
                                        >
                                            <div>
                                                <div className="text-label-sm font-bold text-primary">Percobaan #{attempts.length - idx}</div>
                                                <div className="text-[11px] text-on-surface-variant mt-0.5">
                                                    {new Date(attempt.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-body-md font-bold text-secondary">{attempt.score}%</div>
                                                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    attempt.is_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {attempt.is_passed ? 'Lulus' : 'Gagal'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuizView;
