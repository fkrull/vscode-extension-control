import IConfiguredExtension from '../config/IConfiguredExtension';
import IInstallerStrategy from '../control/IInstallerStrategy';
import ILocalExtension from './ILocalExtension';

export default class LocalExtensionInstallStrategy implements IInstallerStrategy<ILocalExtension> {

    public isValid(ext: IConfiguredExtension): boolean {
        throw new Error('Method not implemented.');
    }
    public install(ext: ILocalExtension): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
