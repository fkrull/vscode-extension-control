import IConfiguredExtension from '../config/IConfiguredExtension';
import IInstallerStrategy from '../control/IInstallerStrategy';
import IMarketplaceDownloader from './IMarketplaceDownloader';
import IMarketplaceService from './IMarketplaceService';
import IVsixInstaller from './IVsixInstaller';
import MarketplaceExtension from './MarketplaceExtension';

export default class MarketplaceInstallStrategy implements IInstallerStrategy<MarketplaceExtension> {

    constructor(
        private readonly marketplaceService: IMarketplaceService,
        private readonly downloader: IMarketplaceDownloader,
        private readonly vsixInstaller: IVsixInstaller,
    ) {}

    public isValid(ext: IConfiguredExtension): boolean {
        return ext instanceof MarketplaceExtension;
    }

    public async install(ext: MarketplaceExtension): Promise<void> {
        const metadata = await this.marketplaceService.get(ext.id);
        const downloadPath = await this.downloader.download(metadata.versions[0]);
        await this.vsixInstaller.install(metadata, downloadPath);
    }

}
