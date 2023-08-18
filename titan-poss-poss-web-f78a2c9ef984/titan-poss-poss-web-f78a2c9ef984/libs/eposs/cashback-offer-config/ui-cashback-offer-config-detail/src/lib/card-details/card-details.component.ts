import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import {
  BankDetailsPayload,
  CardDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';

import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() cardDetails: CardDetails[];
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() count: number;
  @Input() bankDetails: BankDetailsPayload;

  @Output() updateStatusEvent = new EventEmitter<any>();
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() uploadFile = new EventEmitter<any>();
  @Output() downloadFileFormat = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput;
  domLayout = 'autoHeight';
  gridApi: GridApi;
  columnDefs = [];
  rowHeight = 35;
  destroy$ = new Subject<null>();
  cardStatus = [];
  rowSelection = 'multiple';
  activeText: string;
  inActiveText: string;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}
  context = this;
  ngOnInit() {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.translate
      .get([
        'pw.cashbackConfig.cardNumber',
        'pw.cashbackConfig.status',
        'pw.cashbackConfig.active',
        'pw.cashbackConfig.inActive'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.activeText = translatedMessages['pw.cashbackConfig.active'];
        this.inActiveText = translatedMessages['pw.cashbackConfig.inActive'];
        this.columnDefs = [
          {
            minWidth: 5,
            width: 5,
            pinned: 'left',
            lockPinned: true,
            cellStyle: params => {
              if (params.data.newlyAdded) {
                return { backgroundColor: '#1eb496', padding: '0px' };
              }
            }
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.cardNumber'],
            field: 'cardNo',
            width: 890.5,
            resizable: true,
            editable: false
          },
          {
            headerName: translatedMessages['pw.cashbackConfig.status'],
            field: 'isActive',
            cellRenderer: params => {
              if (params.value) {
                return this.activeText;
              } else {
                return this.inActiveText;
              }
            },

            resizable: true,
            suppressSizeToFit: true,
            editable: true
          }
        ];
      });
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.createRowData();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardDetails']) {
      this.createRowData();
    }
  }
  downloadFile() {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.downloadFileFormat.emit(true);
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }
  createRowData() {
    const cardDetails: CardDetails[] = [];
    for (const i of this.cardDetails) {
      cardDetails.push({
        id: i.id,
        isActive: i.isActive,
        cardNo: i.cardNo,
        newlyAdded: i.newlyAdded
      });
    }
    if (this.gridApi) {
      this.gridApi.setRowData(cardDetails);
    }
  }

  uploadCardDetails(event) {
    if (this.bankDetails?.cashbackName !== '' && !this.bankDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.uploadFile.emit(event);
      this.fileInput.nativeElement.value = '';
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    const node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
