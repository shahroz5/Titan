import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import {
  ProductGroup,
  OrderPaymentsRequest,
  ProductGroupMappingServiceAbstraction,
  OrderPaymentResponse,
  ProductGroupMappingFormType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ConfigTypeEnum,
  ShortcutServiceAbstraction,
} from '@poss-web/shared/models';
import { Subject, fromEvent } from 'rxjs';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import {
  SortDialogService,
  Column
} from '@poss-web/shared/components/ui-sort-dialog';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { OrderPaymentPopupComponent } from '../order-payment-popup/order-payment-popup.component';
import { PageEvent } from '@angular/material/paginator';

export const sortShortcutKey = 'OrderPaymentDetailsItemComponent.SORT';
const componentName = 'OrderPaymentDetailsItemComponent';

@Component({
  selector: 'poss-web-order-payment-details-item',
  templateUrl: './order-payment-details-item.component.html',
  styleUrls: ['./order-payment-details-item.component.scss']
})

export class OrderPaymentDetailsItemComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() formData;
  @Input() productGroups: ProductGroup[];
  @Input() orderPaymentConfigDetails: OrderPaymentResponse[];
  @Input() allOrderPaymentConfigDetails: OrderPaymentResponse[];
  @Input() orderPaymentConfig: any = [];
  @Input() isCleared: boolean;
  @Output() responseEvent = new EventEmitter<OrderPaymentsRequest>();
  @Output() removeEvent = new EventEmitter<OrderPaymentsRequest>();
  @Output() openLocationMappingPopUp = new EventEmitter<boolean>();

  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];
  @Input() selectedConfigDetails;

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() searchProductGroup = new EventEmitter<any>();
  @Output() clearProductGroupSearch = new EventEmitter<boolean>();

  selectedProductGroups = [];
  gridApi: GridApi;
  formGroup: FormGroup = new FormGroup({});
  parentForm: FormArray = new FormArray([]);
  addedProductGroups: any[] = [];
  removeProductGroups: any[] = [];
  configId: string;
  columnDefs = [];
  destroy$: Subject<null> = new Subject<null>();
  disableEdit = true;

  productGroupCodeLabel: string;
  frozenMetalRate: string;
  nonFrozenMetalRate: string;
  bestRate: string;

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

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  maxSortLimit = 1;

  @Output() sortEmitter = new EventEmitter<string[]>();

  sortData: Column[] = [];
  sortBy: string;
  sortOrder: string;
  sort: string[] = [];

  constructor(
    private translate: TranslateService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private sortService: SortDialogService,
    private shortcutService: ShortcutServiceAbstraction,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes && changes['productGroups']) ||
      changes['orderPaymentConfig'] ||
      changes['orderPaymentConfigDetails']
    ) {
      this.disableEdit = true;

      this.parentForm.clear();
      this.orderPaymentConfigDetails.forEach(item => {
        this.createFormControls(item);
      });
      if (this.gridApi) {
        this.gridApi.setRowData(this.orderPaymentConfigDetails);
      }
      this.cdr.markForCheck();
    }
    if (changes && changes['allOrderPaymentConfigDetails']) {
      this.selectedProductGroups = this.allOrderPaymentConfigDetails.map(
        selectedProductGroups => ({
          id: selectedProductGroups.productGroupCode,
          uuid: selectedProductGroups.id
        })
      );
    }
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });
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
        'pw.abOrderPaymentConfig.bestRate',
        'pw.abOrderPaymentConfig.frozenMetalRateFld',
        'pw.abOrderPaymentConfig.nonFrozenMetalRateFld',
        'pw.abOrderPaymentConfig.bestRateFld',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.abOrderPaymentConfig.productGroup'],
            field: 'productGroupCode',
            width: 150,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.abOrderPaymentConfig.description'],
            field: 'description',
            editable: false,
            width: 250,
            suppressMovable: true,
            valueFormatter: params => {
              let range = '';

              this.productGroups.forEach(productGroup => {
                if (
                  productGroup.productGroupCode === params.data.productGroupCode
                ) {
                  range = productGroup.description;
                }
              });

              return range;
            }
          },

          {
            headerName: translatedMessages['pw.abOrderPaymentConfig.frozenMetalRate'],
            field: 'metalRateFrozenPercent',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.abOrderPaymentConfig.nonFrozenMetalRate'],
            field: 'metalRateNonFrozenPercent',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: translatedMessages['pw.abOrderPaymentConfig.bestRate'],
            field: 'bestRatePercent',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          },
          {
            headerName: '',
            width: 40,
            minWidth: 40,
            maxWidth: 40,
            cellClass: 'pw-delete-icon-width',
            headerClass: 'pw-delete-icon-width',
            cellRenderer: 'deleteRowRenderer',
            suppressRowClickSelection: 'true',
            onCellClicked: this.remove.bind(this)
          }
        ];

        this.productGroupCodeLabel =
          translatedMessages['pw.abOrderPaymentConfig.productGroup'];

        this.frozenMetalRate =
          translatedMessages['pw.abOrderPaymentConfig.frozenMetalRateFld'];

        this.nonFrozenMetalRate =
          translatedMessages['pw.abOrderPaymentConfig.nonFrozenMetalRateFld'];

        this.bestRate =
          translatedMessages['pw.abOrderPaymentConfig.bestRateFld'];
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

  getComponents() {
    return {
      deleteRowRenderer: DeleteRowComponent
    };
  }

  onSave() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.responseEvent.emit(this.prepareResponse());
      this.parentForm.reset();
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

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  search(searchValue) {
    if (fieldValidation.productCodeField.pattern.test(searchValue.trim())) {
      this.searchProductGroup.emit(searchValue.trim());
    } else {
      this.gridApi.setRowData([]);
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.clearProductGroupSearch.emit();
  }

  prepareResponse() {
    const addArray = [];
    const updateArray = [];
    for (const value of this.parentForm.value) {
      if (value.id === '') {
        addArray.push({
          productGroupCode: value.productGroupCode,
          ruleDetails: {
            data: {
              metalRateFrozenPercent: value.metalRateFrozenPercent,
              metalRateNonFrozenPercent: value.metalRateNonFrozenPercent,
              bestRatePercent: value.bestRatePercent
            },
            type: ConfigTypeEnum.ORDER_AB_PAYMENT_CONFIG
          }
        });
      } else if (
        value.id !== '' &&
        value.id !== undefined &&
        value.id !== null
      ) {
        updateArray.push({
          rangeId: value.rangeId,
          id: value.id,
          ruleDetails: {
            data: {
              metalRateFrozenPercent: value.metalRateFrozenPercent,
              metalRateNonFrozenPercent: value.metalRateNonFrozenPercent,
              bestRatePercent: value.bestRatePercent
            },
            type: ConfigTypeEnum.ORDER_AB_PAYMENT_CONFIG
          }
        });
      }
    }

    return {
      addProducts: addArray,
      updateProducts: updateArray
    };
  }

  createFormControls(rowNode) {
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      description: new FormControl(rowNode.description),
      productGroupCode: new FormControl(
        rowNode.productGroupCode,
        this.fieldValidatorsService.requiredField(this.productGroupCodeLabel)
      ),
      metalRateNonFrozenPercent: new FormControl(
        rowNode.metalRateNonFrozenPercent,
        this.fieldValidatorsService.requiredField(this.nonFrozenMetalRate)
      ),
      metalRateFrozenPercent: new FormControl(
        rowNode.metalRateFrozenPercent,
        this.fieldValidatorsService.requiredField(this.frozenMetalRate)
      ),
      bestRatePercent: new FormControl(
        rowNode.bestRatePercent,
        this.fieldValidatorsService.requiredField(this.bestRate)
      ),
      id: new FormControl(rowNode.id)
    });

    this.parentForm.push(this.formGroup);
  }

  openLocationMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.openLocationMappingPopUp.emit(true);
    }
  }

  openProductGroupMapping() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.addedProductGroups = [];
      this.productGroupMappingServiceAbstraction
        .openProductGroupMappingWithForm({
          selectedProductGroup: this.selectedProductGroups,
          formType: ProductGroupMappingFormType.AB_ORDER_PAYMENT_CONFIG
        })
        .subscribe(res => {
          if (res) {
            if (res.type === 'apply') {
              if (
                !(
                  res.data.prouctGroups.addedProductGroups.length === 0 &&
                  res.data.prouctGroups.removeProductGroups.length === 0
                )
              ) {
                const addedProductGroups = [];
                const removeProductGroups = [];
                this.selectedProductGroups = this.selectedProductGroups.concat(
                  res.data.prouctGroups.addedProductGroups
                );
                for (const added of res.data.prouctGroups.addedProductGroups) {
                  addedProductGroups.push({
                    id: added.id,
                    description: added.description
                  });
                }
                for (const removed of res.data.prouctGroups
                  .removeProductGroups) {
                  removeProductGroups.push({
                    id: removed.id ? removed.id : '',
                    uuid: removed.uuid ? removed.uuid : ''
                  });
                }
                for (const productGroupCode of addedProductGroups) {
                  this.onAddProductGroupToGrid(
                    productGroupCode,
                    res.data.config
                  );
                }
                let removeArray = [];
                if (removeProductGroups.length) {
                  for (const removedItem of removeProductGroups) {
                    if (removedItem.uuid !== '') {
                      this.selectedProductGroups = this.selectedProductGroups.filter(
                        item => item.uuid === item.uuid
                      );
                      removeArray = removeProductGroups
                        .filter(item => item.uuid)
                        .map(item => item.uuid);
                    } else {
                      this.selectedProductGroups = this.selectedProductGroups.filter(
                        item => item.id === removedItem.id
                      );
                      this.gridApi.applyTransaction({
                        remove: [
                          this.getRowNodeByCellValue(removedItem.id).data
                        ]
                      });
                      this.gridApi.redrawRows();
                    }
                  }
                }
                const addArray = [];

                for (const value of this.parentForm.value) {
                  if (value.id === '') {
                    addArray.push({
                      productGroupCode: value.productGroupCode,
                      ruleDetails: {
                        data: {
                          metalRateFrozenPercent: value.metalRateFrozenPercent,
                          metalRateNonFrozenPercent:
                            value.metalRateNonFrozenPercent,
                          bestRatePercent: value.bestRatePercent
                        },
                        type: ConfigTypeEnum.ORDER_AB_PAYMENT_CONFIG
                      }
                    });
                  }
                }
                this.parentForm.markAsDirty();
                // this.responseEvent.emit({
                //   addProducts: addArray,
                //   removeProducts: removeArray
                // });
              }
            }
          }
        });
    }
  }

  getRowNodeByCellValue(value: string) {
    let rowNode = null;
    this.gridApi.forEachNode(node => {
      if (node.data.productGroupCode === value) {
        rowNode = node;
      }
    });

    return rowNode;
  }

  deleteFormControls(rowIndex) {
    this.parentForm.removeAt(rowIndex);
  }

  remove(params) {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      if (params.data.id === '') {
        this.gridApi.applyTransaction({ remove: [params.data] });
      } else {
        this.removeEvent.emit({
          removeProducts: [params.data.id]
        });
      }
      this.selectedProductGroups = this.selectedProductGroups.filter(
        data => data.id !== params.data.productGroupCode
      );

      this.deleteFormControls(params.rowIndex);
    }
  }

  onAddProductGroupToGrid(productGroupCode, configPercent) {
    const newItem = {
      metalRateNonFrozenPercent: configPercent.nonFrozenRate,
      metalRateFrozenPercent: configPercent.frozenRate,
      bestRatePercent: configPercent.bestRate,
      productGroupCode: productGroupCode.id,
      description: productGroupCode.description,
      id: ''
    };
    this.gridApi.applyTransaction({ add: [newItem] });
    this.createFormControls(newItem);
    this.cdr.markForCheck();
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.orderPaymentConfigDetails);
    this.gridApi.redrawRows();
  }

  onEdit() {
    if (
      this.selectedConfigDetails?.description &&
      !this.selectedConfigDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const dialogRef = this.dialog.open(OrderPaymentPopupComponent, {
        width: '500px',
        height: 'auto',
        disableClose: true,
        data: {
          selectedDetails:
            this.gridApi.getSelectedNodes().length === 1
              ? this.gridApi.getSelectedNodes()[0].data
              : null
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.updateRowData(res.data);
          this.updateFormControls(res.data);
          this.gridApi.deselectAll();
        }
      });
    }
  }

  updateRowData(res) {
    const updatedData = this.gridApi.getSelectedNodes();
    updatedData.forEach(rowNode => {
      rowNode.data.metalRateFrozenPercent = res.metalRateFrozenPercent
        ? res.metalRateFrozenPercent
        : rowNode.data.metalRateFrozenPercent;
      rowNode.data.metalRateNonFrozenPercent = res.metalRateNonFrozenPercent
        ? res.metalRateNonFrozenPercent
        : rowNode.data.metalRateNonFrozenPercent;
      rowNode.data.bestRatePercent = res.bestRatePercent
        ? res.bestRatePercent
        : rowNode.data.bestRatePercent;
      if (rowNode.data.id !== '') {
        this.removeProductGroups = this.removeProductGroups.concat([
          rowNode.data.id
        ]);
      }
      const res1 = this.gridApi.applyTransaction({ update: [rowNode.data] });
      this.gridApi.redrawRows({ rowNodes: res1.update });
    });
  }

  updateFormControls(res) {
    this.gridApi.getSelectedNodes().forEach(node => {
      this.parentForm.controls[node.rowIndex].patchValue({
        metalRateFrozenPercent: res.metalRateFrozenPercent
          ? res.metalRateFrozenPercent
          : this.parentForm.controls[node.rowIndex].get(
              'metalRateFrozenPercent'
            ).value,
        metalRateNonFrozenPercent: res.metalRateNonFrozenPercent
          ? res.metalRateNonFrozenPercent
          : this.parentForm.controls[node.rowIndex].get(
              'metalRateNonFrozenPercent'
            ).value,
        bestRatePercent: res.bestRatePercent
          ? res.bestRatePercent
          : this.parentForm.controls[node.rowIndex].get('bestRatePercent').value
      });
    });
    this.parentForm.markAsDirty();
    this.cdr.markForCheck();
  }

  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
    }
  }
  onCellFocused(event) {
    this.isFocusing = true;
    this.focusedHeaderName = event.column.colDef.headerName;
    this.currentRowIndex = Number(event.rowIndex);
    this.currentRowField = event.column.colDef.field;
    var node = this.gridApi.getDisplayedRowAtIndex(this.currentRowIndex);
    this.currentRowInfo = this.gridApi.getValue(this.currentRowField, node);
  }

  focusOut(event) {
    this.isFocusing = false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
