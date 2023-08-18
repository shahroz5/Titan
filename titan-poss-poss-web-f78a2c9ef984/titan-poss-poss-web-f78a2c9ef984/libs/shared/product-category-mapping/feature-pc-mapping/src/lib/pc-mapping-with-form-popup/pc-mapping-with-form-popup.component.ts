import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import {
  ProductCategoryMappingApplyResponse,
  ProductCategoryMappingFormType,
  ProductCategoryMappingOption,
  ProductCategoryMappingWithFormConfig,
  ProductGroupMappingOption,
  SelectableProductCategory,
  SelectDropDownOption,
  PublishedProductCategoryMappingOption
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poss-web-pc-mapping-with-form-popup',
  templateUrl: './pc-mapping-with-form-popup.component.html',
  styleUrls: ['./pc-mapping-with-form-popup.component.scss']
})
export class PcMappingWithFormPopupComponent implements OnInit, OnDestroy {
  @ViewChild('virtualScrollNewList')
  virtualScrollNewList: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollSelectedPG')
  virtualScrollSelectedPG: CdkVirtualScrollViewport;

  @ViewChild(MatTabGroup) matTab: MatTabGroup;

  @Output() productTypeChange = new EventEmitter<string>();
  selectAllOfAddNewTab = false;
  selectAllOfSelectedTab = false;

  destroy$ = new Subject();

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;

  form: FormGroup;
  productCategoryMappingFormType = ProductCategoryMappingFormType;
  allProductCategories: SelectableProductCategory[] = [];
  selectedProuctCategories: SelectableProductCategory[] = [];
  selectedPcs: SelectableProductCategory[] = [];
  prevSelectedCategory: SelectableProductCategory[] = [];
  allProductCategoriesWithOutFilter: SelectableProductCategory[] = [];

  plainLabel: string;
  othersLabel: string;
  miaLabel: string;
  studedLabel: string;
  filterApplied = false;
  productTypeList: SelectDropDownOption[];

  originalPublishedProductCategory: PublishedProductCategoryMappingOption[] = [];
  newPublishedProductCategory: PublishedProductCategoryMappingOption[] = [];
  viewPublishedProductCategory: PublishedProductCategoryMappingOption[] = [];
  publishTabEnable = false;
  hasChange = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public config: ProductCategoryMappingWithFormConfig,
    private dialogRef: MatDialogRef<ProductCategoryMappingWithFormConfig>,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit() {
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
    this.publishTabEnable = this.config?.publishTabEnable
      ? this.config?.publishTabEnable
      : false;

    this.originalPublishedProductCategory = this.config.publishedProductCategory;
    this.viewPublishedProductCategory = this.originalPublishedProductCategory?.map(
      obj => ({ ...obj })
    );
    if (this.publishTabEnable) {
      this.prevSelectedCategory = this.config.selectedProductCategories;
      this.selectedProuctCategories = this.config.selectedProductCategories.map(
        productCategory => ({
          id: productCategory.id,
          description: productCategory?.description,
          isSelected: false
        })
      );
    } else {
      this.prevSelectedCategory = [];
      this.selectedProuctCategories = [];
      this.selectedPcs = this.config.selectedProductCategories;
    }
  }
  onDropDownValueChange(changeEvent) {
    this.productTypeChange.emit(changeEvent.value);
  }
  setProductCategory(data: ProductCategoryMappingOption[]) {
    if (this.filterApplied === false) {
      this.allProductCategoriesWithOutFilter = data;
    }
    this.selectAllOfAddNewTab = false;
    this.allProductCategories = [];

    this.getSelectedProductGroupWithDescription(
      data,
      this.selectedProuctCategories
    );

    if (this.publishTabEnable) {
      this.allProductCategories = this.getFilteredArray(
        data,
        this.selectedProuctCategories
      ).map(productCategory => ({
        id: productCategory.id,
        description: productCategory?.description,
        isSelected: false
      }));
    } else {
      this.allProductCategories = this.getFilteredArray(
        data,
        this.selectedPcs
      ).map(productCategory => ({
        id: productCategory.id,
        description: productCategory?.description,
        isSelected: false
      }));
    }

    this.cdr.markForCheck();
  }

