import IMarketplaceVersion from './IMarketplaceVersion';

export default interface IMarketplaceMetadata {
    readonly id: string;
    readonly versions: IMarketplaceVersion[];
    // more as necessary
}
