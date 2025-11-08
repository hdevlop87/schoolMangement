'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import { useEffect, useRef } from 'react'
import { BookOpen } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { useFormContext } from 'react-hook-form'
import { assignmentsSchema } from '@/lib/validations'
import DynamicArray from '@/components/NForm/DynamicArray'
import { usePrefix } from '@/components/NForm/PrefixContext'

// ==================== COMPONENTS ====================

const AssignmentItem = ({ classes, subjects }) => {
   const { t } = useTranslation()
   const { setValue, watch } = useFormContext()
   const prefix = usePrefix()
   const prevClassIdRef = useRef(null)

   const selectedClassId = watch(`${prefix}.classId`)

   const classOptions = classes.map(cls => ({
      value: cls.id,
      label: cls.name
   }))

   const subjectOptions = subjects.map(sbj => ({
      value: sbj.id,
      label: sbj.name
   }))

   const selectedClass = classes.find(cls => cls.id === selectedClassId)

   const sectionOptions = selectedClass?.sections?.map(section => ({
      value: section.id,
      label: section.name
   })) ?? []

   useEffect(() => {
      if (prevClassIdRef.current !== null && prevClassIdRef.current !== selectedClassId) {
         setValue(`${prefix}.sectionIds`, [])
      }
      prevClassIdRef.current = selectedClassId
   }, [selectedClassId, prefix, setValue])

   return (
      <div className='space-y-3'>
         <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <FormInput
               name='classId'
               type='select'
               formLabel={t('teachers.form.class')}
               items={classOptions}
               placeholder={t('teachers.form.classPlaceholder')}
               required={true}
            />

            <FormInput
               name='sectionIds'
               type='multiselect'
               formLabel={t('teachers.form.sections')}
               items={sectionOptions}
               placeholder={t('teachers.form.sectionsPlaceholder')}
               disabled={!selectedClassId}
               required={true}
            />
         </div>

         <FormInput
            name='subjectIds'
            type='multiselect'
            formLabel={t('teachers.form.subjects')}
            items={subjectOptions}
            placeholder={t('teachers.form.subjectsPlaceholder')}
            required={true}
         />
      </div>
   )
}

export const AssignmentFormContent = ({ classes, subjects }) => {
   const { t } = useTranslation()

   const handleAddAssignment = (append) => {
      append({
         classId: '',
         sectionIds: [],
         subjectIds: [],
      })
   }

   return (
      <>
         <FormSectionHeader
            icon={BookOpen}
            title={t('teachers.form.assignmentInformation')}
         />

         <DynamicArray
            name="assignments"
            icon={BookOpen}
            title={t('teachers.form.assignment')}
            onAdd={handleAddAssignment}
         >
            <AssignmentItem classes={classes} subjects={subjects} />
         </DynamicArray>
      </>
   )
}

// ==================== MAIN FORM ====================

const AssignmentForm = ({ assignment = null, classes = [], subjects = [], teachers = [] }) => {
   const { handleConfirm } = useDialogStore()
   const { t } = useTranslation()

   const defaultValues = {
      teacherId: assignment?.teacherId || '',
      assignments: assignment?.assignments || []
   }

   const handleSubmit = async (assignmentData) => {
      handleConfirm(assignmentData)
   }

   const teacherOptions = teachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.name} - ${teacher.cin}`
   }))

   return (
      <NForm
         id='assignment-form'
         schema={assignmentsSchema}
         defaultValues={defaultValues}
         onSubmit={handleSubmit}
      >
         <FormInput
            name='teacherId'
            type='combobox'
            formLabel={t('teachers.form.teacher')}
            placeholder={t('teachers.form.teacherPlaceholder')}
            searchPlaceholder={t('teachers.form.searchTeacher') || 'Search teacher...'}
            emptyMessage={t('teachers.form.noTeacherFound') || 'No teacher found.'}
            items={teacherOptions}
            required={true}
         />

         <AssignmentFormContent
            classes={classes}
            subjects={subjects}
         />
      </NForm>
   )
}

export default AssignmentForm