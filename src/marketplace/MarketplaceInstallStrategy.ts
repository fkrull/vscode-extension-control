import IConfiguredExtension from '../config/IConfiguredExtension';
import IInstallerStrategy from '../control/IInstallerStrategy';
import MarketplaceExtension from './MarketplaceExtension';

export default class MarketplaceInstallStrategy implements IInstallerStrategy<MarketplaceExtension> {

    public isValid(ext: IConfiguredExtension): boolean {
        return ext instanceof MarketplaceExtension;
    }

    public install(ext: MarketplaceExtension): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
