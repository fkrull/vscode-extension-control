import * as fs from 'fs-extra';
import * as path from 'path';

import IConfiguration from './IConfiguration';
import IConfiguredExtension from './IConfiguredExtension';
import IExtensionConfig from './IExtensionConfig';
import IJsonEntryParser from './IJsonEntryParser';

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
            return undefined;
        }

        const parsedJson = JSON.parse(extJSON.toString());
        return (parsedJson as any[]).map((elem) => {
            for (const parser of this.parsers) {
                if (parser.isValid(elem)) {
                    return parser.parse(elem);
                }
            }
            throw new Error(`no matching parser for '${elem}'`);
        });
    }

}
