import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching family names for specimens
 * @returns An array of family names
 */
export function useFamilyNames() {
  const [familyNames, setFamilyNames] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    const mockFamilyNames = [
      'Rosaceae',
      'Fabaceae',
      'Pinaceae',
      'Asteraceae',
      'Poaceae',
      'Orchidaceae',
      'Malvaceae',
    ];

    // Simulate API delay
    const timer = setTimeout(() => {
      setFamilyNames(mockFamilyNames);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return familyNames;
}

// Export as default for convenience
export default useFamilyNames;
