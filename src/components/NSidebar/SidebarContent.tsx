import React, { useState } from 'react'
import { SidebarItem } from './SidebarItem';
import { useTranslation } from '@/hooks/useLanguage';
import { RoleGuard } from '../NGuard/RoleGuard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type ContentProps = {
   isExpanded: boolean;
}

const SidebarContent: React.FC<ContentProps> = ({ isExpanded }) => {
   const { t } = useTranslation();
   const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

   // All sidebar items
   const sidebarItems = [
      {
         name: t('navigation.dashboard'),
         icon: 'dashboard',
         path: '/',
         minRole: 'teacher'
      },
      {
         name: t('navigation.students'),
         icon: 'student',
         path: '/students',
         minRole: 'teacher'
      },
      {
         name: t('navigation.teachers'),
         icon: 'teacher',
         path: '/teachers',
         minRole: 'admin'
      },
      {
         name: t('navigation.parents'),
         icon: 'parents',
         path: '/parents',
         minRole: 'teacher'
      },
      {
         name: t('navigation.fees'),
         icon: 'fees',
         path: '/fees',
         minRole: 'admin'
      },

      {
         name: t('navigation.expenses'),
         icon: 'expense',
         path: '/expenses',
         minRole: 'admin'
      },
      // {
      //    name: t('navigation.attendance'),
      //    icon: 'attendance',
      //    path: '/attendance',
      //    minRole: 'teacher'
      // },
      // {
      //    name: t('navigation.exams'),
      //    icon: 'exam',
      //    path: '/exams',
      //    minRole: 'teacher'
      // },
      // {
      //    name: t('navigation.calendar'),
      //    icon: 'calendar',
      //    path: '/calendar',
      //    minRole: 'teacher'
      // },
      // {
      //    name: t('navigation.events'),
      //    icon: 'event',
      //    path: '/events',
      //    minRole: 'teacher'
      // },
      // {
      //    name: t('navigation.announcements'),
      //    icon: 'announcement',
      //    path: '/announcements',
      //    minRole: 'teacher'
      // },
      // {
      //    name: t('navigation.roles'),
      //    icon: 'fingerPrint',
      //    path: '/roles',
      //    minRole: 'admin'
      // }
      {
         name: 'Academic',
         icon: 'school',
         isGroup: true,
         children: [
            {
               name: t('navigation.classes'),
               icon: 'classe',
               path: '/classes',
               minRole: 'teacher'
            },
            {
               name: t('navigation.sections'),
               icon: 'section',
               path: '/sections',
               minRole: 'teacher'
            },
            {
               name: t('navigation.subjects'),
               icon: 'subject',
               path: '/subjects',
               minRole: 'teacher'
            },
            {
               name: t('navigation.feeTypes'),
               icon: 'feeType',
               path: '/fee-types',
               minRole: 'admin'
            }
         ]
      },
      {
         name: t('navigation.transport'),
         icon: 'bus',
         isGroup: true,
         minRole: 'admin',
         children: [
            {
               name: t('navigation.drivers'),
               icon: 'driver',
               path: '/drivers',
               minRole: 'admin'
            },
            {
               name: 'Vehicles',
               icon: 'bus',
               path: '/vehicles',
               minRole: 'admin'
            }
         ]
      }
   ];

   const toggleGroup = (groupKey: string) => {
      setOpenGroups(prev => ({
         ...prev,
         [groupKey]: !prev[groupKey]
      }));
   };

   return (
      <div className='flex flex-col gap-2'>
         {sidebarItems.map((item, index) => {
            if (item.isGroup && item.children) {
               const groupKey = `group-${index}`;
               const isOpen = openGroups[groupKey] || false;

               return (
                  <Collapsible
                     key={groupKey}
                     open={isOpen}
                     onOpenChange={() => toggleGroup(groupKey)}
                  >
                     <CollapsibleTrigger asChild>
                        <div>
                           <SidebarItem
                              name={item.name}
                              icon={item.icon}
                              isExpanded={isExpanded}
                              isGroup={true}
                              isOpen={isOpen}
                           />
                        </div>
                     </CollapsibleTrigger>
                     <CollapsibleContent className='flex flex-col gap-2 mt-2 ml-2'>
                        {item.children.map((child: any) => (
                           <RoleGuard
                              key={child.path}
                              minRole={child.minRole}
                           >
                              <SidebarItem
                                 name={child.name}
                                 icon={child.icon}
                                 path={child.path}
                                 isExpanded={isExpanded}
                              />
                           </RoleGuard>
                        ))}
                     </CollapsibleContent>
                  </Collapsible>
               );
            }

            return (
               <RoleGuard
                  key={item.path}
                  minRole={item.minRole}
               >
                  <SidebarItem
                     name={item.name}
                     icon={item.icon}
                     path={item.path}
                     isExpanded={isExpanded}
                  />
               </RoleGuard>
            );
         })}
      </div>
   )
}

export default SidebarContent