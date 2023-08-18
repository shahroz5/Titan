import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { DeductionPercentagePopupComponent } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-popup';
import {
  DeleteRowComponent, InputValidatorComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import {
  AddRanges, ProductGroup, ProductGroupDeductionPayload, ProductGroupMappingOption, ProductGroupPayload, Ranges, RivaahExchangeConfig
} from '@poss-web/shared/models';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-product-group-mapping',
  templateUrl: './product-group-mapping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGroupMappingComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() currencyCode;
  @Input() productGroups: ProductGroup[] = [];
  @Input() pageSizeOptions: number[];
  @Input() ranges: Ranges[] = [];
  @Input() isRivaah;
  @Input() pageSize = 10;
  @Input() minPageSize;
  @Input() mappedGroups: any;
  @Input() isParentFormValid: boolean;
  @Input() pageEvent: PageEvent;
  @Output() productGroupDeduction = new EventEmitter<ProductGroupPayload>();
  @Output() deleteProductGroup = new EventEmitter<string>();
  @Output() emitGridData = new EventEmitter<ProductGroupMappingOption[]>();
  @Output() emitLocationMapping = new EventEmitter<boolean>();
  @Input() isLocationMapping: boolean;
  @Input() count: number;
  @Output() openPgPopup = new EventEmitter();
  @Output() updateProductData = new EventEmitter();
  @Output() emitSearchValue = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter();
  @ViewChild('searchBox', { static: true })

  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  productGroupCodes: string[] = [];
  addRanges: AddRanges[];
  rangeValidator: any;
  destroy$ = new Subject<null>();
  api: GridApi;
  domLayout = 'autoHeight';
  rowSelection = 'multiple';
  rowHeight = 35;
  columnDefs = [];
  objCategoryMappings = {};
  rangeFormGroup: FormGroup;
  rowData = [];
  emitData: ProductGroupMappingOption[] = [];
  animateRows = true;
  enableDeduction = false;
  productDeductionPayload: ProductGroupDeductionPayload[] = [];
  defaultColDef = {
    suppressMovable: true
  };
  component: any = this;

  isFocusing = false;
  focusedHeaderName: string;
  currentRowIndex: number;
  currentRowField: string;
  currentRowInfo: string;
  rivaahDiscountLabel: string;

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private currencySymbolService: CurrencySymbolService
  ) { }

  ngOnInit() {
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
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50,
            suppressMovable: true
          },
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
            width: 200,
            valueFormatter: params => {
              let range = '';
              this.mappedGroups.forEach(productGroup => {
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
            headerName:
              translatedMessages['pw.gePurityConfiguration.rivaahDiscountLabel'],
            field: 'rivaahAdditionalDiscount',
            suppressSizeToFit: true,
            resizable: true,
            width: 100,
            hide: !this.isRivaah
          }
        ];
      });

    this.ranges.forEach(ranges => {
      this.columnDefs.push({
        headerName:
          ranges.fromRange.toString() + ' to ' + ranges.toRange.toString(),
        field: ranges.id,
        suppressMovable: true,
        resizable: true,
        width: 200,
        cellEditor: 'inputValidator',
        valueFormatter: params => {
          if (typeof params.value === 'object') {
            if (params?.value?.value) {
              return params.value.value;
            } else {
              return '';
            }
          } else {
            return params.value;
          }
        }
      });
    });
    this.columnDefs.push({
      headerName: '',
      field: 'id',
      cellRenderer: 'deleteRowRenderer',
      width: 21,
      minWidth: 21,
      maxWidth: 21,
      cellClass: 'pw-delete-icon-width',
      headerClass: 'pw-delete-icon-width',
      suppressMovable: true
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          if (fieldValidation.productGroupCodeField.pattern.test(searchValue)) {
            this.emitSearchValue.emit(searchValue);
          } else {
            this.api.setRowData([]);
            this.productGroups = [];
          }
        } else this.clearSearch();
      });
  }

  clearSearch() {
    this.searchForm.reset();
    this.clearEvent.emit();
  }

  gridReady(params: GridReadyEvent) {
    this.api = params.api;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mappedGroups']) {
      this.rowData = this.mappedGroups;
      this.enableDeduction = false;
    }
  }

  getComponents() {
    return {
      inputValidator: InputValidatorComponent,
      deleteRowRenderer: DeleteRowComponent
    };
  }

  getContext() {
    return {
      componentParent: this.component
    };
  }

  addDeductionPercentage() {
    this.productDeductionPayload = [];
    this.api.getSelectedNodes().forEach(node => {
      this.productDeductionPayload.push({
        configDetails: {},
        id: node.data.id
      });
    });
    const dialogRef = this.dialog.open(DeductionPercentagePopupComponent, {
      width: '420px',
      data: this.ranges
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          this.productGroupCodes = [];

          this.productGroupDeduction.emit({
            updateGepProductGroups: this.productDeductionPayload,
            addRanges: data,
            removeProductGroups: []
          });
        }
      });
  }

  onEdit() {
    const selectedRow = this.api.getSelectedRows();
    const dialogRef = this.dialog.open(DeductionPercentagePopupComponent, {
      width: '800px',
      data: {
        ranges: this.ranges,
        isRivaah: this.isRivaah,
        rangesValue: this.api.getSelectedRows().length > 1 ? null : selectedRow[0]
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== undefined) {
          const popupData = [];
          const updateGepProductGroups = [];
          let rivaahExchangeConfigDto: RivaahExchangeConfig;
          Object.entries(data.deductionFormGroup).forEach(
            purityRange => {
              popupData.push({
                rangeId: purityRange[0],
                percentValue: purityRange[1]
              });
            }
          );

          rivaahExchangeConfigDto = data.rivaahFormGroup;

          this.api.getSelectedNodes().forEach(node => {
            updateGepProductGroups.push({
              configDetails: {},
              productGroupCode: node.data.productGroupCode
            });
          });
          this.updateProductData.emit({
            popupData: popupData,
            rivaahExchangeConfigDto: rivaahExchangeConfigDto,
            updateGepProductGroups: updateGepProductGroups
          });
        }
      });
  }

  openProductGroupMapping() {
    this.openPgPopup.emit();
  }

  onGridSizeChanged() {
    this.api.sizeColumnsToFit();
  }

  onRowSelected($event) {
    if (this.api.getSelectedNodes().length > 0) {
      this.enableDeduction = true;
    } else {
      this.enableDeduction = false;
    }
  }

  change(event: any) {
    this.api.paginationSetPageSize(event.pageSize);
    this.api.paginationGoToPage(event.pageIndex);
  }

  onCellClicked(clickEvent) {
    if (clickEvent.colDef.cellRenderer === 'deleteRowRenderer') {
      if (clickEvent.value) {
        this.deleteProductGroup.emit(clickEvent.data.id);
      } else {
        const selectedData = this.api.getSelectedRows();
        this.api.applyTransaction({ remove: selectedData });
        this.emitData = [];
        this.rowData = [];
        this.api.forEachNode(node => {
          this.emitData.push({
            id: node.data.productGroupCode,
            description: node.data.description
          });
        });
        this.emitGridData.emit(this.emitData);
      }
    }
  }

  openConfirmDialogForDelete(data: any) {
    if (data.id) {
      this.deleteProductGroup.emit(data.id);
    } else {
      const selectedData = this.api.getSelectedRows();
      this.api.applyTransaction({ remove: selectedData });
      this.emitData = [];
      this.rowData = [];
      this.api.forEachNode(node => {
        this.emitData.push({
          id: node.data.productGroupCode,
          description: node.data.description
        });
      });
      this.emitGridData.emit(this.emitData);
      this.searchForm.reset();
    }
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
  locationMapping() {
    this.emitLocationMapping.emit(true);
  }
}
