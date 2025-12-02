import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  subtext?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, subtext, className, ...props }) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        className={`w-full px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-colors
          ${error 
            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
            : 'border-slate-300 focus:ring-emerald-200 focus:border-emerald-500'
          } ${className}`}
        {...props}
      />
      {subtext && !error && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};