export const getStyleColor = (style: string) => {
  switch (style) {
    case 'flirty': return 'bg-pink-900/30 text-pink-300';
    case 'dominant': return 'bg-red-900/30 text-red-300';
    case 'wholesome': return 'bg-green-900/30 text-green-300';
    case 'playful_dom': return 'bg-purple-900/30 text-purple-300';
    case 'seductive': return 'bg-rose-900/30 text-rose-300';
    case 'confident': return 'bg-blue-900/30 text-blue-300';
    case 'mysterious': return 'bg-indigo-900/30 text-indigo-300';
    case 'passionate': return 'bg-orange-900/30 text-orange-300';
    case 'sultry': return 'bg-amber-900/30 text-amber-300';
    case 'dreamy': return 'bg-teal-900/30 text-teal-300';
    case 'dark': return 'bg-violet-900/30 text-violet-300';
    default: return 'bg-gray-800 text-gray-300';
  }
};
