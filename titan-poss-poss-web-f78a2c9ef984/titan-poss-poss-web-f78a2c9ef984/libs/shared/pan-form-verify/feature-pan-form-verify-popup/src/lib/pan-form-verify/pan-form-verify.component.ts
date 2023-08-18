import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CustomerIdDetails, CustomerLov, CustomErrors, CUSTOMER_TYPE_ENUM, LocationSettingAttributesEnum, OverlayNotificationServiceAbstraction, OverlayNotificationType, PanFormDetailsRequestPayload, PanVerificationRequestPayload, SelectDropDownOption, VERIFICATION_TYPE, VerifyPanDetailsResponse } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { selectVerifyPanDetailsResponse } from 'libs/shared/customer/data-access-customer/src/lib/+state/customer.selectors';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-pan-form-verify',
  templateUrl: './pan-form-verify.component.html',
  styleUrls: ['./pan-form-verify.component.scss']
})
export class PanFormVerifyComponent implements OnInit {

  formGroup: FormGroup;

  panCardLabel: string;
  retypePanCardLabel: string;
  isHardCopySubmittedLabel: string;
  matchNotMatchLabel: string;
  panTabLabel: string;
  formTabLabel: string;
  idProofTypeLabel: string;
  idNumberLabel: string;
  panDetailsResponse: VerifyPanDetailsResponse;
  destroy$ = new Subject();
  idProofs: SelectDropDownOption[];
  passportIdProofs = [{
    value: '' + "Passport",
    description: "Passport"
  }];
  verificationType: string;
  isVerificationInitiated: boolean;
  isPanVerificationEnabled = true;
  isLoading$: Observable<boolean>;
  verificationTypeEnumRef = VERIFICATION_TYPE;
  verifyPan = new EventEmitter();
  isPanCardProfileMatched: boolean;
  customerType: string;
  custPanNumber: string;
  customerTypeEnumRef = CUSTOMER_TYPE_ENUM;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private customerFacade: CustomerFacade,
    public dialogRef: MatDialogRef<PanFormVerifyComponent>,
    private translationService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
  ) {
    this.translateService
      .get([
        'pw.panFormVerifyPopup.panCardLabel',
        'pw.panFormVerifyPopup.retypePanCardLabel',
        'pw.panFormVerifyPopup.isHardCopySubmittedLabel',
        'pw.panFormVerifyPopup.matchNotMatchLabel',
        'pw.panFormVerifyPopup.panCardTabLabel',
        'pw.panFormVerifyPopup.formTabLabel',
        'pw.panFormVerifyPopup.typeOfProofLabel',
        'pw.panFormVerifyPopup.idNumberLabel'
      ])
      .subscribe((translatedLabels: any) => {
        this.panCardLabel =
          translatedLabels['pw.panFormVerifyPopup.panCardLabel'];
        this.retypePanCardLabel =
          translatedLabels['pw.panFormVerifyPopup.retypePanCardLabel'];
        this.isHardCopySubmittedLabel =
          translatedLabels['pw.panFormVerifyPopup.isHardCopySubmittedLabel'];
        this.matchNotMatchLabel =
          translatedLabels['pw.panFormVerifyPopup.matchNotMatchLabel'];
        this.panCardLabel =
          translatedLabels['pw.panFormVerifyPopup.panCardTabLabel'];
        this.formTabLabel =
          translatedLabels['pw.panFormVerifyPopup.formTabLabel'];
        this.idProofTypeLabel =
          translatedLabels['pw.panFormVerifyPopup.typeOfProofLabel'];
        this.idNumberLabel =
          translatedLabels['pw.panFormVerifyPopup.idNumberLabel'];
      });
  }

  ngOnInit(): void {

    this.isLoading$ = this.customerFacade.getIsLoading();
    this.customerFacade.loadIdProofs('ID_PROOF');
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.IS_PAN_CARD_VERIFY_INTEGRATION)
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPanIntegration => {
       if (isPanIntegration === 'true') {
        // if (true) {
          this.isPanVerificationEnabled = true;
          this.isVerificationInitiated = false;
        } else {
          this.isPanVerificationEnabled = false;
          this.isVerificationInitiated = true;
        }
      });

    this.createForm()

    this.customerFacade.getverifyPanDetailsResponse()
    .pipe(takeUntil(this.destroy$))
    .subscribe((response: VerifyPanDetailsResponse) => {
      if (response) {
        this.panDetailsResponse = response;
      }
    })

    this.customerFacade
      .getIdProofs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((idProofs: CustomerLov[]) => {
        this.idProofs = idProofs.map(idProof => ({
          value: '' + idProof.value,
          description: idProof.value
        }));
        if (this.customerType === this.customerTypeEnumRef.INTERNATIONAL) {
          this.idProofs = this.passportIdProofs
        }
      });

      this.customerFacade
      .getUpdatedCustomerStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && this.formGroup.valid) {
          if (this.verificationType === VERIFICATION_TYPE.FORM60_IDPROOF) {
            this.updateNotification(
              'pw.customerCreation.form60UpdateSuccessMsg'
            );
          } else {
            this.updateNotification('pw.customerCreation.panUpdateSuccessMsg');
          }

          this.dialogRef.close(this.formGroup.get('isMatched').value);
        }
      });

      this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.isPanCardProfileMatched = customer?.isCustTaxMatched;
          this.custPanNumber = customer?.custTaxNo;
          this.customerType = customer?.customerType;
          if (this.customerType === this.customerTypeEnumRef.INTERNATIONAL) {
            this.idProofs = this.passportIdProofs
          }

          if (this.custPanNumber) {
            this.formGroup.get('panCard').setValue(this.custPanNumber);
            this.formGroup.get('panCard').disable();
          }
        }
      })
      this.customerFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

  }
  createForm() {
    this.formGroup = this.formbuilder.group({
      panCard: [''],
      retypePanCard: [''],
      form60AndIdProofSubmitted: [''],
      idNumber: [''],
      isHardCopySubmitted: ['', this.fieldValidatorsService.requiredTrueField(this.isHardCopySubmittedLabel)],
      isMatched: ['', this.fieldValidatorsService.requiredField(this.matchNotMatchLabel)],
    });
    this.setValidators();
  }

  verifyPanDetails() {
    if (!this.formGroup.get('panCard').invalid && this.formGroup.get('retypePanCard').valid) {
      let requestPaylaod : PanVerificationRequestPayload = {
        panCardNo: this.formGroup.get('retypePanCard').value,
        verificationType: VERIFICATION_TYPE.PAN_CARD
      }
      this.customerFacade.verifyPanByNsdl(requestPaylaod);
      this.isVerificationInitiated = true;
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  submit() {
    this.formGroup.markAllAsTouched();
     if (this.formGroup.valid && this.formGroup.get('isMatched').value === 'true') {
      let custDetails: CustomerIdDetails = {
        customerId: this.data?.customerId,
        customerType: this.customerType,
        id: this.data.id,
        collectedIdProofNumber: this.formGroup.get('idNumber').value,
        panHolderName: this.isPanVerificationEnabled ? this.panDetailsResponse?.name : null,
        pancardNo: this.formGroup.get('retypePanCard').value ? this.formGroup.get('retypePanCard').value : '',
        txnType: this.data?.txnType
      }
      let payload: PanFormDetailsRequestPayload = {
        isProfileMatched: this.formGroup.get('isMatched').value,
        isIdProofSubmitted: this.formGroup.get('isHardCopySubmitted').value,
        typeOfProof: this.formGroup.get('form60AndIdProofSubmitted').value,
        verificationType: this.verificationType,
        customerIdDetails: custDetails
      }
      this.customerFacade.updatePanFormDetails(payload);
     } else if (this.formGroup.valid && this.formGroup.get('isMatched').value === 'false') {
        this.dialogRef.close(false);
     }
  }

  close() {
    this.dialogRef.close(null);
  }

  updateNotification(updatedkey) {
    this.translationService
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message: translatedMsg[updatedkey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  setValidators(event?: MatTabChangeEvent) {
    this.formGroup.reset();
    if (event?.tab?.textLabel === this.formTabLabel || (!event && this.data.customerType === this.customerTypeEnumRef.INTERNATIONAL)) {
      this.verificationType = VERIFICATION_TYPE.FORM60_IDPROOF;
      this.formGroup.get('retypePanCard').clearValidators();
      this.formGroup.get('panCard').clearValidators();
      this.formGroup.get('form60AndIdProofSubmitted').setValidators([
        this.fieldValidatorsService.requiredField(this.idProofTypeLabel)
      ])
      this.formGroup.get('idNumber').setValidators([
        this.fieldValidatorsService.requiredField(this.idNumberLabel)
      ]);
    } else {
      this.verificationType = VERIFICATION_TYPE.PAN_CARD
      this.formGroup.get('panCard').setValidators([
        this.fieldValidatorsService.requiredField(this.panCardLabel),
        this.fieldValidatorsService.pancardField(this.panCardLabel),
        (fieldControl: FormControl) =>
        !this.formGroup.get('retypePanCard').valid && this.formGroup.get('retypePanCard').touched
          ? fieldControl.value?.toUpperCase() === this.formGroup.get('retypePanCard').value?.toUpperCase()
            ? null
            : { retype: true }
          : null,
        this.fieldValidatorsService.requiredField(this.panCardLabel)
      ])
      this.formGroup.get('retypePanCard').setValidators([
        this.fieldValidatorsService.requiredField(this.panCardLabel),
        this.fieldValidatorsService.pancardField(this.panCardLabel),
        (fieldControl: FormControl) => {
          this.formGroup.get('panCard').updateValueAndValidity();
          return ((this.formGroup.get('panCard').status !== 'DISABLED' && this.formGroup.get('panCard').valid)) && this.formGroup.get('panCard').touched
            ? fieldControl.value === this.formGroup.get('panCard').value
              ? null
              : { retype: true }
            : null
        },
        this.fieldValidatorsService.requiredField(this.retypePanCardLabel)
      ])
      this.formGroup.get('form60AndIdProofSubmitted').clearValidators();
      this.formGroup.get('idNumber').clearValidators();
    }
    this.formGroup.get('idNumber').updateValueAndValidity();
    this.formGroup.get('form60AndIdProofSubmitted').updateValueAndValidity();
    this.formGroup.get('retypePanCard').updateValueAndValidity();
    this.formGroup.get('panCard').updateValueAndValidity();
    this.formGroup.updateValueAndValidity();
  }

  errorHandler(error: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
