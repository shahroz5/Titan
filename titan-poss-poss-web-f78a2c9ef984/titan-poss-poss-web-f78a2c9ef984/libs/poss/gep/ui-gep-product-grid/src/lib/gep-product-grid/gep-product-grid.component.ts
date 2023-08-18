import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import {
  GEPProductDetails,
  ShortcutServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  MetalTypeEnum
} from '@poss-web/shared/models';
import {
  DeleteRowComponent,
  InputValidatorComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { MatDialog } from '@angular/material/dialog';
import {
  WeightFormatterService,
  CurrencyFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { TranslateService } from '@ngx-translate/core';
import { TotalValuePopupComponent } from '../total-value-popup/total-value-popup.component';
import { PreMeltingDetailsComponent } from '../pre-melting-details/pre-melting-details.component';
import { PreMeltingPopupComponent } from '../pre-melting-popup/pre-melting-popup.component';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
const focusShortcutKey = 'ProductAgGridComponent.FOCUS';
const inputValueLabel = 'Input Value';

interface ColumnDef {
  headerCheckboxSelection?: boolean;
  checkboxSelection?: boolean;
  field?: string;
  headerName?: string;
  cellClassRules?: any;
  cellRendererFramework?: any;
  cellRendererSelector?: any;
  cellEditorFramework?: any;
  resizable?: boolean;
  pinned?: string;
  suppressMovable: boolean;
  minWidth?: number;
  maxWidth?: number;
  singleClickEdit?: boolean;
  suppressSizeToFit?: boolean;
  type?: any;
  cellClass?: any;
  valueGetter?: Function;
  valueFormatter?: Function;
  celId?: string;
  editable?: any;
  width?: number;
  lockPinned?: boolean;
  valueSetter?: Function;
  cellEditorSelector?: any;
  cellRenderer?: any;
  filter?: any;
  filterParams?: any;
  enableCellChangeFlash?: boolean;
  sortable?: boolean;
  isWeight?: boolean;
}

@Component({
  selector: 'poss-web-gep-product-grid',
  templateUrl: './gep-product-grid.component.html',
  styleUrls: []
})
export class GepProductGridComponent implements OnInit, OnChanges {
  @Input() gepDetails;
  @Input() productGrid: GEPProductDetails[];
  @Input() karatage;
  @Input() preDeclaration;

  @Input() metalDetail;
  @Input() itemDetail;

  @Output() deleteEmit = new EventEmitter<any>();
  @Output() oldValueEmit = new EventEmitter<any>();

  @Output() metalTypes = new EventEmitter<any>();

  @Output() patchGridItems = new EventEmitter<any>();

  preMeltingDetails: any;
  objCategoryMappings = {};
  colDef: ColumnDef[] = [];
  // context = this;
  defaultColDef = {
    resizable: true
  };
  domLayout = 'autoHeight';
  api: GridApi;
  columnApi: ColumnApi;

  destroy$: Subject<null> = new Subject<null>();

  @Input() weightPurity: string;
  metalType: string[];
  objMappings = {};

  constructor(
    private shortcutService: ShortcutServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.colDef = [
      {
        field: 'metalType',
        headerName: 'Metal Type',
        cellClass: 'pw-fourth-color',
        suppressMovable: true,
        singleClickEdit: true,
        cellRendererSelector: params => {
          return {
            component: 'editItemComponent'
          };
        },

        editable: true,
        cellEditorSelector: params => {
          this.objMappings = {};
          this.metalDetail.forEach(element => {
            if(element.itemTypeCode === MetalTypeEnum.GOLD ||
              element.itemTypeCode === MetalTypeEnum.PLATINUM ||
              element.itemTypeCode === MetalTypeEnum.SILVER
            ) {
              this.objMappings[
                `${element.itemTypeCode}`
              ] = `${element.description}`;
            }
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objMappings)
            }
          };
        },
        valueFormatter: params => {
          console.log('params:', params);
          if (params.value === MetalTypeEnum.GOLD)
            this.metalDetail.forEach(element => {
              this.objMappings[
                `${element.itemTypeCode}`
              ] = `${element.description}`;
            });
          this.objMappings[
            `${this.metalDetail.itemTypeCode}`
          ] = `${this.metalDetail.description}`;

          return this.lookupValue(this.objMappings, params.value);
        },
        valueSetter: params => {
          console.log('params:', params);
          this.metalTypes.emit({
            item: params.data.itemType,
            metal: params.newValue,
            preMelt: params.data.preMeltingDetails,
            id: params.data.id,
            metalType: this.metalType,
            weight: params.data.weight,
            purity: params.data.purity,
            isSave: params.data.isSave
          });
          return false;
        }
      },
      {
        field: 'itemType',
        headerName: 'Item Type',
        suppressMovable: true,
        cellClass: 'pw-fourth-color',
        singleClickEdit: true,
        cellRendererSelector: params => {
          return {
            component: 'editItemComponent'
          };
        },

        editable: true,

        cellEditorSelector: params => {
          this.objCategoryMappings = {};
          this.itemDetail.forEach(element => {
            this.objCategoryMappings[`${element.code}`] = `${element.value}`;
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objCategoryMappings)
            }
          };
        },
        valueFormatter: params => {
          console.log('params:', params);

          if (params.value === 'Jewellery' || params.value === 'JEWELLERY') {
            console.log(this.itemDetail);
            this.itemDetail.forEach(element => {
              this.objCategoryMappings[
                `${this.itemDetail.code}`
              ] = `${this.itemDetail.value}`;
            });
          }
          this.objCategoryMappings[
            `${this.itemDetail.code}`
          ] = `${this.itemDetail.value}`;

          return this.lookupValue(this.objCategoryMappings, params.value);
        },
        valueSetter: params => {
          console.log('params:', params);
          this.metalTypes.emit({
            item: params.newValue,
            metal: params.data.metalType,
            preMelt: params.data.preMeltingDetails,
            id: params.data.id,
            metalType: this.metalType,
            weight: params.data.weight,
            purity: params.data.purity,
            isSave: params.data.isSave
          });
          return false;
        }
      },

      {
        field: 'weight',
        headerName: 'Wt(gms)',
        isWeight: true,
        cellClass: 'pw-fourth-color',
        editable: params => {
          return params.data.isSave;
        },

        singleClickEdit: true,
        // valueFormatter: params => {
        //   return this.weightFormatterService.format(params.value);
        // },
        valueFormatter: (params: { value: { value: any } }) => {
          if (typeof params.value === 'object') {
            if (params.value.value) {
              return this.weightFormatterService.format(params.value.value);
            } else {
              return ' ';
            }
          } else {
            return this.weightFormatterService.format(params.value);
          }
        },
        valueSetter: params => {
          if (
            params.oldValue !== null &&
            Number(params.newValue) !== Number(params.oldValue)
          ) {
            // this.oldValueEmit.emit({
            //   deductions: params.data.deductions,
            //   id: params.data.id,
            //   isSave: params.data.isSave,
            //   itemDetail: params.data.itemDetail,
            //   itemType: params.data.itemType,
            //   karatage: params.data.karatage,
            //   melted: params.data.melted,
            //   metalDetail: params.data.metalDetail,
            //   metalType: params.data.metalType,
            //   preMeltingDetails: params.data.preMeltingDetails,
            //   purity: params.data.purity,
            //   rate: params.data.rate,
            //   totalBreakUp: params.data.totalBreakUp,
            //   totalValue: params.data.totalValue,
            //   totaltax: params.data.totaltax,
            //   weight: params.oldValue
            // });
            console.log('params:', params, params.data.weight);
            this.patchGridItems.emit({
              measuredWeight: params.newValue,
              measuredPurity: params.data.purity,
              preMeltingDetails: params.data.preMeltingDetails,
              id: params.data.id,
              isSave: params.data.isSave,
              item: params.data.itemType,
              metal: params.data.metalType,
              karat: params.data.karatage,
              unitValue: params.data.netValue
            });
          }
          return false;
        },
        cellRendererSelector: params => {
          if (params.data.isSave) {
            return {
              component: 'editItemComponent'
            };
          } else return null;
        },
        suppressMovable: true
      },
      {
        field: 'purity',
        headerName: 'Purity(%)',
        cellEditorFramework: InputValidatorComponent,
        cellClass: 'pw-fourth-color',
        singleClickEdit: true,
        enableCellChangeFlash: true,
        editable: params => {
          console.log(params, 'purirty');
          return params.data.isSave;
        },
        valueFormatter: params => {
          if (params.value) return Number(params.value).toFixed(2);
          else return null;
        },
        valueSetter: params => {
          if (
            params.oldValue !== null &&
            Number(params.newValue.value) !== Number(params.oldValue)
          ) {
            // this.oldValueEmit.emit({
            //   deductions: params.data.deductions,
            //   id: params.data.id,
            //   isSave: params.data.isSave,
            //   itemDetail: params.data.itemDetail,
            //   itemType: params.data.itemType,
            //   karatage: params.data.karatage,
            //   melted: params.data.melted,
            //   metalDetail: params.data.metalDetail,
            //   metalType: params.data.metalType,
            //   preMeltingDetails: params.data.preMeltingDetails,
            //   purity: params.oldValue,
            //   rate: params.data.rate,
            //   totalBreakUp: params.data.totalBreakUp,
            //   totalValue: params.data.totalValue,
            //   totaltax: params.data.totaltax,
            //   weight: params.data.weight
            // });
            this.patchGridItems.emit({
              measuredWeight: params.data.weight,
              measuredPurity: params.newValue.value,
              preMeltingDetails: params.data.preMeltingDetails,
              id: params.data.id,
              isSave: params.data.isSave,
              item: params.data.itemType,
              metal: params.data.metalType,
              karat: params.data.karatage,
              unitValue: params.data.netValue
            });

            return false;
          }
        },
        cellRendererSelector: params => {
          if (params.data.isSave) {
            return {
              component: 'editItemComponent'
            };
          } else return null;
        },

        cellClassRules: {
          'pw-gray-border': params => {
            console.log(params, 'ccss');
            return params.value >= 0 && params.value <= 100;
          },
          'pw-error-border': params => {
            return !(params.value >= 0 && params.value <= 100);
          }
        },

        suppressMovable: true
      },
      {
        field: 'karatage',
        headerName: 'Karatage',
        valueFormatter: params => {
          if (params.value) return params.value.toFixed(2);
          else return null;
        },
        suppressMovable: true,
        enableCellChangeFlash: true
      },
      {
        field: 'rate',
        headerName: 'Metal Rate',
        valueFormatter: params => {
          console.log(params);
          if (params.value) {
            return this.currencyFormatterService.format(
              params.value,
              'INR',
              false
            );
          } else {
            return null;
          }
        },
        suppressMovable: true
      },
      {
        field: 'melted',
        headerName: 'Pre-Melting Details',

        cellClass: 'pw-justify-content-end pw-fourth-color',
        cellRendererSelector: params => {
          return {
            component: 'editItemComponent'
          };
        },

        suppressMovable: true,

        minWidth: 170,
        maxWidth: 180
      },
      {
        field: 'deductions',

        headerName: 'deductions (₹)',

        valueFormatter: params => {
          console.log(params);
          if (params.value) {
            const value = this.currencyFormatterService.format(
              params.value,
              'INR',
              false
            );
            return (
              value +
              '(' +
              params.data.totalBreakUp.deductionPercentage +
              '%' +
              ')'
            );
          } else {
            return null;
          }
        },
        minWidth: 130,

        enableCellChangeFlash: true,
        suppressMovable: true
      },

      {
        field: 'totalValue',
        cellClass: 'pw-justify-content-end',
        headerName: 'Total Value(₹)',
        type: 'numericColumn',
        suppressMovable: true,
        cellRenderer: headerName => {
          if (headerName.data.totalValue) {
            return `<a class="pw-anchor-underline">${this.currencyFormatterService.format(
              headerName.value,
              'INR',
              false
            )}</a>`;
          } else return null;
        },

        enableCellChangeFlash: true
      },
      {
        cellRendererFramework: DeleteRowComponent,
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        pinned: 'right',
        lockPinned: true,
        suppressMovable: true
      }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['productGrid']) {
      console.log(this.productGrid, 'update');
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    // this.api.redrawRows(this.productGrid);
    params.api.sizeColumnsToFit();
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }

  getComponents() {
    return {
      editItemComponent: EditItemComponent
    };
  }

  openPreDetails(event: any, karatage: any): void {
    console.log(event, 'premeltDetails');

    const dialogRef = this.dialog.open(PreMeltingPopupComponent, {
      width: '450px',
      data: event.preMeltingDetails ? event.preMeltingDetails : karatage,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          console.log(result, 'abcd');
          this.preMeltingDetails = result;
          this.oldValueEmit.emit(event);
          console.log(this.preMeltingDetails, 'abcd');
          if (this.preMeltingDetails !== event.preMeltingDetails) {
            if (event.purity && event.weight) {
              const data = {
                measuredPurity: event.purity,
                measuredWeight: event.weight,
                preMeltingDetails: this.preMeltingDetails,
                id: event.id,
                metal: event.metalType,
                item: event.itemType,
                karat: event.karatage,
                unitValue: event.netValue,
                isPreMelt: true,

                isSave: event.isSave
              };
              this.patchGridItems.emit(data);
            }
          }
        }
      });
  }

  // onCellValueChanged(changeEvent) {
  //   console.log('cell value');
  //   switch (changeEvent.colDef.field) {
  //     case 'weight': {
  //       if (changeEvent.previousValue !== null)
  //         this.patchGridItems.emit({
  //           measuredWeight: changeEvent.value,
  //           measuredPurity: changeEvent.data.purity,
  //           preMeltingDetails: changeEvent.data.preMeltingDetails,
  //           id: changeEvent.data.id,
  //           isSave: changeEvent.data.isSave
  //         });
  //       break;
  //     }
  //     case 'purity': {
  //       console.log('grid');
  //       if (changeEvent.previousValue !== null)
  //         this.patchGridItems.emit({
  //           measuredWeight: changeEvent.data.weight,
  //           measuredPurity: changeEvent.value,
  //           preMeltingDetails: changeEvent.data.preMeltingDetails,
  //           id: changeEvent.data.id,
  //           isSave: changeEvent.data.isSave
  //         });
  //     }
  //   }
  // }

  onCellClicked(clickEvent) {
    console.log(clickEvent.colDef.field);
    if (clickEvent.colDef.field === 'totalValue') {
      if (clickEvent.data.totalValue)
        this.opentotalValueBreakup(clickEvent.data.totalBreakUp);
    } else if (clickEvent.colDef.cellRendererFramework === DeleteRowComponent) {
      this.openConfirmDialogForDelete(clickEvent.data);
    } else if (clickEvent.colDef.field === 'melted') {
      this.openPreDetails(clickEvent.data, this.karatage);
    }
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  // shortcutEventHandler(command: Command) {
  //   if (command.name === focusShortcutKey) {
  //     this.api.setFocusedCell(0, ProductGridFieldsEnum.ITEMCODE);
  //   }
  // }

  extractValues(mappings) {
    console.log(Object.keys(mappings));
    return Object.keys(mappings);
  }

  lookupValue(mappings, key) {
    console.log(mappings[key], mappings, key);
    this.metalType = Object.keys(mappings);
    return mappings[key];
  }

  getContext() {
    return {
      validators: {
        purity: [
          this.fieldValidatorsService.requiredField('purity'),
          this.fieldValidatorsService.min(0, 'purity'),
          this.fieldValidatorsService.max(100, 'purity')
        ],
        weight: [
          this.fieldValidatorsService.requiredField('Weight'),
          this.fieldValidatorsService.weightField('Weight'),
          this.fieldValidatorsService.min(0.001, 'Weight')
        ]
      }
    };
  }

  opentotalValueBreakup(data) {
    const dialogRef = this.dialog.open(TotalValuePopupComponent, {
      width: '500px',

      data: data
    });

    dialogRef.afterClosed();
  }

  openConfirmDialogForDelete(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.productGrid.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          // this.onRemoveSelectedRow(data);
          this.deleteEmit.emit({ id: data.id, isSave: data.isSave });
        }
      });
  }
  openPreMeltingDetails() {
    const dialogRef = this.dialog.open(PreMeltingDetailsComponent, {
      width: '300px',

      data: this.preMeltingDetails
    });

    dialogRef.afterClosed();
  }
}
