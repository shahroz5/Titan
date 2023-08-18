import { BinCode } from '@poss-web/shared/models';
import { BinCodeAdaptor } from '../masters/bin-code.adaptor';

export class BinCodeHelper {
  static getBinCodes(data: any): BinCode[] {
    const BinCodes: BinCode[] = [];
    for (const binCode of data) {
      BinCodes.push(BinCodeAdaptor.binCodeDataFromJson(binCode));
    }
    return BinCodes;
  }
}
