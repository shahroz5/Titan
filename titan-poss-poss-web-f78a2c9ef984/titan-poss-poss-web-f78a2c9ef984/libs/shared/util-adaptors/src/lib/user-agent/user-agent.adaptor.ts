import { Hostname } from '@poss-web/shared/models';

export class UAAdaptor {
  static getHostConfiguration(data: any): boolean {
    if (!data) {
      return false;
    }

    if (data.results.includes('UNIPAY')) {
      return true;
    } else {
      return false;
    }
  }

  static getEncryptedHostname(data: any): Hostname {
    if (!data) {
      return null;
    }

    return {
      hostname: data.encryptedData
    };
  }
}
