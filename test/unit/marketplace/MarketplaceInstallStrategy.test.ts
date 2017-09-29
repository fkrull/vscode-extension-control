import * as assert from 'assert';
import { Mock, Times } from 'typemoq';

import IMarketplaceDownloader from '../../../src/marketplace/IMarketplaceDownloader';
import IMarketplaceService from '../../../src/marketplace/IMarketplaceService';
import IVsixInstaller from '../../../src/marketplace/IVsixInstaller';
import MarketplaceExtension from '../../../src/marketplace/MarketplaceExtension';
import MarketplaceInstallStrategy from '../../../src/marketplace/MarketplaceInstallStrategy';

suite('MarketplaceInstallStrategy', () => {

    const marketplaceServiceMock = Mock.ofType<IMarketplaceService>();
    const marketplaceDownloaderMock = Mock.ofType<IMarketplaceDownloader>();
    const vsixInstaller = Mock.ofType<IVsixInstaller>();
    const strategy = new MarketplaceInstallStrategy(
        marketplaceServiceMock.object,
        marketplaceDownloaderMock.object,
        vsixInstaller.object,
    );

    setup(() => {
        marketplaceServiceMock.reset();
        marketplaceDownloaderMock.reset();
        vsixInstaller.reset();
    });

    suite('isValid', () => {

        testMany(
            'should accept',
            (value) => strategy.isValid(value),
            [
                ['a MarketplaceExtension instance', new MarketplaceExtension('ext.id')],
            ],
        );

        testMany(
            'should not accept',
            (value) => !strategy.isValid(value),
            [
                ['an object with type !== \'marketplace\'', { id: 'ext.id', type: 'something-else' }],
            ],
        );

    });

    suite('install', () => {

        test('should fetch metadata, download, and install the given extension', async () => {
            const ext = new MarketplaceExtension('ext.id');
            const metadata = { id: 'ext.id' };
            marketplaceServiceMock
                .setup((x) => x.get('ext.id'))
                .returns(() => Promise.resolve(metadata));
            marketplaceDownloaderMock
                .setup((x) => x.download(metadata))
                .returns(() => Promise.resolve('/download/path'));
            vsixInstaller
                .setup((x) => x.install(metadata, '/download/path'))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await strategy.install(ext);

            vsixInstaller.verifyAll();
        });

    });

});

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
    return typeof (value as Promise<T>).then === 'function';
}

function testMany<T>(
    namePrefix: string,
    callback: (value: any) => boolean | Promise<boolean>,
    data: Array<[string, any]>,
) {
    for (const [message, value] of data) {
        test(`${namePrefix} '${message}'`, () => {
            const ret = callback(value);
            if (isPromise(ret)) {
                return ret.then((isAccepted) => assert(isAccepted));
            } else {
                assert(ret);
            }
        });
    }
}
