export interface Extension<T> {
    readonly id: string;
}

export interface Extensions {
    readonly all: Array<Extension<any>>;
}

export interface VSCode {
    readonly extensions: Extensions;
}
