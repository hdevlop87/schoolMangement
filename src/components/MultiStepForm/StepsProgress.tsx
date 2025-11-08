import React from 'react';

const StepsProgress = ({ steps = [], currentStep = 1 }) => {
  const progressPercentage = steps.length > 1
    ? ((currentStep - 1) / (steps.length - 1)) * 100
    : 0;
  
  const firstStepCenter = steps.length > 1 ? (100 / steps.length) / 2 : 0;
  const lineWidth = steps.length > 1 ? 100 - (100 / steps.length) : 0;

  return (
    <div
      className="absolute h-0.5 mb-3 top-4"
      style={{
        left: `${firstStepCenter}%`,
        width: `${lineWidth}%`
      }}
    >
      <div className="absolute inset-0 bg-muted-foreground rounded-full"></div>
      <div
        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default StepsProgress;