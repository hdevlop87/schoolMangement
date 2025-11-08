import { Injectable, setLanguage, getCurrentLanguage, Transactional } from 'najm-api';
import { UserRepository } from './UserRepository';
import { UserValidator } from './UserValidator';
import { RoleService, RoleValidator } from '../roles';
import { EncryptionService } from '../auth';
import { nanoid } from 'nanoid';
import { clean, getAvatarFile } from '@/server/shared';
import { FileService } from '../files';

@Injectable()
export class UserService {
  constructor(
    private roleValidator: RoleValidator,
    private roleService: RoleService,
    private userRepository: UserRepository,
    private userValidator: UserValidator,
    private encryptionService: EncryptionService,
    private fileService: FileService
  ) { }

  private sanitizeUser(user) {
    if (!user) return user;
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private sanitizeUsers(users) {
    return users.map(user => this.sanitizeUser(user));
  }

  private async resolveUserRole(roleId, roleName) {

    if (roleId) {
      await this.roleValidator.checkRoleExists(roleId);
      return roleId;
    }

    if (roleName) {
      const roleByName = await this.roleService.getByName(roleName);
      if (roleByName) {
        return roleByName.id;
      }
      throw new Error(`Role '${roleName}' not found`);
    }

    const defaultRole = await this.roleService.getByName('Student');
    return defaultRole.id;
  }

  async getAll() {
    const users = await this.userRepository.getAll();
    return this.sanitizeUsers(users);
  }

  async getById(id) {
    await this.userValidator.checkUserExists(id);
    const user = await this.userRepository.getById(id);
    return this.sanitizeUser(user);
  }

  async getByEmail(email) {
    const user = await this.userValidator.checkUserExistsByEmail(email);
    return this.sanitizeUser(user);
  }

  @Transactional()
  async create(data) {
    const { id, email, image, emailVerified, password, roleId, role } = data;
    let userId = id || nanoid(5);
    let pass = password || '12345678';

    await this.userValidator.checkEmailUnique(data.email);
    await this.userValidator.checkUserIdIsUnique(id);

    const hashedPassword = await this.encryptionService.hashPassword(pass);
    const resolvedRoleId = await this.resolveUserRole(roleId, role);
    const imageName = await this.fileService.handleImage(image, null, userId);

    const userDetails = {
      id: userId,
      email,
      image: imageName,
      password: hashedPassword,
      roleId: resolvedRoleId,
      emailVerified,
      status: 'pending'
    };

    await this.userValidator.validateCreateUser(userDetails);
    const newUser = await this.userRepository.create(userDetails);

    return this.sanitizeUser(newUser);


  }

  async update(id, data) {

    const { password, image } = data;

    await this.userValidator.checkUserExists(id);
    await this.userValidator.checkEmailUnique(data.email, id);

    const currentUser = await this.userRepository.getById(id);
    const imageName = await this.fileService.handleImage(image, currentUser.image, id);
    const hashedPassword = await this.encryptionService.hashPassword(password);

    const updateData = {
      ...data,
      image: imageName,
      ...(hashedPassword && { password: hashedPassword })
    };

    const cleanedUpdateData = clean(updateData);
    const updatedUser = await this.userRepository.update(id, cleanedUpdateData);
    return this.sanitizeUser(updatedUser);
  }

  async delete(id) {
    await this.userValidator.checkUserExists(id);
    const user = await this.userRepository.delete(id);
    await this.fileService.delete(user.image);
    return this.sanitizeUser(user);
  }

  async deleteAll() {
    const deletedUsers = await this.userRepository.deleteAll();
    for (const user of deletedUsers) {
      if (user.image) await this.fileService.delete(user.image);
    }

    return this.sanitizeUsers(deletedUsers);
  }

  async getRoleName(id) {
    await this.userValidator.checkUserExists(id);
    return await this.userRepository.getRoleNameById(id);
  }

  async getPassword(email) {
    await this.userValidator.checkUserExistsByEmail(email);
    return await this.userRepository.getUserPassword(email);
  }

  async assignRole(id, roleId, roleName?) {
    await this.userValidator.checkUserExists(id);
    const resolvedRoleId = await this.resolveUserRole(roleId, roleName);
    const updatedUser = await this.userRepository.update(id, { roleId: resolvedRoleId });
    return this.sanitizeUser(updatedUser);
  }

  async removeRole(id) {
    await this.userValidator.checkUserExists(id);
    const updatedUser = await this.userRepository.update(id, { roleId: null });
    return this.sanitizeUser(updatedUser);
  }

  async seedAdminUser() {
    const email = 'admin@admin.com';
    const adminRole = await this.roleValidator.checkAdminRoleExists();

    const existingUser = await this.userRepository.getByEmail(email);

    if (existingUser) {
      await this.delete(existingUser.id);
    }

    const avatarFile = await getAvatarFile('admin.png');

    const newAdminUser = await this.create({
      id: 'USR00',
      name: 'System Administrator',
      email,
      password: '12345678',
      image: avatarFile,
      roleId: adminRole.id,
      status: 'active',
      emailVerified: true
    });

    return this.sanitizeUser(newAdminUser);
  }

  async updateLang(language) {
    setLanguage(language)
    return language
  }

  async getLang() {
    return getCurrentLanguage();
  }

}