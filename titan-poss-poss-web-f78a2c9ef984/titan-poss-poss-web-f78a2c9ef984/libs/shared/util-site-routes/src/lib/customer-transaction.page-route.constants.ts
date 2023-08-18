export const getCustomerTransactionBaseUrl = (): string => {
  return '/sales';
};
export const getHomePageUrl = (): string => {
  return '/home';
};

export const getSalesHomePageUrl = (): string => {
  return '/sales/home';
};

export const getCashMemoUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/cash-memo/new`;
};
export const getCashMemoIdUrl = (id: any): string => {
  return getCustomerTransactionBaseUrl() + `/cash-memo/${id}`;
};

export const getManualCashMemoUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/cash-memo/manual-bill/new`;
};
export const getManualCashMemoIdUrl = (id: any): string => {
  return getCustomerTransactionBaseUrl() + `/cash-memo/manual-bill/${id}`;
};

export const getCreateTepUrl = (id: string): string => {
  return getCustomerTransactionBaseUrl() + `/tep/create-tep/${id}`;
};

export const getCutPieceTepUrl = (id: string): string => {
  return getCustomerTransactionBaseUrl() + `/tep/cut-piece-tep/${id}`;
};

export const getManualTepUrl = (id: string): string => {
  return getCustomerTransactionBaseUrl() + `/tep/manual-tep/${id}`;
};

export const getCashMemoNewUrl = (tab): string => {
  return `/sales/` + `${tab}` + `/new`;
};

export const getCashMemoOpenHoldUrl = (id: string, tab): string => {
  return `/sales/` + `${tab}` + '/' + `${id}`;
};

export const getAdvanceOpenHoldUrl = (id: string): string => {
  return `/sales/ct-advance/accept-advance/${id}`;
};

export const getGiftCardsSaleOpenHoldUrl = (id: string): string => {
  return `/sales/gift-cards/sale/${id}`;
};

export const getRefundListingUrl = (): string => {
  return `/sales/tep-request/refund-status`;
};

export const getRequestListingUrl = (): string => {
  return `/sales/tep-request/request-status`;
};
export const getcancelTEPUrl = (): string => {
  return `/sales/tep/cancel-tep`;
};
export const gethistoryTEPUrl = (): string => {
  return `/sales/tep/tep-history`;
};

export const getGrfOpenHoldUrl = (id: string): string => {
  return `/sales/grf/new-grf/${id}`;
};

export const getManualGrfOpenHoldUrl = (id: string): string => {
  return `/sales/grf/manual-grf/${id}`;
};

export const getCreateTepOpenHoldUrl = (): string => {
  return `/sales/tep/create-tep/new`;
};

export const getViewUrl = (id): string => {
  return `/sales/tep-request/view/` + `${id}`;
};

export const getViewTepRequesUrl = (id, processId, txntype): string => {
  return (
    `/sales/tep-request/view/` + `${txntype}` + `/${id}` + `/` + `${processId}`
  );
};

export const getCancelTepUrl = (id, action, txntype): string => {
  return `/sales/tep-request/` + `${action}/` + `${txntype}/` + `${id}`;
};

export const getCutPieceTepOpenHoldUrl = (): string => {
  return `/sales/tep/cut-piece-tep`;
};

export const getGiftCardSaleUrl = (id: string): string => {
  return `/sales/gift-cards/sale`;
};

export const getAdvanceBookingOpenHoldUrl = (id: string, tab): string => {
  return `/sales/advance-booking/` + `${tab}` + '/' + `${id}`;
};
export const getSelectedAdvanceBookingUrl = (id: string): string => {
  return `/sales/advance-booking/${id}`;
};

export const getViewAdvanceBookingUrl = (
  id: string,
  tab: string,
  subTxnType: string
): string => {
  return (
    `/sales/advance-booking/` + `${tab}` + '/' + `${subTxnType}` + '/' + `${id}`
  );
};

export const getViewAdvanceBookingRequestStaustUrl = (
  id: string,
  tab: string,
  subTxnType: string,
  processId: string
): string => {
  return (
    `/sales/advance-booking/` +
    `${tab}` +
    '/' +
    `${subTxnType}` +
    '/' +
    `${id}` +
    '/' +
    `${processId}`
  );
};

export const getManualBillCMUrl = (): string => {
  return '/sales/manual-bill/new';
};

export const getAdvanceBookingNewUrl = (): string => {
  return `/sales/advance-booking/new`;
};
export const getManualAdvanceBookingNewUrl = (): string => {
  return `/sales/advance-booking/manual/new`;
};
export const getManualAdvanceBookingDetailsUrl = (id: any): string => {
  return `/sales/advance-booking/manual/${id}`;
};

export const getAdvanceBookingSearchUrl = (): string => {
  return `/sales/advance-booking/search`;
};

export const getAdvanceBookingReguestStatusUrl = (): string => {
  return `/sales/advance-booking/request-status`;
};

export const getGiftCardsUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/gift-cards/sale`;
};

export const getGiftCardCancellationDetailsUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/gift-card/cancellation/details`;
};

