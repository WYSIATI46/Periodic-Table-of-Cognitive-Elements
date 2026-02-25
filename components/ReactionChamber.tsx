import React, { useState, useEffect } from 'react';
import { CognitiveElement, SynthesisResult, DiagnosisResult, ChatMessage } from '../types';
import { synthesizeMolecule, diagnoseScenario, chatWithArchetype } from '../services/geminiService';
import { FlaskConical, Microscope, Info, Atom, Zap, RefreshCw, Undo2, Redo2, ScanLine, BrainCircuit, ArrowRight, Loader2, ClipboardList, Lightbulb, Stethoscope, Dices, BookOpen, Save, Trash2, MessageSquare, Send, User, Bot, X } from 'lucide-react';
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
    useCase: "A political subgroup on social media that bans dissenting voices and amplifies only news that aligns with their pre-existing narrative.",
    elements: ['Cb', 'Sp', 'Ig'],
    stability: 85,
    type: 'Phenomenon',
    color: 'black'
  },
  {
    id: 'panic_selling',
    name: 'Market Capitulation',
    symbol: 'Mc',
    formula: 'La + Av + Sp',
    description: "A cascade of irrational selling. Loss Aversion triggers fear, Availability (recent news) amplifies it, and Social Proof (others selling) confirms the exit.",
    useCase: "Investors mass-selling a stable stock during a minor dip because they saw a sensationalized news headline and watched the ticker drop.",
    elements: ['La', 'Av', 'Sp'],
    stability: 10,
    type: 'Phenomenon',
    color: 'black'
  },
  {
    id: 'conspiracy',
    name: 'The Conspiracy Theorist',
    symbol: 'Ct',
    formula: 'Ap + Cb + Dk',
    description: "Seeing patterns where none exist reinforced by Confirmation Bias, driven by Dunning-Kruger (overconfidence in hidden knowledge).",
    useCase: "A person convinced that a mundane coincidence is proof of a grand global plot, dismissing expert explanations as part of the 'cover-up'.",
    elements: ['Fr', 'Cb', 'Dk'], 
    stability: 60,
    type: 'Archetype',
    color: 'black'
  }
];

