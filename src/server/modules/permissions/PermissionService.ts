import { Injectable } from 'najm-api';
import { PermissionRepository } from './PermissionRepository';
import { PermissionValidator } from './PermissionValidator';
import { RoleService } from '../roles/RoleService';

@Injectable()
export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository,
    private permissionValidator: PermissionValidator,
    private roleService: RoleService
  ) { }

  async getAll() {
    return await this.permissionRepository.getAll();
  }

  async getById(id: string) {
    await this.permissionValidator.checkPermissionExists(id);
    return await this.permissionRepository.getById(id);
  }

  async getByName(name: string) {
    return await this.permissionRepository.getByName(name);
  }

  async getByResource(resource: string) {
    return await this.permissionRepository.getAll().then(permissions =>
      permissions.filter(p => p.resource === resource)
    );
  }

  async create(data) {
    await this.permissionValidator.validateCreatePermission(data);
    await this.permissionValidator.checkPermissionNameUnique(data.name);
    return await this.permissionRepository.create(data);
  }

  async update(id: string, data) {
    await this.permissionValidator.checkPermissionExists(id);
    await this.permissionValidator.checkPermissionNameUnique(data.name, id);
    return await this.permissionRepository.update(id, data);
  }

  async delete(id: string) {
    await this.permissionValidator.checkPermissionExists(id);
    return await this.permissionRepository.delete(id);
  }

  async getPermissionsByRole(roleId: string) {
    return await this.permissionRepository.getPermissionsByRole(roleId);
  }

  async getRolesByPermission(permissionId: string) {
    await this.permissionValidator.checkPermissionExists(permissionId);
    return await this.permissionRepository.getRolesByPermission(permissionId);
  }

  async assignPermissionToRole(roleId: string, permissionId: string) {
    await this.permissionValidator.checkRoleHasPermission(roleId, permissionId);
    return await this.permissionRepository.assignPermissionToRole(roleId, permissionId);
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return await this.permissionRepository.removePermissionFromRole(roleId, permissionId);
  }

  async seedDefaultPermissions(defaultPermissions) {
    const createdPermissions = [];

    for (const permission of defaultPermissions) {
      try {
        const permissionEntity = await this.create(permission);
        createdPermissions.push(permissionEntity);
      } catch (error) {
        continue;
      }
    }
    return createdPermissions;
  }

  async seedDefaultRolePermissions(defaultRolePermissions) {
    const results = [];

    for (const { roleName, permissions } of defaultRolePermissions) {
      try {
        await this.permissionValidator.checkRoleExistsByName(roleName);
        const role = await this.roleService.getByName(roleName);

        for (const permissionName of permissions) {
          try {
            await this.permissionValidator.checkPermissionExistsByName(permissionName);
            const permission = await this.getByName(permissionName);

            await this.permissionValidator.checkRoleHasPermission(role.id, permission.id);

            await this.assignPermissionToRole(role.id, permission.id);
            results.push({ role: roleName, permission: permissionName });
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }

    return results;
  }

  async deleteAll() {
    return await this.permissionRepository.deleteAll();
  }

}