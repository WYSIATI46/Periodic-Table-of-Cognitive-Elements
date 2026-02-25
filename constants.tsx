import { 
  ShieldAlert, Lock, Ban, History, // Defensive
  Filter, Anchor, Eye, Frame, // Processing
  Users, Crown, Heart, Megaphone, // Social
  Clock, Sparkles, TrendingUp, Trophy // Temporal
} from 'lucide-react';
import { CognitiveElement, ElementGroup } from './types';

// Color Mapping - Behavioral Themes
export const GROUP_COLORS = {
  [ElementGroup.DEFENSIVE]: {
    primary: 'text-rose-700',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    hover: 'hover:border-rose-400',
    active: 'ring-rose-400',
    badge: 'bg-rose-100 text-rose-800',
    hex: '#be123c',
    label: 'Defensive & Protective'
  },
  [ElementGroup.PROCESSING]: {
    primary: 'text-sky-700',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    hover: 'hover:border-sky-400',
    active: 'ring-sky-400',
    badge: 'bg-sky-100 text-sky-800',
    hex: '#0369a1',
    label: 'Info Processing'
  },
  [ElementGroup.SOCIAL]: {
    primary: 'text-purple-700',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
    hover: 'hover:border-purple-400',
    active: 'ring-purple-400',
    badge: 'bg-purple-100 text-purple-800',
    hex: '#7e22ce',
    label: 'Social & Tribal'
  },
  [ElementGroup.TEMPORAL]: {
    primary: 'text-amber-700',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    hover: 'hover:border-amber-400',
    active: 'ring-amber-400',
    badge: 'bg-amber-100 text-amber-800',
    hex: '#b45309',
    label: 'Temporal & Ego'
  }
};

export const ELEMENTS: CognitiveElement[] = [
  // ROW 1: Instinctual / Primal
  { 
    atomicNumber: 1, 
    symbol: 'La', 
    name: 'Loss Aversion', 
    group: ElementGroup.DEFENSIVE, 
    period: 1, 
    description: 'The pain of losing is twice as powerful as the pleasure of gaining.', 
    icon: ShieldAlert,
    relatedSymbols: ['Sc', 'Sq', 'Pb'] 
  },
  { 
    atomicNumber: 2, 
    symbol: 'Cb', 
    name: 'Confirm. Bias', 
    group: ElementGroup.PROCESSING, 
    period: 1, 
    description: 'Favoring information that confirms previously existing beliefs.', 
    icon: Filter,
    relatedSymbols: ['Ig', 'An', 'Fr']
  },
  { 
    atomicNumber: 3, 
    symbol: 'Sp', 
    name: 'Social Proof', 
    group: ElementGroup.SOCIAL, 
    period: 1, 
    description: 'Copying the actions of others in an attempt to undertake correct behavior.', 
    icon: Users,
    relatedSymbols: ['Au', 'Ig', 'Ha']
  },
  { 
    atomicNumber: 4, 
    symbol: 'Pb', 
    name: 'Present Bias', 
    group: ElementGroup.TEMPORAL, 
    period: 1, 
    description: 'Overvaluing immediate rewards at the expense of long-term intent.', 
    icon: Clock,
    relatedSymbols: ['Pl', 'La', 'Op']
  },

  // ROW 2: Structural / Pattern
  { 
    atomicNumber: 5, 
    symbol: 'Sq', 
    name: 'Status Quo', 
    group: ElementGroup.DEFENSIVE, 
    period: 2, 
    description: 'Preference for the current state of affairs; baseline is better.', 
    icon: Lock,
    relatedSymbols: ['La', 'Sc', 'An']
  },
  { 
    atomicNumber: 6, 
    symbol: 'An', 
    name: 'Anchoring', 
    group: ElementGroup.PROCESSING, 
    period: 2, 
    description: 'Relying too heavily on the first piece of information offered.', 
    icon: Anchor,
    relatedSymbols: ['Fr', 'Cb', 'Sq']
  },
  { 
    atomicNumber: 7, 
    symbol: 'Au', 
    name: 'Authority', 
    group: ElementGroup.SOCIAL, 
    period: 2, 
    description: 'Tendency to attribute greater accuracy to the opinion of an authority figure.', 
    icon: Crown,
    relatedSymbols: ['Sp', 'Ha']
  },
  { 
    atomicNumber: 8, 
    symbol: 'Op', 
    name: 'Optimism', 
    group: ElementGroup.TEMPORAL, 
    period: 2, 
    description: 'Belief that one is less at risk of experiencing a negative event.', 
    icon: Sparkles,
    relatedSymbols: ['Pl', 'Dk', 'Pb']
  },

  // ROW 3: Reactive / Emotional
  { 
    atomicNumber: 9, 
    symbol: 'Sc', 
    name: 'Sunk Cost', 
    group: ElementGroup.DEFENSIVE, 
    period: 3, 
    description: 'Continuing a behavior as a result of previously invested resources.', 
    icon: History,
    relatedSymbols: ['La', 'Sq', 'Re']
  },
  { 
    atomicNumber: 10, 
    symbol: 'Av', 
    name: 'Availability', 
    group: ElementGroup.PROCESSING, 
    period: 3, 
    description: 'Overestimating importance of information that is available/recent.', 
    icon: Eye,
    relatedSymbols: ['Fr', 'Ha', 'Sp']
  },
  { 
    atomicNumber: 11, 
    symbol: 'Ha', 
    name: 'Halo Effect', 
    group: ElementGroup.SOCIAL, 
    period: 3, 
    description: 'Positive impression of one trait influences feelings in other areas.', 
    icon: Heart,
    relatedSymbols: ['Au', 'Av', 'Ig']
  },
  { 
    atomicNumber: 12, 
    symbol: 'Dk', 
    name: 'Dunning-Krug', 
    group: ElementGroup.TEMPORAL, 
    period: 3, 
    description: 'Low ability people overestimate their ability.', 
    icon: Trophy,
    relatedSymbols: ['Op', 'Cb']
  },

  // ROW 4: Complex / Abstract
  { 
    atomicNumber: 13, 
    symbol: 'Re', 
    name: 'Reactance', 
    group: ElementGroup.DEFENSIVE, 
    period: 4, 
    description: 'Urge to do the opposite of what someone wants you to do to preserve freedom.', 
    icon: Ban,
    relatedSymbols: ['Sc', 'Au']
  },
  { 
    atomicNumber: 14, 
    symbol: 'Fr', 
    name: 'Framing', 
    group: ElementGroup.PROCESSING, 
    period: 4, 
    description: 'Drawing different conclusions depending on how data is presented.', 
    icon: Frame,
    relatedSymbols: ['An', 'Av', 'Cb']
  },
  { 
    atomicNumber: 15, 
    symbol: 'Ig', 
    name: 'In-Group', 
    group: ElementGroup.SOCIAL, 
    period: 4, 
    description: 'Favoring members of one\'s own group over out-group members.', 
    icon: Megaphone,
    relatedSymbols: ['Sp', 'Cb', 'Ha']
  },
  { 
    atomicNumber: 16, 
    symbol: 'Pl', 
    name: 'Planning', 
    group: ElementGroup.TEMPORAL, 
    period: 4, 
    description: 'Underestimating the time, costs, and risks of future actions.', 
    icon: TrendingUp,
    relatedSymbols: ['Op', 'Pb']
  },
];
