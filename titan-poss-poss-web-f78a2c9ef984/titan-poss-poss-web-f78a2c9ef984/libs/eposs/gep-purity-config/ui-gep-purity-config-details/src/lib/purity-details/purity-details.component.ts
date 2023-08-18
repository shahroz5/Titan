import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges,
  OnDestroy, OnInit, Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  DatePickerComponent,
  DeleteRowComponent, InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction, AlertPopupTypeEnum, Lov, MetalType, MetalTypeEnum,
  OverlayNotificationServiceAbstraction, OverlayNotificationType, PurityDetailsResponse
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-purity-details',
  templateUrl: './purity-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurityDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metalTypes: Observable<MetalType[]>;
  @Input() itemTypes: Observable<Lov[]>;
  @Input() purityDetails: PurityDetailsResponse[];
  @Input() isParentFormValid: boolean;
  @Output() savePurityDetails = new EventEmitter<any>();
  @Output() emitLocationMapping = new EventEmitter<boolean>();
  @Output() deletePurityDetails = new EventEmitter<string>();
  @Output() emitRangeType = new EventEmitter<string>();
  @Input() isLocationMapping: boolean;
  @Input() goldRanges: Observable<Range[]>;
  @Input() silverRanges: Observable<Range[]>;
  @Input() platinumRanges: Observable<Range[]>;
  @Input() dateFormat: string;
  defaultColDef = {
    suppressMovable: true
  };
  @Input() configId: string;
  @Input() selectedLocations;
  @Input() formGroup: FormGroup;
  @Output() openLocationMapping = new EventEmitter<boolean>();

  isValid = true;
  purityFormGroup: FormGroup;
  rowHeight = 35;
  animateRows = true;
  rowData = [];
  objCategoryMappings = {};
  domLayout = 'autoHeight';
  editable = false;
  columnDefs = [];
  currentDate = moment();
  destroy$: Subject<null> = new Subject<null>();
  translatedMessages: [];
  api: GridApi;
  isAdd = true;
  errorDialogReference;
  addRowData = false;
  valueEmpty: boolean;
  selectedRowIndex: number;
  startDateGreaterThanEndDate: boolean;
  isNumber: boolean;
  rangeEmpty = false;
  duplicates: boolean;
  scheme: boolean;
  isDates: boolean;
  component: any = this;
  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private transalte: TranslateService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.transalte
      .get([
        'pw.gePurityConfiguration.addLabel',
        'pw.gePurityConfiguration.metalTypeLabel',
        'pw.gePurityConfiguration.itemTypeLabel',
        'pw.gePurityConfiguration.rangeLabel',
        'pw.gePurityConfiguration.deductionPercentage',
        'pw.gePurityConfiguration.schemeLabel',
        'pw.gePurityConfiguration.schemeStartDateLabel',
        'pw.gePurityConfiguration.schemeEndDateLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.translatedMessages = translatedMessages;
        this.columnDefinitions(this.translatedMessages);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['metalTypes'] ||
      changes['itemTypes'] ||
      changes['purityDetails'] ||
      changes['goldRanges'] ||
      changes['silverRanges'] ||
      changes['platinumRanges']
    ) {
      if (this.metalTypes || this.purityDetails || this.itemTypes) {
        this.rowData = [];
        let rowId = 1;
        if (
          this.purityDetails &&
          this.purityDetails.length > 0 &&
          this.purityDetails !== undefined
        ) {
          for (const details of this.purityDetails) {
            let ranges;
            if (details.metalType === MetalTypeEnum.GOLD) {
              ranges = this.goldRanges;
            } else if (details.metalType === MetalTypeEnum.SILVER) {
              ranges = this.silverRanges;
            } else if (details.metalType === MetalTypeEnum.PLATINUM) {
              ranges = this.platinumRanges;
            }
            this.rowData.push({
              metalTypes: this.metalTypes,
              itemTypes: this.itemTypes,
              metalType: details ? details.metalType : '',
              itemType: details ? details.itemType : '',
              ranges: ranges,
              range: details ? details.rangeId : '',
              deduction: details ? details.deductionPercent : '',
              scheme:
                details && details.schemePercent !== null ? details.schemePercent : '',
              startDate: details && details.startDate ? details.startDate : '',
              endDate: details && details.endDate ? details.endDate : '',
              id: details ? details.id : '',
              rowId: rowId++
            });
            this.createForm();
          }
        } else {
          this.rowData.push({
            metalTypes: this.metalTypes,
            itemTypes: this.itemTypes,
            metalType: MetalTypeEnum.GOLD,
            itemType: 'JEWELLERY',
            range: '',
            deduction: '',
            scheme: '',
            startDate: '',
            endDate: '',
            id: '',
            ranges: this.goldRanges,
            rowId: rowId++
          });
          this.createForm();
        }

        if (this.purityDetails) {
          this.editable = true;
          this.columnDefinitions(this.translatedMessages);
        }
      }
    }
  }

  ngOnInit() {
    this.createForm();
  }
  columnDefinitions(translatedMessages: any) {
    this.columnDefs = [
      {
        headerName:
          translatedMessages['pw.gePurityConfiguration.metalTypeLabel'],
        field: 'metalType',
        cellEditorSelector: params => {
          this.objCategoryMappings = {};
          params.data.metalTypes.forEach(element => {
            if(element.materialTypeCode === MetalTypeEnum.GOLD ||
              element.materialTypeCode === MetalTypeEnum.PLATINUM ||
              element.materialTypeCode === MetalTypeEnum.SILVER
            ) {
              this.objCategoryMappings[
                `${element.materialTypeCode}`
              ] = `${element.description}`;
            }
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objCategoryMappings)
            }
          };
        },
        valueFormatter: params => {
          if (params?.data !== null && params?.data !== undefined) {
            if (params.data?.metalType !== '') {
              const obj = params.data?.metalTypes.filter(
                metalTypes => metalTypes.materialTypeCode === params.value
              );
              return obj[0]?.description;
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        flex: 1,
        resizable: true
      },
      {
        headerName:
          translatedMessages['pw.gePurityConfiguration.itemTypeLabel'],
        field: 'itemType',
        cellEditorSelector: params => {
          this.objCategoryMappings = {};
          params.data.itemTypes.forEach(element => {
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
          if (params?.data !== null && params?.data !== undefined) {
            if (params.data?.itemType !== '') {
              const obj = params.data?.itemTypes.filter(
                itemTypes => itemTypes.code === params.value
              );
              return obj.length > 0 ? obj[0]?.value : '';
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        flex: 1,
        resizable: true
      },
      {
        headerName: translatedMessages['pw.gePurityConfiguration.rangeLabel'],
        field: 'range',
        cellEditorSelector: params => {
          this.objCategoryMappings = {};
          params.data.ranges?.forEach(element => {
            this.objCategoryMappings[`${element.id}`] = `${element.range}`;
          });
          return {
            component: 'agSelectCellEditor',
            params: {
              values: this.extractValues(this.objCategoryMappings)
            }
          };
        },
        valueFormatter: params => {
          if (params.data !== null && params?.data !== undefined) {
            if (params.data?.range !== '') {
              const obj = params.data?.ranges?.filter(
                range => range.id === params.value
              );
              return obj.length > 0 ? obj[0]?.range : '';
            }
          } else {
            return this.lookupValue(this.objCategoryMappings, params.value);
          }
        },
        editable: true,
        singleClickEdit: true,
        flex: 1,
        resizable: true
      },
      {
        headerName:
          translatedMessages['pw.gePurityConfiguration.deductionPercentage'],
        field: 'deduction',
        resizable: true,
        flex: 1,
        editable: true,
        cellEditor: 'inputValidator',
        cellClass: 'pw-form-input-width',
        suppressSizeToFit: true,
        singleClickEdit: true,
        valueFormatter: param => {
          if (typeof param.value === 'object') {
            if (param.value.value) {
              return param.value.value;
            } else {
              return '';
            }
          } else {
            return param.value;
          }
        },
        cellClassRules: {
          'pw-gray-border': param => {
            return param.value.isValid === true;
          },
          'pw-error-border': param => {
            return param.value.isValid === false && param.value.value !== '';
          }
        }
      },
      {
        headerName: translatedMessages['pw.gePurityConfiguration.schemeLabel'],
        field: 'scheme',
        cellClass: 'pw-form-input-width',
        resizable: true,
        flex: 1,
        editable: true,
        suppressSizeToFit: true,
        singleClickEdit: true,
        cellEditor: 'inputValidator',
        valueFormatter: params => {
          if (typeof params.value === 'object') {
            if (params.value.value) {
              return params.value.value;
            } else {
              return '';
            }
          } else {
            return params.value;
          }
        },
        cellClassRules: {
          'pw-gray-border': params => {
            return params.value.isValid === true;
          },
          'pw-error-border': params => {
            return params.value.isValid === false && params.value.value !== '';
          }
        }
      },
      {
        headerName:
          translatedMessages['pw.gePurityConfiguration.schemeStartDateLabel'],
        field: 'startDate',
        resizable: true,
        flex: 1,
        suppressSizeToFit: true,
        cellEditor: 'datePicker',
        singleClickEdit: true,
        editable: true,
        cellClass: 'pw-form-input-width',
        valueFormatter: params => {
          if (params.value) {
            if (typeof params.value === 'object') {
              if (params.value.value) {
                return moment(params.value.value).format(this.dateFormat);
              } else {
                return '';
              }
            } else {
              return moment(params.value).format(this.dateFormat);
            }
          } else return '';
        }
      },
      {
        headerName:
          translatedMessages['pw.gePurityConfiguration.schemeEndDateLabel'],
        field: 'endDate',
        editable: true,
        resizable: true,
        flex: 1,
        suppressSizeToFit: true,
        cellEditor: 'datePicker',
        singleClickEdit: true,
        cellClass: 'pw-form-input-width',
        valueFormatter: params => {
          if (params.value) {
            if (typeof params.value === 'object') {
              if (params.value.value) {
                return moment(params.value.value).format(this.dateFormat);
              } else {
                return '';
              }
            } else {
              return moment(params.value).format(this.dateFormat);
            }
          } else return '';
        }
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
  }

  openConfirmDialogForDelete(data: any) {
    if (!this.formGroup.get('isActive').value) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            if (data?.id !== '') {
              this.deletePurityDetails.emit(data.id);
            } else {
              this.api.stopEditing();
              const selectedRow = this.api.getFocusedCell();
              const node = this.api.getRowNode(selectedRow.rowIndex.toString());
              this.api.applyTransaction({ remove: [node.data] });
              this.api.redrawRows();
              let purityDetailsData = [];
              if (this.getAllRows().length > 0) {
                purityDetailsData = this.getAllRows().map(obj => ({
                  ...obj,
                  deduction:
                    typeof obj.deduction === 'object'
                      ? obj.deduction.value
                      : obj.deduction,
                  endDate:
                    typeof obj.endDate === 'object'
                      ? moment(obj.endDate.value).endOf('day').valueOf()
                      : moment(obj.endDate).endOf('day').valueOf(),
                  itemType:
                    typeof obj.itemType === 'object'
                      ? obj.itemType.value
                      : obj.itemType,
                  itemTypes: this.itemTypes,
                  metalType:
                    typeof obj.metalType === 'object'
                      ? obj.metalType.value
                      : obj.metalType,
                  metalTypes: this.metalTypes,
                  range:
                    typeof obj.range === 'object' ? obj.range.value : obj.range,
                  scheme:
                    typeof obj.scheme === 'object'
                      ? obj.scheme.value
                      : obj.scheme,
                  startDate:
                    typeof obj.startDate === 'object'
                      ? moment(obj.startDate.value).startOf('day').valueOf()
                      : moment(obj.startDate).startOf('day').valueOf()
                }));
              } else {
                purityDetailsData.splice(this.selectedRowIndex + 1, 0, {
                  deduction: '',
                  endDate: '',
                  itemType: 'JEWELLERY',
                  itemTypes: this.itemTypes,
                  metalTypes: this.metalTypes,
                  ranges: this.goldRanges,
                  range: '',
                  scheme: '',
                  startDate: '',
                  metalType: MetalTypeEnum.GOLD,
                  id: ''
                });
              }
              this.api.setRowData(purityDetailsData);
              this.isAdd = true;
            }
          }
        });
    }
  }

  extractValues(mappings) {
    return Object.keys(mappings);
  }
  addRow() {
    this.api.stopEditing();
    this.addRowData = true;
    this.checkValidation(this.getAllRows());
  }
  getAllRows() {
    const rowData = [];
    this.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  checkValidation(rowData) {
    this.selectedRowIndex = this.getAllRows().length;

    for (const currentRowData of this.getAllRows()) {
      if (typeof currentRowData?.range === 'object') {
        const range = currentRowData?.ranges.filter(
          obj => obj.id === currentRowData?.range.value
        );
        if (range.length === 0) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }
      } else {
        const range = currentRowData?.ranges.filter(
          obj => obj.id === currentRowData?.range
        );
        if (range.length === 0) {
          this.valueEmpty = true;
          break;
        } else {
          this.valueEmpty = false;
        }
      }
      if (
        (typeof currentRowData?.deduction === 'object'
          ? currentRowData?.deduction.value === ''
          : currentRowData?.deduction === '') ||
        (typeof currentRowData?.itemType === 'object'
          ? currentRowData?.itemType.value === ''
          : currentRowData?.itemType === '') ||
        (typeof currentRowData?.metalType === 'object'
          ? currentRowData?.metalType.value === ''
          : currentRowData?.metalType === '')
      ) {
        this.valueEmpty = true;
        break;
      } else {
        this.valueEmpty = false;
      }
    }
    if (!this.valueEmpty) {
      for (const currentRowData of this.getAllRows()) {
        const deductionPattern = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/;
        const schemePattern = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,3})?$)/;
        if (
          typeof currentRowData.deduction === 'object'
            ? deductionPattern.test(currentRowData?.deduction?.value)
            : deductionPattern.test(currentRowData?.deduction)
        ) {
          this.isNumber = true;
        } else {
          this.isNumber = false;
          break;
        }
        if (
          typeof currentRowData.scheme === 'object'
            ? schemePattern.test(currentRowData?.scheme?.value) ||
              currentRowData?.scheme?.value === ''
            : schemePattern.test(currentRowData?.scheme) ||
              currentRowData?.scheme === ''
        ) {
          this.isNumber = true;
        } else {
          this.isNumber = false;
          break;
        }
      }
    }
    if (!this.valueEmpty && this.isNumber) {
      for (const currentRowData of this.getAllRows()) {
        if (
          (typeof currentRowData.scheme === 'object'
            ? currentRowData?.scheme?.value !== ''
            : currentRowData?.scheme !== '') &&
          ((typeof currentRowData.startDate === 'object'
            ? currentRowData?.startDate?.value === ''
            : currentRowData?.startDate === '') ||
            (typeof currentRowData.endDate === 'object'
              ? currentRowData?.endDate?.value === ''
              : currentRowData?.endDate === ''))
        ) {
          this.isDates = true;
        } else {
          this.isDates = false;
        }
        if (
          ((typeof currentRowData.startDate === 'object'
            ? currentRowData?.startDate?.value !== ''
            : currentRowData?.startDate !== '') ||
            (typeof currentRowData.endDate === 'object'
              ? currentRowData?.endDate?.value !== ''
              : currentRowData?.endDate !== '')) &&
          (typeof currentRowData.scheme === 'object'
            ? currentRowData?.scheme?.value === ''
            : currentRowData?.scheme === '')
        ) {
          this.scheme = true;
        } else {
          this.scheme = false;
        }
        if (this.scheme || this.isDates) {
          break;
        }
      }
    }
    if (
      !this.valueEmpty &&
      this.isNumber &&
      !this.scheme === true &&
      !this.isDates === true
    ) {
      for (const currentRowData of this.getAllRows()) {
        if (
          Number(
            typeof currentRowData?.startDate === 'object'
              ? currentRowData?.startDate.value
              : currentRowData?.startDate
          ) >
          Number(
            typeof currentRowData?.endDate === 'object'
              ? currentRowData?.endDate.value
              : currentRowData?.endDate
          )
        ) {
          this.startDateGreaterThanEndDate = true;
          break;
        } else {
          this.startDateGreaterThanEndDate = false;
        }
      }
    }
    if (
      !this.valueEmpty &&
      this.isNumber &&
      !this.startDateGreaterThanEndDate &&
      !this.scheme === true &&
      !this.isDates === true
    ) {
      for (const obj of this.getAllRows()) {
        for (const res of this.getAllRows()) {
          if (
            res.metalType === obj.metalType &&
            res.itemType === obj.itemType &&
            res.range === obj.range &&
            res.rowId !== obj.rowId
          ) {
            this.duplicates = true;
            break;
          } else {
            this.duplicates = false;
          }
        }

        if (this.duplicates) {
          break;
        }
      }
    }
    if (this.valueEmpty) {
      this.showAlertNotification(
        'Please provide Metal Type , Item Type, Range and Deduction Percentage details.'
      );
    } else if (!this.isNumber) {
      this.showAlertNotification('Please Enter Valid Data');
    } else if (this.startDateGreaterThanEndDate) {
      this.showAlertNotification('End date should be greater than start date');
    } else if (this.duplicates) {
      this.showAlertNotification('MetalType,ItemType,Range should be unique');
    } else if (this.scheme) {
      this.showAlertNotification('Scheme is Mandatory');
    } else if (this.isDates) {
      this.showAlertNotification('StartDate and EndDates are Mandatory');
    }
    if (
      !this.valueEmpty &&
      !this.startDateGreaterThanEndDate &&
      !this.duplicates === true &&
      !this.scheme &&
      !this.isDates === true
    ) {
      this.addData();
    }
  }
  showAlertNotification(message) {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.valueEmpty = null;
          this.startDateGreaterThanEndDate = null;
          this.isNumber = null;
          this.duplicates = null;
          this.scheme = null;
          this.isDates = null;
        }
      });
  }
  addData() {
    if (
      this.addRowData === true &&
      !this.valueEmpty &&
      !this.startDateGreaterThanEndDate &&
      this.isNumber &&
      !this.duplicates === true
    ) {
      const gridData = this.getAllRows();
      this.editable = false;
      this.columnDefinitions(this.translatedMessages);
      gridData.splice(this.selectedRowIndex + 1, 0, {
        deduction: '',
        endDate: '',
        itemType: 'JEWELLERY',
        itemTypes: this.itemTypes,
        metalTypes: this.metalTypes,
        range: '',
        scheme: '',
        startDate: '',
        metalType: MetalTypeEnum.GOLD,
        id: '',
        ranges: this.goldRanges
      });
      this.api.setRowData(gridData);
      this.addRowData = false;
    }
  }
  getContext() {
    return {
      componentParent: this.component,
      validators: {
        deduction: [
          this.fieldValidatorsService.requiredField('Deduction'),
          this.fieldValidatorsService.percentageField('Deduction')
        ],
        scheme: [this.fieldValidatorsService.percentageField('Scheme')],
        startDate: [],
        endDate: []
      }
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;

  }
  lookupValue(mappings, key) {
    return mappings[key];
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      datePicker: DatePickerComponent,
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
    this.api.sizeColumnsToFit();
  }
  createForm() {
    this.purityFormGroup = new FormGroup({});
    this.rowData.forEach(purityDetails => {
      this.purityFormGroup.addControl(
        purityDetails.id,
        new FormGroup({
          metalType: new FormControl(
            '',

            [this.fieldValidatorsService.requiredField('metalType')]
          ),
          itemType: new FormControl(
            '',

            [this.fieldValidatorsService.requiredField('itemType')]
          ),
          range: new FormControl(purityDetails ? purityDetails.range : '', [
            this.fieldValidatorsService.requiredField('range')
          ]),
          deduction: new FormControl(
            '',
            //purityDetails ? purityDetails.deductionPercent : '',
            [this.fieldValidatorsService.requiredField('deduction')]
          ),
          scheme: new FormControl(
            '',
            //purityDetails ? purityDetails.schemePercent : '',
            [this.fieldValidatorsService.requiredField('scheme')]
          ),
          startDate: new FormControl(
            //purityDetails ? purityDetails.startDate : '',
            '',
            [this.fieldValidatorsService.requiredField('startDate')]
          ),
          endDate: new FormControl('', [
            this.fieldValidatorsService.requiredField('endDate')
          ]),
          rowId: new FormControl(purityDetails.rowId)
        })
      );
    });
  }
  /**
   * Unique identifier for each row
   * @param data : data of each row
   */
  getRowNodeId(data: any) {
    return data.rowKey;
  }
  onCellValueChanged(changeEvent) {
    if (changeEvent.colDef.field === 'metalType') {
      switch (changeEvent.data.metalType) {
        case MetalTypeEnum.GOLD: {
          const obj = {
            metalTypes: this.metalTypes,
            itemTypes: this.itemTypes,
            ranges: this.goldRanges,
            metalType: changeEvent.data.metalType,
            itemType: changeEvent.data.itemType,
            range: changeEvent.data.range,
            deduction: changeEvent.data.deduction,
            scheme: changeEvent.data.scheme,
            startDate: changeEvent.data.startDate,
            endDate: changeEvent.data.endDate,
            id: changeEvent.data.id,
            rowId: changeEvent.data.rowId
          };
          const rowNode = this.api.getRowNode(changeEvent.node.rowIndex);
          rowNode.setData(obj);

          break;
        }
        case MetalTypeEnum.SILVER: {
          const obj = {
            metalTypes: this.metalTypes,
            itemTypes: this.itemTypes,
            ranges: this.silverRanges,
            metalType: changeEvent.data.metalType,
            itemType: changeEvent.data.itemType,
            range: changeEvent.data.range,
            deduction: changeEvent.data.deduction,
            scheme: changeEvent.data.scheme,
            startDate: changeEvent.data.startDate,
            endDate: changeEvent.data.endDate,
            id: changeEvent.data.id,
            rowId: changeEvent.data.rowId
          };
          const rowNode = this.api.getRowNode(changeEvent.node.rowIndex);
          rowNode.setData(obj);
          break;
        }
        case MetalTypeEnum.PLATINUM: {
          const obj = {
            metalTypes: this.metalTypes,
            itemTypes: this.itemTypes,
            ranges: this.platinumRanges,
            metalType: changeEvent.data.metalType,
            itemType: changeEvent.data.itemType,
            range: changeEvent.data.range,
            deduction: changeEvent.data.deduction,
            scheme: changeEvent.data.scheme,
            startDate: changeEvent.data.startDate,
            endDate: changeEvent.data.endDate,
            id: changeEvent.data.id,
            rowId: changeEvent.data.rowId
          };
          const rowNode = this.api.getRowNode(changeEvent.node.rowIndex);
          rowNode.setData(obj);
          break;
        }
      }
    }
    if (changeEvent.value !== undefined) {
      if (
        changeEvent.value?.value !== '' &&
        changeEvent.value?.value !== null
      ) {
        if (changeEvent.data.id !== '') {

          this.purityFormGroup.controls[changeEvent.data.id].patchValue({
            rowId: changeEvent.node.rowIndex + 1
          });
          switch (changeEvent.colDef.field) {
            case 'metalType': {
              this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                metalType: changeEvent.data.metalType
              });
              break;
            }
            case 'itemType': {
              this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                itemType: changeEvent.data.itemType
              });
              this.editable = true;
              this.columnDefinitions(this.translatedMessages);
              break;
            }
            case 'range': {
              this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                range: changeEvent.data.range
              });
              break;
            }
            case 'deduction': {
              if (
                changeEvent.newValue.value !== '' &&
                changeEvent.newValue.value
              ) {
                this.isValid = changeEvent.newValue.isValid;
                this.isAdd = changeEvent.value?.isValid;
                this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                  deduction: changeEvent.value.value
                });
              }
              break;
            }
            case 'scheme': {
              if (changeEvent.newValue.value) {
                this.isValid = changeEvent.newValue.isValid;
                this.isAdd = changeEvent.value?.isValid;

                this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                  scheme: changeEvent.value.value
                });
              }
              break;
            }
            case 'startDate': {
              this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                startDate: moment(changeEvent.value.value)
              });

              break;
            }
            case 'endDate': {
              this.purityFormGroup.controls[changeEvent.data.id].patchValue({
                endDate: moment(changeEvent.value.value)
              });

              break;
            }
          }
        } else {
          switch (changeEvent.colDef.field) {
            case 'itemType': {
              this.isValid = changeEvent.value.isValid;

              break;
            }
          }
        }
      }
    }
  }
  save() {
    this.api.stopEditing();
    this.addRowData = false;
    if (this.getAllRows().length > 0) this.checkValidation(this.getAllRows());
    if (
      !this.valueEmpty &&
      !this.startDateGreaterThanEndDate &&
      this.isNumber &&
      !this.duplicates === true &&
      !this.scheme === true &&
      !this.isDates === true
    ) {
      if (!this.formGroup.get('isActive').value && this.isLocationMapping) {
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
              const payload = this.prepareResponse();
              this.savePurityDetails.emit(payload);
            }
          });
      }
    }
  }
  showMessage(key: string) {
    this.transalte
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
  prepareResponse() {
    const addPurityDetails = [];
    const updatePurityDetails = [];
    Object.entries(this.purityFormGroup.value).forEach((val: any) => {
      if (val[0] !== '') {
        updatePurityDetails.push({
          id: val[0],
          deductionPercent: val[1].deduction !== '' ? val[1].deduction : null,
          endDate:
            val[1].endDate !== ''
              ? moment(val[1].endDate).startOf('day').valueOf()
              : null,
          itemType: val[1].itemType !== '' ? val[1].itemType : null,
          metalType: val[1].metalType !== '' ? val[1].metalType : null,
          rangeId: val[1].range,
          schemePercent: val[1].scheme !== '' ? val[1].scheme : null,
          startDate:
            val[1].startDate !== ''
              ? moment(val[1].startDate).startOf('day').valueOf()
              : null,
          rowId: val[1].rowId
        });
      }
    });
    let rowId = this.purityDetails?.length;
    for (const purity of this.getAllRows()) {
      if (purity.id === '') {
        addPurityDetails.push({
          deductionPercent:
            typeof purity.deduction === 'object'
              ? purity.deduction.value
              : purity.deduction,
          endDate:
            typeof purity.endDate === 'object'
              ? moment(purity.endDate.value).startOf('day').valueOf()
              : moment(purity.endDate).startOf('day').valueOf(),
          itemType:
            typeof purity.itemType === 'object'
              ? purity.itemType.value
              : purity.itemType,
          metalType:
            typeof purity.metalType === 'object'
              ? purity.metalType.value
              : purity.metalType,
          rangeId:
            typeof purity.range === 'object'
              ? purity.range.value
              : purity.range,
          schemePercent:
            typeof purity.scheme === 'object'
              ? purity.scheme.value
              : purity.scheme,
          startDate:
            typeof purity.startDate === 'object'
              ? moment(purity.startDate.value).startOf('day').valueOf()
              : moment(purity.startDate).startOf('day').valueOf(),
          rowId: ++rowId
        });
      }
    }
    const payload = {
      addConfigDetails: addPurityDetails,
      removeConfigDetails: [],
      updateConfigDetails: updatePurityDetails
    };
    return payload;
  }
  locationMapping() {
    this.emitLocationMapping.emit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
