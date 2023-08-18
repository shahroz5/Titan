import { Injectable,EventEmitter } from '@angular/core';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ProductCategoryMappingServiceConfig,
  ProductCategoryMappingConfig,
  ProductCategory,
  ProductCategoryServiceResponse,
  ProductCategoryMappingServiceAbstraction,
  ProductCategoryMappingWithFormConfig,
  ProductCategoryWithFormServiceResponse,
  OverlayNotificationType
} from '@poss-web/shared/models';

import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ProductCategoryMappingPopUpComponent } from './pc-mapping-pop-up/pc-mapping-pop-up.component';
import { ProductCategoryMappingFacade } from '@poss-web/shared/product-category-mapping/data-access-pc-mapping';
import { PcMappingWithFormPopupComponent } from './pc-mapping-with-form-popup/pc-mapping-with-form-popup.component';

@Injectable()
export class ProductCategoryMappingPopUpService
  implements ProductCategoryMappingServiceAbstraction {
  initialProductCategoryMappingConfig: ProductCategoryMappingConfig = {
    selectedProductCategory: []
  };

  constructor(
    private dialog: MatDialog,
    private productCategoryMappingFacade: ProductCategoryMappingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(
    serviceConfig: ProductCategoryMappingServiceConfig
  ): EventEmitter<ProductCategoryServiceResponse> {
    const destroy$ = new Subject();
    this.productCategoryMappingFacade.loadReset();
    this.productCategoryMappingFacade.loadProductCategory();
    const initialProductCategoryMappingConfig = this
      .initialProductCategoryMappingConfig;

    const config = {
      ...initialProductCategoryMappingConfig,
      selectedProductCategory: serviceConfig.selectedProductCategory,
      allProductCategory: []
    };

    const width = '835px';

    const dialogref = this.dialog.open(ProductCategoryMappingPopUpComponent, {
      width: width,
      maxWidth: '90vw',
      autoFocus: false,
      data: config,
      disableClose: true
    });
    const event = new EventEmitter<ProductCategoryServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(componentInstance, destroy$);

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: ProductCategoryServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  public openProductCategoryMappingWithForm(
    serviceConfig: ProductCategoryMappingWithFormConfig
  ): EventEmitter<ProductCategoryWithFormServiceResponse> {
    const destroy$ = new Subject();
    this.productCategoryMappingFacade.loadReset();
    this.productCategoryMappingFacade.loadProductCategory();

    const dialogref = this.dialog.open(PcMappingWithFormPopupComponent, {
      width: '835px',
      maxWidth: '90vw',
      autoFocus: false,
      data: serviceConfig,
      disableClose: true
    });
    const event = new EventEmitter<ProductCategoryWithFormServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(componentInstance, destroy$);

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: ProductCategoryWithFormServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  commonDataFetch(
    componentInstance:
      | ProductCategoryMappingPopUpComponent
      | PcMappingWithFormPopupComponent,
    destroy$: Subject<any>
  ) {
    this.productCategoryMappingFacade
      .getProductCategory()
      .pipe(takeUntil(destroy$))
      .subscribe((ProductCategorys: ProductCategory[]) => {
        componentInstance.setProductCategory(
          ProductCategorys.map(productCategory => ({
            id: productCategory.productCategoryCode,
            description: productCategory.description
          }))
        );
      });

    this.productCategoryMappingFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error, destroy$);
        }
      });
  }

  errorHandler(error: CustomErrors, destroy$: Subject<any>) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(destroy$))
      .subscribe();
  }
}
