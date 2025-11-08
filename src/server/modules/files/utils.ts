// src/modules/files/utils.ts

import path from "path/posix";

export enum FileCategory {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  ARCHIVE = 'archive',
  CODE = 'code',
  TEXT = 'text',
  PDF = 'pdf',
  UNKNOWN = 'unknown'
}

export enum FileType {
  // Images
  JPEG = 'jpeg',
  PNG = 'png',
  GIF = 'gif',
  WEBP = 'webp',
  SVG = 'svg',
  BMP = 'bmp',
  TIFF = 'tiff',
  ICO = 'ico',
  AVIF = 'avif',
  
  // Videos
  MP4 = 'mp4',
  AVI = 'avi',
  MOV = 'mov',
  WMV = 'wmv',
  FLV = 'flv',
  WEBM = 'webm',
  MKV = 'mkv',
  
  // Audio
  MP3 = 'mp3',
  WAV = 'wav',
  OGG = 'ogg',
  AAC = 'aac',
  FLAC = 'flac',
  
  // Documents
  DOC = 'doc',
  DOCX = 'docx',
  RTF = 'rtf',
  TXT = 'txt',
  
  // Spreadsheets
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  
  // Presentations
  PPT = 'ppt',
  PPTX = 'pptx',
  
  // Archives
  ZIP = 'zip',
  RAR = 'rar',
  TAR = 'tar',
  GZ = 'gz',
  SEVEN_Z = '7z',
  
  // Code
  JS = 'js',
  TS = 'ts',
  HTML = 'html',
  CSS = 'css',
  JSON = 'json',
  XML = 'xml',
  
  // Other
  PDF = 'pdf',
  UNKNOWN = 'unknown'
}

// MIME type mappings
const MIME_TYPE_MAP: Record<string, FileType> = {
  // Images
  'image/jpeg': FileType.JPEG,
  'image/jpg': FileType.JPEG,
  'image/png': FileType.PNG,
  'image/gif': FileType.GIF,
  'image/webp': FileType.WEBP,
  'image/svg+xml': FileType.SVG,
  'image/bmp': FileType.BMP,
  'image/tiff': FileType.TIFF,
  'image/x-icon': FileType.ICO,
  'image/vnd.microsoft.icon': FileType.ICO,
  'image/avif': FileType.AVIF,
  
  // Videos
  'video/mp4': FileType.MP4,
  'video/avi': FileType.AVI,
  'video/quicktime': FileType.MOV,
  'video/x-msvideo': FileType.AVI,
  'video/x-ms-wmv': FileType.WMV,
  'video/x-flv': FileType.FLV,
  'video/webm': FileType.WEBM,
  'video/x-matroska': FileType.MKV,
  
  // Audio
  'audio/mpeg': FileType.MP3,
  'audio/mp3': FileType.MP3,
  'audio/wav': FileType.WAV,
  'audio/ogg': FileType.OGG,
  'audio/aac': FileType.AAC,
  'audio/flac': FileType.FLAC,
  'audio/x-wav': FileType.WAV,
  'audio/wave': FileType.WAV,
  
  // Documents
  'application/msword': FileType.DOC,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileType.DOCX,
  'application/rtf': FileType.RTF,
  'text/plain': FileType.TXT,
  'text/rtf': FileType.RTF,
  
  // Spreadsheets
  'application/vnd.ms-excel': FileType.XLS,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileType.XLSX,
  'text/csv': FileType.CSV,
  'application/csv': FileType.CSV,
  
  // Presentations
  'application/vnd.ms-powerpoint': FileType.PPT,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FileType.PPTX,
  
  // Archives
  'application/zip': FileType.ZIP,
  'application/x-zip-compressed': FileType.ZIP,
  'application/x-rar-compressed': FileType.RAR,
  'application/x-tar': FileType.TAR,
  'application/gzip': FileType.GZ,
  'application/x-7z-compressed': FileType.SEVEN_Z,
  
  // Code
  'application/javascript': FileType.JS,
  'text/javascript': FileType.JS,
  'application/typescript': FileType.TS,
  'text/html': FileType.HTML,
  'text/css': FileType.CSS,
  'application/json': FileType.JSON,
  'text/xml': FileType.XML,
  'application/xml': FileType.XML,
  
  // PDF
  'application/pdf': FileType.PDF,
};

