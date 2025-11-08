'use client'
import React from 'react'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import ActionButton from '../NButtons/ActionButton'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { cva } from "class-variance-authority";

export const dialogVariants = cva(
   "flex flex-col w-full max-w-[95vw] h-full max-h-screen",
   {
      variants: {
         size: {
            sm: "lg:max-w-md",      // 448px (28rem)
            md: "lg:max-w-lg",      // 512px (32rem)
            lg: "lg:max-w-xl",      // 640px (40rem)
            xl: "lg:max-w-2xl",     // 768px (48rem)
            xxl: "lg:max-w-3xl",    // 896px (56rem)
            full: "lg:max-w-4xl",   // 1024px (64rem)
         },
         width: {
            sm: "lg:max-w-sm",      // 448px (28rem)
            md: "lg:max-w-md",      // 512px (32rem)
            lg: "lg:max-w-lg",      // 640px (40rem)
            xl: "lg:max-w-xl",     // 768px (48rem)
            xxl: "lg:max-w-2xl",    // 896px (56rem)
            "3xl": "lg:max-w-3xl",   // 1024px (64rem)
            "4xl": "lg:max-w-4xl",   // 1024px (64rem)
            "5xl": "lg:max-w-5xl",   // 1024px (64rem)
            "6xl": "lg:max-w-6xl",   // 1152px (72rem )
            full: "lg:max-w-7xl",   // 1280px (80rem )
            auto: "lg:w-auto",
         },
         height: {
            auto: "lg:h-auto lg:max-h-[95vh]",     // Content-based (auto-size)
            sm: "lg:h-[40vh]",                      // Small - 40% viewport (fixed)
            md: "lg:h-[60vh]",                      // Medium - 60% viewport (fixed)
            lg: "lg:h-[70vh]",                      // Large - 75% viewport (fixed)
            xl: "lg:h-[80vh]",                      // Extra Large - 85% viewport (fixed)
            xxl: "lg:h-[95vh]",                     // 2X Large - 95% viewport (fixed)
            full: "lg:h-[95vh]",                    // Full fixed height (95vh)
         },
      },
      defaultVariants: {
         size: "xl",
         width: "3xl",
         height: "auto",
      },
   }
);

const AsyncDialog = () => {
   const { dialogs, handlePrimaryClick, handleSecondaryClick, handleOpenChange } = useDialogStore();

   return (
      <>
         {dialogs.map((dialog, index) => {
            const {
               id,
               title,
               description,
               children,
               primaryButton,
               secondaryButton,
               showButtons,
               size,
               width,
               height,
               className,
            } = dialog;

            const noTitle = !title || title.trim() === '';
            const noDescription = !description || description.trim() === '';
            const noHeader = noTitle && noDescription;

            const createButtonHandler = (handler: () => Promise<void>, hasForm?: boolean) =>
               async (e?: React.FormEvent) => {
                  if (!hasForm && e) {
                     e.preventDefault();
                  }
                  await handler();
               };

            const handlePrimaryAction = createButtonHandler(
               () => handlePrimaryClick(id),
               !!primaryButton?.form
            );

            const handleSecondaryAction = createButtonHandler(
               () => handleSecondaryClick(id),
               !!secondaryButton?.form
            );

            return (
               <Dialog
                  key={id}
                  open={true}
                  onOpenChange={(open) => handleOpenChange(id, open)}
               >
                  <DialogContent
                     className={cn(
                        dialogVariants({ size, width, height }),
                        className
                     )}
                     style={{
                        zIndex: 50 + index, // Stack dialogs with increasing z-index
                     }}
                  >
                     <DialogHeader className={cn(noHeader && "sr-only")}>
                        <DialogTitle className={cn('text-primary', noTitle && "sr-only")}>
                           {title}
                        </DialogTitle>
                        <DialogDescription className={cn(noDescription && "sr-only")}>
                           {description}
                        </DialogDescription>
                     </DialogHeader>

                     {/* Scrollable content area */}
                     <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 -mx-1">
                        {children}
                     </div>

                     <DialogFooter className={cn(!showButtons && "sr-only")}>
                        {secondaryButton && (
                           <ActionButton
                              text={secondaryButton.text}
                              onClick={secondaryButton.form ? undefined : handleSecondaryAction}
                              disabled={secondaryButton.disabled || secondaryButton.loading || false}
                              variant={secondaryButton.variant || "outline"}
                              loading={secondaryButton.loading || false}
                              icon={secondaryButton.icon || "x"}
                              loadingText={secondaryButton.loadingText || "Processing..."}
                              form={secondaryButton.form}
                              className='w-auto'
                           />
                        )}

                        {primaryButton && (
                           <ActionButton
                              text={primaryButton.text}
                              onClick={primaryButton.form ? undefined : handlePrimaryAction}
                              disabled={primaryButton.disabled || primaryButton.loading || false}
                              variant={primaryButton.variant || "default"}
                              loading={primaryButton.loading || false}
                              icon={primaryButton.icon || "check"}
                              loadingText={primaryButton.loadingText || "Processing..."}
                              form={primaryButton.form}
                              className='w-auto'
                           />
                        )}
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            );
         })}
      </>
   );
};

export default AsyncDialog;