import { CashPaymentConfiguration, CutPieceTot } from '@poss-web/shared/models';

export class CutPieceTotAdaptor {
  static getCutPieceTotDetails(data: any): CutPieceTot[] {
    const cutPieceTotData: CutPieceTot[] = [];

    for (const listItem of data.results) {
      cutPieceTotData.push(listItem);
    }

    return cutPieceTotData;
  }

  static getCutPieceTotDetail(data: any): CutPieceTot {
    return data;
  }
}
