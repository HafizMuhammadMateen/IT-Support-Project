import React from "react";

const InputField = ({ label, type, name, value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default InputField;
