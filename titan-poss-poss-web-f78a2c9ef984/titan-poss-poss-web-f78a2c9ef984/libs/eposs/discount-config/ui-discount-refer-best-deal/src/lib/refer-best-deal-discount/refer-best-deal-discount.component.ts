import { MatDialog } from '@angular/material/dialog';

import { take, takeUntil } from 'rxjs/operators';
import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteAllRowsComponent,
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  Filter,
  AlertPopupTypeEnum,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { FilterService } from '@poss-web/shared/components/ui-filter-dialog';

@Component({
  selector: 'poss-web-refer-best-deal-discount',
  templateUrl: './refer-best-deal-discount.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReferBestDealDiscountComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() selectedDiscounts = [];

  @Input() allDiscounts = [];

  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;
  @Input() totalSelectedElements: number;
  @Input() discountDetails;

  @Output() loadBestDealDiscount = new EventEmitter<any>();
  @Output() activate = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string[]>();
  @Output() add = new EventEmitter<any[]>();

  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;

  destroy$ = new Subject<null>();
  component: any = this;

  discountFilterLable: string;

  productCategoriesForFilter: { [key: string]: Filter[] } = {};

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
    private filterService: FilterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountReferBestDeal.discountNameLable',
        'pw.discountReferBestDeal.addButton'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.discountFilterLable =
          translatedMsg['pw.discountReferBestDeal.addButton'];

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
              translatedMsg['pw.discountReferBestDeal.discountNameLable'],
            field: 'description',
            flex: 1
          },
          {
            headerName: 'Status',
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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes['selectedDiscounts'] &&
      this.allDiscounts &&
      this.allDiscounts.length > 0 &&
      this.selectedDiscounts &&
      this.selectedDiscounts.length > 0
    ) {
      const gridId = this.selectedDiscounts.map(grid => grid.description);
      setTimeout(() => {
        this.allDiscounts = this.allDiscounts.filter(
          role => !gridId.includes(role.discountCode)
        );
      });
    }

    setTimeout(() => {
      if (changes && changes['allDiscounts']) {
        this.productCategoriesForFilter = this.mapToFilterOptions(
          this.discountFilterLable,
          this.allDiscounts.map((discount: any) => ({
            id: discount.id,
            description: discount.discountCode,
            // TODO : check if we need to show selected discount
            selected: false
          }))
        );
      }
    }, 100);
  }

  ngOnInit() {
    // TODO : Delete. Only for testing

  }

  private mapToFilterOptions(
    key: string,
    options: Filter[]
  ): { [key: string]: Filter[] } {
    return {
      [key]: options
    };
  }

  openDiscountSelection() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.filterService.DataSource = {
        ...this.productCategoriesForFilter
      };
      this.filterService
        .openDialog(this.totalElements, null)
        .pipe(take(1))
        .subscribe(
          (filterResult: {
            data: { [key: string]: Filter[] };
            actionfrom: string;
          }) => {
            if (filterResult.actionfrom === 'apply') {
              const filterData = filterResult.data;
              const values = [];

              if (filterData) {
                if (filterData[this.discountFilterLable]) {
                  filterData[this.discountFilterLable].forEach(value => {
                    values.push(value.description);
                  });
                }
              }
              this.add.emit(values);
            }
          }
        );
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
          .events.subscribe();
      });
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent
    };
  }

  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.description);
    }
  }
  onCellClicked(clickEvent) {
    // if (clickEvent.colDef.cellRenderer === 'deleteRowRenderer') {
    //   this.openConfirmDialogForDelete(clickEvent.data);
    // }
  }
  openConfirmDialogForDelete(data: any) {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountReferBestDeal.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.delete.emit([data.id]);
          }
        });
    }
  }

  openConfirmDialogForDeleteAll() {
    if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (this.api.getSelectedRows().length > 0) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.CONFIRM,
            message: 'pw.discountReferBestDeal.deleteAllConfirmMessage'
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
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.loadBestDealDiscount.emit({
      pageEvent: this.pageEvent
    });
  }

  selectionChange(id, status) {
    this.activate.emit({ id, status });
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
