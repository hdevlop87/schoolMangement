import { Injectable, t } from 'najm-api';
import { UserRepository } from './UserRepository';
import { EncryptionService } from '../auth';
import { parseSchema } from '@/server/shared';
import { userSchema } from '@/lib/validations';

@Injectable()
export class UserValidator {
   constructor(
      private userRepository: UserRepository,
      private encryptionService: EncryptionService,
   ) { }

   async validateCreateUser(data) {
      return parseSchema(userSchema, data);
   }

   async isEmailExists(email) {
      const existingUser = await this.userRepository.getByEmail(email);
      return !!existingUser
   }

   async isPasswordValid(password, hashedPassword) {
      const isPasswordValid = await this.encryptionService.comparePassword(password, hashedPassword);
      return !!isPasswordValid
   }

   async isUserExist(id) {
      const existingUser = await this.userRepository.getById(id);
      return !!existingUser
   }

   async checkUserIdIsUnique(id) {
      if (!id) return;
      const existingUser = await this.userRepository.getById(id);
      if (existingUser) {
         throw new Error(t('users.errors.idExists'));
      }
   }

   async isCorrectPass(password) {
      return password &&
         typeof password === 'string' &&
         password.trim().length > 0;
   }

   async hasRole(userId, roles) {
      const roleName = await this.userRepository.getRoleNameById(userId);

      if (!roleName) {
         throw Error(t('auth.errors.accessDenied'))
      }

      const hasRole = roles.some(
         item => roleName.toLowerCase() === item.toLowerCase()
      )

      if (!hasRole) {
         throw Error(t('auth.errors.accessDenied'))
      }

      return true

   }

   //======================= throw errors

   async checkUserExistsByEmail(email) {
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
         throw new Error(t('auth.errors.invalidCredentials'))
      }
      return user
   }

   async checkUserExists(id) {
      const userExists = await this.isUserExist(id);
      if (!userExists) {
         throw new Error(t('users.errors.notFound'));
      }
      return userExists;
   }


   async checkEmailUnique(email, excludeId = null) {
      if (!email) return;
      const existingUser = await this.userRepository.getByEmail(email);
      if (existingUser && existingUser.id !== excludeId) {
         throw new Error(t('auth.errors.emailExists'));
      }
   }

   async checkEmailExists(email) {
      const user = await this.userRepository.getByEmail(email);
      if (!user) {
         throw new Error(t('users.errors.notFound'));
      }
      return user;
   }

   async checkPasswordValid(password, hashedPassword) {
      const isPasswordValid = await this.isPasswordValid(password, hashedPassword);
      if (!isPasswordValid) {
         throw new Error(t('auth.errors.invalidCredentials'))
      }
   }

}