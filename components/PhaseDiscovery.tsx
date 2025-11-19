import React, { useState, useEffect } from 'react';
import Button from './Button';
import { ArrowRight, ArrowLeft, ExternalLink, XCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

// --- SVG Illustrations ---

const RailroadIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-green-200">
    {/* Ground */}
    <rect width="400" height="300" fill="#86efac" />
    <rect x="80" y="0" width="240" height="300" fill="#d6d3d1" />
    
    {/* Sleepers */}
    {[30, 90, 150, 210, 270].map(y => (
      <path key={y} d={`M80,${y} L320,${y}`} stroke="#78350f" strokeWidth="20" strokeLinecap="butt" />
    ))}
    
    {/* Rails */}
    <line x1="140" y1="0" x2="140" y2="300" stroke="#525252" strokeWidth="12" />
    <line x1="260" y1="0" x2="260" y2="300" stroke="#525252" strokeWidth="12" />
    
    {/* Label */}
    <text x="200" y="290" textAnchor="middle" fill="#000" opacity="0.5" fontSize="14" fontWeight="bold">TOP VIEW</text>
  </svg>
);

const LadderIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-blue-100 flex items-center justify-center">
    <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#wall)" />
    <rect x="0" y="250" width="400" height="50" fill="#f0f9ff" />
    
    {/* Ladder Group */}
    <g transform="translate(140, 20)">
        {/* Side Rails */}
        <rect x="0" y="0" width="15" height="260" rx="5" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        <rect x="105" y="0" width="15" height="260" rx="5" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        
        {/* Rungs */}
        {[40, 90, 140, 190, 240].map(y => (
            <rect key={y} x="15" y={y} width="90" height="10" rx="2" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
        ))}
    </g>
  </svg>
);

const NotebookIllustration = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full bg-gray-100">
      {/* Desk */}
      <rect width="400" height="300" fill="#e5e7eb" />
      
      {/* Paper */}
      <g transform="translate(80, 20)">
        <rect width="240" height="260" fill="white" stroke="#d1d5db" strokeWidth="1" rx="2" shadow="lg" />
        <defs>
            <filter id="shadow">
                <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.1"/>
            </filter>
        </defs>
        
        {/* Margin Line */}
        <line x1="40" y1="0" x2="40" y2="260" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        
        {/* Lines */}
        {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1="0" y1={40 + i * 22} x2="240" y2={40 + i * 22} stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        ))}
        
        {/* Holes */}
        {[40, 130, 220].map(y => (
            <circle key={y} cx="15" cy={y} r="6" fill="#e5e7eb" stroke="#d1d5db" />
        ))}
      </g>
  </svg>
);

const ZebraIllustration = () => (
    <svg viewBox="0 0 400 300" className="w-full h-full bg-gray-800">
        {/* Road */}
        <rect width="400" height="300" fill="#374151" />
        
        {/* Crossing Stripes */}
        <g transform="skewX(-20) translate(50, 0)">
            {[20, 70, 120, 170, 220, 270].map(y => (
                <rect key={y} x="50" y={y} width="300" height="30" fill="white" opacity="0.9" />
            ))}
        </g>
        
        {/* Curbs */}
        <rect x="0" y="0" width="40" height="300" fill="#10b981" />
        <rect x="360" y="0" width="40" height="300" fill="#10b981" />
    </svg>
);


