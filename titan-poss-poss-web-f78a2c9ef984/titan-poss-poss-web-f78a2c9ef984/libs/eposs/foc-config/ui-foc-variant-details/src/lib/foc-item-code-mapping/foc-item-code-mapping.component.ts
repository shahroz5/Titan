import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { WeightFormatterService } from '@poss-web/shared/components/ui-formatters';
import {
  FOCItemCodes,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  SchemeDetails
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-foc-item-code-mapping',
  templateUrl: './foc-item-code-mapping.component.html'
})
export class FocItemCodeMappingComponent
  implements OnChanges, OnDestroy {
  @Input() focMappedItems: FOCItemCodes[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() schemeDetails: SchemeDetails;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() deleteItemCode = new EventEmitter<string>();
  api: GridApi;
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowData: FOCItemCodes[];
  columnDefs = [];
  destroy$ = new Subject<null>();
  rowSelection = 'multiple';
  focItemCodeMappingComponent: FocItemCodeMappingComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['focMappedItems']) {
      this.rowData = [];
      this.focMappedItems.forEach(focItemCodes => {
        this.rowData.push({
          itemCode: focItemCodes.itemCode,
          stdWeight: focItemCodes.stdWeight,
          karat: focItemCodes.karat,
          id: focItemCodes.id
        });
      });
    }
  }

  constructor(
    private translate: TranslateService,
    private weightFormatterService: WeightFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.focConfiguration.focItemCodeLabel',
        'pw.focConfiguration.standardWeightLabel',
        'pw.focConfiguration.karatageLabel',
        'pw.focConfiguration.removeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName:
              translatedMessages['pw.focConfiguration.focItemCodeLabel'],
            field: 'itemCode',
            width: 300,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages['pw.focConfiguration.standardWeightLabel'],
            field: 'stdWeight',
            width: 290,
            resizable: true,
            suppressMovable: true,
            valueFormatter: params => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return this.weightFormatterService.format(params.value.value);
                } else {
                  return '';
                }
              } else {
                return this.weightFormatterService.format(params.value);
              }
            }
          },
          {
            headerName: translatedMessages['pw.focConfiguration.karatageLabel'],
            field: 'karat',
            width: 290,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName: '',
            field: 'id',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            suppressMovable: true
          }
        ];
      });
  }
  getContext() {
    return {
      componentParent: this.focItemCodeMappingComponent
    };
  }
  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  openConfirmDialogForDelete(row) {
    if (
      this.schemeDetails?.description !== '' &&
      !this.schemeDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.clubbingDiscounts.deleteRuleMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.deleteItemCode.emit(row.id);
          }
        });
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
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
    if (this.currentRowField === 'stdWeight')
      this.currentRowInfo = this.weightFormatterService.format(this.currentRowInfo);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
}
