export default interface IVersion {
    readonly version: string;
    readonly assetUri: string;
    readonly fallbackAssetUri: string;
    readonly manifest: any;
}
