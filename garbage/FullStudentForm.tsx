'use client'

import React from 'react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import FormGroup from '@/components/NForm/FormGroup'
import { Button } from '@/components/ui/button'
import SimpleStudentForm from './SimpleStudentForm'
import ParentForm from '@/features/Parents/components/SimpleParentForm'
import BulkFeeForm from '@/features/Fees/components/ddd'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NIcon from '@/components/NIcon'

const FullStudentForm = ({ student = null, classes = [], feeTypes = [], mode = 'create' }) => {

  const { t } = useTranslation();
  const { handleConfirm } = useDialogStore();

  const handleFormGroupSubmit = async (allData) => {
    handleConfirm({
      student: allData['simple-student-form'] || {},
      father: allData['father-form'] || {},
      mother: allData['mother-form'] || {},
      fees: allData['bulk-fees-form'] || [],
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <FormGroup
        id='full-student-form-group'
        onSubmit={handleFormGroupSubmit}
        className='flex flex-col gap-6'
      >
        {/* Tabs Layout */}
        <Tabs defaultValue="student" className="w-full">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 cursor-pointer">
            <TabsTrigger
              value="student"
              className="cursor-pointer data-[state=active]:!text-primary rounded-none border-2 !border-transparent data-[state=active]:!border-b-primary data-[state=active]:shadow-none data-[state=active]:!bg-transparent"
            >
              <NIcon icon='studentOutline' />
              {t('students.tabs.studentData')}
            </TabsTrigger>

            <TabsTrigger
              value="parent"
              className="cursor-pointer data-[state=active]:!text-primary rounded-none border-2 !border-transparent data-[state=active]:!border-b-primary data-[state=active]:shadow-none data-[state=active]:!bg-transparent"
            >
              <NIcon icon='parentOutline' />
              {t('students.tabs.parentData')}
            </TabsTrigger>

            <TabsTrigger
              value="fees"
              className="cursor-pointer data-[state=active]:!text-primary rounded-none border-2 !border-transparent data-[state=active]:!border-b-primary data-[state=active]:shadow-none data-[state=active]:!bg-transparent"
            >
              <NIcon icon='feesOutline' />
              {t('students.tabs.feesData')}
            </TabsTrigger>
          </TabsList>

          {/* Student Data Tab */}
          <TabsContent value="student" className="space-y-2">
            <SimpleStudentForm student={student} classes={classes} />
          </TabsContent>

          {/* Parent Data Tab */}
          <TabsContent value="parent" className="space-y-4">
            <div className="flex flex-col gap-2">
              <ParentForm
                parent={null}
                defaultGender="M"
                isCompactMode={true}
              />
              <ParentForm
                parent={null}
                defaultGender="F"
                isCompactMode={true}
              />
            </div>
          </TabsContent>

          {/* Fees Data Tab */}
          <TabsContent value="fees" className="space-y-4">
            <BulkFeeForm feeTypes={feeTypes} />
          </TabsContent>
        </Tabs>
      </FormGroup>
    </div>
  )
}

export default FullStudentForm