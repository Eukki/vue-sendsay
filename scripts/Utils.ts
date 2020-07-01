import store from 'store';
import moment from 'moment';
import MobileDetect from 'mobile-detect';

import CONF from '@/project.config';
import vuex from '@/scripts/store';

export interface GA {
    non_interaction?: boolean;
    event_category?: string;
    event_label?: string;
    value?: string;
}

class UConst {
    static readonly EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    static readonly NO_IMAGE = require('@/assets/images/no-image.png');
    static readonly NO_AVATAR = require('@/assets/images/no-avatar.png');
}

class UString {
    static serialize(obj): string {
        if (!obj) return '';

        const str: string[] = [];
        for (const p in obj)
            if (obj.hasOwnProperty(p))
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[ p ]));
        return '?' + str.join('&');
    }

    static reverse(str: string) {
        return String(str).split('').reverse().join('');
    }

    static ucfirst(str = '') {
        return String(str).charAt(0).toUpperCase() + String(str).substr(1, String(str).length - 1);
    }

    static suffix(one, three, many, count) {
        return count < 10 ?
            (count === 1 ?
                    one :
                    (count > 1 && count < 5 ?
                            three :
                            many
                    )
            ) :
            (count > 10 && count < 21 ?
                    many :
                    (count % 10 === 1 ?
                            one :
                            (count % 10 > 1 && count % 10 < 5 ?
                                    three :
                                    many
                            )
                    )
            );
    }

    static hash(len = 32) {
        let hash = '';
        for (let i = 0; i < len; i++) {
            const chance = UNumber.rand(0, 2);
            hash += chance === 0 ? UNumber.rand(0, 9) : String.fromCharCode(chance === 1 ? UNumber.rand(65, 90) : UNumber.rand(97, 122));
        }
        return hash;
    }

    static toDateTime(date = new Date(), format = 'DD.MM.YYYY HH:mm') {
        return moment(date).format(format);
    }

    static toDate(date = new Date(), format = 'DD.MM.YYYY') {
        return Utils.String.toDateTime(date, format);
    }

    static toTime(date = new Date(), format = 'HH:mm') {
        return Utils.String.toDateTime(date, format);
    }

    static toMoney(num, delimiter = '.') {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + delimiter);
    }

    static toPhone(str, d = ' ') {
        return '+' + Utils.String.reverse(Utils.String.reverse(str).replace(/(\d{2})(\d{2})(\d{3})(\d{3})(\d+?)/, `$1${d}$2${d}$3${d}$4${d}$5`));
    }
}

class UNumber {
    static rand(min, max) {
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
}

class UArray {
    static find(array, value, key = 'id') {
        let index = -1;
        array.forEach((el, i) => String(el[ key ]) === String(value) ? (index = i) : false);
        return index;
    }

    static sort(items, index: string, isDescending: boolean): object[] {
        return items.sort((a, b) => {
            const aValue = String(a[ index ]).toLowerCase();
            const bValue = String(b[ index ]).toLowerCase();
            const aNumber = parseInt(aValue, 10);
            const bNumber = parseInt(bValue, 10);
            const aLetter = aValue.replace(String(aNumber), '');
            const bLetter = bValue.replace(String(bNumber), '');

            return !isDescending ? (
                aNumber < bNumber ? 1 : (
                    aNumber > bNumber ? -1 : (
                        aLetter < bLetter ? 1 : -1
                    )
                )
            ) : (
                aNumber > bNumber ? 1 : (
                    aNumber < bNumber ? -1 : (
                        aLetter > bLetter ? 1 : -1
                    )
                )
            );
        });
    }
}

class UImage {
    static remoteToDataUrl(url, type = 'image/jpeg') {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas') as HTMLCanvasElement;
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                resolve(canvas.toDataURL(type));
            };
            img.crossOrigin = 'anonymous';
            img.src = url;
        });
    }

    static urlToBlob(data) {
        const binary = atob(data.split(',')[ 1 ]), array = [];
        for (let i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
        return new Blob([ new Uint8Array(array) ], { type: 'image/jpeg' });
    }

    static getBinary(data) {
        return new File([ this.urlToBlob(data) ], Date.now() + '.jpg');
    }

    static resize(imageData, ratio = 4 / 5): Promise<HTMLCanvasElement> {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas') as HTMLCanvasElement;
                const { width, height } = image;

                if (width > height) {
                    canvas.width = image.height * ratio;
                    canvas.height = image.height;
                } else {
                    canvas.width = image.width;
                    canvas.height = image.width / ratio;
                }

                const x = (width - canvas.width) / -2;
                const y = (height - canvas.height) / -2;

                canvas.getContext('2d').drawImage(image, x, y, width, height);
                resolve(canvas);
            };
            image.src = imageData;
        });
    }
}

class UDocument {
    static setLoading(flag) {
        document.getElementById('preloader-wrapper').classList[ flag ? 'remove' : 'add' ]('loaded');
    }

    static throw(type: 'error' | 'success' | 'warning', text: string, delay = 0) {
        setTimeout(async () => {
            await vuex.commit('Global/setNotify', {
                type,
                text,
                title: (
                    type === 'error' ? 'Ошибка' : (
                        type === 'success' ? 'Успех' : (
                            type === 'warning' ? 'Внимание' : ''
                        )
                    )
                ) + '!'
            });

            await vuex.commit('Global/setNotify', null);
        }, delay);
    }

    static isMobile() {
        const md = new MobileDetect(navigator.userAgent || navigator.vendor || (window as any).opera);
        return !!md.mobile() || !!md.tablet();
    }

    static exitFullscreen(document: any) {
        const isInFullScreen = document.fullscreenElement;

        if (isInFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    static setDocumentTitle(route) {
        if (!route) return;

        const prefix = CONF.SITE_TITLE;
        let title = Utils.String.ucfirst(prefix) + ' | ' + (route.meta.title || route.name);
        if (route.params.id) title += ' ' + route.params.id;

        document.title = title;
    }
}

export class UGeo {
    static transpose(points: number[][]) {
        const validPoints = [];
        points.filter((p) => p).forEach((point) => validPoints.push([ point[ 1 ], point[ 0 ] ]));
        return validPoints;
    }
}

export default class Utils {
    public static Const = UConst;
    public static Number = UNumber;
    public static String = UString;
    public static Array = UArray;
    public static Image = UImage;
    public static Geo = UGeo;
    public static Document = UDocument;

    public static isDebug = !!store.get('debug');

    public static debug(msg) {
        if (Utils.isDebug) console.log(`[APP] ${msg}`);
    }

    public static ga(name, data: GA = {}) {
        // @ts-ignore
        if (window.gtag) {
            console.log(`[APP][GTAG] Sended "${name}":`, data);
            gtag('event', name, data);
        }
    }
}