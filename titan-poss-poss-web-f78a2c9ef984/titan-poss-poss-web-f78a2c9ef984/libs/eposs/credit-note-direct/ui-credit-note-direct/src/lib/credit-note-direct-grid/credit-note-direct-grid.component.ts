import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  CurrencyFormatterService,
  DateFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  CreditNoteSearchResult,
  SaveCnActionPayload,
  CNDirectSearchEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RadioButtonCellComponent } from '@poss-web/shared/components/ui-ag-grid';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-credit-note-direct-grid',
  templateUrl: './credit-note-direct-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreditNoteDirectGridComponent implements OnDestroy, OnChanges {
  @Input() searchResult: CreditNoteSearchResult[];
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() count: number;

  @Output() emitPaginator = new EventEmitter<PageEvent>();
  @Output() save = new EventEmitter<SaveCnActionPayload>();
  destroy$ = new Subject<null>();
  columnDefs = [];
  cnIds = [];
  suspendedCns: boolean;
  openCns: boolean;
  constructor(
    private dateFormatterService: DateFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.creditNote.cnNoLabel',
        'pw.creditNote.fiscalYearLabel',
        'pw.creditNote.customerNameLabel',
        'pw.creditNote.locationCodeLabel',
        'pw.creditNote.cnTypeLabel',
        'pw.creditNote.cnDateLabel',
        'pw.creditNote.amountLabel',
        'pw.creditNote.cnStatusLabel',
        'pw.creditNote.linkedWithLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          // {
          //   headerName: '',
          //   field: '',
          //   cellRenderer: 'radioButtonRowRender',
          //   width: 50,
          //   suppressSizeToFit: true,
          //   resizable: false
          // },
          {
            headerName: '',
            tooltipShowDelay: '300ms',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 80
          },
          {
            headerName: translatedMessages['pw.creditNote.cnNoLabel'],
            field: 'cnNo',
            headerTooltip: 'CN Number',
            tooltipShowDelay: '300ms',
            resizable: false,
            width: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.fiscalYearLabel'],
            field: 'fiscalYear',
            headerTooltip: 'Fiscal Year',
            tooltipShowDelay: '300ms',
            resizable: false,
            width: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.customerNameLabel'],
            field: 'customerName',
            headerTooltip: 'Customer Name',
            tooltipShowDelay: '300ms',
            tooltipField: 'customerName',
            resizable: false,
            flex: 1,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.locationCodeLabel'],
            field: 'locationCode',
            width: 80,
            headerTooltip: 'Location Code',
            tooltipShowDelay: '300ms',
            tooltipField: 'locationCode',
            resizable: false,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.cnTypeLabel'],
            field: 'cnType',
            flex: 1,
            tooltipField: 'cnType',
            resizable: false,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.cnDateLabel'],
            field: 'cnDate',
            resizable: false,
            flex: 1,
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.dateFormatterService.format(moment(params.value));
            }
          },
          {
            headerName: translatedMessages['pw.creditNote.amountLabel'],
            field: 'amount',
            flex: 1,
            resizable: false,
            tooltipField: 'amount',
            suppressSizeToFit: true,
            valueFormatter: params => {
              return this.currencyFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages['pw.creditNote.cnStatusLabel'],
            field: 'cnStatus',
            flex: 1,
            resizable: false,
            tooltipField: 'cnStatus',
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.creditNote.linkedWithLabel'],
            field: 'linkedWith',
            resizable: false,
            tooltipField: 'linkedWith',
            flex: 1,
            suppressSizeToFit: true
          }
        ];
      });
  }
  api: GridApi;
  component: any = this;
  domLayout = 'autoHeight';
  animateRows = true;
  rowData = [];
  rowHeight = 50;
  id: string;
  cnDirectSearchEnum = CNDirectSearchEnum;
  disbaleActiveCN = true;
  disableTransferCn = true;
  disbaleActiveTransferedCN = true;
  defaultColDef = {
    suppressMovable: true
  };
  disableRemoveGoldRatecN = true;
  disbaleSuspendCN = true;
  CNSearchFormGroup: FormGroup;
  disableButton = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult']) {
      this.disbaleSuspendCN = true;
      this.disableRemoveGoldRatecN = true;
      this.disbaleActiveCN = true;
      this.disableTransferCn = true;
      this.disbaleActiveTransferedCN = true;
    }
  }
  getComponents() {
    return {
      radioButtonRowRender: RadioButtonCellComponent
    };
  }
  cnDetailsType(type: string) {
    this.save.emit({ operation: type, cnIds: this.cnIds });
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  onSelectionChanged(data) {
    this.disbaleActiveCN = true;
    this.disableRemoveGoldRatecN = true;
    this.disbaleSuspendCN = true;
    this.disableTransferCn = true;
    this.disbaleActiveTransferedCN = true;
    this.suspendedCns = false;
    this.openCns = false;
    const rowNodes = this.api.getSelectedNodes();
    rowNodes.forEach(rowNode => {
      if (rowNode.data.cnStatus === this.cnDirectSearchEnum.SUSPENDED) {
        this.suspendedCns = true;
      }
      if (rowNode.data.cnStatus === this.cnDirectSearchEnum.OPEN) {
        this.openCns = true;
      }
    });
    if (this.suspendedCns) {
      this.disbaleActiveTransferedCN = false;
      this.disbaleActiveCN = false;
      this.disableRemoveGoldRatecN = true;
      this.disbaleSuspendCN = true;
    }
    if (this.openCns) {
      this.disableRemoveGoldRatecN = false;
      this.disbaleSuspendCN = false;
      this.disbaleActiveTransferedCN = true;
      this.disbaleActiveCN = true;
    }
    if (this.suspendedCns && this.openCns) {
      this.disbaleActiveCN = true;
      this.disableRemoveGoldRatecN = true;
      this.disbaleSuspendCN = true;
      this.disableTransferCn = true;
      this.disbaleActiveTransferedCN = true;
      this.showNotification('Open and Suspended cannot be selected together');
    }
    this.cnIds = this.api.getSelectedNodes().map(rowNode => rowNode.data.id);
    console.log(this.cnIds);
  }
  showNotification(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  emitPagination($event) {
    this.emitPaginator.emit($event);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
