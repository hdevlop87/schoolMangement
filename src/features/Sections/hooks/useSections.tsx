'use client'
import { useEntityCRUD } from '@/hooks/useEntityCRUD';
import * as sectionApi from '@/services/sectionApi';

export const useSections = (enabled = true) => {
  const crud = useEntityCRUD('sections', {
    getAll: sectionApi.getSectionsApi,
    getById: sectionApi.getSectionByIdApi,
    create: sectionApi.createSectionApi,
    update: sectionApi.updateSectionApi,
    delete: sectionApi.deleteSectionApi,
  });

  const { data: sections, isLoading: isSectionsLoading, isError, error, refetch } = crud.useGetAll(enabled);
  const { mutateAsync: createSection, isLoading: isCreating } = crud.useCreate();
  const { mutateAsync: updateSection, isLoading: isUpdating } = crud.useUpdate();
  const { mutateAsync: deleteSection, isLoading: isDeleting } = crud.useDelete();
  const { mutateAsync: bulkDeleteSections, isLoading: isBulkDeleting } = crud.useBulkDelete();

  return {
    sections,
    getSectionById: crud.useGetById,
    isError,
    error,
    refetch,
    createSection,
    updateSection,
    deleteSection,
    bulkDeleteSections,
    isSectionsLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  };
};