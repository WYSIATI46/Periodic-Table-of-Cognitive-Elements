import React from 'react';
import { CognitiveElement } from '../types';
import { GROUP_COLORS } from '../constants';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ElementTileProps {
  element: CognitiveElement;
  isSelected: boolean;
  isRelated: boolean;
  isDimmed: boolean;
  onToggle: (element: CognitiveElement) => void;
  onHover: (element: CognitiveElement | null) => void;
}

const ElementTile: React.FC<ElementTileProps> = ({ element, isSelected, isRelated, isDimmed, onToggle, onHover }) => {
  const colors = GROUP_COLORS[element.group];

  return (
    <motion.div
      layoutId={`element-${element.symbol}`}
      whileHover={{ scale: 1.02, zIndex: 20, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(element)}
      onMouseEnter={() => onHover(element)}
      onMouseLeave={() => onHover(null)}
      className={clsx(
        "relative w-full aspect-[4/4.5] cursor-pointer transition-all duration-500",
        "bg-white rounded-2xl overflow-hidden border",
        // Selection State
        isSelected 
            ? `border-black ring-1 ring-black shadow-2xl z-10` 
            : isRelated
                ? `border-black/40 ring-1 ring-black/20 scale-[1.02] shadow-xl`
                : "border-black/5",
        // Dimming State
        isDimmed && !isSelected && !isRelated ? "opacity-20 grayscale scale-95" : "opacity-100",
        // Shadow
        !isDimmed ? "shadow-sm hover:shadow-2xl" : "shadow-none"
      )}
    >
      <div className="flex flex-col h-full p-4 justify-between relative z-10">
        
        {/* Header: Atomic Number */}
        <div className="flex justify-between items-start text-[10px] font-accent font-bold leading-none opacity-20">
          <span>{element.atomicNumber.toString().padStart(2, '0')}</span>
          <element.icon size={10} />
        </div>

        {/* Center: Symbol */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className={clsx(
            "text-4xl font-display tracking-tighter transition-colors",
            isSelected ? "text-black" : "text-black/80"
          )}>
            {element.symbol}
          </h2>
        </div>

        {/* Footer: Name */}
        <div className="text-center w-full">
             <span className="text-[9px] uppercase tracking-[0.1em] text-black/40 font-accent font-bold block truncate w-full">
                {element.name}
             </span>
        </div>
      </div>
      
      {/* Subtle Group Indicator */}
      <div className={clsx("absolute top-0 left-0 bottom-0 w-1 opacity-20")} style={{ backgroundColor: colors.hex }}></div>
      
      {/* Related Indicator */}
      {isRelated && (
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default ElementTile;