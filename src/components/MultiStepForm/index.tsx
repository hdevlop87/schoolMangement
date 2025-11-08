import React, { useEffect } from 'react';
import { z } from 'zod';
import StepsHeader from './StepsHeader';
import { useMultiStepFormStore } from '@/stores/MultiStepFormStore';
import { useDialogStore } from '@/stores/MultiDialogStore';
import { useTranslation } from '@/hooks/useLanguage';
import NForm from '../NForm';

interface MultiStepFormProps {
   children: React.ReactNode;
   schema: z.ZodObject<any>;
   defaultValues?: any;
   onSubmit?: (data: any) => void | Promise<void>;
   onCancel?: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
   children,
   onSubmit,
   onCancel,
   schema,
   defaultValues = {}
}) => {
   const { t } = useTranslation();
   const currentStep = useMultiStepFormStore.use.currentStep();
   const goNext = useMultiStepFormStore.use.goNext();
   const goPrevious = useMultiStepFormStore.use.goPrevious();
   const reset = useMultiStepFormStore.use.reset();
   const updateFormData = useMultiStepFormStore.use.updateFormData();
   const formData = useMultiStepFormStore.use.formData();
   const setTotalSteps = useMultiStepFormStore.use.setTotalSteps();

   const {
      updatePrimaryButton,
      updateSecondaryButton,
      updateShowButtons,
      popDialog,
      getCurrentDialog,
   } = useDialogStore();

   const [ownerDialogId, setOwnerDialogId] = React.useState<string | null>(null);

   React.useEffect(() => {
      const currentDialog = getCurrentDialog();
      if (currentDialog) {
         setOwnerDialogId(currentDialog.id);
      }
   }, []);

   const stepChildren = React.Children.toArray(children);
   const totalSteps = stepChildren.length;
   const currentStepComponent: any = stepChildren[currentStep - 1];
   const isLastStep = currentStep === totalSteps;
   const isFirstStep = currentStep === 1;

   const currentStepKey = currentStepComponent?.props?.id;

   const currentStepSchema = currentStepKey && schema.shape[currentStepKey]
      ? schema.shape[currentStepKey]
      : schema;

   const steps = stepChildren.map((child: any, index) => ({
      number: index + 1,
      title: child?.props.title || `Step ${index + 1}`
   }));

   const handleStepSubmit = async (stepData) => {
      let dataToStore = stepData;

      if (
         currentStepKey &&
         typeof stepData === 'object' &&
         !Array.isArray(stepData) &&
         Object.keys(stepData).length === 1 &&
         Object.keys(stepData)[0] === currentStepKey
      ) {
         dataToStore = stepData[currentStepKey];
      }

      const wrappedStepData = currentStepKey
         ? { [currentStepKey]: dataToStore }
         : dataToStore;

      const updatedFormData = { ...formData, ...wrappedStepData };
      updateFormData(updatedFormData);

      if (currentStep < totalSteps) {
         goNext();
      } else {
         const validatedData = schema.parse(updatedFormData);
         await onSubmit?.(updatedFormData);
      }
   };

   const handlePrevious = () => {
      if (!isFirstStep) {
         goPrevious();
      }
   };

   const handleCancel = () => {
      reset();
      if (onCancel) {
         onCancel();
      } else {
         popDialog(null);
      }
   };

   useEffect(() => {
      if (!ownerDialogId) return;

      updatePrimaryButton({
         text: isLastStep ? t('common.confirm') : t('common.next'),
         variant: 'default',
         form: currentStepComponent?.props.id,
         loading: false,
         disabled: false
      }, ownerDialogId);

      updateSecondaryButton({
         text: isFirstStep ? t('common.cancel') : t('common.previous'),
         variant: 'secondary',
         icon: isFirstStep ? 'x' : 'chevronLeft',
         onClick: isFirstStep ? handleCancel : handlePrevious,
         loading: false,
         disabled: false
      }, ownerDialogId);

      updateShowButtons(true, ownerDialogId);

   }, [currentStep, isFirstStep, isLastStep, ownerDialogId]);

   useEffect(() => {
      return () => {
         reset();
      };
   }, []);

   useEffect(() => {
      setTotalSteps(totalSteps);
   }, [totalSteps, setTotalSteps]);

   const currentStepDefaultValues = (() => {
      const stepData = currentStepKey && formData[currentStepKey]
         ? formData[currentStepKey]
         : (currentStepKey && defaultValues[currentStepKey]) || {};

      if (Array.isArray(stepData)) {
         return { [currentStepKey]: stepData };
      }

      return stepData;
   })();

   return (
      <div className="flex w-full flex-col justify-center gap-4">
         <StepsHeader steps={steps} currentStep={currentStep} />

         <NForm
            key={currentStepComponent?.props.id}
            id={currentStepComponent?.props.id}
            schema={currentStepSchema}
            defaultValues={currentStepDefaultValues}
            onSubmit={handleStepSubmit}
         >
            {currentStepComponent.props.children}
         </NForm>
      </div>
   );
};

export default MultiStepForm;