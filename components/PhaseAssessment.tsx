import React, { useState } from 'react';
import Button from './Button';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

const PhaseAssessment: React.FC<Props> = ({ onRestart }) => {
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQ = QUIZ_QUESTIONS[qIndex];

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    if (optionIndex === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const getScoreMessage = () => {
    const percent = (score / QUIZ_QUESTIONS.length) * 100;
    if (percent >= 90) return { title: "Parallel Expert!", color: "text-brand-blue" };
    if (percent >= 70) return { title: "Great Job!", color: "text-brand-green" };
    if (percent >= 50) return { title: "Good Effort!", color: "text-brand-yellow" };
    return { title: "Keep Practicing!", color: "text-gray-600" };
  };

  if (quizComplete) {
    const msg = getScoreMessage();
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-8 text-center animate-fade-in">
        <div className="mb-6 text-brand-yellow animate-bounce">
          <Award size={80} />
        </div>
        <h2 className={`text-4xl font-bold mb-2 ${msg.color}`}>{msg.title}</h2>
        <p className="text-2xl text-gray-600 mb-8">You got {score} out of {QUIZ_QUESTIONS.length} correct!</p>
        
        <Button onClick={onRestart} size="lg" variant="primary">
          <RotateCcw className="mr-2"/> Start Lesson Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-0 animate-fade-in">
      <div className="mb-6 flex justify-between items-center text-gray-500 font-bold">
        <span>Question {qIndex + 1} of {QUIZ_QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded-full mb-8 overflow-hidden">
        <div 
            className="bg-brand-blue h-full transition-all duration-500"
            style={{ width: `${((qIndex) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-b-4 border-brand-blue/20">
        <h2 className="text-2xl font-bold text-brand-dark mb-6">{currentQ.text}</h2>

        <div className="grid gap-4">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "bg-gray-50 border-2 border-gray-200 hover:border-brand-blue text-left p-4 rounded-xl transition-all font-medium text-lg";
            
            if (showFeedback) {
              if (idx === currentQ.correctIndex) btnClass = "bg-green-100 border-brand-green text-brand-green font-bold";
              else if (idx === selectedOption) btnClass = "bg-red-100 border-brand-red text-brand-red";
              else btnClass = "bg-gray-50 border-gray-200 opacity-50";
            }

            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleAnswer(idx)}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    {opt}
                    {showFeedback && idx === currentQ.correctIndex && <CheckCircle />}
                    {showFeedback && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle />}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
             <p className={`text-lg mb-4 ${selectedOption === currentQ.correctIndex ? 'text-brand-green' : 'text-brand-red'}`}>
                <span className="font-bold">{selectedOption === currentQ.correctIndex ? 'Correct!' : 'Not quite.'}</span> {currentQ.explanation}
             </p>
             <div className="flex justify-end">
                <Button onClick={nextQuestion} variant="primary">
                  Next Question
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhaseAssessment;