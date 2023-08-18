import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  MappedDetails,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductCategoryMappingServiceAbstraction,
  ProductCategoryServiceResponse
} from '@poss-web/shared/models';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteAllRowsComponent,
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';

@Component({
  selector: 'poss-web-discount-product-category-mapping',
  templateUrl: './discount-product-category-mapping.component.html',
  styleUrls: ['./discount-product-category-mapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountProductCategoryMappingComponent
  implements OnDestroy, AfterViewInit {
  @Input() mappedProductCategory: {
    id: string;
    productCategoryCode: string;
    productCategoryDescription: string;
    isActive: boolean;
  }[] = [];

  @Input() allMappedProductCategory: MappedDetails[] = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;
  @Input() discountDetails;
  @Input() discountWorkflow: boolean;
  @Input() tabType;

  @Output() loadMapperPC = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string[]>();
  @Output() add = new EventEmitter<any[]>();
  @Output() activate = new EventEmitter<any>();
  @Output() enableWorkflowNotification = new EventEmitter<boolean>();

  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;

  selectedConfigs: string[] = [];
  filterForm = new FormGroup({
    searchValue: new FormControl()
  });

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  destroy$ = new Subject<null>();
  component: any = this;
  searchValue: string;
  defaultColDef = {
    suppressMovable: true
  };

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction,
    private productCategoryMappingService: ProductCategoryMappingServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountProductCategoryMapping.productCategoryLable',
        'pw.discountProductCategoryMapping.statusLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            minWidth: 35,
            width: 40,
            pinned: 'left',
            lockPinned: true
          },
          {
            headerName:
              translatedMsg[
                'pw.discountProductCategoryMapping.productCategoryLable'
              ],
            field: 'productCategoryCode'
          },
          {
            headerName: 'Description',
            field: 'description',
            flex: 1
          },
          {
            headerName:
              translatedMsg['pw.discountProductCategoryMapping.statusLabel'],
            field: 'isActive',
            cellRendererFramework: ToggleButtonCellComponent,
            width: 120
          },
          {
            headerComponent: 'deleteAllRowsRenderer',
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width'
          }
        ];
      });
  }

  ngAfterViewInit(): void {
    console.log(this.allMappedProductCategory, 'selected in UI');
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.filterForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    this.searchValue = searchValue;
    this.loadMappedProductCategories();
  }

  clearSearch() {
    this.filterForm.get('searchValue').reset();
    this.searchValue = null;

    this.loadMappedProductCategories();
  }

  openProductCategoryMapping() {
    if (this.discountWorkflow && this.tabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.productCategoryMappingService
        .open({
          selectedProductCategory: this.allMappedProductCategory
        })
        .subscribe((res: ProductCategoryServiceResponse) => {
          if (res) {
            if (res.type === 'apply') {
              if (res.data.addedProductCategories.length)
                this.add.emit(res.data.addedProductCategories);

              if (res.data.removeProductCategories.length)
                this.delete.emit(
                  res.data.removeProductCategories.map(p => p.uuid)
                );
            }
          }
        });
    }
  }
  showMessage(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (
              event.eventType === OverlayNotificationEventType.CLOSE &&
              this.discountWorkflow
            ) {
              this.enableWorkflowNotification.emit(true);
            }
          });
      });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent
    };
  }

  onCellKeyPress(event) {
    console.log(event.data, 'event');

    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.id);
    }
  }

  openConfirmDialogForDelete(data: any) {
    if (this.discountWorkflow && this.tabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductCategoryMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.filterForm.get('searchValue').reset();
            this.delete.emit([data.id]);
          }
        });
    }
  }

  openConfirmDialogForDeleteAll() {
    if (this.discountWorkflow && this.tabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.api.getSelectedRows().length) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.discountProductCategoryMapping.deleteAllConfirmMessage'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: boolean) => {
            if (res === true) {
              this.delete.emit(this.api.getSelectedRows().map(data => data.id));
            }
          });
      }
    }
  }

  // TODO : need to change context for toggel button component
  getContext() {
    return {
      componentParent: this.component
    };
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  paginate(data) {
    this.pageEvent = data;
    this.loadMappedProductCategories();
  }

  loadMappedProductCategories() {
    this.loadMapperPC.emit({
      searchValue: this.searchValue,
      pageEvent: this.pageEvent
    });
  }
  selectionChange(id, status) {
    console.log(id, status, 'chevk selection change');
    // this.delete.emit(this.api.getSelectedRows().map(data => data.id));
    this.activate.emit({ id, status });
    this.filterForm.reset();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
