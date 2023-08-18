import { BinCode } from '@poss-web/shared/models';

export class BinCodeAdaptor {
  static binCodeDataFromJson(data: any): BinCode {
    return {
      binCode: data.binCode,
      description: data.description
    };
  }
}
