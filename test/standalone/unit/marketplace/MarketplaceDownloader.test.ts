import * as assert from 'assert';
import * as axios from 'axios';
import * as fs from 'fs-extra';
import { Readable } from 'stream';
import { Mock, Times } from 'typemoq';

import { resolveMock } from '../../../helper';

import MarketplaceDownloader from 'marketplace/MarketplaceDownloader';
import { IDisposable } from 'using';

class StringStream extends Readable {
    constructor(private readonly delay: number, private readonly text: string) {
        super();
    }

    public _read(size: number) {
        setTimeout(() => {
            this.push(this.text);
            this.emit('end');
        }, this.delay);
    }
}

suite('MarketplaceDownloader', () => {

    const axiosMock = Mock.ofType<axios.AxiosInstance>();
    const responseMock = Mock.ofType<axios.AxiosResponse>();
    const downloader = new MarketplaceDownloader(
        axiosMock.object,
    );

    let disposables: IDisposable[] = [];

    setup(() => {
        axiosMock.reset();
        responseMock.reset();
    });

    teardown(async () => {
        await Promise.all(disposables.map((disposable) => disposable.dispose()));
        disposables = [];
    });

    suite('download()', () => {

        test('should download VSIX package to temporary file', async function() {
            this.slow(500);

            const version = {
                version: '1.0.0',
                assetUri: '/asset/uri',
                fallbackAssetUri: '/fallback/uri',
                manifest: null,
            };
            axiosMock
                .setup((x) => x.get(
                    '/asset/uri/Microsoft.VisualStudio.Services.VSIXPackage',
                    { responseType: 'stream' },
                ))
                .returns(() => resolveMock(responseMock))
                .verifiable(Times.once());
            responseMock
                .setup((x) => x.data)
                .returns(() => new StringStream(100, 'downloaded file contents'))
                .verifiable(Times.once());

            const tmpfile = await downloader.download(version);
            disposables.push(tmpfile);

            axiosMock.verifyAll();
            responseMock.verifyAll();
            const readback = (await fs.readFile(tmpfile.path)).toString();
            assert.equal(readback, 'downloaded file contents');
            tmpfile.dispose();
            assert(!await fs.exists(tmpfile.path), 'temp file should be disposed');
        });

    });
});
