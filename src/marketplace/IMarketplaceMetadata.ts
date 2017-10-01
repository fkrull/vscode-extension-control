import IVersion from './IMarketplaceVersion';

export default interface IMarketplaceMetadata {
    readonly id: string;
    readonly versions: IVersion[];
    // more as necessary
}
