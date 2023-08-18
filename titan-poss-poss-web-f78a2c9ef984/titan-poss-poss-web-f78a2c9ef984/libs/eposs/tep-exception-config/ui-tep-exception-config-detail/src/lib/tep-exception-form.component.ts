import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  TEPExceptionConfig,
  TEPExceptionTypeEnum
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-tep-exception-form',
  templateUrl: './tep-exception-form.component.html',
  styles: [
    `
      .texwidth {
        width: 230px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TepExceptionFormComponent implements OnInit, OnDestroy {
  configNameTranslate: string;
  approvedByTranslate: string;
  fromDateTranslate: string;
  toDateTranslate: string;
  variantCodeTranslate: string;
  reasonForExceptionTranslate: string;
  deductionPercentageTranslate: string;
  flatTepExhangeValueTranslate: string;
  customerMobileNoTranslate: string;
  phoneNumber: string;
  remove: string;

  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.tepExceptionConfig.configurationName',
        'pw.tepExceptionConfig.approvedBy',
        'pw.tepExceptionConfig.fromDate',
        'pw.tepExceptionConfig.toDate',
        'pw.tepExceptionConfig.variantCode',
        'pw.tepExceptionConfig.reasonForException',
        'pw.tepExceptionConfig.deductionPercentage',
        'pw.tepExceptionConfig.flatTepExhangeValue',
        'pw.tepExceptionConfig.customerMobileNo',
        'pw.tepExceptionConfig.phoneNumber',
        'pw.tepExceptionConfig.remove'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configNameTranslate =
          translatedMsg['pw.tepExceptionConfig.configurationName'];
        this.approvedByTranslate =
          translatedMsg['pw.tepExceptionConfig.approvedBy'];
        this.fromDateTranslate =
          translatedMsg['pw.tepExceptionConfig.fromDate'];
        this.toDateTranslate = translatedMsg['pw.tepExceptionConfig.toDate'];
        this.variantCodeTranslate =
          translatedMsg['pw.tepExceptionConfig.variantCode'];
        this.reasonForExceptionTranslate =
          translatedMsg['pw.tepExceptionConfig.reasonForException'];
        this.deductionPercentageTranslate =
          translatedMsg['pw.tepExceptionConfig.deductionPercentage'];
        this.flatTepExhangeValueTranslate =
          translatedMsg['pw.tepExceptionConfig.flatTepExhangeValue'];
        this.customerMobileNoTranslate =
          translatedMsg['pw.tepExceptionConfig.customerMobileNo'];
        this.phoneNumber = translatedMsg['pw.tepExceptionConfig.phoneNumber'];
        this.remove = translatedMsg['pw.tepExceptionConfig.remove'];
      });
  }

  @Input() tepExceptionConfigDetails: TEPExceptionConfig;
  @Input() maxFlatTepExchangeValue: number;
  @Output() tepExceptionConfigDetailsFormOutput = new EventEmitter<
    TEPExceptionConfig
  >();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();
  defaultColDef = {
    suppressMovable: true
  };

  checked = false;

  gridPhoneNumber: { id: number; phoneNumber: string }[] = [];
  themeCodesColumnDefs = [];
  itemCodeColumnDefs = [];
  context = this;
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;

  tepExceptionConfigDetailsForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  api: GridApi;
  todaysDate = new Date();

  customerMobileNo: FormControl;

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  ngOnInit(): void {
    let exceptionType = '';
    if (this.tepExceptionConfigDetails.configId) {
      if (
        parseInt(
          this.tepExceptionConfigDetails?.offerDetails?.data?.deductionPercent.toString(),
          10
        )
      ) {
        exceptionType = TEPExceptionTypeEnum.DEDUCTIONPERCENTAGE;
      } else {
        exceptionType = TEPExceptionTypeEnum.FLATTEPEXCHANGEVALUE;
      }
    }

    this.checked = this.tepExceptionConfigDetails?.isActive;

    this.tepExceptionConfigDetailsForm = new FormGroup({
      configurationName: new FormControl(
        this.tepExceptionConfigDetails?.description || '',
        [
          this.fieldValidatorsService.requiredField(this.configNameTranslate),
          this.fieldValidatorsService.descriptionField(
            this.configNameTranslate
          ),
          this.fieldValidatorsService.maxLength(100, this.configNameTranslate)
        ]
      ),
      approvedBy: new FormControl(
        this.tepExceptionConfigDetails?.offerDetails?.data?.approvedBy || '',
        [
          this.fieldValidatorsService.requiredField(this.approvedByTranslate),
          this.fieldValidatorsService.alphabetWithSpaceField(
            this.approvedByTranslate
          ),
          this.fieldValidatorsService.maxLength(100, this.approvedByTranslate)
        ]
      ),
      fromDate: new FormControl(
        this.tepExceptionConfigDetails?.startDate
          ? new Date(this.tepExceptionConfigDetails?.startDate) || ''
          : '',
        [this.fieldValidatorsService.requiredField(this.fromDateTranslate)]
      ),
      toDate: new FormControl(
        this.tepExceptionConfigDetails?.endDate
          ? new Date(this.tepExceptionConfigDetails?.endDate) || ''
          : '',
        [this.fieldValidatorsService.requiredField(this.toDateTranslate)]
      ),
      variantCode: new FormControl(this.tepExceptionConfigDetails?.itemCode, [
        this.fieldValidatorsService.requiredField(this.variantCodeTranslate),
        this.fieldValidatorsService.alphaNumericField(this.variantCodeTranslate)
      ]),
      reasonForException: new FormControl(
        this.tepExceptionConfigDetails?.offerDetails?.data
          ?.reasonForException || '',
        [
          this.fieldValidatorsService.reasonField(
            this.reasonForExceptionTranslate
          ),
          this.fieldValidatorsService.requiredField(
            this.reasonForExceptionTranslate
          )
        ]
      ),
      exceptionTypeRadioGroup: new FormControl(exceptionType, [
        this.fieldValidatorsService.requiredField(
          this.reasonForExceptionTranslate
        )
      ]),
      deductionPercentage: new FormControl(
        this.tepExceptionConfigDetails?.offerDetails?.data?.deductionPercent ||
          '',
        [
          this.fieldValidatorsService.requiredField(
            this.deductionPercentageTranslate
          ),
          this.fieldValidatorsService.percentageField(
            this.deductionPercentageTranslate
          )
        ]
      ),
      flatTepExhangeValue: new FormControl(
        this.tepExceptionConfigDetails?.offerDetails?.data
          ?.flatTepExchangeValue || '',
        [
          this.fieldValidatorsService.requiredField(
            this.flatTepExhangeValueTranslate
          ),
          this.fieldValidatorsService.amountField(
            this.flatTepExhangeValueTranslate
          ),
          this.fieldValidatorsService.max(
            this.maxFlatTepExchangeValue,
            this.flatTepExhangeValueTranslate
          )
        ]
      ),
      wtToleranceAllowed: new FormControl(
        this.tepExceptionConfigDetails?.offerDetails?.data
          ?.isWeightToleranceAllowed || false
      )
    });

    this.setGrid();

    this.customerMobileNo = new FormControl('', [
      this.fieldValidatorsService.mobileField(this.customerMobileNoTranslate)
    ]);

    this.tepExceptionConfigDetails?.customerMobileNos.forEach(phNo => {
      this.addPhoneNumber(phNo);
    });

    if (exceptionType === '') {
      this.tepExceptionConfigDetailsForm.get('deductionPercentage').disable();
      this.tepExceptionConfigDetailsForm.get('flatTepExhangeValue').disable();
      this.tepExceptionConfigDetailsForm
        .get('deductionPercentage')
        .setValue('0');
      this.tepExceptionConfigDetailsForm
        .get('flatTepExhangeValue')
        .setValue('0');
    } else if (exceptionType === TEPExceptionTypeEnum.DEDUCTIONPERCENTAGE) {
      this.tepExceptionConfigDetailsForm.get('flatTepExhangeValue').disable();
    } else {
      this.tepExceptionConfigDetailsForm.get('deductionPercentage').disable();
    }

    this.tepExceptionConfigDetailsForm
      .get('exceptionTypeRadioGroup')
      .valueChanges.subscribe(val => {
        if (val === '') {
          this.tepExceptionConfigDetailsForm
            .get('deductionPercentage')
            .disable();
          this.tepExceptionConfigDetailsForm
            .get('flatTepExhangeValue')
            .disable();
        } else if (val === TEPExceptionTypeEnum.DEDUCTIONPERCENTAGE) {
          this.tepExceptionConfigDetailsForm
            .get('flatTepExhangeValue')
            .setValue('0');
          this.tepExceptionConfigDetailsForm
            .get('flatTepExhangeValue')
            .disable();
          this.tepExceptionConfigDetailsForm
            .get('deductionPercentage')
            .enable();
        } else {
          this.tepExceptionConfigDetailsForm
            .get('deductionPercentage')
            .setValue('0');
          this.tepExceptionConfigDetailsForm
            .get('deductionPercentage')
            .disable();
          this.tepExceptionConfigDetailsForm
            .get('flatTepExhangeValue')
            .enable();
        }
      });

    this.tepExceptionConfigDetailsForm
      .get('fromDate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const endDate = this.tepExceptionConfigDetailsForm.get('toDate');
        endDate.setValidators([
          this.fieldValidatorsService.minDate(data, 'EndDate')
        ]);
        endDate.updateValueAndValidity();
      });
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.cellRenderer === 'deleteRowRenderer') {
      this.gridPhoneNumber.splice(clickEvent.rowIndex, 1);
      this.api.setRowData(this.gridPhoneNumber);
    }
  }

  onGridSizeChanged(params: GridReadyEvent) {
    params.api.sizeColumnsToFit();
  }

  changeEvent(event) {
    this.tepExceptionConfigDetailsForm.markAsDirty();
    this.checked = event.checked;
  }

  setGrid() {
    this.themeCodesColumnDefs = [
      {
        headerName: this.phoneNumber,
        field: 'phoneNumber',
        width: 170.5,
        resizable: true
      },
      {
        headerName: '',
        field: 'id',
        cellRenderer: 'deleteRowRenderer',
        width: 21,
        minWidth: 21,
        maxWidth: 21,
        cellClass: 'pw-delete-icon-width',
        headerClass: 'pw-delete-icon-width'
      }
    ];
  }

  addPhoneNumber(phoneNumber: string) {
    if (phoneNumber) {
      this.gridPhoneNumber.push({
        phoneNumber,
        id: this.gridPhoneNumber.length
      });
      this.api?.setRowData(this.gridPhoneNumber);
    }
  }
  addPhoneNumberButton() {
    this.customerMobileNo.markAsTouched();
    if (
      this.customerMobileNo.value &&
      this.customerMobileNo.valid &&
      !this.gridPhoneNumber.find(
        o => o.phoneNumber === this.customerMobileNo.value
      )
    ) {
      this.gridPhoneNumber.push({
        phoneNumber: this.customerMobileNo.value,
        id: this.gridPhoneNumber.length
      });
      this.customerMobileNo.patchValue('');
      this.api.setRowData(this.gridPhoneNumber);
      this.customerMobileNo.markAsUntouched();
    }
  }
  onSubmit() {
    if (
      this.tepExceptionConfigDetails?.description !== '' &&
      !this.tepExceptionConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else if (
      this.gridPhoneNumber === null ||
      this.gridPhoneNumber.length === 0
    ) {
      this.showMessage('pw.tepExceptionConfig.customerMobileNoError');
    } else {
      if (this.tepExceptionConfigDetailsForm.valid) {
        const formData = this.tepExceptionConfigDetailsForm.getRawValue();
        this.tepExceptionConfigDetailsForm.markAsPristine();
        const data: TEPExceptionConfig = {
          configId: this.tepExceptionConfigDetails.configId,
          description: formData.configurationName,
          itemCode: formData.variantCode,
          configDetails: {
            data: null,
            type: null
          },
          configType: 'TEP_EXCEPTION',
          startDate: moment(formData.fromDate).startOf('day').valueOf(),
          endDate: moment(formData.toDate).endOf('day').valueOf(),
          // startDate: formData.fromDate,
          // endDate: formData.toDate,
          isActive: this.checked,
          customerMobileNos: this.gridPhoneNumber.map(val => val.phoneNumber),
          isOfferEnabled: null,
          offerDetails: {
            type: 'TEP_EXCEPTION_CONFIG',
            data: {
              approvedBy: formData.approvedBy,
              deductionPercent: formData.deductionPercentage,
              flatTepExchangeValue: formData.flatTepExhangeValue,
              isWeightToleranceAllowed: formData.wtToleranceAllowed,
              reasonForException: formData.reasonForException
            }
          }
        };
        this.tepExceptionConfigDetailsFormOutput.emit(data);
      }
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

  openLocationMapping() {
    if (
      this.tepExceptionConfigDetails?.description !== '' &&
      !this.tepExceptionConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
