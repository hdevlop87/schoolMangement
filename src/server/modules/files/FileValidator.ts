import { Injectable, t } from 'najm-api';
import { FileRepository } from './FileRepository';

import path from 'path/posix';
import * as fs from 'fs/promises';
import { FileCategory, getFileInfo, validateFileType } from './utils';

export interface FileInfo {
  fileName: string;
  fileSize: string;
  fileExtension: string;
  fileType: string;
  fileCategory: string;
  mimeType: string;
  size: number;
  icon: string;
  isImage: boolean;
  isVideo: boolean;
  isAudio: boolean;
  isDocument: boolean;
  isArchive: boolean;
  mimeTypeMatches: boolean;
}

@Injectable()
export class FileValidator {

  constructor(private fileRepository: FileRepository) { }

  async isFileExist(fileName: string) {
    try {
      const file = await this.fileRepository.getByFileName(fileName);
      return !!file;
    } catch (error) {
      return false;
    }
  }

  async checkFileExists(fileName: string) {
    const file = await this.fileRepository.getByFileName(fileName);
    if (!file) {
      throw new Error(t('files.errors.notFound'));
    }
    return file;
  }

  async checkFileExistsByPath(filePath: string) {
    if (!filePath) {
      throw new Error(t('validation.general.requiredFieldMissing'));
    }

    const normalizedPath = path.normalize(filePath);

    const file = await this.fileRepository.getByFilePath(normalizedPath);
    if (!file) {
      throw new Error(t('files.errors.notFound'));
    }
    return file;
  }

  async checkFileNameIsUnique(fileName: string, excludeId?: string) {
    const file = await this.fileRepository.getByFileName(fileName);
    if (file && file.id !== excludeId) {
      throw new Error(t('files.errors.nameExists'));
    }
    return true;
  }

  async validateFileSize(fileSize: number, maxSize: number = 10 * 1024 * 1024) {
    if (fileSize > maxSize) {
      throw new Error(t('files.errors.sizeTooLarge'));
    }
    return true;
  }

  async validateSecurity(fileInfo: FileInfo) {
    if (!fileInfo.mimeTypeMatches) {
      throw new Error(t('files.errors.mimeTypeMismatch'));
    }

    // Block dangerous extensions
    const dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'pif', 'com', 'vbs', 'jar'];

    if (dangerousExtensions.includes(fileInfo.fileExtension.toLowerCase())) {
      throw new Error(t('files.errors.executableNotAllowed'));
    }

    return true;
  }

  async checkPhysicalFileExists(fileAbsPath: string) {
    if (!fileAbsPath) {
      throw new Error(t('validation.general.requiredFieldMissing'));
    }

    const fileExists = await fs.access(fileAbsPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      throw new Error(t('files.errors.physicalNotFound'));
    }

    const file = await this.fileRepository.getByFileAbsPath(fileAbsPath);
    if (!file) {
      throw new Error(t('files.errors.recordNotFound', { fileAbsPath }));
    }

    return file;
  }

  async isPhysicalFileExists(fileAbsPath: string) {
    if (!fileAbsPath) {
      return null;
    }
    const fileExists = await fs.access(fileAbsPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return null;
    }
    const file = await this.fileRepository.getByFileAbsPath(fileAbsPath)
      .then(result => result)
      .catch(() => null);
    return file;
  }

  async validateImageFile(file, maxSize = 5 * 1024 * 1024) {

    if (!file || typeof file === 'string') {
      return false;
    }

    const fileInfo = getFileInfo(file);

    if (!fileInfo.isImage) {
      throw new Error(t('files.errors.onlyImagesAllowed'));
    }

    const typeValidation = validateFileType(file.type, [FileCategory.IMAGE]);
    if (!typeValidation.isValid) {
      throw new Error(typeValidation.error || t('files.errors.invalidImageType'));
    }

    await this.validateFileSize(file.size, maxSize);
    await this.validateSecurity(fileInfo);

    return true;
  }
}