const PhaseDiscovery: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  
  // Step 0: Gallery
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  const galleryItems = [
    { Component: RailroadIllustration, label: 'Train Tracks', description: 'The two rails always stay the same distance apart so the train fits.' },
    { Component: LadderIllustration, label: 'Ladder Rungs', description: 'Each step is parallel to the next one so you can climb up straight.' },
    { Component: NotebookIllustration, label: 'Notebook Lines', description: 'The blue lines help you write straight because they never touch.' },
    { Component: ZebraIllustration, label: 'Zebra Crossing', description: 'The white stripes are parallel rectangles on the road.' }
  ];

  // Step 1: Animation
  const [animState, setAnimState] = useState<'initial' | 'growing' | 'done'>('initial');

  // Step 2: Intersecting
  const [showIntersection, setShowIntersection] = useState(false);

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => setAnimState('growing'), 500);
      setTimeout(() => setAnimState('done'), 3500);
    }
  }, [step]);

  const CurrentImage = galleryItems[galleryIndex].Component;

  const renderGallery = () => (
    <div className="flex flex-col items-center space-y-6 w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-brand-blue">Do you see a pattern?</h2>
        <p className="text-xl text-gray-500">Use the arrows to look at these pictures.</p>
      </div>

      <div className="relative w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gray-50 group">
        <CurrentImage />
        
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 text-center border-t border-gray-100">
          <p className="text-2xl font-bold text-brand-dark">{galleryItems[galleryIndex].label}</p>
          <p className="text-gray-600 text-sm mt-1 md:text-base">{galleryItems[galleryIndex].description}</p>
        </div>
        
        {/* Navigation Buttons */}
        <button 
          onClick={() => setGalleryIndex((p) => (p === 0 ? galleryItems.length - 1 : p - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-brand-blue hover:text-white text-brand-dark transition-all hover:scale-110"
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => setGalleryIndex((p) => (p + 1) % galleryItems.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-brand-blue hover:text-white text-brand-dark transition-all hover:scale-110"
        >
          <ArrowRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
            {galleryItems.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all ${idx === galleryIndex ? 'bg-brand-blue w-6' : 'bg-black/20'}`}
                />
            ))}
        </div>
      </div>

      <Button onClick={() => setStep(1)} size="lg" className="mt-4 animate-bounce-slight">
        What are they? <ArrowRight />
      </Button>
    </div>
  );

  const renderAnimation = () => (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-brand-blue mb-4 text-center">Parallel Lines Never Meet!</h2>
      <p className="text-gray-600 mb-8 text-center max-w-lg">Watch what happens when we make these lines longer. Do they ever touch?</p>
      
      <div className="relative w-full h-64 bg-white rounded-2xl shadow-inner border-2 border-gray-100 overflow-hidden flex flex-col justify-center items-center gap-12 p-8">
        {/* Line 1 */}
        <div className="w-full flex justify-center">
            <div className={`h-4 bg-brand-blue rounded-full transition-all duration-[3000ms] ease-linear shadow-sm ${animState === 'initial' ? 'w-16' : 'w-[120%]'}`}></div>
        </div>
        {/* Line 2 */}
        <div className="w-full flex justify-center">
            <div className={`h-4 bg-brand-blue rounded-full transition-all duration-[3000ms] ease-linear shadow-sm ${animState === 'initial' ? 'w-16' : 'w-[120%]'}`}></div>
        </div>

        {animState === 'done' && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] animate-fade-in">
                <div className="bg-white p-6 rounded-2xl shadow-2xl text-center border-4 border-brand-yellow transform animate-scale-in">
                    <div className="inline-block p-3 bg-brand-yellow/20 rounded-full mb-2 text-brand-yellow">
                        <ExternalLink size={32}/>
                    </div>
                    <p className="text-2xl font-bold text-brand-dark">They go on forever!</p>
                </div>
            </div>
        )}
      </div>

      <div className="mt-8 h-20 flex items-center justify-center">
          {animState === 'done' && (
               <Button onClick={() => setStep(2)} size="lg" variant="success">
               See what is NOT parallel <ArrowRight />
             </Button>
          )}
      </div>
    </div>
  );

  const renderIntersection = () => (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
       <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">Parallel vs Not Parallel</h2>
       
       <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* Parallel Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-brand-green flex flex-col items-center">
                <div className="h-40 w-full flex flex-col justify-center gap-8 px-8 bg-gray-50 rounded-xl mb-4">
                    <div className="w-full h-3 bg-brand-green rounded-full shadow-sm"></div>
                    <div className="w-full h-3 bg-brand-green rounded-full shadow-sm"></div>
                </div>
                <div className="flex items-center gap-2 text-brand-green font-bold text-xl">
                    <CheckCircle2 /> PARALLEL
                </div>
                <p className="text-center text-gray-600 mt-2 text-sm">Never touch, like train tracks.</p>
            </div>

             {/* Intersecting Card */}
             <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-brand-red flex flex-col items-center">
                <div className="h-40 w-full relative flex justify-center items-center bg-gray-50 rounded-xl mb-4 overflow-hidden">
                   <div className={`absolute w-3/4 h-3 bg-brand-red rounded-full shadow-sm transition-transform duration-1000 ${showIntersection ? 'rotate-[20deg]' : 'rotate-0 translate-y-[-20px]'}`}></div>
                   <div className={`absolute w-3/4 h-3 bg-brand-red rounded-full shadow-sm transition-transform duration-1000 ${showIntersection ? '-rotate-[20deg]' : 'rotate-0 translate-y-[20px]'}`}></div>
                </div>
                <button 
                    onClick={() => setShowIntersection(!showIntersection)}
                    className="flex items-center gap-2 text-brand-red font-bold text-xl hover:scale-105 transition-transform"
                >
                    {showIntersection ? <XCircle /> : <ExternalLink className="rotate-90"/>} 
                    {showIntersection ? "INTERSECTING" : "Click to Cross!"}
                </button>
                <p className="text-center text-gray-600 mt-2 text-sm">They meet at a point!</p>
            </div>
       </div>

       <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mt-8 max-w-2xl text-center shadow-sm">
            <h3 className="font-bold text-brand-blue text-lg mb-2 uppercase tracking-wider">Definition</h3>
            <p className="text-xl md:text-2xl text-brand-dark font-medium">
                "Parallel lines go in the same direction and <span className="text-brand-red font-bold">never touch</span>."
            </p>
       </div>

       <div className="mt-8">
           <Button onClick={onComplete} size="lg" variant="primary" className="shadow-xl shadow-brand-blue/20">
               I Understand! Let's Explore <ArrowRight />
           </Button>
       </div>
    </div>
  );

  return (
    <div className="p-2 md:p-8">
      {step === 0 && renderGallery()}
      {step === 1 && renderAnimation()}
      {step === 2 && renderIntersection()}
    </div>
  );
};

export default PhaseDiscovery;