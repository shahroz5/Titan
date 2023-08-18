import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Customers,
  CUSTOMER_TYPE_ENUM,
  CustomErrors,
  PincodeSummary,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  LocationSettingAttributesEnum,
  PanVerificationRequestPayload,
  ValidatePanResponse,
  ValidateGstResponse,
  GstVerificationRequestPayload,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  ValidateEmailResponse
} from '@poss-web/shared/models';
import { takeUntil, filter, take } from 'rxjs/operators';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';

import { TranslateService } from '@ngx-translate/core';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit, OnDestroy {
  @Output() countryChange = new EventEmitter<string>();
  @Output() stateChange = new EventEmitter<string>();
  @Output() pincodeChange = new EventEmitter<any>();

  pincodeSummary$: Observable<PincodeSummary>;
  isUniqueCustomer$: Observable<boolean>;
  isUniquePan$: Observable<boolean>;
  isUniquePassport$: Observable<boolean>;
  isUniqueGst$: Observable<boolean>;
  isCustomerSaving$: Observable<boolean>;
  countryCode$: Observable<any>;
  isLoading$: Observable<boolean>;
  isUniqueEmail$: Observable<boolean>;
  panVerificationStatus$: Observable<ValidatePanResponse>;
  gstVerificationStatus$: Observable<ValidateGstResponse>;
  emailValidationStatus$: Observable<ValidateEmailResponse>;
  isEmailRequiredForEncircle: any;
  isEmailRequiredForOneTime: any;
  isMobileRequiredForOneTime: any;
  isEmailRequiredForInternational: any;
  isMobileRequiredForInternational: any;
  isEmailRequiredForInstitutional: any;
  isMobileRequiredForInstitutional: any;
  customerDetailsInBrand: any;
  brandDetails: any;

  destroy$ = new Subject();

  customerTypeEnumRef = CUSTOMER_TYPE_ENUM;

  customer: Customers;

  customerTypes: {
    value: CUSTOMER_TYPE_ENUM;
    translateKey: string;
  }[] = [];
  hasNotification = false;
  customerDetail$: Observable<any>;
  isAdvancebookingType = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CustomerCreateComponent>,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    public locationSettingsFacade: LocationSettingsFacade,
    private commonFacade: CommonFacade
  ) {
    this.customerFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code !== 'ERR-INT-010') {
          this.errorHandler(error);
        }
      });

    this.countryCode$ = this.customerFacade.getCountryCode();
  }

  ngOnInit() {
    this.customerFacade.clearVerificationStatus();
    this.isCustomerSaving$ = this.customerFacade.getIsCustomerSaving();
    this.isLoading$ = this.customerFacade.getIsLoading();
    this.customerDetail$ = this.customerFacade.getSelectedCustomerDetail();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_EMAIL_FOR_ENCIRCLE_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEmailRequiredForEncircle => {
        this.isEmailRequiredForEncircle = isEmailRequiredForEncircle;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_EMAIL_FOR_ONE_TIME_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEmailRequiredForOneTime => {
        this.isEmailRequiredForOneTime = isEmailRequiredForOneTime;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_MOBILE_NO_FOR_ONE_TIME_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobileRequiredForOneTime => {
        this.isMobileRequiredForOneTime = isMobileRequiredForOneTime;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_EMAIL_FOR_INSTITUTIONAL_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEmailRequiredForInstitutional => {
        this.isEmailRequiredForInstitutional = isEmailRequiredForInstitutional;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_MOBILE_NO_FOR_INSTITUTIONAL_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobileRequiredForInstitutional => {
        this.isMobileRequiredForInstitutional = isMobileRequiredForInstitutional;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_MOBILE_NO_FOR_INTERNATIONAL_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobileRequiredForInternational => {
        this.isMobileRequiredForInternational = isMobileRequiredForInternational;
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CUSTOMER_IS_EMAIL_FOR_INTERNATIONAL_CUSTOMER
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEmailRequiredForInternational => {
        this.isEmailRequiredForInternational = isEmailRequiredForInternational;
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });
    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetails => {
        if (brandDetails) {
          this.customerDetailsInBrand = brandDetails.customerDetails;
          this.brandDetails = brandDetails.configDetails;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          if (transactionConfig.refTxnType === 'AB') {
            this.isAdvancebookingType = true;
          } else {
            this.isAdvancebookingType = false;
          }
        }
      });

    // this.advanceBookingFacade
    //   .getViewCashMemoResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: AdvanceBookingDetailsResponse) => {
    //     if (data && data.txnType === 'AB') {
    //       this.isAdvancebookingType = true;
    //     } else {
    //       this.isAdvancebookingType = false;
    //     }
    //   });

    this.panVerificationStatus$ = this.customerFacade.getpanVerificationStatus();
    this.gstVerificationStatus$ = this.customerFacade.getgstVerificationStatus();
    this.emailValidationStatus$ = this.customerFacade.getEmailValidationStatus();
  }

  loadCountry(country: string) {
    this.countryChange.emit(country);
  }

  clearVerificationState(event) {
    this.customerFacade.clearVerificationStatus();
  }

  clearPanVerificationState(event) {
    this.customerFacade.clearPanVerificationStatus();
  }

  clearGstVerificationState(event) {
    this.customerFacade.clearGstVerificationStatus();
  }

  clearEmailValidationState(event) {
    this.customerFacade.clearEmailValidationStatus();
  }

  loadStates(state: string) {
    this.stateChange.emit(state);
  }

  loadPincode(data: { countryCode: string; pincode: string }) {
    // this.pincodeChange.emit(data);
    this.customerFacade.loadPincode(data.countryCode, data.pincode);
    this.pincodeSummary$ = this.customerFacade.getPincode();
  }

  loadPanNumberVerificationStatus(panNumber) {
    const panVerificationRequestPayload: PanVerificationRequestPayload = {
      panCardNo: panNumber,
      verificationType: 'NUMBER',
      vendorCode: 'PAN_KHOSLA'
    };
    this.customerFacade.loadPanVerificationStatus(
      panVerificationRequestPayload
    );
  }

  loadGstNumberVerificationStatus(gstNumber) {
    const gstVerificationRequestPayload: GstVerificationRequestPayload = {
      gstIn: gstNumber,
      vendorCode: 'IRN_ASPTAX'
    };
    this.customerFacade.loadGstVerificationStatus(
      gstVerificationRequestPayload
    );
  }

  loadEmailValidationStatus(emailId) {
    this.customerFacade.loadEmailValidationStatus(emailId);
  }

  loadIsUniqueCustomer(data: { searchType: string; value: string }) {
    if (data.searchType === 'MOBILE_NO') {
      if (data.value === '') {
        this.isUniqueCustomer$ = of(true);
      } else {
        this.customerFacade.loadIsUniqueMobile(data.searchType, data.value);
        this.isUniqueCustomer$ = this.customerFacade.getIsUniqueMobile();
      }
    } else if (data.searchType === 'ULP_ID') {
      if (data.value === '') {
        this.isUniqueEmail$ = of(true);
      } else {
        this.customerFacade.loadIsUniqueEmail(data.searchType, data.value);
        this.isUniqueEmail$ = this.customerFacade.getIsUniqueEmail();
      }
    } else if (data.searchType === 'INSTITUTIONAL_TAX_NO') {
      if (data.value === '') {
        this.isUniqueGst$ = of(true);
      } else {
        this.customerFacade.loadIsUniqueGst(data.searchType, data.value);
        this.isUniqueGst$ = this.customerFacade.getIsUniqueGst();
      }
    } else if (data.searchType === 'CUSTOMER_TAX_NO') {
      if (data.value === '') {
        this.isUniquePan$ = of(true);
      } else {
        this.customerFacade.loadIsUniquePan(data.searchType, data.value);
        this.isUniquePan$ = this.customerFacade.getIsUniquePan();
      }
    } else if (data.searchType === 'PASSPORT_ID') {
      if (data.value === '') {
        this.isUniquePassport$ = of(true);
      } else {
        this.customerFacade.loadIsUniquePassport(data.searchType, data.value);
        this.isUniquePan$ = this.customerFacade.getIsUniquePassport();
      }
    }
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  addNewCustomer(customerdata: any) {
    customerdata.customerType = this.data.customerType;
    customerdata.customerDetails.type = this.data.customerType;
    this.customerFacade.saveCustomer(customerdata);
    this.customerDetail$
      .pipe(
        filter(data => !!data),
        take(1)
      )
      .subscribe(data => {
        if (data) {
          this.dialogRef.close(data);
        }
      });
  }

  showSuccessNotification(
    encirlceId: string,
    customerId: string,
    customerType: string
  ) {
    const regularkey = 'pw.customerCreation.isCreatedSuccessMsg';
    const otherkey = 'pw.customerCreation.isOtherCustomerCreatedSuccessMsg';

    this.translate
      .get([regularkey, otherkey], {
        customerType: customerType
      })
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: false,
            hasClose: true,
            message:
              customerType === CUSTOMER_TYPE_ENUM.REGULAR
                ? translatedMsg[regularkey] + encirlceId
                : translatedMsg[otherkey] + customerId
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  updateCustomer(updatedCustomer: any) {
    updatedCustomer.data.customerType = this.data.customer.customerType;
    updatedCustomer.data.customerDetails.type = this.data.customer.customerType;
    this.customerFacade.updateCustomer(updatedCustomer);
    this.customerDetail$ = this.customerFacade.getSelectedCustomerDetail();
    this.customerFacade
      .getUpdatedCustomerStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.dialogRef.close(data);
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasBackdrop: true,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.customerFacade.clearUpdatedCustomerStatus();
  }
}
