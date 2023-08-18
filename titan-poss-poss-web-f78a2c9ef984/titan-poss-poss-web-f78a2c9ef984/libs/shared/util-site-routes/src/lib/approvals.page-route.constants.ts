/**
 * Approvals Routing Urls
 */
export const getApprovalsRouteBaseUrl = (): string => {
  return `/approvals`;
};
export const getApprovalsHomeRouteUrl = (): string => {
  return getApprovalsRouteBaseUrl() + `/home`;
};
export const getApprovalsRoleLimitRequestsRouteUrl = (): string => {
  return getApprovalsRouteBaseUrl() + `/uam/role-limit-requests`;
};
export const getRequestOtherIssuesRouteUrl = (): string => {
  return `/approvals/inventory-approvals/OtherIssuesRequest/tab`;
};
export const getRequestApprovalsAllowedRouteUrl = (): string => {
  return '/approvals/inventory-approvals/type';
};
export const getInventoryRequestApprovalsTypeUrl = (type: any): string => {
  return `/approvals/inventory-approvals/${type}`;
};

export const getBinCreationApprovalsRouteUrl = () => {
  return '/approvals/inventory-approvals/BinRequest';
};
export const getConversionApprovalsAllowedRouteUrl = () => {
  return '/approvals/inventory-approvals/conversion/tab';
};
export const getConversionApprovalsIdRouteUrl = (id: number) => {
  return `/approvals/inventory-approvals/conversion-details/${id}`;
};
export const getIbtRequestApprovalsRouteUrl = () => {
  return '/approvals/inventory-approvals/IbtRequest';
};
export const getIbtRequestApprovalsDetailsRouteUrl = (id: any) => {
  return `/approvals/inventory-approvals/IbtRequest/${id}`;
};
export const getIbtCancellationRequestApprovalsDetailsRouteUrl = (id: any) => {
  return `/approvals/inventory-approvals/IbtCancellationRequest/${id}`;
};

export const getOtherIssuesADJRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/ADJ';
};

export const getOtherIssuesLoanRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/LOAN';
};

export const getOtherIssuesFocRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/FOC';
};

export const getOtherIssuesLossRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/LOSS';
};

export const getOtherIssuesPsvRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/PSV';
};

export const getOtherIssuesExhRouteUrl = () => {
  return '/approvals/inventory-approvals/OtherIssuesRequest/EXH';
};
export const getOtherIssuesRequestRouteUrl = (type: any) => {
  return `/approvals/inventory-approvals/OtherIssuesRequest/${type}`;
};
export const getOtherIssuesRequestDetailsRouteUrl = (type: any, id: any) => {
  return `/approvals/inventory-approvals/OtherIssuesRequest/${type}/${id}`;
};

/**
 * Approvals Routing Urls for Manual bill(Customer Transaction)
 */
export const getCMRequestApprovalsListRouteUrl = (): string => {
  return '/approvals/cm-requests/list';
};

export const getGRFequestApprovalsListRouteUrl = (): string => {
  return '/approvals/grf-request/list';
};
export const getGRFApprovalsRouteUrl = (): string => {
  return '/sales/grf-status/list';
};
export const getCMRequestApprovalsDetailsRouteUrl = (
  taskId: string,
  processId: string
): string => {
  return `/approvals/cm-requests/details/${taskId}/${processId}`;
};

export const getGRFRequestApprovalsDetailsRouteUrl = (
  taskId: string,
  processId: string
): string => {
  return `/approvals/grf-request/details/${taskId}/${processId}`;
};

export const getRORequestApprovalsAllowedRouteUrl = (): string => {
  return '/approvals/ro-request/type';
};
export const getApprovalsAdvanceBookingActivationUrl = (tab: any): string => {
  return getApprovalsRouteBaseUrl() + `/advance-booking/activation/${tab}`;
};
export const getApprovalsAdvanceBookingCancellationUrl = (tab: any): string => {
  return getApprovalsRouteBaseUrl() + `/advance-booking/cancellation/${tab}`;
};
export const getApprovalsManualAdvanceBookingRequetsUrl = (): string => {
  return getApprovalsRouteBaseUrl() + `/advance-booking/manual/requests`;
};
export const getApprovalsManualAdvanceBookingTabsUrl = (tab: any): string => {
  return getApprovalsRouteBaseUrl() + `/advance-booking/manual/${tab}`;
};
export const getApprovalsManualAbDetailsTabsUrl = (
  taskId: any,
  processId: any
): string => {
  return (
    getApprovalsRouteBaseUrl() +
    `/advance-booking/manual/requests/${taskId}/${processId}`
  );
};

export const getApprovalsBillCancellationRequestsTabsUrl = (
  tab: any
): string => {
  return getApprovalsRouteBaseUrl() + `/bill-cancellation-requests/${tab}`;
};
