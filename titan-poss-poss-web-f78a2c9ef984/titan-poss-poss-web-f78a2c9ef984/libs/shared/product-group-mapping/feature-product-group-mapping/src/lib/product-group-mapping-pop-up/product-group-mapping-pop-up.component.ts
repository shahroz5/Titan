import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ProductGroupMappingConfig,
  ProductGroupMappingOption,
  SelectableProductGroup,
  ProductGroupMappingApplyResponse,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-product-group-mapping-pop-up',
  templateUrl: './product-group-mapping-pop-up.component.html',
  styleUrls: ['./product-group-mapping-pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGroupMappingPopUpComponent implements OnInit, OnDestroy {
  isViewMode: boolean;
  viewModeLabel: string;
  filterApplied = false;
  hasChange = false;
  @ViewChild('virtualScrollNewList')
  virtualScrollNewList: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollSelectedPG')
  virtualScrollSelectedPG: CdkVirtualScrollViewport;

  @Output() productTypeChange = new EventEmitter<string>();
  selectAllOfAddNewTab = false;
  selectAllOfSelectedTab = false;

  destroy$ = new Subject();

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;

  allProductGroup: SelectableProductGroup[] = [];
  selectedProuctGroups: SelectableProductGroup[] = [];
  prevSelectedProuctGroup: ProductGroupMappingOption[] = [];
  allProductGroupsWithOutFilter: SelectableProductGroup[] = [];

  plainLabel: string;
  othersLabel: string;
  miaLabel: string;
  studedLabel: string;

  productTypeList: SelectDropDownOption[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ProductGroupMappingConfig,
    private dialogRef: MatDialogRef<ProductGroupMappingPopUpComponent>,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.prevSelectedProuctGroup = this.config.selectedProductGroup;
    this.allProductGroup = this.config.allProductGroup;
    this.selectedProuctGroups = this.config.selectedProductGroup;
    this.isViewMode = this.config.isViewMode ? this.config.isViewMode : false;
    this.viewModeLabel = this.config.viewModeLabel;

    this.translate
      .get([
        'pw.prooductGroupMapping.plainLabel',
        'pw.prooductGroupMapping.othersLabel',
        'pw.prooductGroupMapping.studedLabel',
        'pw.prooductGroupMapping.miaLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.plainLabel =
          translatedMessages['pw.prooductGroupMapping.plainLabel'];
        this.othersLabel =
          translatedMessages['pw.prooductGroupMapping.othersLabel'];

        this.studedLabel =
          translatedMessages['pw.prooductGroupMapping.studedLabel'];

        this.miaLabel = translatedMessages['pw.prooductGroupMapping.miaLabel'];
        this.productTypeList = [
          { value: 'P', description: this.plainLabel },
          { value: 'M', description: this.miaLabel },
          { value: 'O', description: this.othersLabel },
          { value: 'S', description: this.studedLabel }
        ];
      });
  }

  onDropDownValueChange(changeEvent) {
    this.productTypeChange.emit(changeEvent.value);
    this.filterApplied = true;
  }
  setProductGroups(data: ProductGroupMappingOption[]) {
    if (this.filterApplied === false) {
      this.allProductGroupsWithOutFilter = data;
    }
    this.selectAllOfAddNewTab = false;
    this.allProductGroup = [];
    this.getSelectedProductGroupWithDescription(
      data,
      this.selectedProuctGroups
    );
    this.allProductGroup = this.getFilteredArray(
      data,
      this.selectedProuctGroups
    )
      .map(productGroup => ({
        id: productGroup.id,
        description: productGroup.description,
        isSelected: false
      }))
      .sort((productGroup1, productGroup2) =>
        productGroup1.id.toLocaleLowerCase() >
        productGroup2.id.toLocaleLowerCase()
          ? 1
          : -1
      );
    this.cdr.markForCheck();
  }

  selectAll(type: string, isSelected: boolean) {
    if (type === 'new') {
      this.allProductGroup = this.allProductGroup.map(productGroup => ({
        ...productGroup,
        isSelected: isSelected
      }));
    } else if (type === 'selected') {
      this.selectedProuctGroups = this.selectedProuctGroups.map(
        productGroup => ({
          ...productGroup,
          isSelected: isSelected
        })
      );
    }
  }

  selectionChange(
    productGroup: SelectableProductGroup,
    isSelected: boolean,
    type: string
  ) {
    if (productGroup.isSelected !== isSelected) {
      productGroup.isSelected = isSelected;
    }
    if (type === 'new') {
      this.selectAllOfAddNewTab =
        this.allProductGroup.length ===
        this.allProductGroup.filter(
          productGroupData => productGroupData.isSelected
        ).length;
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab =
        this.selectedProuctGroups.length ===
        this.selectedProuctGroups.filter(
          productGroupData => productGroupData.isSelected
        ).length;
    }
  }

  updateSelectedProductGroup(type: string) {
    this.hasChange = true;
    if (type === 'new') {
      if (this.allProductGroup.filter(data => data.isSelected).length) {
        const selectedproductGroupsId = this.selectedProuctGroups.map(
          productGroup => productGroup.id
        );
        this.selectedProuctGroups = this.selectedProuctGroups
          .concat(
            this.allProductGroup.filter(
              data =>
                data.isSelected && !selectedproductGroupsId.includes(data.id)
            )
          )
          .map(productGroup => ({
            ...productGroup,
            isSelected: false
          }))
          .sort((productGroup1, productGroup2) =>
            productGroup1.id.toLocaleLowerCase() >
            productGroup2.id.toLocaleLowerCase()
              ? 1
              : -1
          );
        this.allProductGroup = this.allProductGroup
          .filter(productGroup => !productGroup.isSelected)
          .map(data => ({
            ...data,
            isSelected: false
          }));

        this.selectAllOfSelectedTab = false;
        this.selectAllOfAddNewTab = false;
      }
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab = false;

      this.allProductGroup = this.allProductGroup
        .concat(this.selectedProuctGroups.filter(data => data.isSelected))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productGroup1, productGroup2) =>
          productGroup1.id.toLocaleLowerCase() >
          productGroup2.id.toLocaleLowerCase()
            ? 1
            : -1
        );
      this.selectedProuctGroups = this.selectedProuctGroups.filter(
        data => !data.isSelected
      );
    }
  }

  createResponse(): ProductGroupMappingApplyResponse {
    const updatedSelectedProductGroups = this.mapToProductGroupOptions(
      this.selectedProuctGroups
    );

    return {
      selectedProductGroups: updatedSelectedProductGroups,
      addedProductGroups: this.getFilteredArray(
        updatedSelectedProductGroups,
        this.prevSelectedProuctGroup
      ),
      removeProductGroups: this.getFilteredArray(
        this.prevSelectedProuctGroup,
        updatedSelectedProductGroups
      )
    };
  }

  applyProductGroups() {
    this.dialogRef.close({
      type: 'apply',
      data: this.createResponse()
    });
  }

  mapToProductGroupOptions(
    array: SelectableProductGroup[]
  ): ProductGroupMappingOption[] {
    return array.map(ele => ({
      id: ele.id,
      description: ele.description
    }));
  }

  getSelectedProductGroupWithDescription(array1, array2) {
    if (this.filterApplied) {
      const array2Ids: string[] = array2.map(data => data.id);
      this.selectedProuctGroups = this.allProductGroupsWithOutFilter
        .filter(ele => array2Ids.includes(ele.id))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productGroup1, productGroup2) =>
          productGroup1.id.toLocaleLowerCase() >
          productGroup2.id.toLocaleLowerCase()
            ? 1
            : -1
        );
    } else {
      const array2Ids: string[] = array2.map(data => data.id);
      this.selectedProuctGroups = array1
        .filter(ele => array2Ids.includes(ele.id))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productGroup1, productGroup2) =>
          productGroup1.id.toLocaleLowerCase() >
          productGroup2.id.toLocaleLowerCase()
            ? 1
            : -1
        );
    }
  }
  getFilteredArray(
    array1: ProductGroupMappingOption[],
    array2: ProductGroupMappingOption[]
  ): ProductGroupMappingOption[] {
    const array2Ids: string[] = array2.map(data => data.id);
    return array1.filter(ele => !array2Ids.includes(ele.id));
  }

  close() {
    this.dialogRef.close({ type: 'close' });
  }

  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewList) {
      this.virtualScrollNewList.scrollToIndex(0);
    }
    if (type === 'selected' && this.virtualScrollSelectedPG) {
      this.virtualScrollSelectedPG.scrollToIndex(0);
    }
  }

  trackByProductGroup(_, productGroup: SelectableProductGroup) {
    return productGroup.description;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
