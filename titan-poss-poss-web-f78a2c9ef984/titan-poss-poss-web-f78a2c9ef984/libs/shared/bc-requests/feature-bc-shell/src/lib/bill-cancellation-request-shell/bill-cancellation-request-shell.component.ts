import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ApprovalsMenuKeyEnum,
  CUSTOMER_MEMBER_TYPE
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import {
  getApprovalsBillCancellationRequestsTabsUrl,
  getApprovalsHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-bill-cancellation-request-shell',
  templateUrl: './bill-cancellation-request-shell.component.html',
  styleUrls: ['./bill-cancellation-request-shell.component.scss']
})
export class BillCancellationRequestShellComponent implements OnInit {
  tab = 'requests-approvals';
  // billCancelRef =TypesEnum;
  destroy$: Subject<null> = new Subject<null>();

  hasNotification = true;
  detail = false;
  customerMemberType: string;
  customerMemebrTypeColor: string;
  customer: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const tab = this.activatedRoute.snapshot.params['tab'];
    this.changeTab(tab);
    // this.changeTab(this.activatedRoute.snapshot.params['type']);
  }

  readCustomerDetails(event) {
    if (event !== null) {
      this.detail = true;
      this.readCustomerData(event.headerData.data);
    } else this.detail = false;
  }

  readCustomerData(customer: any) {
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
  changeTab(newTab: any) {
    if (this.tab !== newTab) {
      this.tab = newTab;

      this.router.navigate([
        getApprovalsBillCancellationRequestsTabsUrl(this.tab)
      ]);
      console.log(
        this.router.navigate([
          getApprovalsBillCancellationRequestsTabsUrl(this.tab)
        ])
      );
    }
  }

  back() {
    this.router.navigate([getApprovalsHomeRouteUrl()], {
      queryParams: {
        menu: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY
      }
    });
  }
}
