import IMarketplaceMetadata from './IMarketplaceMetadata';

export default interface IMarketplaceDownloader {
    download(metadata: IMarketplaceMetadata): Promise<string>;
}
