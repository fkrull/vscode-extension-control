import IConfiguredExtension from '../config/IConfiguredExtension';

export default class LocalExtension implements IConfiguredExtension {
    public readonly type: 'local';

    constructor(
        public readonly id: string,
        public readonly extensionPath: string,
    ) {
        this.type = 'local';
    }
}
