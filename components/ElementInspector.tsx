
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
    <div className="bg-white rounded-[32px] shadow-2xl shadow-black/5 overflow-hidden h-64 relative flex flex-col border border-black/5">
      <div className="p-8 flex-grow relative">
        <AnimatePresence mode="wait">
          {element ? (
            <motion.div
              key={element.symbol}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex gap-8 h-full"
            >
              {/* Left: Big Symbol */}
              <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-black/5 pr-8">
                <span className={clsx("text-7xl font-display tracking-tighter text-black")}>
                  {element.symbol}
                </span>
                <span className="text-[10px] font-accent font-bold text-black/20 mt-2 tracking-widest uppercase">
                  No. {element.atomicNumber.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Right: Details */}
              <div className="flex flex-col justify-center gap-2 w-full">
                <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-3xl font-display text-black leading-none">{element.name}</h3>
                </div>
                
                <p className="text-sm text-black/60 leading-relaxed font-medium max-w-xs">
                    {element.description}
                </p>

                <div className="mt-4 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-accent font-bold text-black/30 uppercase tracking-wider">
                        <Fingerprint size={12} />
                        <span>Period {element.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-accent font-bold text-black/30 uppercase tracking-wider">
                        <Dna size={12} />
                        <span>Mass {(element.atomicNumber * 2.14).toFixed(2)}</span>
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
              className="absolute inset-0 flex flex-col items-center justify-center text-black/10 gap-4"
            >
                <ScanLine size={48} strokeWidth={1} className="opacity-20" />
                <p className="font-accent font-bold text-[10px] tracking-[0.3em] uppercase opacity-40">Awaiting Selection</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background Decor */}
        <div className="absolute right-8 bottom-8 opacity-[0.03] pointer-events-none">
             {element && <element.icon size={140} />}
        </div>
      </div>
    </div>
  );
};

export default ElementInspector;
