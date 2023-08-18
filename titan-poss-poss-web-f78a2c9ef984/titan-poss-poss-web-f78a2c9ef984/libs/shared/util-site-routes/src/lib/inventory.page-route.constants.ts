export const getNotFoundRouteUrl = (): string => {
  return `404`;
};

/**
 * Inventory Routing Urls
 */
export const getInventoryHomeRouteUrl = (): string => {
  return `inventory/home`;
};
export const getPossHomeRouteUrl = (): string => 'home';

export const getInventoryRouteUrl = (): string => {
  return `inventory`;
};

export const getStockReceiveRouteUrl = (stockReceivePath: string): string => {
  return getInventoryRouteUrl() + `/stockreceive/${stockReceivePath}`;
};

export const getStockReceiveIssueFactoryDefaultRouteUrl = (): string => {
  return `factory`;
};

export const getStockReceiveIssueCFADefaultRouteUrl = (): string => {
  return `cfa`;
};

export const getStockIssueDirectTransferDefaultRouteUrl = (): string => {
  return `directtransfer`;
};

export const getStockReceiveDefaultRouteUrl = (): string => {
  return `/inventory/stockreceive/allowedRoutes`;
};

export const getStockReceiveHistoryRouteUrl = (): string => {
  return `/inventory/stockreceive/history/allowedRoutes`;
};

export const getStockReturnHomeDefaultRouteUrl = (): string => {
  return `invoice/history/invoiceToCFA`;
};
export const getStockIssueDirectIssueRouteUrl = (): string => {
  return `inventory/stockissue/factory`;
};
export const getStockIssueInvoiceHistoryUrl = (invoiceType: string): string => {
  return getInventoryRouteUrl() + `/stockissue/invoice/history/${invoiceType}`;
};

export const getInStockHomeRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/instock/home`;
};

export const getInStockRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/instock`;
};

export const getStockIssueRouteUrl = (stockIssuePath: string): string => {
  return getInventoryRouteUrl() + `/stockissue/${stockIssuePath}`;
};
export const getStockIssueL1L2RouteUrl = (): string => {
  return '/inventory/stockissue/L1L2type';
};
export const getStockIssueL3RouteUrl = (): string => {
  return '/inventory/stockissue/L3type';
};

export const getStockIssueCancelRouteUrl = (stockIssuePath: string, id: number): string => {
  return `/inventory/stockissue/details/cancel/${stockIssuePath}/${id}`;
};
export const getStockReturnRouteUrl = (stockReturnPath: string): string => {
  console.log('path', stockReturnPath);
  return getInventoryRouteUrl() + `/stockissue/${stockReturnPath}`;
};
export const getStockReturnHomeRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/stockissue/home`;
};
export const getStockIssueHistoryAllowedRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/stockissue/history/types`;
};
export const getStockIssueHistoryTabRouteUrl = (type: any): string => {
  return getInventoryRouteUrl() + `/stockissue/history/${type}`;
};
export const getStockIssueFactoryHistoryAllowedRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/stockissue/history/factoryTypes`;
};
export const getStockIssueBoutiqueHistoryAllowedRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/stockissue/history/boutiqueTypes`;
};
export const getStockIssueTEPHistoryAllowedRouteUrl = (): string => {
  return getInventoryRouteUrl() + `/stockissue/history/TEPtypes`;
};
export const getStockIssueHistoryDetailsRouteUrl = (
  type: any,
  requestType: any,
  id: any
): string => {
  return (
    getInventoryRouteUrl() + `/stockissue/details/${type}/${requestType}/${id}`
  );
};
export const getStockIssueReturnDetailsRouteUrl = (
  type: any,

  id: any
): string => {
  return getInventoryRouteUrl() + `/stockissue/details/history/${type}/${id}`;
};

export const getBintoBinTransferDefaultRouteUrl = (): string => {
  return `variantCode`;
};

export const getBinCreationDefaultRouteUrl = (): string => {
  return `binHistory`;
};

export const getInterBoutiqueTransferDefaultRouteUrl = (): string => {
  return `sent`;
};

export const getConversionDefaultRouteUrl = (): string => {
  return `search`;
};

export const getOtherIssuesReceiptsDefaultUrl = (): string => {
  return '/' + getOtherReceiptsIssuesRouteUrl() + '/listType/tabType/type';
};
export const getOtherReceiptsDefaultUrl = (): string => {
  return '/' + getOtherReceiptsIssuesRouteUrl() + '/list/type/receipts';
};

export const getOtherIssuesDefaultUrl = (): string => {
  return '/' + getOtherReceiptsIssuesRouteUrl() + '/list/type/issues';
};

export const getBintoBinTransferRouteUrl = (transferType: string): string => {
  return getInStockRouteUrl() + `/bintobinTransfer/${transferType}`;
};

export const getBinCreationRouteUrl = (transferType: string): string => {
  return getInStockRouteUrl() + `/binCreation/${transferType}`;
};

