export const NeutralFaceIcon = ({
   width = 36,
   height = 36,
   mainBg = '#4bd722',
   secondBg = '#377637',
   ...props
}) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 36 36"
      {...props}
   >
      <path fill={mainBg} d="M36 18c0 9.941-8.059 18-18 18c-9.94 0-18-8.059-18-18C0 8.06 8.06 0 18 0c9.941 0 18 8.06 18 18" />
      <ellipse cx={11.5} cy={16.5} fill={secondBg} rx={2.5} ry={3.5} />
      <ellipse cx={24.5} cy={16.5} fill={secondBg} rx={2.5} ry={3.5} />
      <path fill={secondBg} d="M25 26H11a1 1 0 1 1 0-2h14a1 1 0 1 1 0 2" />
   </svg>
);