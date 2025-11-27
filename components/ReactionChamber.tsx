import React, { useState } from 'react';
import { CognitiveElement, SynthesisResult, DiagnosisResult } from '../types';
import { synthesizeMolecule, diagnoseScenario } from '../services/geminiService';
import { FlaskConical, Microscope, Info, Atom, Zap, RefreshCw, Undo2, Redo2, ScanLine, BrainCircuit, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { GROUP_COLORS, ELEMENTS } from '../constants';

interface ReactionChamberProps {
  selectedElements: CognitiveElement[];
  onClear: () => void;
  onSetElements: (elements: CognitiveElement[]) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const RECIPES = [
  {
    id: 'echo_chamber',
    name: 'The Echo Chamber',
    symbol: 'Ec',
    formula: 'Cb + Sp + Ig',
    description: "A hermetically sealed belief system. Confirmation Bias filters data, Social Proof validates it, and In-Group Bias demonizes outsiders.",
    elements: ['Cb', 'Sp', 'Ig'],
    stability: 85,
    type: 'Phenomenon',
    color: 'purple'
  },
  {
    id: 'panic_selling',
    name: 'Market Capitulation',
    symbol: 'Mc',
    formula: 'La + Av + Sp',
    description: "A cascade of irrational selling. Loss Aversion triggers fear, Availability (recent news) amplifies it, and Social Proof (others selling) confirms the exit.",
    elements: ['La', 'Av', 'Sp'],
    stability: 10,
    type: 'Phenomenon',
    color: 'rose'
  },
  {
    id: 'conspiracy',
    name: 'The Conspiracy Theorist',
    symbol: 'Ct',
    formula: 'Ap + Cb + Dk',
    description: "Seeing patterns where none exist reinforced by Confirmation Bias, driven by Dunning-Kruger (overconfidence in hidden knowledge).",
    elements: ['Fr', 'Cb', 'Dk'], 
    stability: 60,
    type: 'Archetype',
    color: 'amber'
  }
];

const MoleculeVisualizer: React.FC<{ result: SynthesisResult }> = ({ result }) => {
    const coreColor = result.stability > 60 ? 'bg-purple-500' : result.stability > 30 ? 'bg-amber-500' : 'bg-rose-500';
    const glowColor = result.stability > 60 ? 'shadow-purple-300' : result.stability > 30 ? 'shadow-amber-300' : 'shadow-rose-300';

    return (
        <div className="relative w-48 h-48 flex items-center justify-center perspective-1000">
            <motion.div 
                animate={{ rotateY: 360, rotateX: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-32 h-32 preserve-3d"
            >
                <div className={clsx("absolute inset-0 m-auto w-12 h-12 rounded-full shadow-[0_0_40px] z-10", coreColor, glowColor)}>
                     <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
                </div>
                {[0, 60, 120].map((deg, i) => (
                    <div key={i} className="absolute inset-0 m-auto w-full h-full border-2 border-slate-300/30 rounded-full" 
                         style={{ transform: `rotate(${deg}deg)` }}>
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-400 rounded-full shadow-lg"></div>
                         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-sky-300 rounded-full shadow-lg"></div>
                    </div>
                ))}
                <div className="absolute inset-0 m-auto w-1 h-32 bg-slate-300/20 rotate-45"></div>
                <div className="absolute inset-0 m-auto w-32 h-1 bg-slate-300/20 -rotate-45"></div>
            </motion.div>
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs font-mono font-bold text-slate-600">{result.symbol || result.name.substring(0,2).toUpperCase()}</span>
                <span className="text-[10px] text-slate-400 ml-2">RATIONALITY: {result.stability}%</span>
            </div>
        </div>
    );
};

const ReactionChamber: React.FC<ReactionChamberProps> = ({ 
  selectedElements, 
  onClear, 
  onSetElements,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'diagnosis'>('synthesis');
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Diagnosis State
  const [scenarioInput, setScenarioInput] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // --- Synthesis Logic ---
  const handleSynthesize = async () => {
    if (selectedElements.length === 0) return;
    setIsSynthesizing(true);
    setSynthesisResult(null);

    const symbols = selectedElements.map(e => e.symbol).sort();
    const match = RECIPES.find(r => {
        const recipeSymbols = [...r.elements].sort();
        return JSON.stringify(symbols) === JSON.stringify(recipeSymbols);
    });

    setTimeout(async () => {
        if (match) {
            setSynthesisResult({
              name: match.name,
              formula: match.formula,
              description: match.description,
              stability: match.stability,
              type: match.type as 'Archetype'
            });
        } else {
            const geminiResult = await synthesizeMolecule(selectedElements);
            setSynthesisResult(geminiResult);
        }
        setIsSynthesizing(false);
    }, 2000);
  };

  const loadPreset = (recipeId: string) => {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;
    const newElements = ELEMENTS.filter(e => recipe.elements.includes(e.symbol));
    onSetElements(newElements);
    setSynthesisResult(null);
    setActiveTab('synthesis');
  };

  // --- Diagnosis Logic ---
  const handleDiagnose = async () => {
    if (!scenarioInput.trim()) return;
    setIsDiagnosing(true);
    setDiagnosisResult(null);
    
    // Artificial delay for UX
    setTimeout(async () => {
      const result = await diagnoseScenario(scenarioInput);
      setDiagnosisResult(result);
      setIsDiagnosing(false);
    }, 1500);
  };

  const loadDiagnosisToChamber = () => {
    if (!diagnosisResult) return;
    const detectedSymbols = diagnosisResult.elements.map(e => e.symbol);
    const newElements = ELEMENTS.filter(e => detectedSymbols.includes(e.symbol));
    onSetElements(newElements);
    setSynthesisResult(null);
    setActiveTab('synthesis');
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Main Container */}
      <div className="w-full flex-grow flex flex-col relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
          
          {/* Tab Header */}
          <div className="flex border-b border-slate-100 bg-slate-50/80 backdrop-blur z-20">
              <button 
                onClick={() => setActiveTab('synthesis')}
                className={clsx(
                  "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors relative",
                  activeTab === 'synthesis' ? "text-indigo-600 bg-white" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                )}
              >
                 <FlaskConical size={14} />
                 Synthesis
                 {activeTab === 'synthesis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </button>
              <div className="w-px bg-slate-200"></div>
              <button 
                onClick={() => setActiveTab('diagnosis')}
                className={clsx(
                  "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors relative",
                  activeTab === 'diagnosis' ? "text-indigo-600 bg-white" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                )}
              >
                 <BrainCircuit size={14} />
                 Diagnosis
                 {activeTab === 'diagnosis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
              </button>
          </div>

          {/* TAB 1: SYNTHESIS CONTENT */}
          {activeTab === 'synthesis' && (
             <>
               <div className="px-4 py-2 border-b border-slate-100 bg-white flex justify-between items-center z-20 h-10">
                  <div className="flex items-center gap-2">
                    <span className={clsx("w-1.5 h-1.5 rounded-full", isSynthesizing ? "bg-amber-400 animate-pulse" : "bg-emerald-400")}></span>
                    <span className="text-[10px] font-mono text-slate-400">{isSynthesizing ? 'ACTIVE' : 'READY'}</span>
                  </div>
               </div>

               <div className="flex-grow relative flex flex-col items-center justify-center p-6 min-h-[360px] bg-gradient-to-b from-white to-slate-50">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  <AnimatePresence mode="wait">
                      {isSynthesizing ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-8 z-10 w-full">
                              <div className="relative w-40 h-40 flex items-center justify-center">
                                  <div className="absolute w-4 h-4 bg-indigo-600 rounded-full animate-ping opacity-20"></div>
                                  {selectedElements.map((el, i) => (
                                      <motion.div
                                        key={el.symbol}
                                        initial={{ scale: 1, x: 0, y: 0 }}
                                        animate={{ rotate: 360, scale: [1, 0.5, 0], opacity: [1, 1, 0], x: [0, 0], y: [0, 0] }}
                                        transition={{ duration: 1.8, ease: "easeInOut" }}
                                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white shadow-lg border-2 border-indigo-100 flex items-center justify-center text-xs font-bold text-slate-600 z-10"
                                        style={{ transformOrigin: `${50 + Math.cos(i) * 60}px ${50 + Math.sin(i) * 60}px` }}
                                      >
                                          {el.symbol}
                                      </motion.div>
                                  ))}
                                  <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full animate-[spin_3s_linear_infinite]"></div>
                                  <div className="absolute inset-2 border border-indigo-500/10 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                              </div>
                              <p className="text-slate-400 font-mono text-xs tracking-widest animate-pulse">ANALYZING INTERACTION...</p>
                          </motion.div>
                      ) : synthesisResult ? (
                          <motion.div key="result" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="flex flex-col items-center text-center z-10 w-full">
                              <MoleculeVisualizer result={synthesisResult} />
                              <div className="mt-6 w-full max-w-sm">
                                  <h2 className="text-2xl font-bold text-slate-800 font-display mb-1">{synthesisResult.name}</h2>
                                  <div className="flex items-center justify-center gap-2 mb-4 bg-slate-100/50 py-1 px-3 rounded-lg mx-auto w-fit border border-slate-200/50">
                                       <span className="font-serif italic text-slate-500 text-lg">f</span>
                                       <span className="text-indigo-600 font-mono font-medium">{synthesisResult.formula}</span>
                                  </div>
                                  <p className="text-slate-600 text-sm leading-relaxed font-sans border-t border-slate-100 pt-4">{synthesisResult.description}</p>
                                  <div className="mt-2 text-xs font-mono text-slate-400">TYPE: {synthesisResult.type.toUpperCase()}</div>
                              </div>
                          </motion.div>
                      ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center w-full h-full">
                               {selectedElements.length > 0 ? (
                                   <div className="flex flex-col items-center gap-8 w-full z-10">
                                       <div className="flex gap-4 justify-center flex-wrap">
                                          {selectedElements.map((el, idx) => {
                                              const colors = GROUP_COLORS[el.group];
                                              return (
                                                  <motion.div layoutId={`element-${el.symbol}`} key={idx} className={clsx("w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center relative shadow-sm bg-white", colors.border)}>
                                                      <span className={clsx("text-xl font-bold font-display", colors.primary)}>{el.symbol}</span>
                                                      <div className={clsx("absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white", colors.bg.replace('bg-', 'bg-slate-800/'))} style={{backgroundColor: colors.hex}}>{el.atomicNumber}</div>
                                                  </motion.div>
                                              )
                                          })}
                                       </div>
                                       {selectedElements.length > 1 && (
                                         <button onClick={handleSynthesize} className="group relative flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-200 transition-all overflow-hidden">
                                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                              <Zap size={16} className={isSynthesizing ? "animate-bounce" : ""} />
                                              <span className="relative">Simulate Behavior</span>
                                         </button>
                                       )}
                                   </div>
                               ) : (
                                  <div className="text-center space-y-4 max-w-xs z-10">
                                      <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50 to-transparent"></div>
                                        <Atom className="text-slate-300 relative z-10" size={40} />
                                      </div>
                                      <div>
                                          <p className="text-base font-bold text-slate-700 font-display">Behavioral Lab</p>
                                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Combine biases to generate personality archetypes or market scenarios.</p>
                                      </div>
                                  </div>
                               )}
                          </motion.div>
                      )}
                  </AnimatePresence>
               </div>

               {/* Footer Controls */}
               {(selectedElements.length > 0 || canUndo) && (
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center z-20">
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1 pr-2 border-r border-slate-200 mr-2">
                            <button disabled={!canUndo} onClick={onUndo} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors rounded-md hover:bg-slate-100"><Undo2 size={14} /></button>
                            <button disabled={!canRedo} onClick={onRedo} className="p-1.5 text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors rounded-md hover:bg-slate-100"><Redo2 size={14} /></button>
                         </div>
                         <button disabled={selectedElements.length === 0} onClick={onClear} className="text-xs font-semibold text-rose-500 hover:text-rose-600 disabled:opacity-30 flex items-center gap-1.5 transition-colors"><RefreshCw size={12} /> Reset</button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">LOAD: {selectedElements.length}/4</span>
                  </div>
               )}
             </>
          )}

          {/* TAB 2: DIAGNOSIS CONTENT */}
          {activeTab === 'diagnosis' && (
             <div className="flex-grow flex flex-col h-full bg-slate-50/30">
                {/* Input Area */}
                <div className="p-4 border-b border-slate-100 bg-white z-10">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                        Describe Scenario
                    </label>
                    <div className="relative">
                        <textarea
                            value={scenarioInput}
                            onChange={(e) => setScenarioInput(e.target.value)}
                            placeholder="E.g., 'We keep funding this project even though it's failing because we already spent so much money on it...'"
                            className="w-full text-xs p-3 h-24 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none font-medium text-slate-600 placeholder:text-slate-400"
                        />
                        <button 
                            onClick={handleDiagnose}
                            disabled={!scenarioInput.trim() || isDiagnosing}
                            className="absolute bottom-2 right-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-[10px] font-bold rounded flex items-center gap-1.5 transition-all shadow-sm"
                        >
                            {isDiagnosing ? <Loader2 size={10} className="animate-spin" /> : <ScanLine size={10} />}
                            ANALYZE
                        </button>
                    </div>
                </div>
                
                {/* Results Area */}
                <div className="flex-grow p-4 overflow-y-auto min-h-[300px] relative">
                    <AnimatePresence mode="wait">
                        {isDiagnosing ? (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-3">
                                 <ScanLine size={40} className="text-indigo-300 animate-pulse" />
                                 <p className="text-xs font-mono text-slate-400 animate-pulse">REVERSE ENGINEERING BEHAVIOR...</p>
                             </motion.div>
                        ) : diagnosisResult ? (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                 <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                                     <h3 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Info size={12} /> Clinical Summary
                                     </h3>
                                     <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                                        "{diagnosisResult.summary}"
                                     </p>
                                 </div>
                                 
                                 <div className="space-y-2">
                                     <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Detected Elements</h3>
                                     {diagnosisResult.elements.map((el, i) => {
                                         const elementDef = ELEMENTS.find(e => e.symbol === el.symbol);
                                         if (!elementDef) return null;
                                         const colors = GROUP_COLORS[elementDef.group];

                                         return (
                                             <motion.div 
                                                key={el.symbol} 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm flex items-start gap-3"
                                             >
                                                <div className={clsx("w-10 h-10 rounded border-2 flex items-center justify-center flex-shrink-0 bg-slate-50", colors.border)}>
                                                    <span className={clsx("text-lg font-bold font-display", colors.primary)}>{el.symbol}</span>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-slate-700">{elementDef.name}</span>
                                                        <span className="text-[10px] font-mono font-bold text-slate-400">{el.confidence}% MATCH</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }} 
                                                            animate={{ width: `${el.confidence}%` }} 
                                                            className={clsx("h-full rounded-full", colors.bg.replace('bg-', 'bg-'))} 
                                                            style={{ backgroundColor: colors.hex }}
                                                        ></motion.div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 leading-snug italic">
                                                        {el.reasoning}
                                                    </p>
                                                </div>
                                             </motion.div>
                                         )
                                     })}
                                 </div>

                                 <button 
                                    onClick={loadDiagnosisToChamber}
                                    className="w-full py-3 mt-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-all"
                                 >
                                    Load into Simulator <ArrowRight size={12} />
                                 </button>
                             </motion.div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                     <BrainCircuit size={32} className="text-slate-300" />
                                 </div>
                                 <h3 className="text-sm font-bold text-slate-600">Reverse Engineering Mode</h3>
                                 <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-[240px]">
                                     Enter a real-world scenario to detect active biases and potential cognitive distortions.
                                 </p>
                             </div>
                        )}
                    </AnimatePresence>
                </div>
             </div>
          )}
      </div>

      {/* Standard Compounds / Scenarios (Shared or Context Aware) */}
      {activeTab === 'synthesis' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
               <Info size={14} className="text-indigo-500" />
               <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Phenomena</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
               {RECIPES.map(recipe => (
                   <button 
                      key={recipe.id}
                      onClick={() => loadPreset(recipe.id)}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group text-left relative overflow-hidden"
                   >
                      <div className={clsx("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b", 
                           recipe.color === 'amber' && "from-amber-400 to-amber-600",
                           recipe.color === 'rose' && "from-rose-400 to-rose-600",
                           recipe.color === 'purple' && "from-purple-400 to-purple-600",
                           recipe.color === 'sky' && "from-sky-400 to-sky-600"
                      )}></div>
                      <div className="pl-2">
                          <div className="flex items-center gap-2 mb-1">
                              <span className={clsx("text-sm font-bold font-display", 
                                  recipe.color === 'amber' && "text-amber-700",
                                  recipe.color === 'rose' && "text-rose-700",
                                  recipe.color === 'purple' && "text-purple-700",
                                  recipe.color === 'sky' && "text-sky-700",
                              )}>
                                  {recipe.name}
                              </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-100 w-fit">
                              {recipe.formula}
                          </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:scale-110 transition-transform">
                          <Microscope size={14} />
                      </div>
                   </button>
               ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionChamber;