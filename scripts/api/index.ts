import Sendsay from './sendsay';
import Utils from '@/scripts/Utils';

export default class API {
  static async login(loginData) {
    return await API.request({ action: 'login', ...loginData });
  }

  static async logout() {
    return await API.request({ action: 'logout' });
  }

  // ----------------------------------- //
  // -------------- SYSTEM ------------- //
  // ----------------------------------- //

  static setSession(session: string) {
    Sendsay.setSession(session);
    Utils.Document.setCookie('vue-sendsay-session', session);
  }

  static request(data: any = {}): Promise<any> {
    return new Promise((resolve) => {
      Sendsay.request({ ...data })
        .then((res = {}) => {
          console.log(
            '[API] Request success \n',
            '     Action:', data.action, '\n',
            '     Response:', res
          );
          resolve({ ...res, success: true, action: data.action });
        })
        .catch((error = {}) => {
          console.log(
            '[API] Request error \n',
            '     Action:', data.action, '\n',
            '     Error:', error
          );
          resolve({ ...error, success: false, action: data.action });
        });
    });
  }
}
