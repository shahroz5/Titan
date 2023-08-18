import { Moment } from 'moment';

export interface BinRequestApprovalsItems {
  binName: string;
  id: number;
  reqLocationCode: string;
  reqDocDate: Moment;
  reqDocNo: number;
  status: string;
  requestedRemarks: string;
  binGroupCode: string;
}

export interface BinHistroyResponse {
  id: number;
  reqDocNo: number;
  reqLocationCode: string;
  reqDocDate: Moment;
  binName: string;
  status: string;
  requestedRemarks: string;
  binGroupCode: string;
  approvedRemarks: string;
  reqFiscalYear: Moment;
}

export interface BinHistoryDto {
  binGroupCode: string;
  binName: string;
  date: string;
  endDate: Moment;
  reqDocNo: string;
  reqFiscalYear: Moment;
  startDate: Moment;
  statuses: any;
}

export interface LoadBinHistoryResponse {
  count: number;
  items: BinHistroyResponse[];
}
export interface LoadBinRequestResponse {
  count: number;
  items: BinRequestApprovalsItems[];
}

export interface BinApprovals {
  remarks: string;
  status: string;
}

export interface BinRequestApprovalLocation {
  locationCode: string;
  address: string;
}
