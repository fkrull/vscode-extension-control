import * as assert from 'assert';
import * as fs from 'fs-extra';
import { Mock, Times } from 'typemoq';

import { fail } from '../../helper';

import { IDisposable, ITempFile, tempFile, using } from 'using';

suite('using', () => {

    const disposableMock = Mock.ofType<IDisposable>();

    setup(() => {
        disposableMock.reset();
        disposableMock
            .setup((x) => x.dispose())
            .verifiable(Times.once());
    });

    test('should call dispose if promise resolves', async () => {
        const value = await using(disposableMock.object, () => Promise.resolve('return value from action'));

        assert.equal(value, 'return value from action');
        disposableMock.verifyAll();
    });

    test('should call dispose and fail if promise is rejected', () => {
        const promise = using(disposableMock.object, () => Promise.reject('test'));

        return promise
            .then((_) => fail('Promise should be rejected'))
            .catch((reason) => {
                assert.equal(reason, 'test');
                disposableMock.verifyAll();
            });
    });

    test('should call dispose and fail promise if an error is thrown', () => {
        const promise = using(disposableMock.object, () => { throw new Error('test'); });

        return promise
            .then((_) => fail('Promise should be rejected'))
            .catch((reason) => {
                assert.deepEqual(reason, new Error('test'));
                disposableMock.verifyAll();
            });
    });

});

suite('tempFile', () => {

    let tmpfile: ITempFile | undefined;

    setup(() => {
        tmpfile = undefined;
    });

    teardown(async () => {
        if (tmpfile !== undefined && await fs.exists(tmpfile.path)) {
            await fs.unlink(tmpfile.path);
        }
    });

    test('should create and open temporary file', async () => {
        tmpfile = await tempFile();

        await fs.write(tmpfile.fd, 'test string', 0);
        await fs.close(tmpfile.fd);
        const readback = await fs.readFile(tmpfile.path);

        assert.equal(readback, 'test string');
    });

    test('should delete temporary file on dispose', async () => {
        tmpfile = await tempFile();

        assert(await fs.exists(tmpfile.path), 'temp file should exist');
        await tmpfile.dispose();
        assert(!await fs.exists(tmpfile.path), 'temp file should be deleted');
    });

});
