import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import IConfiguration from 'config/IConfiguration';
import IConfiguredExtension from 'config/IConfiguredExtension';
import IExtensionConfig from 'config/IExtensionConfig';
import IJsonEntryParser from 'config/IJsonEntryParser';

export default class FileExtensionConfig implements IExtensionConfig {

    constructor(
        private readonly config: IConfiguration,
        private readonly parsers: Array<IJsonEntryParser<IConfiguredExtension>>,
    ) {}

    public async getConfiguredExtensions(): Promise<IConfiguredExtension[] | undefined> {
        let extJSON: Buffer;
        try {
            extJSON = await fs.readFile(path.join(this.config.userDirectory, 'extensions.json'));
        } catch (exc) {
            if ((exc as NodeJS.ErrnoException).code === 'ENOENT') {
                return undefined;
            }
            throw exc;
        }

        const parsedJson = JSON.parse(extJSON.toString());
        return (parsedJson as any[]).map((elem) => {
            for (const parser of this.parsers) {
                if (parser.isValid(elem)) {
                    return parser.parse(elem, this.config.userDirectory);
                }
            }
            throw new Error(`no matching parser for '${elem}'`);
        });
    }

}
