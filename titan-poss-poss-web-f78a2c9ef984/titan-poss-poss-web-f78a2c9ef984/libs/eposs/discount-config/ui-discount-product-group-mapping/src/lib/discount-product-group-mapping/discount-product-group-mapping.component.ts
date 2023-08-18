import { MatDialog } from '@angular/material/dialog';
import {
  AlertPopupServiceAbstraction,
  Filter,
  AlertPopupTypeEnum,
  MappedDetails,
  ProductGroupMappingServiceAbstraction,
  ProductGroupServiceResponse,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationEventType
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import {
  Component,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  OnInit
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
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'poss-web-discount-product-group-mapping',
  templateUrl: './discount-product-group-mapping.component.html',
  styleUrls: ['./discount-product-group-mapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountProductGroupMappingComponent implements OnDestroy, OnInit {
  @Input() productGroups: any;
  @Input() totalElements: number;
  @Input() pageEvent: PageEvent;
  @Input() pageSizeOptions: number[] = [];
  @Input() minPageSize: number;
  @Input() productGroupTypes: string[] = [];
  @Input() selectedProductGroups: MappedDetails[] = [];
  @Input() discountDetails;
  @Input() discountWorkflow: boolean;
  @Input() tabType;

  @Output() loadData = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string[]>();
  @Output() add = new EventEmitter<string[]>();
  @Output() productGroupType = new EventEmitter<string>();
  @Output() activate = new EventEmitter<any>();
  @Output() enableWorkflowNotification = new EventEmitter<boolean>();

  component: DiscountProductGroupMappingComponent = this;
  filterForm: FormGroup;

  columnDefs = [];
  rowSelection = 'multiple';
  domLayout = 'autoHeight';
  rowHeight = 35;
  animateRows = true;
  api: GridApi;
  hasSelectedRow = false;

  productCategoriesForFilter: { [key: string]: Filter[] } = {};
  productTypeList: { value: string; description: any }[];
  plainLabel: any;
  othersLabel: any;
  studedLabel: any;
  miaLabel: any;
  allOptionsLabel: any;

  selectedConfigs: string[] = [];

  destroy$ = new Subject<null>();
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;

  type: string;
  searchValue: string;
  defaultColDef = {
    suppressMovable: true
  };
  notPublishedPg = [];
  publishedPg = [];

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountProductGroupMapping.productGroupLable',
        'pw.discountProductGroupMapping.descriptionLabel',
        'pw.prooductGroupMapping.plainLabel',
        'pw.prooductGroupMapping.othersLabel',
        'pw.prooductGroupMapping.studedLabel',
        'pw.prooductGroupMapping.miaLabel',
        'pw.prooductGroupMapping.allLabel'
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
              translatedMsg['pw.discountProductGroupMapping.productGroupLable'],
            field: 'productGroupCode'
          },

          {
            headerName:
              translatedMsg['pw.discountProductGroupMapping.descriptionLabel'],
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

        this.plainLabel = translatedMsg['pw.prooductGroupMapping.plainLabel'];
        this.othersLabel = translatedMsg['pw.prooductGroupMapping.othersLabel'];
        this.studedLabel = translatedMsg['pw.prooductGroupMapping.studedLabel'];
        this.miaLabel = translatedMsg['pw.prooductGroupMapping.miaLabel'];
        this.allOptionsLabel =
          translatedMsg['pw.prooductGroupMapping.allLabel'];
        this.productTypeList = [
          { value: 'P', description: this.plainLabel },
          { value: 'M', description: this.miaLabel },
          { value: 'O', description: this.othersLabel },
          { value: 'S', description: this.studedLabel }
        ];
        this.filterForm = new FormGroup({
          type: new FormControl(),
          searchValue: new FormControl()
        });
      });

    this.filterForm
      .get('type')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.type = data;

        this.productGroupType.emit(this.type);
      });
  }

  ngOnInit() {
    this.filterForm.patchValue({
      type: null
    });
  }

  openProductGroupMapping() {
    if (this.discountWorkflow && this.tabType === 'approval') {
      this.showMessage('pw.global.disableMsg');
    } else if (
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.productGroupMappingServiceAbstraction
        .open({
          selectedProductGroup: this.selectedProductGroups
        })
        .subscribe((res: ProductGroupServiceResponse) => {
          if (res) {
            if (res.type === 'apply') {
              this.filterForm.patchValue({
                type: null
              });
              if (res.data.addedProductGroups.length)
                this.add.emit(res.data.addedProductGroups.map(p => p.id));

              if (res.data.removeProductGroups.length)
                this.delete.emit(res.data.removeProductGroups.map(p => p.uuid));
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
          message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.delete.emit([data.id]);
            this.filterForm.reset();
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
            message: 'pw.discountProductGroupMapping.deleteAllConfirmMessage'
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
    this.loadMappedProductGroups();
  }

  loadMappedProductGroups() {
    this.loadData.emit({
      type: this.type,
      searchValue: this.searchValue,
      pageEvent: this.pageEvent
    });
  }

  selectionChange(id, status) {
    console.log(id, status, 'chevk selection change');
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
