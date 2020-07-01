import Sendsay from './sendsay';

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

  static request(data: any = {}): Promise<any> {
    return new Promise((resolve) => {
      const method = data.action === 'login' ? 'login' : 'request';
      const action = Object.assign({}, data).action;

      if (action === 'login') delete data.action;

      Sendsay[method]({ ...data })
        .then((res = {}) => {
          console.log(
            '[API] Request success \n',
            '     Action:', action, '\n',
            '     Response:', res
          );
          resolve({ ...res, success: true });
        })
        .catch((error = {}) => {
          console.log(
            '[API] Request error \n',
            '     Action:', action, '\n',
            '     Error:', error
          );
          resolve({ ...error, success: false });
        });
    });
  }
}
