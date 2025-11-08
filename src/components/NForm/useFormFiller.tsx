import { generateClass, generateDriver, generateFeeType, generateFees, generateParent, generateParents, generateSection, generateStudent, generateSubject, generateTeacher, generateVehicle } from '@/lib/DataGenerator';
import { useEffect } from 'react';
import { useMultiStepFormStore } from '@/stores/MultiStepFormStore';

// Multi-step form configurations
const MULTI_STEP_FORMS = {
  fullStudent: {
    steps: ['student', 'parents', 'fees'],
    generator: () => {
      return {
        student: generateStudent(),
        parents: generateParents(),
        fees: generateFees()
      };
    }
  },
  fullTeacher: {
    steps: ['personal', 'professional', 'assignments'],
    generator: () => {
      const teacher = generateTeacher();
      return {
        personal: {
          id: teacher.id,
          name: teacher.name,
          cin: teacher.cin,
          email: teacher.email,
          phone: teacher.phone,
          address: teacher.address,
          gender: teacher.gender,
          emergencyContact: teacher.emergencyContact,
          emergencyPhone: teacher.emergencyPhone,
          status: teacher.status,
        },
        professional: {
          specialization: teacher.specialization,
          yearsOfExperience: teacher.yearsOfExperience,
          salary: teacher.salary,
          hireDate: teacher.hireDate,
          bankAccount: teacher.bankAccount,
          employmentType: teacher.employmentType,
          workloadHours: teacher.workloadHours,
          academicDegrees: teacher.academicDegrees,
        },
        assignments: teacher.assignments || []

      };
    }
  }
};

const getMultiStepConfig = (formType) => {
  for (const config of Object.values(MULTI_STEP_FORMS)) {
    if (config.steps.includes(formType)) {
      return config;
    }
  }
  return null;
};

export const useFormFiller = (form, formId) => {

  const updateFormData = useMultiStepFormStore.use.updateFormData();

  useEffect(() => {

    const handleKeyPress = (e) => {

      if (e.key === 'F8') {
        e.preventDefault();
        let formType = formId.replace('-form', '');

        if (formType.includes('-step')) {
          const parts = formType.split('-');
          formType = parts[0];
        }

        const multiStepConfig = getMultiStepConfig(formType);

        if (multiStepConfig) {
          const allData = multiStepConfig.generator();
          updateFormData(allData);
          const currentStepData = allData[formType];
          if (currentStepData) {
            form.reset(currentStepData);
          }
          return;
        }

        let testData;

        switch (formType) {
          case 'parent':
            testData = generateParent();
            break;
          case 'student':
            testData = generateStudent();
            break;
          case 'fees':
            testData = { fees: generateFees() };
            break;
          case 'bulk-parents':
            const parents = generateParents();
            form.setValue('parents', parents);
            break;

          case 'bulk-fee':
            const fees = generateFees();
            form.setValue('fees', fees);
            break;
          case 'class':
            testData = generateClass();
            break;
          case 'section':
            testData = generateSection();
            break;
          case 'subject':
            testData = generateSubject();
            break;
          case 'fee-type':
            testData = generateFeeType();
            break;
          case 'vehicle':
            testData = generateVehicle();
            break;
          case 'driver':
            testData = generateDriver();
            break;
          case 'teacher':
            testData = generateTeacher();
            break;

          default:
            return;
        }

        if (testData) {
          form.reset(testData);
        }

      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [form, formId, updateFormData]);
};