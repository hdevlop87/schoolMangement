'use client'

import React from 'react'
import SimpleFeeForm from './SimpleFeeForm'
import BulkFeeForm from './BulkFeeForm'

const FeeForm = ({ fee = null, students = [], feeTypes = [] }) => {
   return fee
      ? <SimpleFeeForm fee={fee} feeTypes={feeTypes} />
      : <BulkFeeForm students={students} feeTypes={feeTypes} />

}

export default FeeForm
