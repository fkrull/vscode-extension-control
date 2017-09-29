import * as assert from 'assert';

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return typeof (value as Promise<T>).then === 'function';
}

export default function testMany<T>(
    namePrefix: string,
    callback: (value: any) => boolean | Promise<boolean>,
    data: Array<[string, any]>,
) {
    for (const [message, value] of data) {
        test(`${namePrefix} '${message}'`, () => {
            const ret = callback(value);
            if (isPromise(ret)) {
                return ret.then((isAccepted) => assert(isAccepted));
            } else {
                assert(ret);
            }
        });
    }
}
