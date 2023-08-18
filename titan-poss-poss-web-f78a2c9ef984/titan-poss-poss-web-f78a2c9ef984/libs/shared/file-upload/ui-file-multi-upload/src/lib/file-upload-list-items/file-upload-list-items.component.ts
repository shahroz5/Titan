import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteRowComponent,
  HyperLinkCellComponent
} from '@poss-web/shared/components/ui-ag-grid';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-file-upload-list-items',
  templateUrl: './file-upload-list-items.component.html',
  styleUrls: ['./file-upload-list-items.component.scss']
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadListItemsComponent
  implements OnInit, OnChanges, OnDestroy {
  //@Input() fileList: Observable<any>;
  @Input() fileList: { id: string; name: string }[] = [];
  @Input() viewMode: boolean = false;
  @Output() delete = new EventEmitter<any>();
  @Output() view = new EventEmitter<any>();

  api: GridApi;
  columnApi: ColumnApi;
  columnDefs = [];
  defaultColDef = {
    enableCellTextSelection: true,
    suppressMovable: true
  };
  rowSelection = 'multiple';
  animateRows = true;
  domLayout = 'autoHeight';
  rowHeight = 35;

  component: FileUploadListItemsComponent = this;
  rowData: { id: string; name: string }[] = [];
  destroy$ = new Subject();
  constructor(
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private dialog: MatDialog
  ) {
    this.translate
      .get(['pw.fileUpload.fileName', 'pw.fileUpload.preview'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.columnDefs = [
          {
            headerName: translatedMsg['pw.fileUpload.fileName'],
            field: 'name'
          },
          {
            headerName: translatedMsg['pw.fileUpload.preview'],
            cellRendererFramework: HyperLinkCellComponent,
            flex: 1
          },
          {
            cellRenderer: 'deleteRowRenderer',
            width: 21,
            minWidth: 21,
            maxWidth: 21,
            cellClass: 'pw-delete-icon-width'
          }
        ];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fileList']) {
      this.rowData = this.fileList;
    }
  }

  ngOnInit(): void {
    //this.cdr.markForCheck();
  }

  // ngAfterViewInit() {
  //   this.fileList.pipe(takeUntil(this.destroy$)).subscribe((fileList: any) => {
  //     console.log('1010', fileList);
  //     if (fileList) {
  //       this.api.setRowData(fileList);
  //     }
  //     this.cdr.markForCheck();
  //   });
  // }

  fileView(params) {
    console.log(params, 'test');

    this.view.emit(params);
  }
  getContext() {
    return {
      componentParent: this.component
    };
  }

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }
  gridReady(params: GridReadyEvent) {
    this.api = params.api;
    this.columnApi = params.columnApi;
    const deleColumn = this.columnApi.getColumn(1);
    if (this.viewMode) {
      this.columnApi.setColumnsVisible([deleColumn], false);
    }
  }
  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.api.sizeColumnsToFit();
    }

    // this.api.sizeColumnsToFit();
  }
  onCellKeyPress(event) {
    console.log(event.data, 'event');

    const keyPressed = event.event.key;
    if (keyPressed === 'Enter') {
      if (event.colDef.cellRenderer === 'deleteRowRenderer')
        this.openConfirmDialogForDelete(event.data);
      else if (
        event.colDef?.cellRendererFramework?.name === 'HyperLinkCellComponent'
      )
        this.fileView(event.data);
    }
  }

  openConfirmDialogForDelete(data: any) {
    console.log('1111');
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.discountProductCategoryMapping.deleteConfirmMessage'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.delete.emit([data.id]);
          this.dialog.closeAll();
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
