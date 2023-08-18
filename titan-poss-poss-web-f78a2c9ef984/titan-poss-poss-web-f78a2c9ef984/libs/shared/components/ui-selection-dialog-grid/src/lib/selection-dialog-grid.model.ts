export interface SelectionDialoGridConfig {
  title: string;
  placeholder: string;
  options: any[];
  width: number;
  searchBy: string;
  columnDefs: {
    field: string;
    headerName: string;
  }[];
}
