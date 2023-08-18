import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

import {
  ProductGroupMappingServiceAbstraction,
  WeightToleranceResponse,
  WeightToleranceRequest,
  ProductGroup,
  weightToleranceEnum,
  WeightRange,
  ProductGroupMappingFormType
} from '@poss-web/shared/models';
import { GridReadyEvent, GridApi } from 'ag-grid-community';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import {
  FieldValidatorsService,
  fieldValidation
} from '@poss-web/shared/util-field-validators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'poss-web-weight-tolerance-view',
  templateUrl: './weight-tolerance-view.component.html',
  styleUrls: ['./weight-tolerance-view.component.scss']
})
export class WeightToleranceViewComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() weightTolerance: WeightToleranceResponse[];
  @Input() weightRange: WeightRange[];
  @Input() formData;
  @Input() isCleared: boolean;
  @Input() productGroups: ProductGroup[];
  @Input() pageEvent: PageEvent;
  @Input() totalCount: number;
  @Input() pageSize: number[];

  @Output() paginator = new EventEmitter<PageEvent>();
  @Output() responseEvent = new EventEmitter<WeightToleranceRequest>();
  @Output() removeEvent = new EventEmitter<WeightToleranceRequest>();
  @Output() openLocationMappingPopUp = new EventEmitter<boolean>();
  @Output() searchProductGroup = new EventEmitter<boolean>();
  @Output() clearProductGroupSearch = new EventEmitter<boolean>();

  prevData = [];
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

  rangeIdLabel: string;
  toleranceLabel: string;
  productGroupCodeLabel: string;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    productCodeField: new FormControl()
  });
  pageSizeOptions = [];
  minPageSize: number;

  constructor(
    private translate: TranslateService,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fieldValidatorsService: FieldValidatorsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes[weightToleranceEnum.weightTolerance] ||
      changes[weightToleranceEnum.productGroups] ||
      changes[weightToleranceEnum.weightRange]
    ) {
      this.disableEdit = true;
      this.prevData = this.weightTolerance;

      this.parentForm.clear();

      this.weightTolerance.forEach(item => {
        this.createFormControls(item);
      });

      if (this.gridApi) {
        this.gridApi.setRowData(this.weightTolerance);
      }
      this.cdr.markForCheck();
    }
  }
  ngOnInit() {
    this.pageSizeOptions = this.pageSize;
    this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
      a < b ? a : b
    );
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.configId = param['_configId'];
        this.cdr.markForCheck();
      });
    this.translate
      .get([
        'pw.weightTolerance.productGroup',
        'pw.weightTolerance.description',
        'pw.weightTolerance.rangeWeightLabel',
        'pw.weightTolerance.toleranceLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.columnDefs = [
          {
            headerName: translatedMessages['pw.weightTolerance.productGroup'],
            field: 'productGroupCode',
            width: 150,
            suppressMovable: true
          },
          {
            headerName: translatedMessages['pw.weightTolerance.description'],
            field: 'descripton',
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
            headerName:
              translatedMessages['pw.weightTolerance.rangeWeightLabel'],
            suppressMovable: true,
            field: 'weightRange',
            singleClickEdit: true,
            resizable: true,
            width: 150,
            suppressSizeToFit: true,
            valueFormatter: params => {
              let range = '';

              this.weightRange.forEach(weightRange => {
                if (weightRange.id === params.data.weightRange) {
                  range = weightRange.range;
                }
              });
              return range;
            }
          },
          {
            headerName: translatedMessages['pw.weightTolerance.toleranceLabel'],
            field: 'tolerance',
            resizable: true,
            width: 150,
            suppressMovable: true,
            suppressSizeToFit: true
          }
        ];
        this.rangeIdLabel =
          translatedMessages['pw.weightTolerance.rangeWeightLabel'];
        this.toleranceLabel =
          translatedMessages['pw.weightTolerance.toleranceLabel'];
        this.productGroupCodeLabel =
          translatedMessages['pw.weightTolerance.productGroup'];
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.productCodeField;

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
    this.responseEvent.emit(this.edit());
  }

  onGridSizeChanged() {
    if (window.innerWidth >= 991) {
      this.gridApi.sizeColumnsToFit();
    }
  }

  search(searchValue) {
    if (fieldValidation.productCodeField.pattern.test(searchValue)) {
      this.searchProductGroup.emit(searchValue);
    } else {
      this.gridApi.setRowData([]);
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.clearProductGroupSearch.emit();
  }
  getAllRows() {
    const rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  edit() {
    const updateArray = [];
    let rowID;

    for (const value of this.parentForm.value) {
      this.weightRange.find((o, i) => {
        if (o.id === value.rangeId) {
          rowID = o.rowId;
          return; // stop searching
        }
      });
      updateArray.push({
        rangeId: value.rangeId.split('|')[0],
        rowId: value.rangeId.split('|')[1],
        productGroupCode: value.productGroupCode,
        id: value.id,
        ruleDetails: {
          data: {
            weightTolGrams: value.tolerance
          },
          type: weightToleranceEnum.ruleType
        }
      });
    }

    return {
      addProducts: [],
      updateProducts: updateArray
    };
  }
  createFormControls(rowNode) {
    this.formGroup = new FormGroup({});
    this.formGroup = new FormGroup({
      rangeId: new FormControl(
        rowNode.weightRange,
        this.fieldValidatorsService.requiredField(this.rangeIdLabel)
      ),
      rowId: new FormControl(rowNode.rowId),
      description: new FormControl(rowNode.description),
      tolerance: new FormControl(
        rowNode.tolerance,
        this.fieldValidatorsService.requiredField(this.toleranceLabel)
      ),
      productGroupCode: new FormControl(
        rowNode.productGroupCode,
        this.fieldValidatorsService.requiredField(this.productGroupCodeLabel)
      ),
      id: new FormControl(rowNode.id)
    });

    this.parentForm.push(this.formGroup);
  }
  openLocationMapping() {
    this.openLocationMappingPopUp.emit(true);
  }

  openProductGroupMapping() {
    this.addedProductGroups = [];
    this.productGroupMappingServiceAbstraction
      .openProductGroupMappingWithForm({
        formData: this.weightRange,
        formType: ProductGroupMappingFormType.WEIGHT_TOLERANCE
      })
      .subscribe(res => {
        if (res) {
          console.log(res);
          if (res.type === 'apply') {
            const addProducts: {
              productGroupCode: string;
              rangeId: string;
              rowId: 0;
              ruleDetails: {
                data: {
                  weightTolGrams: string;
                };
                type: string;
              };
            }[] = [];

            for (const added of res.data.prouctGroups.addedProductGroups) {
              addProducts.push({
                productGroupCode: added.id,
                rangeId: res.data.config.range.split('|')[0],
                rowId: res.data.config.range.split('|')[1],
                ruleDetails: {
                  data: {
                    weightTolGrams: res.data.config.tolerance
                  },
                  type: weightToleranceEnum.ruleType
                }
              });
            }

            this.responseEvent.emit({
              addProducts: addProducts
            });
          }
        }
      });
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
    if (params.data.id === '') {
      this.gridApi.applyTransaction({ remove: [params.data] });
    } else {
      this.removeEvent.emit({
        removeProducts: [params.data.id]
      });
    }

    this.prevData = this.prevData.filter(
      data => data.productGroupCode !== params.data.productGroupCode
    );

    this.deleteFormControls(params.rowIndex);
  }

  gridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.weightTolerance);
    this.gridApi.redrawRows();
  }

  updateRowData(res) {
    const updatedData = this.gridApi.getSelectedNodes();
    updatedData.forEach(rowNode => {
      rowNode.data.tolerance = res.tolerance
        ? res.tolerance
        : rowNode.data.tolerance;
      rowNode.data.weightRange = res.rangeId
        ? res.rangeId.split('|')[0]
        : rowNode.data.weightRange;

      rowNode.data.rowId = res.rangeId
        ? res.rangeId.split('|')[1]
        : rowNode.data.rowId;
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
        rangeId: res.rangeId
          ? res.rangeId
          : this.parentForm.controls[node.rowIndex].get('rangeId').value
      });

      this.parentForm.controls[node.rowIndex].patchValue({
        rowId: res.rowId
          ? res.rowId
          : this.parentForm.controls[node.rowIndex].get('rowId').value
      });

      this.parentForm.controls[node.rowIndex].patchValue({
        tolerance: res.tolerance
          ? res.tolerance
          : this.parentForm.controls[node.rowIndex].get('tolerance').value
      });
    });
    this.cdr.markForCheck();
  }
  onSelectionChanged(event) {
    if (this.gridApi.getSelectedNodes().length) {
      this.disableEdit = false;
    } else {
      this.disableEdit = true;
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
