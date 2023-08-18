import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import {
  Customers,
  PincodeSummary,
  ValidateEmailResponse,
  ValidatePanResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'poss-web-one-time-customer-form',
  templateUrl: './one-time-customer-form.component.html',
  styleUrls: ['./one-time-customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneTimeCustomerFormComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() customer: Customers;
  @Input() data: any;
  @Input() isUniqueCustomer: boolean;
  @Input() isUniqueEmail: boolean;
  @Input() countryCode: any;
  @Input() isMobileRequiredForOneTime: any;
  @Input() isEmailRequiredForOneTime: any;
  @Input() mobileNumberStartSeries: any;
  // @Input() refusedMobileNumber: any;
  @Output() loadCountry = new EventEmitter<string>();
  @Output() loadStates = new EventEmitter<string>();
  @Output() addNewCustomer = new EventEmitter<any>();
  @Output() updateCustomer = new EventEmitter<any>();
  @Input() pincodeSummary: PincodeSummary;
  @Output() loadonetimeCustomerForm = new EventEmitter<FormGroup>();
  @Output() loadIsUniqueCustomer = new EventEmitter<{
    searchType: string;
    value: string;
  }>();
  @Output() loadPincode = new EventEmitter<any>();
  @Input() panVerificationStatus: ValidatePanResponse;
  @Output() loadPanVerification = new EventEmitter<string>();
  @Output() clearVerificationState = new EventEmitter<any>();
  @Output() clearPanVerificationState = new EventEmitter<any>();
  submitted$: Subject<boolean> = new Subject<boolean>();
  resetForm$: Subject<boolean> = new Subject<boolean>();
  getStateData$: Subject<boolean> = new Subject<boolean>();
  currentDate = moment();
  onetimeCustomerForm: FormGroup;
  filteredCountryOptions$: Observable<string[]>;
  filteredStateOptions$: Observable<string[]>;
  filteredCityOptions$: Observable<string[]>;
  destroy$ = new Subject();
  subscription: Subscription;
  @ViewChild(MatAutocompleteTrigger, { static: true })
  trigger: MatAutocompleteTrigger;
  selectedCountryIdValue: any;
  selectedStateIdValue: any;
  isUnique: boolean;
  isUniqueMail: boolean;
  validMobile = true;
  validEmail = true;
  emailLabel: string;
  mobileLabel: string;
  titleLabel: string;
  customerNameLabel: string;
  refusedMobileLabel: string;
  addressFormValue: any;
  @ViewChild('titleInput', { static: false })
  titleInput: MatSelect;
  pancardLabel: string;
  @Input() emailValidationStatus: ValidateEmailResponse;
  @Output() loadEmailValidation = new EventEmitter<string>();
  @Output() clearEmailValidationState = new EventEmitter<any>();

  constructor(
    private formbuilder: FormBuilder,
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get([
        'pw.customerCreation.mobileNoLabel',
        'pw.customerCreation.emailIdLabel',
        'pw.customerCreation.titleLabel',
        'pw.customerCreation.customerNameLabel',
        'pw.customerCreation.refusedMobileNumberLabel',
        'pw.customerCreation.pancardNumberLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileLabel = translatedMsg['pw.customerCreation.mobileNoLabel'];
        this.emailLabel = translatedMsg['pw.customerCreation.emailIdLabel'];

        this.titleLabel = translatedMsg['pw.customerCreation.titleLabel'];

        this.customerNameLabel =
          translatedMsg['pw.customerCreation.customerNameLabel'];

        this.refusedMobileLabel =
          translatedMsg['pw.customerCreation.refusedMobileNumberLabel'];
        this.pancardLabel =
          translatedMsg['pw.customerCreation.pancardNumberLabel'];
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.titleInput.focus();
      this.onetimeCustomerForm.get('mobile').updateValueAndValidity();
    }, 1000);
  }

  onEmailValueChange(event) {
    if (
      this.onetimeCustomerForm.controls['emailId'].valid &&
      this.onetimeCustomerForm.controls['emailId'].value !== '' &&
      this.onetimeCustomerForm.controls['emailId'].value !== null
    ) {
      this.loadEmailValidation.emit(
        this.onetimeCustomerForm.controls['emailId'].value
      );
    } else {
      this.clearEmailValidationState.emit(true);
    }
  }

  clearEmailValue() {
    this.clearEmailValidationState.emit(true);
    this.onetimeCustomerForm.get('emailId').setValue('');
  }

  ngOnInit() {
    this.createonetimeCustomerForm(this.customer);

    this.validMobile = this.isUniqueCustomer;
    this.onetimeCustomerForm.controls['mobilenumberType'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(mobileNumberType => {
        if (
          mobileNumberType === 'true' &&
          this.isMobileRequiredForOneTime === 'true'
        ) {
          this.onetimeCustomerForm
            .get('mobile')
            .setValidators([
              this.fieldValidatorsService.requiredField(this.mobileLabel),
              this.fieldValidatorsService.mobileSeriesCheck(
                this.mobileLabel,
                this.mobileNumberStartSeries
              )
            ]);
          this.onetimeCustomerForm.controls['refusedmobile'].setValidators([]);

          this.onetimeCustomerForm.get('refusedmobile').updateValueAndValidity();
          this.onetimeCustomerForm.get('mobile').updateValueAndValidity();
        } else if (
          mobileNumberType === 'true' &&
          this.isMobileRequiredForOneTime === 'false'
        ) {
          this.onetimeCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].setValidators([]);
          this.onetimeCustomerForm.get('refusedmobile').updateValueAndValidity();
          this.onetimeCustomerForm.get('mobile').updateValueAndValidity();
        } else {
          this.onetimeCustomerForm
            .get('mobile')
            .setValidators([
              this.fieldValidatorsService.mobileSeriesCheck(
                this.mobileLabel,
                this.mobileNumberStartSeries
              )
            ]);
          this.onetimeCustomerForm
            .get('refusedmobile')
            .setValidators([
              this.fieldValidatorsService.mobileSeriesCheck(
                this.refusedMobileLabel,
                this.mobileNumberStartSeries
              )
            ]);
          this.onetimeCustomerForm.get('mobile').updateValueAndValidity();
        }
      });
  }

  clearPanNumber() {
    this.clearPanVerificationState.emit(true);
    this.onetimeCustomerForm.get('pancard').setValue('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mobileNumberStartSeries']) {
      this.mobileNumberStartSeries =
        changes['mobileNumberStartSeries'].currentValue;
      if (this.onetimeCustomerForm) {
        if (
          this.isMobileRequiredForOneTime === 'true' &&
          this.onetimeCustomerForm.get('mobilenumberType').value === 'true'
        ) {
          this.onetimeCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.requiredField(this.mobileLabel),
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].markAsTouched();
        } else if (
          this.isMobileRequiredForOneTime === 'true' &&
          this.onetimeCustomerForm.get('mobilenumberType').value === 'false'
        ) {
          this.onetimeCustomerForm.controls['refusedmobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.refusedMobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].markAsTouched();
        } else if (
          this.isMobileRequiredForOneTime === 'false' &&
          this.onetimeCustomerForm.get('mobilenumberType').value === 'true'
        ) {
          this.onetimeCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].setValidators([]);
        } else {
          this.onetimeCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.refusedMobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
          this.onetimeCustomerForm.controls['refusedmobile'].markAsTouched();
        }

        this.onetimeCustomerForm.controls['mobile'].updateValueAndValidity();
        this.onetimeCustomerForm.controls[
          'refusedmobile'
        ].updateValueAndValidity();
      }
    }
    if (
      changes['refusedMobileNumber'] &&
      changes['refusedMobileNumber'].currentValue !== null &&
      this.onetimeCustomerForm
    ) {
      this.onetimeCustomerForm
        .get('refusedmobile')
        .setValue(changes['refusedMobileNumber'].currentValue);
    }
    // if (
    //   changes['panVerificationStatus'] &&
    //   changes['panVerificationStatus'].currentValue
    // ) {
    //   if (this.panVerificationStatus.verificationStatus === false) {
    //     this.onetimeCustomerForm.controls['pancard'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    // if (
    //   changes['emailValidationStatus'] &&
    //   changes['emailValidationStatus'].currentValue
    // ) {
    //   if (this.emailValidationStatus.validationstatus === false) {
    //     this.onetimeCustomerForm.controls['emailId'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }
  }

  createonetimeCustomerForm(customer: Customers) {
    this.onetimeCustomerForm = this.formbuilder.group({
      customerName: [
        this.data.customer ? this.data.customer.customerName.trim() : '',
        [
          this.fieldValidatorsService.requiredField(this.customerNameLabel),
          this.fieldValidatorsService.customerNameField(this.customerNameLabel),
          this.fieldValidatorsService.maxLength(50, this.customerNameLabel)
        ]
      ],
      title: [
        this.data.customer ? this.data.customer.title : '',
        [this.fieldValidatorsService.requiredField(this.titleLabel)]
      ],
      mobile: [this.data.customer ? this.data.customer.mobileNumber : ''],
      emailId: [
        this.data.customer ? this.data.customer.emailId : '',
        this.isEmailRequiredForOneTime === 'true'
          ? [
              this.fieldValidatorsService.emailField(this.emailLabel),
              this.fieldValidatorsService.requiredField(this.emailLabel)
            ]
          : [this.fieldValidatorsService.emailField(this.emailLabel)]
      ],

      mobilenumberType: [
        this.data.customer && this.data.customer.mobileNumber ? 'true' : 'false'
      ],

      refusedmobile: [''],
      pancard: [
        this.data.customer ? this.data.customer.custTaxNo : '',
        [this.fieldValidatorsService.pancardField(this.pancardLabel)]
      ],
      form60AndIdProofSubmitted: [
        this.data.customer
          ? this.data.customer.customerDetails.data.form60AndIdProofSubmitted
          : false
      ]
    });
    this.submitted$.next(false);
    if (!this.data.customer) {
    } else {
      this.onetimeCustomerForm.get('mobile').disable();
      this.onetimeCustomerForm.get('customerName').disable();
      this.onetimeCustomerForm.get('emailId').disable();
      this.onetimeCustomerForm.get('mobilenumberType').disable();
      if (this.data.customer.iscustTaxNoVerified) {
        this.onetimeCustomerForm.get('pancard').disable();
      }
    }
  }

  onPancardValueChange(event) {
    if (
      this.onetimeCustomerForm.controls['pancard'].valid &&
      this.onetimeCustomerForm.controls['pancard'].value !== ''
    ) {
      this.loadPanVerification.emit(
        this.onetimeCustomerForm.controls['pancard'].value.toUpperCase()
      );
    }
  }

  clearOnetimeForm(onetimeFormDirective: FormGroupDirective) {
    onetimeFormDirective.resetForm();
    this.createonetimeCustomerForm(this.customer);
    this.resetForm$.next(true);
  }

  filtersalutation(itemList) {
    let result: any = [];
    result = itemList.filter(item => item.code !== 'M/S');
    return result;
  }

  loadCountryId(country: string) {
    this.loadCountry.emit(country);
  }

  loadStateId(state: string) {
    this.loadStates.emit(state);
  }

  loadPincodes(data: any) {
    this.loadPincode.emit(data);
  }

  loadAddressForm($event) {
    this.addressFormValue = $event;
    if (this.onetimeCustomerForm.valid) {
      const parentForm = this.onetimeCustomerForm.getRawValue();
      const bothFormValues = { ...parentForm, ...this.addressFormValue };
      const customerdata = {
        customerDetails: {
          data: {
            ...(!!bothFormValues.addressLine1 &&
              !!bothFormValues.addressLine2 && {
                addressLines: [
                  bothFormValues.addressLine1,
                  bothFormValues.addressLine2
                ]
              }),
            ...(!!bothFormValues.addressLine1 &&
              !!bothFormValues.addressLine2 &&
              !!bothFormValues.addressLine3 && {
                addressLines: [
                  bothFormValues.addressLine1,
                  bothFormValues.addressLine2,
                  bothFormValues.addressLine3
                ]
              }),
            ...(!!bothFormValues.city && {
              city: bothFormValues.city
            }),
            ...(!!bothFormValues.state && {
              state: bothFormValues.state
            }),
            ...(!!bothFormValues.pincode && {
              pincode: bothFormValues.pincode
            }),
            ...(!!bothFormValues.country && {
              country: bothFormValues.country
            }),
            ...((!!bothFormValues.form60AndIdProofSubmitted === true ||
              bothFormValues.form60AndIdProofSubmitted === false) && {
              form60: bothFormValues.form60AndIdProofSubmitted
            })
          }
        },
        ...(!!bothFormValues.customerName &&
          !this.data.customer && {
            customerName: bothFormValues.customerName
          }),
        ...(!!bothFormValues &&
          !this.data?.customer?.iscustTaxNoVerified && {
            iscustTaxNoVerified: this.panVerificationStatus?.verificationStatus
              ? this.panVerificationStatus?.verificationStatus
              : false
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.iscustTaxNoVerified && {
            iscustTaxNoVerified: this.data.customer.iscustTaxNoVerified
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.isEmailIdValidated && {
            isEmailIdValidated: this.data.customer.isEmailIdValidated
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.isEmailIdValidationInitiated && {
            isEmailIdValidationInitiated: this.data.customer
              .isEmailIdValidationInitiated
          }),
        ...(!!bothFormValues &&
          !this.data?.customer?.isEmailIdValidated && {
            isEmailIdValidated: this.emailValidationStatus?.validationstatus
              ? this.emailValidationStatus?.validationstatus
              : false
          }),
        ...(!!bothFormValues &&
          !this.data?.customer?.isEmailIdValidationInitiated && {
            isEmailIdValidationInitiated:
              this.emailValidationStatus?.validationstatus ||
              this.emailValidationStatus?.invalidationreason
                ? true
                : false
          }),
        ...(!!bothFormValues &&
          !this.data?.customer?.iscustTaxNoVerified && {
            custTaxNo:
              bothFormValues.pancard === '' ? null : bothFormValues.pancard
          }),
        ...(!!bothFormValues.emailId &&
          !this.data.customer && {
            emailId: bothFormValues.emailId
          }),
        ...(!!bothFormValues.refusedmobile &&
          bothFormValues.mobilenumberType === 'false' &&
          !this.data.customer && {
            mobileNumber: bothFormValues.refusedmobile
          }),

        ...(!!bothFormValues.mobile &&
          !!bothFormValues.mobilenumberType === true &&
          !this.data.customer && {
            mobileNumber: bothFormValues.mobile
          }),

        ...(!!bothFormValues.title && {
          title: bothFormValues.title
        }),
        ...(!!bothFormValues &&
          !this.data?.customer?.panHolderName && {
            panHolderName: this.panVerificationStatus?.ownerName
              ? this.panVerificationStatus?.ownerName
              : null
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.panHolderName && {
            panHolderName: this.data.customer.panHolderName
          })
      };

      if (this.data.customer) {
        const customerId = this.data.customer.customerId;
        const updateCustomer = {
          customerId: customerId,
          data: customerdata
        };
        this.updateCustomer.emit(updateCustomer);
      } else {
        this.addNewCustomer.emit(customerdata);
      }
    }
  }

  displayDescriptionFn(option) {
    return option.description;
  }

  validateForm() {
    this.submitted$.next(true);
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
