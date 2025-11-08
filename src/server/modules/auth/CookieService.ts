
import { setCookie, Injectable, deleteCookie } from 'najm-api';
import timestring from 'timestring';

@Injectable()
export class CookieService {

  setRefreshCookie(refreshToken) {
    const maxAge = timestring(process.env.REFRESH_EXPIRES_IN, 's');  /// '1y'
    setCookie('refreshToken', refreshToken, {
      httpOnly: false,
      sameSite: 'Lax',
      maxAge,
      path: '/api/auth/refresh',
    })
  }

  clearRefreshCookie(): void {
    deleteCookie('refreshToken', {
      httpOnly: false,
      sameSite: 'Lax',
      path: '/api/auth/refresh',
      maxAge: 0
    });
  }


}
