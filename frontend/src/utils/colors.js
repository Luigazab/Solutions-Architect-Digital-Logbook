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