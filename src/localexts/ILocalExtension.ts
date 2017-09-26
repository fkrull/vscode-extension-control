import IConfiguredExtension from '../config/IConfiguredExtension';

export default interface ILocalExtension extends IConfiguredExtension {
    readonly type: 'local';
    readonly extensionPath: string;
}
