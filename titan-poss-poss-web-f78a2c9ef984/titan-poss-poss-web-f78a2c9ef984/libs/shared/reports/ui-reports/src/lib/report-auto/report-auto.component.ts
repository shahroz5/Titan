import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { GridReadyEvent, GridApi } from 'ag-grid-community';

import {
  EditItemComponent,
  InputValidatorComponent,
  CheckboxGridCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  REPORT_GROUPS,
  AutoReportList,
  SaveAutoReportPayload,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';

import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionService } from '@poss-web/shared/permission/ui-permission';

import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';

import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'poss-web-report-auto',
  templateUrl: './report-auto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportAutoComponent implements OnInit, OnChanges {
  @Input() autoReportList: AutoReportList[];
  @Input() count = 0;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() permissions$: Observable<any[]>;


  @Output() paginator = new EventEmitter<PageEvent>();

  @Output() saveResponse = new EventEmitter<SaveAutoReportPayload>();

  gridApi: GridApi;
  rowData = [];
  nonPeakTime: string;
  toTime: string;
  regenerationTime: string;
  availabilityDays: string;
  fromAccessTime: number;
  invalidError: boolean;
  emptyValueError: boolean;
  autoErrorMessage: string;
  numericalErrorMessage: string;
  time: string;
  timeFormatError = false;
  minPageSize: number;
  basedOn: any;
  dayRange: any;
  alertPopUpOpen = false;

  isValueUpdated = false;

  addScheduler: {
    cronExpression: string;
    frequency: string;
    reportId: string;
  }[] = [];
  removeScheduler: string[] = [];
  updateScheduler: {
    cronExpression: string;
    frequency: string;
    schedulerId: string;
  }[] = [];
  isChecked: boolean;
  hasPermission = false;

  constructor(
    private translate: TranslateService,
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
  reportAutoComponent: ReportAutoComponent = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  secondDayOfMonthLabel: string;
  nonPeakTimeErrorMessage: string;

  REPORT_AUTO_GENERATION_EDIT = 'Report Auto Generation - Edit';
  REPORT_AUTO_GENERATION_VIEW = 'Report Auto Generation - View';

  ngOnInit(): void {
    const pageSizeOptions = this.pageSizeOptions;
    this.minPageSize = pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.createColumn();
  }
  createColumn() {
    this.translate
      .get([
        'pw.reports.reportNameLabel',
        'pw.reports.autoGeneration',
        'pw.reports.basedOn',
        'pw.reports.dayRange',
        'pw.reports.nonPeakTime',
        'pw.reports.autoErrorMessage',
        'pw.reports.numericalErrorMessage',
        'pw.reports.secondDayOfMonthLabel',
        'pw.reports.reportsNonPeakTimeFieldValidationLabel',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.nonPeakTime = translatedMessages['pw.reports.nonPeakTime'];
        this.nonPeakTimeErrorMessage = translatedMessages['pw.reports.reportsNonPeakTimeFieldValidationLabel'];
        this.autoErrorMessage =
          translatedMessages['pw.reports.autoErrorMessage'];
        this.numericalErrorMessage =
          translatedMessages['pw.reports.numericalErrorMessage'];
        this.secondDayOfMonthLabel = translatedMessages['pw.reports.secondDayOfMonthLabel'];
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.reports.reportNameLabel'],
            field: 'reportName',

            minWidth: 80,
            flex: 1,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.reports.autoGeneration'],
            field: 'autoGeneration',
            cellRendererFramework: CheckboxGridCellComponent,
            minWidth: 80,
            flex: 1,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.reports.basedOn'],
            field: 'basedOn',
            suppressMovable: true,

            flex: 1,
            cellEditorSelector: params => {
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.basedOnDropDownValues()
                }
              };
            },
            valueFormatter: params => {
              if (
                params?.data?.formGroup.get('autoGeneration')?.value === false
              ) {
                return ' ';
              }
            },

            editable: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                return true;
              } else {
                return false;
              }
            },
            cellRendererSelector: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true)
                return {
                  component: 'editItemComponent'
                };
              else {
                return null;
              }
            },

            minWidth: 80,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.reports.dayRange'],
            field: 'dayRange',

            cellEditorSelector: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                return {
                  component: 'agSelectCellEditor',
                  params: {
                    values: this.dayRangeDropDownValue()
                  }
                };
              }
            },
            valueFormatter: params => {
              if (
                params?.data?.formGroup.get('autoGeneration')?.value === false
              ) {
                return ' ';
              }
              if (
                params?.data?.basedOn === 'DAILY'
              ) {
                return ' ';
              }
              if (params?.data?.basedOn === 'MONTHLY') {
                return this.secondDayOfMonthLabel.toUpperCase()
              }
            },

            cellRendererSelector: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                if (params.data.basedOn === REPORT_GROUPS.WEEKLY) {
                  return {
                    component: 'editItemComponent'
                  };
                } else {
                  return null;
                }
              } else {
                return null;
              }
            },

            editable: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                if (params.data.basedOn === REPORT_GROUPS.WEEKLY) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            },

            cellClassRules: {
              'pw-gray-border': params => {
                if (params.data.basedOn === REPORT_GROUPS.WEEKLY) {
                  return true;
                } else {
                  return false;
                }
              }
            },

            flex: 1,
            minWidth: 80,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.reports.nonPeakTime'],
            field: 'nonPeakTime',

            editable: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                return true;
              } else {
                return false;
              }
            },
            cellRendererSelector: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
                return {
                  component: 'editItemComponent'
                };
              } else {
                return {
                  component: null
                };
              }
            },

            cellEditor: 'inputValidator',
            valueFormatter: params => {
              if (params.data.formGroup.get('autoGeneration')?.value === true) {
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
                return params.value?.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return params.value?.isValid === false;
              }
            },
            minWidth: 80,

            flex: 1,
            suppressMovable: true
          }
        ];
      });
  }

  dayRangeDropDownValue() {
    return [
      REPORT_GROUPS.MON,
      REPORT_GROUPS.TUE,
      REPORT_GROUPS.WED,
      REPORT_GROUPS.THU,
      REPORT_GROUPS.FRI,
      REPORT_GROUPS.SAT,
      REPORT_GROUPS.SUN
    ];
  }

  basedOnDropDownValues() {
    return [REPORT_GROUPS.DAILY, REPORT_GROUPS.WEEKLY, REPORT_GROUPS.MONTHLY];
  }
  getContext(isDisable) {
    return {
      componentParent: this.reportAutoComponent,
      disableCell: isDisable,
      disableCheckBox: isDisable,
      validators: {
        nonPeakTime: [
          this.fieldValidatorService.requiredField(this.nonPeakTimeErrorMessage),
          this.fieldValidatorService.nonPeakTimeField(
            'Report to be generated at'
          )
        ]
      }
    };
  }
  onCellValueChanged(changeEvent) {
    if (changeEvent.colDef.field === 'basedOn') {
      changeEvent.node.data = {
        ...changeEvent.node.data,
        oldBasedOnValue: changeEvent.oldValue
      };
    }
    if (changeEvent.colDef.field === 'dayRange') {
      changeEvent.node.data = {
        ...changeEvent.node.data,

        oldDayRangeValue: changeEvent.oldValue
      };
    }
    this.gridApi.redrawRows();
    this.checkValidation(this.getAllRows());
  }

  showErrorPopUp() {
    if (this.timeFormatError || this.emptyValueError) {
      let errorMessage;
      if (this.emptyValueError) {
        errorMessage = this.autoErrorMessage;
      } else if (this.timeFormatError) {
        errorMessage = this.numericalErrorMessage;
      }

      if (this.alertPopUpOpen === false) {
        this.alertPopUpOpen = true;
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.ERROR,
            message: errorMessage
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            this.alertPopUpOpen = false;
          });
      }
    }
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

    for (const autoReport of this.autoReportList) {
      this.rowData.push({
        reportName: autoReport.reportDescription,
        formGroup: new FormGroup({
          autoGeneration: new FormControl(
            autoReport?.isAutoGenerated !== undefined
              ? autoReport.isAutoGenerated
              : false
          )
        }),
        id: autoReport.id,
        reportId: autoReport.reportId,
        basedOn: autoReport.frequency,
        oldBasedOnValue: autoReport.frequency,
        dayRange: this.getDayRange(
          autoReport.cronExpression,
          autoReport.frequency
        ),
        oldDayRangeValue: this.getDayRange(
          autoReport.cronExpression,
          autoReport.frequency
        ),

        nonPeakTime: this.getNonPeakTime(autoReport.cronExpression)
      });
    }
  }
  getDayRange(cronExpression: string, frequency: string) {
    if (cronExpression) {
      const cronExpressionArray = cronExpression.split(' ');
      if (frequency === REPORT_GROUPS.WEEKLY) {
        return cronExpressionArray[5];
      }
    }
  }
  getNonPeakTime(cronExpression: string) {
    if (cronExpression) {
      const cronExpressionArray = cronExpression.split(' ');
      if (cronExpressionArray[2]?.length) {
        return cronExpressionArray[2];
      }
    }
  }
  checkValidation(rowData) {
    for (const data of rowData) {
      if (data.formGroup?.get('autoGeneration')?.value) {
        this.nonPeakTime =
          typeof data.nonPeakTime === 'object'
            ? data.nonPeakTime?.value
            : data.nonPeakTime;
        this.basedOn =
          typeof data.basedOn === 'object' ? data.basedOn?.value : data.basedOn;
        this.dayRange =
          typeof data.dayRange === 'object'
            ? data.dayRange?.value
            : data.dayRange;

        if (
          this.nonPeakTime === '' ||
          this.nonPeakTime === undefined ||
          this.nonPeakTime === null ||
          this.basedOn === '' ||
          this.basedOn === undefined ||
          this.basedOn === null
        ) {
          this.emptyValueError = true;
          break;
        } else {
          if (this.basedOn === REPORT_GROUPS.WEEKLY) {
            if (
              this.dayRange === '' ||
              this.dayRange === null ||
              this.dayRange === undefined
            ) {
              this.emptyValueError = true;
              break;
            }
          }
          this.emptyValueError = false;
          if (
            fieldValidation.nonPeakTimeField.pattern.test(this.nonPeakTime) ===
            false
          ) {
            this.timeFormatError = true;
            break;
          } else {
            this.timeFormatError = false;
          }
        }
      } else {
        this.timeFormatError = false;
        this.emptyValueError = false;
      }
    }

    this.showErrorPopUp();
  }
  getResponse() {
    let request: SaveAutoReportPayload = null;
    this.addScheduler = [];
    this.updateScheduler = [];
    this.removeScheduler = [];

    this.gridApi.forEachNode(node => {
      if (this.isAdd(node)) {
        this.addScheduler.push({
          cronExpression: this.getCronExpression(
            typeof node.data.nonPeakTime === 'object'
              ? node.data.nonPeakTime.value
              : node.data.nonPeakTime,

            node.data.dayRange,
            node.data.basedOn
          ),
          frequency: node.data.basedOn,
          reportId: node.data.reportId
        });
      }
      if (this.isUpdate(node)) {
        this.updateScheduler.push({
          cronExpression: this.getCronExpression(
            typeof node.data.nonPeakTime === 'object'
              ? node.data.nonPeakTime.value
              : node.data.nonPeakTime,
            node.data.dayRange,
            node.data.basedOn
          ),
          frequency: node.data.basedOn,
          schedulerId: node.data.id
        });
      }
      if (this.isRemove(node)) {
        this.removeScheduler.push(node.data.id);
      }
    });
    request = {
      addScheduler: this.addScheduler.length ? this.addScheduler : [],
      updateScheduler: this.updateScheduler.length ? this.updateScheduler : [],
      removeScheduler: this.removeScheduler.length ? this.removeScheduler : []
    };
    return request;
  }
  getCronExpression(nonPeakTime: string, dayRange: string, frequency: string) {

    let cronExp;



    if (frequency === REPORT_GROUPS.WEEKLY) {
      if (dayRange !== null && dayRange !== undefined && dayRange !== '') {
        cronExp =
          '0' +
          ' ' +
          '0' +
          ' ' +
          nonPeakTime +
          ' ' +
          '?' +
          ' ' +
          '*' +
          ' ' +
          dayRange.substring(0, 3);
      }
    }
    if (frequency === REPORT_GROUPS.MONTHLY) {
      cronExp =
        '0' + ' ' + '0' + ' ' + nonPeakTime + ' ' + '2' + ' ' + '*' + ' ' + '?';
    }
    if (frequency === REPORT_GROUPS.DAILY) {
      cronExp =
        '0' + ' ' + '0' + ' ' + nonPeakTime + ' ' + '?' + ' ' + '*' + ' ' + '*';
    }
    return cronExp;
  }

  isAdd(node) {
    if (
      node.data.formGroup.get('autoGeneration').value === true &&
      node.data.id === null
    ) {
      return true;
    } else {
      return false;
    }
  }

  isUpdate(node) {
    if (node.data.formGroup.get('autoGeneration').value === true) {
      if (node.data.id !== null) {
        if (typeof node.data.nonPeakTime === 'object') {
          if (node.data.nonPeakTime.value !== node.data.nonPeakTime.oldValue) {
            return true;
          } else {
            return false;
          }
        } else if (node.data.oldBasedOnValue !== node.data.basedOn) {
          return true;
        } else if (node.data.oldDayRangeValue !== node.data.dayRange) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  isRemove(node) {
    if (
      node.data.formGroup.get('autoGeneration').value === false &&
      node.data.id !== null &&
      node.data.id !== undefined &&
      node.data.id !== ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  getAllRows() {
    const rowData = [];

    this.gridApi.forEachNode(node => rowData.push(node.data));

    return rowData;
  }
  save() {
    this.gridApi.stopEditing();
    this.checkValidation(this.getAllRows());

    if (this.timeFormatError === false && this.emptyValueError === false) {
      this.saveResponse.emit(this.getResponse());
    }
  }
  gridReady(gridRedayEvent: GridReadyEvent) {
    this.gridApi = gridRedayEvent.api;
  }

  onCellFocused(event) {
    this.mapTopPanelValue(event);
    Array.from(
      document.getElementsByClassName('ag-cell') as HTMLCollectionOf<
        HTMLElement
      >
    ).forEach((elem, index) => {
      elem.addEventListener('focusin', () => {
        this.isFocusing = true;
      });
      elem.addEventListener('focusout', () => {
        this.isFocusing = false;
      });
    });
  }
  mapTopPanelValue(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    if (this.currentRowField === 'autoGeneration') {
      this.currentRowInfo = node?.data?.formGroup?.controls[this.currentRowField].value;
    } else if (node?.data?.formGroup?.controls['autoGeneration'].value){
      if (
        (node?.data?.basedOn === REPORT_GROUPS.DAILY ||
        node?.data?.basedOn === REPORT_GROUPS.MONTHLY) && this.currentRowField === 'dayRange'
      ) {
        this.currentRowInfo = null;
      } else {
        var data = this.gridApi.getValue(this.currentRowField, node);
        this.currentRowInfo = typeof data === 'object' && data ? data.value : data;
      }
    } else {
      this.currentRowInfo = null;
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
        if (hasRequestPermission && this.REPORT_AUTO_GENERATION_EDIT === element) {
          this.hasPermission = true;
        }
    });
    return this.elementPermission.loadPermission(element, this.permissions$);
  }

}
