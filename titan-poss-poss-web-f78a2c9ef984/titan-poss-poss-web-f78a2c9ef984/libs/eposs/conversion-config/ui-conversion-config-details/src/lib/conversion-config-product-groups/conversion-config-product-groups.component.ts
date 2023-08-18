import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductGroups,
  SaveConversionConfigValues
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { takeUntil } from 'rxjs/operators';
import {
  EditItemComponent,
  InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-conversion-config-product-groups',
  templateUrl: './conversion-config-product-groups.component.html',
  styleUrls: ['./conversion-config-product-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversionConfigProductGroupsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() selectedGroups: ProductGroups[];
  @Output() conversionConfigValues = new EventEmitter<any>();
  @Output() locationMapping = new EventEmitter<any>();
  @Input() locationMappingButton: boolean;
  @Input() formGroup: FormGroup;
  @Input() productGridChange: boolean;
  @Input() configDetails;
  api: GridApi;
  isValid = true;
  value: string;
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  defaultColDef = {
    suppressMovable: true
  };
  columnDefs = [];

  setLimitForm: FormGroup;
  destroy$ = new Subject();
  formResponse: {
    addProducts: SaveConversionConfigValues[];
    updateProducts: SaveConversionConfigValues[];
    removeProducts: [];
  };
  rowHeight = 35;
  animateRows = true;
  rowData: ProductGroups[];
  disable = true;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private currencyFormatterService: CurrencyFormatterService,
    private weightFormatterService: WeightFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private translateService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.conversionConfig.productGroupLabel',
        'pw.conversionConfig.productCategoryLabel',
        'pw.conversionConfig.allowedLimitLabel',
        'pw.conversionConfig.aboveWtGmsLabel',
        'pw.conversionConfig.aboveValueLabel',
        'pw.conversionConfig.autoApprovalLabel',
        'pw.conversionConfig.autoApprovalLabel'
      ])
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerName: translatedMsg['pw.conversionConfig.productGroupLabel'],
            field: 'productGroupDescription',
            resizable: true,
            width: 170,
            suppressSizeToFit: true
          },
          {
            headerName:
              translatedMsg['pw.conversionConfig.productCategoryLabel'],
            field: 'productCategoryDescription',
            width: 170,
            resizable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMsg['pw.conversionConfig.allowedLimitLabel'],
            resizable: true,
            isWeight: true,
            width: 170,
            minWidth: 110,
            suppressSizeToFit: true,
            editable: true,
            children: [
              {
                headerName:
                  translatedMsg['pw.conversionConfig.aboveWtGmsLabel'],
                field: 'allowedLimitWeight',
                isWeight: true,
                width: 170,
                minWidth: 110,
                editable: true,
                cellEditor: 'inputValidator',
                cellRendererFramework: EditItemComponent,
                singleClickEdit: true,
                valueFormatter: params => {
                  if (typeof params.value === 'object') {
                    if (params.value.value) {
                      return this.weightFormatterService.format(
                        params.value.value
                      );
                    } else {
                      return ' ';
                    }
                  } else {
                    return this.weightFormatterService.format(params.value);
                  }
                },
                cellClassRules: {
                  'pw-gray-border': params => {
                    return params.value.isValid === true;
                  },
                  'pw-error-border': params => {
                    return (
                      params.value.isValid === false &&
                      params.value.value !== ''
                    );
                  }
                }
              },
              {
                headerName:
                  translatedMsg['pw.conversionConfig.aboveValueLabel'],
                field: 'allowedLimitValue',
                isWeight: true,
                width: 170,
                minWidth: 110,
                editable: true,
                cellEditor: 'inputValidator',
                isAmount: true,
                cellRendererFramework: EditItemComponent,
                singleClickEdit: true,
                valueFormatter: data => {
                  if (typeof data.value === 'object') {
                    if (data.value.value) {
                      return this.currencyFormatterService.format(
                        data.value.value,
                        'INR',
                        false
                      );
                    } else return ' ';
                  } else {
                    return this.currencyFormatterService.format(
                      data.value,
                      'INR',
                      false
                    );
                  }
                },
                cellClassRules: {
                  'pw-gray-border': data => {
                    return data.value.isValid === true;
                  },
                  'pw-error-border': data => {
                    return (
                      data.value.isValid === false && data.value.value !== ''
                    );
                  }
                }
              }
            ]
          },

          {
            headerName: translatedMsg['pw.conversionConfig.autoApprovalLabel'],
            resizable: true,
            isWeight: true,
            width: 170,
            minWidth: 110,
            suppressSizeToFit: true,
            editable: true,
            children: [
              {
                headerName:
                  translatedMsg['pw.conversionConfig.aboveWtGmsLabel'],
                field: 'autoApprovalLimitWeight',
                isWeight: true,
                width: 170,
                minWidth: 110,
                editable: true,
                singleClickEdit: true,
                cellEditor: 'inputValidator',
                cellRendererFramework: EditItemComponent,
                valueFormatter: param => {
                  if (typeof param.value === 'object') {
                    if (param.value.value) {
                      return this.weightFormatterService.format(
                        param.value.value
                      );
                    } else {
                      return ' ';
                    }
                  } else {
                    return this.weightFormatterService.format(param.value);
                  }
                },
                cellClassRules: {
                  'pw-gray-border': param => {
                    return param.value.isValid === true;
                  },
                  'pw-error-border': param => {
                    return (
                      param.value.isValid === false && param.value.value !== ''
                    );
                  }
                }
              },
              {
                headerName:
                  translatedMsg['pw.conversionConfig.aboveValueLabel'],
                field: 'autoApprovalLimitValue',
                width: 170,
                minWidth: 110,
                editable: true,
                isAmount: true,
                singleClickEdit: true,
                cellEditor: 'inputValidator',
                cellRendererFramework: EditItemComponent,
                valueFormatter: rowData => {
                  if (typeof rowData.value === 'object') {
                    if (rowData.value.value) {
                      return this.currencyFormatterService.format(
                        rowData.value.value,
                        'INR',
                        false
                      );
                    } else {
                      return ' ';
                    }
                  } else {
                    return this.currencyFormatterService.format(
                      rowData.value,
                      'INR',
                      false
                    );
                  }
                },
                cellClassRules: {
                  'pw-gray-border': rowData => {
                    return rowData.value.isValid === true;
                  },
                  'pw-error-border': rowData => {
                    return (
                      rowData.value.isValid === false &&
                      rowData.value.value !== ''
                    );
                  }
                }
              }
            ]
          }
        ];
      });
  }

  ngOnInit() {
    this.createForm();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGroups']) {
      this.rowData = [];
      this.createForm();
    }
  }

  createForm() {
    this.setLimitForm = new FormGroup({});
    this.selectedGroups.forEach(productGroups => {
      this.setLimitForm.addControl(
        productGroups.productCategoryCode.concat(
          productGroups.productGroupCode
        ),
        new FormGroup({
          productCategoryCode: new FormControl(
            productGroups.productCategoryCode
          ),
          productGroupCode: new FormControl(productGroups.productGroupCode),
          productCategoryDescription: new FormControl(
            productGroups.productCategoryDescription
          ),
          productGroupDescription: new FormControl(
            productGroups.productGroupDescription
          ),
          allowedLimitWeight: new FormControl(
            productGroups.allowedLimitWeight
              ? productGroups.allowedLimitWeight
              : ''
          ),
          allowedLimitValue: new FormControl(
            productGroups.allowedLimitValue
              ? productGroups.allowedLimitValue
              : ''
          ),
          autoApprovalLimitWeight: new FormControl(
            productGroups.autoApprovalLimitWeight
              ? productGroups.autoApprovalLimitWeight
              : ''
          ),
          autoApprovalLimitValue: new FormControl(
            productGroups.autoApprovalLimitValue
              ? productGroups.autoApprovalLimitValue
              : ''
          ),
          id: new FormControl(productGroups.id ? productGroups.id : '')
        })
      );
    });
  }
  location() {
    this.locationMapping.emit();
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onCellValueChanged(changeEvent) {
    if (
      changeEvent.newValue.value !== '' &&
      changeEvent.newValue.value &&
      changeEvent.newValue.isValid
    ) {
      switch (changeEvent.colDef.field) {
        case 'allowedLimitWeight': {
          this.value = changeEvent.newValue.value;
          this.isValid = changeEvent.newValue.isValid;
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            allowedLimitWeight: changeEvent.value.value
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productCategoryCode: changeEvent.data.productCategoryCode
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productGroupCode: changeEvent.data.productGroupCode
          });
          break;
        }
        case 'allowedLimitValue': {
          this.value = changeEvent.newValue.value;
          this.isValid = changeEvent.newValue.isValid;
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            allowedLimitValue: changeEvent.value.value
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productCategoryCode: changeEvent.data.productCategoryCode
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productGroupCode: changeEvent.data.productGroupCode
          });
          break;
        }
        case 'autoApprovalLimitWeight': {
          this.value = changeEvent.newValue.value;
          this.isValid = changeEvent.newValue.isValid;
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            autoApprovalLimitWeight: changeEvent.value.value
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productCategoryCode: changeEvent.data.productCategoryCode
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productGroupCode: changeEvent.data.productGroupCode
          });
          break;
        }
        case 'autoApprovalLimitValue': {
          this.value = changeEvent.newValue.value;
          this.isValid = changeEvent.newValue.isValid;
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            autoApprovalLimitValue: changeEvent.value.value
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productCategoryCode: changeEvent.data.productCategoryCode
          });
          this.setLimitForm.controls[
            changeEvent.data.productCategoryCode.concat(
              changeEvent.data.productGroupCode
            )
          ].patchValue({
            productGroupCode: changeEvent.data.productGroupCode
          });
          break;
        }
      }
    }
  }

  getContext() {
    return {
      validators: {
        allowedLimitWeight: [],
        allowedLimitValue: [],
        autoApprovalLimitWeight: [],
        autoApprovalLimitValue: []
      }
    };
  }
  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }

  save() {
    this.formResponse = {
      addProducts: [],
      updateProducts: [],
      removeProducts: []
    };
    this.api.stopEditing();
    if (!this.configDetails?.isActive && this.locationMappingButton) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            const addProducts = [];
            const updateProducts = [];
            Object.entries(this.setLimitForm.value).forEach((val: any) => {
              if (val[1].id === '') {
                addProducts.push({
                  productCategoryCode: val[1].productCategoryCode,
                  productGroupCode: val[1].productGroupCode,
                  ruleDetails: {
                    data: {
                      allowedLimitValue: val[1].allowedLimitValue
                        ? val[1].allowedLimitValue
                        : null,
                      allowedLimitWeight: val[1].allowedLimitWeight
                        ? val[1].allowedLimitWeight
                        : null,
                      autoApprovalLimitValue: val[1].autoApprovalLimitValue
                        ? val[1].autoApprovalLimitValue
                        : null,
                      autoApprovalLimitWeight: val[1].autoApprovalLimitWeight
                        ? val[1].autoApprovalLimitWeight
                        : null
                    },
                    type: 'CONVERSIONS'
                  }
                });
              } else {
                updateProducts.push({
                  id: val[1].id,
                  productCategoryCode: val[1].productCategoryCode,
                  productGroupCode: val[1].productGroupCode,
                  ruleDetails: {
                    data: {
                      allowedLimitValue: val[1].allowedLimitValue
                        ? val[1].allowedLimitValue
                        : null,
                      allowedLimitWeight: val[1].allowedLimitWeight
                        ? val[1].allowedLimitWeight
                        : null,
                      autoApprovalLimitValue: val[1].autoApprovalLimitValue
                        ? val[1].autoApprovalLimitValue
                        : null,
                      autoApprovalLimitWeight: val[1].autoApprovalLimitWeight
                        ? val[1].autoApprovalLimitWeight
                        : null
                    },
                    type: 'CONVERSIONS'
                  }
                });
              }
            });
            this.conversionConfigValues.emit({
              addProducts: addProducts,
              updateProducts: updateProducts,
              removeProducts: []
            });
          }
        });
    }
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  showMessage(key: string) {
    this.translateService
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

  onCellEditingStarted(event) {
    this.mapTopPanelValue(event);
  }
  onCellFocused(event) {
    this.mapTopPanelValue(event);
  }
  mapTopPanelValue(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    var data = this.api.getValue(this.currentRowField, node);
    this.currentRowInfo = typeof data === 'object' && data ? data.value : data;
  }
  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
