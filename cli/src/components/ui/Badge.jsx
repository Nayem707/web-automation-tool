const badgeStyles = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  neutral: 'bg-gray-100 text-gray-700',
};

const Badge = ({ label, tone = 'neutral' }) => {
  const toneClasses = badgeStyles[tone] || badgeStyles.neutral;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses}`}>
      {label}
    </span>
  );
};

export default Badge;
