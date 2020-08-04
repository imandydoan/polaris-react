import { TypeOf } from '../types';
export function isObject(value) {
    const type = typeof value;
    return value != null && (type === TypeOf.Object || type === TypeOf.Function);
}
