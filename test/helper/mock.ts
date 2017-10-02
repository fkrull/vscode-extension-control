import { IMock } from 'typemoq';

export function resolveMock<T>(mock: IMock<T>): Promise<T> {
    mock.setup((x: any) => x.then).returns(() => undefined);
    return Promise.resolve(mock.object);
}
