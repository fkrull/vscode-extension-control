import IMarketplaceMetadata from './IMarketplaceMetadata';

export default interface IMarketplaceService {
    get(id: string): Promise<IMarketplaceMetadata>;
}
