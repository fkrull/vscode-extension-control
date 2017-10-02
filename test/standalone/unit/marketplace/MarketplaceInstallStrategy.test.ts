import * as assert from 'assert';
import { Mock, Times } from 'typemoq';

import { resolveMock, testMany } from '../../../helper';

import IMarketplaceDownloader from '../../../../src/marketplace/IMarketplaceDownloader';
import IMarketplaceMetadata from '../../../../src/marketplace/IMarketplaceMetadata';
import IMarketplaceService from '../../../../src/marketplace/IMarketplaceService';
import IVsixInstaller from '../../../../src/marketplace/IVsixInstaller';
import MarketplaceExtension from '../../../../src/marketplace/MarketplaceExtension';
import MarketplaceInstallStrategy from '../../../../src/marketplace/MarketplaceInstallStrategy';
import { ITempFile } from '../../../../src/using';

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

    suite('isValid()', () => {

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

    suite('install()', () => {

        const tmpfileMock = Mock.ofType<ITempFile>();

        setup(() => {
            tmpfileMock.reset();
        });

        test('should fetch metadata, download, and install the given extension', async () => {
            const ext = new MarketplaceExtension('ext.id');
            const version = {
                version: '1.0.0',
                assetUri: '/asset/uri',
                fallbackAssetUri: '/asset/uri',
                manifest: null,
            };
            const metadata = {
                id: 'ext.id',
                versions: [version],
            };
            tmpfileMock
                .setup((x) => x.path)
                .returns(() => '/download/path');
            tmpfileMock
                .setup((x) => x.dispose())
                .verifiable(Times.once());
            marketplaceServiceMock
                .setup((x) => x.get('ext.id'))
                .returns(() => Promise.resolve(metadata));
            marketplaceDownloaderMock
                .setup((x) => x.download(version))
                .returns(() => resolveMock(tmpfileMock));
            vsixInstaller
                .setup((x) => x.install('/download/path'))
                .returns(() => Promise.resolve())
                .verifiable(Times.once());

            await strategy.install(ext);

            tmpfileMock.verifyAll();
            vsixInstaller.verifyAll();
        });

    });

});
