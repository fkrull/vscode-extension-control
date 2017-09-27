import * as assert from 'assert';

import IConfiguredExtension from '../../../src/config/IConfiguredExtension';
import LocalExtension from '../../../src/localexts/LocalExtension';
import LocalExtensionInstallStrategy from '../../../src/localexts/LocalExtensionInstallStrategy';

suite('LocalExtensionInstallStrategy.isValid', () => {

    const localExtStrategy = new LocalExtensionInstallStrategy();

    const valid: Array<[string, IConfiguredExtension]> = [
        ['a LocalExtension instance', new LocalExtension('ext.id', '/path')],
    ];
    const invalid: Array<[string, IConfiguredExtension]> = [
        ['an object with type !== \'local\'', {id: 'ext.id', type: 'not-local'}],
        ['an object with type === \'local\' that\'s not a LocalExtension instance', {id: 'ext.id', type: 'local'}],
    ];

    for (const [message, value] of valid) {
        test(`should accept '${message}'`, () => {
            assert(localExtStrategy.isValid(value));
        });
    }

    for (const [message, value] of invalid) {
        test(`should not accept '${message}'`, () => {
            assert(!localExtStrategy.isValid(value));
        });
    }

});
