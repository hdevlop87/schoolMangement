export const SmileyFaceIcon = ({
  width = 34,
  height = 34,
  mainBg = '#4bd722', // Main background color
  secondBg = '#377637', // Smile and eyes color
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 62 61"
    {...props} // Spread additional props (like className, onClick, etc.)
  >
    <circle cx={32} cy={32} r={30} fill={mainBg} />
    <g fill={secondBg}>
      <circle cx={20.5} cy={24.6} r={5} />
      <circle cx={43.5} cy={24.6} r={5} />
      <path d="M48.1 37c-4.3 6.1-9.5 7.6-16.1 7.6S20.2 43.1 15.9 37c-.6-.8-2.2-.3-1.8.9c2.3 8 10 12.7 18 12.7s15.7-4.7 18-12.7c.2-1.2-1.4-1.7-2-.9" />
    </g>
  </svg>
);
