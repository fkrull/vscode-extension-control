import * as assert from 'assert';
import MarketplaceEntryParser from '../../../src/marketplace/MarketplaceEntryParser';

suite('MarketplaceEntryParser.isValid', () => {

    const parser = new MarketplaceEntryParser();

    testMany(
        'should accept',
        (value) => parser.isValid(value),
        [
            ['a string', 'ext.id'],
            ['an object with an id and a type', { id: 'ext.id', type: 'marketplace' }],
        ],
    );

    testMany(
        'should not accept',
        (value) => !parser.isValid(value),
        [
            ['missing id', { type: 'marketplace' }],
            ['missing type', { id: 'ext.id' }],
            ['an array', ['test']],
            ['type !== "marketplace"', { id: 'ext.id', type: 'not-marketplace' }],
            ['id not a string', { id: 5, type: 'marketplace' }],
        ],
    );

});

suite('MarketplaceEntryParser.parse', () => {

    const parser = new MarketplaceEntryParser();

    test('should parse string ID', () => {
        const parsed = parser.parse('ext.id', 'path');

        assert.deepEqual(parsed, {
            id: 'ext.id',
            type: 'marketplace',
        });
    });

    test('should parse object entry', () => {
        const parsed = parser.parse({ id: 'other.id', type: 'marketplace' } , 'path');

        assert.deepEqual(parsed, {
            id: 'other.id',
            type: 'marketplace',
        });
    });

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
