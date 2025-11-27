import React, { useState } from 'react';
import { ELEMENTS, GROUP_COLORS } from './constants';
import { CognitiveElement, ElementGroup } from './types';
import ElementTile from './components/ElementTile';
import ReactionChamber from './components/ReactionChamber';
import ElementInspector from './components/ElementInspector';
import { Database, FlaskConical } from 'lucide-react';
import clsx from 'clsx';

const App: React.FC = () => {
  // History State Management
  const [history, setHistory] = useState<CognitiveElement[][]>([[]]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<CognitiveElement | null>(null);

  // Derived state for current selection
  const selectedElements = history[currentStep];

  const handleSelectionChange = (newElements: CognitiveElement[]) => {
    // Truncate history if we are in the middle of the timeline
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const toggleElement = (element: CognitiveElement) => {
    const exists = selectedElements.find(e => e.symbol === element.symbol);
    let newSelection: CognitiveElement[];

    if (exists) {
      newSelection = selectedElements.filter(e => e.symbol !== element.symbol);
    } else {
      if (selectedElements.length < 4) {
        newSelection = [...selectedElements, element];
      } else {
        return; // Max 4 elements
      }
    }
    handleSelectionChange(newSelection);
  };

  const setElements = (elements: CognitiveElement[]) => {
      handleSelectionChange(elements);
  };

  const clearSelection = () => {
    handleSelectionChange([]);
  };

  // Determine which element to show in the inspector
  // Priority: Hover > Last Selected > Null
  const activeElement = hoveredElement || (selectedElements.length > 0 ? selectedElements[selectedElements.length - 1] : null);

  const groups = [ElementGroup.DEFENSIVE, ElementGroup.PROCESSING, ElementGroup.SOCIAL, ElementGroup.TEMPORAL];
  const periods = [
    { id: 1, name: "Primal", desc: "Instinctual / Base" },
    { id: 2, name: "Structural", desc: "Pattern Matching" },
    { id: 3, name: "Reactive", desc: "Short-term Response" },
    { id: 4, name: "Complex", desc: "Abstract / Systemic" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden science-grid pb-12">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-100 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-100 rounded-full blur-[120px]"></div>
      </div>

      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                    <FlaskConical className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold font-display tracking-tight text-slate-900 leading-none">PTCE <span className="text-indigo-600 text-sm align-top">BEHAVIORAL</span></h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Cognitive Bias Simulation Engine</p>
                </div>
            </div>
            <div className="hidden md:flex gap-6 text-xs font-mono text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    ENGINE ONLINE
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="flex items-center gap-2">
                    <Database size={12} />
                    AI: GEMINI-2.5-FLASH
                </div>
            </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Table (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Header / Intro */}
            <div>
                <h2 className="text-2xl font-bold font-display text-slate-800">Periodic Table of Cognitive Elements</h2>
                <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
                    A comprehensive framework of human biases and heuristics. Select elements to synthesize "Behavioral Archetypes" in the laboratory.
                </p>
            </div>

            {/* The Periodic Table Grid */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Column Headers (Groups) */}
                <div className="grid grid-cols-[80px_repeat(4,1fr)] gap-3 mb-4">
                    <div></div> {/* Empty corner for Period Labels */}
                    {groups.map((g, i) => (
                        <div key={g} className="text-center">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Group {['I','II','III','IV'][i]}</div>
                            <div className={clsx("text-[10px] lg:text-xs font-bold uppercase truncate px-1", GROUP_COLORS[g].primary)}>{GROUP_COLORS[g].label}</div>
                            <div className={clsx("h-1 w-full mt-1 rounded-full opacity-30", GROUP_COLORS[g].bg.replace('bg-', 'bg-'))} style={{backgroundColor: GROUP_COLORS[g].hex}}></div>
                        </div>
                    ))}
                </div>

                {/* Rows (Periods) */}
                <div className="space-y-3">
                  {periods.map((period) => (
                    <div key={period.id} className="grid grid-cols-[80px_repeat(4,1fr)] gap-3 items-stretch">
                        {/* Row Header */}
                        <div className="flex flex-col justify-center items-end pr-3 border-r border-slate-100">
                            <span className="text-2xl font-bold font-display text-slate-300 leading-none">{period.id}</span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide text-right">{period.name}</span>
                            <span className="text-[8px] text-slate-400 text-right leading-none mt-0.5">{period.desc}</span>
                        </div>
                        
                        {/* Elements in this Period */}
                        {ELEMENTS.filter(e => e.period === period.id).map(element => (
                            <ElementTile 
                                key={element.symbol} 
                                element={element} 
                                isSelected={!!selectedElements.find(e => e.symbol === element.symbol)}
                                onToggle={toggleElement}
                                onHover={setHoveredElement}
                            />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key / Legend */}
            <div className="flex flex-wrap gap-4 px-4">
                {groups.map(g => (
                    <div key={g} className="flex items-center gap-2">
                        <div className={clsx("w-3 h-3 rounded-sm", GROUP_COLORS[g].bg.replace('bg-', 'bg-'))} style={{backgroundColor: GROUP_COLORS[g].hex}}></div>
                        <span className="text-xs text-slate-500 font-medium">{GROUP_COLORS[g].label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Right Col: Synthesis Chamber */}
        <div className="xl:col-span-4 sticky top-28 space-y-6">
            <ElementInspector element={activeElement} />
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

      </main>
    </div>
  );
};

export default App;