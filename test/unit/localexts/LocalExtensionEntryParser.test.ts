import * as assert from 'assert';

import ILocalExtension from '../../../src/localexts/ILocalExtension';
import LocalExtensionEntryParser from '../../../src/localexts/LocalExtensionEntryParser';

suite('LocalExtensionEntryParser.isValid', () => {

    const valid = [
        ['all required fields', { id: 'ext.id', type: 'local', path: '/path' }],
    ];
    const invalid = [
        ['missing id', { type: 'local', path: '/path' }],
        ['missing type', { id: 'ext.id', path: '/path' }],
        ['missing path', { id: 'ext.id', type: 'local' }],
        ['a string', 'string'],
        ['an array', ['test']],
        ['type !== "local"', { id: 'ext.id', type: 'not-local', path: '/path' }],
        ['id not a string', { id: 5, type: 'local', path: '/path' }],
        ['path not a string', { id: 'ext.id', type: 'local', path: [1, 2] }],
    ]

    const parser = new LocalExtensionEntryParser();

    for (const [message, value] of valid) {
        test(`should accept '${message}'`, () => {
            assert(parser.isValid(value));
        });
    }

    for (const [message, value] of invalid) {
        test(`should not accept '${message}'`, () => {
            assert(!parser.isValid(value));
        });
    }

});

suite('LocalExtensionEntryParser.parse', () => {

    const parser = new LocalExtensionEntryParser();

    test('should return parsed entry', () => {
        const parsed = parser.parse({ id: 'ext.id', type: 'local', path: '/path' }) as ILocalExtension;

        assert.deepStrictEqual(parsed, {
            extensionPath: '/path',
            id: 'ext.id',
            type: 'local',
        });
    })

})
