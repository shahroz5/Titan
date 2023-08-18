import { Moment } from 'moment';
import { BinApprovals } from './bin-request-approvals.model';

export interface RequestApprovals {
  id: number;
  reqDocNo: number;
  createdDate: Moment;
  srcLocationCode: string;
  destLocationCode: string;
  totalAcceptedQuantity: number;
  totalAcceptedValue: number;
  totalAcceptedWeight: number;
  totalRequestedWeight: number;
  totalRequestedQuantity: number;
  totalRequestedValue: number;
  weightUnit: string;
  currencyCode: string;
  srcDocNo: number;
  totalIssuedQuantity: number;
  status: string;
  reqDocDate: Moment;
  requestType: string;
  totalIssuedValue: number;
  totalIssuedWeight: number;
  srcDocDate: Moment;

  otherDetails: {
    type: string;
    data: {
      approvedCode: string;
      approvedBy: string;
    };
  };
  carrierDetails: {
    type: string;
    data: {
      employeeName: string;
      employeeId: string;
      emailId: string;
    };
  };
}

export interface LoadRequestResponse {
  count: number;
  items: RequestApprovals[];
}

export interface RequestApprovalsItems {
  isSelected: boolean;
  id: string;
  itemCode: string;
  lotNumber: string;
  mfgDate: Moment;
  productCategory: string;
  productGroup: string;
  binCode: string;
  binGroupCode: string;
  stdValue: number;
  stdWeight: number;
  currencyCode: string;
  weightUnit: string;
  status: string;
  imageURL: string;
  thumbnailImageURL: string;
  requestedQuantity: number;
  acceptedQuantity: number;
  approvedQuantity: number;
  availableQuantity: number;
  inventoryId: string;
  totalApprovedQuantity: number;
  totalReceivedQuantity: number;
  totalReceivedValue: number;
  totalReceivedWeight: number;
  productGroupDesc: string;
  productCategoryDesc: string;
  isStudded: boolean;
  isLoadingImage: boolean;
  isLoadingThumbnailImage: boolean;
}

export interface LoadRequestResponseItems {
  count: number;
  items: RequestApprovalsItems[];
}

export interface ApprovalUpdatePayload {
  quantity: number;
  status: string;
}

export interface LoadBinRequestApprovalsPayload {
  pageIndex: number;
  pageSize: number;
}

export interface Ibtpayload {
  id: number;
  requestType: string;
  requestUpdateDto: {
    itemIds: string[];
    remarks: string;
    status: string;
  };
}

export interface SelectedStockPayload {
  id: number;
  requestType: string;
}

export interface GetIbtRequestPayload {
  id: number;
  requestType: string;
  pageIndex: number;
  pageSize: number;
  isSelectedArray: string[];
}

export interface GetBinRequestPayload {
  reqDocNo?: number;
  locationCode?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface BinApprovalspayload {
  binRequestUpdateDto: BinApprovals;
  id: number;
}

export interface IbtApprovalspayload {
  id: number;
  itemId: string;
  itemUpdateDto: ApprovalUpdatePayload;
}

export interface LoadIbtRequestPayload {
  requestType: string;
  pageIndex: number;
  pageSize: number;
  reqDocNo?: number;
  reqLocationCode?: string;
}

export interface CountPayload {
  requestType: string;
  id: number;
}
