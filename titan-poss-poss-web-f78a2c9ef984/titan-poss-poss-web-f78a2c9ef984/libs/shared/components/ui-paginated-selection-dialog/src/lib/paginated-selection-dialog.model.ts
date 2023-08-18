import { Observable } from 'rxjs';
export interface PaginatedSelectionDialogConfig {
  title: string;
  placeholder: string;
  options: Observable<PaginatedSelectionDialogOption[]>;
  isLoading: Observable<boolean>;
  pageSize: number;
  total: Observable<number>;
}

export interface PaginatedSelectionDialogOption {
  id: string;
  description: string;
}

export interface PaginatedSelectionDialogRef {
  close: Observable<any>;
  load: Observable<{
    pageIndex: number;
    searchValue?: string;
  }>;
}
