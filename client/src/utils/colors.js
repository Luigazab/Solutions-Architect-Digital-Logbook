export const COLOR_MAP = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-600/20',
    badge: 'bg-blue-100 text-blue-600',
    hover: 'hover:bg-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    ring: 'ring-green-600/20',
    badge: 'bg-green-100 text-green-600',
    hover: 'hover:bg-green-100'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    ring: 'ring-purple-600/20',
    badge: 'bg-purple-100 text-purple-600',
    hover: 'hover:bg-purple-100'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    ring: 'ring-red-600/20',
    badge: 'bg-red-100 text-red-600',
    hover: 'hover:bg-red-100'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    ring: 'ring-yellow-600/20',
    badge: 'bg-yellow-100 text-yellow-600',
    hover: 'hover:bg-yellow-100'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-600/20',
    badge: 'bg-orange-100 text-orange-600',
    hover: 'hover:bg-orange-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    ring: 'ring-indigo-600/20',
    badge: 'bg-indigo-100 text-indigo-600',
    hover: 'hover:bg-indigo-100'
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    ring: 'ring-pink-600/20',
    badge: 'bg-pink-100 text-pink-600',
    hover: 'hover:bg-pink-100'
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    ring: 'ring-teal-600/20',
    badge: 'bg-teal-100 text-teal-600',
    hover: 'hover:bg-teal-100'
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    ring: 'ring-gray-600/20',
    badge: 'bg-gray-100 text-gray-600',
    hover: 'hover:bg-gray-100'
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