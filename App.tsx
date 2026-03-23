import React, { useState } from 'react';
import { ELEMENTS, GROUP_COLORS } from './constants';
import { CognitiveElement, ElementGroup } from './types';
import ElementTile from './components/ElementTile';
import ReactionChamber from './components/ReactionChamber';
import ElementInspector from './components/ElementInspector';
import { Database, FlaskConical, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  // History State
  const [history, setHistory] = useState<CognitiveElement[][]>([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<CognitiveElement | null>(null);
  
  const selectedElements = history[currentStep];

  const handleSelectionChange = (newElements: CognitiveElement[]) => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const redo = () => {
    if (currentStep < history.length - 1) setCurrentStep(currentStep + 1);
  };

  const toggleElement = (element: CognitiveElement) => {
    const exists = selectedElements.find(e => e.symbol === element.symbol);
    if (exists) {
      handleSelectionChange(selectedElements.filter(e => e.symbol !== element.symbol));
    } else {
      if (selectedElements.length < 4) {
        handleSelectionChange([...selectedElements, element]);
      }
    }
  };

  const setElements = (elements: CognitiveElement[]) => {
    handleSelectionChange(elements);
  };

  const clearSelection = () => {
    handleSelectionChange([]);
  };

  // Affinity Logic
  const getElementState = (element: CognitiveElement) => {
    const isSelected = !!selectedElements.find(e => e.symbol === element.symbol);
    
    // Default state
    let isRelated = false;
    let isDimmed = false;

    if (hoveredElement) {
        // If we are hovering an element
        if (hoveredElement.symbol === element.symbol) {
            // This is the hovered element itself
            isRelated = false;
            isDimmed = false;
        } else {
            // Check if this element is related to the hovered one
            if (hoveredElement.relatedSymbols?.includes(element.symbol)) {
                isRelated = true;
                isDimmed = false;
            } else {
                // Not related, so dim it to emphasize the relationship network
                isDimmed = true;
            }
        }
    }

    return { isSelected, isRelated, isDimmed };
  };

  const activeElement = hoveredElement || (selectedElements.length > 0 ? selectedElements[selectedElements.length - 1] : null);

  const groups = [ElementGroup.DEFENSIVE, ElementGroup.PROCESSING, ElementGroup.SOCIAL, ElementGroup.TEMPORAL];
  const periods = [
    { id: 1, name: "Primal", desc: "Instinctual / Base" },
    { id: 2, name: "Structural", desc: "Pattern Matching" },
    { id: 3, name: "Reactive", desc: "Short-term Response" },
    { id: 4, name: "Complex", desc: "Abstract / Systemic" }
  ];

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans flex flex-col items-center justify-center p-8 editorial-grid">
        <div className="max-w-3xl w-full">
          <div className="flex items-center gap-3 mb-8">
            <BrainCircuit size={28} className="text-black" />
            <h1 className="text-2xl font-display tracking-tight">The Periodic Table of Cognitive Elements</h1>
          </div>

          <div className="bg-white rounded-[32px] p-10 md:p-16 shadow-2xl shadow-black/5 border border-black/5">
            <h2 className="text-4xl md:text-5xl font-display mb-8">Welcome to The Periodic Table of Cognitive Elements</h2>
            
            <div className="space-y-6 text-lg text-black/70 leading-relaxed">
              <p>
                <strong className="text-black font-semibold">What is this?</strong> An interactive mapping of cognitive vulnerabilities, visualizing the interplay between systemic load and individual choice performance. This tool helps you document the ephemeral glass of institutional logic.
              </p>
              <p>
                <strong className="text-black font-semibold">How it works:</strong> Click <strong>Begin</strong> to explore the interactive table. Select different cognitive elements to synthesize archetypes or diagnose real-world scenarios in the Reaction Chamber.
              </p>
              <p>
                <strong className="text-black font-semibold">The Goal:</strong> To provide a tactile, visual way to map vulnerabilities, understand decision-making patterns, and generate behavioral science-informed interventions.
              </p>
            </div>

            <div className="mt-12">
              <button 
                onClick={() => setHasStarted(true)}
                className="px-10 py-4 bg-black text-white text-[11px] font-accent font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black/80 transition-all shadow-xl hover:scale-105"
              >
                Begin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans overflow-x-hidden editorial-grid pb-24">
      {/* Top Meta Header */}
      <div className="max-w-[1600px] mx-auto px-8 pt-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-accent font-bold tracking-[0.2em] uppercase opacity-60">Archive Series // 2024 - 2025</span>
        </div>
        <div className="hidden md:block">
           <p className="text-[11px] font-accent italic opacity-40 max-w-[300px] text-right leading-relaxed">
             "Every decision leaves a trace. We document the path from heuristic to clarity."
           </p>
        </div>
      </div>

      <header className="max-w-[1600px] mx-auto px-8 py-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex flex-col">
          <h1 className="text-6xl md:text-8xl font-display tracking-tight leading-[0.85]">
            The Periodic Table of <span className="opacity-30">Cognitive Elements.</span>
          </h1>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        
        {/* Left Col: Table (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-12">
            <div className="max-w-2xl">
                <h2 className="text-4xl font-display mb-4">Behavioral Cartography</h2>
                <p className="text-lg text-[#1a1a1a]/70 leading-relaxed text-balance">
                    An interactive mapping of cognitive vulnerabilities, visualizing the interplay between systemic load and individual choice performance.
                </p>
                <div className="mt-6 flex gap-3">
                  <span className="px-4 py-1.5 rounded-full bg-[#e5e5e1] text-[10px] font-accent font-bold uppercase tracking-wider">Science</span>
                  <span className="px-4 py-1.5 rounded-full bg-[#e5e5e1] text-[10px] font-accent font-bold uppercase tracking-wider">UI</span>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[40px] border border-black/5 shadow-2xl shadow-black/5 overflow-x-auto relative group">
              <div className="absolute top-8 right-8 text-8xl font-display opacity-[0.03] select-none pointer-events-none">02</div>
              
              <div className="min-w-[800px] relative z-10">
                {/* Headers */}
                <div className="grid grid-cols-[100px_repeat(4,1fr)] gap-4 mb-8">
                    <div></div>
                    {groups.map((g, i) => (
                        <div key={g} className="text-left border-l border-black/10 pl-4">
                            <div className="text-[10px] font-accent font-bold text-black/30 uppercase tracking-[0.15em] mb-1">Group {['I','II','III','IV'][i]}</div>
                            <div className={clsx("text-[11px] font-accent font-bold uppercase tracking-tight")}>{GROUP_COLORS[g].label}</div>
                        </div>
                    ))}
                </div>

                {/* Rows */}
                <div className="space-y-4">
                    {periods.map((period) => (
                        <div key={period.id} className="grid grid-cols-[100px_repeat(4,1fr)] gap-4">
                             {/* Row Header */}
                             <div className="flex flex-col justify-center items-start pr-4">
                                 <span className="text-4xl font-display opacity-10 leading-none">{period.id.toString().padStart(2, '0')}</span>
                                 <span className="text-[10px] font-accent font-bold uppercase tracking-wider mt-1 opacity-40">{period.name}</span>
                             </div>

                             {/* Elements */}
                             {groups.map((group) => {
                                 const element = ELEMENTS.find(e => e.group === group && e.period === period.id);
                                 if (!element) return <div key={group} className="aspect-[4/4.5]"></div>;
                                 
                                 const { isSelected, isRelated, isDimmed } = getElementState(element);
                                 
                                 return (
                                     <ElementTile
                                        key={element.symbol}
                                        element={element}
                                        isSelected={isSelected}
                                        isRelated={isRelated}
                                        isDimmed={isDimmed}
                                        onToggle={toggleElement}
                                        onHover={setHoveredElement}
                                     />
                                 );
                             })}
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>

        {/* Right Col: Inspector & Chamber (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-8 sticky top-8">
             <ElementInspector element={activeElement} />
             
             <div className="flex-grow">
                 <ReactionChamber 
                    selectedElements={selectedElements}
                    onClear={clearSelection}
                    onSetElements={setElements}
                    onUndo={undo}
                    onRedo={redo}
                    canUndo={currentStep > 0}
                    canRedo={currentStep < history.length - 1}
                 />
             </div>
        </div>
      </main>
    </div>
  );
};

export default App;