import LocalExtension from './LocalExtension';

export default class Installer {
    public install(exts: LocalExtension[]): Promise<void> {
        return Promise.resolve();
    }

    public uninstall(exts: LocalExtension[]): Promise<void> {
        return Promise.resolve();
    }
}
