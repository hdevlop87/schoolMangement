import Icon from '@/components/NIcon';
import React from 'react';

type TriggerProps = {
   isExpanded: boolean;
   toggleSidebar: () => void;
}

const SidebarTrigger: React.FC<TriggerProps> = ({ isExpanded, toggleSidebar }) => {
   return (
      <div className='absolute -right-2 top-12 bg-primary rounded-full cursor-pointer ' onClick={toggleSidebar}>
         <Icon icon='arrow' size={24} color='white' className={`transform ${isExpanded ? 'rotate-180' : ''} transition-transform duration-300`} />
      </div>
   )
}

export default SidebarTrigger