
import React from 'react';
import { CognitiveElement } from '../types';
import { GROUP_COLORS } from '../constants';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ScanLine, Fingerprint, Dna } from 'lucide-react';

interface ElementInspectorProps {
  element: CognitiveElement | null;
}

const ElementInspector: React.FC<ElementInspectorProps> = ({ element }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-48 relative flex flex-col">
      {/* Header Bar */}
      <div className="h-1 w-full bg-slate-100 flex">
        {element && (
          <motion.div 
            layoutId="inspector-bar"
            className="h-full w-full transition-colors duration-300"
            style={{ backgroundColor: GROUP_COLORS[element.group].hex }}
          />
        )}
      </div>

      <div className="p-5 flex-grow relative">
        <AnimatePresence mode="wait">
          {element ? (
            <motion.div
              key={element.symbol}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex gap-5 h-full"
            >
              {/* Left: Big Symbol */}
              <div className="flex flex-col items-center justify-center min-w-[80px] border-r border-slate-100 pr-5">
                <span className={clsx("text-5xl font-bold font-display tracking-tighter", GROUP_COLORS[element.group].primary)}>
                  {element.symbol}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  NO. {element.atomicNumber}
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-center gap-1 w-full">
                <div className="flex justify-between items-baseline border-b border-slate-50 pb-1 mb-1">
                    <h3 className="text-lg font-bold text-slate-800 leading-none">{element.name}</h3>
                    <span className={clsx("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded", GROUP_COLORS[element.group].badge)}>
                        {element.group}
                    </span>
                </div>
                
                <div className="flex items-start gap-2 mt-1">
                    <Activity size={14} className="text-slate-300 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {element.description}
                    </p>
                </div>

                <div className="mt-auto pt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Fingerprint size={12} />
                        <span>PER: {element.period}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Dna size={12} />
                        <span>WT: {(element.atomicNumber * 2.14).toFixed(2)}u</span>
                    </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-3"
            >
                <div className="relative">
                    <ScanLine size={48} strokeWidth={1} />
                    <div className="absolute top-0 w-full h-0.5 bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="font-mono text-xs tracking-widest uppercase">Awaiting Selection</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background Decor */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
             {element && <element.icon size={120} />}
        </div>
      </div>
    </div>
  );
};

export default ElementInspector;
