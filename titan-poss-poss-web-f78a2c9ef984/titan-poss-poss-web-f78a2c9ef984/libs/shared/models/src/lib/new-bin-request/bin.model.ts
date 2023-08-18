import { Moment } from 'moment';

export interface BinCount {
  binCount: number;
}

export interface BinTranferProduct {
  binCode: string;
  products: number;
  totalValue: number;
  totalWeight: number;
}

export interface BinCodes {
  binCode: string;
  quantity: number;
}

export interface BinRequestDto {
  bin: string;
  remarks: string;
}

export interface BinRequestResponse {
  id: number;
  reqDocNo: string;
  locationCode: string;
  status: string;
  binName: string;
  reqDocDate: Moment;
}

export interface HistoryFiltersData {
  startDate: number;
  endDate: number;
  reqFiscalYear: number;

  statuses?: string[];
  location?:string;
}
