import Icon from "@/components/NIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

type SidebarItemProps = {
   name: string;
   icon: string;
   path?: string;
   onClick?: () => void;
   isExpanded?: boolean;
   isGroup?: boolean;
   isOpen?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
   name,
   icon,
   path,
   onClick,
   isExpanded,
   isGroup = false,
   isOpen = false
}) => {

   const pathname = usePathname();
   const isActive = path ? pathname === path : false;
   const itemClasses = `flex items-center gap-2 p-2 rounded-lg ${isActive ? 'bg-primary' : 'hover:bg-accent hover:text-sidebar-accent-foreground'}`;

   // Group item (clickable with arrow)
   if (isGroup) {
      return (
         <div className={`${itemClasses} cursor-pointer justify-between`} onClick={onClick}>
            <div className="flex items-center gap-2">
               <Icon icon={icon} size={18}/>
               {isExpanded && <span className='text-sm'>{name}</span>}
            </div>
            {isExpanded && (
               <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
               />
            )}
         </div>
      );
   }

   // Regular link item
   if (path) {
      return (
         <Link href={path} className={itemClasses}>
            <Icon icon={icon}  size={20}/>
            {isExpanded && <span className='text-sm'>{name}</span>}
         </Link>
      );
   }

   // Clickable item without path
   return (
      <div className={`${itemClasses} cursor-pointer`} onClick={onClick}>
         <Icon icon={icon} size={18}/>
         {isExpanded && <span className='text-sm'>{name}</span>}
      </div>
   );
};