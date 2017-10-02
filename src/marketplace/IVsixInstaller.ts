import IMarketplaceMetadata from './IMarketplaceMetadata';

export default interface IVsixInstaller {
    install(vsixPath: string): Promise<void>;
}
