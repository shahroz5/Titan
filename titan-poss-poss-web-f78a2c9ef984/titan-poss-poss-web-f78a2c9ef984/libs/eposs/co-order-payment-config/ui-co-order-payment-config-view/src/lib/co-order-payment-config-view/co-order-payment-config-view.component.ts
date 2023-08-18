import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  CoOrderPaymentResponse,
  ProductGroup,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

export const sortShortcutKey = 'CoOrderPaymentDetailsItemComponent.SORT';
const componentName = 'CoOrderPaymentDetailsItemComponent';

@Component({
  selector: 'poss-web-co-order-payment-config-view',
  templateUrl: './co-order-payment-config-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoOrderPaymentConfigViewComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Input() selectedConfigDetails;
  @Input() productGroups: ProductGroup[];
  @Input() coOrderPaymentConfigDetails: CoOrderPaymentResponse[];

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];

  @Output() paginator = new EventEmitter<PageEvent>();

  @ViewChild('searchBox')
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['productGroups'] ||
      changes['coOrderPaymentConfig'] ||
      changes['coOrderPaymentConfigDetails']
    ) {
      // if (this.gridApi) {
      //   this.gridApi.setRowData(this.coOrderPaymentConfigDetails);
      // }
      // this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );

    this.translate
      .get([
        'pw.coOrderPaymentConfig.productGroup',
        'pw.coOrderPaymentConfig.description',
        'pw.coOrderPaymentConfig.frozenMetalRate',
        'pw.coOrderPaymentConfig.nonFrozenMetalRate',
        'pw.coOrderPaymentConfig.bestRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.columnDefs = [
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
            headerName: 'IBT',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'ibtBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'ibtBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'MTR',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'mtrBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'mtrBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'PROD',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'prodBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'prodBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'COM',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comMetalRateFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comMetalRateFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comMetalRateNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comMetalRateNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'comBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'comBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          },
          {
            headerName: 'Auto Approval',
            children: [
              {
                headerName: 'Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Non Frozen Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalNonFrozenPercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalNonFrozenPercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              },
              {
                headerName: 'Best Rate (%)',
                children: [
                  {
                    headerName: 'Gold',
                    field: 'autoApprovalBestRatePercentforGold',
                    width: 200,
                    minWidth: 80
                  },
                  {
                    headerName: 'Platinum',
                    field: 'autoApprovalBestRatePercentforPlatinum',
                    width: 200,
                    minWidth: 80
                  }
                ]
              }
            ]
          }
        ]),
          (this.productGroupCodeLabel =
            translatedMessages['pw.weightTolerance.productGroup']);
      });

    this.translate
      .get(['pw.coOrderPaymentConfig.productGroup'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.sortService.DataSource = [
          {
            id: 0,
            sortByColumnName:
              translatedMessages['pw.coOrderPaymentConfig.productGroup'],
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
              this.sortData.forEach(sort => {
                switch (sort.id) {
                  case 0:
                    this.sortBy = 'productGroupCode';
                    break;
                }
                this.sortOrder = sort.sortAscOrder ? 'asc' : 'desc';
                this.sort = [...this.sort, this.sortBy + ',' + this.sortOrder];
              });
            }
          }
          this.sortEmitter.emit(this.sort);
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.searchBox?.nativeElement) {
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
    this.gridApi.setRowData(this.coOrderPaymentConfigDetails);
  }

  toggleAccordion() {
    this.expanded = !this.expanded;
  }
}
