import * as tmp from 'tmp';

export interface IDisposable {
    dispose(): Promise<void>;
}

function wrapPromise<T>(lazyPromise: () => Promise<T>): Promise<T> {
    try {
        return lazyPromise();
    } catch (error) {
        return Promise.reject(error);
    }
}

export function using<T>(disposable: IDisposable, action: () => Promise<T>): Promise<T> {
    return wrapPromise(action)
        .then(
            (value) => {
                disposable.dispose();
                return value;
            },
            (error) => {
                disposable.dispose();
                throw error;
            },
        );
}

export interface ITempFile extends IDisposable {
    readonly fd: number;
    readonly path: string;
}

class TempFile implements ITempFile {
    constructor(
        public readonly path: string,
        public readonly fd: number,
        private readonly cleanupCallback: () => void,
    ) {}

    public dispose(): Promise<void> {
        this.cleanupCallback();
        return Promise.resolve();
    }
}

export function tempFile(): Promise<ITempFile> {
    return new Promise((resolve, reject) => {
        tmp.file((err, path, fd, cleanupCallback) => {
            if (!err) {
                resolve(new TempFile(path, fd, cleanupCallback));
            } else {
                reject(err);
            }
        });
    });
}
