import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { DiscountRequestListPayload } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-ui-discount-config-request-list',
  templateUrl: './discount-config-request-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountConfigRequestListComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() requestList: DiscountRequestListPayload[] = [];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Output() discountSelect = new EventEmitter<string>();
  @Output() paginator = new EventEmitter<PageEvent>();
  destroy$: Subject<null> = new Subject<null>();
  rowData: DiscountRequestListPayload[] = [];
  defaultColDef = {
    flex: 1,
    suppressMovable: true,

    resizable: true
  };
  domLayout = 'autoHeight';
  rowHeight = '35';
  minPageSize: number;
  columnDefs = [];
  api: GridApi;
  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService
  ) {
    const discountCodeHeadername = 'pw.discountConfig.discountCodeLabel';
    const discountOcassionHeadername = 'pw.discountConfig.occasionLabel';
    const discountRequestorHeeaderName = 'pw.discountConfig.requestor';
    const discountRequestSentByheaderName = 'pw.discountConfig.setByLabel';
    const discountRequestedDateHeaderName = 'pw.discountConfig.requestDate';
    const discountTypeHeaderName = 'pw.discountConfig.discountTypeListLabel';
    const discountRemarksHeaderName = 'pw.discountConfig.creationRemarks';

    this.translate
      .get([
        discountCodeHeadername,
        discountOcassionHeadername,
        discountRequestSentByheaderName,
        discountRequestorHeeaderName,
        discountRequestedDateHeaderName,
        discountTypeHeaderName,
        discountRemarksHeaderName
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            field: 'discountCode',
            headerName: translatedMessages[discountCodeHeadername],
            cellRenderer: headerName =>
              `<a class="pw-anchor-underline">${headerName.value}</a>`
          },
          {
            field: 'occasion',
            headerName: translatedMessages[discountOcassionHeadername]
          },
          // {
          //   field: 'requestedBy',
          //   headerName: translatedMessages[discountRequestSentByheaderName]
          // },
          {
            field: 'requestedBy',
            headerName: translatedMessages[discountRequestorHeeaderName]
          },
          {
            field: 'requestedDate',
            headerName: translatedMessages[discountRequestedDateHeaderName],
            valueFormatter: params => {
              return this.dateFormatterService.format(moment(params.value));
            }
          },
          {
            field: 'discountType',
            headerName: translatedMessages[discountTypeHeaderName]
          },
          {
            field: 'typeOfRequest',
            headerName: translatedMessages[discountRemarksHeaderName]
          }
        ];
      });
  }
  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['requestList']) {
      this.rowData = this.requestList;
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onCellClicked(event) {
    if (event.column.getColId() === 'discountCode') {
      if (event && event.data && event.data.discountId) {
        this.discountSelect.emit(event.data.discountId);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
