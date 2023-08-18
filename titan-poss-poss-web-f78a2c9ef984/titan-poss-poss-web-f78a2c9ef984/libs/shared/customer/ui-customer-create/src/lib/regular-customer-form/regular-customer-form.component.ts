import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnChanges,
  ChangeDetectionStrategy,
  AfterViewInit
} from '@angular/core';
import {
  Customers,
  CUSTOMER_TYPE_ENUM,
  PincodeSummary,
  ValidateEmailResponse,
  ValidateGstResponse,
  ValidatePanResponse
} from '@poss-web/shared/models';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  NgForm
} from '@angular/forms';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AddressPanelComponent } from '@poss-web/shared/components/ui-address-panel';
import { ErrorStateMatcher } from '@angular/material/core';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';

export class InputErrorStateMatcher implements ErrorStateMatcher {
  constructor(private errorstate: boolean) {}
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return this.errorstate;
  }
}

@Component({
  selector: 'poss-web-regular-customer-form',
  templateUrl: './regular-customer-form.component.html',
  styleUrls: ['./regular-customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegularCustomerFormComponent
  implements OnInit, OnChanges, AfterViewInit {
  submitted$: Subject<boolean> = new Subject<boolean>();
  getStateData$: Subject<boolean> = new Subject<boolean>();
  @Input() customer: Customers;
  @Input() data: any;
  @Input() pincodeSummary: PincodeSummary;
  @Input() isUniqueCustomer: boolean;
  @Input() isUniqueEmail: boolean;
  @Input() uniqueGst: boolean;
  @Input() uniquePan: boolean;
  @Input() isEmailRequiredForEncircle: any;
  @Input() mobileNumberStartSeries: any;
  @Input() isAdvancebookingType: boolean;
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
  @Input() emailValidationStatus: ValidateEmailResponse;
  @Output() loadEmailValidation = new EventEmitter<string>();
  @Output() clearEmailValidationState = new EventEmitter<any>();
  destroy$ = new Subject();
  addressFormValue: any;
  regularCustomerForm: FormGroup;
  currentDate = moment();
  catchmentAreas: string[] = [];
  filteredCatchmentOptions$: Observable<string[]>;

  validMobile = true;
  validEmail = true;
  validGst = true;
  validPan = true;
  altNumber = false;
  showAddNumber = true;
  isForm60IdProofSubmitted = false;
  floatLabelValue = 'auto';

  @ViewChild('addressFormRef')
  AddressPanelComponent: AddressPanelComponent;
  emailLabel: string;
  mobileLabel: string;
  titleLabel: string;
  customerNameLabel: string;
  catchmentAreaLabel: string;
  zoneLabel: string;
  pancardLabel: string;
  gstNoLabel: string;
  form60IdProofLabel: string;
  alternateNumberLabel: string;
  idNumberLabel: string;
  birthdayLabel: string;
  selectedTitle: any;
  @ViewChild('titleInput', { static: false })
  titleInput: MatSelect;

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private translationService: TranslateService
  ) {
    this.translationService
      .get([
        'pw.customerCreation.mobileNoLabel',
        'pw.customerCreation.emailIdLabel',
        'pw.customerCreation.titleLabel',
        'pw.customerCreation.customerNameLabel',
        'pw.customerCreation.pancardNumberLabel',
        'pw.customerCreation.gstNoLabel',
        'pw.customerCreation.zoneLabel',
        'pw.customerCreation.catchmentAreaLabel',
        'pw.customerCreation.typeOfProofLabel',
        'pw.customerCreation.altNumberPlaceholder',
        'pw.customerCreation.idNumberLabel',
        'pw.customerCreation.birthDayLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.mobileLabel = translatedMsg['pw.customerCreation.mobileNoLabel'];
        this.emailLabel = translatedMsg['pw.customerCreation.emailIdLabel'];

        this.titleLabel = translatedMsg['pw.customerCreation.titleLabel'];

        this.customerNameLabel =
          translatedMsg['pw.customerCreation.customerNameLabel'];
        this.pancardLabel =
          translatedMsg['pw.customerCreation.pancardNumberLabel'];
        this.gstNoLabel = translatedMsg['pw.customerCreation.gstNoLabel'];
        this.zoneLabel = translatedMsg['pw.customerCreation.zoneLabel'];
        this.catchmentAreaLabel =
          translatedMsg['pw.customerCreation.catchmentAreaLabel'];
        this.form60IdProofLabel =
          translatedMsg['pw.customerCreation.typeOfProofLabel'];
        this.alternateNumberLabel =
          translatedMsg['pw.customerCreation.altNumberPlaceholder'];
        this.idNumberLabel = translatedMsg['pw.customerCreation.idNumberLabel'];
        this.birthdayLabel = translatedMsg['pw.customerCreation.birthDayLabel'];
      });
  }

  ngOnInit() {
    this.createRegularForm(this.customer);
    this.validMobile = this.isUniqueCustomer;
    this.validEmail = this.isUniqueEmail;
    this.validGst = this.uniqueGst;
    this.validPan = this.uniquePan;
    this.loadCatchmentAreas(this.data.catchmentList);
    if (this.data.customer) {
      this.regularCustomerForm.markAllAsTouched();
    }
    if (this.regularCustomerForm.get('pancard').value) {
      this.regularCustomerForm.get('idNumber').disable();
    }
  }

  private _filterCatchment(value: string): string[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.catchmentAreas.filter(option =>
        option.toLowerCase().includes(filterValue)
      );
    }
  }

  onPancardValueChange(event) {
    // if (
    //   this.regularCustomerForm.controls['pancard'].valid ||
    //   this.validPan === false
    // ) {
    //   this.loadIsUniqueCustomer.emit({
    //     searchType: 'CUSTOMER_TAX_NO',
    //     value: event.target.value
    //   });
    // }
    if (
      this.regularCustomerForm.controls['pancard'].valid &&
      this.regularCustomerForm.controls['pancard'].value !== '' &&
      this.regularCustomerForm.controls['pancard'].value !== null
    ) {
      this.loadPanVerification.emit(
        this.regularCustomerForm.controls['pancard'].value.toUpperCase()
      );
    }
  }

  onEmailValueChange(event) {
    if (
      this.regularCustomerForm.controls['emailId'].valid &&
      this.regularCustomerForm.controls['emailId'].value !== '' &&
      this.regularCustomerForm.controls['emailId'].value !== null
    ) {
      this.loadEmailValidation.emit(
        this.regularCustomerForm.controls['emailId'].value
      );
    } else {
      this.clearEmailValidationState.emit(true);
    }
  }

  clearEmailValue() {
    this.clearEmailValidationState.emit(true);
    this.regularCustomerForm.get('emailId').setValue('');
  }

  clearGstNumber() {
    this.clearGstVerificationState.emit(true);
    this.regularCustomerForm.get('gstNo').setValue('');
  }

  clearPanNumber() {
    this.clearPanVerificationState.emit(true);
    this.regularCustomerForm.get('pancard').setValue('');
  }

  onGstcardValueChange(event) {
    // if (
    //   this.regularCustomerForm.controls['gstNo'].valid ||
    //   this.validGst === false
    // ) {
    //   this.loadIsUniqueCustomer.emit({
    //     searchType: 'INSTITUTIONAL_TAX_NO',
    //     value: event.target.value
    //   });
    // }
    if (
      this.regularCustomerForm.controls['gstNo'].valid &&
      this.regularCustomerForm.controls['gstNo'].value !== ''
    ) {
      this.loadGstVerification.emit(
        this.regularCustomerForm.controls['gstNo'].value
      );
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['isUniqueCustomer'] &&
      (changes['isUniqueCustomer'].currentValue === true ||
        changes['isUniqueCustomer'].currentValue === false)
    ) {
      this.validMobile = changes['isUniqueCustomer'].currentValue;
      this.regularCustomerForm.controls['mobile'].setValidators([
        this.fieldValidatorsService.requiredField(this.mobileLabel),
        this.fieldValidatorsService.mobileSeriesCheck(
          this.mobileLabel,
          this.mobileNumberStartSeries
        ),
        this.fieldValidatorsService.isUniqueCheck(
          this.mobileLabel,
          this.validMobile
        )
      ]);
      this.regularCustomerForm.controls['mobile'].updateValueAndValidity();
    }

    if (changes['mobileNumberStartSeries']) {
      this.mobileNumberStartSeries =
        changes['mobileNumberStartSeries'].currentValue;
      if (this.regularCustomerForm) {
        this.regularCustomerForm.controls['mobile'].setValidators([
          this.fieldValidatorsService.requiredField(this.mobileLabel),
          this.fieldValidatorsService.mobileSeriesCheck(
            this.mobileLabel,
            this.mobileNumberStartSeries
          )
        ]);

        this.regularCustomerForm.controls['mobile'].updateValueAndValidity();
      }
    }

    if (
      changes['isUniqueEmail'] &&
      (changes['isUniqueEmail'].currentValue === true ||
        changes['isUniqueEmail'].currentValue === false)
    ) {
      this.validEmail = changes['isUniqueEmail'].currentValue;
      this.regularCustomerForm.controls['emailId'].setValidators([
        this.fieldValidatorsService.requiredField(this.emailLabel),
        this.fieldValidatorsService.emailField(this.emailLabel)
      ]);
      this.regularCustomerForm.controls['emailId'].updateValueAndValidity();
      if (
        this.regularCustomerForm.controls['emailId'].valid &&
        this.regularCustomerForm.controls['emailId'].value !== '' &&
        this.regularCustomerForm.controls['emailId'].value !== null
      ) {
        this.loadEmailValidation.emit(
          this.regularCustomerForm.controls['emailId'].value
        );
      }
    }

    // if (
    //   changes['emailValidationStatus'] &&
    //   changes['emailValidationStatus'].currentValue
    // ) {
    //   if (this.emailValidationStatus.validationstatus === false) {
    //     this.regularCustomerForm.controls['emailId'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    if (
      changes['uniqueGst'] &&
      (changes['uniqueGst'].currentValue === true ||
        changes['uniqueGst'].currentValue === false)
    ) {
      this.validGst = changes['uniqueGst'].currentValue;
      this.regularCustomerForm.controls['gstNo'].setValidators([
        this.fieldValidatorsService.requiredField(this.gstNoLabel),
        this.fieldValidatorsService.gstNumberField(this.gstNoLabel)
      ]);
      this.regularCustomerForm.controls['gstNo'].updateValueAndValidity();
      if (
        this.regularCustomerForm.controls['gstNo'].valid &&
        this.regularCustomerForm.controls['gstNo'].value !== ''
      ) {
        this.loadGstVerification.emit(
          this.regularCustomerForm.controls['gstNo'].value
        );
      }
    }

    if (
      changes['uniquePan'] &&
      (changes['uniquePan'].currentValue === true ||
        changes['uniquePan'].currentValue === false)
    ) {
      this.validPan = changes['uniquePan'].currentValue;
      this.regularCustomerForm.controls['pancard'].setValidators([
        this.fieldValidatorsService.pancardField(this.pancardLabel)
      ]);
      this.regularCustomerForm.controls['pancard'].updateValueAndValidity();
      if (
        this.regularCustomerForm.controls['pancard'].valid &&
        this.regularCustomerForm.controls['pancard'].value !== '' &&
        this.regularCustomerForm.controls['pancard'].value !== null
      ) {
        this.loadPanVerification.emit(
          this.regularCustomerForm.controls['pancard'].value.toUpperCase()
        );
      }
    }

    // if (
    //   changes['panVerificationStatus'] &&
    //   changes['panVerificationStatus'].currentValue
    // ) {
    //   if (this.panVerificationStatus.verificationStatus === false) {
    //     this.regularCustomerForm.controls['pancard'].setErrors({
    //       incorrect: true
    //     });
    //   }
    // }

    if (
      changes['gstVerificationStatus'] &&
      changes['gstVerificationStatus'].currentValue
    ) {
      if (this.gstVerificationStatus.status === false) {
        this.regularCustomerForm.controls['gstNo'].setErrors({
          incorrect: true
        });
      }
    }
  }

  checkBooleanValue(dataValue) {
    if (this.data.customer && dataValue) {
      return true;
    } else {
      return false;
    }
  }

  ngAfterViewInit() {
    this.selectedTitle = this.data?.customer?.title;

    setTimeout(() => {
      this.titleInput.focus();
      this.loadCatchmentAreas(this.data.catchmentList);
    }, 1000);
  }

  loadStateData(selectedStates) {
    if (selectedStates.stateTaxCode) {
      this.regularCustomerForm.controls['gstNo'].setValidators([
        this.fieldValidatorsService.gstNumberField(this.gstNoLabel),

        this.fieldValidatorsService.gstCustomValidate(
          this.gstNoLabel,
          selectedStates.stateTaxCode
        )
      ]);
      this.regularCustomerForm.controls['gstNo'].updateValueAndValidity();
    }
  }

  createRegularForm(customer: Customers) {
    this.regularCustomerForm = new FormGroup({
      customerName: new FormControl(
        this.data.customer ? this.data.customer.customerName : '',

        [
          this.fieldValidatorsService.requiredField(this.customerNameLabel),
          this.fieldValidatorsService.customerNameField(this.customerNameLabel),
          this.fieldValidatorsService.maxLength(50, this.customerNameLabel)
        ]
      ),
      ulpId: new FormControl(this.data.ulpId ? this.data.ulpId : ''),
      title: new FormControl(
        this.data.customer ? this.data.customer.title : '',
        [this.fieldValidatorsService.requiredField(this.titleLabel)]
      ),
      titleValue: new FormControl(
        this.data.customer ? this.data.customer.title : ''
      ),
      zone: new FormControl(
        this.data.customer ? this.data.customer.customerDetails.data.zone : '',
        [this.fieldValidatorsService.requiredField(this.zoneLabel)]
      ),
      mobile: new FormControl(this.getMobileNumberValue(this.data), [
        this.fieldValidatorsService.requiredField(this.mobileLabel)
      ]),
      altContactNo: new FormControl(
        this.data.customer ? this.data.customer.altContactNo : '',
        [this.fieldValidatorsService.contactNoField(this.alternateNumberLabel)]
      ),
      emailId: new FormControl(
        this.data.customer ? this.data.customer.emailId : '',
        this.isEmailRequiredForEncircle === 'true'
          ? [
              this.fieldValidatorsService.requiredField(this.emailLabel),
              this.fieldValidatorsService.emailField(this.emailLabel)
            ]
          : [this.fieldValidatorsService.emailField(this.emailLabel)]
      ),

      catchmentArea: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.catchmentName
          : '',
        !this.data.customer
          ? [
              this.fieldValidatorsService.requiredField(this.catchmentAreaLabel),
              this.fieldValidatorsService.colorField(this.catchmentAreaLabel)
            ]
          : [
              this.fieldValidatorsService.colorField(this.catchmentAreaLabel)
            ]
      ),
      birthday: new FormControl(
        this.data.customer && this.data.customer.customerDetails.data.birthday
          ? this.data.customer.customerDetails.data.birthday
          : ''
      ),
      spouseBirthday: new FormControl(
        this.data.customer &&
        this.data.customer.customerDetails.data.spouseBirthday
          ? this.data.customer.customerDetails.data.spouseBirthday
          : ''
      ),
      anniversary: new FormControl(
        this.data.customer &&
        this.data.customer.customerDetails.data.anniversary
          ? this.data.customer.customerDetails.data.anniversary
          : ''
      ),
      isHardCopySubmitted: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.isHardCopySubmitted
          : false
      ),
      pancard: new FormControl(
        this.data.customer ? this.data.customer.custTaxNo : '',
        [this.fieldValidatorsService.pancardField(this.pancardLabel)]
      ),
      withInstiTaxNo: new FormControl(
        this.data.customer &&
        this.checkBooleanValue(this.data.customer.instiTaxNo)
          ? true
          : false
      ),
      gstNo: new FormControl(
        this.data.customer ? this.data.customer.instiTaxNo : '',
        [this.fieldValidatorsService.gstNumberField(this.gstNoLabel)]
      ),
      form60AndIdProofSubmitted: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.idProof
          : ''
      ),
      idNumber: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.idNumber
          : ''
      ),
      form60: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.form60AndIdProofSubmitted
          : false
      ),
      isform60IdProof: new FormControl(
        this.data.customer &&
        this.checkBooleanValue(this.data.customer.customerDetails.data.idProof)
          ? true
          : false
      ),
      canSendSMS: new FormControl(
        this.data.customer
          ? this.data.customer.customerDetails.data.canSendSMS
          : true
      ),

      isActive: new FormControl(
        this.data.customer ? this.data.customer.isActive.toString() : 'true'
      )
    });
    this.submitted$.next(false);
    if (!this.data.customer) {
      this.regularCustomerForm.get('birthday').disable();
      this.regularCustomerForm.get('spouseBirthday').disable();
      this.regularCustomerForm.get('anniversary').disable();
      if (this.data.isMobileNumberDisabled) {
        this.regularCustomerForm.get('mobile').disable();
      }
    } else {
      this.regularCustomerForm.get('mobile').disable();
      this.regularCustomerForm.get('customerName').disable();
      this.regularCustomerForm.get('birthday').disable();
      this.regularCustomerForm.get('spouseBirthday').disable();
      this.regularCustomerForm.get('anniversary').disable();

      // this.regularCustomerForm.get('form60AndIdProofSubmitted').disable();
      // this.regularCustomerForm.get('isform60IdProof').disable();
      // this.regularCustomerForm.get('idNumber').disable();
      this.regularCustomerForm.get('titleValue').disable();
      // this.regularCustomerForm.get('isHardCopySubmitted').disable();
      if (!this.isEmailRequiredForEncircle)
        this.regularCustomerForm.get('emailId').disable();
      this.floatLabelValue = 'always';
      this.selectedTitle = this.data.customer.title;
      this.regularCustomerForm.get('title').setValue(this.selectedTitle);
      if (
        this.data.customer.customerType !== CUSTOMER_TYPE_ENUM.INTERNATIONAL
      ) {
        this.loadCountryId('IND');
      }

      if (this.isAdvancebookingType) {
        this.regularCustomerForm.get('zone').disable();
        this.regularCustomerForm.get('isActive').disable();
        this.regularCustomerForm.get('catchmentArea').disable();
        this.regularCustomerForm.get('pancard').disable();
        this.regularCustomerForm.get('form60AndIdProofSubmitted').disable();
        this.regularCustomerForm.get('isform60IdProof').disable();
        this.regularCustomerForm.get('idNumber').disable();
        this.regularCustomerForm.get('isHardCopySubmitted').disable();
        this.regularCustomerForm.get('form60').disable();
      }
      if (
        this.data.customer.isInstiTaxNoVerified &&
        this.data.customer.instiTaxNo
      ) {
        this.regularCustomerForm.get('gstNo').disable();
        this.regularCustomerForm.get('withInstiTaxNo').disable();
      }
      if (this.data.customer.iscustTaxNoVerified) {
        this.regularCustomerForm.get('pancard').disable();
      }
    }
  }

  clearRegularForm(regularFormDirective: FormGroupDirective) {
    this.data.mobileNumber = '';
    this.regularCustomerForm.get('mobile').setValue('');
    regularFormDirective.resetForm();
    this.createRegularForm(this.customer);
    this.clearVerificationState.emit(true);
    this.clearEmailValidationState.emit(true);
    this.loadCatchmentAreas(this.data.catchmentList);
  }

  loadCountryId(country: string) {
    this.loadCountry.emit(country);
  }

  compareThem(o1, o2): boolean {
    console.log('compare with');
    return o1.description === o2.description;
  }

  filtersalutation(itemList) {
    let result: any = [];
    result = itemList.filter(item => item.code !== 'M/S');
    return result;
  }

  getMobileNumberValue(data) {
    if (this.data.customer) {
      return this.data.customer.mobileNumber;
    } else if (data.mobileNumber) {
      return data.mobileNumber;
    } else {
      return '';
    }
  }

  loadStateId(state: string) {
    this.loadStates.emit(state);
  }

  loadPincodes(data: any) {
    this.loadPincode.emit(data);
    if (this.isAdvancebookingType) {
      this.regularCustomerForm.get('catchmentArea').disable();
    } else {
      this.regularCustomerForm.get('catchmentArea').enable();
    }
    // this.regularCustomerForm.get('catchmentArea').setValue('');
  }

  onGstValue($event) {
    if (
      $event.currentTarget.value !== '' &&
      $event.currentTarget.value !== null &&
      $event.currentTarget.value !== undefined
    ) {
      this.getStateData$.next(true);
      this.regularCustomerForm.controls['pancard'].setValidators([
        this.fieldValidatorsService.requiredField(this.pancardLabel),
        this.fieldValidatorsService.pancardField(this.pancardLabel)
      ]);
      this.regularCustomerForm.controls['pancard'].updateValueAndValidity();
    } else {
      this.regularCustomerForm.get('pancard').clearValidators();
      this.regularCustomerForm.controls['pancard'].setValidators([
        this.fieldValidatorsService.pancardField(this.pancardLabel)
      ]);
      this.regularCustomerForm.controls['pancard'].updateValueAndValidity();
    }
  }

  loadAddressForm($event) {
    this.addressFormValue = $event;
    if (this.regularCustomerForm.valid) {
      const parentForm = this.regularCustomerForm.getRawValue();
      const bothFormValues = { ...parentForm, ...this.addressFormValue };
      const customerdata = {
        customerDetails: {
          data: {
            ...(!!bothFormValues.catchmentArea && {
              catchmentName: bothFormValues.catchmentArea
            }),
            ...(!!bothFormValues.birthday && {
              birthday: bothFormValues.birthday
            }),
            ...(!!bothFormValues.spouseBirthday && {
              spouseBirthday: bothFormValues.spouseBirthday
            }),
            ...(!!bothFormValues.anniversary && {
              anniversary: bothFormValues.anniversary
            }),
            ...(!!bothFormValues.form60AndIdProofSubmitted &&
              !this.data.customer && {
                idProof: bothFormValues.form60AndIdProofSubmitted
              }),
            ...(this.data.customer && {
              idProof: bothFormValues.form60AndIdProofSubmitted
            }),
            ...(!!bothFormValues && {
              isHardCopySubmitted: bothFormValues.isHardCopySubmitted
                ? bothFormValues.isHardCopySubmitted
                : false
            }),
            ...(!!bothFormValues.idNumber &&
              !this.data.customer && {
                idNumber: bothFormValues.idNumber
              }),
            ...(this.data.customer && {
              idNumber: bothFormValues.idNumber
            }),

            ...((!!bothFormValues.canSendSMS === true ||
              bothFormValues.canSendSMS === false) && {
              canSendSMS: bothFormValues.canSendSMS
            }),
            ...(!!bothFormValues.form60AndIdProofSubmitted && {
              form60AndIdProofSubmitted:
                bothFormValues.form60AndIdProofSubmitted
            }),
            ...((!!bothFormValues.isHardCopySubmitted === true ||
              bothFormValues.isHardCopySubmitted === false) && {
              isHardCopySubmitted: bothFormValues.isHardCopySubmitted
            }),
            ...(!!bothFormValues.houseNumber &&
              !!bothFormValues.street && {
                addressLines: [
                  bothFormValues.houseNumber,
                  bothFormValues.street
                ]
              }),

            ...(!!bothFormValues.houseNumber &&
              !!bothFormValues.street &&
              bothFormValues.colony && {
                addressLines: [
                  bothFormValues.houseNumber,
                  bothFormValues.street,
                  bothFormValues.colony
                ]
              }),

            ...(!!bothFormValues.houseNumber &&
              !!bothFormValues.street &&
              bothFormValues.buildingName && {
                addressLines: [
                  bothFormValues.houseNumber,
                  bothFormValues.street,
                  bothFormValues.buildingName
                ]
              }),

            ...(!!bothFormValues.houseNumber &&
              !!bothFormValues.street &&
              !!bothFormValues.buildingName &&
              !!bothFormValues.colony && {
                addressLines: [
                  bothFormValues.houseNumber,
                  bothFormValues.street,
                  bothFormValues.buildingName,
                  bothFormValues.colony
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
            ...(!!bothFormValues.altContactNo && {
              altContactNo: bothFormValues.altContactNo
            })
          }
        },
        ...(this.data.ulpId && {
          ulpId: bothFormValues.ulpId
        }),
        ...(!!bothFormValues.customerName &&
          !this.data.customer && {
            customerName: bothFormValues.customerName
          }),
        ...(!!bothFormValues.emailId && {
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
        // ...(!!bothFormValues &&
        //   !this.data?.customer?.isInstiTaxNoVerified && {
        //     isInstiTaxNoVerified: this.gstVerificationStatus?.status
        //       ? this.gstVerificationStatus?.status
        //       : false
        //   }),
        ...(!!bothFormValues &&
          this.data?.customer?.iscustTaxNoVerified && {
            iscustTaxNoVerified: this.data.customer.iscustTaxNoVerified
          }),
        // ...(!!bothFormValues &&
        //   this.data?.customer?.isInstiTaxNoVerified && {
        //     isInstiTaxNoVerified: this.data.customer.isInstiTaxNoVerified
        //   }),

        ...(!!bothFormValues.mobile &&
          !this.data.customer && {
            mobileNumber: bothFormValues.mobile
          }),
        ...(!!bothFormValues.title && {
          title: bothFormValues.title
        }),
        ...(!!bothFormValues &&
          !this.data?.customer?.iscustTaxNoVerified && {
            custTaxNo:
              bothFormValues.pancard === '' ? null : bothFormValues.pancard
          }),
        // ...(!!bothFormValues.gstNo &&
        //   !this.data?.customer?.isInstiTaxNoVerified && {
        //     instiTaxNo: bothFormValues.gstNo
        //   }),
        ...(!!bothFormValues.withInstiTaxNo && {
          withInstiTaxNo: bothFormValues.withInstiTaxNo
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
    if ($event !== null) {
      this.catchmentAreas = $event;
    }
    if (this.catchmentAreas !== null) {
      if (this.isAdvancebookingType) {
        this.regularCustomerForm.get('catchmentArea').disable();
      } else {
        this.regularCustomerForm.get('catchmentArea').enable();
      }
      this.filteredCatchmentOptions$ = this.regularCustomerForm.controls[
        'catchmentArea'
      ].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCatchment(value))
      );
    } else {
      if (!this.data.customer) {
        this.regularCustomerForm.get('catchmentArea').disable();
      }
    }
  }

  addcontactNumbers() {
    this.altNumber = true;
    this.showAddNumber = false;
  }

  onCheckboxChange($event) {
    if ($event.checked === true) {
      this.regularCustomerForm.controls['gstNo'].setValidators([
        this.fieldValidatorsService.requiredField(this.gstNoLabel),
        this.fieldValidatorsService.gstNumberField(this.gstNoLabel)
      ]);
      this.regularCustomerForm.controls['gstNo'].updateValueAndValidity();
    } else {
      this.regularCustomerForm.get('gstNo').setValue('');
      this.regularCustomerForm.get('gstNo').clearValidators();
      this.regularCustomerForm.get('pancard').clearValidators();
      this.regularCustomerForm
        .get('pancard')
        .setValidators([
          this.fieldValidatorsService.pancardField(this.pancardLabel)
        ]);
      this.regularCustomerForm.controls['gstNo'].updateValueAndValidity();
      this.regularCustomerForm.controls['pancard'].updateValueAndValidity();
    }
  }

  onform60IdProofChange($event) {
    if ($event.checked === true) {
      this.regularCustomerForm
        .get('form60AndIdProofSubmitted')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.form60IdProofLabel)
        ]);
      this.regularCustomerForm
        .get('idNumber')
        .setValidators([
          this.fieldValidatorsService.requiredField(this.idNumberLabel)
        ]);
    } else {
      this.regularCustomerForm.get('form60AndIdProofSubmitted').setValue('');
      this.regularCustomerForm.get('idNumber').setValue('');
      this.regularCustomerForm.get('idNumber').clearValidators();
      this.regularCustomerForm.get('idNumber').updateValueAndValidity();
      this.regularCustomerForm
        .get('form60AndIdProofSubmitted')
        .clearValidators();
      this.regularCustomerForm
        .get('form60AndIdProofSubmitted')
        .updateValueAndValidity();
    }
  }

  validateForm() {
    this.submitted$.next(true);
  }

  minDateValidation() {
    const birthdayDate = moment(this.regularCustomerForm.get('birthday').value);
    const spouseBirthdayDate = moment(
      this.regularCustomerForm.get('spouseBirthday').value
    );

    if (
      this.regularCustomerForm.get('birthday').value &&
      this.regularCustomerForm.get('spouseBirthday').value
    ) {
      if (birthdayDate < spouseBirthdayDate) {
        return spouseBirthdayDate.add(1, 'days');
      } else {
        return birthdayDate.add(1, 'days');
      }
    } else if (this.regularCustomerForm.get('birthday').value) {
      return birthdayDate.add(1, 'days');
    } else if (this.regularCustomerForm.get('spouseBirthday').value) {
      return spouseBirthdayDate.add(1, 'days');
    } else {
    }
  }
}
