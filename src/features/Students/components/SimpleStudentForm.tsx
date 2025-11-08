'use client'

import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import FormSectionHeader from '@/components/NForm/FormHeader'
import { IdCard, BookOpen, Lock } from 'lucide-react'
import { useDialogStore } from '@/stores/MultiDialogStore'
import { useTranslation } from '@/hooks/useLanguage'
import { useFormContext } from 'react-hook-form'
import { studentSchema } from '@/lib/validations';
import { useEnum } from '@/hooks/useEnum'

export const getStudentDefaultValues = (student = null) => ({
  ...(student?.id && { id: student.id }),
  studentCode: student?.studentCode ?? '',
  name: student?.name ?? '',
  email: student?.email ?? '',
  phone: student?.phone ?? '',
  address: student?.address ?? '',
  dateOfBirth: student?.dateOfBirth ?? '',
  gender: student?.gender ?? 'M',
  classId: student?.classId ?? '',
  sectionId: student?.sectionId ?? '',
  enrollmentDate: student?.enrollmentDate ?? new Date().toISOString().split('T')[0],
  medicalConditions: student?.medicalConditions ?? '',
  previousSchool: student?.previousSchool ?? '',
  image: student?.user?.image ?? null,
  password: '',
  status: student?.status ?? 'active',
})

const SimpleStudentForm = ({ student = null, classes = [] }) => {

  const { handleConfirm } = useDialogStore();

  const handleSubmit = async (studentData) => {
    handleConfirm(studentData);
  }

  return (
    <NForm
      id='student-form'
      schema={studentSchema}
      defaultValues={getStudentDefaultValues(student)}
      onSubmit={handleSubmit}
    >
      <StudentFormContent classes={classes} />
    </NForm>
  )
}

export const StudentFormContent = ({ classes = [], prefix = '' }) => {

  const { t } = useTranslation();
  const { watch } = useFormContext();
  const fieldName = (field) => prefix ? `${prefix}.${field.charAt(0)}${field.slice(1)}` : field;

  const selectedClassId = watch(fieldName('classId'));
  const gender = watch(fieldName('gender'))

  const classOptions = classes.map(cls => ({
    value: cls.id,
    label: cls.name
  }))

  const selectedClass = classes.find(cls => cls.id === selectedClassId);
  const sectionOptions = selectedClass?.sections?.map(section => ({
    value: section.id,
    label: section.name
  })) ?? [];

  const genderOptions = useEnum('gender')

  const defaultImage = gender === 'M'
    ? '/images/boy.png' : '/images/girl.png'

  return (
    <div className='space-y-2'>

      <FormSectionHeader
        icon={IdCard}
        title={t('students.form.personalData')}
      />

      <div className='grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6'>
        <div className='flex items-start justify-center'>
          <FormInput
            name='image'
            type='image'
            formLabel={t('students.form.studentImage')}
            showPreview={true}
            previewPosition='top'
            imageSize='lg'
            allowClear={true}
            defaultImage={defaultImage}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <FormInput
            name='studentCode'
            type='text'
            formLabel={t('students.form.studentCode')}
            placeholder={t('students.form.studentCodePlaceholder')}
            required={true}
          />

          <FormInput
            name='name'
            type='text'
            formLabel={t('students.form.fullName')}
            placeholder={t('students.form.fullNamePlaceholder')}
            required={true}
          />

          <FormInput
            name='gender'
            type='select'
            formLabel={t('students.form.gender')}
            items={genderOptions}
            required={true}
          />

          <FormInput
            name='dateOfBirth'
            type='date'
            formLabel={t('students.form.dateOfBirth')}
            placeholder={t('students.form.dateOfBirthPlaceholder')}
          />

          <FormInput
            name='phone'
            type='text'
            formLabel={t('students.form.phone')}
            placeholder={t('students.form.phonePlaceholder')}
          />

          <FormInput
            name='address'
            type='text'
            formLabel={t('students.form.address')}
            placeholder={t('students.form.addressPlaceholder')}
          />

          <div className='md:col-span-2'>
            <FormInput
              name='medicalConditions'
              type='textarea'
              formLabel={t('students.form.medicalConditions')}
              placeholder={t('students.form.medicalConditionsPlaceholder')}
            />
          </div>
        </div>
      </div>

      <FormSectionHeader
        icon={BookOpen}
        title={t('students.form.academicInformation')}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <FormInput
          name='classId'
          type='select'
          formLabel={t('students.form.class')}
          placeholder={t('students.form.classPlaceholder')}
          items={classOptions}
          required={true}
        />

        <FormInput
          name='sectionId'
          type='select'
          formLabel={t('students.form.section')}
          placeholder={t('students.form.sectionPlaceholder')}
          items={sectionOptions}
          required={true}
        />

        <FormInput
          name='enrollmentDate'
          type='date'
          formLabel={t('students.form.enrollmentDate')}
          placeholder={t('students.form.enrollmentDatePlaceholder')}
          required={true}
        />
        <FormInput
          name='previousSchool'
          type='text'
          formLabel={t('students.form.previousSchool')}
          placeholder={t('students.form.previousSchoolPlaceholder')}
        />

      </div>

      <FormSectionHeader
        icon={Lock}
        title={t('students.form.accountInfo')}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <FormInput
          name='email'
          type='text'
          formLabel={t('students.form.email')}
          placeholder={t('students.form.emailPlaceholder')}
        />

        <FormInput
          name='password'
          type='password'
          formLabel={t('students.form.password')}
          placeholder={t('students.form.passwordPlaceholder')}
        />

      </div>
    </div>
  )
}

export default SimpleStudentForm