export const getUpdateHallmarkDetailsRouteUrl = (transferType?: string): string => {
  return getInStockRouteUrl() + `/update-item-hallmark-details`;
};

export const getInterBoutiqueTransferRouteUrl = (
  requestType: string
): string => {
  return getInStockRouteUrl() + `/inter-boutique-transfer/` + `${requestType}`;
};

export const getConversionDetailsRouteUrl = (id: string): string => {
  return getInStockRouteUrl() + `/conversion/requests/${id}`;
};
export const getConversionRouteUrl = (conversionType: string): string => {
  return getInStockRouteUrl() + `/conversion/${conversionType}`;
};
export const getConversionHistoryRouteUrl = (requestType: string): string => {
  return getInventoryRouteUrl() + `/instock/conversion/history/${requestType}`;
};
export const getConversionHistoryDetailsRouteUrl = (
  type: any,
  requestType: string,
  id: any
): string => {
  return (
    getInventoryRouteUrl() + `/instock/conversion/${type}/${requestType}/${id}`
  );
};
export const getOtherReceiptsIssuesListRouteUrl = (
  type: string,
  receiptIssueType: string
): string => {
  return (
    getInStockRouteUrl() +
    `/other-receipts-issues-list/list/${type}/${receiptIssueType}`
  );
};
export const getOtherReceiptsIssuesHistoryListRouteUrl = (
  type: string,
  receiptIssueType: string
): string => {
  return (
    getInStockRouteUrl() +
    `/other-receipts-issues-list/history/${type}/${receiptIssueType}`
  );
};
export const getOtherReceiptsIssuesHistoryDetailsRouteUrl = (
  type: string,
  receiptIssueType: string,
  id: string
): string => {
  return (
    getInStockRouteUrl() +
    `/other-receipts-issues-list/history/details/${type}/${receiptIssueType}/${id}`
  );
};

export const getOtherReceiptsRouteUrl = (receiptType: string): string => {
  return getInStockRouteUrl() + `/otherreceipts/${receiptType}`;
};

export const getOtherIssuesRouteUrl = (issueType: string): string => {
  return getInStockRouteUrl() + `/otherissues/${issueType}`;
};

export const getOtherIssuesCreateRouteUrl = (issueType: string): string => {
  return getInStockRouteUrl() + `/create/otherissues/${issueType}`;
};

export const getStockIssueTEPGEPRouteUrl = (
  type: string,
  transferType: string
): string => {
  return getStockIssueRouteUrl(type) + `/tep-gep/${transferType}`;
};

export const getIBTCreateRequestRouteUrl = (): string => {
  return getInStockRouteUrl() + `/inter-boutique-transfer/create-request`;
};

export const getApprovalsRouteUrl = (requestType: string): string => {
  if (requestType === null) {
    return `approvals/inventory-approvals`;
  } else {
    return `approvals/inventory-approvals/${requestType}`;
  }
};

export const getOtherReceiptsIssuesRouteUrl = (): string => {
  return getInStockRouteUrl() + `/other-receipts-issues-list/`;
};
export const getOtherReceiptsIssuesDefaultRouteUrl = (): string => {
  return 'Exhibition';
};
export const getOtherIssuesDefaultRouteUrl = (): string => {
  return 'otherissues';
};
export const getOtherIssuesReceiptUrl = (tab: string, type: string): string => {
  return (
    getInventoryRouteUrl() +
    `/instock/other-receipts-issues-list/list/${tab}/${type}`
  );
};
export const getOtherIssueReceiptAdjCreateNewUrl = (
  type: string,
  reqType: string
): string => {
  return getInventoryRouteUrl() + `/instock/${type}/${reqType}`;
};
export const getOtherIssueEXHCreateNewUrl = (
  type: string,
  reqType: string
): string => {
  return (
    getInventoryRouteUrl() + `/instock/${type}/create/${reqType}/allProducts`
  );
};
export const getOtherReceiptsIssuesSuggestedRoutes = (): string => {
  return '/inventory/instock/other-receipts-issues-list/history/tabType/type';
};
export const getAllOtherIssuesSuggestedRoutes = (): string => {
  return '/inventory/instock/other-receipts-issues-list/history/allOtherIssues/types';
};
export const getOtherReceiptsSuggestedRoutes = (): string => {
  return '/inventory/instock/other-receipts-issues-list/history/otherReceipts/types';
};
export const getOtherIssuesSuggestedRoutes = (): string => {
  return '/inventory/instock/other-receipts-issues-list/history/otherIssues/types';
};
export const getOtherIssuesRaisedRequestsSuggestedRoutes = (): string => {
  return '/inventory/instock/other-receipts-issues-list/history/otherIssue-requests/types';
};
export const getOtherIssueReceiptsDetailsRouteUrl = (
  type: any,
  transferType: string,
  id: any
): string => {
  return getInventoryRouteUrl() + `/instock/${type}/${transferType}/${id}`;
};
