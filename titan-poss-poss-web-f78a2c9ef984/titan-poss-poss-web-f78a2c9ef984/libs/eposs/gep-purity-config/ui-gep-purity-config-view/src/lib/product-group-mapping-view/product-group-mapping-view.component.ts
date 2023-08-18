import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { ProductGroup, Ranges } from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-group-mapping-view',
  templateUrl: './product-group-mapping-view.component.html'
})
export class ProductGroupMappingViewComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() currencyCode;
  @Input() productGroups: ProductGroup[] = [];
  @Input() pageSizeOptions: number[];
  @Input() ranges: Ranges[] = [];
  @Input() pageSize;
  @Input() minPageSize;
  @Input() mappedGroups: any;
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Output() emitProductGroup = new EventEmitter<string>();
  @Output() clearGridSearch = new EventEmitter<boolean>();
  @Output() openLocationMapping = new EventEmitter<boolean>();

  destroy$ = new Subject<null>();
  columnDefs = [];
  api: GridApi;
  domLayout = 'autoHeight';
  rowSelection = 'multiple';
  rowHeight = 35;
  defaultColDef = {
    suppressMovable: true
  };
  animateRows = true;
  rowData = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  rivaahDiscountLabel: string;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  @Input() isRivaah;
  constructor(
    private dialog: MatDialog, 
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService
    ) {
    this.translate
      .get([
        'pw.gePurityConfiguration.productGroupsLabel',
        'pw.gePurityConfiguration.descriptionLabel',
        'pw.gePurityConfiguration.rivaahDiscountLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.rivaahDiscountLabel = translatedMessages['pw.gePurityConfiguration.rivaahDiscountLabel'];
        this.columnDefs = [
          {
            headerName:
              translatedMessages['pw.gePurityConfiguration.productGroupsLabel'],
            field: 'productGroupCode',
            resizable: true,
            suppressSizeToFit: true,
            width: 150
          },
          {
            headerName:
              translatedMessages['pw.gePurityConfiguration.descriptionLabel'],
            field: 'description',
            resizable: true,
            suppressSizeToFit: true,
            width: 200          
          },
          {
            headerName: 
              translatedMessages['pw.gePurityConfiguration.rivaahDiscountLabel'],
            field: 'rivaahAdditionalDiscount',
            type: 'numericColumn',
            suppressSizeToFit: true,
            resizable: true,
            width: 100,
            hide: !this.isRivaah
          }
        ];
      });
  }
  
  change(event: any) {
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
  }

  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.api.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.api.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }

  ngOnInit(): void {
    this.ranges.forEach(ranges => {
      this.columnDefs.push({
        headerName:
          ranges.fromRange.toString() + ' to ' + ranges.toRange.toString(),
        field: ranges.id,
        suppressSizeToFit: true,
        resizable: true,
        flex: 1
      });
    });
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }
  search(searchValue: string) {
    this.emitProductGroup.emit(searchValue);
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearGridSearch.emit(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mappedGroups']) {
      this.rowData = this.mappedGroups;
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }
  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
