import React from 'react';
import { CheckCircle2, Lock, MapPin } from 'lucide-react';
import { Phase } from '../types';

interface Props {
  currentPhase: Phase;
  completedPhases: Phase[];
}

const ProgressBar: React.FC<Props> = ({ currentPhase, completedPhases }) => {
  const steps = [
    { id: Phase.Discovery, label: "Discover" },
    { id: Phase.Exploration, label: "Explore" },
    { id: Phase.Challenge, label: "Challenge" },
    { id: Phase.Assessment, label: "Quiz" },
  ];

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
            {/* Connection Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 hidden md:block"></div>

            {steps.map((step, idx) => {
                const isActive = currentPhase === step.id;
                const isCompleted = completedPhases.includes(step.id);
                const isLocked = !isActive && !isCompleted;

                let circleClass = "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ";
                if (isActive) circleClass += "bg-brand-blue border-brand-blue text-white scale-110 shadow-lg ring-4 ring-blue-100";
                else if (isCompleted) circleClass += "bg-brand-green border-brand-green text-white";
                else circleClass += "bg-white border-gray-300 text-gray-300";

                return (
                    <div key={step.id} className="flex flex-col items-center gap-1 bg-white px-2 md:px-4">
                        <div className={circleClass}>
                            {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={16} /> : <MapPin size={20}/>}
                        </div>
                        <span className={`text-xs md:text-sm font-bold ${isActive ? 'text-brand-blue' : isCompleted ? 'text-brand-green' : 'text-gray-400'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;