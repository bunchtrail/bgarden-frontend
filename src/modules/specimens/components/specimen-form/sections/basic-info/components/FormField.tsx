import React from 'react';
import { TextField, Select, SelectOption } from '@/modules/ui';
import { Icon } from './Icon';

interface FormFieldProps {
  type: 'text' | 'select';
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  iconType?: 'document' | 'language' | 'sector' | 'classification';
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  options?: SelectOption[];
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  id,
  name,
  label,
  value,
  onChange,
  iconType,
  helperText,
  error,
  fullWidth = true,
  options
}) => {
  const startIcon = iconType ? <Icon type={iconType} /> : undefined;

  if (type === 'text') {
    return (
      <TextField
        id={id}
        name={name}
        label={label}
        value={value ?? ''}
        onChange={onChange}
        fullWidth={fullWidth}
        startIcon={startIcon}
        helperText={helperText}
        error={error}
      />
    );
  }
  
  if (type === 'select' && options) {
    return (
      <Select
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={(e) => {
          if (name === 'sectorType') {
            const numericValue = Number(e.target.value);
            onChange({
              ...e,
              target: {
                ...e.target,
                name,
                value: numericValue.toString()
              }
            } as React.ChangeEvent<HTMLSelectElement>);
          } else {
            onChange(e);
          }
        }}
        options={options}
        fullWidth={fullWidth}
        helperText={helperText}
        startIcon={startIcon}
        error={error}
      />
    );
  }
  
  return null;
}; 