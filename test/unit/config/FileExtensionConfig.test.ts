import * as assert from 'assert';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as tmp from 'tmp';
import { Mock } from 'typemoq';

import FileExtensionConfig from '../../../src/config/FileExtensionConfig';
import IConfiguration from '../../../src/config/IConfiguration';
import IConfiguredExtension from '../../../src/config/IConfiguredExtension';
import IJsonEntryParser from '../../../src/config/IJsonEntryParser';

class TestParser1 implements IJsonEntryParser<IConfiguredExtension> {
    public isValid(entry: any): boolean {
        return typeof entry === 'string';
    }

    public parse(entry: any): IConfiguredExtension {
        return {id: entry, type: 'test'};
    }
}

// tslint:disable-next-line:max-classes-per-file
class TestParser2 implements IJsonEntryParser<IConfiguredExtension> {
    public isValid(entry: any): boolean {
        return typeof entry === 'object';
    }

    public parse(entry: any): IConfiguredExtension {
        return {id: entry.name, type: 'test'};
    }
}

suite('FileExtensionConfig.getConfiguredExtensions', () => {

    let tmpdir: tmp.SynchrounousResult;
    const configMock = Mock.ofType<IConfiguration>();

    setup(() => {
        tmpdir = tmp.dirSync({ unsafeCleanup: true });
        configMock.reset();
        configMock
            .setup((x) => x.userDirectory)
            .returns(() => tmpdir.name);
    });

    teardown(() => {
        tmpdir.removeCallback();
    });

    test('should return nothing if extensions.json doesn\'t exist', async () => {
        const fileExtensionConfig = new FileExtensionConfig(configMock.object, []);

        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.equal(exts, undefined);
    });

    test('should parse empty extensions.json', async () => {
        await givenExtensionJSON([]);
        const fileExtensionConfig = new FileExtensionConfig(configMock.object, []);

        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.deepEqual(exts, []);
    });

    test('should invoke matching parser for entries', async () => {
        await givenExtensionJSON([
            'entry1',
            'entry2',
            {name: 'entry3'},
        ]);
        const fileExtensionConfig = new FileExtensionConfig(
            configMock.object,
            [new TestParser1(), new TestParser2()],
        );

        const exts = await fileExtensionConfig.getConfiguredExtensions();

        assert.deepEqual(exts, [
            {id: 'entry1', type: 'test'},
            {id: 'entry2', type: 'test'},
            {id: 'entry3', type: 'test'},
        ]);
    });

    test('should throw error if no matching parser', async () => {
        await givenExtensionJSON([
            'entry1',
        ]);
        const fileExtensionConfig = new FileExtensionConfig(configMock.object, []);

        try {
            const exts = await fileExtensionConfig.getConfiguredExtensions();
        } catch (e) {
            // pass
            return;
        }

        assert.fail(undefined, undefined, 'should have failed with an error');
    });

    async function givenExtensionJSON(contents: any[]): Promise<void> {
        await fs.writeFile(
            path.join(tmpdir.name, 'extensions.json'),
            JSON.stringify(contents),
        );
    }

});
