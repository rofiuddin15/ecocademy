import React, { useState, useEffect } from 'react';

const QuizModal = ({ isOpen, onClose, onSave, moduleTitle, initialData }) => {
    const [quizData, setQuizData] = useState({
        title: '',
        instructions: '',
        questions: [
            {
                question_text: '',
                options: [
                    { option_text: '', is_correct: true },
                    { option_text: '', is_correct: false },
                    { option_text: '', is_correct: false },
                    { option_text: '', is_correct: false },
                ]
            }
        ]
    });

    useEffect(() => {
        if (initialData) {
            setQuizData({
                title: initialData.title || '',
                instructions: initialData.instructions || '',
                questions: initialData.questions && initialData.questions.length > 0 
                    ? initialData.questions.map(q => ({
                        id: q.id, // preserve id for updating
                        question_text: q.question_text || '',
                        options: (q.options && q.options.length > 0) ? q.options.map(opt => ({
                            id: opt.id, // preserve id for updating
                            option_text: opt.option_text || '',
                            is_correct: !!opt.is_correct
                        })) : [
                            { option_text: '', is_correct: true },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                        ]
                    }))
                    : [
                        {
                            question_text: '',
                            options: [
                                { option_text: '', is_correct: true },
                                { option_text: '', is_correct: false },
                                { option_text: '', is_correct: false },
                                { option_text: '', is_correct: false },
                            ]
                        }
                    ]
            });
        } else {
            setQuizData({
                title: '',
                instructions: '',
                questions: [
                    {
                        question_text: '',
                        options: [
                            { option_text: '', is_correct: true },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                            { option_text: '', is_correct: false },
                        ]
                    }
                ]
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleQuizChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (qIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[qIndex].question_text = value;
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[qIndex].options[optIndex].option_text = value;
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleCorrectChange = (qIndex, optIndex) => {
        const updatedQuestions = [...quizData.questions];
        // Reset all options to false, then set the selected one to true
        updatedQuestions[qIndex].options.forEach((opt, idx) => {
            opt.is_correct = (idx === optIndex);
        });
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const addQuestion = () => {
        setQuizData({
            ...quizData,
            questions: [
                ...quizData.questions,
                {
                    question_text: '',
                    options: [
                        { option_text: '', is_correct: true },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                    ]
                }
            ]
        });
    };

    const removeQuestion = (qIndex) => {
        const updatedQuestions = quizData.questions.filter((_, idx) => idx !== qIndex);
        setQuizData({ ...quizData, questions: updatedQuestions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (quizData.questions.length === 0) {
            alert('Please add at least one question.');
            return;
        }

        let isValid = true;
        quizData.questions.forEach((q, idx) => {
            if (!q.question_text) isValid = false;
            q.options.forEach(opt => {
                if (!opt.option_text) isValid = false;
            });
            if (!q.options.some(opt => opt.is_correct)) isValid = false;
        });

        if (!isValid) {
            alert('Please fill out all question texts and option texts, and ensure every question has a correct answer.');
            return;
        }

        onSave(quizData);
        // Reset
        setQuizData({
            title: '',
            instructions: '',
            questions: [
                {
                    question_text: '',
                    options: [
                        { option_text: '', is_correct: true },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                        { option_text: '', is_correct: false },
                    ]
                }
            ]
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-4xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <div>
                        <h3 className="font-headline-sm text-primary">{initialData ? 'Edit Interactive Quiz' : 'Create Interactive Quiz'}</h3>
                        <p className="text-on-surface-variant font-label-sm">For Module: {moduleTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors p-1">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 bg-[#f4fafd]">
                    <form id="quizForm" onSubmit={handleSubmit} className="space-y-8">
                        {/* Quiz Header Info */}
                        <div className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm space-y-4">
                            <h4 className="font-label-lg text-primary border-b border-outline-variant pb-2">Quiz Details</h4>
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Quiz Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={quizData.title} 
                                    onChange={handleQuizChange} 
                                    required
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all"
                                    placeholder="e.g., Final Evaluation: Circular Economy"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-label-md text-on-surface">Instructions (Optional)</label>
                                <textarea 
                                    name="instructions" 
                                    value={quizData.instructions} 
                                    onChange={handleQuizChange} 
                                    rows="2"
                                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary transition-all resize-none"
                                    placeholder="e.g., Please select the most appropriate answer. Passing score is 70%."
                                />
                            </div>
                        </div>

                        {/* Questions Loop */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-headline-sm text-on-surface">Questions</h4>
                                <span className="text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">{quizData.questions.length} Total</span>
                            </div>

                            {quizData.questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white p-6 rounded-lg border border-outline-variant shadow-sm relative group">
                                    {quizData.questions.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeQuestion(qIndex)}
                                            className="absolute top-4 right-4 text-outline-variant hover:text-error transition-colors"
                                            title="Remove Question"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold shrink-0">
                                            {qIndex + 1}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="block font-label-md text-on-surface">Question Text</label>
                                            <textarea 
                                                value={q.question_text} 
                                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)} 
                                                required
                                                rows="2"
                                                className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-tertiary transition-all resize-none"
                                                placeholder="Enter question here..."
                                            />
                                        </div>
                                    </div>

                                    {/* Options Loop */}
                                    <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {q.options.map((opt, optIndex) => (
                                            <div key={optIndex} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${opt.is_correct ? 'border-tertiary bg-tertiary/5' : 'border-outline-variant bg-surface-container-lowest'}`}>
                                                <input 
                                                    type="radio" 
                                                    name={`correct_answer_${qIndex}`} 
                                                    checked={opt.is_correct}
                                                    onChange={() => handleCorrectChange(qIndex, optIndex)}
                                                    className="w-4 h-4 text-tertiary focus:ring-tertiary"
                                                    title="Mark as correct answer"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-bold w-6 text-on-surface-variant">
                                                            {String.fromCharCode(65 + optIndex)}.
                                                        </span>
                                                        <input 
                                                            type="text"
                                                            value={opt.option_text}
                                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                                            required
                                                            placeholder={`Option ${optIndex + 1}`}
                                                            className="flex-1 bg-transparent focus:outline-none text-sm w-full"
                                                        />
                                                    </div>
                                                </div>
                                                {opt.is_correct && (
                                                    <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <button 
                                type="button" 
                                onClick={addQuestion}
                                className="w-full py-4 border-2 border-dashed border-tertiary/40 rounded-lg text-tertiary hover:bg-tertiary/5 transition-colors font-label-md flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                Add Another Question
                            </button>
                        </div>

                    </form>
                </div>
                
                <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-label-md text-on-surface-variant hover:bg-outline-variant/20 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="quizForm" className="bg-tertiary text-on-tertiary px-6 py-2.5 rounded-lg font-label-md hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
