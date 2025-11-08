import { Controller, Get, Post, Put, Delete, Params, Body, Ctx, t } from 'najm-api';
import { FileService } from './FileService';


@Controller('/files')
export class FileController {
  constructor(private fileService: FileService) { }

  @Get()
  async getFiles() {
    const data = await this.fileService.getAll();
    return {
      data,
      message: t('files.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/path/:path{.+}')
  async getFileByPath(@Params('path') path) {
    const data = await this.fileService.getFileByPath(path);
    return {
      data,
      message: t('files.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/entity/:entityType/:entityId')
  async getFilesByEntity(@Params('entityType') entityType, @Params('entityId') entityId) {
    const data = await this.fileService.getFilesByEntity(entityType, entityId);
    return {
      data,
      message: t('files.success.retrieved'),
      status: 'success'
    };
  }

  @Put('/entity/:id')
  async updateFileEntity(@Params('id') id, @Body() body) {
    const data = await this.fileService.updateFileEntity(id, body);
    return {
      data,
      message: t('files.success.updated'),
      status: 'success'
    };
  }

  @Get('/:id')
  async getFile(@Params('id') id) {
    const data = await this.fileService.getById(id);
    return {
      data,
      message: t('files.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  async uploadFile(@Body() body) {
    const data = await this.fileService.create(body);
    return {
      data,
      message: t('files.success.created'),
      status: 'success'
    };
  }

  @Delete('/:fileName')
  async deleteFile(@Params('fileName') fileName) {
    const data = await this.fileService.delete(fileName);
    return {
      data,
      message: t('files.success.deleted'),
      status: 'success'
    };
  }

  @Delete('/path/:path{.+}')
  async deleteFileByPath(@Params('path') path) {
    const data = await this.fileService.deleteByPath(path);
    return {
      data,
      message: t('files.success.deleted'),
      status: 'success'
    };
  }

  @Get('/serve/:fileName')
  async serveFileByFileName(@Ctx() c, @Params('fileName') fileName) {
    const file = await this.fileService.serveFileByName(fileName)
    c.header('Content-Type', file.mimeType);
    c.header('Content-Length', file.size.toString());
    c.header('Content-Disposition', `inline; filename="${file.name}"`);
    return c.body(file.buffer);
  }
}