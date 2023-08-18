import { DiscountValuePercentagePopupComponent } from '@poss-web/eposs/discount-config/ui-discount-value-percentage-popup';
import { AbCoPopupComponent } from '@poss-web/eposs/discount-config/ui-discount-config-ab-co-popup';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  CurrencySymbolService,
  PercentageFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { AddSlabPopupComponent } from '../add-slab-popup/add-slab-popup.component';
import {
  AbCoData,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  SlabConfig,
  SlabConfigItem,
  DiscountBasedOnTypesEnum,
  DiscountCompEnum,
  DiscountBasedOnEnum,
  SlabConfigFieldsEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  SlabErrorEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-discount-slab-config',
  templateUrl: './discount-slab-config.component.html',
  styleUrls: ['./discount-slab-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountSlabConfigMappingComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  form: FormGroup;
  defaultValue = 0;
  defaultIsPercent = true;
  discountBasedOnOptions = [];

  @Input() slabConfigsItems: SlabConfigItem[];

  @Input() currencyCode;

  @Input() slabConfig: SlabConfig;
  @Input() abCoData: AbCoData;
  @Input() discountDetails;
  @Input() discountWorkflow: boolean;
  @Input() mainTabType;

  @Output() delete = new EventEmitter<{
    updateData: SlabConfigItem[];
    deleteData: string[];
  }>();
  @Output() save = new EventEmitter<SlabConfig>();
  @Output() add = new EventEmitter<{
    addData: SlabConfigItem;
    updateData: SlabConfigItem[];
  }>();
  @Output() valueUpdate = new EventEmitter<{
    discountComponents: any[];
    id: string;
    isActive?: boolean;
  }>();
  @Output() getSlabValues = new EventEmitter();
  @Output() discountBaseChange = new EventEmitter<any>();
  @Output() activate = new EventEmitter<any>();
  @Input() isABOfferApplicable: boolean;
  @Input() isCOOfferApplicable: boolean;
  @Input() isPreviewApplicable: boolean;
  @Input() isRivaApplicable: boolean;
  @Output() enableWorkflowNotification = new EventEmitter<boolean>();

  columnDefs = [];
  rowSelection = 'single';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;

  selectedConfig: SlabConfigItem;

  destroy$ = new Subject<null>();
  component: any = this;
  defaultColDef = {
    suppressMovable: true
  };

  tabType = 'Regular';

  weightBasedDesc: string;
  valueBasedDesc: string;
  caratBasedDesc: string;
  slabNameHeaderTxt: string;
  minHeaderTxt: string;
  maxHeaderTxt: string;
  ucpHeaderTxt: string;
  makingChargesHeadeTxt: string;
  metalChargesHeaderTxt: string;
  wastageChargesHeaderTxt: string;
  stoneChargesHeaderTxt: string;
  valuePerGmHeaderTxt: string;
  discBasedOnMsg: string;
  discBasedOnTypeMsg: string;
  valuePerWeightTypeMsg: string;
  minFieldName: string;
  maxFieldName: string;
  minWtFieldName: string;
  maxWtFieldName: string;
  minValFieldName: string;
  maxValFieldName: string;
  minCaratFieldName: string;
  maxCaratFieldName: string;
  conflictSlabMsg1: string;
  conflictSlabMsg2: string;
  conflictSlabMsg3: string;
  slabExistsMsg1: string;
  slabExistsMsg2: string;

  DiscountBasedOnTypesEnumRef = DiscountBasedOnTypesEnum;
  DiscountCompEnumRef = DiscountCompEnum;
  DiscountBasedOnEnumRef = DiscountBasedOnEnum;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private currencyFormatterService: CurrencyFormatterService,
    private fieldValidatorsService: FieldValidatorsService,
    private percentageFormatterService: PercentageFormatterService,
    private currencySymbolService: CurrencySymbolService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    console.log(this.isRivaApplicable);
    this.translate
      .get([
        'pw.discountProductCategoryMapping.productCategoryLable',
        'pw.discountProductCategoryMapping.statusLabel',
        'pw.discountSlabConfig.weightBasedDesc',
        'pw.discountSlabConfig.valueBasedDesc',
        'pw.discountSlabConfig.caratBasedDesc',
        'pw.discountSlabConfig.slabNameHeaderTXt',
        'pw.discountSlabConfig.minHeaderTxt',
        'pw.discountSlabConfig.maxHeaderTxt',
        'pw.discountSlabConfig.ucpHeaderTxt',
        'pw.discountSlabConfig.makingChargesHeadeTxt',
        'pw.discountSlabConfig.metalChargesHeaderTxt',
        'pw.discountSlabConfig.wastageChargesHeaderTxt',
        'pw.discountSlabConfig.stoneChargesHeaderTxt',
        'pw.discountSlabConfig.valuePerGmHeaderTxt',
        'pw.discountSlabConfig.discBasedOnMsg',
        'pw.discountSlabConfig.discBasedOnTypeMsg',
        'pw.discountSlabConfig.valuePerWeightTypeMsg',
        'pw.discountSlabConfig.minFieldName',
        'pw.discountSlabConfig.maxFieldName',
        'pw.discountSlabConfig.minWtFieldName',
        'pw.discountSlabConfig.maxWtFieldName',
        'pw.discountSlabConfig.minValFieldName',
        'pw.discountSlabConfig.maxValFieldName',
        'pw.discountSlabConfig.minCaratFieldName',
        'pw.discountSlabConfig.maxCaratFieldName',
        'pw.discountSlabConfig.conflictSlabMsg1',
        'pw.discountSlabConfig.conflictSlabMsg2',
        'pw.discountSlabConfig.conflictSlabMsg3',
        'pw.discountSlabConfig.slabExistsMsg1',
        'pw.discountSlabConfig.slabExistsMsg2'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.weightBasedDesc =
          translatedMessages['pw.discountSlabConfig.weightBasedDesc'];
        this.valueBasedDesc =
          translatedMessages['pw.discountSlabConfig.valueBasedDesc'];
        this.caratBasedDesc =
          translatedMessages['pw.discountSlabConfig.caratBasedDesc'];
        this.slabNameHeaderTxt =
          translatedMessages['pw.discountSlabConfig.slabNameHeaderTxt'];
        this.minHeaderTxt =
          translatedMessages['pw.discountSlabConfig.minHeaderTxt'];
        this.maxHeaderTxt =
          translatedMessages['pw.discountSlabConfig.maxHeaderTxt'];
        this.ucpHeaderTxt =
          translatedMessages['pw.discountSlabConfig.ucpHeaderTxt'];
        this.makingChargesHeadeTxt =
          translatedMessages['pw.discountSlabConfig.makingChargesHeadeTxt'];
        this.metalChargesHeaderTxt =
          translatedMessages['pw.discountSlabConfig.metalChargesHeaderTxt'];
        this.wastageChargesHeaderTxt =
          translatedMessages['pw.discountSlabConfig.wastageChargesHeaderTxt'];
        this.stoneChargesHeaderTxt =
          translatedMessages['pw.discountSlabConfig.stoneChargesHeaderTxt'];
        this.valuePerGmHeaderTxt =
          translatedMessages['pw.discountSlabConfig.valuePerGmHeaderTxt'];
        this.discBasedOnMsg =
          translatedMessages['pw.discountSlabConfig.discBasedOnMsg'];
        this.discBasedOnTypeMsg =
          translatedMessages['pw.discountSlabConfig.discBasedOnTypeMsg'];
        this.valuePerWeightTypeMsg =
          translatedMessages['pw.discountSlabConfig.valuePerWeightTypeMsg'];
        this.minFieldName =
          translatedMessages['pw.discountSlabConfig.minFieldName'];
        this.maxFieldName =
          translatedMessages['pw.discountSlabConfig.maxFieldName'];
        this.minWtFieldName =
          translatedMessages['pw.discountSlabConfig.minWtFieldName'];
        this.maxWtFieldName =
          translatedMessages['pw.discountSlabConfig.maxWtFieldName'];
        this.minValFieldName =
          translatedMessages['pw.discountSlabConfig.minValFieldName'];
        this.maxValFieldName =
          translatedMessages['pw.discountSlabConfig.maxValFieldName'];
        this.minCaratFieldName =
          translatedMessages['pw.discountSlabConfig.minCaratFieldName'];
        this.maxCaratFieldName =
          translatedMessages['pw.discountSlabConfig.maxCaratFieldName'];
        this.conflictSlabMsg1 =
          translatedMessages['pw.discountSlabConfig.conflictSlabMsg1'];
        this.conflictSlabMsg2 =
          translatedMessages['pw.discountSlabConfig.conflictSlabMsg2'];
        this.conflictSlabMsg3 =
          translatedMessages['pw.discountSlabConfig.conflictSlabMsg3'];
        this.slabExistsMsg1 =
          translatedMessages['pw.discountSlabConfig.slabExistsMsg1'];
        this.slabExistsMsg2 =
          translatedMessages['pw.discountSlabConfig.slabExistsMsg2'];

        this.discountBasedOnOptions = [
          {
            description: this.weightBasedDesc,
            value: DiscountBasedOnEnum.WEIGHT_BASED
          },
          {
            description: this.caratBasedDesc,
            value: DiscountBasedOnEnum.CARAT_BASED
          },
          {
            description: this.valueBasedDesc,
            value: DiscountBasedOnEnum.VALUE_BASED
          }
        ];

        this.columnDefs = [
          {
            checkboxSelection: params => params.data.isActive,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName: this.slabNameHeaderTxt,
            field: SlabConfigFieldsEnum.SLAB_NAME,
            minWidth: 130,
            width: 180,
            pinned: 'left',
            lockPinned: true,
            resizable: true
          },
          {
            headerName: this.minHeaderTxt,
            field: SlabConfigFieldsEnum.MIN,
            width: 100,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            resizable: true
          },
          {
            headerName: this.maxHeaderTxt,
            field: SlabConfigFieldsEnum.MAX,
            width: 100,
            type: 'numericColumn',
            cellClass: 'pw-justify-content-end',
            resizable: true
          },

          {
            headerName: this.metalChargesHeaderTxt,
            children: [
              {
                headerName: '',
                width: 100,
                valueGetter: params => this.valueGetter(params, 'goldCharges'),
                type: 'numericColumn',
                cellClass: 'pw-justify-content-end',
                resizable: true
              },

              {
                headerName: '',
                width: 30,
                valueGetter: params => this.valueSymbol(params, 'goldCharges'),
                resizable: true
              }
            ]
          },

          {
            headerName: this.makingChargesHeadeTxt,
            children: [
              {
                headerName: '',
                width: 100,
                valueGetter: params => this.valueGetter(params, 'mcCharges'),
                type: 'numericColumn',
                cellClass: 'pw-justify-content-end'
              },

              {
                headerName: '',
                width: 30,
                valueGetter: params => this.valueSymbol(params, 'mcCharges')
              }
            ]
          },

          {
            headerName: this.stoneChargesHeaderTxt,
            children: [
              {
                headerName: '',
                width: 100,
                valueGetter: params => this.valueGetter(params, 'stoneCharges'),
                type: 'numericColumn',
                cellClass: 'pw-justify-content-end'
              },

              {
                headerName: '',
                width: 30,
                valueGetter: params => this.valueSymbol(params, 'stoneCharges')
              }
            ]
          },

          {
            headerName: this.ucpHeaderTxt,
            children: [
              {
                headerName: '',
                width: 100,
                valueGetter: params => this.valueGetter(params, 'ucp'),
                type: 'numericColumn',
                cellClass: 'pw-justify-content-end'
              },

              {
                headerName: '',
                width: 30,
                valueGetter: params => this.valueSymbol(params, 'ucp')
              }
            ]
          },
          {
            headerName: this.valuePerGmHeaderTxt,
            children: [
              {
                headerName: '',
                width: 100,
                valueGetter: params => this.valueGetter(params, 'rsPerGram'),
                type: 'numericColumn',
                cellClass: 'pw-justify-content-end'
              },

              {
                headerName: '',
                width: 30,
                valueGetter: params => this.valueSymbol(params, 'rsPerGram')
              }
            ]
          },
          {
            headerName: 'Status',
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120
          },

          {
            headerName: '',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            pinned: 'right',
            lockPinned: true
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isABOfferApplicable'] ||
      changes['isCOOfferApplicable'] ||
      changes['isPreviewApplicable'] ||
      changes['isRivaApplicable']
    ) {
      this.tabType = 'Regular';
    }
    if (changes['slabConfigsItems']) {
      console.log(this.slabConfigsItems, 'slabConfigsItems');

      if (this.slabConfigsItems.length) this.form?.disable();
      else this.form?.enable();

      this.hasSelectedRow = false;
      this.selectedConfig = null;
    }
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      discountBasedOn: new FormControl(this.slabConfig?.discountBasedOn, [
        this.fieldValidatorsService.requiredField(this.discBasedOnMsg)
      ]),
      discountBasedOnType: new FormControl(
        this.slabConfig?.discountBasedOnType,
        [this.fieldValidatorsService.requiredField(this.discBasedOnTypeMsg)]
      ),
      valuePerWeightType: new FormControl(this.slabConfig?.valuePerWeightType, [
        this.fieldValidatorsService.requiredField(this.valuePerWeightTypeMsg)
      ]),
      isSingle: new FormControl(this.slabConfig?.isSingle)
    });
  }

  ngAfterViewInit(): void {
    this.createForm();
  }

  discountBasedOnChange(value) {
    let discountBasedOnType;
    if (this.slabConfig?.isNew) {
      if (value === DiscountBasedOnEnum.WEIGHT_BASED) {
        discountBasedOnType = DiscountBasedOnTypesEnum.GROSS_WEIGHT;
      } else if (value === DiscountBasedOnEnum.VALUE_BASED) {
        discountBasedOnType = DiscountBasedOnTypesEnum.PRE_DISCOUNT_TAX;
      } else if (value === DiscountBasedOnEnum.CARAT_BASED) {
        discountBasedOnType = DiscountBasedOnTypesEnum.SINGLE_STONE;
      }
      this.form.get('discountBasedOnType').setValue(discountBasedOnType);
      this.discountBasedOnTypeChange(discountBasedOnType);
    }

    this.slabConfig.discountBasedOn = value;

    const headerName = this.getValueHeader();

    this.api.getColumnDef('min').headerName = headerName.minHeaderName;
    this.api.getColumnDef('max').headerName = headerName.maxHeaderName;

    this.api.refreshHeader();
  }

  discountBasedOnTypeChange(value) {
    this.slabConfig.discountBasedOnType = value;
  }

  valuePerWeightTypeChange(value) {
    this.slabConfig.valuePerWeightType = value;
  }

  singleOptionChange(value) {
    this.slabConfig.isSingle = value;
  }

  getValueHeader() {
    const value = this.form.get('discountBasedOn').value;
    let minHeaderName = this.minFieldName;
    let maxHeaderName = this.maxFieldName;
    if (value === DiscountBasedOnEnum.WEIGHT_BASED) {
      minHeaderName = this.minWtFieldName;
      maxHeaderName = this.maxWtFieldName;
    } else if (value === DiscountBasedOnEnum.VALUE_BASED) {
      minHeaderName = this.minValFieldName;
      maxHeaderName = this.maxValFieldName;
    } else if (value === DiscountBasedOnEnum.CARAT_BASED) {
      minHeaderName = this.minCaratFieldName;
      maxHeaderName = this.maxCaratFieldName;
    }

    return {
      minHeaderName,
      maxHeaderName
    };
  }

  getFieldFromTabType() {
    let field;
    if (this.tabType === 'Regular') {
      field = 'regular';
    } else if (this.tabType === 'Preview') {
      field = 'preview';
    }
    if (this.tabType === 'CO') {
      field = 'co';
    }
    if (this.tabType === 'AB') {
      field = 'ab';
    }
    if (this.tabType === 'RIVA') {
      field = 'riva';
    }
    return field;
  }

  valueSymbol(param, field) {
    const isPercent = param.data[this.getFieldFromTabType()][field].isPercent;
    if (isPercent) {
      return '%';
    } else {
      return this.currencySymbolService.get(this.currencyCode);
    }
  }

  valueGetter(param, field) {
    const isPercent = param.data[this.getFieldFromTabType()][field].isPercent;
    let value = param.data[this.getFieldFromTabType()][field].value;

    if (isPercent) {
      return this.percentageFormatterService.format(value, false);
    } else {
      if (value == null || value === '' || isNaN(value)) {
        value = 0;
      }
      return this.currencyFormatterService.format(
        value,
        this.currencyCode,
        false
      );
    }
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  changeTab(newTab) {
    this.tabType = newTab;
    this.api.refreshCells({
      force: true
    });
    this.api.redrawRows();
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data);
    }
  }

  openConfirmDialogForDelete(data: any) {
    if (this.discountWorkflow && this.mainTabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountSlabConfig.deleteConfirmMessageAllTab'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            const updateData = this.getAllRows(null, data.id);

            this.delete.emit({ updateData: updateData, deleteData: [data.id] });
          }
        });
    }
  }

  getAllRows(rowId, data?: string) {
    const rowData = [];
    let index = 1;
    console.log('rowId', rowId);
    if (data) {
      this.api.forEachNode(node => {
        if (node && node.data.id !== data) {
          node.data.rowId = index++;
          rowData.push(node.data);
        }
      });
    } else {
      if (rowId) {
        this.api.forEachNode(node => {
          if (node && index !== rowId) {
            node.data.rowId = index++;
            rowData.push(node.data);
          } else {
            node.data.rowId = ++index;
            rowData.push(node.data);
            index++;
          }
        });
      } else {
        this.api.forEachNode(node => {
          if (node) {
            node.data.rowId = index++;
            rowData.push(node.data);
          }
        });
      }
    }

    return rowData;
  }

  getParticularRow(rowId, totalNoOfRows, mode) {
    const rowData = [];
    console.log('rowId', rowId);
    this.api.forEachNode(node => {
      if (node && node.data.rowId === rowId && node.data.isActive) {
        rowData.push(node.data);
      }
    });
    if (rowData.length) {
      return rowData;
    } else {
      if (rowId >= 1 && rowId <= totalNoOfRows) {
        if (mode === 'next') {
          return this.getParticularRow(rowId + 1, totalNoOfRows, mode);
        } else if (mode === 'prev') {
          return this.getParticularRow(rowId - 1, totalNoOfRows, mode);
        }
      }
    }
  }

  // TODO : need to change context for toggel button component
  getContext() {
    return {
      componentParent: this.component
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    if (this.api.getDisplayedRowCount()) this.form.disable();
    else this.form.enable();
    this.discountBasedOnChange(this.slabConfig?.discountBasedOn);
  }

  openValuePercentagePopup() {
    if (this.discountWorkflow && this.mainTabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.dialog
        .open(DiscountValuePercentagePopupComponent, {
          autoFocus: false,
          width: '1080px',
          disableClose: true,
          data: {
            config: this.selectedConfig,
            currencyCode: this.currencyCode,
            isABOfferApplicable: this.isABOfferApplicable,
            isCOOfferApplicable: this.isCOOfferApplicable,
            isPreviewApplicable: this.isPreviewApplicable,
            isRiva: this.isRivaApplicable
          }
        })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(resultantData => {
          let result = resultantData.resultData;
          if (result) {
            result = { ...this.selectedConfig, ...result };

            const discountComponents = {
              discountComponents: [
                {
                  type: DiscountCompEnum.REGULAR,
                  data: {
                    isUCP: {
                      isPercent: result.regular.ucp.isPercent,
                      value: result.regular.ucp.value
                    },
                    mcCharges: {
                      isPercent: result.regular.mcCharges.isPercent,
                      value: result.regular.mcCharges.value
                    },

                    goldCharges: {
                      isPercent: result.regular.goldCharges.isPercent,
                      value: result.regular.goldCharges.value
                    },
                    stoneCharges: {
                      isPercent: result.regular.stoneCharges.isPercent,
                      value: result.regular.stoneCharges.value
                    },
                    rsPerGram: {
                      isGrossWeight:
                        this.form.value.valuePerWeightType === 'GrossWt'
                          ? true
                          : false,
                      weight: result.regular.rsPerGram.value
                    }
                  }
                },
                {
                  type: DiscountCompEnum.PREVIEW,
                  data: {
                    isUCP: {
                      isPercent: result.preview.ucp.isPercent,
                      value: result.preview.ucp.value
                    },
                    mcCharges: {
                      isPercent: result.preview.mcCharges.isPercent,
                      value: result.preview.mcCharges.value
                    },

                    goldCharges: {
                      isPercent: result.preview.goldCharges.isPercent,
                      value: result.preview.goldCharges.value
                    },
                    stoneCharges: {
                      isPercent: result.preview.stoneCharges.isPercent,
                      value: result.preview.stoneCharges.value
                    },
                    rsPerGram: {
                      isGrossWeight:
                        this.form.value.valuePerWeightType === 'GrossWt'
                          ? true
                          : false,
                      weight: result.preview.rsPerGram.value
                    }
                  }
                },
                {
                  type: DiscountCompEnum.AB,
                  data: {
                    isUCP: {
                      isPercent: result.ab.ucp.isPercent,
                      value: result.ab.ucp.value
                    },
                    mcCharges: {
                      isPercent: result.ab.mcCharges.isPercent,
                      value: result.ab.mcCharges.value
                    },

                    goldCharges: {
                      isPercent: result.ab.goldCharges.isPercent,
                      value: result.ab.goldCharges.value
                    },
                    stoneCharges: {
                      isPercent: result.ab.stoneCharges.isPercent,
                      value: result.ab.stoneCharges.value
                    },
                    rsPerGram: {
                      isGrossWeight:
                        this.form.value.valuePerWeightType === 'GrossWt'
                          ? true
                          : false,
                      weight: result.ab.rsPerGram.value
                    }
                  }
                },
                {
                  type: DiscountCompEnum.CO,
                  data: {
                    isUCP: {
                      isPercent: result.co.ucp.isPercent,
                      value: result.co.ucp.value
                    },
                    mcCharges: {
                      isPercent: result.co.mcCharges.isPercent,
                      value: result.co.mcCharges.value
                    },
                    // wcCharges: {
                    //   isPercent: result.co.wcCharges.isPercent,
                    //   value: result.co.wcCharges.value
                    // },
                    goldCharges: {
                      isPercent: result.co.goldCharges.isPercent,
                      value: result.co.goldCharges.value
                    },
                    stoneCharges: {
                      isPercent: result.co.stoneCharges.isPercent,
                      value: result.co.stoneCharges.value
                    },
                    rsPerGram: {
                      isGrossWeight:
                        this.form.value.valuePerWeightType === 'GrossWt'
                          ? true
                          : false,
                      weight: result.co.rsPerGram.value
                    }
                  }
                },
                {
                  type: 'RIVAAH',
                  data: {
                    isUCP: {
                      isPercent: result.riva.ucp.isPercent,
                      value: result.riva.ucp.value
                    },
                    mcCharges: {
                      isPercent: result.riva.mcCharges.isPercent,
                      value: result.riva.mcCharges.value
                    },
                    // wcCharges: {
                    //   isPercent: result.co.wcCharges.isPercent,
                    //   value: result.co.wcCharges.value
                    // },
                    goldCharges: {
                      isPercent: result.riva.goldCharges.isPercent,
                      value: result.riva.goldCharges.value
                    },
                    stoneCharges: {
                      isPercent: result.riva.stoneCharges.isPercent,
                      value: result.riva.stoneCharges.value
                    },
                    rsPerGram: {
                      isGrossWeight:
                        this.form.value.valuePerWeightType === 'GrossWt'
                          ? true
                          : false,
                      weight: result.riva.rsPerGram.value
                    }
                  }
                }
              ],
              id: result.id,
              isActive: result.isActive
            };

            this.valueUpdate.emit(discountComponents);
          } else {
            if (resultantData.loadDetails) this.getSlabValues.emit();
          }
        });
    }
  }

  openABCOConfigPopup() {
    if (this.discountWorkflow && this.mainTabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const abCoConfig = this.abCoData;
      this.dialog
        .open(AbCoPopupComponent, {
          autoFocus: false,
          disableClose: true,
          width:
            this.isCOOfferApplicable && this.isABOfferApplicable
              ? '720px'
              : '360px',
          data: {
            isABOfferApplicable: this.isABOfferApplicable,
            isCOOfferApplicable: this.isCOOfferApplicable,
            isPreviewApplicable: this.isPreviewApplicable,
            config: abCoConfig
          }
        })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.save.emit(result);
          }
        });
    }
  }

  updateGrid(
    data,
    slab: {
      id: string;
      min: number;
      max: number;
      slabName: string;
    } = null,
    errorType: SlabErrorEnum
  ) {
    if (this.discountWorkflow && this.mainTabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const headerName = this.getValueHeader();
      const minLabel = headerName.minHeaderName;
      const maxLabel = headerName.maxHeaderName;
      console.log('saveSlabDetails', this.selectedConfig, data);

      const minValue = this.selectedConfig?.min;
      const maxValue = this.selectedConfig?.max;
      const rowId = this.selectedConfig?.rowId;
      const totalNoOfRows = this.getAllRows(null).length;

      let tempParticularRowId = 0;
      if (data === 'below') {
        if (totalNoOfRows === 1) {
          tempParticularRowId = 0;
        } else if (totalNoOfRows !== 1 && totalNoOfRows === data.rowId) {
          tempParticularRowId = 0;
        } else {
          tempParticularRowId = rowId + 1;
        }
      } else if (data === 'above') {
        if (totalNoOfRows === 1) {
          tempParticularRowId = 0;
        } else if (totalNoOfRows !== 1 && totalNoOfRows === data.rowId) {
          tempParticularRowId = rowId - 1;
        } else {
          tempParticularRowId = rowId - 1;
        }
      }

      let mode;
      let compareRow;

      if (data === 'above') mode = 'prev';
      else if (data === 'below') mode = 'next';

      compareRow =
        tempParticularRowId !== 0
          ? this.getParticularRow(tempParticularRowId, totalNoOfRows, mode)
          : null;

      this.dialog
        .open(AddSlabPopupComponent, {
          width: '400px',
          disableClose: true,
          autoFocus: false,
          data: {
            ...slab,
            minLabel,
            maxLabel,
            minValue,
            maxValue,
            data,
            compareRow,
            totalNoOfRows,
            rowId,
            errorType
          }
        })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            if (
              this.checkForConflicts(+res.min, +res.max, res.slabName, slab?.id)
            ) {
              let tempRowId = 1;
              if (data === 'below') tempRowId = rowId + 1;
              else if (data === 'above') tempRowId = rowId;

              const updateData = this.getAllRows(tempRowId);

              const newSlab: SlabConfigItem = {
                id: null,
                rowId: tempRowId,
                slabName: res.slabName,
                min: res.min,
                max: res.max,
                discountBasedOn: this.form.value.discountBasedOn,
                isSingle: this.form.value.isSingle,
                discountBasedOnType: this.form.value.discountBasedOnType,
                isActive: true,

                regular: {
                  ucp: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  mcCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },

                  goldCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  stoneCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  rsPerGram: {
                    isPercent: false,
                    value: this.defaultValue
                  }
                },
                preview: {
                  ucp: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  mcCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },

                  goldCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  stoneCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  rsPerGram: {
                    isPercent: false,
                    value: this.defaultValue
                  }
                },
                co: {
                  ucp: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  mcCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },

                  goldCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  stoneCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  rsPerGram: {
                    isPercent: false,
                    value: this.defaultValue
                  }
                },
                ab: {
                  ucp: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  mcCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },

                  goldCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  stoneCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  rsPerGram: {
                    isPercent: false,
                    value: this.defaultValue
                  }
                },
                riva: {
                  ucp: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  mcCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  goldCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  stoneCharges: {
                    isPercent: this.defaultIsPercent,
                    value: this.defaultValue
                  },
                  rsPerGram: {
                    isPercent: false,
                    value: this.defaultValue
                  }
                }
              };

              this.add.emit({ addData: newSlab, updateData: updateData });
            }
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
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (
              event.eventType === OverlayNotificationEventType.CLOSE &&
              this.discountWorkflow
            ) {
              this.enableWorkflowNotification.emit(true);
            }
          });
      });
  }

  checkForConflicts(min: number, max: number, slabName: string, id: string) {
    const rows = [];
    this.api.forEachNode(node => rows.push(node.data));
    for (const row of rows) {
      const rowMin = +row.min;
      const rowMax = +row.max;

      if (row.slabName === slabName && row.isActive) {
        this.showSlabNameError(slabName, {
          min,
          max,
          slabName,
          id
        });
        return false;
      }

      if (
        ((rowMin <= min && min <= rowMax) ||
          (rowMin <= max && max <= rowMax)) &&
        row.isActive
      ) {
        this.showConflictError(
          {
            min: rowMin,
            max: rowMax,
            slabName: row.slabName
          },
          {
            min,
            max,
            slabName,
            id
          }
        );

        return false;
      }
    }

    return true;
  }

  showConflictError(
    conflictValue: { min: number; max: number; slabName: string },
    newValue: {
      min: number;
      max: number;
      slabName: string;
      id: string;
    }
  ) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message:
          this.conflictSlabMsg1 +
          conflictValue.slabName +
          this.conflictSlabMsg2 +
          conflictValue.min +
          this.conflictSlabMsg3 +
          conflictValue.max
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) this.updateGrid(null, newValue, SlabErrorEnum.MIN_MAX);
      });
  }

  showSlabNameError(
    slabName,
    newValue: {
      min: number;
      max: number;
      slabName: string;
      id: string;
    }
  ) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'Slab ' + slabName + ' already exists'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) this.updateGrid(null, newValue, SlabErrorEnum.SLAB_NAME);
      });
  }

  selectionChanged(grid) {
    if (grid.api.getSelectedRows().length) {
      this.hasSelectedRow = true;
      this.selectedConfig = grid.api.getSelectedRows()[0];
    } else {
      this.hasSelectedRow = false;
      this.selectedConfig = null;
    }
  }

  getActiveSlabsCount() {
    let activeRowData = [];
    this.slabConfigsItems.forEach(element => {
      if (element.isActive) activeRowData.push(element);
    });
    return activeRowData.length;
  }

  selectionChange(id, status) {
    console.log(id, status, 'chevk selection change');
    this.activate.emit({ id, status });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
