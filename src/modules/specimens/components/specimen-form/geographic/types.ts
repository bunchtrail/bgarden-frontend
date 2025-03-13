import { SpecimenFormData } from '../../../types';

export interface AdditionalFieldsProps {
  showAdvancedOptions: boolean;
  naturalRange: string;
  naturalRangeError?: string;
  naturalRangeTouched?: boolean;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleAdvancedOptions: () => void;
}

export interface CoordinatesSectionProps {
  latitude: number | null;
  longitude: number | null;
  latitudeError?: string;
  longitudeError?: string;
  latitudeTouched?: boolean;
  longitudeTouched?: boolean;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OriginSectionProps {
  regionId: string | number;
  country: string;
  regionIdError?: string;
  countryError?: string;
  regionIdTouched?: boolean;
  countryTouched?: boolean;
  formSubmitted: boolean;
  markFieldAsTouched: (name: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  regionOptions: { id: number; name: string }[];
}

export interface SelectedArea {
  id: string;
  name?: string;
  description?: string;
  regionId?: number;
}

export interface MapArea {
  id: string;
  name: string;
  description?: string;
  regionId?: number;
  coordinates: [number, number][];
}

export interface MapPlant {
  id: string;
  name: string;
  position: [number, number];
  type?: string;
  status?: string;
} 