import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  ProductCategoryMappingConfig,
  ProductCategoryMappingOption,
  SelectableProductCategory,
  ProductCategoryMappingApplyResponse
} from '@poss-web/shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'poss-web-product-category-mapping-pop-up',
  templateUrl: './pc-mapping-pop-up.component.html',
  styleUrls: ['./pc-mapping-pop-up.component.scss']
})
export class ProductCategoryMappingPopUpComponent implements OnInit, OnDestroy {
  @ViewChild('virtualScrollNewList')
  virtualScrollNewList: CdkVirtualScrollViewport;

  @ViewChild('virtualScrollSelectedPC')
  virtualScrollSelectedPC: CdkVirtualScrollViewport;

  selectAllOfAddNewTab = false;
  selectAllOfSelectedTab = false;

  destroy$ = new Subject();

  itemSize = 44; //in Px
  minBufferPx = 8 * this.itemSize;
  maxBufferPx = 10 * this.itemSize;
  hasChange = false;
  allProductCategory: SelectableProductCategory[] = [];
  selectedProuctCategories: SelectableProductCategory[] = [];
  prevSelectedProuctCategory: ProductCategoryMappingOption[] = [];
  noDataFoundMessage;
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ProductCategoryMappingConfig,
    private dialogRef: MatDialogRef<ProductCategoryMappingPopUpComponent>,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.entity.productCategoryEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.productCategoryEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.prevSelectedProuctCategory = this.config.selectedProductCategory;
    this.selectedProuctCategories = this.config.selectedProductCategory;
  }

  setProductCategory(data: ProductCategoryMappingOption[]) {
    this.selectAllOfAddNewTab = false;
    this.allProductCategory = [];
    this.getSelectedProductCategoryWithDescription(
      data,
      this.selectedProuctCategories
    );
    this.allProductCategory = this.getFilteredArray(
      data,
      this.selectedProuctCategories
    ).map(productCategory => ({
      id: productCategory.id,
      description: productCategory?.description,
      isSelected: false
    }));
    this.cdr.markForCheck();
  }

  selectAll(type: string, isSelected: boolean) {
    if (type === 'new') {
      this.allProductCategory = this.allProductCategory.map(
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
        this.allProductCategory.length ===
        this.allProductCategory.filter(
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
    this.hasChange = true;

    if (type === 'new') {
      if (this.allProductCategory.filter(data => data.isSelected).length) {
        const selectedproductCategoriesId = this.selectedProuctCategories.map(
          productCategory => productCategory.id
        );
        this.selectedProuctCategories = this.selectedProuctCategories
          .concat(
            this.allProductCategory.filter(
              data =>
                data.isSelected &&
                !selectedproductCategoriesId.includes(data.id)
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
        this.allProductCategory = this.allProductCategory
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

      this.allProductCategory = this.allProductCategory
        .concat(this.selectedProuctCategories.filter(data => data.isSelected))
        .map(data => ({
          ...data,
          isSelected: false
        }))
        .sort((productCategory1, productCategory2) => {
          return productCategory1?.id?.toLocaleLowerCase() >
            productCategory2?.id?.toLocaleLowerCase()
            ? 1
            : -1;
        });
      this.selectedProuctCategories = this.selectedProuctCategories.filter(
        data => !data.isSelected
      );
    }
  }

  createResponse(): ProductCategoryMappingApplyResponse {
    const updatedSelectedProductCategories = this.mapToProductCategoryOptions(
      this.selectedProuctCategories
    );

    return {
      selectedProductCategories: updatedSelectedProductCategories,
      addedProductCategories: this.getFilteredArray(
        updatedSelectedProductCategories,
        this.prevSelectedProuctCategory
      ),
      removeProductCategories: this.getFilteredArray(
        this.prevSelectedProuctCategory,
        updatedSelectedProductCategories
      )
    };
  }

  applyProductCategories() {
    this.dialogRef.close({
      type: 'apply',
      data: this.createResponse()
    });
  }

  mapToProductCategoryOptions(
    array: SelectableProductCategory[]
  ): ProductCategoryMappingOption[] {
    return array.map(ele => ({
      id: ele.id,
      description: ele?.description
    }));
  }

  getSelectedProductCategoryWithDescription(array1, array2) {
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
  getFilteredArray(
    array1: ProductCategoryMappingOption[],
    array2: ProductCategoryMappingOption[]
  ): ProductCategoryMappingOption[] {
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
    if (type === 'selected' && this.virtualScrollSelectedPC) {
      this.virtualScrollSelectedPC.scrollToIndex(0);
    }
  }

  trackByProductCategory(_, productCategory: SelectableProductCategory) {
    return productCategory?.description;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
