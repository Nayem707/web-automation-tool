const variantStyles = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  ghost: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantClass = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
