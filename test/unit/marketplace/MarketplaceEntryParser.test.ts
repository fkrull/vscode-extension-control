import * as assert from 'assert';

import { testMany } from '../../helper';

import MarketplaceEntryParser from '../../../src/marketplace/MarketplaceEntryParser';

suite('MarketplaceEntryParser', () => {

    const parser = new MarketplaceEntryParser();

    suite('isValid()', () => {

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

    suite('parse()', () => {

        test('should parse string ID', () => {
            const parsed = parser.parse('ext.id', 'path');

            assert.deepEqual(parsed, {
                id: 'ext.id',
                type: 'marketplace',
            });
        });

        test('should parse object entry', () => {
            const parsed = parser.parse({ id: 'other.id', type: 'marketplace' }, 'path');

            assert.deepEqual(parsed, {
                id: 'other.id',
                type: 'marketplace',
            });
        });

    });

});
