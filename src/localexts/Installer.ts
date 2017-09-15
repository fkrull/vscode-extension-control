import LocalExtension from "./LocalExtension";

export default class Installer {
    install(exts: Array<LocalExtension>): Promise<void> {
        return Promise.resolve();
    }
}