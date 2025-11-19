import React, { useState } from 'react';
import Button from './Button';
import { ArrowRight, Check, Search, HelpCircle, RefreshCcw } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const PhaseChallenge: React.FC<Props> = ({ onComplete }) => {
  const [subPhase, setSubPhase] = useState(0); // 0: Shapes, 1: Hunt

  // --- Shape Logic ---
  const [currentShape, setCurrentShape] = useState(0);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [shapeFeedback, setShapeFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const shapes = [
    {
      name: 'Rectangle',
      instruction: "Find the TOP and BOTTOM parallel sides.",
      viewBox: "0 0 300 200",
      // A simple rectangle centered
      sides: [
        { id: 0, d: "M50,40 L250,40" },   // Top
        { id: 1, d: "M250,40 L250,160" }, // Right
        { id: 2, d: "M250,160 L50,160" }, // Bottom
        { id: 3, d: "M50,160 L50,40" }    // Left
      ],
      parallelPairs: [[0, 2], [1, 3]] 
    },
    {
      name: 'Trapezoid',
      instruction: "This shape has only ONE pair of parallel sides. Find them!",
      viewBox: "0 0 300 200",
      sides: [
        { id: 0, d: "M80,40 L220,40" },   // Top
        { id: 1, d: "M220,40 L260,160" }, // Right (slant)
        { id: 2, d: "M260,160 L40,160" }, // Bottom
        { id: 3, d: "M40,160 L80,40" }    // Left (slant)
      ],
      parallelPairs: [[0, 2]]
    },
    {
      name: 'Hexagon',
      instruction: "Find the sides that are parallel to each other.",
      viewBox: "0 0 300 200",
      sides: [
        { id: 0, d: "M80,40 L220,40" },   // Top
        { id: 1, d: "M220,40 L280,100" }, // Top-Right
        { id: 2, d: "M280,100 L220,160" },// Bot-Right
        { id: 3, d: "M220,160 L80,160" }, // Bottom
        { id: 4, d: "M80,160 L20,100" },  // Bot-Left
        { id: 5, d: "M20,100 L80,40" }    // Top-Left
      ],
      parallelPairs: [[0, 3], [1, 4], [2, 5]]
    }
  ];

  const handleSideClick = (id: number) => {
    if (shapeFeedback === 'correct') return;
    
    setSelectedSides(prev => {
        // If already selected, deselect
        if (prev.includes(id)) return prev.filter(s => s !== id);
        // If 2 selected, reset and select new one
        if (prev.length >= 2) return [id];
        // Add to selection
        return [...prev, id];
    });
    setShapeFeedback('none');
  };

  const checkShapeAnswer = () => {
    if (selectedSides.length !== 2) return;
    
    const shape = shapes[currentShape];
    const isPair = shape.parallelPairs.some(pair => 
        (pair[0] === selectedSides[0] && pair[1] === selectedSides[1]) ||
        (pair[0] === selectedSides[1] && pair[1] === selectedSides[0])
    );

    if (isPair) {
        setShapeFeedback('correct');
    } else {
        setShapeFeedback('wrong');
        setTimeout(() => {
             setShapeFeedback('none');
             setSelectedSides([]);
        }, 1500);
    }
  };

  const nextShape = () => {
      if (currentShape < shapes.length - 1) {
          setCurrentShape(c => c + 1);
          setSelectedSides([]);
          setShapeFeedback('none');
      } else {
          setSubPhase(1);
      }
  };

  // --- Hunt Logic ---
  const [foundItems, setFoundItems] = useState<number[]>([]);
  const totalItems = 3; // Blinds, Rug, Bookshelf
  
  const handleHuntClick = (id: number) => {
    if (!foundItems.includes(id)) {
        setFoundItems(prev => [...prev, id]);
    }
  };

  // --- Renders ---

  const renderShapeExplorer = () => {
    const shape = shapes[currentShape];
    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark flex items-center justify-center gap-2">
                    <Search className="text-brand-blue"/> Shape Detective
                </h2>
                <p className="text-lg text-gray-700 mt-2">{shape.instruction}</p>
                <p className="text-sm text-gray-500 mt-1">Click on <span className="font-bold text-brand-blue">2 lines</span> to select them.</p>
            </div>
            
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center">
                <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-500">
                    Selected: {selectedSides.length}/2
                </div>

                <svg viewBox={shape.viewBox} className="w-full h-64 overflow-visible">
                    {/* Base Shape for Fill */}
                    <path 
                        d={shape.sides.map((s, i) => (i === 0 ? `M${s.d.split('M')[1].split(' ')[0]} ` : '') + s.d.split('L')[1]).join(' ') + 'Z'} 
                        fill="#eff6ff" 
                        stroke="none"
                    />
                    
                    {/* Interactive Sides */}
                    {shape.sides.map((side) => {
                        const isSelected = selectedSides.includes(side.id);
                        return (
                            <g key={side.id} onClick={() => handleSideClick(side.id)} className="cursor-pointer group">
                                {/* Hit Area (Thick invisible line) */}
                                <path d={side.d} stroke="transparent" strokeWidth="25" />
                                
                                {/* Visible Line */}
                                <path 
                                    d={side.d} 
                                    stroke={isSelected ? '#3B82F6' : '#94a3b8'} 
                                    strokeWidth={isSelected ? "8" : "4"} 
                                    strokeLinecap="round"
                                    className={`transition-all duration-300 ${!isSelected && 'group-hover:stroke-brand-blue group-hover:stroke-[6]'}`}
                                />
                                
                                {/* Selection Indicator */}
                                {isSelected && (
                                    // Calculate midpoint for indicator
                                    <circle 
                                        cx={(parseFloat(side.d.split(',')[0].slice(1)) + parseFloat(side.d.split(' ')[1].split(',')[0])) / 2}
                                        cy={(parseFloat(side.d.split(',')[1].split(' ')[0]) + parseFloat(side.d.split(',')[2])) / 2}
                                        r="6"
                                        fill="#3B82F6"
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>

                {shapeFeedback === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px] rounded-3xl animate-fade-in">
                        <div className="bg-brand-green text-white px-6 py-3 rounded-2xl font-bold text-xl shadow-xl flex items-center gap-3 transform animate-bounce-slight">
                            <Check size={28} strokeWidth={4} /> Correct!
                        </div>
                    </div>
                )}

                 {shapeFeedback === 'wrong' && (
                    <div className="absolute bottom-6 bg-brand-red text-white px-6 py-2 rounded-full font-bold shadow-lg animate-shake">
                        Oops! Those lines are not parallel.
                    </div>
                )}
            </div>

            <div className="mt-8 h-16 flex items-center justify-center w-full">
                {shapeFeedback === 'correct' ? (
                     <Button onClick={nextShape} size="lg" variant="success" className="animate-pulse">
                         {currentShape < shapes.length - 1 ? "Next Shape" : "Start the Hunt!"} <ArrowRight />
                     </Button>
                ) : (
                    <Button 
                        onClick={checkShapeAnswer} 
                        disabled={selectedSides.length !== 2}
                        variant={selectedSides.length === 2 ? 'primary' : 'secondary'}
                        size="lg"
                    >
                        Check Answer
                    </Button>
                )}
            </div>
            
            {/* Progress Dots */}
            <div className="flex gap-2 mt-4">
                {shapes.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentShape ? 'bg-brand-blue' : 'bg-gray-300'}`} />
                ))}
            </div>
        </div>
    );
  };

  const renderHunt = () => (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Parallel Hunt</h2>
            <p className="text-gray-600">There are <span className="font-bold text-brand-blue">3 items</span> with parallel lines in this room.</p> 
            <p className="text-sm text-brand-green font-bold animate-pulse mt-1">Click on them when you find them!</p>
        </div>
        
        <div className="relative w-full aspect-video bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
            {/* Room Illustration */}
            <svg viewBox="0 0 800 500" className="w-full h-full">
                <defs>
                    <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#fdfbf7" />
                        <stop offset="1" stopColor="#f3f4f6" />
                    </linearGradient>
                    <pattern id="floorPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                         <path d="M0,0 L40,0 L40,40 L0,40 Z" fill="#e5e7eb" opacity="0.3"/>
                         <path d="M0,0 L40,20" stroke="white" opacity="0.5"/>
                    </pattern>
                </defs>

                {/* Room Background */}
                <rect width="800" height="400" fill="url(#wallGradient)" />
                <rect y="400" width="800" height="100" fill="#d1d5db" />
                <rect y="400" width="800" height="100" fill="url(#floorPattern)" opacity="0.5" />

                {/* ITEM 1: Window with Blinds */}
                <g 
                    onClick={() => handleHuntClick(1)} 
                    className={`cursor-pointer group transition-all duration-500 ${foundItems.includes(1) ? 'opacity-100' : 'hover:translate-y-[-2px]'}`}
                >
                    {/* Window Frame */}
                    <rect x="100" y="80" width="200" height="220" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="6" rx="4" />
                    {/* Blinds - CLEARLY PARALLEL */}
                    {Array.from({length: 8}).map((_, i) => (
                        <rect key={i} x="110" y={100 + i*22} width="180" height="12" rx="2" fill="white" stroke="#9ca3af" strokeWidth="1" 
                              className={foundItems.includes(1) ? 'fill-green-100 stroke-green-500' : 'group-hover:fill-blue-50'} />
                    ))}
                    {/* Checkmark */}
                    {foundItems.includes(1) && (
                        <g transform="translate(280, 60)">
                            <circle r="20" fill="#10B981" />
                            <path d="M-8,0 L-2,6 L8,-6" stroke="white" strokeWidth="4" fill="none" />
                        </g>
                    )}
                </g>

                {/* ITEM 2: Bookshelf */}
                <g 
                    onClick={() => handleHuntClick(2)} 
                    className={`cursor-pointer group transition-all duration-500 ${foundItems.includes(2) ? 'opacity-100' : 'hover:translate-y-[-2px]'}`}
                >
                    {/* Shelf Frame */}
                    <rect x="600" y="150" width="140" height="250" fill="#78350f" rx="4" />
                    <rect x="610" y="160" width="120" height="230" fill="#451a03" />
                    
                    {/* Shelves - PARALLEL */}
                    {[220, 280, 340].map((y, i) => (
                        <g key={y}>
                            <rect x="615" y={y} width="110" height="8" fill="#a8a29e" 
                                  className={foundItems.includes(2) ? 'fill-green-200' : 'group-hover:fill-orange-200'} />
                             {/* Books */}
                            <rect x="625" y={y-30} width="10" height="30" fill="#ef4444" />
                            <rect x="638" y={y-35} width="12" height="35" fill="#3b82f6" />
                            <rect x="652" y={y-25} width="8" height="25" fill="#10b981" />
                        </g>
                    ))}
                    
                    {foundItems.includes(2) && (
                        <g transform="translate(730, 140)">
                            <circle r="20" fill="#10B981" />
                            <path d="M-8,0 L-2,6 L8,-6" stroke="white" strokeWidth="4" fill="none" />
                        </g>
                    )}
                </g>

                {/* ITEM 3: Striped Rug */}
                {/* Fixed erratic movement by separating SVG transform from CSS transform */}
                <g transform="translate(350, 420) skewX(-40)">
                    <g 
                        onClick={() => handleHuntClick(3)} 
                        className={`cursor-pointer group transition-all duration-500 ${foundItems.includes(3) ? 'opacity-100' : 'hover:translate-y-[-2px]'}`}
                    >
                        <rect width="200" height="60" fill="#fca5a5" rx="4" stroke="#991b1b" strokeWidth="2" />
                        {/* Stripes */}
                        {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map(x => (
                            <rect key={x} x={x} y="0" width="10" height="60" fill="#b91c1c" opacity="0.6"
                                className={foundItems.includes(3) ? 'fill-green-700' : ''} />
                        ))}
                    </g>
                </g>
                
                {foundItems.includes(3) && (
                    <g transform="translate(450, 450)">
                        <circle r="20" fill="#10B981" />
                        <path d="M-8,0 L-2,6 L8,-6" stroke="white" strokeWidth="4" fill="none" />
                    </g>
                )}
            </svg>
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl font-bold text-xl shadow-lg border border-gray-200 text-brand-blue">
                    Found: {foundItems.length} / {totalItems}
                </div>
            </div>
        </div>

        <div className="mt-8">
             {foundItems.length === totalItems ? (
                 <Button onClick={onComplete} size="lg" variant="primary" className="animate-pulse shadow-xl shadow-brand-blue/20">
                     Take the Quiz! <ArrowRight />
                 </Button>
             ) : (
                 <div className="text-gray-400 italic text-sm flex items-center gap-2">
                     <HelpCircle size={16} /> Hint: Look for things with straight lines!
                 </div>
             )}
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
        {subPhase === 0 && renderShapeExplorer()}
        {subPhase === 1 && renderHunt()}
    </div>
  );
};

export default PhaseChallenge;