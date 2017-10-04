import IJsonEntryParser from 'config/IJsonEntryParser';
import MarketplaceExtension from './MarketplaceExtension';

export default class MarketplaceEntryParser implements IJsonEntryParser<MarketplaceExtension> {

    public isValid(entry: any): boolean {
        return this.isPlainId(entry) || this.isValidObject(entry);
    }

    public parse(entry: any, configFilePath: string): MarketplaceExtension {
        if (this.isPlainId(entry)) {
            return new MarketplaceExtension(entry as string);
        } else {
            return new MarketplaceExtension(entry.id as string);
        }
    }

    private isPlainId(entry: any): boolean {
        return typeof entry === 'string';
    }

    private isValidObject(entry: any): boolean {
        return typeof entry === 'object' &&
            typeof entry.id === 'string' &&
            entry.type === 'marketplace';
    }

}
