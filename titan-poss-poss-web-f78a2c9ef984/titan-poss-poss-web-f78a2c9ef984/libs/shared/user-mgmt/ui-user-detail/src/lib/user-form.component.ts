import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import {
  AddressData,
  CountryCodeEnum,
  LocationData,
  LocationMappingData,
  LocationMappingPayLoad,
  LocationMappingServiceAbstraction,
  LocationMappingServiceResponse,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RoleDetail,
  RoleTypes,
  SelectDropDownOption,
  StoreFormatsEnum,
  StoreTypes,
  UamEnums,
  UserDetail
} from '@poss-web/shared/models';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() statesList: SelectDropDownOption[] = [];
  @Input() countriesList: SelectDropDownOption[] = [];
  @Input() roleTypesList: SelectDropDownOption[] = [];
  @Input() rolesList: SelectDropDownOption[] = [];
  @Input() regionsList: SelectDropDownOption[] = [];
  @Input() user: UserDetail;
  @Input() isBTQUser = false;
  @Input() isRegUser = false;
  @Input() validLocation: LocationData = null;
  @Input() validEmailLocation: string = null;
  @Input() validContact = null;
  @Input() userLocationCode = '';
  @Input() mobilenomaxlength = 0;
  @Input() permissions$: Observable<any[]>;
  @Input() mappedLocationData: LocationMappingData[] = [];
  @Input() roleDetails: RoleDetail[]


  @Output() addNewUser = new EventEmitter<any>();
  @Output() updateUser = new EventEmitter<any>();
  @Output() loadRoles = new EventEmitter<any>();
  @Output() validateLocation = new EventEmitter<string>();
  @Output() validateEmailLocation = new EventEmitter<string>();
  @Output() validateEmailMobile = new EventEmitter<any>();
  @Output() loadStates = new EventEmitter<string>();
  @Output() resendOTP = new EventEmitter<string>();
  @Output() addLocationMapping = new EventEmitter();

  userForm: FormGroup;
  validEmail = true;
  validMobile = true;
  validLocationCode = true;
  validEmailLocationCode = false;
  validemailpattern = false;
  currentDate = moment();
  maxPastDate = moment().subtract(100, 'year');
  USER_FORM_RESENDOTP_BTN = 'Uam User Form - Resend OTP Btn';
  USER_FORM_SAVE_BTN = 'Uam User Form - Save Btn';

  empidLabel: string;
  fullnameLabel: string;
  mobileLabel: string;
  addressLabel: string;
  lineOneLabel: string;
  lineTwoLabel: string;
  cityLabel: string;
  pincodeLabel: string;
  emailLabel: string;
  stateLabel: string;
  countryLabel: string;
  roleTypeLabel: string;
  roleTypes = RoleTypes;
  destroy$ = new Subject<null>();
  isLocationMappingRequired = false;

  private regExp: RegExp = new RegExp(
    '(?:btq|mgr|bos).*@titan.(co.in|com)',
    'i'
  );

  private regex: RegExp = new RegExp(
    '([a-zA-Z0-9]+)([_.-{1}])?([a-zA-Z0-9]+)@titan.(co.in|com)',
    'i'
  );
  private storetype = Array(
    StoreTypes.LargeFormatStoreType.toString(),
    StoreTypes.MediumFormatStoreType.toString(),
    StoreTypes.SmallFormatStoreType.toString()
  );
  selectedLocations: { id: string; description: string }[] = [];
  constructor(
    private formbuilder: FormBuilder,
    @Inject(POSS_WEB_DATE_FORMAT) public dateFormat,
    private locationMappingService: LocationMappingServiceAbstraction,
    private translationService: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private elementPermission: ElementPermissionService
  ) {
    this.empidLabel = this.translationService.instant(
      'pw.usermanagementform.employeeidPlaceholderText'
    );
    this.fullnameLabel = this.translationService.instant(
      'pw.usermanagementform.employeenamePlaceholderText'
    );
    this.mobileLabel = this.translationService.instant(
      'pw.usermanagementform.mobilenoPlaceholderText'
    );
    this.emailLabel = this.translationService.instant(
      'pw.usermanagementform.emailPlaceholderText'
    );
    this.addressLabel = this.translationService.instant(
      'pw.usermanagementform.addressPlaceholderText'
    );
    this.lineOneLabel = this.translationService.instant(
      'pw.usermanagementform.lineOneLabelText'
    );
    this.lineTwoLabel = this.translationService.instant(
      'pw.usermanagementform.lineTwoLabelText'
    );
    this.cityLabel = this.translationService.instant(
      'pw.usermanagementform.cityPlaceholderText'
    );
    this.pincodeLabel = this.translationService.instant(
      'pw.usermanagementform.pincodePlaceholderText'
    );
    this.stateLabel = this.translationService.instant(
      'pw.usermanagementform.stateLabelText'
    );
    this.countryLabel = this.translationService.instant(
      'pw.usermanagementform.countryLabelText'
    );
    this.roleTypeLabel = this.translationService.instant(
      'pw.usermanagementform.typeofrolePlaceholderText'
    );
  }

  ngOnInit(): void {
    this.createUserForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      this.populateUserForm(this.user);
    }
    if (
      changes['validEmailLocation'] &&
      changes['validEmailLocation'].currentValue
    ) {
      this.validEmailLocationCode = !!this.validEmailLocation;
      this.userForm.controls['email'].updateValueAndValidity();
    }
    if (changes['validLocation'] && changes['validLocation'].currentValue) {
      if (this.validLocation && this.validLocation.countryCode) {
        this.userForm.patchValue({
          country: this.validLocation.countryCode
        });
      }
      if (this.validLocation && this.validLocation.locationCode) {
        this.validLocationCode = true;
      } else {
        this.validLocationCode = false;
        if (this.isBTQUser) {
          this.rolesList = null;
        }
      }

      if (
        this.userForm &&
        this.userForm.controls['locationcode'].value.length > 0
      ) {
        this.userForm.controls['locationcode'].updateValueAndValidity();
      }
    }
    // To populate India as default country for New Users
    if (
      !this.user &&
      this.userForm &&
      changes['countriesList'] &&
      changes['countriesList'].currentValue &&
      changes['countriesList'].currentValue.length > 0
    ) {
      const defaultCountry = this.countriesList.find(
        country => country.value === CountryCodeEnum.IndiaCode
      );

      if (this.userForm && !!defaultCountry) {
        this.userForm.patchValue({
          country: defaultCountry.value
        });
        this.countryChanged(defaultCountry);
      }
    }
    if (changes['validContact'] && changes['validContact'].currentValue) {
      if (this.validContact) {
        if (this.validContact['email'] !== undefined) {
          this.validEmail = this.validContact['email'];
          this.userForm.controls['email'].setValidators([
            this.fieldValidatorsService.emailField(this.emailLabel),

            this.fieldValidatorsService.isUniqueCheck(
              this.emailLabel,
              this.validEmail
            )
          ]);
          this.userForm.controls['email'].updateValueAndValidity();
        } else {
          this.validMobile = this.validContact['mobile'];
          this.userForm.controls['mobile'].setValidators([
            this.fieldValidatorsService.requiredField(this.mobileLabel),
            this.fieldValidatorsService.mobileField(this.mobileLabel),
            this.fieldValidatorsService.maxLength(
              this.mobilenomaxlength,
              this.mobileLabel
            ),
            this.fieldValidatorsService.minLength(
              this.mobilenomaxlength,
              this.mobileLabel
            ),
            this.fieldValidatorsService.isUniqueCheck(
              this.mobileLabel,
              this.validMobile
            )
          ]);
          this.userForm.controls['mobile'].updateValueAndValidity();
        }
      }
    }
    if (changes['rolesList'] && changes['rolesList'].currentValue) {
      if (
        this.user &&
        this.userForm.controls['roletype'].value === RoleTypes.Boutique
      ) {
        if (this.user.primaryRole) {
          this.rolesList.push({
            value: this.user.primaryRole,
            description: this.user.roleName
          });
        }
        if (this.user.secondaryRole) {
          this.rolesList.push({
            value: this.user.secondaryRole,
            description: this.user.secondaryRoleName
          });
        }
      }
    }
  }

  countryChanged($event) {
    this.loadStates.emit($event.value);
    this.userForm.patchValue({
      state: ''
    });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  checkEmailValidation($event) {
    if (!this.user || this.user.emailId !== $event.target.value)
      if (
        this.userForm.get('email').value !== '' &&
        (this.userForm.get('email').valid || this.validEmail === false)
      ) {
        this.validateEmailMobile.emit({
          EMAIL: $event.target.value
        });
      }
  }

  checkMobileNumberValidation($event) {
    if (!this.user || this.user.mobileNo !== $event.target.value)
      if (this.userForm.get('mobile').valid || this.validMobile === false) {
        this.validateEmailMobile.emit({
          MOBILE: $event.target.value
        });
      }
  }

  createUserForm() {
    this.userForm = this.formbuilder.group({
      empid: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.empidLabel),
          this.fieldValidatorsService.employeeCodeField(this.empidLabel),
          this.fieldValidatorsService.maxLength(15, this.empidLabel)
        ]
      ],
      fullname: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.fullnameLabel),
          this.fieldValidatorsService.nameWithSpaceField(this.fullnameLabel),
          this.fieldValidatorsService.maxLength(80, this.fullnameLabel)
        ]
      ],
      joiningdate: '',
      dateofbirth: '',
      fromdate: '',
      tilldate: '',
      resignationdate: '',
      mobile: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.mobileLabel),
          this.fieldValidatorsService.mobileField(this.mobileLabel),
          this.fieldValidatorsService.maxLength(
            this.mobilenomaxlength,
            this.mobileLabel
          ),
          this.fieldValidatorsService.minLength(
            this.mobilenomaxlength,
            this.mobileLabel
          )
        ]
      ],
      email: '',
      address: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.lineOneLabel),
          this.fieldValidatorsService.addressField(this.lineOneLabel),
          this.fieldValidatorsService.maxLength(100, this.lineOneLabel)
        ]
      ],
      line2: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.lineTwoLabel),
          this.fieldValidatorsService.addressField(this.lineTwoLabel),
          this.fieldValidatorsService.maxLength(100, this.lineTwoLabel)
        ]
      ],
      city: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.cityLabel),
          this.fieldValidatorsService.cityField(this.cityLabel),
          this.fieldValidatorsService.maxLength(50, this.cityLabel)
        ]
      ],
      pincode: [
        '',
        [
          this.fieldValidatorsService.requiredField(this.pincodeLabel),
          this.fieldValidatorsService.pincodeField(this.pincodeLabel),
          this.fieldValidatorsService.maxLength(10, this.pincodeLabel)
        ]
      ],
      state: ['', [this.fieldValidatorsService.requiredField(this.stateLabel)]],
      country: [
        '',
        [this.fieldValidatorsService.requiredField(this.countryLabel)]
      ],
      roletype: [
        this.isBTQUser ? RoleTypes.Boutique : RoleTypes.Corporate,
        this.fieldValidatorsService.requiredField(this.roleTypeLabel)
      ],
      role: '',
      secondaryrole: '',
      locationcode: [
        this.isBTQUser ? this.userLocationCode : '',
        [
          (locationcode: FormControl): { [key: string]: boolean } =>
            this.validLocationCode ? null : { invalidLocation: true }
        ]
      ],
      regioncode: [this.isRegUser ? this.userLocationCode : ''],
      isLoginActive: 'true',
      islocked: false
    });

    this.userForm.controls['email'].setValidators([
      this.fieldValidatorsService.emailField(this.emailLabel),

      (email: FormControl) => {
        if (
          this.userForm.controls['roletype'].value === RoleTypes.Boutique &&
          email.value
        ) {
          const lowerCaseEmail = email.value.toLowerCase();

          // if (
          //   this.validLocation &&
          //   this.validLocation.ownerTypeCode === StoreFormatsEnum.L1_STORE &&
          //   !this.regex.test(email.value)
          // ) {
          //   return { invalid: true };
          // }
          if (this.regExp.test(email.value)) {
            this.validateEmailLocation.emit(
              lowerCaseEmail.slice(
                lowerCaseEmail.indexOf(
                  lowerCaseEmail.includes(UamEnums.LOWERCASE_BTQ)
                    ? UamEnums.LOWERCASE_BTQ
                    : lowerCaseEmail.includes(UamEnums.LOWERCASE_MGR)
                    ? UamEnums.LOWERCASE_MGR
                    : UamEnums.LOWERCASE_BOS
                ) + 3,
                lowerCaseEmail.indexOf('@')
              )
            );

            return null;
            // return !this.validEmailLocationCode ? null : { invalidEmail: true };
          }
        // } else if (
        //   email.value &&
        //   (this.userForm.controls['roletype'].value === RoleTypes.Corporate ||
        //     this.userForm.controls['roletype'].value === RoleTypes.Regional) &&
        //  !this.regex.test(email.value)
        // ) {
        //   return { invalid: true };
        // }
        }
      }
    ]);

    this.userForm.controls['regioncode'].setValidators((control: FormControl) =>
      !control.value &&
      this.userForm.controls['roletype'].value === RoleTypes.Regional
        ? { invalid: true }
        : null
    );

    this.userForm.controls['role'].setValidators([
      this.fieldValidatorsService.isPrimaryRoleRequiredForBoutiqueLocation(
        'role',
        this.userForm.get('role'),
        this.userForm.get('locationcode'),
        this.userForm.get('roletype')
      ),
      this.fieldValidatorsService.invalidLocationDetailsCheck(
        'role',
        this.userForm.get('locationcode'),
        this.userForm.get('roletype')
      )
    ]);

    this.userForm.controls['secondaryrole'].setValidators([
      this.fieldValidatorsService.isSameRoleCheck(
        'secondaryrole',
        this.userForm.get('role')
      )
    ]);

    this.userForm.controls['fromdate'].setValidators((control: FormControl) =>
      this.userForm.controls['secondaryrole'].value && !control.value
        ? { required: true }
        : control.value &&
          this.userForm.controls['joiningdate'].value &&
          (this.userForm.controls['fromdate'].value !== null ||
            this.userForm.controls['fromdate'].value !== undefined) &&
          control.value < this.userForm.controls['joiningdate'].value
        ? { invalid: true }
        : control.value &&
          this.userForm.controls['resignationdate'].value &&
          (!this.userForm.controls['fromdate'].value ||
            this.userForm.controls['fromdate'].value !== undefined) &&
          control.value > this.userForm.controls['resignationdate'].value
        ? { invalid: true }
        : null
    );

    this.userForm.controls['tilldate'].setValidators((control: FormControl) =>
      this.userForm.controls['secondaryrole'].value && !control.value
        ? { required: true }
        : control.value &&
          this.userForm.controls['fromdate'].value &&
          control.value < this.userForm.controls['fromdate'].value
        ? { invalid: true }
        : control.value &&
          this.userForm.controls['resignationdate'].value &&
          control.value > this.userForm.controls['resignationdate'].value
        ? { invalid: true }
        : null
    );

    this.userForm.controls[
      'joiningdate'
    ].setValidators((control: FormControl) =>
      (this.userForm.controls['dateofbirth'].value &&
        control.value &&
        control.value < this.userForm.controls['dateofbirth'].value) ||
      (!control.value && this.userForm.controls['fromdate'].value)
        ? { invalid: true }
        : null
    );

    this.userForm.controls[
      'resignationdate'
    ].setValidators((control: FormControl) =>
      this.userForm.controls['joiningdate'].value &&
      control.value &&
      control.value < this.userForm.controls['joiningdate'].value
        ? { invalid: true }
        : null
    );
  }

  populateUserForm(user: UserDetail) {
    this.userForm.patchValue({
      empid: user.employeeCode,
      fullname: user.empName.trim(),
      joiningdate: user.joiningDate.isValid() ? user.joiningDate : '',
      dateofbirth: user.birthDate.isValid() ? user.birthDate : '',
      fromdate:
        user.secondarystarttime.isValid() && user.secondaryRole
          ? user.secondarystarttime
          : '',
      tilldate:
        user.secondaryendtime.isValid() && user.secondaryRole
          ? user.secondaryendtime
          : '',
      resignationdate: user.resignationDate.isValid()
        ? user.resignationDate
        : '',
      mobile: user.mobileNo,
      email: user.emailId,
      address: user.address ? user.address.line1 : '',
      line2: user.address ? user.address.line2 : '',
      city: user.address ? user.address.city : '',
      pincode: user.address ? user.address.pincode : '',
      country: user.address ? user.address.country : '',
      state: user.address ? user.address.state.toUpperCase() : '',

      roletype:
        this.isBTQUser || this.storetype.includes(user.userType)
          ? RoleTypes.Boutique
          : user.userType === StoreTypes.RegionalStoreType.toString()
          ? RoleTypes.Regional
          : RoleTypes.Corporate,
      role: user.primaryRole,
      secondaryrole: user.secondaryRole,
      locationcode: this.isBTQUser
        ? this.userLocationCode.toUpperCase()
        : user.locationCode.toUpperCase(),
      regioncode: this.isRegUser
        ? this.userLocationCode.toUpperCase()
        : user.regionCode.toUpperCase(),
      isLoginActive: user.isLoginActive.toString(),
      islocked: user.isLocked
    });
    if (!!user.address.country) {
      this.loadStates.emit(user.address.country);
    }
  }

  validateForm() {
    if (this.userForm.controls['roletype'].value !== RoleTypes.Boutique) {
      this.userForm.controls['locationcode'].clearValidators();
      this.userForm.controls['locationcode'].updateValueAndValidity();
    }
    if (this.userForm.controls['roletype'].value !== RoleTypes.Regional) {
      this.userForm.controls['regioncode'].clearValidators();
      this.userForm.controls['regioncode'].updateValueAndValidity();
    }
    const invalid = [];
    const controls = this.userForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    if (this.userForm.valid) {
      const address: AddressData = {
        line1: this.userForm.controls['address'].value,
        line2: this.userForm.controls['line2'].value,
        city: this.userForm.controls['city'].value,
        country: this.userForm.controls['country'].value,
        pincode: this.userForm.controls['pincode'].value,
        state: this.userForm.controls['state'].value
      };

      const userdata = {
        ...((this.user
          ? !this.user.address ||
            JSON.stringify(address) !== JSON.stringify(this.user.address)
          : true) && {
          address: {
            data: {
              ...address,
              country: this.userForm.controls['country'].value
            },
            type: 'address'
          }
        }),
        ...((this.user
          ? this.userForm.controls['dateofbirth'].value['_d'] !== undefined &&
            this.user.birthDate.toDate().toString() !==
              this.userForm.controls['dateofbirth'].value['_d'].toString()
          : '') && {
          birthDate: moment(
            this.userForm.controls['dateofbirth'].value['_d']
          ).valueOf()
        }),
        ...(!this.user &&
          this.userForm.controls['dateofbirth'].value['_d'] && {
            birthDate: moment(
              this.userForm.controls['dateofbirth'].value['_d']
            ).valueOf()
          }),

        ...((this.user
          ? this.user.empName !== this.userForm.controls['fullname'].value
          : true) && { empName: this.userForm.controls['fullname'].value }),
        ...((this.user
          ? this.user.isLoginActive.toString() !==
            this.userForm.controls['isLoginActive'].value
          : true) && {
          isLoginActive:
            this.userForm.controls['isLoginActive'].value === 'true'
        }),
        ...(!this.user && {
          employeeCode: this.userForm.controls['empid'].value
        }),
        ...(this.userForm.controls['roletype'].value === RoleTypes.Boutique &&
          !this.user && {
            locationCode: this.userForm.controls[
              'locationcode'
            ].value.toUpperCase()
          }),
        ...(this.userForm.controls['roletype'].value === RoleTypes.Regional &&
          !this.user &&
          this.userForm.controls['regioncode'].value !== '' && {
            regionCode: this.userForm.controls['regioncode'].value.toUpperCase()
          }),
        ...(this.userForm.controls['roletype'].value === RoleTypes.Corporate &&
          !this.user && {
            organizationCode: this.userLocationCode.toUpperCase()
          }),

        ...((this.user
          ? this.userForm.controls['joiningdate'].value['_d'] !== undefined &&
            this.user.joiningDate.toDate().toString() !==
              this.userForm.controls['joiningdate'].value['_d'].toString()
          : '') && {
          joiningDate: moment(
            this.userForm.controls['joiningdate'].value['_d']
          ).valueOf()
        }),
        ...(!this.user &&
          this.userForm.controls['joiningdate'].value['_d'] && {
            joiningDate: moment(
              this.userForm.controls['joiningdate'].value['_d']
            ).valueOf()
          }),

        ...((this.user
          ? this.userForm.controls['resignationdate'].value['_d'] !==
              undefined &&
            this.user.resignationDate.toDate().toString() !==
              this.userForm.controls['resignationdate'].value['_d'].toString()
          : '') && {
          resignationDate: moment(
            this.userForm.controls['resignationdate'].value['_d']
          ).valueOf()
        }),
        ...(!this.user &&
          this.userForm.controls['resignationdate'].value['_d'] && {
            resignationDate: moment(
              this.userForm.controls['resignationdate'].value['_d']
            ).valueOf()
          }),
        ...((this.user
          ? this.userForm.controls['email'].value &&
            this.user.emailId !== this.userForm.controls['email'].value
          : this.userForm.controls['email'].value) && {
          emailId: this.userForm.controls['email'].value
        }),
        ...((this.user
          ? this.user.mobileNo !== this.userForm.controls['mobile'].value
          : true) && { mobileNo: this.userForm.controls['mobile'].value }),
        ...((this.user
          ? this.user.primaryRole !== this.userForm.controls['role'].value
          : true) && { primaryRoleCode: this.userForm.controls['role'].value }),

        ...(!this.user &&
          this.userForm.controls['secondaryrole'].value && {
            tempRoleCodes: [this.userForm.controls['secondaryrole'].value],
            expiryDate: moment(
              this.userForm.controls['tilldate'].value['_d']
            ).valueOf(),
            startDate: moment(
              this.userForm.controls['fromdate'].value['_d']
            ).valueOf()
          }),
        ...(!this.user && this.mappedLocationData &&{
          addLocations: this.mappedLocationData.map(x => x.id)
          }),
        ...(this.user &&
          this.userForm.controls['secondaryrole'].value !==
            this.user.secondaryRole && {
            ...(this.userForm.controls['secondaryrole'].value && {
              addTempRoleCodes: [this.userForm.controls['secondaryrole'].value]
            }),
            ...(this.user.secondaryRole && {
              removeTempRoleCodes: [this.user.secondaryRole]
            }),
            ...(this.userForm.controls['secondaryrole'].value && {
              expiryDate: moment(
                this.userForm.controls['tilldate'].value['_d']
              ).valueOf(),
              startDate: moment(
                this.userForm.controls['fromdate'].value['_d']
              ).valueOf()
            })
          }),
        ...((this.user
          ? this.userForm.controls['fromdate'].value['_d'] !== undefined &&
            this.user.secondarystarttime.toDate().toString() !==
              this.userForm.controls['fromdate'].value['_d'].toString()
          : '') && {
          startDate: moment(
            this.userForm.controls['fromdate'].value['_d']
          ).valueOf()
        }),
        ...((this.user
          ? this.userForm.controls['tilldate'].value['_d'] !== undefined &&
            this.user.secondaryendtime.toDate().toString() !==
              this.userForm.controls['tilldate'].value['_d'].toString()
          : '') && {
          expiryDate: moment(
            this.userForm.controls['tilldate'].value['_d']
          ).valueOf()
        }),
        ...(this.user &&
          this.user.secondaryRole &&
          this.userForm.controls['secondaryrole'].value ===
            this.user.secondaryRole &&
          this.user.secondaryendtime.toDate().toString() !==
            this.userForm.controls['tilldate'].value['_d'].toString() && {
            updateTempExpiryTime: moment(
              this.userForm.controls['tilldate'].value['_d']
            ).valueOf(),
            updateTempRoleCode: this.user.secondaryRole
          }),
        ...(this.user &&
          this.user.secondaryRole &&
          this.userForm.controls['secondaryrole'].value ===
            this.user.secondaryRole &&
          this.user.secondarystarttime.toDate().toString() !==
            this.userForm.controls['fromdate'].value['_d'].toString() && {
            updateTempStartTime: moment(
              this.userForm.controls['fromdate'].value['_d']
            ).valueOf(),
            updateTempRoleCode: this.user.secondaryRole
          })
      };

      this.user
        ? this.updateUser.emit(userdata)
        : this.addNewUser.emit(userdata);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  secondaryRoleCodeChange(event: MatSelectChange) {
    this.userForm.patchValue({
      ...(event.value && {
        ...(this.user &&
          this.user.secondaryendtime.isValid() &&
          this.user.secondarystarttime.isValid() &&
          this.user.secondaryRole === event.value && {
            fromdate: this.user.secondarystarttime,
            tilldate: this.user.secondaryendtime
          }),
        ...(!(
          this.user &&
          this.user.secondaryendtime.isValid() &&
          this.user.secondarystarttime.isValid() &&
          this.user.secondaryRole === event.value
        ) && {
          fromdate: moment(),
          tilldate: moment()
        })
      }),
      ...(!event.value && {
        fromdate: '',
        tilldate: ''
      })
    });
    this.userForm.get('secondaryrole').updateValueAndValidity();
  }

  openLocationSelection = () =>
    this.locationMappingService
      .open({
        selectedLocations: this.selectedLocations
      })
      .pipe(
        filter(response => response.type === 'apply'),
        take(1)
      )
      .subscribe((res: LocationMappingServiceResponse) => {
        this.selectedLocations = res.data.selectedLocations;
      });
  locationCodeChange(event: any) {
    this.roleTypeChanged(this.userForm.get('roletype').value);
    this.validateLocation.emit(event.target.value.toUpperCase());
  }

  clearUser(userFormDirective: FormGroupDirective) {
    userFormDirective.resetForm();
    userFormDirective.control.updateValueAndValidity();
    this.createUserForm();
    this.loadRolesInfo();
  }

  loadRolesInfo() {
    this.userForm.controls['locationcode'].value === '' &&
    this.userForm.controls['roletype'].value === RoleTypes.Boutique
      ? (this.rolesList = null)
      : this.loadRoles.emit({
          roleType: this.userForm.controls['roletype'].value,
          locationCode: this.userForm.controls[
            'locationcode'
          ].value.toUpperCase()
        });
  }
  roleTypeChanged(type: string) {
    this.userForm.patchValue({
      role: '',
      secondaryrole: ''
    });
    this.userForm.controls['email'].updateValueAndValidity();
    this.userForm.controls['role'].updateValueAndValidity();
    this.userForm.controls['locationcode'].value === '' &&
    type === RoleTypes.Boutique
      ? (this.rolesList = null)
      : this.loadRoles.emit({
          roleType: type,
          locationCode: this.userForm.controls[
            'locationcode'
          ].value.toUpperCase()
        });

    this.userForm.controls['regioncode'].setValidators((control: FormControl) =>
      !control.value && type === RoleTypes.Regional ? { invalid: true } : null
    );
  }

  openLocationMapping() {
    this.locationMappingService
      .open({
        selectedLocations: this.mappedLocationData ? this.mappedLocationData : []
      })
      .pipe(
        filter(response => response.type === 'apply'),
        take(1)
      )
      .subscribe((res: LocationMappingServiceResponse) => {
        if (!this.user) {
          this.mappedLocationData = res.data.selectedLocations;
        } else {
          const payload: LocationMappingPayLoad = {
            addeLocations: res.data?.addedLocations.map(x => x.id ),
            removeLocations: res.data?.removedLocations.map(x => x.id),
            updateLocations: res.data?.selectedLocations.map(x => x.id)
          }
          this.addLocationMapping.emit(payload);
        }
      });
  }

  isLocationMapping(): boolean {
    return this.roleDetails?.some(x => x.isLocationMappingRequired && (x.roleCode === this.userForm.get('role').value || x.roleCode === this.userForm.get('secondaryrole').value))
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
}
