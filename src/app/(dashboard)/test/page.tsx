'use client'

import { z } from 'zod';
import NForm from '@/components/NForm';
import { BulkParentFormContent } from '@/features/Parents/components/BulkParentForm';
import { getParentDefaultValues } from '@/features/Parents/components/SimpleParentForm';
import { feesSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { BulkFeeFormContent } from '@/features/Fees/components/BulkFeeForm';
import { useFeeTypes } from '@/features/FeeTypes/hooks/useFeeTypes';

const Page = () => {


  const defaultValues = {
    fees: []
  }
  const { feeTypes, isFeeTypesLoading } = useFeeTypes();

  const handleSubmit = async (data) => {

  }

  return (
    <div >
      <NForm
        id='bulk-parents-form'
        schema={feesSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
      >
        <BulkFeeFormContent feeTypes={feeTypes} />
      </NForm>

      <Button form='bulk-parents-form' variant='default'>Submit</Button>
    </div>
  )
};

export default Page;

