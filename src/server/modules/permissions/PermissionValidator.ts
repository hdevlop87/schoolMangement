import { Injectable, t } from 'najm-api';
import { PermissionRepository } from './PermissionRepository';
import { RoleValidator } from '../roles';
import { parseSchema } from '@/server/shared';
import { z } from 'zod';

const permissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().optional(),
  resource: z.string().min(1, 'Resource is required'),
  action: z.string().min(1, 'Action is required'),
});

@Injectable()
export class PermissionValidator {
  constructor(
    private permissionRepository: PermissionRepository,
    private roleValidator: RoleValidator
  ) {}

  async validateCreatePermission(data) {
    return parseSchema(permissionSchema, data);
  }

  async isPermissionExists(id: string) {
    const existingPermission = await this.permissionRepository.getById(id);
    return !!existingPermission;
  }

  async isPermissionNameExists(name: string) {
    const existingPermission = await this.permissionRepository.getByName(name);
    return !!existingPermission;
  }

  //======================= throw errors

  async checkPermissionExists(id: string) {
    const permissionExists = await this.isPermissionExists(id);
    if (!permissionExists) {
      throw new Error(t('permissions.errors.notFound'));
    }
    return permissionExists;
  }

  async checkPermissionExistsByName(name: string) {
    const permissionExists = await this.isPermissionNameExists(name);
    if (!permissionExists) {
      throw new Error(t('permissions.errors.notFound'));
    }
    return permissionExists;
  }

  async checkPermissionNameUnique(name: string, excludeId = null) {
    if (!name) return;
    const existingPermission = await this.permissionRepository.getByName(name);
    if (existingPermission && existingPermission.id !== excludeId) {
      throw new Error(t('permissions.errors.nameExists'));
    }
  }

  async checkRoleExists(id: string) {
    return await this.roleValidator.checkRoleExists(id);
  }

  async checkRoleExistsByName(name: string) {
    return await this.roleValidator.checkRoleExistsByName(name);
  }

  async checkRoleHasPermission(roleId: string, permissionId: string) {
    await this.roleValidator.checkRoleExists(roleId);
    await this.checkPermissionExists(permissionId);

    const hasPermission = await this.permissionRepository.checkRoleHasPermission(roleId, permissionId);
    if (hasPermission) {
      throw new Error(t('permissions.errors.roleAlreadyHasPermission'));
    }
  }

}