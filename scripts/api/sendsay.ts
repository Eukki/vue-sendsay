import Sendsay from 'sendsay-api';

const sendsay = new Sendsay();
sendsay.setSessionFromCookie();

export default sendsay;