// Category mappings
const CATEGORY_MAP: Record<FileType, FileCategory> = {
  // Images
  [FileType.JPEG]: FileCategory.IMAGE,
  [FileType.PNG]: FileCategory.IMAGE,
  [FileType.GIF]: FileCategory.IMAGE,
  [FileType.WEBP]: FileCategory.IMAGE,
  [FileType.SVG]: FileCategory.IMAGE,
  [FileType.BMP]: FileCategory.IMAGE,
  [FileType.TIFF]: FileCategory.IMAGE,
  [FileType.ICO]: FileCategory.IMAGE,
  [FileType.AVIF]: FileCategory.IMAGE,
  
  // Videos
  [FileType.MP4]: FileCategory.VIDEO,
  [FileType.AVI]: FileCategory.VIDEO,
  [FileType.MOV]: FileCategory.VIDEO,
  [FileType.WMV]: FileCategory.VIDEO,
  [FileType.FLV]: FileCategory.VIDEO,
  [FileType.WEBM]: FileCategory.VIDEO,
  [FileType.MKV]: FileCategory.VIDEO,
  
  // Audio
  [FileType.MP3]: FileCategory.AUDIO,
  [FileType.WAV]: FileCategory.AUDIO,
  [FileType.OGG]: FileCategory.AUDIO,
  [FileType.AAC]: FileCategory.AUDIO,
  [FileType.FLAC]: FileCategory.AUDIO,
  
  // Documents
  [FileType.DOC]: FileCategory.DOCUMENT,
  [FileType.DOCX]: FileCategory.DOCUMENT,
  [FileType.RTF]: FileCategory.DOCUMENT,
  [FileType.TXT]: FileCategory.TEXT,
  
  // Spreadsheets
  [FileType.XLS]: FileCategory.SPREADSHEET,
  [FileType.XLSX]: FileCategory.SPREADSHEET,
  [FileType.CSV]: FileCategory.SPREADSHEET,
  
  // Presentations
  [FileType.PPT]: FileCategory.PRESENTATION,
  [FileType.PPTX]: FileCategory.PRESENTATION,
  
  // Archives
  [FileType.ZIP]: FileCategory.ARCHIVE,
  [FileType.RAR]: FileCategory.ARCHIVE,
  [FileType.TAR]: FileCategory.ARCHIVE,
  [FileType.GZ]: FileCategory.ARCHIVE,
  [FileType.SEVEN_Z]: FileCategory.ARCHIVE,
  
  // Code
  [FileType.JS]: FileCategory.CODE,
  [FileType.TS]: FileCategory.CODE,
  [FileType.HTML]: FileCategory.CODE,
  [FileType.CSS]: FileCategory.CODE,
  [FileType.JSON]: FileCategory.CODE,
  [FileType.XML]: FileCategory.CODE,
  
  // PDF
  [FileType.PDF]: FileCategory.PDF,
  [FileType.UNKNOWN]: FileCategory.UNKNOWN,
};

// Helper Functions
export const getFileTypeFromMimeType = (mimeType: string): FileType => {
  return MIME_TYPE_MAP[mimeType.toLowerCase()] || FileType.UNKNOWN;
};

export const getFileCategoryFromMimeType = (mimeType: string): FileCategory => {
  const fileType = getFileTypeFromMimeType(mimeType);
  return CATEGORY_MAP[fileType] || FileCategory.UNKNOWN;
};

export const getFileTypeFromExtension = (filename: string): FileType => {
  const extension = filename.toLowerCase().split('.').pop();
  
  const extensionMap: Record<string, FileType> = {
    // Images
    'jpg': FileType.JPEG,
    'jpeg': FileType.JPEG,
    'png': FileType.PNG,
    'gif': FileType.GIF,
    'webp': FileType.WEBP,
    'svg': FileType.SVG,
    'bmp': FileType.BMP,
    'tiff': FileType.TIFF,
    'tif': FileType.TIFF,
    'ico': FileType.ICO,
    'avif': FileType.AVIF,
    
    // Videos
    'mp4': FileType.MP4,
    'avi': FileType.AVI,
    'mov': FileType.MOV,
    'wmv': FileType.WMV,
    'flv': FileType.FLV,
    'webm': FileType.WEBM,
    'mkv': FileType.MKV,
    
    // Audio
    'mp3': FileType.MP3,
    'wav': FileType.WAV,
    'ogg': FileType.OGG,
    'aac': FileType.AAC,
    'flac': FileType.FLAC,
    
    // Documents
    'doc': FileType.DOC,
    'docx': FileType.DOCX,
    'rtf': FileType.RTF,
    'txt': FileType.TXT,
    
    // Spreadsheets
    'xls': FileType.XLS,
    'xlsx': FileType.XLSX,
    'csv': FileType.CSV,
    
    // Presentations
    'ppt': FileType.PPT,
    'pptx': FileType.PPTX,
    
    // Archives
    'zip': FileType.ZIP,
    'rar': FileType.RAR,
    'tar': FileType.TAR,
    'gz': FileType.GZ,
    '7z': FileType.SEVEN_Z,
    
    // Code
    'js': FileType.JS,
    'ts': FileType.TS,
    'html': FileType.HTML,
    'htm': FileType.HTML,
    'css': FileType.CSS,
    'json': FileType.JSON,
    'xml': FileType.XML,
    
    // PDF
    'pdf': FileType.PDF,
  };
  
  return extensionMap[extension || ''] || FileType.UNKNOWN;
};

