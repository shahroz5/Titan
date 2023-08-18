import {
  AfterViewInit,
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

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

import {
  ButtonType,
  CommandButton,
  HelperFunctions,
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  AlertPopupServiceAbstraction,
  BrandSummary,
  CurrencyTypes,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails,
  LocationTypeLists,
  OwnerTypeList,
  StateTypes,
  LocationCFAType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import {
  LocationBoutiqueFactoryModel,
  LocationContactModel,
  LocationCurrencyModel,
  LocationHallmarkModel,
  LocationMainFormModel,
  LocationWalkinsModel
} from '@poss-web/shared/ui-master-form-models';

@Component({
  selector: 'poss-web-location-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [commandButtons]="commandButtons"
      (buttonClick)="buttonClick($event)"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `
})
export class LocationFormComponent implements OnInit, AfterViewInit, OnDestroy {
  // [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
  constructor(
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private helperFunctions: HelperFunctions,
    public dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Input() locationTypes: any;
  @Input() ownerInfo: any;
  @Input() locationStates: StateTypes[];
  @Input() regions: any;
  @Input() brandName: BrandSummary[];
  @Input() subRegion$: Observable<any>;
  @Input() marketCode: any;
  @Input() currencyTypes: CurrencyTypes[];
  @Input() locationSize: StateTypes[];
  @Input() countryCode: { id: string; name: string }[];
  @Input() locationCFATypes: LocationCFAType[];

  @Input() curency$: Observable<any>;

  @Input() subBrandName$: Observable<any>;
  @Input() locationTowns$: Observable<any>;

  @Output() formOutput = new EventEmitter<any>();
  @Output() formGroupCreatedOutput = new EventEmitter<FormGroup>();
  @Output() formGroup = new EventEmitter<FormGroup>();
  @Output() priceGroupMapping = new EventEmitter<boolean>();

  locationCode: string;

  destroy$: Subject<null> = new Subject<null>();
  public currentStyle: string[];
  public formFields: any;

  commandButtons: CommandButton[] = [
    {
      name: 'Price Group Mapping',
      cssClassName: 'pw-btn pw-primary-btn',
      type: ButtonType.BUTTON
    },
    {
      name: 'Cancel',
      cssClassName: 'pw-btn pw-accent-btn',
      type: ButtonType.CANCEL
    },
    {
      name: 'Save',
      cssClassName: 'pw-btn pw-accent-btn',
      type: ButtonType.SUBMIT
    }
  ];

  ngOnInit(): void {
    const form = this.prepareSet();

    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet() {
    const isActiveToggle = [
      {
        id: '1',
        name: 'pw.locationMaster.isActive',
        checked: this.locationDetails.isActive
      }
    ];
    const isOffline = [
      {
        id: '1',
        name: 'pw.locationMaster.isOffline',
        checked: this.locationDetails.isOffline
      }
    ];
    // const isAutostn = [
    //   {
    //     id: '1',
    //     name: 'pw.locationMaster.isAutostn',
    //     checked: this.locationDetails.isAutostn
    //   }
    // ];
    const isDial = [
      {
        id: '1',
        name: 'pw.locationMaster.isDial',
        checked: this.locationDetails.storeDetails.data.isDial
      }
    ];
    const isEinvoiceEnabled = [
      {
        id: '1',
        name: 'pw.locationMaster.isEinvoiceEnabled',
        checked: this.locationDetails.storeDetails.data.isEinvoiceEnabled
      }
    ];

    const panCardVerifyIntegrationEnabled = [
      {
        id: '1',
        name: 'pw.locationMaster.panCardVerifyIntegration',
        checked: this.locationDetails.storeDetails.data
          .isPanCardVerifyIntegrationEnabled
      }
    ];

    const locationSize = this.helperFunctions.patchValue(
      this.locationSize,
      'id',
      'selected',
      this.locationDetails.locationFormat,
      true
    );

    const locationType = this.helperFunctions.patchValue(
      this.locationTypes,
      'id',
      'selected',
      this.locationDetails.locationTypeCode,
      true
    );

    const country = this.helperFunctions.patchValue(
      this.countryCode,
      'id',
      'selected',
      'IND',
      true
    );

    const state = this.helperFunctions.patchValue(
      this.locationStates,
      'id',
      'selected',
      this.locationDetails.stateId,
      true
    );

    const ownerInfo = this.helperFunctions.patchValue(
      this.ownerInfo,
      'id',
      'selected',
      this.locationDetails.ownerTypeCode,
      true
    );
    const locationCFATypes = this.helperFunctions.patchValue(
      this.locationCFATypes,
      'id',
      'selected',
      this.locationDetails.cfaCodeValue,
      true
    );

    const region = this.helperFunctions.patchValue(
      this.regions,
      'id',
      'selected',
      this.locationDetails.regionCode,
      true
    );

    const subregion = this.helperFunctions.patchValue(
      [],
      'id',
      'selected',
      this.locationDetails.subRegionCode,
      true
    );

    const marketCode = this.helperFunctions.patchValue(
      this.marketCode,
      'id',
      'selected',
      this.locationDetails.marketCode,
      true
    );

    const brandName = this.helperFunctions.patchValue(
      this.brandName,
      'id',
      'selected',
      this.locationDetails.brandCode,
      true
    );

    const locationBoutiqueFactoryModel = new LocationBoutiqueFactoryModel(
      1,
      // isActiveToggle,
      this.locationDetails.locationCode,
      locationType,
      locationSize,
      this.locationDetails.description ? this.locationDetails.description : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.companyName
          ? this.locationDetails.storeDetails.data.companyName
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.addressLines
          ? this.locationDetails.storeDetails.data.addressLines[0]
            ? this.locationDetails.storeDetails.data.addressLines[0]
            : ''
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.addressLines
          ? this.locationDetails.storeDetails.data.addressLines[1]
            ? this.locationDetails.storeDetails.data.addressLines[1]
            : ''
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.addressLines
          ? this.locationDetails.storeDetails.data.addressLines[2]
            ? this.locationDetails.storeDetails.data.addressLines[2]
            : ''
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.phoneNumber1
          ? this.locationDetails.storeDetails.data.phoneNumber1
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.phoneNumber2
          ? this.locationDetails.storeDetails.data.phoneNumber2
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.contactNumber
          ? this.locationDetails.storeDetails.data.contactNumber
          : ''
        : '',
      country,
      state,
      [],
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.pincode
          ? this.locationDetails.storeDetails.data.pincode.toString()
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.reviewLinkURL
          ? this.locationDetails.storeDetails.data.reviewLinkURL
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.boutiqueEmailId
          ? this.locationDetails.storeDetails.data.boutiqueEmailId.toString()
          : ''
        : '',
      this.locationDetails.factoryCodeValue
        ? this.locationDetails.factoryCodeValue
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.regdOffice
          ? this.locationDetails.storeDetails.data.regdOffice
          : ''
        : '',
      // this.locationDetails.cfaCodeValue
      //   ? this.locationDetails.cfaCodeValue
      //   : '',
      locationCFATypes,
      ownerInfo,
      region,
      subregion,
      brandName,
      [],
      marketCode,
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.cinNumber
          ? this.locationDetails.storeDetails.data.cinNumber
          : ''
        : '',
      this.locationDetails.remarks ? this.locationDetails.remarks : '',
      this.locationDetails.storeDetails.data.maxRateRetryAttempt
        ? this.locationDetails.storeDetails.data.maxRateRetryAttempt
        : '',
      isDial,
      isEinvoiceEnabled,
      panCardVerifyIntegrationEnabled,
      isOffline,
      // isAutostn,
      this.fieldValidatorsService,
      this.translateService
    );

    const locationContactModel = new LocationContactModel(
      1,
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.corporateAddress
          ? this.locationDetails.storeDetails.data.corporateAddress
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );


    const baseCurrency: {
      id: string;
      name: string;
      selected?: boolean;
    }[] = this.currencyTypes;
    const masterCurrency: {
      id: string;
      name: string;
      selected?: boolean;
    }[] = this.currencyTypes;
    const paymentCurrency: {
      id: string;
      name: string;
      selected?: boolean;
    }[] = this.currencyTypes;

    const locationCurrencyModel = new LocationCurrencyModel(
      1,
      baseCurrency,
      masterCurrency,
      paymentCurrency,
      this.fieldValidatorsService,
      this.translateService
    );

    const walkInDetails = [
      {
        id: '1',
        name: 'pw.locationMaster.isWalkinsDetailsMandatory',
        checked: this.locationDetails.storeDetails
          ? this.locationDetails.storeDetails.data.isWalkInsDetailsMandatory
            ? this.locationDetails.storeDetails.data.isWalkInsDetailsMandatory
            : false
          : false
      }
    ];
    const locationWalkinsModel = new LocationWalkinsModel(
      1,
      walkInDetails,
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.noOfDays
          ? this.locationDetails.storeDetails.data.noOfDays
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.numberOfDaysToDisplay
          ? this.locationDetails.storeDetails.data.numberOfDaysToDisplay
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const isHallmarkingEnabled = [
      {
        id: '1',
        name: 'pw.locationMaster.isHallmarkingEnabled',
        checked: this.locationDetails.storeDetails
          ? this.locationDetails.storeDetails.data.isHallmarkingEnabled
            ? this.locationDetails.storeDetails.data.isHallmarkingEnabled
            : false
          : false
      }
    ];
    const locationHallmarkModel = new LocationHallmarkModel(
      1,
      isHallmarkingEnabled,
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.hallmarkRegistrationNumber
          ? this.locationDetails.storeDetails.data.hallmarkRegistrationNumber
          : ''
        : '',
      this.locationDetails.storeDetails
        ? this.locationDetails.storeDetails.data.hallmarkGSTPercentage
          ? this.locationDetails.storeDetails.data.hallmarkGSTPercentage
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );

    const detailsmain = new LocationMainFormModel(
      1,
      locationBoutiqueFactoryModel,
      locationContactModel,
      locationCurrencyModel,
      locationWalkinsModel,
      locationHallmarkModel
    );

    return detailsmain;
  }

  getCssProp() {
    return [
      `
    .isActive {
      position: absolute;
      top: 15px;
      right: 0px;
      width: 150px;
     }

    .isOffline{
      position: absolute;
      top: 15px;
      right: 0px;
      width: 150px !important;
    }

    .isAutostn{
      position: absolute;
      top: 15px;
      right: 0px;
      width: 150px !important;
    }

    .rm-padding-left{
      margin-left:-15px;
    }

  `
    ];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.locationMaster.LocationInfo',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      // isActive: formData['1-locationBoutiqueFactoryModel']['1-isActive'][0],
      isActive: this.locationDetails?.isActive
        ? this.locationDetails?.isActive
        : false,
      isOffline: formData['1-locationBoutiqueFactoryModel']['1-isOffline'][0],
      // isAutostn: formData['1-locationBoutiqueFactoryModel']['1-isAutostn'][0],
      description:
        formData['1-locationBoutiqueFactoryModel']['1-locationShortName'],
      locationCode:
        formData['1-locationBoutiqueFactoryModel']['1-locationCode'],
      locationTypeCode:
        formData['1-locationBoutiqueFactoryModel']['1-locationType'],
      ownerTypeCode: formData['1-locationBoutiqueFactoryModel']['1-ownerInfo'],
      subRegionCode:
        formData['1-locationBoutiqueFactoryModel']['1-subRegion'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-subRegion']
          : null,
      regionCode:
        formData['1-locationBoutiqueFactoryModel']['1-region'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-region']
          : null,
      marketCode:
        formData['1-locationBoutiqueFactoryModel']['1-marketCode'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-marketCode']
          : null,
      townId: formData['1-locationBoutiqueFactoryModel']['1-cityTown'],
      stateId: formData['1-locationBoutiqueFactoryModel']['1-state'],
      countryCode: formData['1-locationBoutiqueFactoryModel']['1-country'],
      factoryCodeValue:
        formData['1-locationBoutiqueFactoryModel']['1-factoryCode'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-factoryCode']
          : null,
      baseCurrency:
        formData['1-locationCurrencyModel']['1-baseCurrency'] !== ''
          ? formData['1-locationCurrencyModel']['1-baseCurrency']
          : null,
      masterCurrency:
        formData['1-locationCurrencyModel']['1-masterCurrency'] !== ''
          ? formData['1-locationCurrencyModel']['1-masterCurrency']
          : null,
      stockCurrency:
        formData['1-locationCurrencyModel']['1-masterCurrency'] !== ''
          ? formData['1-locationCurrencyModel']['1-masterCurrency']
          : null,
      paymentCurrencies:
        formData['1-locationCurrencyModel']['1-paymentCurrency'] !== ''
          ? formData['1-locationCurrencyModel']['1-paymentCurrency']
          : null,
      brandCode:
        formData['1-locationBoutiqueFactoryModel']['1-brand'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-brand']
          : null,
      subBrandCode:
        formData['1-locationBoutiqueFactoryModel']['1-subBrand'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-subBrand']
          : null,
      locationFormat:
        formData['1-locationBoutiqueFactoryModel']['1-locationSize'],
      remarks: formData['1-locationBoutiqueFactoryModel']['1-overallRemarks'],
      cfaCodeValue:
        formData['1-locationBoutiqueFactoryModel']['1-cfaCode'] !== ''
          ? formData['1-locationBoutiqueFactoryModel']['1-cfaCode']
          : null,
      storeDetails: {
        type: LocationApiKeyEnum.STORE_DETAILS,
        data: {
          companyName:
            formData['1-locationBoutiqueFactoryModel']['1-locationName'],
          addressLines: [
            formData['1-locationBoutiqueFactoryModel']['1-address1'],
            formData['1-locationBoutiqueFactoryModel']['1-address2'],
            formData['1-locationBoutiqueFactoryModel']['1-address3']
          ],
          phoneNumber1:
            formData['1-locationBoutiqueFactoryModel']['1-phoneNumber1'],
          phoneNumber2:
            formData['1-locationBoutiqueFactoryModel']['1-phoneNumber2'],
          contactNumber:
            formData['1-locationBoutiqueFactoryModel']['1-mobileNumber'],
          corporateAddress:
            formData['1-locationContactModel']['1-corporateAddress'],
          cinNumber: formData['1-locationBoutiqueFactoryModel']['1-cinNumber'],
          isWalkInsDetailsMandatory:
            formData['1-walkInsModel']['1-walkInDetails'][0],
          pincode: formData['1-locationBoutiqueFactoryModel']['1-pinCode'],
          boutiqueEmailId:
            formData['1-locationBoutiqueFactoryModel']['1-boutiqueEmailId'],
          noOfDays: formData['1-walkInsModel']['1-numberOfDaysToEnter'],
          numberOfDaysToDisplay:
            formData['1-walkInsModel']['1-numberOfDaysToDisplay'],
          regdOffice:
            formData['1-locationBoutiqueFactoryModel']['1-registeredOffice'],
          maxRateRetryAttempt:
            formData['1-locationBoutiqueFactoryModel']['1-maxRateRetryAttempt'],
          isDial: formData['1-locationBoutiqueFactoryModel']['1-isDial'][0],
          isEinvoiceEnabled:
            formData['1-locationBoutiqueFactoryModel'][
              '1-isEinvoiceEnabled'
            ][0],
          isPanCardVerifyIntegrationEnabled:
            formData['1-locationBoutiqueFactoryModel'][
              '1-isPanCardVerifyIntegrationEnabled'
            ][0],
          isHallmarkingEnabled:
            formData['1-locationHallmarkModel']['1-isHallmarkingEnabled'][0],
          hallmarkRegistrationNumber:
            formData['1-locationHallmarkModel']['1-hallmarkRegistrationNumber'],
          hallmarkGSTPercentage:
            formData['1-locationHallmarkModel']['1-hallmarkGSTPercentage'],
          reviewLinkURL:
            formData['1-locationBoutiqueFactoryModel']['1-reviewLinkURL']
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
      // const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
      //   width: '500px',
      //   height: 'auto',
      //   disableClose: true,
      //   data: 'pw.inventoryMasters.invalidAlert'
      // });
      // dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  public formGroupCreated(formGroup: FormGroup) {
    const subForm: FormGroup = <FormGroup>(
      formGroup.get('1-locationBoutiqueFactoryModel')
    );

    this.formGroupCreatedOutput.emit(subForm);

    //Below fields are disabled on purpose
    formGroup
      .get('1-locationBoutiqueFactoryModel')
      .get('1-country')
      .disable({ onlySelf: true });
    formGroup
      .get('1-locationCurrencyModel')
      .get('1-baseCurrency')
      .disable({ onlySelf: true });
    formGroup
      .get('1-locationCurrencyModel')
      .get('1-masterCurrency')
      .disable({ onlySelf: true });
    formGroup
      .get('1-locationCurrencyModel')
      .get('1-paymentCurrency')
      .disable({ onlySelf: true });
    formGroup
      .get('1-walkInsModel')
      .get('1-numberOfDaysToDisplay')
      .disable({ onlySelf: true });
    //Below fields are disabled on purpose ends

    formGroup
      .get('1-walkInsModel')
      .get('1-numberOfDaysToEnter')
      .valueChanges.subscribe(val => {
        if (!isNaN(val)) {
          formGroup
            .get('1-walkInsModel')
            .get('1-numberOfDaysToDisplay')
            .patchValue(+val + 1);
        }
      });

    this.conditionalValidation(formGroup);
    /*   const walkInDetails = subForm.get('1-walkInDetails');

  if (walkInDetails.value[0]) {
    subForm
      .get('1-numberOfDaysToEnter')
      .enable({ onlySelf: true });
    subForm
      .get('1-numberOfDaysToDisplay')
      .enable({ onlySelf: true });
  } else {
    subForm
      .get('1-numberOfDaysToEnter')
      .disable({ onlySelf: true });
    subForm
      .get('1-numberOfDaysToDisplay')
      .disable({ onlySelf: true });
  }

  walkInDetails.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(data => {
    if (data[0]) {
      subForm
        .get('1-numberOfDaysToEnter')
        .enable({ onlySelf: true });
      subForm
        .get('1-numberOfDaysToDisplay')
        .enable({ onlySelf: true });
    } else {
      subForm
        .get('1-numberOfDaysToEnter')
        .disable({ onlySelf: true });
      subForm
        .get('1-numberOfDaysToDisplay')
        .disable({ onlySelf: true });
    }
  }); */

    this.formGroup.emit(formGroup);

    this.locationTowns$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const townArr: { value: string; description: string }[] = [];
      if (data) {
        data.forEach((twns: { id: any; name: any }) => {
          townArr.push({ value: twns.id, description: twns.name });
        });
      }
      if (townArr.length) {
        subForm.get('1-cityTown')['options'] = townArr;
        if (this.locationDetails.townId) {
          subForm.get('1-cityTown').patchValue(this.locationDetails.townId);
        }
      }
    });

    this.subRegion$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const subRegionArr: { value: string; description: string }[] = [];
      if (data) {
        data.forEach((rgns: { regionCode: any; description: any }) => {
          subRegionArr.push({
            value: rgns.regionCode,
            description: rgns.description
          });
        });
      }
      if (subRegionArr.length) {
        subForm.get('1-subRegion')['options'] = subRegionArr;
        if (this.locationDetails.subRegionCode) {
          subForm
            .get('1-subRegion')
            .patchValue(this.locationDetails.subRegionCode);
        }
      }
    });

    this.subBrandName$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      const subBrandArr: { value: string; description: string }[] = [];
      if (data) {
        data.forEach((rgns: { brandCode: any; description: any }) => {
          subBrandArr.push({
            value: rgns.brandCode,
            description: rgns.description
          });
        });
      }
      if (subBrandArr.length) {
        subForm.get('1-subBrand')['options'] = subBrandArr;
        if (this.locationDetails.subBrandCode) {
          subForm
            .get('1-subBrand')
            .patchValue(this.locationDetails.subBrandCode);
        }
      }
    });

    this.cdr.detectChanges();
  }

  conditionalValidation(formGroup: FormGroup) {
    const subForm: FormGroup = <FormGroup>(
      formGroup.get('1-locationBoutiqueFactoryModel')
    );

    // Conditional Validation
    const locationType = subForm.get('1-locationType');
    const ownerInfo = subForm.get('1-ownerInfo');

    if (this.locationDetails.ownerTypeCode === OwnerTypeList.L3) {
      this.translateService
        .get('pw.locationMaster.cfaCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-cfaCode',
            [
              this.fieldValidatorsService.locationCodeField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.cfaCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-cfaCode',
            [this.fieldValidatorsService.locationCodeField(fieldNameTranslate)]
          );
        });
    }

    if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
      this.translateService
        .get('pw.locationMaster.boutiqueEmailId')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-boutiqueEmailId',
            [
              this.fieldValidatorsService.emailField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.region')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-region',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.subRegion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-subRegion',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.locationSize')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-locationSize',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.locationShortName')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-locationShortName',
            [
              // this.fieldValidatorsService.alphaNumericField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });

      this.translateService
        .get('pw.locationMaster.marketCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-marketCode',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.factoryCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-factoryCode',
            [
              this.fieldValidatorsService.locationCodeField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });

      this.translateService
        .get('pw.locationMaster.ownerinfo')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-ownerInfo',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });

      this.translateService
        .get('pw.locationMaster.marketCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-marketCode',
            [
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.boutiqueEmailId')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-boutiqueEmailId',
            [this.fieldValidatorsService.emailField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.region')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-region',
            []
          );
        });
      this.translateService
        .get('pw.locationMaster.subRegion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-subRegion',
            []
          );
        });

      this.translateService
        .get('pw.locationMaster.locationSize')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-locationSize',
            []
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.locationShortName')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-locationShortName',
            [
              // this.fieldValidatorsService.alphaNumericField(fieldNameTranslate)
            ]
          );
        });

      this.translateService
        .get('pw.locationMaster.marketCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-marketCode',
            []
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.factoryCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-factoryCode',
            [this.fieldValidatorsService.locationCodeField(fieldNameTranslate)]
          );
        });

      this.translateService
        .get('pw.locationMaster.ownerinfo')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-ownerInfo',
            []
          );
        });

      this.translateService
        .get('pw.locationMaster.marketCode')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-locationBoutiqueFactoryModel',
            '1-marketCode',
            []
          );
        });
    }

    ownerInfo.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data === OwnerTypeList.L3) {
        this.translateService
          .get('pw.locationMaster.cfaCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-cfaCode',
              [
                this.fieldValidatorsService.locationCodeField(
                  fieldNameTranslate
                ),
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });
      } else {
        this.translateService
          .get('pw.locationMaster.cfaCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-cfaCode',
              [
                this.fieldValidatorsService.locationCodeField(
                  fieldNameTranslate
                )
              ]
            );
          });
      }
    });

    locationType.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data === LocationTypeLists.BTQ) {
        this.translateService
          .get('pw.locationMaster.boutiqueEmailId')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-boutiqueEmailId',
              [
                this.fieldValidatorsService.emailField(fieldNameTranslate),
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });
        this.translateService
          .get('pw.locationMaster.region')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-region',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });
        this.translateService
          .get('pw.locationMaster.subRegion')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-subRegion',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.locationSize')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-locationSize',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
            // correct
          });

        this.translateService
          .get('pw.locationMaster.locationShortName')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-locationShortName',
              [
                this.fieldValidatorsService.alphaNumericField(
                  fieldNameTranslate
                ),
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.marketCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-marketCode',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
            // correct
          });

        this.translateService
          .get('pw.locationMaster.factoryCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-factoryCode',
              [
                this.fieldValidatorsService.locationCodeField(
                  fieldNameTranslate
                ),
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.ownerinfo')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-ownerInfo',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.marketCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-marketCode',
              [
                this.fieldValidatorsService.requiredField(fieldNameTranslate),
                Validators.required
              ]
            );
          });
      } else {
        this.translateService
          .get('pw.locationMaster.boutiqueEmailId')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-boutiqueEmailId',
              [this.fieldValidatorsService.emailField(fieldNameTranslate)]
            );
          });
        this.translateService
          .get('pw.locationMaster.region')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-region',
              []
            );
          });
        this.translateService
          .get('pw.locationMaster.subRegion')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-subRegion',
              []
            );
          });

        this.translateService
          .get('pw.locationMaster.locationSize')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-locationSize',
              []
            );
            // correct
          });

        this.translateService
          .get('pw.locationMaster.locationShortName')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-locationShortName',
              [
                this.fieldValidatorsService.alphaNumericField(
                  fieldNameTranslate
                )
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.marketCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-marketCode',
              []
            );
            // correct
          });

        this.translateService
          .get('pw.locationMaster.factoryCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-factoryCode',
              [
                this.fieldValidatorsService.locationCodeField(
                  fieldNameTranslate
                )
              ]
            );
          });

        this.translateService
          .get('pw.locationMaster.ownerinfo')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-ownerInfo',
              []
            );
          });

        this.translateService
          .get('pw.locationMaster.marketCode')
          .toPromise()
          .then(fieldNameTranslate => {
            this.helperFunctions.setConditionalValidators(
              formGroup,
              '1-locationBoutiqueFactoryModel',
              '1-marketCode',
              []
            );
          });
      }
    });
    // Conditional Validation ends
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public buttonClick(btn: CommandButton) {
    if (btn.i === 0) {
      this.priceGroupMapping.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
