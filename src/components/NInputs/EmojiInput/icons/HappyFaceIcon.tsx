export const HappyFaceIcon = ({
   width = 36,
   height = 36,
   mainBg = '#4bd722',
   secondBg = '#377637',
   ...props
}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}  viewBox="0 0 36 36"  {...props}>
      <circle cx={18} cy={18} r={18} fill={mainBg}></circle>
      <path fill={secondBg} d="M18 21c-3.623 0-6.027-.422-9-1c-.679-.131-2 0-2 2c0 4 4.595 9 11 9c6.404 0 11-5 11-9c0-2-1.321-2.132-2-2c-2.973.578-5.377 1-9 1"></path>
      <ellipse cx={12} cy={13.5} fill={secondBg} rx={2.5} ry={3.5}></ellipse>
      <ellipse cx={24} cy={13.5} fill={secondBg} rx={2.5} ry={3.5}></ellipse>
   </svg>
);


