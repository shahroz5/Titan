import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CustomerInfo,
  CUSTOMER_MEMBER_TYPE,
  CountrySummary,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { Moment } from 'moment';
import * as moment from 'moment';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-customer-summary',
  templateUrl: './customer-summary.component.html',
  styleUrls: ['./customer-summary.component.scss']
})
export class CustomerSummaryComponent implements OnInit, OnDestroy {
  customerMemberType: string;
  customerMemebrTypeColor: string;
  dateofBirth: Moment;
  spouseBirthday: Moment;
  annivesary: Moment;
  destroy$ = new Subject();
  countryList: CountrySummary[];
  selectedCountry: any;
  rivaahCouponDetail: any;
  currentDate = moment();
  isLoading$: Observable<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public customerDetail: CustomerInfo,
    private dialogRef: MatDialogRef<CustomerSummaryComponent>,
    private customerFacade: CustomerFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    if (customerDetail.customerDetails.data.birthday !== null) {
      this.dateofBirth = moment(customerDetail.customerDetails.data.birthday);
    } else {
      this.dateofBirth = null;
    }
    if (customerDetail.customerDetails.data.spouseBirthday !== null) {
      this.spouseBirthday = moment(
        customerDetail.customerDetails.data.spouseBirthday
      );
    } else {
      this.spouseBirthday = null;
    }
    if (customerDetail.customerDetails.data.anniversary !== null) {
      this.annivesary = moment(customerDetail.customerDetails.data.anniversary);
    } else {
      this.annivesary = null;
    }

    this.customerFacade.loadCountries();
    this.getCountryList();
  }

  getCountryList() {
    this.customerFacade
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries: CountrySummary[]) => {
        this.selectedCountry = countries.find(
          countryValue =>
            countryValue.description ===
            this.customerDetail.customerDetails.data.country
        );
      });
  }

  ngOnInit() {
    this.readCustomerData(this.customerDetail);
    this.customerFacade.loadRivaahCouponDetail(
      this.customerDetail.customerId,
      false
    );
    this.isLoading$ = this.customerFacade.getIsLoading();

    this.customerFacade
      .getRivaahCouponDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(couponDetail => {
        this.rivaahCouponDetail = couponDetail;
        if (this.rivaahCouponDetail?.couponSend === true) {
          this.successNotification();
        }
      });
  }

  couponResend() {
    this.customerFacade.loadRivaahCouponDetail(
      this.customerDetail.customerId,
      true
    );
  }

  successNotification() {
    const updatedkey = 'pw.customerSummary.couponSendSuccessMessage';
    this.translate
      .get([updatedkey])
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasBackdrop: true,
            hasClose: true,
            message: translatedMsg[updatedkey]
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  readCustomerData(customer: CustomerInfo) {
    if (customer && customer.currentTier) {
      switch (customer.currentTier.toUpperCase()) {
        case CUSTOMER_MEMBER_TYPE.GOLD: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.GOLD.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
        case CUSTOMER_MEMBER_TYPE.SILVER: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.SILVER.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
        case CUSTOMER_MEMBER_TYPE.PLATINUM: {
          this.customerMemberType = CUSTOMER_MEMBER_TYPE.PLATINUM.charAt(0);
          this.customerMemebrTypeColor = 'pw-member-type-gold';
          break;
        }
      }
    } else {
      this.customerMemberType = null;
      this.customerMemebrTypeColor = null;
    }
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  getForm60IdProof() {
    if (this.customerDetail?.customerDetails?.data) {
      if (this.customerDetail?.customerDetails?.data?.form60IdType) {
        return this.customerDetail?.customerDetails?.data?.form60IdType;
      } else if (this.customerDetail?.customerDetails?.data?.form60Number) {
        return this.customerDetail?.customerDetails?.data?.form60Number;
      } else if (this.customerDetail?.customerDetails?.data?.idProof) {
        return this.customerDetail?.customerDetails?.data?.idProof;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.customerFacade.clearRivaahCouponDetail();
  }
}
