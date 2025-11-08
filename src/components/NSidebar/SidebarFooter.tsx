import React from 'react'
import { SidebarItem } from './SidebarItem'
import { useLogout } from '@/hooks/useLogout';
import { useTranslation } from '@/hooks/useLanguage';

type FooterProps = {
    isExpanded: boolean;
}

const SidebarFooter: React.FC<FooterProps> = ({ isExpanded }) => {
    const { t } = useTranslation();
    const { logout } = useLogout();

    return (
        <div className='flex flex-col gap-2 mb-4'>
            <SidebarItem 
                name={t('navigation.settings')} 
                icon="gear" 
                path="/settings" 
                isExpanded={isExpanded}
            />
            <SidebarItem 
                name={t('navigation.logout')} 
                icon="logout" 
                isExpanded={isExpanded} 
                onClick={logout} 
            />
        </div>
    )
}

export default SidebarFooter