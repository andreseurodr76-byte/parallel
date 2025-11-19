import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { ArrowRight, RefreshCw, Ruler, Pencil } from 'lucide-react';
import { calculateAngle, isParallel } from '../constants';

interface Props {
  onComplete: () => void;
}

const PhaseExploration: React.FC<Props> = ({ onComplete }) => {
  const [activity, setActivity] = useState(0); // 0: Rotate, 1: Distance, 2: Draw

  // --- Rotation Tool State ---
  const [rotation, setRotation] = useState(15); // Start NOT parallel
  const isAligned = rotation === 0;

  // --- Distance Tool State ---
  const [showDistance, setShowDistance] = useState(false);

  // --- Drawing Tool State ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [currentPos, setCurrentPos] = useState<{x: number, y: number} | null>(null);
  const [drawResult, setDrawResult] = useState<'none' | 'success' | 'fail'>('none');
  
  // Fixed line for drawing challenge (random angle between -30 and 30)
  const [targetAngle] = useState(() => Math.random() * 60 - 30); 

  // --- Handlers ---

  const handleDrawingStart = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsDrawing(true);
    setStartPos({x, y});
    setCurrentPos({x, y});
    setDrawResult('none');
  };

  const handleDrawingMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setCurrentPos({x, y});
  };

  const handleDrawingEnd = () => {
    if (!isDrawing || !startPos || !currentPos) return;
    setIsDrawing(false);

    // Check length to avoid accidental clicks
    const dist = Math.sqrt(Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2));
    if (dist < 20) {
        setStartPos(null);
        setCurrentPos(null);
        return; 
    }

    // Calculate angle
    const drawnAngle = calculateAngle(startPos, currentPos);
    // Target angle logic: The fixed line is drawn with 'targetAngle'.
    // Parallel means drawnAngle is close to targetAngle OR targetAngle + 180
    const success = isParallel(drawnAngle, targetAngle, 6); // slightly looser tolerance for kids
    setDrawResult(success ? 'success' : 'fail');
  };

  // Canvas Render Loop
  useEffect(() => {
    if (activity !== 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup canvas size for retina
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw Grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<rect.width; i+=30) { ctx.moveTo(i, 0); ctx.lineTo(i, rect.height); }
    for(let i=0; i<rect.height; i+=30) { ctx.moveTo(0, i); ctx.lineTo(rect.width, i); }
    ctx.stroke();

    // Draw Target Line
    const cx = rect.width / 2;
    const cy = rect.height / 3;
    const len = 150;
    const rad = targetAngle * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(rad) * len/2, cy - Math.sin(rad) * len/2);
    ctx.lineTo(cx + Math.cos(rad) * len/2, cy + Math.sin(rad) * len/2);
    ctx.strokeStyle = '#3B82F6'; // Blue
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw User Line
    if (startPos && currentPos) {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.strokeStyle = drawResult === 'success' ? '#10B981' : drawResult === 'fail' ? '#EF4444' : '#FBBF24';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

  }, [activity, startPos, currentPos, drawResult, targetAngle]);


  // --- Renders ---

  const renderRotationTool = () => (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Make them Parallel!</h2>
        <p className="text-gray-600 mb-6">Use the slider to turn the red line until it matches the blue one.</p>
        
        <div className="relative w-full h-64 bg-white border-2 border-gray-200 rounded-2xl shadow-sm flex items-center justify-center overflow-hidden">
            {/* Fixed Line */}
            <div className="absolute w-3/4 h-4 bg-brand-blue rounded-full top-1/3"></div>
            
            {/* Rotating Line */}
            <div 
                className={`absolute w-3/4 h-4 rounded-full top-2/3 transition-colors duration-300 ${isAligned ? 'bg-brand-green shadow-[0_0_15px_rgba(16,185,129,0.6)]' : 'bg-brand-red'}`}
                style={{ transform: `rotate(${rotation}deg)` }}
            ></div>

            {isAligned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl font-extrabold text-brand-green bg-white/90 px-4 py-2 rounded-xl border-2 border-brand-green animate-bounce">PARALLEL!</span>
                </div>
            )}
        </div>

        <div className="w-full mt-8 px-8">
            <input 
                type="range" 
                min="-45" 
                max="45" 
                value={rotation} 
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue hover:accent-brand-dark"
            />
            <div className="flex justify-between text-gray-400 mt-2 text-sm font-bold">
                <span>Tilt Left</span>
                <span>Straight</span>
                <span>Tilt Right</span>
            </div>
        </div>

        <div className="mt-8">
             {isAligned && (
                 <Button onClick={() => setActivity(1)} size="lg" variant="primary" className="animate-pulse">
                     Next Activity <ArrowRight />
                 </Button>
             )}
        </div>
    </div>
  );

  const renderDistanceTool = () => (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">The Distance Rule</h2>
        <p className="text-gray-600 mb-6">Click the button to measure the distance between the lines.</p>
        
        <div className="relative w-full h-64 bg-white border-2 border-gray-200 rounded-2xl shadow-sm flex flex-col justify-center items-center gap-16 p-8 overflow-hidden">
             <div className="w-full h-3 bg-brand-blue rounded-full z-10"></div>
             
             {/* Measurement Lines */}
             <div className="absolute inset-0 flex justify-evenly items-center px-12 pointer-events-none">
                {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-1 bg-brand-dark/30 flex items-center justify-center transition-all duration-1000 ${showDistance ? 'h-16 opacity-100' : 'h-0 opacity-0'}`}>
                        {showDistance && <span className="bg-brand-yellow text-brand-dark text-xs font-bold px-1 rounded absolute">10cm</span>}
                    </div>
                ))}
             </div>

             <div className="w-full h-3 bg-brand-blue rounded-full z-10"></div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
            <Button onClick={() => setShowDistance(!showDistance)} variant="secondary">
                <Ruler className="mr-2"/> {showDistance ? "Hide Measures" : "Check Distance"}
            </Button>

            {showDistance && (
                <div className="bg-brand-green/10 text-brand-green p-4 rounded-xl text-center animate-fade-in">
                    <p className="font-bold text-lg">It's always the same!</p>
                    <p>Parallel lines stay the same distance apart.</p>
                </div>
            )}

            {showDistance && (
                 <Button onClick={() => setActivity(2)} size="lg" variant="primary" className="mt-2">
                     Next: Draw it yourself! <ArrowRight />
                 </Button>
            )}
        </div>
    </div>
  );

  const renderDrawingTool = () => (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-dark mb-2">Your Turn to Draw!</h2>
        <p className="text-gray-600 mb-4 text-center">Draw a line parallel to the blue one.<br/>Click and drag on the grid.</p>
        
        <div className="relative w-full h-80 bg-white rounded-2xl shadow-lg border-4 border-brand-light overflow-hidden touch-none">
            <canvas 
                ref={canvasRef}
                className="w-full h-full cursor-crosshair"
                onMouseDown={handleDrawingStart}
                onMouseMove={handleDrawingMove}
                onMouseUp={handleDrawingEnd}
                onMouseLeave={handleDrawingEnd}
                onTouchStart={handleDrawingStart}
                onTouchMove={handleDrawingMove}
                onTouchEnd={handleDrawingEnd}
            />
            
            {drawResult !== 'none' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                    {drawResult === 'success' ? (
                        <span className="bg-brand-green text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">Great Job! That's parallel!</span>
                    ) : (
                        <span className="bg-brand-red text-white px-4 py-2 rounded-full font-bold shadow-lg">Not quite. Try again!</span>
                    )}
                </div>
            )}

            <button 
                onClick={() => { setStartPos(null); setCurrentPos(null); setDrawResult('none'); }}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 text-gray-500"
                title="Clear"
            >
                <RefreshCw size={20} />
            </button>
        </div>

        <div className="mt-8">
             {drawResult === 'success' && (
                 <Button onClick={onComplete} size="lg" variant="primary" className="animate-pulse">
                     I'm ready for Challenges! <ArrowRight />
                 </Button>
             )}
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 animate-fade-in">
        {activity === 0 && renderRotationTool()}
        {activity === 1 && renderDistanceTool()}
        {activity === 2 && renderDrawingTool()}
    </div>
  );
};

export default PhaseExploration;
