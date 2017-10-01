import * as axios from 'axios';

import IMarketplaceMetadata from './IMarketplaceMetadata';
import IMarketplaceService from './IMarketplaceService';
import IMarketplaceVersion from './IMarketplaceVersion';

// TODO: make configurable
const EXTENSION_QUERY_URL =
    'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=3.0-preview';

const MANIFEST_RESOURCE = '/Microsoft.VisualStudio.Code.Manifest';

enum MarketplaceFilterType {
    ExtensionId = 7,
    App = 8,
}

const VSCODE_FILTER = {
    filterType: MarketplaceFilterType.App,
    value: 'Microsoft.VisualStudio.Code',
};

const FLAGS = 389;

export default class MarketplaceService implements IMarketplaceService {

    constructor(
        private readonly axiosInstance: axios.AxiosInstance,
    ) {}

    public async get(id: string): Promise<IMarketplaceMetadata> {
        const res = await this.axiosInstance.post(
            EXTENSION_QUERY_URL,
            this.getQueryFilter(id),
        );
        return await this.getMetadataFromResponse(res.data.results[0].extensions[0]);
    }

    private async getMetadataFromResponse(res: any): Promise<IMarketplaceMetadata> {
        return {
            id: `${res.publisher.publisherName}.${res.extensionName}`,
            versions: await this.getVersions(res),
        };
    }

    private getVersions(res: any): Promise<IMarketplaceVersion[]> {
        return Promise.all(
            (res.versions as any[]).map(async (v) => {
                const response = await this.axiosInstance.get(`${v.assetUri}${MANIFEST_RESOURCE}`);
                return {
                    version: v.version,
                    assetUri: v.assetUri,
                    fallbackAssetUri: v.fallbackAssetUri,
                    manifest: response.data,
                };
            }),
        );
    }

    private getQueryFilter(id: string) {
        return {
            filters: [ { criteria: [
                    VSCODE_FILTER,
                    this.getExtensionFilter(id),
                ] },
            ],
            flags: FLAGS,
        };
    }

    private getExtensionFilter(id: string) {
        return {
            filterType: MarketplaceFilterType.ExtensionId,
            value: id,
        };
    }

}