const MoleculeVisualizer: React.FC<{ result: SynthesisResult }> = ({ result }) => {
    const stabilityFactor = result.stability / 100;
    
    return (
        <div className="relative w-64 h-64 flex items-center justify-center z-0">
             {/* Atmospheric Glow */}
             <motion.div
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ 
                    duration: 4,
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="absolute inset-0 rounded-full bg-black blur-[80px] -z-10"
             />

            <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-48 h-48 flex items-center justify-center"
            >
                {/* Minimalist Core */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-24 h-24 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-2xl"
                >
                    <div className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center">
                         <span className="text-3xl font-display text-black">{result.symbol || result.name.substring(0,2).toUpperCase()}</span>
                    </div>
                </motion.div>

                {/* Concentric Rings */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-40 h-40 border border-black/5 rounded-full"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-48 h-48 border border-black/5 rounded-full border-dashed"
                />
                
                {/* Stability Indicator */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-[10px] font-accent font-bold tracking-[0.2em] uppercase text-black/20">
                        Stability Index: {result.stability}%
                    </span>
                </div>
            </motion.div>
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
  const [activeTab, setActiveTab] = useState<'synthesis' | 'diagnosis' | 'notebook'>('synthesis');
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Notebook State
  const [savedResults, setSavedResults] = useState<SynthesisResult[]>([]);

  // Diagnosis State
  const [scenarioInput, setScenarioInput] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Load Notebook from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ptce_notebook');
    if (saved) {
      try {
        setSavedResults(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load notebook", e);
      }
    }
  }, []);

  const saveToNotebook = (result: SynthesisResult) => {
    const entry = { ...result, id: crypto.randomUUID(), timestamp: Date.now() };
    const updated = [entry, ...savedResults];
    setSavedResults(updated);
    localStorage.setItem('ptce_notebook', JSON.stringify(updated));
  };

  const deleteFromNotebook = (id: string) => {
    const updated = savedResults.filter(r => r.id !== id);
    setSavedResults(updated);
    localStorage.setItem('ptce_notebook', JSON.stringify(updated));
  };

  // --- Synthesis Logic ---
  const performSynthesis = async (elementsToSynthesize: CognitiveElement[]) => {
      setIsSynthesizing(true);
      setSynthesisResult(null);
      setIsChatOpen(false); // Reset chat

      const symbols = elementsToSynthesize.map(e => e.symbol).sort();
      const match = RECIPES.find(r => {
          const recipeSymbols = [...r.elements].sort();
          return JSON.stringify(symbols) === JSON.stringify(recipeSymbols);
      });

      // Min delay for UX
      setTimeout(async () => {
          if (match) {
              setSynthesisResult({
                name: match.name,
                formula: match.formula,
                description: match.description,
                useCase: match.useCase,
                stability: match.stability,
                type: match.type as 'Archetype'
              });
          } else {
              const geminiResult = await synthesizeMolecule(elementsToSynthesize);
              setSynthesisResult(geminiResult);
          }
          setIsSynthesizing(false);
      }, 1500);
  };

  const handleSynthesize = () => {
    if (selectedElements.length === 0) return;
    performSynthesis(selectedElements);
  };

  const handleWildCard = () => {
    const count = Math.floor(Math.random() * 3) + 2; 
    const shuffled = [...ELEMENTS].sort(() => 0.5 - Math.random());
    const randomSelection = shuffled.slice(0, count);
    onSetElements(randomSelection);
    performSynthesis(randomSelection);
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

  // --- Chat Logic ---
  const handleChatOpen = () => {
      if (!synthesisResult) return;
      setIsChatOpen(true);
      setChatHistory([
          { role: 'model', content: `I am ${synthesisResult.name}. You may question my logic.` }
      ]);
  };

  const handleChatSend = async () => {
      if (!chatInput.trim() || !synthesisResult) return;
      
      const userMsg: ChatMessage = { role: 'user', content: chatInput };
      const updatedHistory = [...chatHistory, userMsg];
      setChatHistory(updatedHistory);
      setChatInput('');
      setIsChatTyping(true);

      const responseText = await chatWithArchetype(updatedHistory, synthesisResult);
      
      setIsChatTyping(false);
      setChatHistory([...updatedHistory, { role: 'model', content: responseText }]);
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Main Container */}
      <div className="w-full flex-grow flex flex-col relative bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-black/5 border border-black/5">
          
          {/* Tab Header */}
          <div className="flex bg-[#f5f2ed]/50 backdrop-blur z-20">
              <button 
                onClick={() => setActiveTab('synthesis')}
                className={clsx(
                  "flex-1 py-4 text-[10px] font-accent font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all relative",
                  activeTab === 'synthesis' ? "text-black bg-white" : "text-black/30 hover:text-black/60 hover:bg-white/50"
                )}
              >
                 Synthesis
                 {activeTab === 'synthesis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('diagnosis')}
                className={clsx(
                  "flex-1 py-4 text-[10px] font-accent font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all relative",
                  activeTab === 'diagnosis' ? "text-black bg-white" : "text-black/30 hover:text-black/60 hover:bg-white/50"
                )}
              >
                 Diagnosis
                 {activeTab === 'diagnosis' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('notebook')}
                className={clsx(
                  "flex-1 py-4 text-[10px] font-accent font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all relative",
                  activeTab === 'notebook' ? "text-black bg-white" : "text-black/30 hover:text-black/60 hover:bg-white/50"
                )}
              >
                 Notebook
                 {activeTab === 'notebook' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
          </div>

          {/* TAB 1: SYNTHESIS CONTENT */}
          {activeTab === 'synthesis' && (
             <>
               <div className="flex-grow relative flex flex-col items-center justify-center p-8 min-h-[450px]">
                  <AnimatePresence mode="wait">
                      {isSynthesizing ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-12 z-10 w-full">
                              <div className="relative w-48 h-48 flex items-center justify-center">
                                  <div className="absolute w-full h-full border border-black/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                  <div className="absolute w-3/4 h-3/4 border border-black/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                  <FlaskConical size={40} className="text-black/20 animate-pulse" />
                              </div>
                              <p className="text-black/30 font-accent font-bold text-[10px] tracking-[0.3em] uppercase animate-pulse">Synthesizing Archetype...</p>
                          </motion.div>
                      ) : synthesisResult ? (
                          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center z-10 w-full relative">
                              
                              {/* Chat Interface Overlay */}
                              {isChatOpen && (
                                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-50 bg-white/98 backdrop-blur-xl rounded-2xl flex flex-col p-6 border border-black/5 shadow-2xl">
                                      <div className="flex justify-between items-center mb-6">
                                          <h3 className="font-display text-xl">Interrogation</h3>
                                          <button onClick={() => setIsChatOpen(false)} className="text-black/20 hover:text-black"><X size={20} /></button>
                                      </div>
                                      <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-thin">
                                          {chatHistory.map((msg, i) => (
                                              <div key={i} className={clsx("flex flex-col gap-1 text-left", msg.role === 'user' ? "items-end" : "items-start")}>
                                                  <span className="text-[9px] font-accent font-bold uppercase tracking-widest opacity-30">{msg.role === 'user' ? 'Inquirer' : synthesisResult.name}</span>
                                                  <div className={clsx("p-4 rounded-2xl text-sm max-w-[90%] leading-relaxed", msg.role === 'user' ? "bg-black text-white" : "bg-[#f5f2ed] text-black")}>
                                                      {msg.content}
                                                  </div>
                                              </div>
                                          ))}
                                          {isChatTyping && <div className="text-[10px] font-accent font-bold text-black/20 tracking-widest animate-pulse">Analyzing...</div>}
                                      </div>
                                      <div className="flex gap-3">
                                          <input 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                                            placeholder="Question the logic..."
                                            className="flex-grow text-sm p-4 bg-[#f5f2ed] rounded-2xl focus:outline-none focus:ring-1 focus:ring-black/10"
                                            autoFocus
                                          />
                                          <button onClick={handleChatSend} className="p-4 bg-black text-white rounded-2xl hover:bg-black/80 transition-colors"><Send size={18} /></button>
                                      </div>
                                  </motion.div>
                              )}

                              <MoleculeVisualizer result={synthesisResult} />
                              <div className="mt-8 w-full">
                                  <h2 className="text-4xl font-display text-black mb-2">{synthesisResult.name}</h2>
                                  <div className="text-[11px] font-accent font-bold tracking-[0.2em] uppercase opacity-30 mb-6">{synthesisResult.formula}</div>
                                  
                                  <div className="space-y-6 text-left max-w-sm mx-auto">
                                      <p className="text-sm text-black/60 leading-relaxed text-center">{synthesisResult.description}</p>
                                      
                                      <div className="bg-[#f5f2ed] rounded-2xl p-6 border border-black/5">
                                           <p className="text-xs text-black/80 leading-relaxed italic text-center">
                                              "{synthesisResult.useCase}"
                                           </p>
                                      </div>
                                  </div>

                                  <div className="mt-8 flex gap-3 justify-center">
                                      <button 
                                        onClick={handleChatOpen}
                                        className="px-6 py-3 bg-black text-white text-[10px] font-accent font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all"
                                      >
                                          Interrogate
                                      </button>
                                      <button 
                                        onClick={() => saveToNotebook(synthesisResult)}
                                        className="px-6 py-3 bg-white border border-black/10 text-black text-[10px] font-accent font-bold uppercase tracking-widest rounded-full hover:bg-[#f5f2ed] transition-all"
                                      >
                                          Save Artifact
                                      </button>
                                  </div>
                              </div>
                          </motion.div>
                      ) : (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center w-full h-full">
                               {selectedElements.length > 0 ? (
                                   <div className="flex flex-col items-center gap-12 w-full z-10">
                                       <div className="flex gap-6 justify-center flex-wrap">
                                          {selectedElements.map((el, idx) => (
                                              <motion.div layoutId={`element-${el.symbol}`} key={idx} className="w-20 h-20 rounded-3xl border border-black/5 flex flex-col items-center justify-center relative shadow-xl bg-white">
                                                  <span className="text-2xl font-display text-black">{el.symbol}</span>
                                                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-accent font-bold text-white bg-black">{el.atomicNumber}</div>
                                              </motion.div>
                                          ))}
                                       </div>
                                       {selectedElements.length > 1 && (
                                         <button onClick={handleSynthesize} className="group relative flex items-center gap-3 px-10 py-4 bg-black text-white text-[11px] font-accent font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl hover:scale-105 transition-all">
                                              <Zap size={16} />
                                              <span>Simulate Logic</span>
                                         </button>
                                       )}
                                   </div>
                               ) : (
                                  <div className="text-center space-y-6 max-w-xs z-10 flex flex-col items-center">
                                      <div className="w-24 h-24 bg-[#f5f2ed] rounded-full flex items-center justify-center mx-auto relative group overflow-hidden">
                                        <Atom className="text-black/10 group-hover:rotate-180 transition-transform duration-1000" size={48} />
                                      </div>
                                      <div>
                                          <p className="text-2xl font-display text-black">The Logic Ledger</p>
                                          <p className="text-xs text-black/40 mt-2 leading-relaxed">Combine heuristic elements to document the ephemeral glass of institutional logic.</p>
                                      </div>
                                      
                                      <button 
                                        onClick={handleWildCard}
                                        className="mt-4 px-6 py-3 bg-white border border-black/10 text-black/40 text-[10px] font-accent font-bold uppercase tracking-widest rounded-full hover:text-black hover:border-black transition-all flex items-center gap-2"
                                      >
                                          <Dices size={14} />
                                          Wild Card
                                      </button>
                                  </div>
                               )}
                          </motion.div>
                      )}
                  </AnimatePresence>
               </div>

               {/* Footer Controls */}
               {(selectedElements.length > 0 || canUndo) && (
                  <div className="px-8 py-6 border-t border-black/5 bg-[#f5f2ed]/30 flex justify-between items-center z-20">
                      <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 pr-4 border-r border-black/5">
                             <button disabled={!canUndo} onClick={onUndo} className="p-2 text-black/20 hover:text-black disabled:opacity-10 transition-colors"><Undo2 size={16} /></button>
                             <button disabled={!canRedo} onClick={onRedo} className="p-2 text-black/20 hover:text-black disabled:opacity-10 transition-colors"><Redo2 size={16} /></button>
                          </div>
                          <button disabled={selectedElements.length === 0} onClick={onClear} className="text-[10px] font-accent font-bold uppercase tracking-widest text-black/30 hover:text-black disabled:opacity-10 transition-colors">Reset</button>
                      </div>
                      <span className="text-[10px] font-accent font-bold tracking-widest text-black/20 uppercase">Load: {selectedElements.length}/4</span>
                  </div>
               )}
             </>
          )}

          {/* TAB 2: DIAGNOSIS CONTENT */}
          {activeTab === 'diagnosis' && (
             <div className="flex-grow flex flex-col h-full">
                <div className="p-8 border-b border-black/5">
                    <label className="text-[10px] font-accent font-bold text-black/20 uppercase tracking-[0.2em] mb-4 block">
                        Scenario Input
                    </label>
                    <div className="relative">
                        <textarea
                            value={scenarioInput}
                            onChange={(e) => setScenarioInput(e.target.value)}
                            placeholder="Describe the path from heuristic to clarity..."
                            className="w-full text-sm p-6 h-32 bg-[#f5f2ed] rounded-3xl focus:outline-none focus:ring-1 focus:ring-black/10 outline-none resize-none font-medium text-black placeholder:text-black/20 transition-all"
                        />
                        <button 
                            onClick={handleDiagnose}
                            disabled={!scenarioInput.trim() || isDiagnosing}
                            className="absolute bottom-4 right-4 px-6 py-3 bg-black text-white text-[10px] font-accent font-bold uppercase tracking-widest rounded-full hover:bg-black/80 transition-all shadow-xl"
                        >
                            {isDiagnosing ? <Loader2 size={14} className="animate-spin" /> : 'Analyze'}
                        </button>
                    </div>
                </div>
                
                <div className="flex-grow p-8 overflow-y-auto min-h-[300px] relative">
                    <AnimatePresence mode="wait">
                        {isDiagnosing ? (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-4">
                                 <ScanLine size={40} className="text-black/10 animate-pulse" />
                                 <p className="text-[10px] font-accent font-bold text-black/20 tracking-[0.3em] uppercase animate-pulse">Mapping Vulnerabilities...</p>
                             </motion.div>
                        ) : diagnosisResult ? (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                 <div className="p-8 bg-[#f5f2ed] rounded-[32px] border border-black/5">
                                     <h3 className="text-2xl font-display mb-4">{diagnosisResult.title}</h3>
                                     <p className="text-sm text-black/60 leading-relaxed">
                                        {diagnosisResult.assessment}
                                     </p>
                                 </div>
                                 
                                 <div className="space-y-4">
                                     <h3 className="text-[10px] font-accent font-bold text-black/20 uppercase tracking-[0.2em] px-2">
                                         Detected Signatures
                                     </h3>
                                     {diagnosisResult.elements.map((el, i) => {
                                         const elementDef = ELEMENTS.find(e => e.symbol === el.symbol);
                                         if (!elementDef) return null;

                                         return (
                                             <motion.div 
                                                key={el.symbol} 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-white border border-black/5 p-6 rounded-3xl flex items-start gap-6 shadow-sm hover:shadow-xl transition-all group"
                                             >
                                                <div className="w-14 h-14 rounded-2xl border border-black/5 flex items-center justify-center flex-shrink-0 bg-[#f5f2ed] group-hover:bg-black group-hover:text-white transition-all">
                                                    <span className="text-xl font-display">{el.symbol}</span>
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm font-bold text-black">{elementDef.name}</span>
                                                        <span className="text-[10px] font-accent font-bold text-black/20">{el.confidence}%</span>
                                                    </div>
                                                    <p className="text-xs text-black/40 leading-relaxed italic">
                                                        "{el.reasoning}"
                                                    </p>
                                                </div>
                                             </motion.div>
                                         )
                                     })}
                                 </div>

                                 <button 
                                    onClick={loadDiagnosisToChamber}
                                    className="w-full py-4 bg-black text-white text-[11px] font-accent font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl hover:scale-[1.02] transition-all"
                                 >
                                    Load into Simulator
                                 </button>
                             </motion.div>
                        ) : (
                             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                 <div className="w-20 h-20 bg-[#f5f2ed] rounded-full flex items-center justify-center mb-6">
                                     <BrainCircuit size={32} className="text-black/10" />
                                 </div>
                                 <h3 className="text-xl font-display">Diagnostic Protocol</h3>
                                 <p className="text-xs text-black/40 mt-3 leading-relaxed max-w-[240px]">
                                     Enter a real-world scenario to detect active signatures and receive behavioral science-informed interventions.
                                 </p>
                             </div>
                        )}
                    </AnimatePresence>
                </div>
             </div>
          )}

          {/* TAB 3: NOTEBOOK CONTENT */}
          {activeTab === 'notebook' && (
              <div className="flex-grow flex flex-col h-full bg-[#f5f2ed]/30 overflow-y-auto p-8">
                  {savedResults.length > 0 ? (
                      <div className="space-y-4">
                          {savedResults.map(entry => (
                              <div key={entry.id} className="bg-white border border-black/5 rounded-[32px] p-8 shadow-sm hover:shadow-2xl transition-all relative group">
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <h3 className="text-2xl font-display text-black">{entry.name}</h3>
                                          <div className="text-[10px] font-accent font-bold text-black/20 uppercase tracking-widest mt-1">
                                              {entry.formula} // {new Date(entry.timestamp || Date.now()).toLocaleDateString()}
                                          </div>
                                      </div>
                                      <button 
                                        onClick={() => deleteFromNotebook(entry.id!)}
                                        className="text-black/10 hover:text-black transition-colors p-2"
                                      >
                                          <Trash2 size={18} />
                                      </button>
                                  </div>
                                  <p className="text-xs text-black/60 leading-relaxed mb-6 line-clamp-2">
                                      {entry.description}
                                  </p>
                                  <button 
                                    onClick={() => {
                                        setSynthesisResult(entry);
                                        setActiveTab('synthesis');
                                    }}
                                    className="w-full py-3 bg-[#f5f2ed] hover:bg-black hover:text-white text-black text-[10px] font-accent font-bold uppercase tracking-widest rounded-full transition-all"
                                  >
                                      Load Artifact
                                  </button>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-black/20">
                          <ClipboardList size={48} className="mb-4 opacity-10" />
                          <p className="text-[10px] font-accent font-bold uppercase tracking-widest">No Artifacts Saved</p>
                      </div>
                  )}
              </div>
          )}
      </div>

      {/* Standard Compounds / Scenarios (Shared or Context Aware) */}
      {activeTab === 'synthesis' && (
        <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
               <h3 className="text-[10px] font-accent font-bold uppercase tracking-[0.2em] text-black/30">Standard Phenomena</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
               {RECIPES.map(recipe => (
                   <button 
                      key={recipe.id}
                      onClick={() => loadPreset(recipe.id)}
                      className="flex items-center justify-between p-6 rounded-3xl border border-black/5 bg-[#f5f2ed]/50 hover:bg-white hover:shadow-xl transition-all group text-left"
                   >
                      <div>
                          <h4 className="text-xl font-display text-black mb-1 group-hover:text-black transition-colors">{recipe.name}</h4>
                          <div className="text-[10px] font-accent font-bold text-black/20 uppercase tracking-widest">
                              {recipe.formula}
                          </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center text-black/10 group-hover:text-black group-hover:scale-110 transition-all">
                          <Microscope size={20} />
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