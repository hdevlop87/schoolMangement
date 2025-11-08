import React from 'react'
import { StepIndicator } from './StepIndicator'
import StepsProgress from './StepsProgress';

const StepsHeader = ({ steps = [], currentStep = 1, }) => {

   return (
      <div className="relative flex items-center">
         <StepsProgress steps={steps} currentStep={currentStep} />

         {steps.map((step, index) => (
            <StepIndicator
               key={index}
               step={step}
               currentStep={currentStep}
            />
         ))}
      </div>
   );
}

export default StepsHeader