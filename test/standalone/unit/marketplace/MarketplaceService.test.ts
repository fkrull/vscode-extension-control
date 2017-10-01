import * as assert from 'assert';
import * as axios from 'axios';
import { IMock, It, Mock, Times } from 'typemoq';

import MarketplaceService from '../../../../src/marketplace/MarketplaceService';

function resolveMock<T>(mock: IMock<T>): Promise<T> {
    mock.setup((x: any) => x.then).returns(() => undefined);
    return Promise.resolve(mock.object);
}

suite('MarketplaceService.get', () => {

    const axiosMock = Mock.ofType<axios.AxiosInstance>();
    const service = new MarketplaceService(axiosMock.object);

    setup(() => {
        axiosMock.reset();
    });

    test('should get extension and version info from Marketplace web service', async () => {
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
                        versions: [{
                            version: '1.0.0',
                            assetUri: '/asset/uri',
                            fallbackAssetUri: '/fallback/uri',
                        }],
                    }],
                }],
            }))
            .verifiable(Times.once());
        const responseMock2 = Mock.ofType<axios.AxiosResponse>();
        axiosMock
            .setup((x) => x.get('/asset/uri/Microsoft.VisualStudio.Code.Manifest'))
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
                assetUri: '/asset/uri',
                fallbackAssetUri: '/fallback/uri',
                manifest: {
                    testManifest: 'value',
                },
            }],
        });
    });

});
