import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import {
  WeightValueConfigConstants,
  WeightValueConfigDetails,
  BasedWeightValueConfig,
  DataWeightValueConfig,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';
import {
  CellEvent,
  GridApi,
  GridReadyEvent,
  RowValueChangedEvent
} from 'ag-grid-community';

import {
  InputValidatorComponent,
  EditItemComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-weight-value-config-details',
  templateUrl: './weight-value-config-details.component.html',
  styleUrls: ['./weight-value-config-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightValueConfigDetailsComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() weightValueConfigDetails: WeightValueConfigDetails;
  @Input() routeParam: Observable<Params>;

  @Output() formOutput = new EventEmitter<WeightValueConfigDetails>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  destroy$ = new Subject();
  configName: string;
  descriptionLabel: string;
  disableWeightBased = true;
  disableValueBased = true;
  alldeleted = false;
  selectedRowIndex = 0;


  weightGridApi: GridApi;
  valueGridApi: GridApi;
  inValidWeightTolerance = false;
  inValidValueTolerance = false;
  value: string;

  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;


  valueBasedcolumnDefs = [];
  weightBasedColumnDefs = [];
  weightBasedRowData: {
    rowId: string;
    startRange: any;
    endRange: any;
    tolerenceAllowed: any;
    new: boolean;
  }[] = [];
  valueBasedRowData: {
    rowId: string;
    startRange: string;
    endRange: string;
    tolerenceAllowed: string;
    new: boolean;
  }[] = [];

  weightStartRangeLessThanPrevEndRange = false;
  weightEndRangeLessThanStartRange = false;
  weightEndRangeGreaterThanPrevStartRange = false;
  weightEmptyRow = false;

  valueStartRangeLessThanPrevEndRange = false;
  valueEndRangeLessThanStartRange = false;
  valueEndRangeGreaterThanPrevStartRange = false;
  valueEmptyRow = false;

  dialogOpen = false;
  isAbove = undefined;

  save = true;
  valueEditMode = false;
  weightEditMode = false;
  isConfirmPopUp = false;

  weightBasedError;
  valueBasedError;
  weightValueConfigDetailsComponent: any = this;
  confirmDialogReference;
  errorDialogReference;
  i = 1;
  defaultColDef = {
    suppressMovable: true
  };
  errorMessageForNull: any;
  errorMessageForCurrentEndRangeGreaterThanNextStartRange: any;
  errorMessageForCurrentEndRangeLessThanStartRange: any;
  errorMessageForCurrentStartRangeLessThanPreviousEndRange: any;
  alertPopUpOpen = false;
  weightStartRangeLabel: string;
  weightEndRangeLabel: string;
  weightToleranceLabel: string;
  valueStartRangeLabel: string;
  valueEndRangeLabel: string;
  valueToleranceLable: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private cdr: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.weightValueConfig.configName',
        'pw.weightValueConfig.errorMessageForNull',
        'pw.weightValueConfig.errorMessageForCurrentEndRangeGreaterThanNextStartRange',
        'pw.weightValueConfig.errorMessageForCurrentEndRangeLessThanStartRange',
        'pw.weightValueConfig.errorMessageForCurrentStartRangeLessThanPreviousEndRange',
        'pw.weightValueConfig.weightStartRangeLabel',
        'pw.weightValueConfig.weightEndRangeLabel',
        'pw.weightValueConfig.weightToleranceLabel',
        'pw.weightValueConfig.valueStartRangeLabel',
        'pw.weightValueConfig.valueEndRangeLabel',
        'pw.weightValueConfig.valueToleranceLable'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configName = translatedMsg['pw.weightValueConfig.configName'];
        this.errorMessageForNull =
          translatedMsg['pw.weightValueConfig.errorMessageForNull'];
        this.errorMessageForCurrentEndRangeGreaterThanNextStartRange =
          translatedMsg[
            'pw.weightValueConfig.errorMessageForCurrentEndRangeGreaterThanNextStartRange'
          ];
        this.errorMessageForCurrentEndRangeLessThanStartRange =
          translatedMsg[
            'pw.weightValueConfig.errorMessageForCurrentEndRangeLessThanStartRange'
          ];
        this.errorMessageForCurrentStartRangeLessThanPreviousEndRange =
          translatedMsg[
            'pw.weightValueConfig.errorMessageForCurrentStartRangeLessThanPreviousEndRange'
          ];
        this.weightStartRangeLabel =
          translatedMsg['pw.weightValueConfig.weightStartRangeLabel'];
        this.weightEndRangeLabel =
          translatedMsg['pw.weightValueConfig.weightEndRangeLabel'];
        this.weightToleranceLabel =
          translatedMsg['pw.weightValueConfig.weightToleranceLabel'];
        this.valueStartRangeLabel =
          translatedMsg['pw.weightValueConfig.valueStartRangeLabel'];
        this.valueEndRangeLabel =
          translatedMsg['pw.weightValueConfig.valueEndRangeLabel'];
        this.valueToleranceLable =
          translatedMsg['pw.weightValueConfig.valueToleranceLable'];
      });
  }

  weightValueConfigDetailsForm: FormGroup;
  isNew = false;

  ngOnInit() {

    this.initAgGrid();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.routeParam.subscribe(param => {
      if (param['_id'] === WeightValueConfigConstants.NEW) {
        this.isNew = true;
        this.weightValueConfigDetailsForm
          ?.get('configName')
          .disable({ onlySelf: false });
      } else {
        this.isNew = false;
        this.weightValueConfigDetailsForm
          ?.get('configName')
          .disable({ onlySelf: true });
      }

      this.cdr.markForCheck();
    });

    this.save = true;

    this.disableValueBased = true;
    this.disableWeightBased = true;
    this.valueBasedRowData = [];
    this.weightBasedRowData = [];

    this.initForm(this.weightValueConfigDetails);

    this.createForm();
  }
  initForm(weightValueConfigDetails: WeightValueConfigDetails) {
    this.weightValueConfigDetailsForm = new FormGroup({
      configName: new FormControl(
        {
          value: weightValueConfigDetails.description,
          disabled: this.isNew ? !this.isNew : true
        },
        [
          this.fieldValidatorsService.requiredField(this.configName),
          this.fieldValidatorsService.weightValueConfigName(this.configName)
        ]
      ),
      weightBasedFormArray: this.fb.array([]),
      valueBasedFormArray: this.fb.array([]),
      isActive: new FormControl(true)
    });


  }

  createForm() {
    if (this.weightValueConfigDetails.ruleDetails.data.weightBased.length) {
      this.weightValueConfigDetails.ruleDetails.data.weightBased.forEach(
        item => {
          this.addNewWeightBasedMapping(item);
        }
      );
    } else {
      this.addNewWeightBasedMapping();
    }
    if (this.weightValueConfigDetails.ruleDetails.data.valueBased.length) {
      this.weightValueConfigDetails.ruleDetails.data.valueBased.forEach(
        item => {
          this.addNewValueBasedMapping(item);
        }
      );
    } else {
      this.addNewValueBasedMapping();
    }
  }

  get weightBasedFormArray() {
    return this.weightValueConfigDetailsForm.get(
      'weightBasedFormArray'
    ) as FormArray;
  }

  getWeightBasedControls() {
    return (this.weightValueConfigDetailsForm.get(
      'weightBasedFormArray'
    ) as FormArray).controls;
  }

  get valueBasedFormArray() {
    return this.weightValueConfigDetailsForm.get(
      'valueBasedFormArray'
    ) as FormArray;
  }

  getValueBasedControls() {
    return (this.weightValueConfigDetailsForm.get(
      'valueBasedFormArray'
    ) as FormArray).controls;
  }


  getAllWeightBasedRows() {
    const rowData = [];
    this.weightGridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  getAllValueBasedRows() {
    const rowData = [];
    this.valueGridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  addAboveNewValueBasedMapping() {
    this.i = 1;
    this.dialogOpen = false;
    this.valueGridApi.stopEditing();
    this.isAbove = true;
    if (this.valueEditMode) {
      this.valueEditMode = false;
      this.valueGridApi.stopEditing();
    } else {
      this.checkValueValidation(this.getAllValueBasedRows());
      this.addData(this.valueGridApi);
    }
  }

  addBelowNewValueBasedMapping() {
    this.dialogOpen = false;
    this.valueGridApi.stopEditing();
    this.isAbove = false;
    if (this.valueEditMode) {
      this.valueEditMode = false;
      this.valueGridApi.stopEditing();
    } else {
      this.checkValueValidation(this.getAllValueBasedRows());
      this.addData(this.valueGridApi);
    }

    this.i = 1;
  }

  checkWeightValidation(rowData) {
    let currentRowData;
    let prevRowData;
    let nextRowData;

    currentRowData = rowData[this.selectedRowIndex];

    for (const data of rowData) {
      if (
        data?.startRange === '' ||
        data?.startRange?.value === '' ||
        data?.endRange?.value === '' ||
        data?.tolerenceAllowed?.value === '' ||
        data?.endRange === '' ||
        data?.tolerenceAllowed === ''
      ) {
        this.weightEmptyRow = true;
        break;
      } else {
        this.weightEmptyRow = false;
      }
    }

    //End Range Less Than Start Range
    if (
      Number(
        typeof currentRowData?.endRange === 'object'
          ? currentRowData?.endRange.value
          : currentRowData?.endRange
      ) <=
      Number(
        typeof currentRowData?.startRange === 'object'
          ? currentRowData?.startRange.value
          : currentRowData?.startRange
      )
    ) {
      this.weightEndRangeLessThanStartRange = true;
    } else {
      this.weightEndRangeLessThanStartRange = false;
    }

    //startRangeLessThanPrevEndRange

    prevRowData = rowData[this.selectedRowIndex - 1];

    currentRowData = rowData[this.selectedRowIndex];
    if (
      Number(
        typeof currentRowData?.startRange === 'object'
          ? currentRowData?.startRange?.value
          : currentRowData?.startRange
      ) <=
      Number(
        typeof prevRowData?.endRange === 'object'
          ? prevRowData?.endRange?.value
          : prevRowData?.endRange
      )
    ) {
      this.weightStartRangeLessThanPrevEndRange = true;
    } else {
      this.weightStartRangeLessThanPrevEndRange = false;
    }

    currentRowData = rowData[this.selectedRowIndex];
    nextRowData = rowData[this.selectedRowIndex + 1];
    if (
      Number(
        typeof currentRowData?.endRange === 'object'
          ? currentRowData?.endRange?.value
          : currentRowData?.endRange
      ) >=
      Number(
        typeof nextRowData?.startRange === 'object'
          ? nextRowData?.startRange?.value
          : nextRowData?.startRange
      )
    ) {
      this.weightEndRangeGreaterThanPrevStartRange = true;
    } else {
      this.weightEndRangeGreaterThanPrevStartRange = false;
    }

    if (this.dialogOpen === false) {
      this.dialogOpen = true;
      this.showErrorPopUp();
    }

    this.isConfirmPopUp = true;
  }

  checkValueValidation(rowData) {
    let currentRowData;
    let prevRowData;
    let nextRowData;

    currentRowData = rowData[this.selectedRowIndex];

    for (const data of rowData) {
      if (
        data?.startRange === '' ||
        data?.startRange?.value === '' ||
        data?.endRange?.value === '' ||
        data?.tolerenceAllowed?.value === '' ||
        data?.endRange === '' ||
        data?.tolerenceAllowed === ''
      ) {
        this.valueEmptyRow = true;
        break;
      } else {
        this.valueEmptyRow = false;
      }
    }

    //End Range Less Than Start Range
    if (
      Number(
        typeof currentRowData?.endRange === 'object'
          ? currentRowData?.endRange.value
          : currentRowData?.endRange
      ) <=
      Number(
        typeof currentRowData?.startRange === 'object'
          ? currentRowData?.startRange.value
          : currentRowData?.startRange
      )
    ) {
      this.valueEndRangeLessThanStartRange = true;
    } else {
      this.valueEndRangeLessThanStartRange = false;
    }

    //startRangeLessThanPrevEndRange

    prevRowData = rowData[this.selectedRowIndex - 1];

    currentRowData = rowData[this.selectedRowIndex];

    if (
      Number(
        typeof currentRowData?.startRange === 'object'
          ? currentRowData?.startRange?.value
          : currentRowData?.startRange
      ) <=
      Number(
        typeof prevRowData?.endRange === 'object'
          ? prevRowData?.endRange?.value
          : prevRowData?.endRange
      )
    ) {
      this.valueStartRangeLessThanPrevEndRange = true;
    } else {
      this.valueStartRangeLessThanPrevEndRange = false;
    }

    currentRowData = rowData[this.selectedRowIndex];
    nextRowData = rowData[this.selectedRowIndex + 1];

    if (
      Number(
        typeof currentRowData?.endRange === 'object'
          ? currentRowData?.endRange?.value
          : currentRowData?.endRange
      ) >=
      Number(
        typeof nextRowData?.startRange === 'object'
          ? nextRowData?.startRange?.value
          : nextRowData?.startRange
      )
    ) {
      this.valueEndRangeGreaterThanPrevStartRange = true;
    } else {
      this.valueEndRangeGreaterThanPrevStartRange = false;
    }

    if (this.dialogOpen === false) {
      this.dialogOpen = true;
      this.showErrorPopUp();
    }
  }
  addAboveNewWeightBasedMapping() {
    this.i = 1;
    this.dialogOpen = false;
    this.isAbove = true;

    if (this.weightEditMode) {
      this.weightEditMode = false;
      this.weightGridApi.stopEditing();
    } else {
      this.checkWeightValidation(this.getAllWeightBasedRows());
      this.addData(this.weightGridApi);
    }
  }

  addBelowNewWeightBasedMapping() {
    this.dialogOpen = false;
    this.isAbove = false;
    if (this.weightEditMode) {
      this.weightEditMode = false;

      this.weightGridApi.stopEditing();
    } else {
      this.checkWeightValidation(this.getAllWeightBasedRows());
      this.addData(this.weightGridApi);
    }

    this.i = 1;
  }

  createUpdatedWeightBasedFormArray(rowData) {
    this.weightBasedFormArray.clear();
    rowData.forEach(item => {
      this.weightBasedFormArray.push(
        this.fb.group({
          weightRowId: new FormControl(item.rowId),
          weightStartLimit: new FormControl(
            item.startRange
              ? item.startRange.value
                ? item.startRange.value
                : item.startRange
              : '',
            [this.fieldValidatorsService.requiredField('Start Range')]
          ),
          weightEndLimit: new FormControl(
            item.endRange
              ? item.endRange.value
                ? item.endRange.value
                : item.endRange
              : ''
          ),
          weightTolerance: new FormControl(
            item.tolerenceAllowed
              ? item.tolerenceAllowed.value
                ? item.tolerenceAllowed.value
                : item.tolerenceAllowed
              : ''
          )
        })
      );
    });
  }

  createUpdatedValueBasedFormArray(rowData) {
    this.valueBasedFormArray.clear();
    rowData.forEach(item => {
      this.valueBasedFormArray.push(
        this.fb.group({
          valueRowId: new FormControl(item.rowId),
          valueStartLimit: new FormControl(
            item.startRange
              ? item.startRange.value
                ? item.startRange.value
                : item.startRange
              : ''
          ),
          valueEndLimit: new FormControl(
            item.endRange
              ? item.endRange.value
                ? item.endRange.value
                : item.endRange
              : ''
          ),
          valueTolerance: new FormControl(
            item.tolerenceAllowed
              ? item.tolerenceAllowed.value
                ? item.tolerenceAllowed.value
                : item.tolerenceAllowed
              : ''
          )
        })
      );
    });
  }
  addNewWeightBasedMapping(item?: BasedWeightValueConfig) {
    if (item) {
      this.weightBasedRowData.push({
        rowId: item.rowId,
        startRange: item.fromRange ? item.fromRange.toString() : '',
        endRange: item.toRange ? item.toRange.toString() : '',
        tolerenceAllowed: item.toleranceValue
          ? item.toleranceValue.toString()
          : '',
        new: false
      });

      this.weightBasedFormArray.push(
        this.fb.group({
          weightRowId: new FormControl(item.rowId),
          weightStartLimit: new FormControl(item.fromRange, [
            this.fieldValidatorsService.requiredField('Start Range')
          ]),
          weightEndLimit: new FormControl(item.toRange),
          weightTolerance: new FormControl(item.toleranceValue)
        })
      );
    } else {
      this.weightBasedRowData.push({
        rowId: '1',
        startRange: '',
        endRange: '',
        tolerenceAllowed: '',
        new: true
      });
      this.weightBasedFormArray.push(
        this.fb.group({
          weightRowId: new FormControl(
            this.getWeightBasedControls().length + 1
          ),
          weightStartLimit: new FormControl(''),
          weightEndLimit: new FormControl(''),
          weightTolerance: new FormControl('')
        })
      );
    }
    this.cdr.markForCheck();
  }

  addNewValueBasedMapping(item?: BasedWeightValueConfig) {
    if (item) {
      this.valueBasedRowData.push({
        rowId: item.rowId,
        startRange: item.fromRange ? item.fromRange.toString() : '',
        endRange: item.toRange ? item.toRange.toString() : '',
        tolerenceAllowed: item.tolerancePercent
          ? item.tolerancePercent.toString()
          : '',
        new: false
      });

      this.valueBasedFormArray.push(
        this.fb.group({
          valueRowId: new FormControl(item.rowId),
          valueStartLimit: new FormControl(item.fromRange),
          valueEndLimit: new FormControl(item.toRange),
          valueTolerance: new FormControl(item.tolerancePercent)
        })
      );
    } else {
      this.valueBasedRowData.push({
        rowId: '1',
        startRange: '',
        endRange: '',
        tolerenceAllowed: '',
        new: true
      });

      this.valueBasedFormArray.push(
        this.fb.group({
          valueRowId: new FormControl(this.getValueBasedControls().length + 1),
          valueStartLimit: new FormControl(''),
          valueEndLimit: new FormControl(''),
          valueTolerance: new FormControl('')
        })
      );
    }
  }

  onSubmit() {

    if (
      this.weightValueConfigDetails?.description !== '' &&
      !this.weightValueConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.weightGridApi.stopEditing();
      this.valueGridApi.stopEditing();
      this.checkValueValidation(this.valueBasedRowData);
      this.checkWeightValidation(this.weightBasedRowData);
      if (
        !(
          this.inValidWeightTolerance ||
          this.inValidValueTolerance ||
          this.weightEndRangeGreaterThanPrevStartRange ||
          this.weightEndRangeLessThanStartRange ||
          this.weightStartRangeLessThanPrevEndRange ||
          this.weightEmptyRow ||
          this.valueEndRangeGreaterThanPrevStartRange ||
          this.valueEndRangeLessThanStartRange ||
          this.valueStartRangeLessThanPrevEndRange ||
          this.valueEmptyRow
        )
      ) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              this.prepareResponse();
            }
          });
      } else {
        this.showErrorPopUp();
      }

      this.weightEditMode = false;
      this.valueEditMode = false;
    }
  }
  showMessage(key: string) {
    this.translationService
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
  prepareResponseForValueDelete() {
    if (
      this.weightValueConfigDetailsForm.valid &&
      this.valueBasedFormArray.valid
    ) {
      const values = this.weightValueConfigDetailsForm.getRawValue();

      const valueBased: BasedWeightValueConfig[] = [];

      values.valueBasedFormArray.forEach(
        (element: {
          valueRowId: any;
          valueStartLimit: any;
          valueEndLimit: any;
          valueTolerance: any;
        }) => {
          if (
            element.valueStartLimit &&
            element.valueEndLimit &&
            element.valueTolerance
          ) {
            valueBased.push({
              rowId: element.valueRowId,
              fromRange: element.valueStartLimit,
              toRange: element.valueEndLimit,
              tolerancePercent: element.valueTolerance
            });
          }
        }
      );

      const weightBased: BasedWeightValueConfig[] = [];
      this.weightValueConfigDetails.ruleDetails.data.weightBased.forEach(
        (element: BasedWeightValueConfig) => {
          if (element.fromRange && element.toRange && element.toleranceValue) {
            weightBased.push({
              rowId: element.rowId,
              fromRange: element.fromRange,
              toRange: element.toRange,
              toleranceValue: element.toleranceValue
            });
          }
        }
      );
      const data: DataWeightValueConfig = {
        valueBased,
        weightBased
      };

      const submitData: WeightValueConfigDetails = {
        description: values.configName,
        isActive: values.isActive,

        ruleId: this.weightValueConfigDetails.ruleId,
        ruleType: this.weightValueConfigDetails.ruleType,
        ruleDetails: {
          type: this.weightValueConfigDetails.ruleDetails.type,
          data
        }
      };
      this.formOutput.emit(submitData);
    }
  }

  prepareResponseForWeightDelete() {
    if (
      this.weightValueConfigDetailsForm.valid &&
      this.valueBasedFormArray.valid
    ) {
      const values = this.weightValueConfigDetailsForm.getRawValue();

      const valueBased: BasedWeightValueConfig[] = [];

      this.weightValueConfigDetails.ruleDetails.data.valueBased.forEach(
        (element: BasedWeightValueConfig) => {
          if (
            element.fromRange &&
            element.toRange &&
            element.tolerancePercent
          ) {
            valueBased.push({
              rowId: element.rowId,
              fromRange: element.fromRange,
              toRange: element.toRange,
              tolerancePercent: element.tolerancePercent
            });
          }
        }
      );

      const weightBased: BasedWeightValueConfig[] = [];
      values.weightBasedFormArray.forEach(
        (element: {
          weightRowId: any;
          weightStartLimit: any;
          weightEndLimit: any;
          weightTolerance: any;
        }) => {
          if (
            element.weightStartLimit &&
            element.weightEndLimit &&
            element.weightTolerance
          ) {
            weightBased.push({
              rowId: element.weightRowId,
              fromRange: element.weightStartLimit,
              toRange: element.weightEndLimit,
              toleranceValue: element.weightTolerance
            });
          }
        }
      );
      const data: DataWeightValueConfig = {
        valueBased,
        weightBased
      };

      const submitData: WeightValueConfigDetails = {
        description: values.configName,
        isActive: values.isActive,

        ruleId: this.weightValueConfigDetails.ruleId,
        ruleType: this.weightValueConfigDetails.ruleType,
        ruleDetails: {
          type: this.weightValueConfigDetails.ruleDetails.type,
          data
        }
      };
      this.formOutput.emit(submitData);
    }
  }
  prepareResponse() {
    if (
      this.weightValueConfigDetailsForm.valid &&
      this.valueBasedFormArray.valid
    ) {
      const values = this.weightValueConfigDetailsForm.getRawValue();

      const valueBased: BasedWeightValueConfig[] = [];
      values.valueBasedFormArray.forEach(
        (element: {
          valueRowId: any;
          valueStartLimit: any;
          valueEndLimit: any;
          valueTolerance: any;
        }) => {
          if (
            element.valueStartLimit &&
            element.valueEndLimit &&
            element.valueTolerance
          ) {
            valueBased.push({
              rowId: element.valueRowId,
              fromRange: element.valueStartLimit,
              toRange: element.valueEndLimit,
              tolerancePercent: element.valueTolerance
            });
          }
        }
      );

      const weightBased: BasedWeightValueConfig[] = [];
      values.weightBasedFormArray.forEach(
        (element: {
          weightRowId: any;
          weightStartLimit: any;
          weightEndLimit: any;
          weightTolerance: any;
        }) => {
          if (
            element.weightStartLimit &&
            element.weightEndLimit &&
            element.weightTolerance
          ) {
            weightBased.push({
              rowId: element.weightRowId,
              fromRange: element.weightStartLimit,
              toRange: element.weightEndLimit,
              toleranceValue: element.weightTolerance
            });
          }
        }
      );
      const data: DataWeightValueConfig = {
        valueBased,
        weightBased
      };

      const submitData: WeightValueConfigDetails = {
        description: values.configName,
        isActive: values.isActive,

        ruleId: this.weightValueConfigDetails.ruleId,
        ruleType: this.weightValueConfigDetails.ruleType,
        ruleDetails: {
          type: this.weightValueConfigDetails.ruleDetails.type,
          data
        }
      };
      this.formOutput.emit(submitData);
    }
  }
  valueRowEditingStarted(event) {
    this.valueEditMode = true;
    if (this.valueGridApi === event.api) {
      this.weightGridApi.stopEditing();
    }
    this.save = false;
  }
  weightRowEditingStarted(event) {
    this.weightEditMode = true;
    if (this.weightGridApi === event.api) {
      this.valueGridApi.stopEditing();
    }
  }
  deleteWeightFormControls(rowIndex: number) {
    this.weightBasedFormArray.removeAt(rowIndex);
    this.weightBasedRowData.splice(rowIndex, 1);
  }
  deleteValueFormControls(rowIndex: number) {
    this.valueBasedFormArray.removeAt(rowIndex);
  }

  openLocationMapping() {
    if (
      this.weightValueConfigDetails?.description !== '' &&
      !this.weightValueConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openLocationMappingEvent.emit(true);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // AgGrid
  initAgGrid() {
    this.translationService
      .get([
        'pw.weightValueConfig.startingRange',
        'pw.weightValueConfig.endingRange',
        'pw.weightValueConfig.startingLimit',
        'pw.weightValueConfig.endingLimit',
        'pw.weightValueConfig.tolerenceAllowedPercentage',
        'pw.weightValueConfig.tolerenceAllowed'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.weightBasedColumnDefs = [
          {
            width: 50,
            checkboxSelection: true

          },
          {
            headerName:
              translatedMessages['pw.weightValueConfig.startingRange'],
            field: 'startRange',
            editable: true,

            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,

            flex: 1,
            isWeight: true,
            suppressSizeToFit: true,

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
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return params.value.isValid === false;
              }
            }

          },
          {
            headerName: translatedMessages['pw.weightValueConfig.endingRange'],
            field: 'endRange',
            editable: true,

            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,

            flex: 1,
            isWeight: true,
            suppressSizeToFit: true,
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
            cellEditor: 'inputValidator',
            cellClassRules: {
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName:
              translatedMessages['pw.weightValueConfig.tolerenceAllowed'],
            field: 'tolerenceAllowed',
            editable: true,
            cellEditor: 'inputValidator',
            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,
            width: 170,


            suppressSizeToFit: true,
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
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid) {
                  this.inValidWeightTolerance = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.inValidWeightTolerance = true;
                }
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName: '',
            width: 21,
            cellClass: 'pw-delete-icon-width',
            resizable: true,
            suppressSizeToFit: true,
            cellRenderer: 'deleteRowRenderer',
            onCellClicked: this.remove.bind(this)
          }
        ];
        this.valueBasedcolumnDefs = [
          {

            checkboxSelection: true,
            width: 50
          },
          {
            headerName:
              translatedMessages['pw.weightValueConfig.startingLimit'],
            field: 'startRange',
            editable: true,
            cellEditor: 'inputValidator',
            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,

            flex: 1,
            isAmount: true,
            suppressSizeToFit: true,
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
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return params.value.isValid === false;
              }
            }

          },
          {
            headerName: translatedMessages['pw.weightValueConfig.endingLimit'],
            field: 'endRange',
            editable: true,
            cellEditor: 'inputValidator',
            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,

            flex: 1,
            isAmount: true,
            suppressSizeToFit: true,
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
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName:
              translatedMessages[
                'pw.weightValueConfig.tolerenceAllowedPercentage'
              ],
            field: 'tolerenceAllowed',
            editable: true,
            cellEditor: 'inputValidator',
            cellRenderer: 'editItemRenderer',
            singleClickEdit: true,
            resizable: true,
            width: 170,


            suppressSizeToFit: true,
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
              'pw-gray-border': (params: { value: { isValid: boolean } }) => {
                if (params.value.isValid) {
                  this.inValidValueTolerance = false;
                }
                return params.value.isValid === true;
              },
              'pw-error-border': (params: {
                value: { isValid: boolean; value: string };
              }) => {
                if (params.value.isValid === false) {
                  this.inValidValueTolerance = true;
                }
                return params.value.isValid === false;
              }
            }
          },
          {
            headerName: '',
            width: 21,
            cellClass: 'pw-delete-icon-width',
            resizable: true,
            suppressSizeToFit: true,
            cellRenderer: 'deleteRowRenderer',
            onCellClicked: this.remove.bind(this)
          }
        ];
      });
  }

  onSelectionChanged(event) {
    if (this.weightGridApi === event.api) {
      this.valueGridApi.stopEditing();
      if (this.weightGridApi.getSelectedNodes().length) {
        this.disableWeightBased = false;

        this.selectedRowIndex = this.weightGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableWeightBased = true;
      }
    } else if (this.valueGridApi === event.api) {
      this.weightGridApi.stopEditing();

      if (this.valueGridApi.getSelectedNodes().length) {
        this.disableValueBased = false;

        this.selectedRowIndex = this.valueGridApi.getSelectedNodes()[0].rowIndex;
      } else {
        this.disableValueBased = true;
      }
    }
  }
  showErrorPopUp() {
    if (
      this.weightEndRangeGreaterThanPrevStartRange ||
      this.weightEndRangeLessThanStartRange ||
      this.weightStartRangeLessThanPrevEndRange ||
      this.weightEmptyRow ||
      this.valueEndRangeGreaterThanPrevStartRange ||
      this.valueEndRangeLessThanStartRange ||
      this.valueStartRangeLessThanPrevEndRange ||
      this.valueEmptyRow
    ) {
      this.save = true;
      this.isConfirmPopUp = false;

      let errorMessage;

      if (this.weightEmptyRow || this.valueEmptyRow) {
        errorMessage = this.errorMessageForNull;
      } else if (
        this.weightEndRangeGreaterThanPrevStartRange ||
        this.valueEndRangeGreaterThanPrevStartRange
      ) {
        errorMessage = this
          .errorMessageForCurrentEndRangeGreaterThanNextStartRange;
      } else if (
        this.valueEndRangeLessThanStartRange ||
        this.weightEndRangeLessThanStartRange
      ) {
        errorMessage = this.errorMessageForCurrentEndRangeLessThanStartRange;
      } else if (
        this.weightStartRangeLessThanPrevEndRange ||
        this.valueStartRangeLessThanPrevEndRange
      ) {
        errorMessage = this
          .errorMessageForCurrentStartRangeLessThanPreviousEndRange;
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
            this.weightEndRangeGreaterThanPrevStartRange = false;
            this.weightEndRangeLessThanStartRange = false;
            this.weightStartRangeLessThanPrevEndRange = false;
            this.weightEmptyRow = false;
            this.valueEndRangeGreaterThanPrevStartRange = false;
            this.valueEndRangeLessThanStartRange = false;
            this.valueStartRangeLessThanPrevEndRange = false;
            this.valueEmptyRow = false;
          });
      }
    } else {
      this.save = false;
    }
  }
  rowValueChanged(changeEvent: RowValueChangedEvent) {
    this.isConfirmPopUp = true;
    this.dialogOpen = false;
    if (changeEvent.api === this.weightGridApi) {
      this.weightEditMode = false;
      this.checkWeightValidation(this.getAllWeightBasedRows());

      this.addData(this.weightGridApi);

      this.weightBasedFormArray.at(changeEvent.rowIndex)?.patchValue({
        weightStartLimit: changeEvent.data.startRange.value,
        weightEndLimit: changeEvent.data.endRange.value,
        weightTolerance: changeEvent.data.tolerenceAllowed.value
      });
    } else if (changeEvent.api === this.valueGridApi) {
      this.valueEditMode = false;
      this.checkValueValidation(this.getAllValueBasedRows());

      this.addData(this.valueGridApi);
      this.valueBasedFormArray.at(changeEvent.rowIndex)?.patchValue({
        valueStartLimit: changeEvent.data.startRange.value,
        valueEndLimit: changeEvent.data.endRange.value,
        valueTolerance: changeEvent.data.tolerenceAllowed.value
      });
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      editItemRenderer: EditItemComponent,
      deleteRowRenderer: DeleteRowComponent
    };
  }

  addData(api) {
    if (api === this.weightGridApi) {
      if (this.isAbove === true) {
        if (this.getAllWeightBasedRows().length > 1) {
          if (
            this.weightEmptyRow === false &&
            this.weightEndRangeGreaterThanPrevStartRange === false &&
            this.weightEndRangeLessThanStartRange === false &&
            this.weightStartRangeLessThanPrevEndRange === false
          ) {
            this.weightBasedRowData.splice(this.selectedRowIndex, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.weightBasedRowData = this.weightBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.weightGridApi.setRowData(this.weightBasedRowData);
            this.disableWeightBased = true;
            this.createUpdatedWeightBasedFormArray(this.weightBasedRowData);
          }
        } else if (this.getAllWeightBasedRows().length === 1) {
          if (
            this.weightEndRangeLessThanStartRange === false &&
            this.weightEmptyRow === false
          ) {
            this.weightBasedRowData.splice(this.selectedRowIndex, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.weightBasedRowData = this.weightBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.weightGridApi.setRowData(this.weightBasedRowData);
            this.disableWeightBased = true;
            this.createUpdatedWeightBasedFormArray(this.weightBasedRowData);
          }
        }
      } else if (this.isAbove === false) {
        if (this.getAllWeightBasedRows().length > 1) {
          if (
            this.weightEndRangeGreaterThanPrevStartRange === false &&
            this.weightEndRangeLessThanStartRange === false &&
            this.weightEmptyRow === false &&
            this.weightStartRangeLessThanPrevEndRange === false
          ) {
            this.weightBasedRowData.splice(this.selectedRowIndex + 1, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });
            this.weightBasedRowData = this.weightBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.weightGridApi.setRowData(this.weightBasedRowData);
            this.disableWeightBased = true;
            this.createUpdatedWeightBasedFormArray(this.weightBasedRowData);
          }
        } else if (this.getAllWeightBasedRows().length === 1) {
          if (
            this.weightEndRangeLessThanStartRange === false &&
            this.weightEmptyRow === false
          ) {
            this.weightBasedRowData.splice(this.selectedRowIndex + 1, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.weightBasedRowData = this.weightBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.weightGridApi.setRowData(this.weightBasedRowData);
            this.disableWeightBased = true;
            this.createUpdatedWeightBasedFormArray(this.weightBasedRowData);
          }
        }
      }
    } else if (api === this.valueGridApi) {
      if (this.isAbove === true) {
        if (this.getAllValueBasedRows().length > 1) {
          if (
            this.valueEndRangeGreaterThanPrevStartRange === false &&
            this.valueEndRangeLessThanStartRange === false &&
            this.valueEmptyRow === false &&
            this.valueStartRangeLessThanPrevEndRange === false
          ) {
            this.valueBasedRowData.splice(this.selectedRowIndex, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.valueBasedRowData = this.valueBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.valueGridApi.setRowData(this.valueBasedRowData);
            this.disableValueBased = true;
            this.createUpdatedValueBasedFormArray(this.valueBasedRowData);
          }
        } else if (this.getAllValueBasedRows().length === 1) {
          if (
            this.valueEndRangeLessThanStartRange === false &&
            this.valueEmptyRow === false
          ) {
            this.valueBasedRowData.splice(this.selectedRowIndex, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.valueBasedRowData = this.valueBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.valueGridApi.setRowData(this.valueBasedRowData);
            this.disableValueBased = true;
            this.createUpdatedValueBasedFormArray(this.valueBasedRowData);
          }
        }
      } else if (this.isAbove === false) {
        if (this.getAllValueBasedRows().length > 1) {
          if (
            this.valueEndRangeGreaterThanPrevStartRange === false &&
            this.valueEndRangeLessThanStartRange === false &&
            this.valueEmptyRow === false &&
            this.valueStartRangeLessThanPrevEndRange === false
          ) {
            this.valueBasedRowData.splice(this.selectedRowIndex + 1, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });
            this.valueBasedRowData = this.valueBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.valueGridApi.setRowData(this.valueBasedRowData);
            this.disableValueBased = true;
            this.createUpdatedValueBasedFormArray(this.valueBasedRowData);
          }
        } else if (this.getAllValueBasedRows().length === 1) {
          if (
            this.valueEndRangeLessThanStartRange === false &&
            this.valueEmptyRow === false
          ) {
            this.valueBasedRowData.splice(this.selectedRowIndex + 1, 0, {
              rowId: '',
              startRange: '',
              endRange: '',
              tolerenceAllowed: '',
              new: true
            });

            this.valueBasedRowData = this.valueBasedRowData.map(ob => ({
              ...ob,
              rowId: (this.i++).toString()
            }));

            this.valueGridApi.setRowData(this.valueBasedRowData);
            this.disableValueBased = true;
            this.createUpdatedValueBasedFormArray(this.valueBasedRowData);
          }
        }
      }
    }
    this.isAbove = undefined;
  }
  getWeightContext() {
    return {
      validators: {
        startRange: [
          this.fieldValidatorsService.requiredField(this.weightStartRangeLabel)
        ],
        endRange: [
          this.fieldValidatorsService.requiredField(this.weightEndRangeLabel)
        ],
        tolerenceAllowed: [
          this.fieldValidatorsService.requiredField(this.weightToleranceLabel),
          this.fieldValidatorsService.toleranceField(this.weightToleranceLabel)
        ]
      },
      componentParent: this.weightValueConfigDetailsComponent,
      focusOn: 'startRange'
    };
  }

  getValueContext() {
    return {
      validators: {
        startRange: [
          this.fieldValidatorsService.requiredField(this.valueStartRangeLabel)
        ],
        endRange: [
          this.fieldValidatorsService.requiredField(this.valueEndRangeLabel)
        ],
        tolerenceAllowed: [
          this.fieldValidatorsService.requiredField(this.valueToleranceLable),
          this.fieldValidatorsService.percentageField(this.valueToleranceLable)
        ]
      },
      componentParent: this.weightValueConfigDetailsComponent,
      focusOn: 'startRange'
    };
  }
  weightGridReady(params: GridReadyEvent) {
    this.weightGridApi = params.api;
  }

  valueGridReady(params: GridReadyEvent) {
    this.valueGridApi = params.api;
  }

  remove(params: CellEvent) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.clubbingDiscounts.deleteRuleMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.i = 1;
          if (this.weightGridApi === params.api) {

            if (params.data.new === false) {
              this.deleteWeightFormControls(params.rowIndex);

              this.prepareResponseForWeightDelete();
            }
            if (this.getAllWeightBasedRows().length === 1) {
              this.alldeleted = true;
              this.weightGridApi.applyTransaction({ remove: [params.data] });
              this.weightGridApi.applyTransaction({
                add: [
                  {
                    rowId: 1,
                    startRange: '',
                    endRange: '',
                    tolerenceAllowed: ''
                  }
                ]
              });
              this.deleteWeightFormControls(params.rowIndex);
              this.weightBasedFormArray.push(
                this.fb.group({
                  weightRowId: new FormControl(1),
                  weightStartLimit: new FormControl(''),
                  weightEndLimit: new FormControl(''),
                  weightTolerance: new FormControl('')
                })
              );

              this.weightBasedRowData = [
                {
                  rowId: '1',
                  startRange: '',
                  endRange: '',
                  tolerenceAllowed: '',
                  new: true
                }
              ];

              this.weightGridApi.redrawRows();
            } else {
              this.selectedRowIndex = 0;
              this.weightGridApi.applyTransaction({ remove: [params.data] });
              this.deleteWeightFormControls(params.rowIndex);

              this.weightBasedRowData = this.weightBasedRowData.map(ob => ({
                ...ob,
                rowId: (this.i++).toString()
              }));

              this.createUpdatedWeightBasedFormArray(this.weightBasedRowData);

              this.weightGridApi.applyTransaction({
                add: this.weightBasedRowData
              });
              this.weightGridApi.redrawRows();
            }
          } else if (this.valueGridApi === params.api) {
            // Value based
            if (params.data.new === false) {
              this.deleteValueFormControls(params.rowIndex);
                this.prepareResponseForValueDelete();
            }
            if (this.getAllValueBasedRows().length === 1) {
              this.valueGridApi.applyTransaction({ remove: [params.data] });
              this.valueGridApi.applyTransaction({
                add: [
                  {
                    rowId: 1,
                    startRange: '',
                    endRange: '',
                    tolerenceAllowed: ''
                  }
                ]
              });
              this.valueGridApi.redrawRows();
              this.deleteValueFormControls(params.rowIndex);
              this.valueBasedFormArray.push(
                this.fb.group({
                  valueRowId: new FormControl(1),
                  valueStartLimit: new FormControl(''),
                  valueEndLimit: new FormControl(''),
                  valueTolerance: new FormControl('')
                })
              );

              this.valueBasedRowData = [
                {
                  rowId: '1',
                  startRange: '',
                  endRange: '',
                  tolerenceAllowed: '',
                  new: true
                }
              ];
            } else {

              this.valueBasedRowData.splice(params.rowIndex, 1);
              this.deleteValueFormControls(params.rowIndex);
              this.valueBasedRowData = this.valueBasedRowData.map(ob => ({
                ...ob,
                rowId: (this.i++).toString()
              }));

              this.createUpdatedValueBasedFormArray(this.valueBasedRowData);

              this.valueGridApi.applyTransaction({
                add: this.valueBasedRowData
              });

              this.valueGridApi.redrawRows();
            }
          }
          this.cdr.markForCheck();
        }
      });
  }
  // AgGrid end
}
