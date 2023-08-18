import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  EditItemComponent,
  InputValidatorComponent,
  CheckboxGridCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  ReportRoleSetting,
  ReportName,
  SaveReportRolePayload,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { FormGroup, FormControl } from '@angular/forms';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-report-role-mapping-items',
  templateUrl: './report-role-mapping-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportRoleMappingItemsComponent implements OnInit, OnChanges {
  @Input() selectedSetting: ReportRoleSetting[];
  @Input() reportName: ReportName[];
  @Output() saveResponse = new EventEmitter<SaveReportRolePayload>();
  @Input() permissions$: Observable<any[]>;

  gridApi: GridApi;
  rowData: {
    reportName: string;
    formGroup: FormGroup;
    fromTime: string;
    toTime: string;
    id: string;
    reportId: string;
  }[];
  fromTime: string;
  toTime: string;
  regenerationTime: string;
  availabilityDays: string;
  fromAccessTime: number;
  fromTimeEmpty = false;
  toTimeEmpty = false;
  toTimeLessThanFromTime = false;

  hasError: boolean;
  errorMessageForFromTime: any;
  errorMessageForToTime: any;

  errorMessageForNull: string;
  errorMessageForTimeFormat: string;
  errorMessageFortoTimeLessThanFromTime: string;
  rowIndex = 0;
  errorIndex = 0;
  invalidError: boolean;
  timeFormatError: boolean;
  emptyValueError: boolean;
  allowedTime: string;
  hasPermission = false;

  REPORT_ROLE_MAPPING_EDIT = 'Report Role Mapping - Edit';
  REPORT_ROLE_MAPPING_VIEW = 'Report Role Mapping - View';

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private fieldValidatorService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private elementPermission: ElementPermissionService,
    private permissionService: PermissionService,
  ) {}
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  destroy$ = new Subject();
  columnDefs = [];
  reportRoleMappingItemsComponent: ReportRoleMappingItemsComponent = this;
  ngOnInit(): void {
    this.createColumn();
  }
  createColumn() {
    this.translate
      .get(
        [
          'pw.reports.reportNameLabel',
          'pw.reports.selectToGrantAccess',
          'pw.reports.fromTime',
          'pw.reports.toTime',
          'pw.reports.errorMessageForNull',
          'pw.reports.errorMessageForTimeFormat',
          'pw.reports.errorMessageFortoTimeLessThanFromTime',
          'pw.reports.allowedTime'
        ],
        {
          fromTime: this.fromTime,
          toTime: this.toTime
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.errorMessageForNull =
          translatedMessages['pw.reports.errorMessageForNull'];
        this.errorMessageForTimeFormat =
          translatedMessages['pw.reports.errorMessageForTimeFormat'];
        this.errorMessageFortoTimeLessThanFromTime =
          translatedMessages[
            'pw.reports.errorMessageFortoTimeLessThanFromTime'
          ];
        this.allowedTime = translatedMessages['pw.reports.allowedTime'];
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.reports.reportNameLabel'],
            field: 'reportName',
            minWidth: 80,
            flex: 1,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.reports.selectToGrantAccess'],
            field: 'selectToGrantAccess',
            cellRendererFramework: CheckboxGridCellComponent,
            minWidth: 80,
            flex: 1,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.reports.fromTime'],
            field: 'fromTime',
            suppressMovable: true,
            flex: 1,
            editable: params => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              ) {
                return true;
              } else {
                return false;
              }
            },
            cellEditor: 'inputValidator',
            cellRendererSelector: params => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              )
                return {
                  component: 'editItemComponent'
                };
              else {
                return null;
              }
            },
            valueFormatter: (params: any) => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              ) {
                if (typeof params.value === 'object') {
                  if (params.value.value) {
                    return params.value.value;
                  } else {
                    return ' ';
                  }
                } else {
                  return params.value;
                }
              } else {
                return ' ';
              }
            },
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid === true) {
                  this.invalidError = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.invalidError = true;
                }
                return params.value.isValid === false;
              }
            },
            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.reports.toTime'],
            field: 'toTime',

            editable: params => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              ) {
                return true;
              } else {
                return false;
              }
            },
            cellEditor: 'inputValidator',
            valueFormatter: (params: any) => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              ) {
                if (typeof params.value === 'object') {
                  if (params.value.value) {
                    return params.value.value;
                  } else {
                    return ' ';
                  }
                } else {
                  return params.value;
                }
              } else {
                return ' ';
              }
            },
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid === true) {
                  this.invalidError = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.invalidError = true;
                }
                return params.value.isValid === false;
              }
            },
            cellRendererSelector: params => {
              if (
                params.data.formGroup.get('selectToGrantAccess')?.value === true
              )
                return {
                  component: 'editItemComponent'
                };
              else {
                return null;
              }
            },
            flex: 1,
            minWidth: 80,
            suppressMovable: true
          }
        ];
      });
  }
  getContext(isDisable: boolean) {
    return {
      componentParent: this.reportRoleMappingItemsComponent,
      disableCheckBox: isDisable,
      disableCell: isDisable,
      validators: {
        fromTime: [
          this.fieldValidatorService.requiredField(this.fromTime),
          this.fieldValidatorService.timeField(this.fromTime)
        ],
        toTime: [
          this.fieldValidatorService.requiredField(this.toTime),
          this.fieldValidatorService.timeField(this.toTime)
        ]
      },
      focusOn: 'fromTime'
    };
  }
  rowValueChanged(event) {
    this.gridApi.stopEditing();
    this.checkValidation(this.getAllRows());
  }
  getAllRows() {
    const rowData = [];

    this.gridApi.forEachNode(node => rowData.push(node.data));

    return rowData;
  }

  selectionChange(checked, rowkey, field) {
    this.gridApi.redrawRows();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.prepareRowData();
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemComponent: EditItemComponent
    };
  }
  prepareRowData() {
    this.rowData = [];

    for (const report of this.reportName) {
      for (const selectedSetting of this.selectedSetting) {
        if (selectedSetting.reportId === report.id) {
          this.rowData.push({
            reportName: report.reportDes,
            formGroup: new FormGroup({
              selectToGrantAccess: new FormControl(true)
            }),
            fromTime: selectedSetting.fromAccessTime,
            toTime: selectedSetting.toAccessTime,
            id: selectedSetting.id,
            reportId: selectedSetting.reportId
          });
        }
      }

      if (this.rowData.map(row => row.reportId).includes(report.id) === false) {
        this.rowData.push({
          reportName: report.reportDes,
          formGroup: new FormGroup({
            selectToGrantAccess: new FormControl(false)
          }),
          fromTime: '00:00',
          toTime: '00:00',
          id: null,
          reportId: report.id
        });
      }
    }
  }
  checkValidation(rowData) {
    for (const data of rowData) {
      this.fromTime =
        typeof data.fromTime === 'object' ? data.fromTime.value : data.fromTime;
      this.toTime = this.toTime =
        typeof data.toTime === 'object' ? data.toTime.value : data.toTime;
      if (data.formGroup.get('selectToGrantAccess').value === true) {
        if (this.fromTime !== '' && this.toTime !== '') {
          this.emptyValueError = false;
          if (
            fieldValidation.timeField.pattern.test(this.fromTime) &&
            fieldValidation.timeField.pattern.test(this.toTime)
          ) {
            this.timeFormatError = false;
            this.fromTime = this.fromTime.replace(':', '.');
            this.toTime = this.toTime.replace(':', '.');
            if (Number(this.toTime) <= Number(this.fromTime)) {
              this.toTimeLessThanFromTime = true;
              break;
            } else {
              this.toTimeLessThanFromTime = false;
            }
          } else {
            this.timeFormatError = true;
            break;
          }
        } else {
          this.emptyValueError = true;
          break;
        }
      } else {
        this.emptyValueError = false;
        this.timeFormatError = false;
        this.toTimeLessThanFromTime = false;
      }
    }

    this.showErrorPopUp();
  }

  showErrorPopUp() {
    if (
      this.toTimeLessThanFromTime ||
      this.timeFormatError ||
      this.emptyValueError
    ) {
      let errorMessage;
      if (this.emptyValueError) {
        errorMessage = this.errorMessageForNull;
      }
      if (this.timeFormatError) {
        errorMessage =
          this.errorMessageForTimeFormat +
          this.fromTime +
          ',' +
          this.toTime +
          this.allowedTime;
      }
      if (this.toTimeLessThanFromTime) {
        errorMessage =
          this.errorMessageFortoTimeLessThanFromTime + ' ' + this.toTime;
      }

      if (!!this.dialog.openDialogs.length === false) {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.ERROR,
          message: errorMessage
        });
      }
    }
  }
  getResponse() {
    let request: SaveReportRolePayload = null;
    const addAccess: {
      fromAccessTime: string;
      reportId: string;
      toAccessTime: string;
    }[] = [];
    const removeAccess: string[] = [];
    const updateAccess: {
      fromAccessTime: string;
      id: string;
      toAccessTime: string;
    }[] = [];
    this.gridApi.forEachNode(node => {
      if (this.isAdd(node)) {
        addAccess.push({
          fromAccessTime:
            typeof node.data.fromTime === 'object'
              ? node.data.fromTime.value
              : node.data.fromTime,
          toAccessTime:
            typeof node.data.toTime === 'object'
              ? node.data.toTime.value
              : node.data.toTime,
          reportId: node.data.reportId
        });
      }
      if (this.isUpdate(node)) {
        updateAccess.push({
          fromAccessTime:
            typeof node.data.fromTime === 'object'
              ? node.data.fromTime.value
              : node.data.fromTime,
          toAccessTime:
            typeof node.data.toTime === 'object'
              ? node.data.toTime.value
              : node.data.toTime,
          id: node.data.id
        });
      }
      if (this.isRemove(node)) {
        removeAccess.push(node.data.id);
      }
    });
    request = {
      addAccess: addAccess.length ? addAccess : [],
      updateAccess: updateAccess.length ? updateAccess : [],
      removeAccess: removeAccess.length ? removeAccess : []
    };
    return request;
  }
  isAdd(node) {
    if (
      node.data.formGroup.get('selectToGrantAccess').value === true &&
      (node.data.id === null || node.data.id === undefined)
    ) {
      return true;
    } else {
      return false;
    }
  }

  isUpdate(node) {
    if (
      node.data.formGroup.get('selectToGrantAccess').value === true &&
      node.data.id !== null &&
      node.data.id !== undefined &&
      node.data.id !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }
  isRemove(node) {
    if (
      node.data.formGroup.get('selectToGrantAccess').value === false &&
      node.data.id !== null &&
      node.data.id !== undefined &&
      node.data.id !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }
  save() {
    this.gridApi.stopEditing();
    this.checkValidation(this.getAllRows());
    if (
      this.timeFormatError === false &&
      this.toTimeLessThanFromTime === false &&
      this.emptyValueError === false
    ) {
      this.saveResponse.emit(this.getResponse());
    }
  }
  loadPermission(element: string) {
    this.elementPermission
      .loadPermission(element, this.permissions$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const hasRequestPermission = data.transactionCodes.find(key =>
          this.permissionService.hasPermission(key)
        );
        if (hasRequestPermission && this.REPORT_ROLE_MAPPING_EDIT === element) {
          this.hasPermission = true;
        }
    });
    return this.elementPermission.loadPermission(element, this.permissions$);
  }

  gridReady(gridRedayEvent: GridReadyEvent) {
    this.gridApi = gridRedayEvent.api;
  }
}
