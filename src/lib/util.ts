import {Base64} from 'js-base64';
import dayjs from "dayjs";

export const sleep = (time = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), time)
    })
}

export const StringUtil = {
    random(length: number = 16) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result
    },
    uuid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }
}

export const TimeUtil = {
    timestampMS() {
        return new Date().getTime()
    },
    format(time: number, format: string = 'YYYY-MM-DD HH:mm:ss') {
        return dayjs(time).format(format)
    },
    formatDate(time: number) {
        return dayjs(time).format('YYYY-MM-DD')
    }
}

export const EncodeUtil = {
    base64Encode(str: string) {
        return Base64.encode(str)
    },
    base64Decode(str: string) {
        return Base64.decode(str)
    }
}

export const VersionUtil = {
    compare(v1: string, v2: string) {
        const v1Arr = v1.split('.')
        const v2Arr = v2.split('.')
        for (let i = 0; i < v1Arr.length; i++) {
            const v1Num = parseInt(v1Arr[i])
            const v2Num = parseInt(v2Arr[i])
            if (v1Num > v2Num) {
                return 1
            } else if (v1Num < v2Num) {
                return -1
            }
        }
        return 0
    }
}
