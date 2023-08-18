import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { CutPiecePopupComponent } from '../cut-piece-popup/cut-piece-popup.component';

@Component({
  selector: 'poss-web-product-category-mapping',
  templateUrl: './product-category-mapping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCategoryMappingComponent
  implements OnDestroy, OnChanges, AfterViewInit {
  @Input() cutPieceConfigList: ProductCategoryMappingComponent[];
  @Input() count: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() deleteProductCategory = new EventEmitter<string>();
  @Output() updateCutPieceConfig = new EventEmitter<
    {
      cutPieceTepPercent: string;
      productCategoryCode: string;
    }[]
  >();
  @Output() openProductCategoryPopup = new EventEmitter<string>();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() loadDetails = new EventEmitter();
  api: GridApi;
  destroy$: Subject<null> = new Subject<null>();
  defaultColDef = {
    suppressMovable: true
  };
  enableButton = false;
  domLayout = 'autoHeight';
  rowHeight = '35';
  animateRows = true;
  rowSelection = 'multiple';
  ids: string[] = [];
  disableButton = true;
  columnDefs = [];
  component: any = this;
  selectedRowData: any;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  invalidSearch = false;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.cutPieceConfig.productCategoryLabel',
        'pw.cutPieceConfig.descriptionLabel',
        'pw.cutPieceConfig.cutPieceTepPercentage',
        'pw.cutPieceConfig.removeLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName: translatedMsg['pw.cutPieceConfig.productCategoryLabel'],
            field: 'productCategoryCode',
            width: 250,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName: translatedMsg['pw.cutPieceConfig.descriptionLabel'],
            field: 'description',
            width: 400,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName:
              translatedMsg['pw.cutPieceConfig.cutPieceTepPercentage'],
            field: 'cutPieceTepPercent',
            width: 400,
            resizable: true,
            suppressMovable: true
          },
          {
            headerName: '',
            field: 'id',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            suppressMovable: true
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cutPieceConfigList']) {
      this.disableButton = false;
    }
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
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadDetails.emit();
  }
  search(searchValue) {
    if (fieldValidation.productCategoryField.pattern.test(searchValue)) {
      this.emitSearchValue.emit(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = false;
      this.api.setRowData([]);
    }
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }
  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  openConfirmDialogForDelete(data: any) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.deleteProductCategory.emit(data.id);
        }
      });
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }
  onRowSelected($event) {
    this.selectedRowData = $event.node.data;
    this.disableButton = true;
    this.ids.push($event.node.data.id);
    if (this.api.getSelectedNodes().length > 0) {
      this.enableButton = true;
    } else {
      this.enableButton = false;
    }
  }

  openPopUp() {
    const dialogRef = this.dialog.open(CutPiecePopupComponent, {
      width: '480px',
      data:
        this.api.getSelectedRows().length === 1 ? this.selectedRowData : null
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const updateConfig = [];
          this.api.getSelectedNodes().forEach(rowData => {
            updateConfig.push({
              cutPieceTepPercent: data.cutPieceTepPercentage,
              id: rowData.data.id
            });
          });
          // this.ids.forEach(id => {
          //   updateConfig.push({
          //     cutPieceTepPercent: data.cutPieceTepPercentage,
          //     id: id
          //   });
          // });
          this.updateCutPieceConfig.emit(updateConfig);
        }
      });
  }
  openProductCategoryMapping() {
    this.openProductCategoryPopup.emit();
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }
  emitPagination($event) {
    this.searchForm.reset();
    this.paginator.emit($event);
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