export const isImageFile = (mimeType: string): boolean => {
  return getFileCategoryFromMimeType(mimeType) === FileCategory.IMAGE;
};

export const isVideoFile = (mimeType: string): boolean => {
  return getFileCategoryFromMimeType(mimeType) === FileCategory.VIDEO;
};

export const isAudioFile = (mimeType: string): boolean => {
  return getFileCategoryFromMimeType(mimeType) === FileCategory.AUDIO;
};

export const isDocumentFile = (mimeType: string): boolean => {
  const category = getFileCategoryFromMimeType(mimeType);
  return [
    FileCategory.DOCUMENT,
    FileCategory.SPREADSHEET,
    FileCategory.PRESENTATION,
    FileCategory.PDF,
    FileCategory.TEXT
  ].includes(category);
};

export const isArchiveFile = (mimeType: string): boolean => {
  return getFileCategoryFromMimeType(mimeType) === FileCategory.ARCHIVE;
};

export const getAllowedMimeTypes = (categories: FileCategory[]): string[] => {
  const allowedTypes: string[] = [];
  
  for (const [mimeType, fileType] of Object.entries(MIME_TYPE_MAP)) {
    const category = CATEGORY_MAP[fileType];
    if (categories.includes(category)) {
      allowedTypes.push(mimeType);
    }
  }
  
  return allowedTypes;
};

export const getFileIcon = (mimeType: string): string => {
  const category = getFileCategoryFromMimeType(mimeType);
  
  const iconMap: Record<FileCategory, string> = {
    [FileCategory.IMAGE]: '🖼️',
    [FileCategory.VIDEO]: '🎥',
    [FileCategory.AUDIO]: '🎵',
    [FileCategory.DOCUMENT]: '📄',
    [FileCategory.SPREADSHEET]: '📊',
    [FileCategory.PRESENTATION]: '📽️',
    [FileCategory.ARCHIVE]: '📦',
    [FileCategory.CODE]: '💻',
    [FileCategory.TEXT]: '📝',
    [FileCategory.PDF]: '📕',
    [FileCategory.UNKNOWN]: '📄',
  };
  
  return iconMap[category];
};

export const getReadableFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (
  mimeType: string, 
  allowedCategories: FileCategory[]
): { isValid: boolean; error?: string } => {
  const category = getFileCategoryFromMimeType(mimeType);
  
  if (category === FileCategory.UNKNOWN) {
    return {
      isValid: false,
      error: 'File type not supported'
    };
  }
  
  if (!allowedCategories.includes(category)) {
    return {
      isValid: false,
      error: `File category '${category}' is not allowed. Allowed: ${allowedCategories.join(', ')}`
    };
  }
  
  return { isValid: true };
};

export const getFileInfo = (file) => {
  const fileType = getFileTypeFromMimeType(file.type);
  const fileCategory = getFileCategoryFromMimeType(file.type);
  const extensionFromName = getFileTypeFromExtension(file.name);
  const fileExtension = file.name.toLowerCase().split('.').pop() || '';
  
  return {
    fileName: file.name,
    fileSize: getReadableFileSize(file.size),
    fileExtension,
    fileType,
    fileCategory,
    mimeType: file.type,
    size: file.size,
    icon: getFileIcon(file.type),
    isImage: isImageFile(file.type),
    isVideo: isVideoFile(file.type),
    isAudio: isAudioFile(file.type),
    isDocument: isDocumentFile(file.type),
    isArchive: isArchiveFile(file.type),
    mimeTypeMatches: fileType === extensionFromName || extensionFromName === FileType.UNKNOWN,
  };
};


export function getDatabasePath(...segments: string[]): string {
  return path.posix.join(...segments);
}

export function getSystemPath(...segments: string[]): string {
  return path.join(...segments);
}

export function normalizeDatabasePath(filePath: string): string {
  return path.posix.normalize(filePath.replace(/\\/g, '/'));
}