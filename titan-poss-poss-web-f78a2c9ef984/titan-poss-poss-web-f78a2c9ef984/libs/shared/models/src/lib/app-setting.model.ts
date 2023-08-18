export type Language = 'en-US' | 'ar-AE';

export interface AppsettingsState {
  language: Language;
  theme: string;
  pageSize: number;
  pageSizeOptions: number[];
  storeType: string;
  // status: string;
  dateFormat: string;
  timeFormat: string;
  maxFilterLimit: number;
  maxSortLimit: number;
  maxProductInList: number;
  mobileNoMaxLength: number;
  maxLimitForCheckboxGrid: number;
  hostName: string;
  blockSetting:boolean;
}
