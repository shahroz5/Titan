import { PIFSeries, PIFSeriesResponse } from '@poss-web/shared/models';

export class PIFSeriesAdaptor {
  static getPIFSeries(data: any): PIFSeriesResponse {
    let pifSeriesResponse: PIFSeriesResponse;
    const pifSeries: PIFSeries[] = [];
    for (const series of data.results) {
      console.log('series', series);
      pifSeries.push({
        id: series.id,
        bankName: series.bankName,
        paymentCode: series.paymentCode,
        fromNo: series.fromNo,
        toNo: series.toNo,
        currentSeqNo: series.currentSeqNo,
        isHomeBank: series.isHomeBank,
        isActive: series.isActive
      });
    }
    return (pifSeriesResponse = {
      pifSeries: pifSeries,
      totalElements: data.totalElements
    });
  }
}
