import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ProductGroupMappingOption
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { TranslateService } from '@ngx-translate/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
@Component({
  selector: 'poss-web-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGroupsComponent
  implements OnDestroy, AfterViewInit {
  api: GridApi;
  @Input() selectedProductGroups: ProductGroupMappingOption[];
  @Input() disable: boolean;
  @Output() deleteProductGroup = new EventEmitter<string>();
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize;
  @Input() pageSize;
  @Input() count: number;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearSearchValue = new EventEmitter();
  @Output() loadProductGroups = new EventEmitter();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  gridData: string[] = [];
  rowData: ProductGroupMappingOption[] = [];
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  columnDefs = [];
  destroy$: Subject<null> = new Subject<null>();
  defaultColDef = {
    suppressMovable: true
  };
  component: any = this;
  invalidSearch = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.encircleProductGroupMapping.productGroupLabel',
        'pw.encircleProductGroupMapping.descriptionLabel',
        'pw.encircleProductGroupMapping.removeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName:
              translatedMessages[
                'pw.encircleProductGroupMapping.productGroupLabel'
              ],
            field: 'id',
            flex: 1,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName:
              translatedMessages[
                'pw.encircleProductGroupMapping.descriptionLabel'
              ],
            field: 'description',
            flex: 1,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName: '',
            field: 'uuid',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            suppressMovable: true
          }
        ];
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else this.clearSearch();
      });
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['selectedProductGroups']) {
  //     this.searchForm.reset();
  //   }
  // }
  search(searchValue) {
    if (fieldValidation.productGroupCodeField.pattern.test(searchValue)) {
      this.emitSearchValue.emit(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.api.setRowData([]);
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.clearSearchValue.emit();
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  change(event: any) {
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }
  openConfirmDialogForDelete(data) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.deleteProductGroup.emit(data.uuid);
        }
      });
  }
  emitPagination($event) {
    this.paginator.emit($event);
    this.searchForm.reset();
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
