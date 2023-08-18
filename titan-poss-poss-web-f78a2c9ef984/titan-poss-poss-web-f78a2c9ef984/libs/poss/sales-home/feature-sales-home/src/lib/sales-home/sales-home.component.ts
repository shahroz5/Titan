import { ScrollService } from '@poss-web/shared/util-common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ShortcutServiceAbstraction,
  Command,
  CardMenu,
  SalesMenuKeyEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import {
  getCashMemoUrl,
  getCreditNoteUrl,
  getCreditNoteTransferUrl,
  getAcceptAdvanceUrl,
  getGrfUrl,
  getCreateTepUrl,
  getGiftCardsSaleUrl,
  getCustomerOrderFetchUrl
} from '@poss-web/shared/util-site-routes';
import { Router } from '@angular/router';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

const cashMemoKey = 'CustomerTransactionHomeComponent.MENU1';

@Component({
  selector: 'poss-web-sales-home',
  templateUrl: './sales-home.component.html',
  styleUrls: ['./sales-home.component.scss']
})
export class SalesHomeComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  permissions$: Observable<any[]>;
  menu: CardMenu[] = [
    {
      menuKey: SalesMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY,
      titleTranslationKey: 'pw.salesDashboard.customerTransaction',
      subTitleTranslationKey: '',
      hasChild: true,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'Sales Home - Customer Transaction Menu',
      child: [
        {
          titleTranslationKey: 'pw.salesDashboard.cashMemo',
          hasChild: false,
          path: getCashMemoUrl(),
          elementName: 'Customer Transaction - Cash Memo SubMenu'
        },
        {
          titleTranslationKey: 'pw.salesDashboard.giftCards',
          hasChild: false,
          path: getGiftCardsSaleUrl(),
          elementName: 'Customer Transaction - GC SubMenu'
        },
        {
          elementName: 'Customer Transaction - Advance Booking SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.advanceBookingLabel',
          hasChild: false,
          path: 'sales/advance-booking/new'
        },
        {
          elementName: 'Customer Transaction - TEP SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.tepLabel',
          hasChild: false,
          path: getCreateTepUrl('new')
        },
        {
          elementName: 'Customer Transaction - GEP SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.gepLabel',
          hasChild: false,
          path: 'sales/gep/new'
        },
        {
          elementName: 'Customer Transaction - GRN SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.grnLabel',
          hasChild: false,
          path: 'sales/grn/status'
        },
        {
          elementName: 'Customer Transaction - Accept Advance SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.acceptAdvanceLabel',
          hasChild: false,
          path: getAcceptAdvanceUrl()
        },
        {
          elementName: 'Customer Transaction - GRF SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.grfLabel',
          hasChild: false,
          path: getGrfUrl()
        },
        {
          elementName: 'Customer Transaction – Bill Cancellation SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.billCancellation',
          hasChild: false,
          path: 'sales/bill-cancellation'
        },
        {
          elementName: 'Sales_CustomerTransaction_IssuePendingFOCSubmenu',
          titleTranslationKey: 'pw.possHomeDashboard.issuePendingFOC',
          hasChild: false,
          path: 'sales/pendingFoc'
        }
        // todo: uncomment after cr release
        // {
        //   titleTranslationKey: 'pw.salesDashboard.customerOrderLabel',
        //   hasChild: false,
        //   path: getCustomerOrderFetchUrl(),
        //   elementName: 'Customer Transaction - Customer Order SubMenu'
        // },
      ]
    },

    {
      menuKey: SalesMenuKeyEnum.CREDIT_NOTE,
      titleTranslationKey: 'pw.salesDashboard.creditNote',
      subTitleTranslationKey: '',
      hasChild: true,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'Sales Home - Credit Note Menu',
      child: [
        {
          elementName: 'Credit Note – Credit Note Transactions SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.creditNoteTransactions',
          hasChild: false,
          path: getCreditNoteUrl('cn-activity')
        },
        {
          elementName: 'Credit Note – Credit Note IBT Transfer SubMenu',
          titleTranslationKey: 'pw.possHomeDashboard.creditNoteIbtTransfer',
          hasChild: false,
          path: getCreditNoteTransferUrl('')
        }
      ]
    },
    {
      menuKey: SalesMenuKeyEnum.REQUEST_APPROVALS_STATUS,
      titleTranslationKey: 'pw.salesDashboard.requestApprovalsStatusLabel',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Sales Home - Request Approvals Status Menu',
      child: [
        {
          elementName:
            'Request Approvals Status - Manual bill Requests Status SubMenu',
          titleTranslationKey:
            'pw.salesDashboard.manualBillRequestsStatusLabel',
          hasChild: false,
          path: 'sales/cm-requests/list'
        },
        {
          elementName: 'Request Approvals Status - RO Requests Status SubMenu',
          titleTranslationKey: 'pw.salesDashboard.roRequestsStatusLabel',
          hasChild: false,
          path: 'sales/ro-request/list'
        },
        {
          elementName:
            'Request Approvals Status - Airpay Requests Status SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsStatusLabel',
          hasChild: false,
          path: 'sales/airpayRequests/list'
        },
        {
          elementName:
            'Request Approvals Status - Airpay Requests History SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsHistoryLabel',
          hasChild: false,
          path: 'sales/airpayRequests/history'
        },
        {
          elementName:
            'Request Approvals Status - Advance Booking Requests Status SubMenu',
          titleTranslationKey:
            'pw.salesDashboard.advanceBookingRequestsStatusLabel',
          hasChild: false,
          path: 'sales/advance-booking/request-status'
        },
        {
          elementName: 'Request Approvals Status - TEP Requests Status SubMenu',
          titleTranslationKey: 'pw.salesDashboard.TEPRequestsStatusLabel',
          hasChild: false,
          path: 'sales/tep-request/refund-status'
        },
        {
          elementName:
            'Request Approvals Status - Razorpay Requests Status SubMenu',
          titleTranslationKey: 'pw.salesDashboard.razorpayRequestsStatusLabel',
          hasChild: false,
          path: 'sales/razorpayRequests/list'
        },
        {
          elementName:
            'Request Approvals Status - Razorpay Requests History SubMenu',
          titleTranslationKey: 'pw.salesDashboard.razorpayRequestsHistoryLabel',
          hasChild: false,
          path: 'sales/razorpayRequests/history'
        },
        {
          elementName:
            'SalesHome_RequestApprovalsStatus_GRFRequestStatus_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.GRFRequestsStatusLabel',
          hasChild: false,
          path: 'sales/grf-status/list'
        }
      ]
    }
  ];

  constructor(
    private router: Router,
    private permissionfacade: PermissionFacade,
    private shortcutService: ShortcutServiceAbstraction,
    public scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
  // cashMemoUrl() {
  //   this.router.navigate([getCashMemoUrl()]);
  // }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  private shortcutEventHandler(command: Command) {
    // if (command.name === cashMemoKey) {
    //   this.cashMemoUrl();
    // }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
