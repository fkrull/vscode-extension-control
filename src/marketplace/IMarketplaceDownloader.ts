import IMarketplaceVersion from './IMarketplaceVersion';

export default interface IMarketplaceDownloader {
    download(version: IMarketplaceVersion): Promise<string>;
}