export const getGiftCardCancellationUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/gift-cards/cancellation`;
};

export const getCMRequestListRouteUrl = (): string => {
  return `sales/cm-requests/list`;
};
export const getGRFRequestListRouteUrl = (): string => {
  return `sales/grf-status/list`;
};

export const getCMRequestDetailsRouteUrl = (
  txnType: string,
  processId: string
): string => {
  return `sales/cm-requests/details/${txnType}/${processId}`;
};
export const getGRFRequestDetailsRouteUrl = (
  txnType: string,
  processId: string
): string => {
  return `sales/grf-status/details/${txnType}/${processId}`;
};
export const getBillCancelRouteUrl = (): string => {
  return `/sales/bill-cancellation`;
};
export const getCMBillCancelRequestsRouteUrl = (): string => {
  return `/sales/bill-cancellation/requests`;
};
export const getCMBillCancelRouteUrl = (tab: string): string => {
  return `/sales/bill-cancellation/${tab}`;
};
export const getBillCancelHistoryRouteUrl = (): string => {
  return `/sales/bill-cancellation/history`;
};
export const getBcHistoryDetailsPageUrl = (subTxnType, id): string => {
  return `/sales/bill-cancellation/history/${subTxnType}/${id}`;
};
export const getCMBillCancelDetailsRouteUrl = (
  type: string,
  docNo: number
): string => {
  return `/sales/bill-cancellation/${type}/${docNo}`;
};

export const getBillCancellationRequestDetailsRouteUrl = (
  subTxnType: any,
  refTxnId: any,
  processId: any
): string => {
  return `/sales/bill-cancellation/requests/${subTxnType}/${refTxnId}/${processId}`;
};
export const getWalkInsDetailsRouteUrl = (): string => {
  return `/banking-revenue/walk-ins-record`;
};
export const getCreditNoteUrl = (tabType: string): string => {
  return getCustomerTransactionBaseUrl() + `/credit-notes/${tabType}`;
};

// export const getCreditNoteTransferUrl = (): string => {
//   return getCustomerTransactionBaseUrl() + `/credit-notes/transfer/search`;
// };

export const getCreditNoteDetailsUrl = (
  tabType: string,
  requestType: string,
  id: string
): string => {
  return (
    getCustomerTransactionBaseUrl() +
    `/credit-note/${tabType}/${requestType}/${id}`
  );
};

export const getGrnStatusUrl = (): string => {
  return `/sales/grn/status`;
};
export const getGrnHistoryUrl = (): string => {
  return `/sales/grn/history`;
};
export const grnDetailsRouteUrl = (type: string, grnId: string): string => {
  return `/sales/grn` + `/${type}` + `/${grnId}`;
};
export const getCreditNoteTransferUrl = (tab: string): string => {
  return `/sales/credit-notes/transfer/` + `${tab}`;
};
export const getCreditNoteTransferSearchDetailsUrl = (loc, id): string => {
  return `/sales/credit-notes/transfer/search/details/` + `${loc}/` + `${id}`;
};
export const getCreditNoteTransferSentDetailsUrl = (tab, id): string => {
  return `/sales/credit-notes/transfer/` + `${tab}` + `/details/` + `${id}`;
};
export const getCreditNoteTransferReceivedDetailsUrl = (
  tab,
  id,
  taskId,
  taskName
): string => {
  return (
    `/sales/credit-notes/transfer/` +
    `${tab}` +
    `/details/` +
    `${id}/${taskId}/${taskName}`
  );
};
export const getCreditNoteEGHSDetailsUrl = (
  tabType: string,
  requestType: string,
  docNo: string,
  fiscalYear: string,
  ghsDocNo: string
): string => {
  return (
    getCustomerTransactionBaseUrl() +
    `/credit-note/${tabType}/${requestType}/${docNo}/${fiscalYear}/${ghsDocNo}`
  );
};
export const getMonitoringDashboardAllowedRouteUrl = (): string => {
  return `/monitoring-dashboard/allowedRoute`;
};
export const getAppVersionDashboardRouteUrl = (): string => {
  return `/home/app-version-dashboard`;
};
export const getAdvanceHistoryListingRouteUrl = (): string => {
  return `/sales/ct-advance/history`;
};

export const getAdvanceHistoryDetailRouteUrl = (id): string => {
  return `/sales/ct-advance/history/${id}`;
};

export const getGrfHistoryListingRouteUrl = (): string => {
  return `/sales/grf/history`;
};

export const getGrfHistoryDetailRouteUrl = (id, grfType): string => {
  return `/sales/grf/history/${grfType}/${id}`;
};

export const getCashMemoHistoryDetailsPage = (subTxnType, id): string => {
  return `/sales/cash-memo/history/${subTxnType}/${id}`;
};

export const getCashMemoHistory = (): string => {
  return `/sales/cash-memo/history`;
};
export const getPendingAirpayStatusUrl = (type: any): string => {
  return `/sales/airpayRequests/${type}`;
};
export const getPendingRazorpayStatusUrl = (type: any): string => {
  return `/sales/razorpayRequests/${type}`;
};

export const getGEPHistoryUrl = (): string => {
  return `/sales/gep/history`;
};

export const getGEPHistoryDetailUrl = (id, subTxntype): string => {
  return `/sales/gep/history/` + `${subTxntype}/` + `${id}`;
};

export const getGrfUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/grf/new-grf/new`;
};

export const getManualGrfUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/grf/manual-grf/new`;
};

export const getAcceptAdvanceUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/ct-advance/accept-advance/new`;
};

export const getGiftCardsSaleUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/gift-cards/sale/new`;
};
export const getGiftCardsHistoryListingPageUrl = (): string => {
  return `/sales/gift-cards/history`;
};
export const getGiftCardsHistoryDetailsPage = (id): string => {
  return `/sales/gift-cards/history/${id}`;
};
export const getCustomerOrderFetchUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/customer-order/fetch`;
};
export const getCustomerOrderNewUrl = (): string => {
  return getCustomerTransactionBaseUrl() + `/customer-order/new`;
};
export const getCustomerOrderIdUrl = (id: any): string => {
  return getCustomerTransactionBaseUrl() + `/customer-order/${id}`;
};