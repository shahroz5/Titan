import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CheckboxGridCellComponent,
  DeleteAllGcRowsComponent,
  DeleteGcRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  GiftCardsGridEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-tep-items-listing-grid',
  templateUrl: './tep-items-listing-grid.component.html',
  styleUrls: ['./tep-items-listing-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepItemsListingGridComponent
  implements OnChanges, OnInit, OnDestroy {
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

  @Input() tepItemList = [];
  @Input() isEditMode = false;
  @Input() deleteId = '';
  @Input() disabled = false;

  @Output() deleteTepItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() calculatedValueEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() isViewItemValuation: EventEmitter<any> = new EventEmitter<any>();
  @Output() isSaleableModified: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadImageUrl: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private currencySymbolService: CurrencySymbolService,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private currencyFormatterService: CurrencyFormatterService,
    private weightFormatterService: WeightFormatterService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    const variantCodeLabel = 'pw.tep.variantCode';
    const lotNumberLabel = 'pw.tep.lotNumber';
    const cmAvailableLabel = 'pw.tep.cmAvailable';
    const grossWtLabel = 'pw.tep.grossWt';
    const saleableLabel = 'pw.tep.saleable';
    const valuationLabel = 'pw.tep.valuation';
    const discountRecoveredLabel = 'pw.tep.discountRecovered';
    const deductionAmtLabel = 'pw.tep.deductionAmt';
    const exchangeValueLabel = 'pw.tep.exchangeValue';
    const refundDeductionLabel = 'pw.tep.refundDeduction';
    const gms = 'pw.tep.gms';

    this.translate
      .get([
        variantCodeLabel,
        lotNumberLabel,
        cmAvailableLabel,
        grossWtLabel,
        saleableLabel,
        valuationLabel,
        discountRecoveredLabel,
        deductionAmtLabel,
        exchangeValueLabel,
        refundDeductionLabel,
        gms
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            headerName: translatedMessages[variantCodeLabel] + '.',
            field: 'variantCode',
            cellRenderer: params => this.imageViewRenderer(params),
            pinned: GiftCardsGridEnum.LEFT,
            lockPinned: false,
            width: 230
          },
          {
            headerName: translatedMessages[lotNumberLabel],
            field: 'lotNumber',
            lockPinned: false,
            width: 200
          },
          {
            headerName: translatedMessages[cmAvailableLabel],
            field: 'cmAvailable',
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName: `${translatedMessages[grossWtLabel]}(${translatedMessages[gms]})`,
            field: 'grossWt',
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages[saleableLabel],
            field: 'saleable',
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            headerName: translatedMessages[valuationLabel],
            field: 'valuation',
            cellRenderer: params => this.viewAnchorRenderer(params)
          },
          {
            headerName: `${
              translatedMessages[discountRecoveredLabel]
            }(${this.currencySymbolService.get('INR')})`,
            field: 'discountRecovered',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            }
          },
          {
            headerName: `${
              translatedMessages[deductionAmtLabel]
            }(${this.currencySymbolService.get('INR')})`,
            field: 'deductionAmt',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            }
          },
          {
            headerName: `${
              translatedMessages[exchangeValueLabel]
            }(${this.currencySymbolService.get('INR')})`,
            field: 'exchangeValue',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                Math.round(params.value),
                'INR',
                false
              );
            }
          },
          {
            headerName: `${
              translatedMessages[refundDeductionLabel]
            }(${this.currencySymbolService.get('INR')})`,
            field: 'refundDeduction',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            }
          },
          {
            cellRenderer: GiftCardsGridEnum.DELETE_ROW_RENDERER,
            pinned: GiftCardsGridEnum.RIGHT,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            lockPinned: true
          }
        ];
      });
  }

  ngOnChanges() {
    if (this.deleteId && this.rowData.length > 0) {
      const objectToBeRemoved = this.rowData.filter(data => {
        return data.itemId === this.deleteId;
      });
      this.rowData.splice(this.rowData.indexOf(objectToBeRemoved[0]), 1);
      this.rowData = [...this.rowData];
    } else {
      this.rowData = [];
      if (this.tepItemList && this.tepItemList.length > 0) {
        this.tepItemList.forEach((tepItem: any) => {
          this.rowData = [...this.rowData, tepItem];
        });
      } else {
        this.rowData = [...this.rowData];
      }
    }

    this.calculateTotalValue();
    this.cd.markForCheck();
  }

  calculateTotalValue() {
    let totalQty = 0;
    let totalExchangeValue = 0;
    let totalGrossWt = 0;
    let totalTax = 0;
    this.rowData.forEach(data => {
      totalExchangeValue =
        totalExchangeValue + (data.exchangeValue ? data.exchangeValue : 0);
      totalGrossWt = totalGrossWt + (data.grossWt ? data.grossWt : 0);
      totalTax = totalTax + (data.totalTax ? data.totalTax : 0);
    });
    this.tepItemList.forEach(item => {
      if (item && item.quantity) {
        totalQty = totalQty + item.quantity;
      }
    });
    this.calculatedValueEmit.emit({
      totalQty,
      totalExchangeValue,
      totalGrossWt,
      totalTax
    });
  }

  openConfirmDialogForDelete(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.tep.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.onRemoveSelectedRow(data);
        }
      });
  }

  onRemoveSelectedRow(data) {
    if (data) {
      this.deleteTepItem.emit(data);
    }
  }
  viewAnchorRenderer(params) {
    return `<a class="pw-anchor-underline">View</a>`;
  }

  imageViewRenderer(params) {
    return `<a class="pw-anchor-underline">${params.value}</a>`;
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteGcRowComponent,
      deleteAllRowsRenderer: DeleteAllGcRowsComponent
    };
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }
  }

  selectionChange(changeEvent, rowKey, fieldName) {
    if (fieldName === 'saleable') {
      const rowItemList = this.rowData.filter(item => {
        return item.rowKey === rowKey;
      });
      if (rowItemList.length > 0 && rowItemList[0]) {
        this.isSaleableModified.emit({
          ...rowItemList[0],
          saleable: changeEvent
        });
      }
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }

    if (this.disabled) {
      this.columnApi.setColumnVisible(
        this.columnApi.getAllColumns()[10],
        false
      );
    }

    this.api.sizeColumnsToFit();
  }

  getContext(): any {
    return {
      formGroup: this.parentForm.controls,
      componentParent: this
    };
  }

  onCellClicked(event) {
    if (event.column.getColId() === 'valuation') {
      if (event && event.data && event.data.variantCode) {
        const eventObj = this.tepItemList.filter((tepItem: any) => {
          return tepItem.itemId === event.data.itemId;
        });
        this.isViewItemValuation.emit(eventObj[0]);
      }
    } else if (event.column.getColId() === 'variantCode') {
      if (event && event.data && event.data.variantCode) {
        this.loadImageUrl.emit(event.data.variantCode);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
