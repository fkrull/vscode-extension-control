import IConfiguredExtension from '../config/IConfiguredExtension';

export default interface ILocalExtension extends IConfiguredExtension {
    readonly extensionPath: string;
}
