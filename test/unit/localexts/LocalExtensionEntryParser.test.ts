import * as assert from 'assert';
import * as path from 'path';

import { testMany } from '../../helper';

import LocalExtension from '../../../src/localexts/LocalExtension';
import LocalExtensionEntryParser from '../../../src/localexts/LocalExtensionEntryParser';

suite('LocalExtensionEntryParser', () => {

    const parser = new LocalExtensionEntryParser();

    suite('isValid()', () => {

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

    suite('parse()', () => {

        test('should return parsed entry', () => {
            const parsed = parser.parse({ id: 'ext.id', type: 'local', path: 'relative-path' }, 'root');

            assert.deepEqual(parsed, {
                extensionPath: path.join('root', 'relative-path'),
                id: 'ext.id',
                type: 'local',
            });
        });

    });

});
