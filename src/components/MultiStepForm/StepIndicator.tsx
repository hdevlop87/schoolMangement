import React from 'react';
import { cva } from 'class-variance-authority';

const stepCircleVariants = cva(
   "w-9 h-9 rounded-full  flex items-center justify-center text-sm font-semibold transition-all duration-300 mb-3",
   {
      variants: {
         state: {
            completed: "bg-primary border-primary text-white shadow-lg",
            active: "bg-primary border-primary text-white shadow-md",
            inactive: "bg-background text-foreground border-1 border-foreground"
         }
      },
      defaultVariants: {
         state: "inactive"
      }
   }
);

const stepTitleVariants = cva(
   "text-sm font-medium mb-1 transition-all duration-300",
   {
      variants: {
         state: {
            completed: "text-primary",
            active: "text-primary font-semibold",
            inactive: "text-gray-500"
         }
      },
      defaultVariants: {
         state: "inactive"
      }
   }
);


const CheckIcon = () => (
   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
         fillRule="evenodd"
         d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
         clipRule="evenodd"
      />
   </svg>
);

const StepCircle = ({ state, stepNumber, isCompleted }) => (
   <div className={stepCircleVariants({ state })}>
      {isCompleted ? (
         <CheckIcon />
      ) : (
         <span aria-label={`Step ${stepNumber}`}>{stepNumber}</span>
      )}
   </div>
);

const StepContent = ({ state, title }) => (
   <div className={stepTitleVariants({ state })}>
      {title}
   </div>
);

const getStepState = (stepNumber: number, currentStep: number) => {
   if (stepNumber < currentStep) return 'completed';
   if (stepNumber === currentStep) return 'active';
   return 'inactive';
};

export const StepIndicator = ({ step, currentStep = 1 }) => {

   const { number: stepNumber, title } = step;
   const state = getStepState(stepNumber, currentStep);
   const isCompleted = state === 'completed';

   return (

      <div className="flex flex-col items-center text-center flex-1 z-20">
         <StepCircle
            state={state}
            stepNumber={stepNumber}
            isCompleted={isCompleted}
         />
         <StepContent
            state={state}
            title={title}
         />
      </div>
   );
};