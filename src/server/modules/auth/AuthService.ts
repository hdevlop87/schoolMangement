import { t } from 'najm-api';
import { Injectable, getCurrentLanguage } from 'najm-api';
import { UserService, UserValidator } from '../users';
import { TokenService } from '../tokens';
import { CookieService } from './CookieService';

@Injectable()
export class AuthService {

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private userValidator: UserValidator,
    private cookieService: CookieService,
  ) { }

  async registerUser(body) {
    return await this.userService.create(body)
  }

  async loginUser(body) {
    const { email, password } = body;

    if (!email || !password) {
      throw new Error(t('auth.errors.invalidCredentials'))
    }

    const existingPassword = await this.userService.getPassword(email);
    const { id } = await this.userService.getByEmail(email);
    await this.userValidator.checkPasswordValid(password, existingPassword);

    const data = await this.tokenService.generateTokens(id);
    this.cookieService.setRefreshCookie(data.refreshToken)
    return data;
  }

  async refreshTokens() {
    const data = await this.tokenService.refreshTokens();
    this.cookieService.setRefreshCookie(data.refreshToken);
    return data;
  }

  async logoutUser(userId) {
    await this.userValidator.checkUserExists(userId);
    await this.tokenService.revokeToken(userId);
    this.cookieService.clearRefreshCookie();
    return { data: null, message: t('auth.success.logout') };
  }

  async getUserProfile(userData) {
    const lang = getCurrentLanguage();
    return {
      ...userData,
      language: lang,
    };
  }

  async forgotPassword(email) {

  }
}


