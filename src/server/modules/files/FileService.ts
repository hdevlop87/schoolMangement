
import { Injectable } from 'najm-api';
import { FileRepository } from './FileRepository';
import { FileValidator } from './FileValidator';
import { getDatabasePath, getFileInfo, getSystemPath, normalizeDatabasePath } from './utils';
import path from 'path';
import * as fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { nanoid } from 'nanoid';

@Injectable()
export class FileService {

  private readonly uploadDir = path.join(process.cwd(), 'storage');
  private readonly relativeUploadDir = 'storage';

  constructor(
    private fileRepository: FileRepository,
    private fileValidator: FileValidator
  ) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async getAll() {
    return await this.fileRepository.getAll();
  }

  async getById(id) {
    await this.fileValidator.checkFileExists(id);
    return await this.fileRepository.getById(id);
  }

  async create(data) {
    const fileInfo = getFileInfo(data.file);

    const baseName = path.basename(fileInfo.fileName, path.extname(fileInfo.fileName));
    const fileExtension = path.extname(fileInfo.fileName);
    const uniqueFileName = `${data.entityId}_${baseName}${fileExtension}`;

    // Check if file already exists in database
    const existingFile = await this.fileRepository.getByFileName(uniqueFileName);
    if (existingFile) {
      return existingFile; // Return existing file record instead of creating new one
    }

    const absPath = getSystemPath(this.uploadDir, uniqueFileName);
    const filePath = getDatabasePath(this.relativeUploadDir, uniqueFileName);

    await this.fileValidator.validateFileSize(fileInfo.size);
    await this.fileValidator.validateSecurity(fileInfo);
    await this.saveFileToStorage(absPath, data.file);

    const fileData = {
      name: uniqueFileName,
      path: filePath,
      absPath: absPath,
      size: fileInfo.size,
      mimeType: fileInfo.mimeType,
      type: fileInfo.fileType,
      category: fileInfo.fileCategory,
      entityId: data.entityId,
      isPublic: data.isPublic,
    };
    return await this.fileRepository.create(fileData);
  }

  async update(id, data) {
    await this.fileValidator.checkFileExists(id);
    return await this.fileRepository.update(id, data);
  }

  async delete(fileName) {
    if (!fileName) return;
    const fileExists = await this.fileValidator.isFileExist(fileName);
    if (!fileExists) return;
    const file = await this.fileRepository.getByFileName(fileName);
    const physicalFile = await this.fileValidator.isPhysicalFileExists(file.absPath);
    if (physicalFile) {
      await fs.unlink(file.absPath);
    }
    return await this.fileRepository.delete(fileName);
  }

  async deleteByPath(filePath) {
    const normalizedPath = normalizeDatabasePath(filePath);
    const file = await this.fileValidator.checkFileExistsByPath(normalizedPath);
    const physicalFile = await this.fileValidator.isPhysicalFileExists(file.absPath);
    if (physicalFile) {
      await fs.unlink(file.absPath);
    }
    return await this.fileRepository.delete(file.id);
  }

  async getFileByPath(filePath) {
    const normalizedPath = normalizeDatabasePath(filePath);
    const file = await this.fileValidator.checkFileExistsByPath(normalizedPath);
    await this.fileValidator.checkPhysicalFileExists(file.absPath);
    return file;
  }

  async serveFileByName(fileName) {
    const filePath = `storage/${fileName}`;
    const file = await this.getFileByPath(filePath);
    const buffer = await fs.readFile(file.absPath);
    return { ...file, buffer };
  }

  async getFilesByEntity(entityId) {
    return await this.fileRepository.getByEntityId(entityId);
  }

  async saveFileToStorage(filePath, file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
  }

  async getFileAbsolutePath(id) {
    const file = await this.fileRepository.getById(id);
    return file?.absPath || null;
  }

  async getFileRelativePath(id) {
    const file = await this.fileRepository.getById(id);
    return file?.path || null;
  }

  async updateFileEntity(id, entityData) {
    await this.fileValidator.checkFileExists(id);

    const updateData = {
      entityId: entityData.entityId
    };

    return await this.fileRepository.update(id, updateData);
  }

  async handleImage(image, currentImageName?, entityId?) {
    if (!image) return 'noavatar.png';

    if (typeof image === 'string') {
      if (image.startsWith('/')) {
        return image;
      }

      const existingFile = await this.fileRepository.getByFileName(image);
      if (existingFile) {
        return image; 
      }
    }

    const isValidImage = await this.fileValidator.validateImageFile(image);
    if (!isValidImage) {
      return currentImageName || 'noavatar.png';
    }

    if (currentImageName && currentImageName !== 'noavatar.png') {
      await this.delete(currentImageName);
    }

    const fileData = {
      file: image,
      entityId: entityId || null,
      isPublic: true
    };

    const uploadedFile = await this.create(fileData);
    return uploadedFile.name;
  }

}
