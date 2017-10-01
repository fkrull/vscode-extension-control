export default interface IMarketplaceVersion {
    readonly version: string;
    readonly assetUri: string;
    readonly fallbackAssetUri: string;
    readonly manifest: any;
}
