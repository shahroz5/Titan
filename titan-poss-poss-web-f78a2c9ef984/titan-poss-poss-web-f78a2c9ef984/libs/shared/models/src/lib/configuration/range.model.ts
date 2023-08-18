
export interface RangeResponse {
  ranges: ConfigurationRanges[];
  totalElements: number;
}
export interface ConfigurationRanges {
  fromRange: string;
  toRange: string;
  id: string;
  rowId?: number;
  isActive: boolean;
}
export interface RangeTypes {
  value: string;
  description: string;
}
