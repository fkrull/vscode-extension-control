export interface IExtension<T> {
    readonly id: string;
    readonly extensionPath: string;
}

export interface IExtensions {
    readonly all: Array<IExtension<any>>;
}

export interface IEnv {
    readonly appRoot: string;
}

export interface IVSCodeAPI {
    readonly extensions: IExtensions;
    readonly env: IEnv;
}
