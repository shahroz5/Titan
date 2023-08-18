import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
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
  DiscountHeaders,
  ItemLevelDiscountDetails,
  ItemLevelDiscountRowData,
  SelectDropDownOption,
  TransactionTypeEnum,
  DiscountTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-discount-details-item-level-discount',
  templateUrl: './discount-details-item-level-discount.component.html',
  styleUrls: ['./discount-details-item-level-discount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountDetailsItemLevelDiscountComponent
  implements OnChanges, OnDestroy {
  @Input() enableReasonForNoDiscount = false;
  @Input() enablereasonForDiscountChange = false;
  @Input() itemDetails: DiscountCalculationItemDetails;
  @Input() currencyCode: string;
  @Input() itemLevelDiscounts: ItemLevelDiscountDetails[] = [];
  @Input() discountOptions: DiscountHeaders;
  @Input() ABDiscountOptions: DiscountHeaders;
  @Input() reasonsForDiscountChange: SelectDropDownOption[] = [];
  @Input() reasonsForNoDiscounts: SelectDropDownOption[] = [];
  @Input() selectedItemIds: string[] = [];
  @Input() discountType = TransactionTypeEnum.CM;
  @Input() isAllowedToChangeAB = true;
  @Input() isBillLevelDiscountsAdded: boolean;
  @Input() isPopupReadonly = false;
  @Input() txnType: TransactionTypeEnum;
  @Input() typeOfCMByRefTxnId = null;
  @Input() selectedDiscountReason = null;
  @Output() total = new EventEmitter<number>();
  @Output() loadItems = new EventEmitter<string[]>();
  @Output() loadABItems = new EventEmitter<string[]>();
  @Output() reasonChange = new EventEmitter<any>();
  @Output() editing = new EventEmitter();

  discountSeparator = '__';
  availableDiscountOptions: SelectDropDownOption[] = [];
  availableABDiscountOptions: SelectDropDownOption[] = [];
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
    ...this.defaultDiscountComponent,
    rivaahGhsDetails: null
  };

  columnDefs: any = [];
  footerColumnDefs: any = [];
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
  focusFooterGrid = false;
  unFocusFooterGrid = false;
  tabKeyPressed = false;
  shiftKeyPressed = false;

  constructor(
    private currencyFormatterService: CurrencyFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private percentageFormatterService: PercentageFormatterService,
    private fieldValidatorService: FieldValidatorsService,
    private translate: TranslateService
  ) {
    this.translate
      .get([
        'pw.discountDetailsPopup.reaonsForDiscountChangeLabel',
        'pw.discountDetailsPopup.reasonForNotGivingDiscountsLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.reasonForNotGivingDiscountsLabel =
          translatedMessages[
            'pw.discountDetailsPopup.reasonForNotGivingDiscountsLabel'
          ];
        this.reaonsForDiscountChangeLabel =
          translatedMessages[
            'pw.discountDetailsPopup.reaonsForDiscountChangeLabel'
          ];
      });
    this.createDiscountSelectionForm(null);
    this.reasonForDiscountChangeControl = new FormControl(
      null,
      this.fieldValidatorService.requiredField(
        this.reaonsForDiscountChangeLabel
      )
    );

    this.reasonForNoDiscountFormControl = new FormControl(
      null,
      this.fieldValidatorService.requiredField(
        this.reasonForNotGivingDiscountsLabel
      )
    );

    this.reasonForDiscountChangeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(reason => {
        this.reasonChange.next(reason);
      });

    this.reasonForNoDiscountFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(reason => {
        this.reasonChange.next(reason);
      });

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
        suppressKeyboardEvent: params => this.suppressKeyboardEvent(params),
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
        suppressKeyboardEvent: params => this.suppressKeyboardEvent(params),
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
        suppressKeyboardEvent: params => this.suppressKeyboardEvent(params),
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
        suppressKeyboardEvent: params => this.suppressKeyboardEvent(params),
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
        suppressKeyboardEvent: params => this.suppressKeyboardEvent(params),
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
  }
  rowEdit() {
    this.editing.emit();
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
    return (
      !this.isPopupReadonly &&
      !this.isBillLevelDiscountsAdded &&
      !param.data.isBlank &&
      param.data.editable &&
      param.data[field].maxValue !== 0
    );
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
    if (changes['itemLevelDiscounts']) {
      this.createRowData();
    }

    if (changes['enableReasonForNoDiscount']) {
      this.reasonForNoDiscountFormControl?.reset();
    }

    if (changes['enablereasonForDiscountChange']) {
      this.reasonForDiscountChangeControl?.reset();
    }

    if (changes['selectedItemIds']) {
      console.log('itemIDS', this.selectedItemIds);
      if (this.selectedItemIds) {
        this.createDiscountSelectionForm(
          this.selectedItemIds.join(this.discountSeparator)
        );
      }
    }

    if (changes['discountOptions']) {
      this.createDiscountOptions();
    }

    if (changes['ABDiscountOptions']) {
      this.createABDiscountOptions();
    }
  }

  createDiscountSelectionForm(defaultValue) {
    console.log('defaultValue', defaultValue, this.discountType);

    if (this.discountType === TransactionTypeEnum.CM)
      this.selectDiscountFormControl = new FormControl(defaultValue);
    else this.selectDiscountFormControl = new FormControl();

    if (this.discountType === TransactionTypeEnum.AB)
      this.selectABDiscountFormControl = new FormControl(defaultValue);
    else this.selectABDiscountFormControl = new FormControl();

    if (this.isBillLevelDiscountsAdded || this.isPopupReadonly) {
      this.selectDiscountFormControl.disable();
      this.selectABDiscountFormControl.disable();
    } else {
      this.selectDiscountFormControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((discountID: string) => {
          console.log(discountID, 'CHECK VALUE CHANGES');
          this.loadItems.next(discountID?.split(this.discountSeparator));
        });

      this.selectABDiscountFormControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((discountID: string) => {
          console.log(discountID, 'CHECK VALUE CHANGES');
          this.loadABItems.next(discountID?.split(this.discountSeparator));
        });
    }
  }
  showErrors() {
    this.selectDropdownComponent?.getReference().open();
    this.selectReasonsForDiscountChange?.getReference().open();
  }
  createDiscountOptions() {
    console.log('availableDiscountOptions', this.discountOptions);
    if (this.discountOptions?.clubDiscounts?.length) {
      const clubId = [];
      const tempClubDiscounts = [...this.discountOptions?.clubDiscounts];
      for (const clubDisc of tempClubDiscounts) {
        let tempDiscFlag = false;
        for (const disc of clubDisc.discounts) {
          if (
            disc.discountType === DiscountTypeEnum.CATEGORY_DISCOUNT ||
            disc.discountType === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
            disc.discountType === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
            disc.discountType === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
            disc.discountType === DiscountTypeEnum.BEST_DEAL_DISCOUNT
          ) {
            tempDiscFlag = true;
            break;
          }
        }
        if (tempDiscFlag === false) {
          clubId.push(clubDisc.clubDiscountId);
        }
        console.log('clubId', clubId);
      }

      this.availableDiscountOptions = tempClubDiscounts
        .slice()
        .sort((d1, d2) => d2.discounts.length - d1.discounts.length)
        .filter(discData =>
          this.isAllowedToChangeAB === false
            ? clubId.includes(discData.clubDiscountId)
            : true
        )
        .map(d =>
          d.discounts
            .map(data => ({
              description: data.discountAttributes?.occasion,
              value: d.clubDiscountId
            }))
            .reduce(
              (d1, d2, i) => ({
                description:
                  d1.description + (i > 0 ? ' | ' : '') + d2.description,
                value:
                  d1.value + (i > 0 ? this.discountSeparator : '') + d2.value
                // value: d1.value
              }),
              { description: '', value: '' }
            )
        );
    }
    if (this.discountOptions?.discounts?.length) {
      this.availableDiscountOptions = this.availableDiscountOptions.concat(
        this.discountOptions.discounts
          .filter(discData =>
            this.isAllowedToChangeAB === false
              ? discData.discountType !== DiscountTypeEnum.CATEGORY_DISCOUNT &&
                discData.discountType !==
                  DiscountTypeEnum.SLAB_BASED_DISCOUNT &&
                discData.discountType !==
                  DiscountTypeEnum.HIGH_VALUE_DISCOUNT &&
                discData.discountType !==
                  DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT &&
                discData.discountType !== DiscountTypeEnum.BEST_DEAL_DISCOUNT
              : true
          )
          .map(d => ({
            description: d.discountAttributes?.occasion,
            value: d.discountId
          }))
      );
    }

  }

  createABDiscountOptions() {
    if (this.ABDiscountOptions?.clubDiscounts?.length) {
      const tempClubDiscounts = [...this.ABDiscountOptions?.clubDiscounts];
      this.availableABDiscountOptions = tempClubDiscounts
        .sort((d1, d2) => d2.discounts.length - d1.discounts.length)
        .map(d =>
          d.discounts
            .map(data => ({
              description: data.discountAttributes?.occasion,
              value: d.clubDiscountId
            }))
            .reduce(
              (d1, d2, i) => ({
                description:
                  d1.description + (i > 0 ? ' | ' : '') + d2.description,
                value:
                  d1.value + (i > 0 ? this.discountSeparator : '') + d2.value
              }),
              { description: '', value: '' }
            )
        );
    }
    // todo: tocheck
    if (this.ABDiscountOptions?.discounts?.length) {
      this.availableABDiscountOptions = this.availableABDiscountOptions.concat(
        this.ABDiscountOptions.discounts.map(d => ({
          description: d.discountAttributes?.occasion,
          value: d.refDiscountTxnId
        }))
      );
    }

    // console.log(
    //   this.availableABDiscountOptions,
    //   'this.availableABDiscountOptions'
    // );
  }

  createRow(data: ItemLevelDiscountDetails): ItemLevelDiscountRowData {
    const editable = data.basicCriteriaDetails.isEditable;
    const isAdded = !!data.discountTxnId;

    const discountComponent = this.getDiscountComponents(
      data.discountValueDetails,
      isAdded,
      editable
    );
    const row: ItemLevelDiscountRowData = {
      discountDescription: data.discountDescription,
      clubbingDiscountType: data.clubbingDiscountType,
      discountCode: data.discountCode,
      discountId: data.discountId,
      discountType: data.discountType,
      discountValue: data.discountValue,
      discountTxnId: data.discountTxnId,
      refDiscountTxnId: data.refDiscountTxnId,
      maxDiscount: data.basicCriteriaDetails.maxDiscount,
      editable: editable,
      isEdited: false,
      isBlank: false,
      isAdded: isAdded,
      components: discountComponent.components,
      isValid: true,
      ...discountComponent.discountComponents,
      rivaahGhsDetails: data.rivaahGhsDetails
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
      for (let i = 0; i < data.length; i++) {
        const percentage = data[i].discountPercent;
        const isPercent = data[i].isDiscountPercentage;
        const value = data[i].discountValue;
        // Code to show all editable cell value as 0
        // if (!isAdded && isEditable) {
        //   value = 0;
        //   percentage = 0;
        // }
        let maxValue = data[i].maxValue;
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
            if (!isPercent && maxValue > this.itemDetails?.makingCharge) {
              maxValue = this.itemDetails.makingCharge;
            }
            break;

          case DiscountComponentNameEnum.METAL_CHARGE:
            field = 'metalCharge';
            if (!isPercent && maxValue > this.itemDetails?.goldCharge) {
              maxValue = this.itemDetails.goldCharge;
            }
            break;

          case DiscountComponentNameEnum.STONE_CHARGE:
            field = 'stoneCharge';
            if (!isPercent && maxValue > this.itemDetails?.stoneCharge) {
              maxValue = this.itemDetails.stoneCharge;
            }
            break;

          case DiscountComponentNameEnum.UNIT_WEIGHT:
            field = 'valuePerGram';
            break;

          case DiscountComponentNameEnum.UCP:
            field = 'ucp';
            if (!isPercent && maxValue > this.itemDetails?.ucpValue) {
              maxValue = this.itemDetails.ucpValue;
            }
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
    this.itemLevelDiscounts.forEach(d => {
      const row = this.createRow(d);
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
      this.selectedDiscountDescription = this.itemLevelDiscounts
        .map(data => data.discountDescription)
        .reduce((d1, d2, i) => d1 + (i > 0 ? ' | ' : '') + d2, '');
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

    this.totalData = [totalData];

    this.total.emit(totalData.total);
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

  getContext() {
    return {
      validators: {
        amount: [
          this.fieldValidatorService.requiredField(this.valueLabel),
          this.fieldValidatorService.amountField(this.valueLabel),

          this.fieldValidatorService.minAmount(
            0,
            this.valueLabel,
            this.currencyCode
          )
        ],
        percentage: [
          this.fieldValidatorService.requiredField(this.percentageLabel),
          this.fieldValidatorService.percentageField(this.percentageLabel),
          this.fieldValidatorService.min(0, this.percentageLabel)
        ]
      },
      currencyCode: this.currencyCode,
      componentParent: this.component,
      enableMaxValidtion: true
    };
  }

  getComponents() {
    return {
      valuePercentageComponent: ValuePercentageComponent,
      editItemComponent: EditItemComponent,
      discountHeaderComponent: DiscountHeaderComponent,
      discountTotalComponent: DiscountTotalComponent
    };
  }

  onCellValueChanged(data) {
    if (
      this.checkForCellValueChanges(
        data.oldValue,
        data.newValue,
        data.column.colId
      )
    ) {
      const discountComponent = data?.colDef?.field;
      const discount = data?.data as ItemLevelDiscountRowData;
      const newValue = data?.value?.value;
      const newPercentage = data?.value?.percentage;
      const isPercent = data?.value?.isPercent;

      if (isPercent && (isNaN(newPercentage) || newPercentage === 0)) {
        discount[discountComponent].value = 0;
        discount[discountComponent].percentage = 0;
        discount[discountComponent].isValid = true;
      } else if (!isPercent && (isNaN(newValue) || newValue === 0)) {
        discount[discountComponent].value = 0;
        discount[discountComponent].percentage = 0;
        discount[discountComponent].isValid = true;
      } else {
        const newDiscount = this.calculateDiscount(
          discountComponent,
          isPercent,
          newValue,
          newPercentage
        );

        discount[discountComponent].value = +newDiscount;
      }

      const totalDiscount =
        discount.metalCharge.value +
        discount.makingCharge.value +
        discount.ucp.value +
        discount.stoneCharge.value +
        discount.valuePerGram.value;

      // if (discount.maxDiscount > 0) {
      //   discount.isValid =
      //     totalDiscount > 0 && totalDiscount <= discount.maxDiscount;
      // }

      discount.isEdited = true;
      const res = this.api1?.applyTransaction({
        update: [discount]
      });
      this.getRowData();
      this.calculateTotalData();
      this.api1?.redrawRows({ rowNodes: res.update });
      this.api2?.redrawRows();

      if (this.shiftKeyPressed && this.tabKeyPressed) {
        this.api1.setFocusedCell(
          data.rowIndex,
          this.getBackwardCellToFocus(data.column.colId)
        );
        this.tabKeyPressed = false;
        this.shiftKeyPressed = false;
      } else if (this.tabKeyPressed) {
        this.api1.setFocusedCell(
          data.rowIndex,
          this.getCellToFocus(data.column.colId)
        );
        this.tabKeyPressed = false;
      } else {
        this.api1.setFocusedCell(data.rowIndex, data.column.colId);
      }
    }
  }

  calculateDiscount(
    discountOn: string,
    isPercentage: boolean,
    value: number,
    percentage: number
  ): number {
    if (discountOn === 'valuePerGram') {
      return value;
    } else if (!isPercentage) {
      return value;
    } else {
      let componentValue = 0;
      switch (discountOn) {
        case 'makingCharge':
          componentValue = this.itemDetails.makingCharge;
          break;

        case 'metalCharge':
          componentValue = this.itemDetails.goldCharge;
          break;

        case 'stoneCharge':
          componentValue = this.itemDetails.stoneCharge;
          break;

        case 'ucp':
          componentValue = this.itemDetails.ucpValue;
          break;
      }

      return this.calculatePercentage(componentValue, percentage);
    }
  }

  calculatePercentage(value, percentage) {
    const discount = (value * percentage) / 100;
    return this.currencyRoundOff(discount);
  }

  checkForCellValueChanges(oldValue, newValue, columnId): boolean {
    if (columnId === 'valuePerGram') {
      if (oldValue.value === newValue.value) {
        return false;
      } else {
        return true;
      }
    } else {
      if (
        oldValue.percentage === newValue.percentage &&
        oldValue.value === newValue.value
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }
  getRowData() {
    this.rowData = [];
    this.api1.forEachNode(node =>
      this.rowData.push(node.data as ItemLevelDiscountRowData)
    );
  }

  isAllCellEditValid() {
    this.getRowData();

    return !this.rowData
      .filter(d => !d.isBlank && d.editable)
      .map(
        d => d.components.filter(field => d[field]['isValid'] === false).length
      )
      .filter(l => l !== 0).length;
  }

  isRowDiscountGreaterThanZero() {
    // this.getRowData();
    return !this.rowData
      .filter(d => !d.isBlank)
      .filter(d => d.discountValue === 0).length;
  }

  isAllRowEditValid() {
    // this.getRowData();

    return !this.rowData
      .filter(d => !d.isBlank && d.editable)
      .filter(d => !d.isValid).length;
  }

  getItemLevelDiscounts(): ItemLevelDiscountDetails[] {
    this.getRowData();
    return this.rowData
      .filter(d => !d.isBlank)
      .map(d => this.createItemLevelDiscountResponse(d));
  }

  createItemLevelDiscountResponse(
    data: ItemLevelDiscountRowData
  ): ItemLevelDiscountDetails {
    const discountValueDetails: DiscountValueDetails[] = [];
    data.components.forEach(field => {
      const componentRow: DiscountComponentRow = data[field];
      let componentName;
      switch (field) {
        case 'makingCharge':
          componentName = DiscountComponentNameEnum.MAKING_CHARGE;
          break;

        case 'metalCharge':
          componentName = DiscountComponentNameEnum.METAL_CHARGE;
          break;

        case 'stoneCharge':
          componentName = DiscountComponentNameEnum.STONE_CHARGE;
          break;

        case 'valuePerGram':
          componentName = DiscountComponentNameEnum.UNIT_WEIGHT;
          break;

        case 'ucp':
          componentName = DiscountComponentNameEnum.UCP;
          break;
      }
      discountValueDetails.push({
        discountPercent: this.currencyRoundOff(componentRow.percentage),
        discountValue: this.currencyRoundOff(componentRow.value),
        component: componentName,
        isDiscountPercentage: componentRow.isPercent
      });
    });
    const discountComponent = {
      discountDescription: data.discountDescription,
      clubbingDiscountType: data.clubbingDiscountType,
      isEdited: data.isEdited,
      discountCode: data.discountCode,
      discountId: data.discountId,
      discountType: data.discountType,
      discountValue: this.currencyRoundOff(data.discountValue),
      discountTxnId: data.discountTxnId,
      refDiscountTxnId: data.refDiscountTxnId,
      discountValueDetails: discountValueDetails,
      basicCriteriaDetails: {
        maxDiscount: data.maxDiscount,
        isEditable: data.editable
      },
      rivaahGhsDetails: data.rivaahGhsDetails
    };

    return discountComponent;
  }

  onCellFocused(event) {
    this.focusFooterGrid = false;
    if (
      this.api1.getDisplayedRowCount() === 3 &&
      event.column &&
      event.rowIndex === 2 &&
      event.column.colId === 'discountValue'
    ) {
      this.focusFooterGrid = true;
    }
  }

  onFooterCellFocused(event) {
    this.unFocusFooterGrid = false;
    if (
      this.api1.getDisplayedRowCount() === 3 &&
      event.column &&
      event.column.colId === 'column'
    ) {
      this.unFocusFooterGrid = true;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftKeyPressed = true;
    }

    if (event.key === 'Tab') {
      this.tabKeyPressed = true;
    }

    if (!event.shiftKey && event.key === 'Tab' && this.focusFooterGrid) {
      event.preventDefault();
      this.api2.setFocusedCell(0, 'column');
      this.focusFooterGrid = false;
    } else if (
      event.shiftKey &&
      event.key === 'Tab' &&
      this.unFocusFooterGrid
    ) {
      event.preventDefault();
      this.api1.setFocusedCell(2, 'discountValue');
      this.unFocusFooterGrid = false;
    }
  }

  getCellToFocus(columnName) {
    switch (columnName) {
      case 'discountDescription':
        return 'metalCharge';
      case 'metalCharge':
        return 'makingCharge';
      case 'makingCharge':
        return 'stoneCharge';
      case 'stoneCharge':
        return 'ucp';
      case 'ucp':
        return 'valuePerGram';
      default:
        return 'discountDescription';
    }
  }

  getBackwardCellToFocus(columnName) {
    switch (columnName) {
      case 'metalCharge':
        return 'discountDescription';
      case 'makingCharge':
        return 'metalCharge';
      case 'stoneCharge':
        return 'makingCharge';
      case 'ucp':
        return 'stoneCharge';
      case 'valuePerGram':
        return 'ucp';
      default:
        return 'discountDescription';
    }
  }

  suppressKeyboardEvent(params) {
    let key = params.event.key;
    if (key === 'Tab') {
      this.stopEditing();
    }
  }

  cellEditingStarted(event) {
    this.shiftKeyPressed = false;
    this.tabKeyPressed = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
