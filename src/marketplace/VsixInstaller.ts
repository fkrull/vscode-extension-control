import IVsixInstaller from './IVsixInstaller';

export default class VsixInstaller implements IVsixInstaller {

    public install(vsixPath: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

}
