import { create } from "zustand";
import createSelectors from "./selectors";

interface MultiStepFormState {
   currentStep: number;
   totalSteps: number;
   formData: Record<number, any>;
   completedSteps: Set<number>;
}

interface MultiStepFormActions {
   setTotalSteps: (total: number) => void;
   goNext: () => void;
   goPrevious: () => void;
   goToStep: (stepNumber: number) => void;
   saveStepData: (stepNumber: number, data: any) => void;
   reset: () => void;
   isFirstStep: () => boolean;
   isLastStep: () => boolean;
   isStepCompleted: (stepNumber: number) => boolean;
   updateFormData: (data: any) => void;
}

type MultiStepForm = MultiStepFormState & MultiStepFormActions;

const createMultiStepFormStore = create<MultiStepForm>((set, get) => ({
   currentStep: 1,
   totalSteps: 2,
   formData: {},
   completedSteps: new Set(),

   setTotalSteps: (total: number) => set({ totalSteps: total }),

   goNext: () => {
      const { currentStep, totalSteps } = get();
      if (currentStep < totalSteps) {
         set({ currentStep: currentStep + 1 });
      }
   },

   goPrevious: () => {
      const { currentStep } = get();
      if (currentStep > 1) {
         set({ currentStep: currentStep - 1 });
      }
   },

   goToStep: (stepNumber: number) => {
      const { totalSteps, completedSteps } = get();
      if (stepNumber >= 1 && stepNumber <= totalSteps) {
         if (stepNumber === 1 || completedSteps.has(stepNumber - 1)) {
            set({ currentStep: stepNumber });
         }
      }
   },

   saveStepData: (stepNumber: number, data: any) => {
      set(state => ({
         formData: {
            ...state.formData,
            [stepNumber]: data
         },
         completedSteps: new Set([...state.completedSteps, stepNumber])
      }));
   },

   updateFormData: (data: any) => {
      set(state => ({
         formData: {
            ...state.formData,
            ...data
         }
      }));
   },

   reset: () => set({
      currentStep: 1,
      formData: {},
      completedSteps: new Set()
   }),

   // Getters
   isFirstStep: () => get().currentStep === 1,
   isLastStep: () => get().currentStep === get().totalSteps,
   isStepCompleted: (stepNumber: number) => get().completedSteps.has(stepNumber)

}));

export const useMultiStepFormStore = createSelectors(createMultiStepFormStore)