  getSelectedProductGroupWithDescription(array1, array2) {
    if (this.filterApplied) {
      const array2Ids: string[] = array2.map(data => data.id);
      this.selectedProuctCategories = this.allProductCategoriesWithOutFilter
        .filter(ele => array2Ids.includes(ele.id))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productCategory1, productCategory2) =>
          productCategory1?.id?.toLocaleLowerCase() >
          productCategory2?.id?.toLocaleLowerCase()
            ? 1
            : -1
        );
    } else {
      const array2Ids: string[] = array2.map(data => data.id);
      this.selectedProuctCategories = array1
        .filter(ele => array2Ids.includes(ele.id))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productCategory1, productCategory2) =>
          productCategory1?.id?.toLocaleLowerCase() >
          productCategory2?.id?.toLocaleLowerCase()
            ? 1
            : -1
        );
    }
  }

  getFilteredArray(
    array1: ProductGroupMappingOption[],
    array2: ProductGroupMappingOption[]
  ): ProductGroupMappingOption[] {
    if (this.publishTabEnable) {
      const array = array2.concat(this.originalPublishedProductCategory);
      const array2Ids: string[] = array.map(data => data.id);
      return array1.filter(ele => !array2Ids.includes(ele.id));
    } else {
      const array2Ids: string[] = array2.map(data => data.id);
      return array1.filter(ele => !array2Ids.includes(ele.id));
    }
  }

  change(event, id) {
    const elementsIndexOne = this.originalPublishedProductCategory.findIndex(
      element => element.id === id
    );

    const elementsIndex = this.viewPublishedProductCategory.findIndex(
      element => element.id === id
    );

    if (
      this.originalPublishedProductCategory[elementsIndexOne].isActive !==
      event.checked
    ) {
      this.viewPublishedProductCategory[elementsIndex].isActive = event.checked;
      this.newPublishedProductCategory.push(
        this.viewPublishedProductCategory[elementsIndex]
      );
    } else {
      const elementsIndexTwo = this.newPublishedProductCategory.findIndex(
        element => element.id === id
      );
      this.newPublishedProductCategory.splice(elementsIndexTwo, 1);
      this.viewPublishedProductCategory[elementsIndex].isActive = event.checked;
    }
    if (this.newPublishedProductCategory.length) {
      this.hasChange = true;
    } else {
      this.hasChange = false;
    }
  }

  selectAll(type: string, isSelected: boolean) {
    if (type === 'new') {
      this.allProductCategories = this.allProductCategories.map(
        productCategory => ({
          ...productCategory,
          isSelected: isSelected
        })
      );
    } else if (type === 'selected') {
      this.selectedProuctCategories = this.selectedProuctCategories.map(
        productCategory => ({
          ...productCategory,
          isSelected: isSelected
        })
      );
    }
  }

  selectionChange(
    productCategory: SelectableProductCategory,
    isSelected: boolean,
    type: string
  ) {
    if (productCategory.isSelected !== isSelected) {
      productCategory.isSelected = isSelected;
    }
    if (type === 'new') {
      this.selectAllOfAddNewTab =
        this.allProductCategories.length ===
        this.allProductCategories.filter(
          productCategoryData => productCategoryData.isSelected
        ).length;
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab =
        this.selectedProuctCategories.length ===
        this.selectedProuctCategories.filter(
          productCategoryData => productCategoryData.isSelected
        ).length;
    }
  }

  updateSelectedProductCategory(type: string) {
    if (this.publishTabEnable === true || type === 'new') {
      this.hasChange = true;
    } else {
      this.hasChange = false;
    }
    if (type === 'new') {
      if (this.allProductCategories.filter(data => data.isSelected).length) {
        const selectedproductCategoryId = this.selectedProuctCategories.map(
          productCategory => productCategory.id
        );
        this.selectedProuctCategories = this.selectedProuctCategories
          .concat(
            this.allProductCategories.filter(
              data =>
                data.isSelected && !selectedproductCategoryId.includes(data.id)
            )
          )
          .map(productCategory => ({
            ...productCategory,
            isSelected: false
          }))
          .sort((productCategory1, productCategory2) =>
            productCategory1?.id?.toLocaleLowerCase() >
            productCategory2?.id?.toLocaleLowerCase()
              ? 1
              : -1
          );
        this.allProductCategories = this.allProductCategories
          .filter(productCategory => !productCategory.isSelected)
          .map(data => ({
            ...data,
            isSelected: false
          }));

        this.selectAllOfSelectedTab = false;
        this.selectAllOfAddNewTab = false;
      }
    } else if (type === 'selected') {
      this.selectAllOfSelectedTab = false;

      this.allProductCategories = this.allProductCategories
        .concat(this.selectedProuctCategories.filter(data => data.isSelected))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productCategory1, productCategory2) =>
          productCategory1?.id?.toLocaleLowerCase() >
          productCategory2?.id?.toLocaleLowerCase()
            ? 1
            : -1
        );
      this.selectedProuctCategories = this.selectedProuctCategories.filter(
        data => !data.isSelected
      );
    }
  }

  applyProductCategories() {
    if (this.publishTabEnable) {
      this.dialogRef.close({
        type: 'apply',
        data: {
          productCategories: this.createResponse(),
          config: this.newPublishedProductCategory
        }
      });
    } else {
      if (this.form.valid && this.selectedProuctCategories.length) {
        this.dialogRef.close({
          type: 'apply',
          data: {
            productCategories: this.createResponse(),
            config: this.form.value
          }
        });
      } else {
        this.form.markAllAsTouched();
        this.form.markAsDirty();
      }
    }
  }
  createResponse(): ProductCategoryMappingApplyResponse {
    const updatedSelectedProductCategories = this.mapToProductGroupOptions(
      this.selectedProuctCategories
    );

    return {
      selectedProductCategories: updatedSelectedProductCategories,
      addedProductCategories: this.getFilteredArray(
        updatedSelectedProductCategories,
        this.prevSelectedCategory
      ),
      removeProductCategories: this.getFilteredArray(
        this.prevSelectedCategory,
        updatedSelectedProductCategories
      )
    };
  }

  mapToProductGroupOptions(
    array: SelectableProductCategory[]
  ): ProductGroupMappingOption[] {
    return array.map(ele => ({
      id: ele.id,
      description: ele.description
    }));
  }
  close() {
    this.dialogRef.close({ type: 'close' });
  }

  trackByProductCategory(_, productCategroy: SelectableProductCategory) {
    return productCategroy?.description;
  }

  scrollToTop(type: string) {
    if (type === 'new' && this.virtualScrollNewList) {
      this.virtualScrollNewList.scrollToIndex(0);
    }
    if (type === 'selected' && this.virtualScrollSelectedPG) {
      this.virtualScrollSelectedPG.scrollToIndex(0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
