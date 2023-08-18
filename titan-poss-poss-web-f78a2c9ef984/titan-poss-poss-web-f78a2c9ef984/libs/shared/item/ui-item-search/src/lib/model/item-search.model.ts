export interface ItemSearchResponse {
  searchValue: string;
  lotNumber: string;
  isValid: boolean;
}

export interface SelectableItem {
  item: any;
  isSelected: boolean;
}
