import React from 'react'

import { Label } from '../ui/label'
import NIcon from '../NIcon'

const FormSectionHeader = ({
   icon,
   title,
   className = ''
}) => {
   return (
      <div className={`bg-primary w-auto text-white p-1 flex items-center gap-2 mb-3 ${className}`}>
         <NIcon icon={icon} className='w-5 h-5' />
         <Label className='text-sm font-semibold'>{title}</Label>
      </div>
   )
}

export default FormSectionHeader