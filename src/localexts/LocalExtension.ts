import IConfiguredExtension from '../config/IConfiguredExtension';

export default class LocalExtension implements IConfiguredExtension {
    public readonly id: string;
    public readonly type: 'local';
    public readonly extensionPath: string;

    constructor(id: string, extensionPath: string) {
        this.id = id;
        this.extensionPath = extensionPath;
        this.type = 'local';
    }
}
