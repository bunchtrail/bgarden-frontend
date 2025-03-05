import React from 'react';
import { formClasses } from '../../styles/global-styles';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <form className={`${formClasses.base} ${className}`} {...props}>
      {children}
    </form>
  );
};

interface FormControlProps {
  children: React.ReactNode;
  className?: string;
}

export const FormControl: React.FC<FormControlProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`${formClasses.control} ${className}`}>{children}</div>
  );
};

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <label className={`${formClasses.label} ${className}`} {...props}>
      {children}
    </label>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  className = '',
  ...props
}) => {
  return <input className={`${formClasses.input} ${className}`} {...props} />;
};

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  options,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <select className={`${formClasses.select} ${className}`} {...props}>
      {placeholder && (
        <option value='' disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  className = '',
  ...props
}) => {
  return (
    <textarea className={`${formClasses.textarea} ${className}`} {...props} />
  );
};

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className = '',
}) => {
  return <p className={`${formClasses.error} ${className}`}>{children}</p>;
};

export default {
  Form,
  FormControl,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  FormError,
};
