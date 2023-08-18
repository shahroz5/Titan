import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { OrderPaymentResponse, ProductGroup, ShortcutServiceAbstraction } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

export const sortShortcutKey = 'OrderPaymentDetailsItemComponent.SORT';
const componentName = 'OrderPaymentDetailsItemComponent';

@Component({
  selector: 'poss-web-order-payment-config-view',
  templateUrl: './order-payment-config-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderPaymentConfigViewComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() selectedConfigDetails;
  @Input() productGroups: ProductGroup[];
  @Input() orderPaymentConfigDetails: OrderPaymentResponse[];

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];

  @Output() paginator = new EventEmitter<PageEvent>();

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  defaultColDef = {
    suppressMovable: true
  };

  pageSizeOptions = [];
  minPageSize: number;

  prevData = [];
  productGroupCodeLabel: string;
  gridApi: GridApi;
  columnDefs = [];
  animateRows = true;
  rowHeight = '35';
  destroy$: Subject<null> = new Subject<null>();
  expanded = true;

  maxSortLimit = 1;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private sortService: SortDialogService,
    private shortcutService: ShortcutServiceAbstraction,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['productGroups'] ||
      changes['orderPaymentConfig'] ||
      changes['orderPaymentConfigDetails']
    ) {
    }
  }

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.abOrderPaymentConfig.productGroup',
        'pw.abOrderPaymentConfig.description',
        'pw.abOrderPaymentConfig.frozenMetalRate',
        'pw.abOrderPaymentConfig.nonFrozenMetalRate',
        'pw.abOrderPaymentConfig.bestRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.weightTolerance.productGroup'],
            field: 'productGroupCode',
            width: 200,
            minWidth: 200,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.weightTolerance.description'],
            field: 'description',
            editable: false,
            width: 250,
            minWidth: 250,
            suppressSizeToFit: true,
            suppressMovable: true
          },

          {
            headerName: translatedMessages['pw.weightTolerance.frozenMetalRate'],
            field: 'metalRateFrozenPercent',
            width: 165,
            minWidth: 165,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.weightTolerance.nonFrozenMetalRate'],
            field: 'metalRateNonFrozenPercent',
            width: 162,
            minWidth: 162,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.weightTolerance.bestRate'],
            field: 'bestRatePercent'
          }
        ];

        this.productGroupCodeLabel =
          translatedMessages['pw.weightTolerance.productGroup'];
      });

    this.translate
      .get([
        'pw.abOrderPaymentConfig.productGroup',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName: translatedMessages['pw.abOrderPaymentConfig.productGroup'],
            sortAscOrder: false
          }
        ];
      });
  }

  openSortDailog() {
    this.dialog.closeAll();
    this.sortService
      .openDialog(this.maxSortLimit, this.sortData)
      .pipe(take(1))
      .subscribe((sortResult: { data: Column[]; actionfrom: string }) => {
        this.sort = [];
        if (sortResult.actionfrom === 'apply') {
          const sortData = sortResult.data;
          if (sortData == null || sortData.length === 0) {
            this.sortData = [];
            this.sortOrder = null;
            this.sortBy = null;
          } else {
            this.sortData = sortData;
            if (sortData.length > 0) {
              this.sortData.forEach(sort=>{
                switch(sort.id)
                {
                  case 0: this.sortBy = 'productGroupCode';
                    break;
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              })
            }
          }
          this.sortEmitter.emit(this.sort);
        }
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  search(searchValue) {
    const filteredRowData = this.getAllRows().filter(
      data => data.productGroupCode === searchValue
    );
    if (filteredRowData.length) {
      this.gridApi.setRowData(filteredRowData);
    } else {
      this.gridApi.setRowData([]);
    }
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  clearSearch() {
    this.searchForm.reset();
    this.gridApi.setRowData(this.orderPaymentConfigDetails);
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
