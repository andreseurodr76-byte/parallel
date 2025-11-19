import React, { useState, useEffect } from 'react';
import PhaseDiscovery from './components/PhaseDiscovery';
import PhaseExploration from './components/PhaseExploration';
import PhaseChallenge from './components/PhaseChallenge';
import PhaseAssessment from './components/PhaseAssessment';
import ProgressBar from './components/ProgressBar';
import { Phase } from './types';
import { APP_TITLE } from './constants';
import { Shapes } from 'lucide-react';

const App: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.Discovery);
  const [completedPhases, setCompletedPhases] = useState<Phase[]>([]);

  const handlePhaseComplete = (phase: Phase) => {
    if (!completedPhases.includes(phase)) {
      setCompletedPhases([...completedPhases, phase]);
    }
    // Advance to next phase
    if (phase < Phase.Assessment) {
        setCurrentPhase(phase + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const restartApp = () => {
    setCurrentPhase(Phase.Discovery);
    setCompletedPhases([]);
    window.scrollTo(0, 0);
  };

  // Debug helper to skip phases (Shift + Click title)
  const debugSkip = (e: React.MouseEvent) => {
      if (e.shiftKey) {
          if(currentPhase < Phase.Assessment) setCurrentPhase(c => c + 1);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-brand-dark selection:bg-brand-blue selection:text-white">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="bg-brand-blue text-white p-2 rounded-lg shadow-lg rotate-3">
                <Shapes size={28} />
            </div>
            <h1 onClick={debugSkip} className="text-2xl md:text-3xl font-black tracking-tight text-brand-dark cursor-default">
                {APP_TITLE}
            </h1>
        </div>
      </header>

      <ProgressBar currentPhase={currentPhase} completedPhases={completedPhases} />

      <main className="flex-1 w-full max-w-5xl mx-auto py-8 px-4">
        <div className="bg-white/50 min-h-[60vh] rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-1">
            {currentPhase === Phase.Discovery && (
                <PhaseDiscovery onComplete={() => handlePhaseComplete(Phase.Discovery)} />
            )}
            
            {currentPhase === Phase.Exploration && (
                <PhaseExploration onComplete={() => handlePhaseComplete(Phase.Exploration)} />
            )}
            
            {currentPhase === Phase.Challenge && (
                <PhaseChallenge onComplete={() => handlePhaseComplete(Phase.Challenge)} />
            )}
            
            {currentPhase === Phase.Assessment && (
                <PhaseAssessment onRestart={restartApp} />
            )}
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Parallel Pals Learning</p>
      </footer>
    </div>
  );
};

export default App;