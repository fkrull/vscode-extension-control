import IConfiguredExtension from 'config/IConfiguredExtension';

export default class MarketplaceExtension implements IConfiguredExtension {
    public readonly type: 'marketplace';

    constructor(
        public readonly id: string,
    ) {
        this.type = 'marketplace';
    }

}
