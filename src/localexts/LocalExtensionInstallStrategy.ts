import IConfiguredExtension from '../config/IConfiguredExtension';
import IInstallerStrategy from '../control/IInstallerStrategy';
import LocalExtension from './LocalExtension';

export default class LocalExtensionInstallStrategy implements IInstallerStrategy<LocalExtension> {

    public isValid(ext: IConfiguredExtension): boolean {
        throw new Error('Method not implemented.');
    }
    public install(ext: LocalExtension): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
