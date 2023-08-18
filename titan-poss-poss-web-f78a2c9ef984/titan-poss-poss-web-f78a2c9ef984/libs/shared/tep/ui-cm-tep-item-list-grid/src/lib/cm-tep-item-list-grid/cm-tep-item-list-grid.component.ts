import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import {
  CurrencySymbolService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  GiftCardsGridEnum,
  TepCashMemoResponseItem
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cm-tep-item-list-grid',
  templateUrl: './cm-tep-item-list-grid.component.html',
  styleUrls: ['./cm-tep-item-list-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmTepItemListGridComponent
  implements OnInit, OnChanges, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  rowSelection = GiftCardsGridEnum.SINGLE;
  _resize$: Observable<any>;
  domLayout = GiftCardsGridEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 35;
  currentColumnName = null;
  currentRowIndex: number;
  totalAmount: number;
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true,
    resizable: true
  };
  columnDefs = [];
  rowData = [];
  destroy$: Subject<null> = new Subject<null>();

  @Input() cmItemsList = [];
  @Output() selectedItemCodeObject: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private currencySymbolService: CurrencySymbolService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const variantCodeLabel = 'pw.tep.variantCodeLabel';
    const lotNumberLabel = 'pw.tep.lotNumberLabel';
    const cmActualQtyLabel = 'pw.tep.cmActualQtyLabel';
    const pendingQtyForTepLabel = 'pw.tep.pendingQtyForTepLabel';
    const cmActualWeightLabel = 'pw.tep.cmActualWeightLabel';
    const discountLabel = 'pw.tep.discountLabel';
    const finalPriceLabel = 'pw.tep.finalPriceLabel';

    this.translate
      .get([
        variantCodeLabel,
        lotNumberLabel,
        cmActualQtyLabel,
        pendingQtyForTepLabel,
        cmActualWeightLabel,
        discountLabel,
        finalPriceLabel
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            checkboxSelection: true,
            cellStyle: params =>
            !params?.data?.isCmAllowed ?
                {'pointer-events': 'none'}
                : '',
            minWidth: 30,
            width: 30,
            pinned: GiftCardsGridEnum.LEFT,
            lockPinned: true
          },
          {
            headerName: translatedMessages[variantCodeLabel] + '.',
            field: 'variantCode'
          },
          {
            headerName: translatedMessages[lotNumberLabel],
            field: 'lotNumber'
          },
          {
            headerName: translatedMessages[cmActualQtyLabel],
            field: 'cmActualQty'
          },
          {
            headerName: translatedMessages[pendingQtyForTepLabel],
            field: 'pendingQtyForTep',
            cellClassRules: {
              'pw-error-color': params => {
                return params &&
                  params.data &&
                  params.data.pendingQtyForTep === 0
                  ? true
                  : false;
              }
            }
          },
          {
            headerName: translatedMessages[cmActualWeightLabel],
            field: 'cmActualWeight'
          },
          {
            headerName: `${
              translatedMessages[discountLabel]
            } (${this.currencySymbolService.get('INR')})`,
            field: 'discount'
          },
          {
            headerName: `${
              translatedMessages[finalPriceLabel]
            } (${this.currencySymbolService.get('INR')})`,
            field: 'finalPrice'
          }
        ];
      });
  }

  ngOnChanges() {
    this.rowData = [];
    if (this.cmItemsList && this.cmItemsList.length > 0) {
      this.cmItemsList.forEach((tepItem: TepCashMemoResponseItem) => {
        this.rowData = [
          ...this.rowData,
          {
            variantCode: tepItem.itemCode,
            lotNumber: tepItem.lotNumber,
            cmActualQty: tepItem.totalQuantity,
            pendingQtyForTep: tepItem.totalPendingQuantity,
            cmActualWeight: tepItem.totalWeight,
            discount: tepItem.discountRecovered,
            finalPrice: tepItem.totalValue,
            productGroupCode: tepItem.productGroupCode,
            isCmAllowed: tepItem.isCmAllowed
          }
        ];
      });
      this.cd.markForCheck();
    }
  }

  getComponents() {
    return {};
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  selectionChange(id, rowKey, fieldName) {
    console.log(id, rowKey, fieldName, 'chevk selection change');
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    this.api.sizeColumnsToFit();
  }

  getContext(): any {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this
    };
  }

  onSelectionChanged(event: any) {
    const selectedData = this.api.getSelectedRows();
    const selectedRowData = selectedData.filter(x => x.isCmAllowed);
    if (selectedRowData && selectedRowData.length > 0) {
      const selectedItemFromItemList = this.cmItemsList.filter(
        (cmItem: TepCashMemoResponseItem) => {
          if (
            cmItem.itemCode === selectedRowData[0].variantCode &&
            cmItem.lotNumber === selectedRowData[0].lotNumber
          ) {
            return cmItem;
          }
        }
      );

      this.selectedItemCodeObject.emit(selectedItemFromItemList[0]);
    } else {
      this.selectedItemCodeObject.emit(null);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
