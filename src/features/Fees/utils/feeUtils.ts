// ==================== CONSTANTS ====================

export const SCHEDULE_TYPES = {
   MONTHLY: 'monthly',
   QUARTERLY: 'quarterly',
   SEMESTER: 'semester',
   ANNUALLY: 'annually',
   ONE_TIME: 'oneTime',
} as const;

// ==================== TYPE DEFINITIONS ====================

export interface Fee {
   studentId?: string;
   feeTypeId: string;
   feeTypeName?: string;
   amount: number | string;
   schedule: string;
   totalAmount?: number | string;
   discountAmount?: number | string;
   status?: string;
   notes?: string;
}

export interface FeeType {
   id: string;
   name: string;
   amount: number | string;
   paymentType: string;
}

// ==================== FEE FACTORY ====================

export const FeeFactory = {
   createFromFeeType: (feeType: FeeType): Fee => ({
      studentId: '',
      feeTypeId: feeType.id,
      feeTypeName: feeType.name,
      amount: parseFloat(feeType.amount?.toString() || '0') || 0,
      schedule: feeType.paymentType === 'oneTime' ? SCHEDULE_TYPES.ONE_TIME : SCHEDULE_TYPES.MONTHLY,
      totalAmount: 0,
      discountAmount: 0,
      status: 'pending',
      notes: ''
   })
};

// ==================== FEE DATA TRANSFORMERS ====================

export const injectStudentIdToFees = (fees: Fee[], studentId: string): Fee[] => {
   return fees.map(fee => ({
      ...fee,
      studentId
   }));
};

export const prepareBulkFeesForSubmission = (formData: { fees?: Fee[] }, studentId: string) => {
   if (!formData.fees || !Array.isArray(formData.fees)) {
      return { fees: [] };
   }

   return {
      fees: injectStudentIdToFees(formData.fees, studentId)
   };
};

// ==================== FEE HELPERS ====================

export const getFeeTypeName = (feeTypes: FeeType[], feeTypeId: string): string => {
   const feeType = feeTypes.find(ft => ft.id === feeTypeId);
   return feeType?.name || '';
};

export const getFeeTypeById = (feeTypes: FeeType[], id: string): FeeType | undefined => {
   return feeTypes.find(ft => ft.id === id);
};

export const isOneTimePaymentType = (feeTypes: FeeType[], feeTypeId: string): boolean => {
   const feeType = getFeeTypeById(feeTypes, feeTypeId);
   return feeType?.paymentType === 'oneTime';
};