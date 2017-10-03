import * as assert from 'assert';
import axios from 'axios';

import MarketplaceService from '../../../../src/marketplace/MarketplaceService';

suite('integration: MarketplaceService.get', function() {

    this.slow(1500);
    this.timeout(10000);

    const service = new MarketplaceService(
        axios,
    );

    test('should retrieve extension metadata from VSCode marketplace', async () => {
        const metadata = await service.get('ms-vscode.wordcount');

        assert.equal(metadata.id, 'ms-vscode.wordcount');
        assert.equal(metadata.versions.length, 1);
        const version = metadata.versions[0];
        assert.equal(version.manifest.publisher, 'ms-vscode');
        assert.equal(version.manifest.name, 'wordcount');
        assert.equal(version.manifest.version, version.version);
        const res = await axios(`${version.assetUri}/Microsoft.VisualStudio.Code.Manifest`);
        assert.deepEqual(version.manifest, res.data);
    });

});
