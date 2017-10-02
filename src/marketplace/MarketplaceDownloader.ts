import * as axios from 'axios';
import * as fs from 'fs-extra';

import { ITempFile, tempFile } from '../using';

import IMarketplaceDownloader from './IMarketplaceDownloader';
import IMarketplaceVersion from './IMarketplaceVersion';

const VSIX_RESOURCE = '/Microsoft.VisualStudio.Services.VSIXPackage';

export default class MarketplaceDownloader implements IMarketplaceDownloader {

    constructor(
        private readonly axiosInstance: axios.AxiosInstance,
    ) {}

    public async download(versionMetadata: IMarketplaceVersion): Promise<ITempFile> {
        const response = await this.axiosInstance.get(
            `${versionMetadata.assetUri}${VSIX_RESOURCE}`,
            { responseType: 'stream' },
        );
        const tmpfile = await tempFile();
        await response.data.pipe(fs.createWriteStream(tmpfile.path, { fd: tmpfile.fd }));
        return tmpfile;
    }

}
