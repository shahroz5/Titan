import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  HelperFunctions,
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails,
  LocationTypeLists,
  OverlayNotificationServiceAbstraction,
} from '@poss-web/shared/models';
import {
  PaymentDetailsModel,
  PaymentMainFormModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-payments-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private helperFunctions: HelperFunctions,
    private fieldValidatorsService: FieldValidatorsService,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Output() formOutput = new EventEmitter<LocationMasterDetails>();

  destroy$: Subject<null> = new Subject<null>();

  public formFields: any;
  public currentStyle: string[];

  ngOnInit(): void {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet() {
    // ---------------------
    const paymentDetailsCheckbox1 = [
      {
        id: '1',
        name: 'pw.locationMaster.isEncirclePaymentAllowed',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.isUlpAllowed
            ? this.locationDetails.paymentDetails.data.isUlpAllowed
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.enableCNCancellationForGVPayment',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data
              .enableCNCancellationForGVPayment
            ? this.locationDetails.paymentDetails.data
                .enableCNCancellationForGVPayment
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.enableCNTransferFORGVPayment',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data
              .enableCNTarnsferForGVpayment
            ? this.locationDetails.paymentDetails.data
                .enableCNTarnsferForGVpayment
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.IsmultipleGVallowedforGVsearch',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.isMultipleGVAllowed
            ? this.locationDetails.paymentDetails.data.isMultipleGVAllowed
            : false
          : false
      }
    ];
    const paymentDetailsCheckbox2 = [
      {
        id: '1',
        name: 'pw.locationMaster.enableRTGSpayment',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.rtgs
            ? this.locationDetails.paymentDetails.data.rtgs.enableRtgsPayment
              ? this.locationDetails.paymentDetails.data.rtgs.enableRtgsPayment
              : false
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isRRnumbervalidationrequired',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.rtgs
            ? this.locationDetails.paymentDetails.data.rtgs.isRRNumberValidation
              ? this.locationDetails.paymentDetails.data.rtgs
                  .isRRNumberValidation
              : false
            : false
          : false
      }
    ];
    const paymentDetailsCheckbox3 = [
      {
        id: '1',
        name: 'pw.locationMaster.ROApprovedbyWorkflow',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.rtgs
            ? this.locationDetails.paymentDetails.data.rtgs
                .isROApprovedByWorkflow
              ? this.locationDetails.paymentDetails.data.rtgs
                  .isROApprovedByWorkflow
              : false
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.EnableAirpayforIntegration',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.rtgs
            ? this.locationDetails.paymentDetails.data.rtgs
                .isEnableAirpayForIntegration
              ? this.locationDetails.paymentDetails.data.rtgs
                  .isEnableAirpayForIntegration
              : false
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.EnableuniPAYIntegration',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data.rtgs
            ? this.locationDetails.paymentDetails.data.rtgs
                .isEnableUnipayForIntegration
              ? this.locationDetails.paymentDetails.data.rtgs
                  .isEnableUnipayForIntegration
              : false
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.EnableRazorpayIntegration',
        checked: this.locationDetails.paymentDetails
          ? this.locationDetails.paymentDetails.data
            ? this.locationDetails.paymentDetails.data.isRazorPayEnabled
              ? this.locationDetails.paymentDetails.data.isRazorPayEnabled
              : false
            : false
          : false
      }
    ];

    // this.locationDetails.paymentDetails ? this.locationDetails.paymentDetails.data.activeROPayment ? this.locationDetails.paymentDetails.data.activeROPayment : '' : '',
    const paymentDetailsModel = new PaymentDetailsModel(
      1,
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.chequeValidityDays
          ? this.locationDetails.paymentDetails.data.chequeValidityDays
          : ''
        : '',
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.ddValidityDays
          ? this.locationDetails.paymentDetails.data.ddValidityDays
          : ''
        : '',
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.realisationDays
          ? this.locationDetails.paymentDetails.data.realisationDays
          : ''
        : '',
      paymentDetailsCheckbox1,
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.approvedRORequestDeletion
          ? this.locationDetails.paymentDetails.data.approvedRORequestDeletion
          : ''
        : '',
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.pendingRORequestDeletion
          ? this.locationDetails.paymentDetails.data.pendingRORequestDeletion
          : ''
        : '',
      paymentDetailsCheckbox2,
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.rtgs
          ? this.locationDetails.paymentDetails.data.rtgs.maximumAmount
            ? this.locationDetails.paymentDetails.data.rtgs.maximumAmount
            : ''
          : ''
        : '',
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.rtgs
          ? this.locationDetails.paymentDetails.data.rtgs.minimumAmount
            ? this.locationDetails.paymentDetails.data.rtgs.minimumAmount
            : ''
          : ''
        : '',
      this.locationDetails.paymentDetails
        ? this.locationDetails.paymentDetails.data.rtgs
          ? this.locationDetails.paymentDetails.data.rtgs
              .noOfDaysForChequeOrDDAcceptance
            ? this.locationDetails.paymentDetails.data.rtgs
                .noOfDaysForChequeOrDDAcceptance
            : ''
          : ''
        : '',
      paymentDetailsCheckbox3,
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new PaymentMainFormModel(1, paymentDetailsModel);

    return detailsmain;
  }

  getCssProp() {
    // const annot = (LocationFormComponent as any).__annotations__;
    // return annot[0].styles;

    return [];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.locationMaster.Payments',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,

      // isOTPallowedASSM: formData['1-otpDetailsModel']['1-otpDetailsCheckbox'][0],

      // : string,
      // : string,
      // : { id: string; name: string; selected?: boolean }[],
      // : string,
      // : string,
      // : { id: string; name: string; checked?: boolean }[],
      // : string,
      // : string,
      // : string,
      // : { id: string; name: string; checked?: boolean }[],

      paymentDetails: {
        type: LocationApiKeyEnum.PAYMENT_DETAILS,
        data: {
          chequeValidityDays:
            formData['1-paymentDetailsModel']['1-chequeValidity'],
          ddValidityDays: formData['1-paymentDetailsModel']['1-ddValidity'],
          realisationDays:
            formData['1-paymentDetailsModel']['1-chequeRealization'],
          isUlpAllowed:
            formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox1'][0],
          enableCNCancellationForGVPayment:
            formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox1'][1],
          enableCNTarnsferForGVpayment:
            formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox1'][2],
          isMultipleGVAllowed:
            formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox1'][3],
          approvedRORequestDeletion:
            formData['1-paymentDetailsModel']['1-roPayment'],
          pendingRORequestDeletion:
            formData['1-paymentDetailsModel']['1-roDeletion'],
          isRazorPayEnabled:
            formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox3'][3],
          rtgs: {
            enableRtgsPayment:
              formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox2'][0],
            isRRNumberValidation:
              formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox2'][1],
            maximumAmount: formData['1-paymentDetailsModel']['1-maxAmount'],
            minimumAmount: formData['1-paymentDetailsModel']['1-minAmount'],
            noOfDaysForChequeOrDDAcceptance:
              formData['1-paymentDetailsModel']['1-chequeDDDate'], // Date type
            isROApprovedByWorkflow:
              formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox3'][0],
            isEnableAirpayForIntegration:
              formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox3'][1],
            isEnableUnipayForIntegration:
              formData['1-paymentDetailsModel']['1-paymentDetailsCheckbox3'][2]
          }
        }
      }
    };

    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.formOutput.emit(locationDetails);
        }
      });
  }

  public formGroupCreated(formGroup: FormGroup) {
    if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
      this.translateService
        .get('pw.locationMaster.validityDays')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-chequeValidity',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.ddValidity')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-ddValidity',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.ROApprovedPayment')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-roPayment',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.RORequestDeletion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-roDeletion',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForChequeDDAcceptance')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-chequeDDDate',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.validityDays')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-chequeValidity',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.ddValidity')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-ddValidity',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.ROApprovedPayment')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-roPayment',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.RORequestDeletion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-roDeletion',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForChequeDDAcceptance')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-paymentDetailsModel',
            '1-chequeDDDate',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
    }
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.cancelConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.ngOnDestroy();
          this.destroy$ = new Subject<null>();
          this.ngOnInit();
          this.cdr.detectChanges();
        }
      });
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
