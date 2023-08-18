import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  EditItemComponent,
  ValuePercentageComponent,
  DiscountHeaderComponent,
  DiscountTotalComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  PercentageFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  DiscountCalculationItemDetails,
  DiscountClubTypeEnum,
  DiscountValueDetails,
  DiscountComponentNameEnum,
  DiscountComponentRow,
  ItemLevelDiscountDetails,
  ItemLevelDiscountRowData,
  TransactionTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-discount-details-rivaah-discount',
  templateUrl: './discount-details-rivaah-discount.component.html',
  styleUrls: ['./discount-details-rivaah-discount.component.scss']
})
export class DiscountDetailsRivaahDiscountComponent
  implements OnChanges, OnDestroy {
  @Input() itemDetails: DiscountCalculationItemDetails;
  @Input() currencyCode: string;
  @Input() rivaahDiscount: ItemLevelDiscountDetails[];
  @Input() rivaahDiscountsGep: any = [];
  @Input() selectedItemIds: string[] = [];
  @Input() discountType = TransactionTypeEnum.CM;

  @Input() isPopupReadonly = false;
  @Input() txnType: TransactionTypeEnum;
  @Input() typeOfCMByRefTxnId = null;
  @Output() total = new EventEmitter<number>();

  discountSeparator = '__';

  rowData: ItemLevelDiscountRowData[] = [];

  @ViewChild('reasonForNoDiscount')
  selectDropdownComponent: SelectDropdownComponent;
  @ViewChild('reasonsForDiscountChanges')
  selectReasonsForDiscountChange: SelectDropdownComponent;
  defaultDiscountComponent = {
    ucp: {
      isPercent: true,
      percentage: 0,
      value: 0,
      maxValue: 0
    },
    makingCharge: {
      isPercent: true,
      percentage: 0,
      value: 0,
      maxValue: 0
    },
    metalCharge: {
      isPercent: true,
      percentage: 0,
      value: 0,
      maxValue: 0
    },
    stoneCharge: {
      isPercent: true,
      percentage: 0,
      value: 0,
      maxValue: 0
    },
    valuePerGram: {
      isPercent: false,
      percentage: 0,
      value: 0,
      maxValue: 0
    }
  };

  totalGepRivaahData = [
    {
      discountType: 'GEP Purity Rivaah Discount',
      total: 0
    }
  ];

  defaultRow: ItemLevelDiscountRowData = {
    discountDescription: '',
    clubbingDiscountType: '',
    discountCode: '',
    discountId: '',
    discountType: '',
    discountTxnId: '',
    refDiscountTxnId: '',
    discountValue: 0,
    maxDiscount: 0,
    editable: false,
    isEdited: false,
    components: [],
    isBlank: true,
    isValid: true,
    isAdded: false,
    ...this.defaultDiscountComponent
  };

  columnDefs: any = [];
  footerColumnDefs: any = [];

  rivaahGepcolumnDefs = [];
  domLayout = 'autoHeight';
  animateRows = true;
  api1: GridApi;
  api2: GridApi;

  defaultColDef = {
    resizable: false,
    suppressMovable: true,
    suppressSizeToFit: true
  };

  selectDiscountFormControl: FormControl;

  selectABDiscountFormControl: FormControl;

  reasonForDiscountChangeControl: FormControl;

  reasonForNoDiscountFormControl: FormControl;

  totalData: {
    column: string;
    total: number;
    totalUcp: number;
    totalMakingCharges: number;
    totalMetalCharge: number;
    totalStoneCharge: number;
    totalValuePerGram: number;
  }[] = [
    {
      column: 'Total',
      total: 0,
      totalUcp: 0,
      totalMakingCharges: 0,
      totalMetalCharge: 0,
      totalStoneCharge: 0,
      totalValuePerGram: 0
    }
  ];

  valueLabel = 'Value';
  percentageLabel = 'Percentage';
  selectedDiscountDescription = '';

  component: any = this;
  destroy$ = new Subject();
  transactionTypeRef = TransactionTypeEnum;
  reasonForNotGivingDiscountsLabel: string;
  reaonsForDiscountChangeLabel: string;
  tooltipShowDelay = 1;

  constructor(
    private currencyFormatterService: CurrencyFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private percentageFormatterService: PercentageFormatterService,
    private fieldValidatorService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.columnDefs = [
      {
        headerName: 'Applicable Discounts',
        cellRenderer: 'discountHeaderComponent',
        width: 200,
        field: 'discountDescription',
        tooltipField: 'discountDescription'
      },
      {
        headerName: this.getColumnHeader('Metal Charge'),
        field: 'metalCharge',
        width: 150,
        editable: params => this.checkCellEdit(params, 'metalCharge'),
        cellEditor: 'valuePercentageComponent',
        cellRendererSelector: params => {
          if (this.checkCellEdit(params, 'metalCharge')) {
            return {
              component: 'editItemComponent'
            };
          } else {
            return null;
          }
        },

        valueFormatter: params => this.valueFormatter(params, 'metalCharge'),
        cellClass: 'pw-justify-content-end',
        type: 'numericColumn',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false;
          }
        }
      },

      {
        headerName: this.getColumnHeader('Making Charge'),
        field: 'makingCharge',
        width: 150,
        editable: params => this.checkCellEdit(params, 'makingCharge'),

        cellEditor: 'valuePercentageComponent',
        cellRendererSelector: params => {
          if (this.checkCellEdit(params, 'makingCharge')) {
            return {
              component: 'editItemComponent'
            };
          } else {
            return null;
          }
        },
        valueFormatter: params => this.valueFormatter(params, 'makingCharge'),
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false;
          }
        }
      },

      {
        headerName: this.getColumnHeader('Stone Charge'),
        field: 'stoneCharge',
        width: 150,
        editable: params => this.checkCellEdit(params, 'stoneCharge'),

        cellEditor: 'valuePercentageComponent',
        cellRendererSelector: params => {
          if (this.checkCellEdit(params, 'stoneCharge')) {
            return {
              component: 'editItemComponent'
            };
          } else {
            return null;
          }
        },
        valueFormatter: params => this.valueFormatter(params, 'stoneCharge'),
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false;
          }
        }
      },
      {
        headerName: this.getColumnHeader('UCP'),
        field: 'ucp',
        width: 150,
        editable: params => this.checkCellEdit(params, 'ucp'),
        cellEditor: 'valuePercentageComponent',
        cellRendererSelector: params => {
          if (this.checkCellEdit(params, 'ucp')) {
            return {
              component: 'editItemComponent'
            };
          } else {
            return null;
          }
        },
        valueFormatter: params => this.valueFormatter(params, 'ucp'),
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false;
          }
        }
      },
      {
        headerName: this.getColumnHeader('Total Value (Value per gms)'),
        field: 'valuePerGram',
        width: 200,
        editable: params => this.checkCellEdit(params, 'valuePerGram'),

        cellEditor: 'valuePercentageComponent',
        cellRendererSelector: params => {
          if (this.checkCellEdit(params, 'valuePerGram')) {
            return {
              component: 'editItemComponent'
            };
          } else {
            return null;
          }
        },
        valueFormatter: params => this.valueFormatter(params, 'valuePerGram'),
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false;
          }
        }
      },
      {
        headerName: this.getColumnHeader('Total Amount'),
        cellClass: 'pw-justify-content-end',
        type: 'numericColumn',
        field: 'discountValue',
        width: 150,
        cellRenderer: 'discountTotalComponent',
        cellClassRules: {
          'pw-gray-border': params => {
            return params.data.isValid === true;
          },
          'pw-error-border': params => {
            return params.data.isValid === false;
          }
        }
      }
    ];

    this.footerColumnDefs = [
      {
        headerName: '',
        field: 'column',
        width: 200
      },
      {
        headerName: '',
        field: 'totalMetalCharge',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 150,
        valueFormatter: param => this.formatCurrency(param.value)
      },
      {
        headerName: '',
        field: 'totalMakingCharges',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 150,
        valueFormatter: param => this.formatCurrency(param.value)
      },

      {
        headerName: '',
        field: 'totalStoneCharge',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 150,
        valueFormatter: param => this.formatCurrency(param.value)
      },
      {
        headerName: '',
        field: 'totalUcp',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 150,
        valueFormatter: param => this.formatCurrency(param.value)
      },
      {
        headerName: '',
        field: 'totalValuePerGram',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 200,
        valueFormatter: param => this.formatCurrency(param.value)
      },
      {
        headerName: '',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        field: 'total',
        width: 150,
        valueFormatter: param => this.formatCurrency(param.value)
      }
    ];

    this.rivaahGepcolumnDefs = [
      {
        headerName: 'Applicable Discounts',
        field: 'discountType',
        flex: 1
      },
      {
        headerName:
          'Total Amount' +
          ' (' +
          this.currencySymbolService.get(this.currencyCode) +
          ')',
        field: 'total',
        type: 'numericColumn',
        cellClass: 'pw-justify-content-end',
        width: 300,
        valueFormatter: param => this.formatCurrency(param.value)
      }
    ];
  }

  stopEditing() {
    this.api1.stopEditing();
  }

  isEditing() {
    return this.api1.getEditingCells().length;
  }

  getColumnHeader(header: string): string {
    return (
      header + ' (' + this.currencySymbolService.get(this.currencyCode) + ')'
    );
  }

  checkCellEdit(param: any, field: string): boolean {
    return false;
  }

  valueFormatter(params: any, field: string): string {
    if (params.data.isBlank) {
      return ' ';
    }

    if (params.value.value === 0) {
      return this.formatCurrency(0);
    }

    const value = params.value.value;
    const percentage = params.value.percentage;
    const isPercent = !!params.value.isPercent;

    if (!this.validValueCheck(value)) {
      return ' ';
    }
    if (isPercent) {
      return (
        this.formatCurrency(value) +
        '  (' +
        this.percentageFormatterService.format(percentage) +
        ')'
      );
    } else {
      return this.formatCurrency(value);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rivaahDiscount']) {
      this.createRowData();
    }
  }

  showErrors() {
    this.selectDropdownComponent?.getReference().open();
    this.selectReasonsForDiscountChange?.getReference().open();
  }

  createRow(data: any): ItemLevelDiscountRowData {
    const editable = false;
    const isAdded = false;

    const discountComponent = this.getDiscountComponents(
      data.discountValueDetails?.data,
      isAdded,
      editable
    );

    const row: ItemLevelDiscountRowData = {
      discountDescription: data.discountDescription,
      clubbingDiscountType: data.discountAttributes.clubbingDiscountType,
      discountCode: data.discountCode,
      discountId: data.discountId,
      discountType: data.discountType,
      discountValue: data.discountValue,
      discountTxnId: data.discountTxnId,
      refDiscountTxnId: data.refDiscountTxnId,
      maxDiscount: data.discountValue,
      editable: editable,
      isEdited: false,
      isBlank: false,
      isAdded: isAdded,
      components: discountComponent.components,
      isValid: true,
      ...discountComponent.discountComponents
    };

    return row;
  }

  getDiscountComponents(
    data: DiscountValueDetails[],
    isAdded: boolean,
    isEditable: boolean
  ): {
    discountComponents: {
      ucp: DiscountComponentRow;
      makingCharge: DiscountComponentRow;
      metalCharge: DiscountComponentRow;
      stoneCharge: DiscountComponentRow;
      valuePerGram: DiscountComponentRow;
    };
    components: string[];
  } {
    const discountComponents = this.defaultDiscountComponent;
    const components: string[] = [];

    if (data) {
      console.log('ddsdsdsdsd', data);
      for (let i = 0; i < data.length; i++) {
        console.log('ddsdsdsdsd', data[i]);
        const percentage = data[i].discountPercent;
        const isPercent = data[i].isDiscountPercentage;
        const value = data[i].discountValue;

        // Code to show all editable cell value as 0
        // if (!isAdded && isEditable) {
        //   value = 0;
        //   percentage = 0;
        // }
        let maxValue = data[i].discountValue;
        let field;
        // this.itemDetails = {
        //   makingCharge: 2,
        //   goldCharge: 3,
        //   ucpValue: 3,
        //   isUcp: true,
        //   stoneCharge: 3,
        //   weight: 3
        // };
        switch (data[i].component) {
          case DiscountComponentNameEnum.MAKING_CHARGE:
            field = 'makingCharge';

            break;

          case DiscountComponentNameEnum.METAL_CHARGE:
            field = 'metalCharge';

            break;

          case DiscountComponentNameEnum.STONE_CHARGE:
            field = 'stoneCharge';

            break;

          case DiscountComponentNameEnum.UNIT_WEIGHT:
            field = 'valuePerGram';
            break;

          case DiscountComponentNameEnum.UCP:
            field = 'ucp';

            break;
        }

        components.push(field);

        discountComponents[field] = {
          isPercent,
          percentage,
          value,
          maxValue
        };
      }
    }

    return { discountComponents, components };
  }

  createDefaultRow(type): ItemLevelDiscountRowData {
    return { ...this.defaultRow, clubbingDiscountType: type };
  }

  createRowData() {
    this.rowData = [
      this.createDefaultRow(DiscountClubTypeEnum.TYPE_1),
      this.createDefaultRow(DiscountClubTypeEnum.TYPE_2),
      this.createDefaultRow(DiscountClubTypeEnum.TYPE_3)
    ];
    this.rivaahDiscount.forEach(d => {
      const row = this.createRow(d);
      console.log('row', row);
      let rowIndex = 3;
      if (row.clubbingDiscountType === DiscountClubTypeEnum.TYPE_1) {
        rowIndex = 0;
      } else if (row.clubbingDiscountType === DiscountClubTypeEnum.TYPE_2) {
        rowIndex = 1;
      } else if (row.clubbingDiscountType === DiscountClubTypeEnum.TYPE_3) {
        rowIndex = 2;
      }
      if (rowIndex >= 0 || rowIndex <= 2) {
        this.rowData[rowIndex] = row;
      } else {
        this.rowData.push(row);
      }
    });

    this.calculateTotalData();
  }

  calculateTotalData() {
    this.totalData = [];
    this.rowData = this.rowData.map(d => ({
      ...d,
      discountValue:
        d.ucp.value +
        d.makingCharge.value +
        d.metalCharge.value +
        d.stoneCharge.value +
        d.valuePerGram.value
    }));

    const totalData = this.rowData
      .filter(d => !d.isBlank)
      .map(d => ({
        column: 'Total',
        total: d.discountValue,
        totalUcp: d.ucp.value,
        totalMakingCharges: d.makingCharge.value,
        totalMetalCharge: d.metalCharge.value,
        totalStoneCharge: d.stoneCharge.value,
        totalValuePerGram: d.valuePerGram.value
      }))
      .reduce(
        (t1, t2) => ({
          column: 'Total',
          total: t1.total + t2.total,
          totalUcp: t1.totalUcp + t2.totalUcp,
          totalMakingCharges: t1.totalMakingCharges + t2.totalMakingCharges,
          totalMetalCharge: t1.totalMetalCharge + t2.totalMetalCharge,
          totalStoneCharge: t1.totalStoneCharge + t2.totalStoneCharge,
          totalValuePerGram: t1.totalValuePerGram + t2.totalValuePerGram
        }),
        {
          column: 'Total',
          total: 0,
          totalUcp: 0,
          totalMakingCharges: 0,
          totalMetalCharge: 0,
          totalStoneCharge: 0,
          totalValuePerGram: 0
        }
      );

    this.totalGepRivaahData[0].total = this.rivaahDiscountsGep
      .map(d => d.total)
      .reduce((t1, t2) => t1 + t2, 0);

    this.totalData = [totalData];

    this.total.emit(totalData.total + this.totalGepRivaahData[0].total);
  }

  validValueCheck(value: any): boolean {
    return !(value === null || value === '' || isNaN(value));
  }

  formatCurrency(value: number): string {
    return this.currencyFormatterService.format(
      value,
      this.currencyCode,
      false
    );
  }

  gridReady1(params: GridReadyEvent) {
    this.api1 = params.api;
    this.api1.sizeColumnsToFit();
  }

  gridReady2(params: GridReadyEvent) {
    this.api2 = params.api;
    this.api2.sizeColumnsToFit();
  }

  getComponents() {
    return {
      valuePercentageComponent: ValuePercentageComponent,
      editItemComponent: EditItemComponent,
      discountHeaderComponent: DiscountHeaderComponent,
      discountTotalComponent: DiscountTotalComponent
    };
  }

  getRowData() {
    this.rowData = [];
    this.api1.forEachNode(node =>
      this.rowData.push(node.data as ItemLevelDiscountRowData)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
