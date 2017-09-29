import * as assert from 'assert';
import * as path from 'path';

import LocalExtension from '../../../src/localexts/LocalExtension';
import LocalExtensionEntryParser from '../../../src/localexts/LocalExtensionEntryParser';

suite('LocalExtensionEntryParser.isValid', () => {

    const parser = new LocalExtensionEntryParser();

    testMany(
        'should accept',
        (value) => parser.isValid(value),
        [
            ['all required fields', { id: 'ext.id', type: 'local', path: '/path' }],
        ],
    );

    testMany(
        'should not accept',
        (value) => !parser.isValid(value),
        [
            ['missing id', { type: 'local', path: '/path' }],
            ['missing type', { id: 'ext.id', path: '/path' }],
            ['missing path', { id: 'ext.id', type: 'local' }],
            ['a string', 'string'],
            ['an array', ['test']],
            ['type !== "local"', { id: 'ext.id', type: 'not-local', path: '/path' }],
            ['id not a string', { id: 5, type: 'local', path: '/path' }],
            ['path not a string', { id: 'ext.id', type: 'local', path: [1, 2] }],
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

suite('LocalExtensionEntryParser.parse', () => {

    const parser = new LocalExtensionEntryParser();

    test('should return parsed entry', () => {
        const parsed = parser.parse({ id: 'ext.id', type: 'local', path: 'relative-path' }, 'root');

        assert.deepEqual(parsed, {
            extensionPath: path.join('root', 'relative-path'),
            id: 'ext.id',
            type: 'local',
        });
    });

});
