import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  getStockTransferNoteCountEndpointUrl,
  getReceiveInvoiceEndpointUrl,
  getIssueSTNCountEndpointUrl
} from '@poss-web/shared/util-api-service';
import { ApiService } from '@poss-web/shared/util-api-service';
import { InventoryHomeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  LoadSTNCountPayload,
  LoadReceiveInvoicePayload,
  LoadIssueSTNCountsPayload
} from './+state/inventory-home.actions';

@Injectable()
export class InventoryHomeService {
  constructor(private apiService: ApiService) {}
  getSTNCount(): Observable<LoadSTNCountPayload> {
    const STNCountUrl = getStockTransferNoteCountEndpointUrl();
    return this.apiService
      .get(STNCountUrl)
      .pipe(map((data: any) => InventoryHomeAdaptor.STNCountFromJson(data)));
  }

  getReceiveInvoice(): Observable<LoadReceiveInvoicePayload> {
    const receiveInvoiceUrl = getReceiveInvoiceEndpointUrl();
    return this.apiService
      .get(receiveInvoiceUrl)
      .pipe(
        map((data: any) => InventoryHomeAdaptor.ReceiveInvoiceFromJson(data))
      );
  }

  getIssueCount(): Observable<LoadIssueSTNCountsPayload> {
    const IssueSTNCountUrl = getIssueSTNCountEndpointUrl();
    return this.apiService
      .get(IssueSTNCountUrl.path, IssueSTNCountUrl.params)
      .pipe(
        map((data: any) => InventoryHomeAdaptor.IssueSTNCountFromJson(data))
      );
  }
}
