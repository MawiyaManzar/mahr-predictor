import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className, ...props }) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        className={`w-full px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-colors
          ${error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-500'
          } ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
