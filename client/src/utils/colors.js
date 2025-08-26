const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-600/20',
    badge: 'bg-blue-100 text-blue-600',
    hover: 'hover:bg-blue-100',
    gradient: 'bg-gradient-to-r from-blue-50 to-blue-100',
    border: 'border-blue-200',
    iconBg: 'bg-blue-500'
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    ring: 'ring-cyan-600/20',
    badge: 'bg-cyan-100 text-cyan-600',
    hover: 'hover:bg-cyan-100',
    gradient: 'bg-gradient-to-r from-cyan-50 to-cyan-100',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-500'
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-600/20',
    badge: 'bg-sky-100 text-sky-600',
    hover: 'hover:bg-sky-100',
    gradient: 'bg-gradient-to-r from-sky-50 to-sky-100',
    border: 'border-sky-200',
    iconBg: 'bg-sky-500'
  },
  lime: {
    bg: 'bg-lime-50',
    text: 'text-lime-700',
    ring: 'ring-lime-600/20',
    badge: 'bg-lime-100 text-lime-600',
    hover: 'hover:bg-lime-100',
    gradient: 'bg-gradient-to-r from-lime-50 to-lime-100',
    border: 'border-lime-200',
    iconBg: 'bg-lime-500'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    ring: 'ring-green-600/20',
    badge: 'bg-green-100 text-green-600',
    hover: 'hover:bg-green-100',
    gradient: 'bg-gradient-to-r from-green-50 to-green-100',
    border: 'border-green-200',
    iconBg: 'bg-green-500'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-600/20',
    badge: 'bg-emerald-100 text-emerald-600',
    hover: 'hover:bg-emerald-100',
    gradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-500'
  },
  violet: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-600/20',
    badge: 'bg-violet-100 text-violet-600',
    hover: 'hover:bg-violet-100',
    gradient: 'bg-gradient-to-r from-violet-50 to-violet-100',
    border: 'border-violet-200',
    iconBg: 'bg-violet-500'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    ring: 'ring-purple-600/20',
    badge: 'bg-purple-100 text-purple-600',
    hover: 'hover:bg-purple-100',
    gradient: 'bg-gradient-to-r from-purple-50 to-purple-100',
    border: 'border-purple-200',
    iconBg: 'bg-purple-500'
  },
  fuchsia: {
    bg: 'bg-fuchsia-50',
    text: 'text-fuchsia-700',
    ring: 'ring-fuchsia-600/20',
    badge: 'bg-fuchsia-100 text-fuchsia-600',
    hover: 'hover:bg-fuchsia-100',
    gradient: 'bg-gradient-to-r from-fuchsia-50 to-fuchsia-100',
    border: 'border-fuchsia-200',
    iconBg: 'bg-fuchsia-500'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-600/20',
    badge: 'bg-red-100 text-red-600',
    hover: 'hover:bg-red-100',
    gradient: 'bg-gradient-to-r from-red-50 to-red-100',
    border: 'border-red-200',
    iconBg: 'bg-red-500'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    ring: 'ring-yellow-600/20',
    badge: 'bg-yellow-100 text-yellow-600',
    hover: 'hover:bg-yellow-100',
    gradient: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-500'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-600/20',
    badge: 'bg-orange-100 text-orange-600',
    hover: 'hover:bg-orange-100',
    gradient: 'bg-gradient-to-r from-orange-50 to-orange-100',
    border: 'border-orange-200',
    iconBg: 'bg-orange-500'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-600/20',
    badge: 'bg-amber-100 text-amber-600',
    hover: 'hover:bg-amber-100',
    gradient: 'bg-gradient-to-r from-amber-50 to-amber-100',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-600/20',
    badge: 'bg-indigo-100 text-indigo-600',
    hover: 'hover:bg-indigo-100',
    gradient: 'bg-gradient-to-r from-indigo-50 to-indigo-100',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-500'
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    ring: 'ring-pink-600/20',
    badge: 'bg-pink-100 text-pink-600',
    hover: 'hover:bg-pink-100',
    gradient: 'bg-gradient-to-r from-pink-50 to-pink-100',
    border: 'border-pink-200',
    iconBg: 'bg-pink-500'
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-600/20',
    badge: 'bg-rose-100 text-rose-600',
    hover: 'hover:bg-rose-100',
    gradient: 'bg-gradient-to-r from-rose-50 to-rose-100',
    border: 'border-rose-200',
    iconBg: 'bg-rose-500'
  },
  stone: {
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    ring: 'ring-stone-600/20',
    badge: 'bg-stone-100 text-stone-600',
    hover: 'hover:bg-stone-100',
    gradient: 'bg-gradient-to-r from-stone-50 to-stone-100',
    border: 'border-stone-200',
    iconBg: 'bg-stone-500'
  },
  neutral: {
    bg: 'bg-neutral-50',
    text: 'text-neutral-700',
    ring: 'ring-neutral-600/20',
    badge: 'bg-neutral-100 text-neutral-600',
    hover: 'hover:bg-neutral-100',
    gradient: 'bg-gradient-to-r from-neutral-50 to-neutral-100',
    border: 'border-neutral-200',
    iconBg: 'bg-neutral-500'
  },
  zinc: {
    bg: 'bg-zinc-50',
    text: 'text-zinc-700',
    ring: 'ring-zinc-600/20',
    badge: 'bg-zinc-100 text-zinc-600',
    hover: 'hover:bg-zinc-100',
    gradient: 'bg-gradient-to-r from-zinc-50 to-zinc-100',
    border: 'border-zinc-200',
    iconBg: 'bg-zinc-500'
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    ring: 'ring-teal-600/20',
    badge: 'bg-teal-100 text-teal-600',
    hover: 'hover:bg-teal-100',
    gradient: 'bg-gradient-to-r from-teal-50 to-teal-100',
    border: 'border-teal-200',
    iconBg: 'bg-teal-500'
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    ring: 'ring-gray-600/20',
    badge: 'bg-gray-100 text-gray-600',
    hover: 'hover:bg-gray-100',
    gradient: 'bg-gradient-to-r from-gray-50 to-gray-100',
    border: 'border-gray-200',
    iconBg: 'bg-gray-500'
  },
  slate: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    ring: 'ring-slate-600/20',
    badge: 'bg-slate-100 text-slate-600',
    hover: 'hover:bg-slate-100',
    gradient: 'bg-gradient-to-r from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBg: 'bg-slate-500'
  }
};

// Helper functions for getting color classes
export const getColorClasses = (colorName, fallback = 'gray') => {
  return COLOR_MAP[colorName] || COLOR_MAP[fallback];
};

// Specific helper for category badges (commonly used pattern)
export const getCategoryBadgeClasses = (colorName) => {
  const colors = getColorClasses(colorName);
  return `${colors.bg} ${colors.text} px-2 py-1 rounded-full text-xs font-medium ring-1 ${colors.ring} ring-inset`;
};

// Helper for getting just the background class
export const getBgClass = (colorName) => {
  const colors = getColorClasses(colorName);
  return colors.bg;
};

export const getPreviewClass = (colorName) => {
  const colors = getColorClasses(colorName);
  return colors.iconBg;
};


// Helper for getting just the text class
export const getTextClass = (colorName) => {
  const colors = getColorClasses(colorName);
  return colors.text;
};

// For backwards compatibility with existing color strings
export const normalizeColor = (color) => {
  if (!color) return 'gray';
  return color.toLowerCase();
};