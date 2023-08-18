import {
  PrinterConfigDetails,
  PrinterConfigList
} from '@poss-web/shared/models';

export class PrinterConfigAdaptor {
  static PrinterConfigResponse(data: any): PrinterConfigDetails {
    let fileResponse: PrinterConfigDetails;
    fileResponse = {
      documentType: data.documentType,
      hostname: data.hostname,
      printerName: data.printerName,

      id: data.id,

      isActive: data.isActive,
      locationCode: data.locationCode
    };

    return fileResponse;
  }

  static PrinterConfigDetails(data: any): PrinterConfigList {
    const list: PrinterConfigDetails[] = [];

    if (!data) {
      return null;
    }

    data.results.forEach(element => {
      list.push({
        documentType: element.documentType,
        hostname: element.hostname,
        printerName: element.printerName,

        id: element.id,

        isActive: element.isActive,
        locationCode: element.locationCode
      });
    });

    return { list: list, count: data.totalElements };
  }
}
