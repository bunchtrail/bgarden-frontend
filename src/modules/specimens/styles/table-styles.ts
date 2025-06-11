// Table styles for specimens module
// These styles can be used as an alternative to inline Tailwind classes

// Table container styles
export const tableContainerClasses = {
  base: 'overflow-hidden rounded-xl border border-[#E5E5EA]/80',
  scrollContainer: 'overflow-x-auto',
};

// Table styles
export const tableClasses = {
  base: 'min-w-full divide-y divide-[#E5E5EA]',
};

// Table header styles
export const tableHeaderClasses = {
  base: 'bg-[#F5F5F7]/80',
  cell: 'px-6 py-4 text-left text-xs font-medium text-[#86868B] uppercase tracking-wider',
  sortable:
    'cursor-pointer hover:bg-[#E5E5EA]/70 transition-colors duration-200',
  sortIconActive: 'text-[#0A84FF]',
  sortIconInactive: 'text-[#AEAEB2]',
};

// Table body styles
export const tableBodyClasses = {
  base: 'bg-white/80 divide-y divide-[#E5E5EA]',
  emptyMessage: 'px-6 py-8 text-center text-[#86868B]',
};

// Animation classes for table rows
export const tableRowAnimationClasses = {
  staggered: 'animate-staggeredFadeIn',
};

// Column width classes
export const columnWidths = {
  name: 'w-1/4',
  inventoryNumber: 'w-1/6',
  family: 'w-1/6',
  sector: 'w-1/6',
  actions: 'w-1/6',
};
