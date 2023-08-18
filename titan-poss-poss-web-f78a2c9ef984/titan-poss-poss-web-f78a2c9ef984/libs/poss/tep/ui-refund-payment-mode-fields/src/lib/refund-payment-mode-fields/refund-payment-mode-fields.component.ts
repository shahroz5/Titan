import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  RefundDetails,
  RefundOptionTypes,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef
} from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
// import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-refund-payment-mode-fields',
  templateUrl: './refund-payment-mode-fields.component.html',
  styleUrls: ['./refund-payment-mode-fields.component.scss']
})
export class RefundPaymentModeFieldsComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() isCashLimitExceeded: boolean;
  @Input() allowedPaymentMode: string;
  @Input() subrefundMode: [];
  @Input() refundDeductionAmt: number;
  @Input() netRefundAmt: number;
  @Input() refundDetails: RefundDetails;
  @Input() idProofImageUrl: string;
  @Input() cancelledChequeImageUrl: string;
  @Input() approvalMailImageUrl: string;
  @Input() disabled = false;
  @Input() customerId: number;
  @Input() currencyCode = '';
  @Output() emitRefundDetails: EventEmitter<RefundDetails> = new EventEmitter<
    RefundDetails
  >();
  @Output() uploadFile = new EventEmitter<{
    fileData: FormData;
    uploadType: string;
  }>();
  @Output() refundForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  paymentOptionTypes = [];
  subRefundModes = [];
  refundFormGroup: FormGroup;
  selectedRefundType = '';
  refundOptionTypes = RefundOptionTypes;
  accountNumbersMatched: boolean;
  destroy$: Subject<null> = new Subject<null>();
  totalTEPAmt: number;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService // public locationSettingsFacade: LocationSettingsFacade
  ) {
    this.refundFormGroup = new FormGroup({
      refundTypeSelected: new FormControl('', [
        this.fieldValidatorsService.requiredField('Refund Type')
      ]),
      paymentSubRefundModes: new FormControl(
        '',
        this.subrefundMode?.length > 0
          ? [this.fieldValidatorsService.requiredField('Sub Refund Type')]
          : []
      ),
      nameAsPerBankRecord: new FormControl('', [
        this.fieldValidatorsService.accountHolderField(
          'Name as Per Bank Record'
        )
      ]),
      accountHolderName: new FormControl('', [
        this.fieldValidatorsService.accountHolderField('Account Holder Name')
      ]),
      bankName: new FormControl(''),
      accountNumber: new FormControl(''),
      reenteredAccountNumber: new FormControl(''),
      branch: new FormControl(''),
      ifscCode: new FormControl('')
    });
  }

  ngOnInit(): void {
    // if (this.isCashLimitExceeded) {
    //   this.paymentOptionTypes = [
    //     RefundOptionTypes.CHEQUE,
    //     RefundOptionTypes.RTGS
    //   ];
    // } else {
    //   this.paymentOptionTypes = [
    //     RefundOptionTypes.CASH,
    //     RefundOptionTypes.CHEQUE,
    //     RefundOptionTypes.RTGS
    //   ];
    // }
    this.subRefundModes = this.subrefundMode;
    this.totalTEPAmt = this.netRefundAmt + this.refundDeductionAmt;
    if (this.isCashLimitExceeded || !this.customerId) {
      this.paymentOptionTypes = [
        {
          value: RefundOptionTypes.CASH,
          description: RefundOptionTypes.CASH
        },
        {
          value: this.allowedPaymentMode,
          description: this.allowedPaymentMode
        }
      ];
      this.refundFormGroup
        .get('refundTypeSelected')
        .setValue(RefundOptionTypes.CASH);
    } else {
      this.paymentOptionTypes = [
        {
          value: this.allowedPaymentMode,
          description: this.allowedPaymentMode
        }
      ];
    }

    if (this.refundDetails) {
      this.selectedRefundType = this.refundDetails.refundTypeSelected;
      this.refundFormGroup
        .get('refundTypeSelected')
        .setValue(this.refundDetails.refundTypeSelected);
      this.refundFormGroup
        .get('nameAsPerBankRecord')
        .setValue(this.refundDetails.nameAsPerBankRecord);
      this.refundFormGroup
        .get('accountHolderName')
        .setValue(this.refundDetails.accountHolderName);
      this.refundFormGroup
        .get('bankName')
        .setValue(this.refundDetails.bankName);
      this.refundFormGroup
        .get('accountNumber')
        .setValue(this.refundDetails.accountNumber);
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .setValue(this.refundDetails.reenteredAccountNumber);
      this.refundFormGroup.get('branch').setValue(this.refundDetails.branch);
      this.refundFormGroup
        .get('ifscCode')
        .setValue(this.refundDetails.ifscCode);
      this.refundFormGroup
        .get('paymentSubRefundModes')
        ?.setValue(this.refundDetails?.paymentSubRefundModes);
      this.onRefundTypeChanged({
        value: this.refundDetails?.paymentSubRefundModes
          ? this.refundDetails?.paymentSubRefundModes
          : this.refundDetails.refundTypeSelected
      });
    }
    this.refundFormGroup.updateValueAndValidity();
    this.refundFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        console.log('REFUND FORM GROUP 1 :', this.refundFormGroup);
        console.log(
          'INVALID CONTROLS :',
          this.findInvalidControls(this.refundFormGroup)
        );
        if (this.refundFormGroup.valid) {
          console.log('REFUND FORM GROUP 2 :', this.refundFormGroup);
          const refundDetailsValid = {
            ...value,
            invalid: false
          };
          this.emitRefundDetails.emit(refundDetailsValid);
          this.refundForm.emit(this.refundFormGroup);
        } else {
          const refundDetailsInvalid = {
            ...value,
            invalid: true
          };
          this.emitRefundDetails.emit(refundDetailsInvalid);
          this.refundForm.emit(this.refundFormGroup);
        }
      });
    if (this.refundFormGroup.get('refundTypeSelected').value) {
      this.onRefundTypeChanged({
        value: this.refundFormGroup.get('refundTypeSelected').value
      });
    }
    if (
      this.refundFormGroup.get('refundTypeSelected')?.value ===
        this.refundOptionTypes.RO_PAYMENT &&
      this.refundFormGroup.get('paymentSubRefundModes')?.value
    ) {
      this.onRefundTypeChanged({
        value: this.refundFormGroup.get('paymentSubRefundModes')?.value
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      if (this.disabled) {
        this.refundFormGroup.disable();
      }
    }
    this.totalTEPAmt = this.netRefundAmt + this.refundDeductionAmt;
  }

  findInvalidControls(f: FormGroup) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  onRefundTypeChanged(event: any) {
    this.refundFormGroup.get('accountHolderName').reset();
    this.refundFormGroup.get('accountHolderName').setErrors(null);
    this.refundFormGroup.get('bankName').reset();
    this.refundFormGroup.get('bankName').setErrors(null);
    this.refundFormGroup.get('accountNumber').reset();
    this.refundFormGroup.get('accountNumber').setErrors(null);
    this.refundFormGroup.get('reenteredAccountNumber').reset();
    this.refundFormGroup.get('reenteredAccountNumber').setErrors(null);
    this.refundFormGroup.get('branch').reset();
    this.refundFormGroup.get('branch').setErrors(null);
    this.refundFormGroup.get('ifscCode').reset();
    this.refundFormGroup.get('ifscCode').setErrors(null);
    this.refundFormGroup.get('nameAsPerBankRecord').reset();
    this.refundFormGroup.get('nameAsPerBankRecord').setErrors(null);
    console.log('Event 1234 :', event);
    this.selectedRefundType = event.value;
    console.log('selectedRefundType :', this.selectedRefundType);
    if (event.value === this.refundOptionTypes.CHEQUE) {
      this.refundFormGroup
        .get('nameAsPerBankRecord')
        .setValidators([
          this.fieldValidatorsService.requiredField('Name As Per Bank Record'),
          this.fieldValidatorsService.accountHolderField(
            'Name As Per Bank Record'
          )
        ]);
      this.refundFormGroup.get('nameAsPerBankRecord').updateValueAndValidity();
      this.refundFormGroup.get('accountHolderName').clearValidators();
      this.refundFormGroup.get('accountHolderName').updateValueAndValidity();
      this.refundFormGroup.get('bankName').clearValidators();
      this.refundFormGroup.get('bankName').updateValueAndValidity();
      this.refundFormGroup.get('accountNumber').clearValidators();
      this.refundFormGroup.get('accountNumber').updateValueAndValidity();
      this.refundFormGroup.get('reenteredAccountNumber').clearValidators();
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .updateValueAndValidity();
      this.refundFormGroup.get('branch').clearValidators();
      this.refundFormGroup.get('branch').updateValueAndValidity();
      this.refundFormGroup.get('ifscCode').clearValidators();
      this.refundFormGroup.get('ifscCode').updateValueAndValidity();
    } else if (event.value === this.refundOptionTypes.RTGS) {
      this.refundFormGroup.get('nameAsPerBankRecord').clearValidators();
      this.refundFormGroup.get('nameAsPerBankRecord').updateValueAndValidity();
      this.refundFormGroup
        .get('accountHolderName')
        .setValidators([
          this.fieldValidatorsService.requiredField(`Account Holder's Name`),
          this.fieldValidatorsService.accountHolderField(
            `Account Holder's Name`
          )
        ]);
      this.refundFormGroup.get('accountHolderName').updateValueAndValidity();
      this.refundFormGroup
        .get('bankName')
        .setValidators([
          this.fieldValidatorsService.requiredField('Bank Name'),
          this.fieldValidatorsService.alphaNumericWithSpaceField('Bank Name')
        ]);
      this.refundFormGroup.get('bankName').updateValueAndValidity();
      this.refundFormGroup
        .get('accountNumber')
        .setValidators([
          this.fieldValidatorsService.requiredField('Account Number'),
          this.fieldValidatorsService.numbersField('Account Number')
        ]);
      this.refundFormGroup.get('accountNumber').updateValueAndValidity();
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .setValidators([
          this.fieldValidatorsService.requiredField('Re-Enter Account Number'),
          this.fieldValidatorsService.numbersField('Re-Enter Account Number')
        ]);
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .updateValueAndValidity();
      this.refundFormGroup
        .get('branch')
        .setValidators([
          this.fieldValidatorsService.requiredField('Branch'),
          this.fieldValidatorsService.alphaNumericWithSpaceField('Branch')
        ]);
      this.refundFormGroup.get('branch').updateValueAndValidity();
      this.refundFormGroup
        .get('ifscCode')
        .setValidators([
          this.fieldValidatorsService.requiredField('IFSC Code'),
          this.fieldValidatorsService.ifscCodeField('IFSC Code')
        ]);
      this.refundFormGroup.get('ifscCode').updateValueAndValidity();
    }
    this.refundFormGroup.updateValueAndValidity();
    this.refundForm.emit(this.refundFormGroup);
    console.log(
      'IS VALID :',
      this.refundFormGroup.get('nameAsPerBankRecord').valid
    );
    this.refundFormGroup.get('nameAsPerBankRecord').markAsDirty();
  }

  onSubRefundTypeChanged(event: any) {
    this.refundFormGroup.get('accountHolderName').reset();
    this.refundFormGroup.get('accountHolderName').setErrors(null);
    this.refundFormGroup.get('bankName').reset();
    this.refundFormGroup.get('bankName').setErrors(null);
    this.refundFormGroup.get('accountNumber').reset();
    this.refundFormGroup.get('accountNumber').setErrors(null);
    this.refundFormGroup.get('reenteredAccountNumber').reset();
    this.refundFormGroup.get('reenteredAccountNumber').setErrors(null);
    this.refundFormGroup.get('branch').reset();
    this.refundFormGroup.get('branch').setErrors(null);
    this.refundFormGroup.get('ifscCode').reset();
    this.refundFormGroup.get('ifscCode').setErrors(null);
    this.refundFormGroup.get('nameAsPerBankRecord').reset();
    this.refundFormGroup.get('nameAsPerBankRecord').setErrors(null);
    console.log('Event 1234 :', event);
    console.log('selectedRefundType :', this.selectedRefundType);
    if (event.value === this.refundOptionTypes.CHEQUE) {
      this.refundFormGroup
        .get('nameAsPerBankRecord')
        .setValidators([
          this.fieldValidatorsService.requiredField('Name As Per Bank Record'),
          this.fieldValidatorsService.accountHolderField(
            'Name As Per Bank Record'
          )
        ]);
      this.refundFormGroup.get('nameAsPerBankRecord').updateValueAndValidity();
      this.refundFormGroup.get('accountHolderName').clearValidators();
      this.refundFormGroup.get('accountHolderName').updateValueAndValidity();
      this.refundFormGroup.get('bankName').clearValidators();
      this.refundFormGroup.get('bankName').updateValueAndValidity();
      this.refundFormGroup.get('accountNumber').clearValidators();
      this.refundFormGroup.get('accountNumber').updateValueAndValidity();
      this.refundFormGroup.get('reenteredAccountNumber').clearValidators();
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .updateValueAndValidity();
      this.refundFormGroup.get('branch').clearValidators();
      this.refundFormGroup.get('branch').updateValueAndValidity();
      this.refundFormGroup.get('ifscCode').clearValidators();
      this.refundFormGroup.get('ifscCode').updateValueAndValidity();
    } else if (event.value === this.refundOptionTypes.RTGS) {
      this.refundFormGroup.get('nameAsPerBankRecord').clearValidators();
      this.refundFormGroup.get('nameAsPerBankRecord').updateValueAndValidity();
      this.refundFormGroup
        .get('accountHolderName')
        .setValidators([
          this.fieldValidatorsService.requiredField(`Account Holder's Name`),
          this.fieldValidatorsService.accountHolderField(
            `Account Holder's Name`
          )
        ]);
      this.refundFormGroup.get('accountHolderName').updateValueAndValidity();
      this.refundFormGroup
        .get('bankName')
        .setValidators([
          this.fieldValidatorsService.requiredField('Bank Name'),
          this.fieldValidatorsService.alphaNumericWithSpaceField('Bank Name')
        ]);
      this.refundFormGroup.get('bankName').updateValueAndValidity();
      this.refundFormGroup
        .get('accountNumber')
        .setValidators([
          this.fieldValidatorsService.requiredField('Account Number'),
          this.fieldValidatorsService.numbersField('Account Number')
        ]);
      this.refundFormGroup.get('accountNumber').updateValueAndValidity();
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .setValidators([
          this.fieldValidatorsService.requiredField('Re-Enter Account Number'),
          this.fieldValidatorsService.numbersField('Re-Enter Account Number')
        ]);
      this.refundFormGroup
        .get('reenteredAccountNumber')
        .updateValueAndValidity();
      this.refundFormGroup
        .get('branch')
        .setValidators([
          this.fieldValidatorsService.requiredField('Branch'),
          this.fieldValidatorsService.alphaNumericWithSpaceField('Branch')
        ]);
      this.refundFormGroup.get('branch').updateValueAndValidity();
      this.refundFormGroup
        .get('ifscCode')
        .setValidators([
          this.fieldValidatorsService.requiredField('IFSC Code'),
          this.fieldValidatorsService.ifscCodeField('IFSC Code')
        ]);
      this.refundFormGroup.get('ifscCode').updateValueAndValidity();
    }
    this.refundFormGroup.updateValueAndValidity();
    this.refundForm.emit(this.refundFormGroup);
    console.log(
      'IS VALID :',
      this.refundFormGroup.get('nameAsPerBankRecord').valid
    );
    this.refundFormGroup.get('nameAsPerBankRecord').markAsDirty();
  }

  validateAccountNumbers() {
    if (
      this.refundFormGroup.get('accountNumber').value &&
      this.refundFormGroup.get('reenteredAccountNumber').value
    ) {
      if (
        this.refundFormGroup.get('refundTypeSelected').value ===
          this.refundOptionTypes.RTGS ||
        (this.refundFormGroup.get('refundTypeSelected').value ===
          this.refundOptionTypes.RO_PAYMENT &&
          this.refundFormGroup.get('paymentSubRefundModes')?.value ===
            this.refundOptionTypes.RTGS &&
          this.refundFormGroup.get('accountNumber').value ===
            this.refundFormGroup.get('reenteredAccountNumber').value)
      ) {
        this.accountNumbersMatched = true;
      } else {
        this.accountNumbersMatched = false;
      }
    }
    console.log('accountNumbersMatched :', this.accountNumbersMatched);
  }

  upload(event, uploadType: string) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      formData.append('file', fileList.item(0));
      this.uploadFile.emit({ fileData: formData, uploadType });
    }
  }

  uploadError(event: string) {
    this.showNotifications(event);
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            // Action based event
          });
      });
  }

  clearCancelledCheque() {
    this.cancelledChequeImageUrl = null;
  }

  clearIdProof() {
    this.idProofImageUrl = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
