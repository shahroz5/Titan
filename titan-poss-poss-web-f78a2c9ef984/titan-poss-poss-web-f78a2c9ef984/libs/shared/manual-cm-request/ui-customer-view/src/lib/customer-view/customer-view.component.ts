import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerInfo, CUSTOMER_MEMBER_TYPE } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-customer-view',
  templateUrl: './customer-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerViewComponent implements OnInit, OnDestroy {
  @Input() cmCustomerDetails$: Observable<CustomerInfo>;
  destroy$: Subject<null> = new Subject<null>();
  customerDetails: CustomerInfo;
  customerMemberType: string;
  customerMemebrTypeColor: string;
  customer: CustomerInfo = null;



  ngOnInit() {
    this.cmCustomerDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CustomerInfo) => {
        if (data) {
          this.customerDetails = data;
          this.readCustomerData(this.customerDetails);
        }
      });
  }

  readCustomerData(customer: CustomerInfo) {
    this.customer = customer;
    if (customer && customer.currentTier) {
      // TODO : Class to be created in global scc
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
