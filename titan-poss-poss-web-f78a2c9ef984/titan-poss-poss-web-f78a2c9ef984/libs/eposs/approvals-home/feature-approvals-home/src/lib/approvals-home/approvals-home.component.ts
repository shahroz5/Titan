import { ScrollService } from '@poss-web/shared/util-common';
import { Component, OnInit } from '@angular/core';
import { CardMenu, ApprovalsMenuKeyEnum } from '@poss-web/shared/models';

import { Observable } from 'rxjs';
import {
  getApprovalsRoleLimitRequestsRouteUrl,
  getBinCreationApprovalsRouteUrl,
  getConversionApprovalsAllowedRouteUrl,
  getIbtRequestApprovalsRouteUrl,
  getOtherIssuesADJRouteUrl,
  getOtherIssuesExhRouteUrl,
  getOtherIssuesFocRouteUrl,
  getOtherIssuesLoanRouteUrl,
  getOtherIssuesLossRouteUrl,
  getOtherIssuesPsvRouteUrl,
  getRORequestApprovalsAllowedRouteUrl
} from '@poss-web/shared/util-site-routes';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';

@Component({
  selector: 'poss-web-approvals-home',
  templateUrl: './approvals-home.component.html',
  styleUrls: []
})
export class ApprovalsHomeComponent implements OnInit {
  permissions$: Observable<any[]>;

  menu: CardMenu[] = [
    {
      menuKey: ApprovalsMenuKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.approvals.user',
      subTitleTranslationKey: 'pw.approvals.management',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Approvals Home - Uam Approvals Menu',
      child: [
        {
          titleTranslationKey: 'pw.approvals.roleLimitRequests',
          hasChild: false,
          path: getApprovalsRoleLimitRequestsRouteUrl(),
          elementName: 'Uam Approvals - Role Limit Requests Submenu'
        }
      ]
    },
    {
      menuKey: ApprovalsMenuKeyEnum.PAYMENT_MENU_KEY,
      titleTranslationKey: 'pw.approvals.payment',
      subTitleTranslationKey: 'pw.approvals.management',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Approvals Home - Payment Approvals Menu',
      child: [
        {
          titleTranslationKey: 'pw.approvals.roRequestApprovals',
          hasChild: false,
          path: getRORequestApprovalsAllowedRouteUrl(),
          elementName: 'Payment Approvals Menu - RO Request Approvals Submenu'
        }
      ]
    },
    {
      menuKey: ApprovalsMenuKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.approvals.inventory',
      subTitleTranslationKey: 'pw.approvals.approval',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Approvals Home - Inventory Approvals Menu',
      child: [
        {
          titleTranslationKey: 'pw.approvals.binCreation',
          hasChild: false,
          path: getBinCreationApprovalsRouteUrl(),
          elementName: 'Inventory Approvals - Bin Creation Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.conversion',
          hasChild: false,
          path: getConversionApprovalsAllowedRouteUrl(),
          elementName: 'InventoryApprovals_ConversionApprovals_Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.ibtRequests',
          hasChild: false,
          path: getIbtRequestApprovalsRouteUrl(),
          elementName: 'Inventory Approvals - IBT Request Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesFOC',
          hasChild: false,
          path: getOtherIssuesFocRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues FOC Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesPSV',
          hasChild: false,
          path: getOtherIssuesPsvRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues PSV Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesADJ',
          hasChild: false,
          path: getOtherIssuesADJRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues ADJ Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesLOAN',
          hasChild: false,
          path: getOtherIssuesLoanRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues LOAN Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesEXH',
          hasChild: false,
          path: getOtherIssuesExhRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues EXH Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.otherIssuesLOSS',
          hasChild: false,
          path: getOtherIssuesLossRouteUrl(),
          elementName:
            'Inventory Approvals - Other Issues LOSS Approvals Submenu'
        }
      ]
    },
    {
      menuKey: ApprovalsMenuKeyEnum.CUSTOMER_TRANSACTION_MENU_KEY,
      titleTranslationKey: 'pw.approvals.customerTransaction',
      subTitleTranslationKey: 'pw.approvals.approval',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'Approvals Home - Customer Transaction Approvals Menu',
      child: [
        {
          titleTranslationKey: 'pw.approvals.cmManualBillRequests',
          hasChild: false,
          path: '/approvals/cm-requests/list',
          elementName: 'Approvals Home - Customer Transaction Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.billCancellationApprovals',
          hasChild: false,
          path: '/approvals/bill-cancellation-requests/requests-approvals',
          elementName:
            'Customer Transaction Approval - Bill Cancellation Request Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.advanceBookingActivationRequests',
          hasChild: false,
          path: 'approvals/advance-booking/activation/requests',
          elementName:
            'Customer Transaction Approval - AB Activation Request Submenu'
        },
        {
          titleTranslationKey:
            'pw.approvals.advanceBookingCancellationRequests',
          hasChild: false,
          path: '/approvals/advance-booking/cancellation/requests',
          elementName:
            'Customer Transaction Approval - AB Cancellation Request Submenu'
        },
        {
          titleTranslationKey: 'pw.approvals.advanceBookingManualRequests',
          hasChild: false,
          path: '/approvals/advance-booking/manual/requests',
          elementName:
            'Customer Transaction Approval - AB Manual Request Submenu'
        },
        {
          titleTranslationKey: 'pw.navigation.grnRequestApprovals',
          hasChild: false,
          path: '/approvals/grn-requests/list',
          elementName:
            'Customer Transaction Approval - GRN Request Approvals Submenu'
        },

        {
          titleTranslationKey: 'pw.navigation.cnApprovalRequest',
          hasChild: false,
          path: '/approvals/cn-requests/list',
          elementName:
            'Customer Transaction Approval - CN Request Approvals Submenu'
        },

        {
          titleTranslationKey: 'pw.navigation.tepApprovalRequest',
          hasChild: false,
          path: '/approvals/tep-requests/list',
          elementName:
            'Customer Transaction Approval - TEP Request Approvals Submenu'
        },
        {
          titleTranslationKey: 'pw.navigation.tepRefundStatus',
          hasChild: false,
          path: '/approvals/tep-refund-status/cheque',
          elementName: 'Customer Transaction Approval - Refund Status Submenu'
        },
        {
          titleTranslationKey: 'pw.navigation.fullValueTepRequests',
          hasChild: false,
          path: '/approvals/full-value-tep-requests/list',
          elementName:
            'Customer Transaction Approval - Full Value TEP Requests Submenu'
        },
        {
          titleTranslationKey: 'pw.navigation.tepExceptionRequests',
          hasChild: false,
          path: '/approvals/tep-exception-requests/list',
          elementName:
            'Customer Transaction Approval - Exception TEP Requests Submenu'
        },
        {
          titleTranslationKey: 'pw.navigation.grfApprovalRequests',
          hasChild: false,
          path: '/approvals/grf-request/list',
          elementName:
            'Approvals_CustomerTransactionApproval_GRFRequestsSubmenu'
        }
      ]
    }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
}
