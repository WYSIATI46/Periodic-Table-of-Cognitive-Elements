import React from 'react';
import { CognitiveElement } from '../types';
import { GROUP_COLORS } from '../constants';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ElementTileProps {
  element: CognitiveElement;
  isSelected: boolean;
  onToggle: (element: CognitiveElement) => void;
  onHover: (element: CognitiveElement | null) => void;
}

const ElementTile: React.FC<ElementTileProps> = ({ element, isSelected, onToggle, onHover }) => {
  const colors = GROUP_COLORS[element.group];

  return (
    <motion.div
      layoutId={`element-${element.symbol}`}
      whileHover={{ scale: 1.05, zIndex: 10, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(element)}
      onMouseEnter={() => onHover(element)}
      onMouseLeave={() => onHover(null)}
      className={clsx(
        "relative w-full aspect-[4/4.5] cursor-pointer transition-all duration-200",
        "bg-white shadow-sm hover:shadow-xl rounded-sm overflow-hidden border",
        isSelected ? `border-transparent ring-2 ring-offset-2 ${colors.active} z-10` : "border-slate-200",
        colors.hover
      )}
    >
      {/* Selection Background Fill */}
      {isSelected && (
        <div className={clsx("absolute inset-0 opacity-10", colors.bg.replace('bg-', 'bg-current '))} style={{ color: colors.hex }}></div>
      )}

      <div className="flex flex-col h-full p-2 md:p-3 justify-between relative z-10">
        
        {/* Header: Atomic Number & Mass */}
        <div className="flex justify-between items-start text-[9px] md:text-[10px] font-mono leading-none">
          <span className="text-slate-500 font-medium">{element.atomicNumber}</span>
          <span className="text-slate-400 font-normal">{(element.atomicNumber * 2.14).toFixed(1)}</span>
        </div>

        {/* Center: Symbol & Icon */}
        <div className="flex flex-col items-center justify-center flex-grow -mt-2">
          <h2 className={clsx(
            "text-2xl md:text-4xl font-bold font-display tracking-tight",
            colors.primary
          )}>
            {element.symbol}
          </h2>
          <div className="mt-1 opacity-40">
            <element.icon size={12} className={colors.primary} />
          </div>
        </div>

        {/* Footer: Name */}
        <div className="text-center w-full">
             <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-slate-600 font-bold block truncate w-full">
                {element.name}
             </span>
        </div>
      </div>
      
      {/* Color Stripe at bottom */}
      <div className={clsx("absolute bottom-0 left-0 right-0 h-1.5 opacity-80", colors.bg.replace('bg-', 'bg-current'))} style={{ color: colors.hex }}></div>
    </motion.div>
  );
};

export default ElementTile;