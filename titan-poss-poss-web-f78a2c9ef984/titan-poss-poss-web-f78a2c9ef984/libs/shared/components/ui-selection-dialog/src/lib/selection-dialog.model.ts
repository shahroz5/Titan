import { Observable } from 'rxjs';
export interface SelectionDialogConfig {
  title: string;
  placeholder: string;
  options?: SelectionDailogOption[];
  optionsObservable?: Observable<SelectionDailogOption[]>;
  searchOptionsObservable?: Observable<SelectionDailogOption[]>;
  isComplete?: Observable<boolean>;
  isLoading?: Observable<boolean>;
  isInfinityScroll?: boolean;
  isPopupClosed?: boolean;
}

export interface SelectionDailogOption {
  id: string;
  description: string;
  additionalProperty?: any;
}

export interface SelectionDailogRef {
  close: Observable<any>;
  loadNext: Observable<any>;
  search: Observable<string>;
}
