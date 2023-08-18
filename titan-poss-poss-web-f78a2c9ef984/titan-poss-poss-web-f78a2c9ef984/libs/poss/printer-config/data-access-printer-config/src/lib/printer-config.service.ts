import { Injectable } from '@angular/core';
import {
  ConfigListingPayload,
  PrinterConfigDetails,
  PrinterConfigList,
  SortItem
} from '@poss-web/shared/models';
import { PrinterConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getPrinterDetailsUrl,
  getAddPrinterDetailsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PrinterConfigService {
  constructor(private apiService: ApiService) {}

  printerList(
    payload: ConfigListingPayload,
    sortField: SortItem
  ): Observable<PrinterConfigList> {
    const url = getPrinterDetailsUrl(
      payload.pageIndex,
      payload.pageSize,
      sortField
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) => PrinterConfigAdaptor.PrinterConfigDetails(data))
      );
  }

  addPrinter(payload: PrinterConfigDetails): Observable<PrinterConfigDetails> {
    const url = getAddPrinterDetailsUrl();

    return this.apiService
      .post(url, payload)
      .pipe(
        map((data: any) => PrinterConfigAdaptor.PrinterConfigResponse(data))
      );
  }

  deletePrinter(
    payload: PrinterConfigDetails
  ): Observable<PrinterConfigDetails> {
    const url = getAddPrinterDetailsUrl();

    return this.apiService
      .patch(url, payload)
      .pipe(
        map((data: any) => PrinterConfigAdaptor.PrinterConfigResponse(data))
      );
  }
}
