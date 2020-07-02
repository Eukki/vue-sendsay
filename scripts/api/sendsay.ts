import Sendsay from 'sendsay-api';

const sendsay = new Sendsay();
sendsay.setSessionFromCookie('vue-sendsay-session');

export default sendsay;
