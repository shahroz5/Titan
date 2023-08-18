import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import {
  DeleteAllRowsComponent,
  DeleteRowComponent,
  ToggleButtonCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-ui-product-group-one-kt',
  templateUrl: './ui-product-group-one-kt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiProductGroupOneKTComponent
  implements OnChanges, OnDestroy {
  @Input() totalElements = 100;
  @Input() pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 20,
    length: 20
  };
  @Input() pageSizeOptions: number[];
  @Input() minPageSize = 0;
  @Input() productGroups;
  @Output() delete = new EventEmitter<any>();
  @Output() activate = new EventEmitter<any>();
  destroy$ = new Subject<null>();
  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  component: any = this;
  rowData = [];
  constructor(
    private dialog: MatDialog,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
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
        headerName: 'Product Groups',
        field: 'productGroupCode',
        suppressMovable: true,
        width: 100,
        pinned: 'left',
        lockPinned: true
      },
      {
        headerName: 'Description',
        field: 'description',
        suppressMovable: true,
        flex: 1
      },
      {
        headerName: 'Is Active',
        field: 'isActive',
        cellRendererFramework: ToggleButtonCellComponent,
        width: 120
      }
    ];
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['productGroups']) {
      this.rowData = this.productGroups;
      console.log(this.rowData, 'check');
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
  }
  onCellKeyPress(event) {
    const keyPressed = event.event.key;
    if (
      keyPressed === 'Enter' &&
      event.colDef.cellRenderer === 'deleteRowRenderer'
    ) {
      this.openConfirmDialogForDelete(event.data.productGroupCode);
    }
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
          // this.delete.emit(data);
        }
      });
  }
  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent,
      deleteAllRowsRenderer: DeleteAllRowsComponent
    };
  }
  onSelectionChanged(event) {
    console.log(event, 'test event');

    if (this.api.getSelectedNodes().length) {
      const productGroups = this.api.getSelectedRows().map(data => data.id);
      this.delete.emit({ ids: productGroups, remove: true });
    } else this.delete.emit({ ids: null, remove: false });
  }
  selectionChange(id, status) {
    this.activate.emit({ id, status });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
