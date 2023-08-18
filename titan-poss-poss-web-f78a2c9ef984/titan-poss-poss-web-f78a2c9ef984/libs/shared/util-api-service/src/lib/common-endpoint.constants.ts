import { HttpParams } from '@angular/common/http';
import {
  NotificationPayload,
  printTransactionTypesEnum,
  StockReceiveLoadPendingPayload
} from '@poss-web/shared/models';

const integrationServiceBaseUrl = () => {
  return '/integration/v2/';
};

const cryptoServiceEndpoint = () => {
  return '/crypto';
};

const getOtherIssuesUrl = (): string => {
  return `/other-issues/request`;
};
const getOtherReceivessUrl = (): string => {
  return `/other-receives/request`;
};
const getStockIssueRequestUrl = (): string => {
  return `/stock-issues/request`;
};

const getReturnInvoiceRequestUrl = (): string => {
  return `/return-invoices` + `/request`;
};

const getSaleBaseUrl = (): string => {
  return `/sales/v2`;
};
const getInventoryBaseUrl = (): string => {
  return `/inventory/v2`;
};
export const getDigitalCertificateUrl = (): {
  path: string;
  params: HttpParams;
} => {
  const path =
    integrationServiceBaseUrl() + cryptoServiceEndpoint() + '/certificate';
  const params = new HttpParams().set('certificateType', 'QZTRAY');
  return { path, params };
};

const getSignatureEndpoint = (): string => {
  return integrationServiceBaseUrl() + cryptoServiceEndpoint() + '/signature';
};

export const getSalesPrintDataUrl = (
  printType: string,
  printFileType: string,
  transactionId?: string | number,
  reprint?: boolean,
  invoiceType?: string,
  productCode?: string,
  lastTransactionPrint?: boolean
): {
  path: string;
  params: HttpParams;
} => {
  let params = new HttpParams().set('documentType', printType);

  if (transactionId) {
    params = params.append('transactionId', String(transactionId));
  }
  if (printFileType) {
    params = params.append('fileType', printFileType);
  }
  if (invoiceType) {
    params = params.append('invoiceType', invoiceType);
  }
  if (productCode) {
    params = params.append('id', productCode);
  }
  if (lastTransactionPrint) {
    params = params.append('lastTransactionPrint', `${lastTransactionPrint}`);
  }
  if (reprint) {
    return { path: getSaleBaseUrl() + '/prints' + '/reprint', params };
  }
  return { path: getSaleBaseUrl() + '/prints', params };
};

export const getOtherIssuePrintUrl = (
  printType: string,
  transactionId: string | number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() + getOtherIssuesUrl() + `/${transactionId}/prints`;
  const params = new HttpParams().set('otherIssueType', printType);
  return { path, params };
};
export const getOtherReceivePrintUrl = (
  printType: string,
  transactionId: string | number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() + getOtherReceivessUrl() + `/${transactionId}/prints`;
  const params = new HttpParams().set('otherReciveType', printType);
  return { path, params };
};

export const getStockIssuePrintUrl = (
  printType: string,
  transactionId: string | number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() +
    getStockIssueRequestUrl() +
    `/${transactionId}/prints`;
  const params = new HttpParams().set('stockIssueRequestType', printType);
  return { path, params };
};
export const getStockTransferPrintUrl = (
  printType: string,
  transactionId: string | number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() +
    getStockIssueRequestUrl() +
    `/${transactionId}/print`;
  const params = new HttpParams().set('stockIssueTransferType', printType);
  return { path, params };
};

export const getReturnInvoicePrintUrl = (
  printType: string,
  transactionId: string | number
): {
  path: string;
  params: HttpParams;
} => {
  const path =
    getInventoryBaseUrl() +
    getReturnInvoiceRequestUrl() +
    `/${transactionId}/prints`;
  const params = new HttpParams().set('invoiceType', printType);
  return { path, params };
};

export const getNotificationUrl = (
  notificationPayload: NotificationPayload
): { path: string; params: HttpParams } => {
  const path = `/sales/v2/notifications`;
  const params = new HttpParams()
    .set('invoiceType', notificationPayload.invoiceType.toString())
    .set('isReprint', notificationPayload.reprint.toString())
    .set('transactionId', notificationPayload.transacionId.toString());
  return { path, params };
};

export const getQZTraySignatureUrl = (
  toSign
): {
  path: string;
  body: Object;
} => {
  const payload = {
    certificateType: 'QZTRAY',
    toSign: toSign
  };

  return {
    path: getSignatureEndpoint(),
    body: payload
  };
};

export const getScheduledJobsEndpointUrl = (
  page: number,
  pageSize: number
): { path: string; params: HttpParams } => {
  const path = `/integration/v2/scheduler/jobs`;
  const params = new HttpParams()
    .set('page', page.toString())
    .set('size', pageSize.toString());
  return { path, params };
};

export const getUpdateScheduleTimePayload = (
  schedulerCode: string,
  cronExpression: string,
  isActive
): { path: string; params: HttpParams } => {
  const path = `/integration/v2/scheduler`;
  const params = new HttpParams()
    .set('cronExpression', cronExpression.toString())
    .set('isActive', isActive)
    .set('schedulerCode', schedulerCode.toString());
  return { path, params };
};

export const getDataSyncStatusListEndpointUrl = (): string => {
  return '/datasync/v2/message/status';
};
export const getManualRunSchedulerEndpointUrl = (
  schedulerCode
): { path: string; params: HttpParams } => {
  const path = `/integration/v2/scheduler`;
  const params = new HttpParams().set(
    'schedulerCode',
    schedulerCode.toString()
  );
  return { path, params };
};
// App Version Endpoint Url's
export const getApplicationVersionsEndpointUrl = (): string => {
  return '/datasync/v2/app-version';
};
export const listAllAppVersionsEndpointUrl = (): string => {
  return '/datasync/v2/app-version/list';
};
export const listsAppVersionByStatusEndpointUrl = (): string => {
  return '/datasync/v2/app-version/all';
};
export const listAppVersionStatusEndpointUrl = (): string => {
  return '/datasync/v2/app-version/status';
};
export const addNewAppVersionEndpointUrl = (): string => {
  return '/datasync/v2/app-version';
};
export const publishToBoutiquesEndpointUrl = (): string => {
  return '/datasync/v2/app-version/publish';
};
export const deleteAppVersionsEndpointUrl = (appVersionId: number): string => {
  return `/datasync/v2/app-version/${appVersionId}`;
};
// Monitoring Dashboard Endpoint Url's
export const getCountByMessageTypeEndpointUrl = (): string => {
  return '/datasync/v2/message/status/count';
};
export const getListOfMessageEndpointUrl = (): string => {
  return '/datasync/v2/message';
};
export const retryTheJobEndpointUrl = (destination, messageid): string => {
  return `/datasync/v2/message/${destination}/${messageid}`;
};
export const getIsUpgradeAvailableUrl = (): string => {
  return `/datasync/v2/app-version`;
};
