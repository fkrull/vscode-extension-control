import IMarketplaceMetadata from './IMarketplaceMetadata';

export default interface IVsixInstaller {
    install(metadata: IMarketplaceMetadata, vsixPath: string): Promise<void>;
}
