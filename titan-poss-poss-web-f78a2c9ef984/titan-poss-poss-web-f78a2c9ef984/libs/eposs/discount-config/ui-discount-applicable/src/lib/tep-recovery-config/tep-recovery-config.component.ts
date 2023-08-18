import {
  AlertPopupServiceAbstraction,
  DiscountTEPDetails,
  DiscountTypeEnum,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  DiscountTEPConfig,
  SaveDiscountTEPConfig
} from '@poss-web/shared/models';

import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  InputValidatorComponent,
  DeleteRowComponent,
  EditItemComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'poss-web-tep-recovery-config',
  templateUrl: './tep-recovery-config.component.html',
  styleUrls: ['./tep-recovery-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepRecoveryConfigComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() selectedDiscount: DiscountTypeEnum;
  @Input() durations;
  @Input() tepConfig: DiscountTEPDetails;
  @Input() discountDetails;

  @Output() update = new EventEmitter<DiscountTEPDetails>();
  @Output() deletetepConfig = new EventEmitter<string>();
  @Output() savetepConfig = new EventEmitter<SaveDiscountTEPConfig>();

  destroy$ = new Subject();
  durationLabel: string;
  utilizationLabel: string;

  component: TepRecoveryConfigComponent = this;

  errorMessageForNull: string;
  errorMessageForduplicateValue: string;

  invalidValueError = false;
  duplicateValueError = false;
  errorDurationValue = null;

  gridApi: GridApi;
  domLayout = 'autoHeight';
  colDef = [];
  rowData: DiscountTEPConfig[] = [];
  editMode;
  range: any[];

  constructor(
    private translateService: TranslateService,
    private fieldValidatorService: FieldValidatorsService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translateService
      .get([
        'pw.discountApplicable.durationInDaysLabel',
        'pw.discountApplicable.utilizationPercentageLabel',
        'pw.discountApplicable.errorMessageForNull',
        'pw.discountApplicable.errorMessageForduplicateValue'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.durationLabel =
          translatedLabels['pw.discountApplicable.durationInDaysLabel'];
        this.utilizationLabel =
          translatedLabels['pw.discountApplicable.utilizationPercentageLabel'];

        this.errorMessageForNull =
          translatedLabels['pw.discountApplicable.errorMessageForNull'];

        this.errorMessageForduplicateValue =
          translatedLabels[
            'pw.discountApplicable.errorMessageForduplicateValue'
          ];

        this.colDef = [
          {
            headerName: this.durationLabel,
            field: 'durationInDays',
            cellRendererFramework: EditItemComponent,
            cellEditorSelector: params => {
              this.range = [];
              this.durations.forEach(val => {
                this.range.push(val.range);
              });
              return {
                component: 'agSelectCellEditor',
                params: {
                  values: this.range
                }
              };
            },
            editable: true,
            width: 200
          },
          {
            headerName: this.utilizationLabel,
            field: 'recoveryPercent',
            editable: true,
            cellEditor: 'inputValidator',
            resizable: true,
            width: 280,
            suppressMovable: true,
            cellRendererFramework: EditItemComponent,
            valueFormatter: (params: { value: { value: any } }) => {
              if (typeof params.value === 'object') {
                if (params.value.value) {
                  return params.value.value;
                } else {
                  return ' ';
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
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName: '',
            suppressMovable: true,
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            cellRendererFramework: DeleteRowComponent,
            suppressRowClickSelection: 'true',
            onCellClicked: this.remove.bind(this)
          }
        ];
      });
  }

  ngOnInit() {
    console.log('TEP Config check init', this.tepConfig);
    this.createRowData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tepConfig']) {
      console.log('TEP Config check change ', this.tepConfig);
      this.createRowData();
    }
    if (changes['durations']) {
      this.durations = this.durations;
    }
    console.log(this.durations, 'durations');
  }

  createRowData() {
    this.rowData = [];
    if (this.tepConfig.tepDetails?.length) {
      for (const item of this.tepConfig.tepDetails) {
        this.createRow(item);
      }
    } else {
      this.createRow();
    }
    console.log('TEP Config check rowData ', this.rowData);
  }

  createRow(tepConfig?: DiscountTEPConfig) {
    if (tepConfig) {
      this.rowData.push({
        id: tepConfig.id ? tepConfig.id : '',
        durationInDays: tepConfig.durationInDays ? tepConfig.durationInDays : 0,
        recoveryPercent: tepConfig.recoveryPercent
          ? tepConfig.recoveryPercent
          : 100
      });
    } else {
      this.rowData.push({
        id: '',
        durationInDays: 0,
        recoveryPercent: 100
      });
    }
  }

  addAnother() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.editMode) {
        this.editMode = false;
        this.gridApi.stopEditing();
      } else {
        this.checkValidation();
        this.addData();
      }
    }
  }

  checkValidation(showError = true): boolean {
    this.gridApi.stopEditing();
    this.invalidValueError = false;
    this.rowData = this.getAllRows();
    const rowData: any = this.rowData;
    for (const data of rowData) {
      if (
        data?.durationInDays === '' ||
        data?.durationInDays === 0 ||
        data?.durationInDays === undefined ||
        data?.recoveryPercent === '' ||
        data?.recoveryPercent === 0 ||
        data?.recoveryPercent === undefined ||
        data?.recoveryPercent?.value === '' ||
        data?.recoveryPercent?.value === 0 ||
        data?.recoveryPercent?.isValid === false
      ) {
        this.invalidValueError = true;
        break;
      }
    }

    if (!this.invalidValueError) {
      this.duplicateValueError = false;
      this.errorDurationValue = null;
      const durationMap = new Map<string, string>();
      for (const data of rowData) {
        if (durationMap.has(data.durationInDays)) {
          this.duplicateValueError = true;
          this.errorDurationValue = data.durationInDays;
          break;
        } else {
          durationMap.set(data.durationInDays, data.durationInDays);
        }
      }
    }

    if (showError) {
      this.showErrorPopUp();
    }
    console.log('TEP Config check validation', !this.invalidValueError);

    return !this.invalidValueError && !this.duplicateValueError;
  }

  showErrorPopUp() {
    if (this.invalidValueError || this.duplicateValueError) {
      let errorMessage;
      if (this.invalidValueError) {
        errorMessage = this.errorMessageForNull;
      } else {
        errorMessage =
          this.errorMessageForduplicateValue + this.errorDurationValue;
      }

      this.dialog.closeAll();
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: errorMessage
      });
    }
  }

  rowEditingStarted() {
    this.editMode = true;
  }

  addData() {
    if (this.rowData.length > 1 || this.rowData.length === 1) {
      if (
        this.invalidValueError === false &&
        this.duplicateValueError === false
      ) {
        this.rowData.push({
          id: '',
          durationInDays: 0,
          recoveryPercent: 100
        });

        this.gridApi.setRowData(this.rowData);
      }
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent
    };
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.rowData);
  }

  getContext() {
    return {
      validators: {
        durationInDays: [
          this.fieldValidatorService.requiredField(this.durationLabel)
        ],
        recoveryPercent: [
          this.fieldValidatorService.requiredField(this.utilizationLabel),
          this.fieldValidatorService.percentageField(this.utilizationLabel)
        ]
      },
      componentParent: this.component
    };
  }

  rowValueChanged() {
    this.checkValidation();
    this.editMode = false;
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  remove(params) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (params.data.id !== '') {
        this.deletetepConfig.emit(params.data.id);
      }
      this.editMode = false;
      let index = 1;
      if (this.getAllRows().length === 1) {
        this.rowData = [
          {
            id: '',
            recoveryPercent: 0,
            durationInDays: 0
          }
        ];

        this.gridApi.redrawRows();
      } else {
        this.gridApi.applyTransaction({
          remove: [params.data]
        });

        this.rowData = this.getAllRows().map(ob => ({
          ...ob,
          rowId: (index++).toString()
        }));
      }
    }
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


  save() {
    let index = 1;
    this.gridApi.stopEditing();
    this.checkValidation(false);

    const array = this.getAllRows().map(ob => ({
      ...ob,
      rowId: (index++).toString()
    }));
    return this.prepareResponse(array);
  }

  prepareResponse(rowData: any[]) {
    const newData = rowData.filter(data => data.id === '');
    const updatedData = rowData.filter(data => data.id !== '');

    const add: any[] = [];
    const update: any[] = [];

    for (const value of newData) {
      console.log(value, 'valuee');

      add.push({
        durationInDays:
          typeof value.durationInDays === 'object'
            ? value.durationInDays?.value
            : value?.durationInDays,
        recoveryPercent:
          typeof value.recoveryPercent === 'object'
            ? value.recoveryPercent?.value
            : value?.recoveryPercent
      });
    }

    for (const value of updatedData) {
      update.push({
        durationInDays:
          typeof value.durationInDays === 'object'
            ? value.durationInDays?.value
            : value?.durationInDays,
        recoveryPercent:
          typeof value.recoveryPercent === 'object'
            ? value.recoveryPercent?.value
            : value?.recoveryPercent,
        id: value.id
      });
    }
    console.log(add, update, 'add update');

    return {
      addValues: add,
      updateValue: update,
      removeValues: [],
      all: rowData.map(data => ({
        durationInDays:
          typeof data.durationInDays === 'object'
            ? data.durationInDays?.value
            : data?.durationInDays,
        recoveryPercent:
          typeof data.recoveryPercent === 'object'
            ? data.recoveryPercent?.value
            : data?.recoveryPercent,
        id: data.id
      }))
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toNumber(data) {
    return Number.parseInt(data);
  }
}
