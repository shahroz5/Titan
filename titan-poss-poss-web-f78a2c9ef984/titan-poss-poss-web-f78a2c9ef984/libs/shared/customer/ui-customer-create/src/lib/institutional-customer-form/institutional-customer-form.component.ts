import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  Customers,
  PincodeSummary,
  AddressDetail,
  ValidatePanResponse,
  ValidateGstResponse,
  ValidateEmailResponse
} from '@poss-web/shared/models';
import * as moment from 'moment';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormGroupDirective
} from '@angular/forms';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'poss-web-institutional-customer-form',
  templateUrl: './institutional-customer-form.component.html',
  styleUrls: ['./institutional-customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionalCustomerFormComponent
  implements OnInit, OnChanges, AfterViewInit {
  submitted$: Subject<boolean> = new Subject<boolean>();
  resetForm$: Subject<boolean> = new Subject<boolean>();
  getStateData$: Subject<boolean> = new Subject<boolean>();
  @Input() customer: Customers;
  @Input() data: any;
  @Input() pincodeSummary: PincodeSummary;
  @Input() countryCode: any;
  @Input() isUniqueCustomer: boolean;
  @Input() isUniqueEmail: boolean;
  @Input() uniqueGst: boolean;
  @Input() uniquePan: boolean;
  @Input() panVerificationStatus: ValidatePanResponse;
  @Input() isEmailRequiredForInstitutional: any;
  @Input() isMobileRequiredForInstitutional: any;
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
  @Output() loadPanVerification = new EventEmitter<string>();
  @Input() gstVerificationStatus: ValidateGstResponse;
  @Output() loadGstVerification = new EventEmitter<string>();
  @Output() clearVerificationState = new EventEmitter<any>();
  @Output() clearPanVerificationState = new EventEmitter<any>();
  @Output() clearGstVerificationState = new EventEmitter<any>();

  addressFormValue: any;
  currentDate = moment();
  institutionalCustomerForm: FormGroup;
  destroy$ = new Subject();
  catchmentAreas: string[] = [];
  filteredCatchmentOptions$: Observable<string[]>;
  validMobile = true;
  validEmail = true;
  validGst = true;
  validPan = true;
  matcher: any;
  altNumber = false;
  showAddNumber = true;
  addressDetail: AddressDetail;
  @ViewChild('titleInput', { static: false })
  titleInput: MatSelect;

  salutationList: any = [];
  emailLabel: string;
  mobileLabel: string;
  pancardLabel: string;
  gstNoLabel: string;
  titleLabel: string;
  zoneLabel: string;
  customerNameLabel: string;
  contactNameLabel: string;
  landlineNumberLabel: string;
  catchmentAreaLabel: string;
  isInduvidualCustomer = false;
  selectedTitle: any;
  gstCheckErrorMsg: string;
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
        'pw.customerCreation.contactNumberPlaceholder',
        'pw.customerCreation.emailIdLabel',
        'pw.customerCreation.pancardNumberLabel',
        'pw.customerCreation.gstNoLabel',
        'pw.customerCreation.titleLabel',
        'pw.customerCreation.zoneLabel',
        'pw.customerCreation.intitutionNameLabel',
        'pw.customerCreation.contactNameLabel',
        'pw.customerCreation.landlineNumberPlaceholder',
        'pw.customerCreation.catchmentAreaLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileLabel =
          translatedMsg['pw.customerCreation.contactNumberPlaceholder'];
        this.emailLabel = translatedMsg['pw.customerCreation.emailIdLabel'];
        this.pancardLabel =
          translatedMsg['pw.customerCreation.pancardNumberLabel'];
        this.gstNoLabel = translatedMsg['pw.customerCreation.gstNoLabel'];
        this.titleLabel = translatedMsg['pw.customerCreation.titleLabel'];
        this.zoneLabel = translatedMsg['pw.customerCreation.zoneLabel'];
        this.customerNameLabel =
          translatedMsg['pw.customerCreation.intitutionNameLabel'];
        this.contactNameLabel =
          translatedMsg['pw.customerCreation.contactNameLabel'];
        this.landlineNumberLabel =
          translatedMsg['pw.customerCreation.landlineNumberPlaceholder'];
        this.catchmentAreaLabel =
          translatedMsg['pw.customerCreation.catchmentAreaLabel'];
      });
  }

  ngOnInit() {
    this.createInstitutionalForm(this.customer);
    this.validMobile = this.isUniqueCustomer;
    this.validEmail = this.isUniqueEmail;
    this.validGst = this.uniqueGst;
    this.validPan = this.uniquePan;
    this.loadCatchmentAreas(this.data.catchmentList);
  }

  clearPanNumber() {
    this.clearPanVerificationState.emit(true);
    this.institutionalCustomerForm.get('pancard').setValue('');
  }

  clearGstNumber() {
    this.clearGstVerificationState.emit(true);
    this.institutionalCustomerForm.get('gstNo').setValue('');
  }

  onEmailValueChange(event) {
    if (
      this.institutionalCustomerForm.controls['emailIds'].valid &&
      this.institutionalCustomerForm.controls['emailIds'].value !== '' &&
      this.institutionalCustomerForm.controls['emailIds'].value !== null
    ) {
      this.loadEmailValidation.emit(
        this.institutionalCustomerForm.controls['emailIds'].value
      );
    } else {
      this.clearEmailValidationState.emit(true);
    }
  }

  clearEmailValue() {
    this.clearEmailValidationState.emit(true);
    this.institutionalCustomerForm.get('emailIds').setValue('');
  }

  onGstValue($event) {
    if ($event.currentTarget.value !== '') {
      this.getStateData$.next(true);
      // this.institutionalCustomerForm
      //   .get('pancard')
      //   .setValidators([
      //     this.fieldValidatorsService.requiredField(this.pancardLabel),
      //     this.fieldValidatorsService.pancardField(this.pancardLabel),
      //     this.fieldValidatorsService.isUniqueCheck(
      //       this.pancardLabel,
      //       this.validPan
      //     )
      //   ]);
      // this.institutionalCustomerForm.controls[
      //   'pancard'
      // ].updateValueAndValidity();
    } else {
      // this.institutionalCustomerForm.get('pancard').clearValidators();
      // this.institutionalCustomerForm
      //   .get('pancard')
      //   .setValidators([
      //     this.fieldValidatorsService.pancardField(this.pancardLabel),
      //     this.fieldValidatorsService.isUniqueCheck(
      //       this.pancardLabel,
      //       this.validPan
      //     )
      //   ]);
      // this.institutionalCustomerForm.controls[
      //   'pancard'
      // ].updateValueAndValidity();
    }
  }

  loadStateData(selectedStates) {
    if (selectedStates.stateTaxCode) {
      this.institutionalCustomerForm.controls['gstNo'].setValidators([
        this.fieldValidatorsService.requiredField(this.gstNoLabel),
        this.fieldValidatorsService.gstNumberField(this.gstNoLabel),
        this.fieldValidatorsService.isUniqueCheck(
          this.gstNoLabel,
          this.validGst
        ),
        this.fieldValidatorsService.gstCustomValidate(
          this.gstNoLabel,
          selectedStates.stateTaxCode
        )
      ]);
      this.institutionalCustomerForm.controls['gstNo'].updateValueAndValidity();
    }
  }

  private _filterCatchment(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.catchmentAreas.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  createInstitutionalForm(customer: Customers) {
    this.institutionalCustomerForm = this.formbuilder.group({
      isIndividualCustomer: [
        this.data.customer &&
        this.data.customer.customerDetails.data.isIndividualCustomer
          ? this.data.customer.customerDetails.data.isIndividualCustomer
          : false
      ],
      title: [
        this.data.customer && this.data.customer.title
          ? this.data.customer.title
          : '',
        [this.fieldValidatorsService.requiredField(this.titleLabel)]
      ],
      zone: [
        this.data.customer && this.data.customer.customerDetails.data.zone
          ? this.data.customer.customerDetails.data.zone
          : '',
        [this.fieldValidatorsService.requiredField(this.zoneLabel)]
      ],
      customerName: [
        this.data.customer && this.data.customer.customerName
          ? this.data.customer.customerName.trim()
          : '',
        [
          this.fieldValidatorsService.requiredField(this.customerNameLabel),
          this.fieldValidatorsService.InstitutionNameField(
            this.customerNameLabel
          ),
          this.fieldValidatorsService.maxLength(50, this.customerNameLabel)
        ]
      ],
      contactNames: [
        this.data.customer &&
        this.data.customer.customerDetails.data.authorizedName
          ? this.data.customer.customerDetails.data.authorizedName
          : '',
        [
          this.fieldValidatorsService.requiredField(this.contactNameLabel),
          this.fieldValidatorsService.customerNameField(this.contactNameLabel),
          this.fieldValidatorsService.maxLength(50, this.contactNameLabel)
        ]
      ],
      form60: [
        this.data.customer
          ? this.data.customer.customerDetails.data.form60AndIdProofSubmitted
          : false
      ],
      emailIds: [
        this.data.customer && this.data.customer.emailId
          ? this.data.customer.emailId
          : '',

        this.isEmailRequiredForInstitutional === 'true'
          ? [
              this.fieldValidatorsService.emailField(this.emailLabel),
              this.fieldValidatorsService.requiredField(this.emailLabel)
            ]
          : [this.fieldValidatorsService.emailField(this.emailLabel)]
      ],
      contactNumbers: [
        this.data.customer && this.data.customer.mobileNumber
          ? this.data.customer.mobileNumber
          : ''
      ],
      landlineNumber: [
        this.data.customer &&
        this.data.customer.customerDetails.data.landlineNumber
          ? this.data.customer.customerDetails.data.landlineNumber
          : '',
        [this.fieldValidatorsService.contactNoField(this.landlineNumberLabel)]
      ],
      isHardCopySubmitted: [
        this.data.customer
          ? this.data.customer.customerDetails.data.isHardCopySubmitted
          : false
      ],
      catchmentArea: [
        this.data.customer &&
        this.data.customer.customerDetails.data.catchmentName
          ? this.data.customer.customerDetails.data.catchmentName
          : '',
        [
          this.fieldValidatorsService.requiredField(this.catchmentAreaLabel),
          this.fieldValidatorsService.colorField(this.catchmentAreaLabel)
        ]
      ],
      pancard: [
        this.getPanNumberValue(this.data),
        [this.fieldValidatorsService.pancardField(this.pancardLabel)]
      ],
      withInstiTaxNo: [this.getIsInstiTaxBooleanValue(this.data)],
      gstNo: [
        this.getGstNumberValue(this.data),
        [this.fieldValidatorsService.gstNumberField(this.gstNoLabel)]
      ]
    });
    this.submitted$.next(false);
    if (!this.data.customer) {
      // this.institutionalCustomerForm.get('catchmentArea').disable();
      this.onGstcardValueChange();
      this.onPancardValueChange();
      if (this.institutionalCustomerForm.get('gstNo').value) {
        this.institutionalCustomerForm.get('gstNo').markAsTouched();
      }

      if (this.institutionalCustomerForm.get('pancard').value) {
        this.institutionalCustomerForm.get('pancard').markAsTouched();
      }
    } else {
      // this.institutionalCustomerForm.get('contactNames').disable();
      // this.institutionalCustomerForm.get('contactNumbers').disable();
      this.institutionalCustomerForm.get('customerName').disable();
      this.institutionalCustomerForm.get('emailIds').disable();
      this.institutionalCustomerForm.get('isIndividualCustomer').disable();
      this.institutionalCustomerForm.get('landlineNumber').disable();
      this.onCheckboxChange(this.getIsInstiTaxBooleanValue(this.data));
      //this.institutionalCustomerForm.get('isHardCopySubmitted').disable();
      this.selectedTitle = this.data.customer.title;
      if (
        this.data.customer.isInstiTaxNoVerified &&
        this.data.customer.instiTaxNo
      ) {
        this.institutionalCustomerForm.get('gstNo').disable();
        this.institutionalCustomerForm.get('withInstiTaxNo').disable();
      }
      if (this.data.customer.iscustTaxNoVerified) {
        this.institutionalCustomerForm.get('pancard').disable();
      }
    }
  }

  ngAfterViewInit() {
    this.selectedTitle = this.data?.customer?.title;

    setTimeout(() => {
      this.titleInput.focus();
      this.loadCatchmentAreas(this.data.catchmentList);
    }, 1000);
  }

  getPanNumberValue(data) {
    if (this.data.customer) {
      return this.data.customer.custTaxNo;
    } else if (data.panNumber) {
      return data.panNumber;
    } else {
      return '';
    }
  }

  getIsInstiTaxBooleanValue(data) {
    if (this.data.customer && this.data.customer.instiTaxNo) {
      return true;
    } else if (this.data.customer && !this.data.customer.instiTaxNo) {
      return false;
    } else {
      return true;
    }
  }

  onPancardValueChange(event?) {
    // if (
    //   this.institutionalCustomerForm.get('pancard').valid ||
    //   this.validPan === false
    // ) {
    //   this.loadIsUniqueCustomer.emit({
    //     searchType: 'CUSTOMER_TAX_NO',
    //     value: this.institutionalCustomerForm.controls[
    //       'pancard'
    //     ].value.toUpperCase()
    //   });
    // }
    if (
      this.institutionalCustomerForm.controls['pancard'].valid &&
      // this.validPan === true &&
      this.institutionalCustomerForm.controls['pancard'].value !== ''
    ) {
      this.loadPanVerification.emit(
        this.institutionalCustomerForm.controls['pancard'].value.toUpperCase()
      );
    }
  }

  onGstcardValueChange(event?) {
    if (
      this.institutionalCustomerForm.get('gstNo').valid ||
      this.validGst === false
    ) {
      this.loadIsUniqueCustomer.emit({
        searchType: 'INSTITUTIONAL_TAX_NO',
        value: this.institutionalCustomerForm.controls['gstNo'].value
      });
    }
    if (
      this.institutionalCustomerForm.controls['gstNo'].valid &&
      // this.validGst === true &&
      this.institutionalCustomerForm.controls['gstNo'].value !== ''
    ) {
      this.loadGstVerification.emit(
        this.institutionalCustomerForm.controls['gstNo'].value
      );
    }
  }

  getGstNumberValue(data) {
    if (this.data.customer) {
      return this.data.customer.instiTaxNo;
    } else if (data.gstNumber) {
      return data.gstNumber;
    } else {
      return '';
    }
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
      if (this.institutionalCustomerForm) {
        if (this.isMobileRequiredForInstitutional === 'true') {
          this.institutionalCustomerForm.controls[
            'contactNumbers'
          ].setValidators([
            this.fieldValidatorsService.requiredField(this.mobileLabel),
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
        } else {
          this.institutionalCustomerForm.controls[
            'contactNumbers'
          ].setValidators([
            this.fieldValidatorsService.mobileSeriesCheck(
              this.mobileLabel,
              this.mobileNumberStartSeries
            )
          ]);
        }

        this.institutionalCustomerForm.controls[
          'contactNumbers'
        ].updateValueAndValidity();
      }
    }

    if (
      changes['uniqueGst'] &&
      (changes['uniqueGst'].currentValue === true ||
        changes['uniqueGst'].currentValue === false)
    ) {
      this.validGst = changes['uniqueGst'].currentValue;
      this.institutionalCustomerForm.controls['gstNo'].setValidators([
        this.fieldValidatorsService.requiredField(this.gstNoLabel),
        this.fieldValidatorsService.gstNumberField(this.gstNoLabel),
        this.fieldValidatorsService.isUniqueCheck(
          this.gstNoLabel,
          this.validGst
        )
      ]);
      this.institutionalCustomerForm.controls['gstNo'].updateValueAndValidity();
      if (
        this.institutionalCustomerForm.controls['gstNo'].valid &&
        changes['uniqueGst'].currentValue === true &&
        this.institutionalCustomerForm.controls['gstNo'].value !== ''
      ) {
        this.loadGstVerification.emit(
          this.institutionalCustomerForm.controls['gstNo'].value
        );
      }
    }

    if (
      changes['uniquePan'] &&
      (changes['uniquePan'].currentValue === true ||
        changes['uniquePan'].currentValue === false)
    ) {
      this.validPan = changes['uniquePan'].currentValue;
      this.institutionalCustomerForm.controls['pancard'].setValidators([
        this.fieldValidatorsService.pancardField(this.pancardLabel),
        this.fieldValidatorsService.isUniqueCheck(
          this.pancardLabel,
          this.validPan
        )
      ]);
      this.institutionalCustomerForm.controls[
        'pancard'
      ].updateValueAndValidity();
      if (
        this.institutionalCustomerForm.controls['pancard'].valid &&
        // changes['uniquePan'].currentValue === true &&
        this.institutionalCustomerForm.controls['pancard'].value !== ''
      ) {
        this.loadPanVerification.emit(
          this.institutionalCustomerForm.controls['pancard'].value.toUpperCase()
        );
      }
    }

    // if (
    //   changes['panVerificationStatus'] &&
    //   changes['panVerificationStatus'].currentValue
    // ) {
    //   if (this.panVerificationStatus.verificationStatus === false) {
    //     this.institutionalCustomerForm.controls['pancard'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    // if (
    //   changes['gstVerificationStatus'] &&
    //   changes['gstVerificationStatus'].currentValue
    // ) {
    //   if (this.gstVerificationStatus.status === false) {
    //     this.institutionalCustomerForm.controls['gstNo'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    if (
      changes['isUniqueEmail'] &&
      (changes['isUniqueEmail'].currentValue === true ||
        changes['isUniqueEmail'].currentValue === false)
    ) {
      this.validEmail = changes['isUniqueEmail'].currentValue;
      this.institutionalCustomerForm.controls['emailIds'].setValidators([
        this.fieldValidatorsService.emailField(this.emailLabel)
      ]);
      this.institutionalCustomerForm.controls[
        'emailIds'
      ].updateValueAndValidity();
      if (
        this.institutionalCustomerForm.controls['emailIds'].valid &&
        this.institutionalCustomerForm.controls['emailIds'].value !== '' &&
        this.institutionalCustomerForm.controls['emailIds'].value !== null
      ) {
        this.loadEmailValidation.emit(
          this.institutionalCustomerForm.controls['emailIds'].value
        );
      }
    }

    // if (
    //   changes['emailValidationStatus'] &&
    //   changes['emailValidationStatus'].currentValue
    // ) {
    //   if (this.emailValidationStatus.validationstatus === false) {
    //     this.institutionalCustomerForm.controls['emailIds'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }
  }

  addcontactNumbers() {
    this.altNumber = true;
    this.showAddNumber = false;
  }

  get contactNamesArray() {
    return this.institutionalCustomerForm.get('contactNames') as FormArray;
  }

  get emailIdArray() {
    return this.institutionalCustomerForm.get('emailIds') as FormArray;
  }

  get contactNumberArray() {
    return this.institutionalCustomerForm.get('contactNumbers') as FormArray;
  }

  onCheckboxChange($event) {
    if ($event.checked === true) {
      this.institutionalCustomerForm.get('gstNo').enable();
      this.institutionalCustomerForm
        .get('gstNo')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.gstNoLabel),
          this.fieldValidatorsService.gstNumberField(this.gstNoLabel),
          this.fieldValidatorsService.isUniqueCheck(
            this.gstNoLabel,
            this.validGst
          )
        ]);
    } else if ($event.checked === false) {
      this.institutionalCustomerForm.get('gstNo').setValue('');
      this.institutionalCustomerForm.get('gstNo').clearValidators();
      this.institutionalCustomerForm.get('gstNo').disable();
    } else {
      this.institutionalCustomerForm.get('gstNo').disable();
    }

    this.institutionalCustomerForm.controls['gstNo'].updateValueAndValidity();
  }

  filtersalutation(itemList) {
    let result: any = [];

    if (
      this.institutionalCustomerForm.get('isIndividualCustomer').value === true
    )
      result = itemList.filter(item => item.value !== 'M/S');
    else result = itemList.filter(item => item.value === 'M/S');
    return result;
  }

  deletecontactNames(index) {
    this.contactNamesArray.removeAt(index);
  }

  clearInstitutionalForm(institutionalFormDirective: FormGroupDirective) {
    institutionalFormDirective.resetForm();
    this.createInstitutionalForm(this.customer);
    this.clearVerificationState.emit(true);
    this.resetForm$.next(true);
  }

  loadCountryId(country: string) {
    this.loadCountry.emit(country);
  }

  loadStateId(state: string) {
    this.loadStates.emit(state);
  }

  checkMobileNumberValidation($event) {
    if (!this.data.customer)
      if (
        this.institutionalCustomerForm.get('contactNumbers').valid ||
        this.validMobile === false
      ) {
        this.loadIsUniqueCustomer.emit({
          searchType: 'MOBILE_NO',
          value: $event.target.value
        });
      }

    this.institutionalCustomerForm
      .get('contactNumbers')
      .updateValueAndValidity();
  }

  checkEmailValidation($event) {
    if (
      this.institutionalCustomerForm.get('emailIds').valid ||
      this.validEmail === false
    ) {
      this.loadIsUniqueCustomer.emit({
        searchType: 'EMAIL_ID',
        value: $event.target.value
      });
    }
  }

  loadPincodes(data: any) {
    this.loadPincode.emit(data);
    this.institutionalCustomerForm.get('catchmentArea').enable();
    // this.institutionalCustomerForm.get('catchmentArea').setValue('');
  }

  loadAddressForm($event) {
    this.addressFormValue = $event;
    if (this.institutionalCustomerForm.valid) {
      const parentForm = this.institutionalCustomerForm.getRawValue();
      const bothFormValues = { ...parentForm, ...this.addressFormValue };
      const customerdata = {
        customerDetails: {
          data: {
            ...(!!bothFormValues.contactNames && {
              authorizedName: bothFormValues.contactNames
            }),
            ...(!!bothFormValues.catchmentArea && {
              catchmentName: bothFormValues.catchmentArea
            }),
            ...((!!bothFormValues.isHardCopySubmitted === true ||
              bothFormValues.isHardCopySubmitted === false) && {
              isHardCopySubmitted: bothFormValues.isHardCopySubmitted
            }),
            ...(!!bothFormValues.landlineNumber && {
              landlineNumber: bothFormValues.landlineNumber
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
            }),
            ...(!!bothFormValues.zone && {
              zone: bothFormValues.zone
            }),
            ...(!!bothFormValues.customerName &&
              !this.data.customer && {
                authorizedName: bothFormValues.contactNames
              }),
            ...(!this.data.customer && {
              isIndividualCustomer: bothFormValues.isIndividualCustomer
            })
          }
        },
        ...(!!bothFormValues.contactNames &&
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
        ...(!!bothFormValues.emailIds &&
          !this.data.customer && {
            emailId: bothFormValues.emailIds
          }),
        ...(!!bothFormValues.contactNumbers &&
          !this.data.customer && {
            mobileNumber: bothFormValues.contactNumbers
          }),
        ...(!!bothFormValues.title && {
          title: bothFormValues.title
        }),

        ...(!!bothFormValues &&
          !this.data?.customer?.iscustTaxNoVerified && {
            custTaxNo:
              bothFormValues.pancard === '' ? null : bothFormValues.pancard
          }),
        ...(!!bothFormValues.gstNo &&
          !this.data?.customer?.isInstiTaxNoVerified && {
            instiTaxNo: bothFormValues.gstNo
          }),
        ...(!!bothFormValues.withInstiTaxNo && {
          withInstiTaxNo: bothFormValues.withInstiTaxNo
        }),
        ...(!!bothFormValues.contactNumbers && {
          mobileNumber: bothFormValues.contactNumbers
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

  loadCatchmentAreas($event) {
    // this.catchmentAreas.push($event);
    if ($event !== null) {
      this.catchmentAreas = $event;
    }

    if (this.catchmentAreas !== null) {
      this.institutionalCustomerForm.get('catchmentArea').enable();
      this.filteredCatchmentOptions$ = this.institutionalCustomerForm.controls[
        'catchmentArea'
      ].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCatchment(value))
      );
    } else {
      if (!this.data.customer) {
        this.institutionalCustomerForm.get('catchmentArea').disable();
      }
    }
  }

  validateForm() {
    this.submitted$.next(true);
  }
}
