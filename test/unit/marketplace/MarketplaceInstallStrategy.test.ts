import * as assert from 'assert';
import MarketplaceExtension from '../../../src/marketplace/MarketplaceExtension';
import MarketplaceInstallStrategy from '../../../src/marketplace/MarketplaceInstallStrategy';

suite('MarketplaceInstallStrategy.isValid', () => {

    const strategy = new MarketplaceInstallStrategy();

    testMany(
        'should accept',
        (value) => strategy.isValid(value),
        [
            ['a MarketplaceExtension instance', new MarketplaceExtension('ext.id')],
        ],
    );

    testMany(
        'should not accept',
        (value) => !strategy.isValid(value),
        [
            ['an object with type !== \'marketplace\'', { id: 'ext.id', type: 'something-else' }],
        ],
    );

});

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return typeof (value as Promise<T>).then === 'function';
}

function testMany<T>(
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
