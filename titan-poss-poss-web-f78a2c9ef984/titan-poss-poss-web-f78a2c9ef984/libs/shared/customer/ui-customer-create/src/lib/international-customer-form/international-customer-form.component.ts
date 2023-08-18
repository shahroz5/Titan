import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Customers,
  PincodeSummary,
  ValidateEmailResponse,
  ValidateGstResponse,
  ValidatePanResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'poss-web-international-customer-form',
  templateUrl: './international-customer-form.component.html',
  styleUrls: ['./international-customer-form.component.scss']
})
export class InternationalCustomerFormComponent
  implements OnInit, OnChanges, AfterViewInit {
  submitted$: Subject<boolean> = new Subject<boolean>();
  getStateData$: Subject<boolean> = new Subject<boolean>();
  resetForm$: Subject<boolean> = new Subject<boolean>();
  @Input() customer: Customers;
  @Input() data: any;
  @Input() pincodeSummary: PincodeSummary;
  @Input() isUniqueCustomer: boolean;
  @Input() isUniqueEmail: boolean;
  @Input() isUniquePan: boolean;
  @Input() isUniquePassport: boolean;
  @Input() isUniqueGst: boolean;
  @Input() countryCode: any;
  @Input() isEmailRequiredForInternational: any;
  @Input() isMobileRequiredForInternational: any;
  @Input() mobileNumberStartSeries: any;
  @Output() loadCountry = new EventEmitter<string>();
  @Output() loadStates = new EventEmitter<string>();
  @Output() addNewCustomer = new EventEmitter<any>();
  @Output() updateCustomer = new EventEmitter<any>();
  @Output() loadIsUniqueCustomer = new EventEmitter<{
    searchType: string;
    value: string;
  }>();
  @Output() loadPincode = new EventEmitter<{
    countryCode: string;
    pincode: string;
  }>();
  @Input() panVerificationStatus: ValidatePanResponse;
  @Output() loadPanVerification = new EventEmitter<string>();
  @Input() gstVerificationStatus: ValidateGstResponse;
  @Output() loadGstVerification = new EventEmitter<string>();
  @Output() clearVerificationState = new EventEmitter<any>();
  @Output() clearPanVerificationState = new EventEmitter<any>();
  @Output() clearGstVerificationState = new EventEmitter<any>();

  addressFormValue: any;
  currentDate = moment();
  internationalCustomerForm: FormGroup;
  destroy$ = new Subject();
  catchmentAreas: string[] = [];
  filteredCatchmentOptions$: Observable<string[]>;
  validMobile = true;
  validEmail = true;
  validPassport = true;
  validGst = true;
  validPan = true;
  emailLabel: string;
  mobileLabel: string;
  titleLabel: string;
  customerNameLabel: string;
  form60IdProofLabel: string;
  selectedTitle: any;
  @ViewChild('titleInput', { static: false })
  titleInput: MatSelect;
  pancardLabel: any;
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
        'pw.customerCreation.typeOfProofLabel',
        'pw.customerCreation.pancardNumberLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileLabel = translatedMsg['pw.customerCreation.mobileNoLabel'];
        this.emailLabel = translatedMsg['pw.customerCreation.emailIdLabel'];

        this.titleLabel = translatedMsg['pw.customerCreation.titleLabel'];

        this.customerNameLabel =
          translatedMsg['pw.customerCreation.customerNameLabel'];

        this.form60IdProofLabel =
          translatedMsg['pw.customerCreation.typeOfProofLabel'];

        this.pancardLabel =
          translatedMsg['pw.customerCreation.pancardNumberLabel'];
      });
  }

  ngOnInit() {
    this.createInternationalForm(this.customer);
    this.validMobile = this.isUniqueCustomer;
    this.validEmail = this.isUniqueEmail;
    this.validPan = this.isUniquePan;
    this.validPassport = this.isUniquePassport;
    this.validGst = this.isUniqueGst;
  }

  ngAfterViewInit() {
    this.selectedTitle = this.data?.customer?.title;

    setTimeout(() => {
      this.titleInput.focus();
    }, 500);
  }

  onEmailValueChange(event) {
    if (
      this.internationalCustomerForm.controls['emailId'].valid &&
      this.internationalCustomerForm.controls['emailId'].value !== '' &&
      this.internationalCustomerForm.controls['emailId'].value !== null
    ) {
      this.loadEmailValidation.emit(
        this.internationalCustomerForm.controls['emailId'].value
      );
    } else {
      this.clearEmailValidationState.emit(true);
    }
  }

  clearEmailValue() {
    this.clearEmailValidationState.emit(true);
    this.internationalCustomerForm.get('emailId').setValue('');
  }

  createInternationalForm(customer: Customers) {
    this.internationalCustomerForm = this.formbuilder.group({
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
      mobile: [
        this.data.customer ? this.data.customer.mobileNumber : '',
        this.isMobileRequiredForInternational === 'true'
          ? [this.fieldValidatorsService.requiredField(this.mobileLabel)]
          : null
      ],
      emailId: [
        this.data.customer ? this.data.customer.emailId : '',
        this.isEmailRequiredForInternational === 'true'
          ? [
              this.fieldValidatorsService.requiredField(this.emailLabel),
              this.fieldValidatorsService.emailField(this.emailLabel)
            ]
          : [this.fieldValidatorsService.emailField(this.emailLabel)]
      ],
      panId: [
        this.data.customer ? this.data.customer.custTaxNo : '',
        [this.fieldValidatorsService.pancardField('PAN Card Number')]
      ],
      passportId: [
        this.data.customer ? this.data.customer.passportId : '',
        [this.fieldValidatorsService.passportIdField('Passport Number')]
      ],
      gstId: [
        this.data.customer ? this.data.customer.instiTaxNo : '',
        [this.fieldValidatorsService.gstNumberField('GST Number')]
      ],

      isform60IdProof: [
        this.data.customer && this.data.customer.instiTaxNo ? true : false
      ],
      form60AndIdProofSubmitted: [
        this.data.customer
          ? this.data.customer.customerDetails.data.form60AndIdProofSubmitted
          : true
      ],
      isHardCopySubmitted: [
        this.data.customer
          ? this.data.customer.customerDetails.data.isHardCopySubmitted
          : false
      ],

      patnetProprietorShip: [
        this.data.customer
          ? this.data.customer.customerDetails.data.patnerPropriatorship
          : ''
      ],
      isNRI: [
        this.data.customer
          ? this.data.customer.customerDetails.data.isNRI
          : false
      ],

      isActive: [this.data.customer ? this.data.customer.isActive : 'true']
    });
    this.submitted$.next(false);
    if (this.data.customer) {
      this.internationalCustomerForm.get('mobile').disable();
      this.internationalCustomerForm.get('customerName').disable();
      this.internationalCustomerForm.get('emailId').disable();
      this.internationalCustomerForm.get('isNRI').disable();
      // this.internationalCustomerForm.get('isHardCopySubmitted').disable();
      // this.internationalCustomerForm.get('form60AndIdProofSubmitted').disable();
      //this.internationalCustomerForm.get('passportId').disable();
      this.selectedTitle = this.data.customer.title;
      if (
        this.data.customer.isInstiTaxNoVerified &&
        this.data.customer.instiTaxNo
      ) {
        this.internationalCustomerForm.get('gstId').disable();
        // this.internationalCustomerForm.get('isform60IdProof').disable();
      }
      if (this.data.customer.iscustTaxNoVerified) {
        this.internationalCustomerForm.get('panId').disable();
      }
    }
  }

  clearPanNumber() {
    this.clearPanVerificationState.emit(true);
    this.internationalCustomerForm.get('panId').setValue('');
  }

  clearGstNumber() {
    this.clearGstVerificationState.emit(true);
    this.internationalCustomerForm.get('gstId').setValue('');
  }

  checkBooleanValue(dataValue) {
    if (this.data.customer && dataValue) {
      return true;
    } else {
      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mobileNumberStartSeries']) {
      this.mobileNumberStartSeries =
        changes['mobileNumberStartSeries'].currentValue;
      if (this.internationalCustomerForm) {
        if (this.isMobileRequiredForInternational === 'true') {
          this.internationalCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.requiredField(this.mobileLabel),
            this.fieldValidatorsService.mobileSeriesCheckInternational(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
        } else {
          this.internationalCustomerForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.mobileSeriesCheckInternational(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
        }

        this.internationalCustomerForm.controls[
          'mobile'
        ].updateValueAndValidity();
      }
    }

    if (
      changes['isUniquePassport'] &&
      (changes['isUniquePassport'].currentValue === true ||
        changes['isUniquePassport'].currentValue === false)
    ) {
      this.validMobile = changes['isUniquePassport'].currentValue;
      this.internationalCustomerForm.controls['passportId'].setValidators([
        this.fieldValidatorsService.passportIdField('Passport Number'),

        //this.fieldValidatorsService.requiredField('Passport Number'),
        this.fieldValidatorsService.isUniqueCheck(
          'Passport Number',
          this.validPassport
        )
      ]);
      this.internationalCustomerForm.controls[
        'passportId'
      ].updateValueAndValidity();
    }

    if (
      changes['isUniquePan'] &&
      (changes['isUniquePan'].currentValue === true ||
        changes['isUniquePan'].currentValue === false)
    ) {
      this.validPan = changes['isUniquePan'].currentValue;
      this.internationalCustomerForm.controls['panId'].setValidators([
        this.fieldValidatorsService.pancardField('PAN Card Number')
      ]);
      this.internationalCustomerForm.controls['panId'].updateValueAndValidity();
      if (
        this.internationalCustomerForm.controls['panId'].valid &&
        this.internationalCustomerForm.controls['panId'].value !== ''
      ) {
        this.loadPanVerification.emit(
          this.internationalCustomerForm.controls['panId'].value.toUpperCase()
        );
      }
    }

    // if (
    //   changes['panVerificationStatus'] &&
    //   changes['panVerificationStatus'].currentValue
    // ) {
    //   if (this.panVerificationStatus.verificationStatus === false) {
    //     this.internationalCustomerForm.controls['panId'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    // if (
    //   changes['gstVerificationStatus'] &&
    //   changes['gstVerificationStatus'].currentValue
    // ) {
    //   if (this.gstVerificationStatus.status === false) {
    //     this.internationalCustomerForm.controls['gstId'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    if (
      changes['isUniqueGst'] &&
      (changes['isUniqueGst'].currentValue === true ||
        changes['isUniqueGst'].currentValue === false)
    ) {
      this.validGst = changes['isUniqueGst'].currentValue;
      this.internationalCustomerForm.controls['gstId'].setValidators([
        this.fieldValidatorsService.gstNumberField('GST Number')
      ]);
      this.internationalCustomerForm.controls['gstId'].updateValueAndValidity();

      if (
        this.internationalCustomerForm.controls['gstId'].valid &&
        this.internationalCustomerForm.controls['gstId'].value !== ''
      ) {
        this.loadGstVerification.emit(
          this.internationalCustomerForm.controls['gstId'].value
        );
      }
    }

    if (
      changes['isUniqueEmail'] &&
      (changes['isUniqueEmail'].currentValue === true ||
        changes['isUniqueEmail'].currentValue === false)
    ) {
      this.validEmail = changes['isUniqueEmail'].currentValue;
      this.internationalCustomerForm.controls['emailId'].setValidators([
        this.fieldValidatorsService.requiredField(this.emailLabel),
        this.fieldValidatorsService.emailField(this.emailLabel),
        this.fieldValidatorsService.isUniqueCheck(
          this.emailLabel,
          this.validEmail
        )
      ]);
      this.internationalCustomerForm.controls[
        'emailId'
      ].updateValueAndValidity();
      if (
        this.internationalCustomerForm.controls['emailId'].valid &&
        this.internationalCustomerForm.controls['emailId'].value !== '' &&
        this.internationalCustomerForm.controls['emailId'].value !== null
      ) {
        this.loadEmailValidation.emit(
          this.internationalCustomerForm.controls['emailId'].value
        );
      }
    }

    // if (
    //   changes['emailValidationStatus'] &&
    //   changes['emailValidationStatus'].currentValue
    // ) {
    //   if (this.emailValidationStatus.validationstatus === false) {
    //     this.internationalCustomerForm.controls['emailId'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }
  }

  clearInternationalForm(internationalFormDirective: FormGroupDirective) {
    internationalFormDirective.resetForm();
    this.createInternationalForm(this.customer);
    this.clearVerificationState.emit(true);
    this.resetForm$.next(true);
  }

  onGstValue($event) {
    if ($event.currentTarget.value !== '') {
      this.getStateData$.next(true);
      this.internationalCustomerForm
        .get('panId')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.pancardLabel),
          this.fieldValidatorsService.pancardField(this.pancardLabel),
          this.fieldValidatorsService.isUniqueCheck(
            this.pancardLabel,
            this.validPan
          )
        ]);
      this.internationalCustomerForm.controls['panId'].updateValueAndValidity();
    } else {
      this.internationalCustomerForm.get('panId').clearValidators();
      this.internationalCustomerForm
        .get('panId')
        .setValidators([
          this.fieldValidatorsService.pancardField(this.pancardLabel),
          this.fieldValidatorsService.isUniqueCheck(
            this.pancardLabel,
            this.validPan
          )
        ]);
      this.internationalCustomerForm.controls['panId'].updateValueAndValidity();
    }
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

  onPancardValueChange(event) {
    // if (
    //   this.internationalCustomerForm.controls['panId'].valid ||
    //   this.validPan === false
    // ) {
    //   this.loadIsUniqueCustomer.emit({
    //     searchType: 'CUSTOMER_TAX_NO',
    //     value: event.target.value
    //   });
    // }
    if (
      this.internationalCustomerForm.controls['panId'].valid &&
      this.internationalCustomerForm.controls['panId'].value !== ''
    ) {
      this.loadPanVerification.emit(
        this.internationalCustomerForm.controls['panId'].value.toUpperCase()
      );
    }
  }

  onGstcardValueChange(event) {
    // if (
    //   this.internationalCustomerForm.controls['gstId'].valid ||
    //   this.validGst === false
    // ) {
    //   this.loadIsUniqueCustomer.emit({
    //     searchType: 'INSTITUTIONAL_TAX_NO',
    //     value: event.target.value
    //   });
    // }
    if (
      this.internationalCustomerForm.controls['gstId'].valid &&
      this.internationalCustomerForm.controls['gstId'].value !== ''
    ) {
      this.loadGstVerification.emit(
        this.internationalCustomerForm.controls['gstId'].value
      );
    }
  }

  loadStateData(selectedStates) {
    if (selectedStates.stateTaxCode) {
      this.internationalCustomerForm.controls['gstId'].setValidators([
        this.fieldValidatorsService.gstNumberField('GST Number'),
        this.fieldValidatorsService.gstCustomValidate(
          'GST Number',
          selectedStates.stateTaxCode
        )
      ]);
      this.internationalCustomerForm.controls['gstId'].updateValueAndValidity();
    }
  }

  onCheckboxChange($event) {
    if ($event.checked === true) {
      this.internationalCustomerForm.controls['gstId'].setValidators([
        this.fieldValidatorsService.requiredField('GST Number'),
        this.fieldValidatorsService.gstNumberField('GST Number')
      ]);
      this.internationalCustomerForm.controls['gstId'].updateValueAndValidity();
    } else {
      this.internationalCustomerForm.get('gstId').setValue('');
      this.internationalCustomerForm.get('gstId').clearValidators();
      this.internationalCustomerForm.controls['gstId'].updateValueAndValidity();
    }
  }

  onForm60Change($event) {
    if ($event.checked === true) {
      this.internationalCustomerForm.controls['passportId'].setValidators([
        this.fieldValidatorsService.requiredField('Passport Number'),
        this.fieldValidatorsService.passportIdField('Passport Number'),

        //this.fieldValidatorsService.requiredField('Passport Number'),
        this.fieldValidatorsService.isUniqueCheck(
          'Passport Number',
          this.validPassport
        )
      ]);
      this.internationalCustomerForm.controls[
        'passportId'
      ].updateValueAndValidity();
    } else {
      this.internationalCustomerForm.get('passportId').clearValidators();
      this.internationalCustomerForm.get('passportId').setValue('');
      this.fieldValidatorsService.alphaNumericField('Passport Number'),
        this.fieldValidatorsService.maxLength(20, 'Passport Number'),
        this.fieldValidatorsService.minLength(6, 'Passport Number'),
        //this.fieldValidatorsService.requiredField('Passport Number'),
        this.fieldValidatorsService.isUniqueCheck(
          'Passport Number',
          this.validPassport
        );
      this.internationalCustomerForm.controls[
        'passportId'
      ].updateValueAndValidity();
    }
  }

  filtersalutation(itemList) {
    let result: any = [];
    result = itemList.filter(item => item.code !== 'M/S');
    return result;
  }

  onform60IdProofChange($event) {
    if ($event.checked === true) {
      this.internationalCustomerForm
        .get('form60AndIdProofSubmitted')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.form60IdProofLabel)
        ]);
    } else {
      this.internationalCustomerForm
        .get('form60AndIdProofSubmitted')
        .setValue('');
    }
  }

  onNRIChangeChange($event) {
    if ($event.checked === true) {
      this.internationalCustomerForm.controls['panId'].setValidators([
        this.fieldValidatorsService.requiredField(this.pancardLabel),
        this.fieldValidatorsService.pancardField(this.pancardLabel),
        this.fieldValidatorsService.isUniqueCheck(
          this.pancardLabel,
          this.validPan
        )
      ]);
      this.internationalCustomerForm.controls['panId'].updateValueAndValidity();
    } else {
      this.internationalCustomerForm.get('panId').setValue('');
      this.internationalCustomerForm.get('panId').clearValidators();
      this.internationalCustomerForm.get('panId').updateValueAndValidity();
    }
  }

  loadAddressForm($event) {
    this.addressFormValue = $event;
    if (this.internationalCustomerForm.valid) {
      const parentForm = this.internationalCustomerForm.getRawValue();
      const bothFormValues = { ...parentForm, ...this.addressFormValue };
      const customerdata = {
        customerDetails: {
          data: {
            ...(!!bothFormValues.patnetProprietorShip && {
              partnerProprietorship: bothFormValues.patnetProprietorShip
            }),
            isNRI: bothFormValues.isNRI ? bothFormValues.isNRI : false,
            isHardCopySubmitted: bothFormValues.isHardCopySubmitted
              ? bothFormValues.isHardCopySubmitted
              : false,

            // idProof: 'Passport',
            // ...(!!bothFormValues.passportId && {
            //   idNumber: bothFormValues.passportId
            // }),
            ...((!!bothFormValues.isHardCopySubmitted === true ||
              bothFormValues.isHardCopySubmitted === false) && {
              isHardCopySubmitted: bothFormValues.isHardCopySubmitted
            }),

            ...((!!bothFormValues.form60AndIdProofSubmitted === true ||
              bothFormValues.form60AndIdProofSubmitted === false) && {
              form60: bothFormValues.form60AndIdProofSubmitted
            }),
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
            })
          }
        },
        ...((bothFormValues.passportId !== '' ||
          !!bothFormValues.form60AndIdProofSubmitted) && {
          passportId: bothFormValues.passportId
        }),
        ...(!!bothFormValues.customerName &&
          !this.data.customer && {
            customerName: bothFormValues.customerName
          }),
        ...(!!bothFormValues.emailId &&
          !this.data.customer && {
            emailId: bothFormValues.emailId
          }),
        ...(!!bothFormValues.isActive && {
          isActive: bothFormValues.isActive
        }),
        ...(!!bothFormValues &&
          !this.data?.customer?.iscustTaxNoVerified && {
            iscustTaxNoVerified: this.panVerificationStatus?.verificationStatus
              ? this.panVerificationStatus?.verificationStatus
              : false
          }),
        ...(!!bothFormValues &&
          !this.data?.customer?.isInstiTaxNoVerified && {
            isInstiTaxNoVerified: this.gstVerificationStatus?.status
              ? this.gstVerificationStatus?.status
              : false
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.iscustTaxNoVerified && {
            iscustTaxNoVerified: this.data.customer.iscustTaxNoVerified
          }),
        ...(!!bothFormValues &&
          this.data?.customer?.isInstiTaxNoVerified && {
            isInstiTaxNoVerified: this.data.customer.isInstiTaxNoVerified
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
        ...(!!bothFormValues.gstId &&
          !this.data?.customer?.isInstiTaxNoVerified && {
            instiTaxNo: bothFormValues.gstId
          }),

        ...(!!bothFormValues.mobile && {
          mobileNumber: bothFormValues.mobile
        }),
        ...(!!bothFormValues.title && {
          title: bothFormValues.title
        }),
        ...((!!bothFormValues.isHardCopySubmitted === true ||
          bothFormValues.isHardCopySubmitted === false) && {
          isHardCopySubmitted: bothFormValues.isHardCopySubmitted
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
        const passportId = this.data.customer.passportId;
        const updateCustomer = {
          customerId: customerId,
          data: customerdata,
          passportId: passportId
        };
        this.updateCustomer.emit(updateCustomer);
      } else {
        this.addNewCustomer.emit(customerdata);
      }
    }
  }

  validateForm() {
    this.submitted$.next(true);
    const invalid = [];
    const controls = this.internationalCustomerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    this.internationalCustomerForm.get('isHardCopySubmitted').markAsDirty();
  }
}
