import * as assert from 'assert';
import * as axios from 'axios';
import { IMock, It, Mock, Times } from 'typemoq';

import { resolveMock } from '../../../helper';

import MarketplaceService from 'marketplace/MarketplaceService';

suite('MarketplaceService', () => {

    const axiosMock = Mock.ofType<axios.AxiosInstance>();
    const service = new MarketplaceService(axiosMock.object);

    setup(() => {
        axiosMock.reset();
    });

    suite('get()', () => {

        test('should get extension and latest version info from Marketplace web service', async () => {
            const responseMock1 = Mock.ofType<axios.AxiosResponse>();
            axiosMock
                .setup((x) => x.post(
                    'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=3.0-preview',
                    {
                        filters: [{
                            criteria: [
                                {
                                    filterType: 8,
                                    value: 'Microsoft.VisualStudio.Code',
                                },
                                {
                                    filterType: 7,
                                    value: 'ext.id',
                                },
                            ],
                        }],
                        flags: 389,
                    },
                ))
                .returns(() => resolveMock(responseMock1))
                .verifiable(Times.once());
            responseMock1
                .setup((x) => x.data)
                .returns(() => ({
                    results: [{
                        extensions: [{
                            extensionName: 'id',
                            publisher: {
                                publisherName: 'ext',
                            },
                            versions: [
                                {
                                    version: '1.0.0',
                                    assetUri: '/asset/uri/1.0.0',
                                    fallbackAssetUri: '/fallback/uri/1.0.0',
                                },
                                {
                                    version: '0.1.0',
                                    assetUri: '/asset/uri/0.1.0',
                                    fallbackAssetUri: '/fallback/uri/0.1.0'
                                },
                            ],
                        }],
                    }],
                }))
                .verifiable(Times.once());
            const responseMock2 = Mock.ofType<axios.AxiosResponse>();
            axiosMock
                .setup((x) => x.get('/asset/uri/1.0.0/Microsoft.VisualStudio.Code.Manifest'))
                .returns(() => resolveMock(responseMock2))
                .verifiable(Times.once());
            responseMock2
                .setup((x) => x.data)
                .returns(() => ({
                    testManifest: 'value',
                }))
                .verifiable(Times.once());

            const metadata = await service.get('ext.id');

            axiosMock.verifyAll();
            responseMock1.verifyAll();
            responseMock2.verifyAll();
            assert.deepEqual(metadata, {
                id: 'ext.id',
                versions: [{
                    version: '1.0.0',
                    assetUri: '/asset/uri/1.0.0',
                    fallbackAssetUri: '/fallback/uri/1.0.0',
                    manifest: {
                        testManifest: 'value',
                    },
                }],
            });
        });

    });

});
