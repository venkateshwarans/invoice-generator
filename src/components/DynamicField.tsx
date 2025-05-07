import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { FieldConfig } from '@/types/invoice';

interface DynamicFieldProps {
  id: string;
  field: FieldConfig;
  value: any;
  onChange: (value: any) => void;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  id,
  field,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = field.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value || ''}
            onChange={handleChange}
            placeholder={field.label}
            required={field.required}
            className="w-full"
          />
        );
      case 'number':
        return (
          <Input
            id={id}
            type="number"
            value={value || ''}
            onChange={handleChange}
            placeholder={field.label}
            required={field.required}
            className="w-full"
          />
        );
      case 'date':
        return (
          <Input
            id={id}
            type="date"
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            className="w-full"
          />
        );
      case 'email':
        return (
          <Input
            id={id}
            type="email"
            value={value || ''}
            onChange={handleChange}
            placeholder={field.label}
            required={field.required}
            className="w-full"
          />
        );
      case 'select':
        return (
          <select
            id={id}
            value={value || ''}
            onChange={handleChange}
            required={field.required}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'text':
      default:
        return (
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={handleChange}
            placeholder={field.label}
            required={field.required}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor={id} className="mb-2 block">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};
