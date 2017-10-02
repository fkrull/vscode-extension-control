import { ITempFile } from '../using';

import IMarketplaceVersion from './IMarketplaceVersion';

export default interface IMarketplaceDownloader {
    download(version: IMarketplaceVersion): Promise<ITempFile>;
}
