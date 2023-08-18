import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  OnChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import {
  BgrConfigDetails,
  OtherOptionTypes,
  GoldRateTypesEnum,
  WeightValueConfigConstants,
  DateFormatEnum,
  OrderTypesEnum,
  ConfigTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  DataBgrConfig,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';

@Component({
  selector: 'poss-web-ui-bgr-config-detail',
  templateUrl: './bgr-config-detail.component.html',
  styleUrls: ['./bgr-config-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgrConfigDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() bgrConfigDetails: BgrConfigDetails;
  @Input() routeParam: Observable<Params>;
  @Input() isConfigNameInValid: boolean;
  @Input() configDetails: BgrConfigDetails;

  @Output() formOutput = new EventEmitter<BgrConfigDetails>();
  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  destroy$ = new Subject();
  configName: string;
  descriptionLabel: string;
  save = true;
  editMode = false;
  errorDialogReference;
  currentDate = moment();
  currentYear = moment().year();
  bgrOfferFirstDay = moment();
  goldRateTypesEnum = GoldRateTypesEnum;
  otherOptionTypes = OtherOptionTypes;
  otherOptions = [];
  orderTypes = [OrderTypesEnum.ADVANCE_BOOKING];
  bgrConfigDetailsForm: FormGroup;
  particularDay = '';
  bookingDay = '';
  currentDay = '';
  isNew = false;
  isLastGoldRateSelected = false;
  i = 1;
  constructor(
    public fb: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translationService
      .get([
        'pw.bgrConfigurations.configName',
        'pw.bgrConfigurations.particularDayGoldRate',
        'pw.bgrConfigurations.bookingDayGoldRate',
        'pw.bgrConfigurations.currentDayGoldRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.configName = translatedMsg['pw.bgrConfigurations.configName'];
        this.particularDay =
          translatedMsg['pw.bgrConfigurations.particularDayGoldRate'];
        this.bookingDay =
          translatedMsg['pw.bgrConfigurations.bookingDayGoldRate'];
        this.currentDay =
          translatedMsg['pw.bgrConfigurations.currentDayGoldRate'];
      });
  }

  ngOnInit() {
    this.otherOptions = [
      {
        description: this.particularDay,
        value: OtherOptionTypes.PARTICULAR_DATE
      },
      {
        description: this.currentDay,
        value: OtherOptionTypes.CURRENT_DATE
      },
      {
        description: this.bookingDay,
        value: OtherOptionTypes.BOOKING_DATE
      }
    ];
    this.initForm(this.bgrConfigDetails);
    this.bgrConfigDetailsForm
    .get('bgrOfferFirstDay')
    .valueChanges.pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      const startDate = this.bgrConfigDetailsForm.get(
        'bgrRedemptionFirstDay'
      );
      startDate.setValidators([
        this.startDateValidator(startDate)
      ]);
      startDate.markAsTouched();
      startDate.updateValueAndValidity();
    });
  }

  minDateValidation() {
    const startDate = this.bgrConfigDetailsForm.get('bgrRedemptionFirstDay');
    startDate.setValidators([this.startDateValidator(startDate.value)]);
    startDate.markAsTouched();
    startDate.updateValueAndValidity();
  }

  startDateValidator(selectedDate: any): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      this.bgrOfferFirstDay = moment(
        this.bgrConfigDetailsForm.get('bgrOfferFirstDay').value
      );
      if (
        !moment(selectedDate).isSame(this.bgrOfferFirstDay) &&
        moment(selectedDate).isBefore(this.bgrOfferFirstDay)
      ) {
        return { invalidDateSelected: true };
      } else {
        return null;
      }
    };
  }

  ngOnChanges(): void {
    this.routeParam.subscribe(param1 => {
      if (param1['_configId'] === WeightValueConfigConstants.NEW) {
        this.isNew = true;
      } else {
        this.isNew = false;
      }
      this.cd.markForCheck();
    });
    this.save = true;
  }

  initForm(bgrConfigDetails: BgrConfigDetails) {
    const bgrOfferFromDate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.bgrOfferFromDate
        ? moment(bgrConfigDetails.ruleDetails.data.bgrOfferFromDate)
        : DateFormatEnum.DATE_FORMAT;
    const bgrOfferToDate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.bgrOfferToDate
        ? moment(bgrConfigDetails.ruleDetails.data.bgrOfferToDate)
        : DateFormatEnum.DATE_FORMAT;
    const redemptionFromDate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.redemptionPeriodFromDate
        ? moment(bgrConfigDetails.ruleDetails.data.redemptionPeriodFromDate)
        : DateFormatEnum.DATE_FORMAT;
    const redemptionToDate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.redemptionPeriodToDate
        ? moment(bgrConfigDetails.ruleDetails.data.redemptionPeriodToDate)
        : DateFormatEnum.DATE_FORMAT;
    const downSideAmount =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.downSideAmount
        ? bgrConfigDetails.ruleDetails.data.downSideAmount
        : 0.0;

    const isFirstGoldRate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.otherDetails &&
      bgrConfigDetails.ruleDetails.data.otherDetails.applicableRate ===
        'FIRST_RATE'
        ? true
        : false;
    const isLastGoldRate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.otherDetails &&
      bgrConfigDetails.ruleDetails.data.otherDetails.applicableRate ===
        'LAST_RATE'
        ? true
        : false;
    const applicableGoldRate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.applicableRateDate
        ? bgrConfigDetails.ruleDetails.data.applicableRateDate
        : '';
    const applicableDate =
      bgrConfigDetails.ruleDetails &&
      bgrConfigDetails.ruleDetails.data &&
      bgrConfigDetails.ruleDetails.data.otherDetails &&
      bgrConfigDetails.ruleDetails.data.otherDetails.applicableDate
        ? moment(bgrConfigDetails.ruleDetails.data.otherDetails.applicableDate)
        : DateFormatEnum.DATE_FORMAT;
    let selectedGoldRateType = this.goldRateTypesEnum.FIRST_GOLD_RATE;
    if (isFirstGoldRate && !isLastGoldRate) {
      selectedGoldRateType = this.goldRateTypesEnum.FIRST_GOLD_RATE;
    } else if (!isFirstGoldRate && isLastGoldRate) {
      this.isLastGoldRateSelected = true;
      selectedGoldRateType = this.goldRateTypesEnum.LAST_GOLD_RATE;
    }

    this.bgrConfigDetailsForm = new FormGroup({
      bgrOfferFirstDay: new FormControl(bgrOfferFromDate, [
        this.fieldValidatorsService.requiredField('BGR Offer From Date')
      ]),
      bgrOfferLastDay: new FormControl(bgrOfferToDate, [
        this.fieldValidatorsService.requiredField('BGR Offer To Date')
      ]),
      bgrRedemptionFirstDay: new FormControl(redemptionFromDate, [
        this.fieldValidatorsService.requiredField('Redemption From Date')
      ]),
      bgrRedemptionLastDay: new FormControl(redemptionToDate, [
        this.fieldValidatorsService.requiredField('Redemption To Date')
      ]),
      downSideAmount: new FormControl(downSideAmount, [
        this.fieldValidatorsService.requiredField('Downside Amount'),
        this.fieldValidatorsService.amountField(
          'Downside Amount',
          null,
          null,
          true
        )
      ]),
      otherOption: new FormControl(
        this.setOtherOptionField(applicableGoldRate),
        [this.fieldValidatorsService.requiredField('Other Option')]
      ),
      selectedGoldRateType: new FormControl(selectedGoldRateType),
      // numberOfDays: new FormControl(noOfDaysFromCurrentDate),
      applicableDate: new FormControl(applicableDate)
    });
    this.validateApplicableGoldRateSelected(
      this.bgrConfigDetailsForm.get('otherOption').value
    );
  }

  setOtherOptionField(otherOption: string): string {
    const selectedOtherOptionObject = this.otherOptions.filter(option => {
      return option.value === otherOption;
    });
    return selectedOtherOptionObject && selectedOtherOptionObject[0]
      ? selectedOtherOptionObject[0].value
      : null;
  }

  onOtherOptionChanged(event: any) {
    this.validateApplicableGoldRateSelected(event.value);
  }

  validateApplicableGoldRateSelected(optionSelected: string) {
    if (optionSelected === OtherOptionTypes.PARTICULAR_DATE) {
      const applicableGoldRate = this.isLastGoldRateSelected
        ? this.goldRateTypesEnum.LAST_GOLD_RATE
        : this.goldRateTypesEnum.FIRST_GOLD_RATE;
      this.bgrConfigDetailsForm
        .get('selectedGoldRateType')
        .setValue(applicableGoldRate);
      this.bgrConfigDetailsForm
        .get('applicableDate')
        .setValidators([
          this.fieldValidatorsService.requiredField('Applicable Date')
        ]);
      this.bgrConfigDetailsForm
        .get('selectedGoldRateType')
        .setValidators([
          this.fieldValidatorsService.requiredField('Selected Gold Rate Type')
        ]);
    } else {
      this.isLastGoldRateSelected = false;
      this.bgrConfigDetailsForm.get('applicableDate').setValue('');
      this.bgrConfigDetailsForm.get('applicableDate').setValidators([]);
      this.bgrConfigDetailsForm.get('selectedGoldRateType').setValue('');
      this.bgrConfigDetailsForm.get('selectedGoldRateType').setValidators([]);
    }
    this.bgrConfigDetailsForm.get('applicableDate').updateValueAndValidity();
    this.bgrConfigDetailsForm
      .get('selectedGoldRateType')
      .updateValueAndValidity();
  }

  onSubmit() {
    if (this.configDetails?.description && !this.configDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.bgrConfigDetailsForm.dirty) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.alertPopup.saveConfirmation'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res) {
              if (this.bgrConfigDetailsForm.valid) {
                const values = this.bgrConfigDetailsForm.getRawValue();
                let bgrRuleData: DataBgrConfig = {
                  bgrOfferFromDate: moment(values.bgrOfferFirstDay)
                    .startOf('day')
                    .valueOf(),
                  bgrOfferToDate: moment(values.bgrOfferLastDay)
                    .endOf('day')
                    .valueOf(),
                  redemptionPeriodFromDate: moment(values.bgrRedemptionFirstDay)
                    .startOf('day')
                    .valueOf(),
                  redemptionPeriodToDate: moment(values.bgrRedemptionLastDay)
                    .endOf('day')
                    .valueOf(),
                  downSideAmount: values.downSideAmount.toString(),
                  applicableRateDate: values.otherOption
                };
                if (values.otherOption === OtherOptionTypes.PARTICULAR_DATE) {
                  bgrRuleData = {
                    ...bgrRuleData,
                    otherDetails: {
                      applicableRate:
                        values.selectedGoldRateType ===
                        this.goldRateTypesEnum.FIRST_GOLD_RATE
                          ? 'FIRST_RATE'
                          : 'LAST_RATE',
                      applicableDate: moment(values.applicableDate)
                        .startOf('day')
                        .valueOf()
                    }
                  };
                }
                const submitData: BgrConfigDetails = {
                  // description: values.configName,
                  // isActive: values.isActive,

                  ruleId: this.bgrConfigDetails.ruleId,
                  ruleType: this.bgrConfigDetails.ruleType,
                  ruleDetails: {
                    type: this.bgrConfigDetails.ruleDetails.type,
                    data: bgrRuleData
                  }
                };
                this.formOutput.emit(submitData);
              }
            }
          });
        // dialogReference
        //   .afterClosed()
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe(result => {
        //     if (result) {
        //       if (this.bgrConfigDetailsForm.valid) {
        //         const values = this.bgrConfigDetailsForm.getRawValue();
        //         let bgrRuleData: DataBgrConfig = {
        //           BGROfferFromdate: values.bgrOfferFirstDay,
        //           BGROfferTodate: values.bgrOfferLastDay,
        //           redemptionFromDate: values.bgrRedemptionFirstDay,
        //           redemptionToDate: values.bgrRedemptionLastDay,
        //           downSideAmount: values.downSideAmount,
        //           applicableGoldRate: values.otherOption,
        //           noOfDaysFromCurrentDate: values.numberOfDays
        //         };
        //         if (values.otherOption === OtherOptionTypes.PARTICULAR_DATE) {
        //           bgrRuleData = {
        //             ...bgrRuleData,
        //             otherDetails: {
        //               isFirstGoldRate:
        //                 values.selectedGoldRateType ===
        //                 this.goldRateTypesEnum.FIRST_GOLD_RATE
        //                   ? true
        //                   : false,
        //               applicableDate: values.applicableDate
        //             }
        //           };
        //         }
        //         const submitData: BgrConfigDetails = {
        //           // description: values.configName,
        //           // isActive: values.isActive,

        //           ruleId: this.bgrConfigDetails.ruleId,
        //           ruleType: this.bgrConfigDetails.ruleType,
        //           ruleDetails: {
        //             type: this.bgrConfigDetails.ruleDetails.type,
        //             data: bgrRuleData
        //           }
        //         };
        //         this.formOutput.emit(submitData);
        //       }
        //     }
        //   });
      }
      this.editMode = false;
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

  onOrderTypeChanged(event) {
    if (event === OrderTypesEnum.ADVANCE_BOOKING) {
      this.bgrConfigDetails.ruleType = ConfigTypeEnum.BGR_CONFIG;
    }
  }

  openLocationMapping() {
    if (this.configDetails?.description && !this.configDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else this.openLocationMappingEvent.emit(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
