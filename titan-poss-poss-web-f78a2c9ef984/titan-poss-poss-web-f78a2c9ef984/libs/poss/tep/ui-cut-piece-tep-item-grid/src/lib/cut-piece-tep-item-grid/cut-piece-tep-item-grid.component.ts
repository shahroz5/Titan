import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import {
  takeUntil
} from 'rxjs/operators';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  GiftCardsGridEnum
} from '@poss-web/shared/models';
import {
  InputValidatorComponent,
  DeleteGcRowComponent,
  DeleteAllGcRowsComponent,
  EditItemComponent,
  ActualWeightPopupComponent,
  CheckboxGridCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencySymbolService,
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';

@Component({
  selector: 'poss-web-cut-piece-tep-item-grid',
  templateUrl: './cut-piece-tep-item-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CutPieceTepItemGridComponent
  implements OnChanges, OnInit, OnDestroy {
  api: GridApi;
  columnApi: ColumnApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  rowSelection = GiftCardsGridEnum.SINGLE;
  _resize$: Observable<any>;
  domLayout = GiftCardsGridEnum.AUTO_HEIGHT;
  animateRows = true;
  rowHeight = 40;
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
  @Input() metalRate;

  @Output() deleteTepItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() calculatedValueEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() cutPieceDetails: EventEmitter<{
    grossWt: number;
    cutPieceWt: number;
    cutPieceValue: number;
    cutPieceLotNo: string;
    cutPieceCode: string;
    itemId: string;
  }> = new EventEmitter<{
    grossWt: number;
    cutPieceWt: number;
    cutPieceValue: number;
    cutPieceLotNo: string;
    cutPieceCode: string;
    itemId: string;
  }>();
  @Output() isViewItemValuation: EventEmitter<string> = new EventEmitter<
    string
  >();
  @Output() isSaleableModified: EventEmitter<any> = new EventEmitter<any>();

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
    const lotNoLabel = 'pw.tep.lotNoLabel';
    const grossWtLabel = 'pw.tep.grossWtLabel';
    const goldWtLabel = 'pw.tep.goldWtLabel';
    const cutPieceCodeLabel = 'pw.tep.cutPieceCodeLabel';
    const cutPieceLotNoLabel = 'pw.tep.cutPieceLotNoLabel';
    const cutPieceWtLabel = 'pw.tep.cutPieceWtLabel';
    const netWtLabel = 'pw.tep.netWtLabel';
    const cutPieceValueLabel = 'pw.tep.cutPieceValueLabel';
    const gms = 'pw.tep.gms';
    const isHallmarkedLabel = 'pw.tep.isHallmarkedLabel';

    this.translate
      .get([
        variantCodeLabel,
        lotNoLabel,
        grossWtLabel,
        goldWtLabel,
        cutPieceCodeLabel,
        cutPieceLotNoLabel,
        cutPieceWtLabel,
        netWtLabel,
        cutPieceValueLabel,
        gms
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.columnDefs = [
          {
            headerName: translatedMessages[variantCodeLabel] + '.',
            field: 'variantCode'
          },
          {
            headerName: translatedMessages[lotNoLabel],
            field: 'lotNo'
          },
          {
            headerName: `${translatedMessages[grossWtLabel]}(${translatedMessages[gms]})`,
            field: 'grossWt',
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            }
          },
          {
            headerName: `${translatedMessages[goldWtLabel]}(${translatedMessages[gms]})`,
            field: 'goldWt',
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            }
          },
          {
            headerName: translatedMessages[cutPieceCodeLabel],
            field: 'cutPieceCode'
          },
          {
            headerName: translatedMessages[cutPieceLotNoLabel],
            field: 'cutPieceLotNo'
          },
          {
            headerName: `${translatedMessages[cutPieceWtLabel]}(${translatedMessages[gms]})`,
            field: 'cutPieceWt',
            cellEditor: 'inputValidator',

            editable: this.isEditMode === true ? true : false,
            valueFormatter: params => {
              if (params && params.value && params.value.value) {
                this.updateCutPieceValue(params.value.value);
              }
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return this.weightFormatterService.format(params.value.value);
                } else {
                  return '';
                }
              } else {
                return this.weightFormatterService.format(params.value);
              }
            },
            cellRendererSelector: () => EditItemComponent,
            cellClass: () =>
            this.isEditMode === true ? 'pw-fourth-color' : '',
            singleClickEdit: true
          },
          {
            headerName: `${translatedMessages[netWtLabel]}(${translatedMessages[gms]})`,
            field: 'netWt',
            valueFormatter: params => {
              return this.weightFormatterService.format(params.value);
            }
          },
          {
            headerName: `${
              translatedMessages[cutPieceValueLabel]
            }(${this.currencySymbolService.get('INR')})`,
            field: 'cutPieceValue',
            valueFormatter: params => {
              return this.currencyFormatterService.format(
                params.value,
                'INR',
                false
              );
            }
          },
          {
            headerName: translatedMessages[isHallmarkedLabel],
            field: 'isHallmarking',
            cellRendererFramework: CheckboxGridCellComponent
          },
          {
            cellRenderer: GiftCardsGridEnum.DELETE_ROW_RENDERER,
            field: 'delete',
            headerName: '',
            pinned: GiftCardsGridEnum.RIGHT,
            minWidth: 30,
            maxWidth: 30,
            width: 30,
            lockPinned: true

            // headerComponent: 'deleteAllRowsRenderer'
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges) {

    if(changes['isEditMode']) {
      this.setDeleteAction();
    }
    if (this.deleteId && this.rowData.length > 0) {
      const objectToBeRemoved = this.rowData.filter(data => {
        return data.itemId === this.deleteId;
      });
      this.rowData.splice(this.rowData.indexOf(objectToBeRemoved[0]), 1);
      this.rowData = [...this.rowData];
      this.deleteId=''

    } else {
      this.rowData = [];
      if (this.tepItemList && this.tepItemList.length > 0) {
        this.tepItemList.forEach((tepItem: any) => {
          const modifiedTepItem = {
            ...tepItem,
            netWt: tepItem['grossWt'] - tepItem['cutPieceWt'],
          //  cutPieceValue: tepItem['cutPieceWt'] * this.metalRate
          };
          this.rowData = [...this.rowData, modifiedTepItem];
        });
      }
    }
    this.calculateTotalValue();
    this.cd.markForCheck();
  }

  setDeleteAction() {
    if (this.api && this.columnApi) {
      if (this.isEditMode) {
        this.columnApi.setColumnVisible('delete', true)
      } else {
        this.columnApi.setColumnVisible('delete', false)
      }
      this.onGridSizeChanged();
      this.api.redrawRows();
    }
  }

  updateCutPieceValue(value: number) {
    if (value) {
      const rowDataObject = {
        ...this.tepItemList[0],
        cutPieceWt: this.weightFormatterService.format(value),
        netWt: this.tepItemList[0].grossWt - value,
        cutPieceValue: value * this.metalRate
      };
      this.rowData = [];
      this.rowData = [...this.rowData, rowDataObject];

      this.cd.markForCheck();

      this.cutPieceDetails.emit({
        grossWt: this.rowData[0].netWt,
        cutPieceValue: this.rowData[0].cutPieceValue,
        cutPieceWt: this.rowData[0].cutPieceWt,
        cutPieceCode: this.rowData[0].cutPieceCode,
        cutPieceLotNo: this.rowData[0].cutPieceLotNo,
        itemId: this.rowData[0].itemId
      });
    }
    this.calculateTotalValue();

  }

  getUpdatedRowData() {
    const rowData = [];
    this.api.forEachNode(node => {
      const nodeObject = {
        ...node.data,
        cutPieceWt: node.data.cutPieceWt.value
      };
      rowData.push(nodeObject);
    });
  }

  editItemRenderer(isEditable: boolean) {
    if (isEditable) {
      return { component: 'editItemRenderer' };
    } else {
      return null;
    }
  }

  calculateTotalValue() {
    let totalQty = 0;
    let totalValue = 0;
    let totalWeight = 0;
    this.rowData.forEach(data => {
      totalValue = totalValue + (data.cutPieceValue ? data.cutPieceValue : 0);
      totalWeight = data.cutPieceWt;
    });
    totalQty = this.tepItemList.length;

    this.calculatedValueEmit.emit({
      totalQty,
      totalValue,
      totalWeight
    });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteGcRowComponent,
      deleteAllRowsRenderer: DeleteAllGcRowsComponent,
      actualWeightEditor: ActualWeightPopupComponent,
      inputValidator: InputValidatorComponent
    };
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    if (this.rowData.length === 0) {
      this.api.showNoRowsOverlay();
    }
    this.api.sizeColumnsToFit();
    this.setDeleteAction();
  }

  getContext() {
    return {
      formGroup: this.parentForm.controls,
      gridApi: this.api,
      componentParent: this,
      validators: {
        cutPieceWt: [this.fieldValidatorsService.weightField('Cut Piece Wt')]
      }
    };
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
