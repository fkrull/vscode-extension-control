import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import { Mock } from 'typemoq';

import { fail } from '../../../helper';

import FileExtensionConfig from '../../../../src/config/FileExtensionConfig';
import IConfiguration from '../../../../src/config/IConfiguration';
import IConfiguredExtension from '../../../../src/config/IConfiguredExtension';
import IJsonEntryParser from '../../../../src/config/IJsonEntryParser';

suite('FileExtensionConfig.getConfiguredExtensions()', () => {

    let tmpdir: tmp.SynchrounousResult;
    const configMock = Mock.ofType<IConfiguration>();
    const parser1 = Mock.ofType<IJsonEntryParser<IConfiguredExtension>>();
    const parser2 = Mock.ofType<IJsonEntryParser<IConfiguredExtension>>();
    const fileExtensionConfig = new FileExtensionConfig(
        configMock.object,
        [parser1.object, parser2.object],
    );

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });

        configMock.reset();
        configMock
            .setup((x) => x.userDirectory)
            .returns(() => tmpdir.name);

        parser1.reset();
        parser1
            .setup((x) => x.isValid('entry1'))
            .returns(() => true);
        parser1
            .setup((x) => x.parse('entry1', tmpdir.name))
            .returns(() => ({ id: 'entry1', type: 'test' }));

        parser2.reset();
        parser2
            .setup((x) => x.isValid('entry2'))
            .returns(() => true);
        parser2
            .setup((x) => x.parse('entry2', tmpdir.name))
            .returns(() => ({ id: 'entry2', type: 'test' }));
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should return nothing if extensions.json doesn\'t exist', async () => {
        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.equal(exts, undefined);
    });

    test('should parse empty extensions.json', async () => {
        await givenExtensionJSON([]);

        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.deepEqual(exts, []);
    });

    test('should invoke matching parser for entries', async () => {
        await givenExtensionJSON([
            'entry1',
            'entry2',
            'entry1',
        ]);

        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.deepEqual(exts, [
            {id: 'entry1', type: 'test'},
            {id: 'entry2', type: 'test'},
            {id: 'entry1', type: 'test'},
        ]);
    });

    test('should throw error if no matching parser', async () => {
        await givenExtensionJSON([
            'entry3',
        ]);

        try {
            const exts = await fileExtensionConfig.getConfiguredExtensions();
        } catch (e) {
            // pass
            return;
        }

        fail('should have failed with an error');
    });

    async function givenExtensionJSON(contents: any[]): Promise<void> {
        await fs.writeJSON(
            path.join(tmpdir.name, 'extensions.json'),
            contents,
        );
    }

});
