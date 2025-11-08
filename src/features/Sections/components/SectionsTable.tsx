"use client"

import NTable from '@/components/NTable';
import React from 'react';
import { sectionsTableConfig } from '../config/sectionsTableConfig';
import SectionForm from './SectionForm';
import { useSections } from '../hooks/useSections';
import { useTranslation } from '@/hooks/useLanguage';
import SectionCard from './SectionCard';
import { useDialog } from '@/components/NMultiDialog/useDialog';

function SectionsTable() {

  const { t } = useTranslation();
  const config = sectionsTableConfig(t);

  const {
    sections,
    createSection,
    updateSection,
    deleteSection,
    isSectionsLoading,
    isUpdating,
    isCreating,
    isDeleting
  } = useSections();

  const { openDialog, confirmDelete } = useDialog();

  const handleAddClick = () => {
    openDialog({
      title: t('sections.dialogs.createTitle'),
      children: <SectionForm />,
      primaryButton: {
        form: 'section-form',
        text: t('sections.dialogs.createButton'),
        loading: isCreating,
        onConfirm: async (sectionData) => {
          await createSection(sectionData);
        }
      }
    });
  };

  const handleView = (section) => {
    openDialog({
      title: t('sections.dialogs.viewTitle'),
      children: <SectionCard data={section} />,
      showButtons: false,
    });
  };

  const handleEdit = (section) => {
    openDialog({
      title: `${t('sections.dialogs.editTitle')} - ${section.name}`,
      children: <SectionForm section={section} />,
      primaryButton: {
        form: 'section-form',
        text: t('sections.dialogs.updateButton'),
        loading: isUpdating,
        onConfirm: async (sectionData) => {
          await updateSection(sectionData);
        }
      }
    });
  };

  const handleDelete = (section) => {
    confirmDelete({
      itemName: `Section ${section.name}`,
      confirmText: t('sections.dialogs.deleteButton'),
      loading: isDeleting,
      onConfirm: async () => {
        await deleteSection(section.id);
      }
    });
  };

  return (
    <NTable
      data={sections}
      columns={config.columns}
      filters={config.filters}
      onAddClick={handleAddClick}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isLoading={isSectionsLoading}
      CardComponent={SectionCard}
      addButtonText={t('sections.dialogs.createButton')}
      viewMode='table'
    />
  );
}

export default SectionsTable;
