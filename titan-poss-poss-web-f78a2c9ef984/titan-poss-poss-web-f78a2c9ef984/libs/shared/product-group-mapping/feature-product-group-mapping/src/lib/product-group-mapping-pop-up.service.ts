import { Injectable,EventEmitter } from '@angular/core';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ProductGroupMappingServiceConfig,
  ProductGroupMappingConfig,
  ProductGroup,
  ProductGroupMappingWithFormConfig,
  ProductGroupWithFormServiceResponse,
  ProductGroupServiceResponse,
  ProductGroupMappingServiceAbstraction,
  OverlayNotificationType,
} from '@poss-web/shared/models';

import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { ProductGroupMappingPopUpComponent } from './product-group-mapping-pop-up/product-group-mapping-pop-up.component';
import { ProductGroupMappingFacade } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import { ProductGroupMappingWithFormPopupComponent } from './product-group-mapping-with-form-popup/product-group-mapping-with-form-popup.component';

@Injectable()
export class ProductGroupMappingPopUpService
  implements ProductGroupMappingServiceAbstraction {
  initialProductGroupMappingConfig: ProductGroupMappingConfig = {
    selectedProductGroup: null,
    allProductGroup: null
  };

  constructor(
    private dialog: MatDialog,
    private productGroupMappingFacade: ProductGroupMappingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  public open(
    serviceConfig: ProductGroupMappingServiceConfig
  ): EventEmitter<ProductGroupServiceResponse> {
    const destroy$ = new Subject();
    this.productGroupMappingFacade.loadReset();
    this.productGroupMappingFacade.loadProductGroups();
    const initialProductGroupMappingConfig = this
      .initialProductGroupMappingConfig;

    const config = {
      ...initialProductGroupMappingConfig,
      selectedProductGroup: serviceConfig.selectedProductGroup,
      isViewMode: serviceConfig.isViewMode,
      viewModeLabel: serviceConfig.viewModeLabel,
      allProductGroup: []
    };

    let width = '80vw';
    if (serviceConfig.isViewMode) {
      width = '415px';
    }
    const dialogref = this.dialog.open(ProductGroupMappingPopUpComponent, {
      width: width,
      maxWidth: '90vw',
      autoFocus: false,
      data: config,
      disableClose: true
    });
    const event = new EventEmitter<ProductGroupServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(componentInstance, destroy$);

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: ProductGroupServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  public openProductGroupMappingWithForm(
    serviceConfig: ProductGroupMappingWithFormConfig
  ): EventEmitter<ProductGroupWithFormServiceResponse> {
    const destroy$ = new Subject();
    this.productGroupMappingFacade.loadReset();
    this.productGroupMappingFacade.loadProductGroups();

    const dialogref = this.dialog.open(
      ProductGroupMappingWithFormPopupComponent,
      {
        width: '80vw',
        maxWidth: '90vw',
        autoFocus: false,
        data: serviceConfig,
        disableClose: true
      }
    );
    const event = new EventEmitter<ProductGroupWithFormServiceResponse>();

    const componentInstance = dialogref.componentInstance;

    this.commonDataFetch(componentInstance, destroy$);

    dialogref
      .afterClosed()
      .pipe(takeUntil(destroy$))
      .subscribe((dailogResponse: ProductGroupWithFormServiceResponse) => {
        event.emit(dailogResponse);
        destroy$.next();
        destroy$.complete();
      });

    return event;
  }

  commonDataFetch(
    componentInstance:
      | ProductGroupMappingPopUpComponent
      | ProductGroupMappingWithFormPopupComponent,
    destroy$: Subject<any>
  ) {
    this.productGroupMappingFacade
      .getProductGroups()
      .pipe(takeUntil(destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        componentInstance.setProductGroups(
          productGroups.map(productGroup => ({
            id: productGroup.productGroupCode,
            description: productGroup.description
          }))
        );
      });

    this.productGroupMappingFacade
      .getError()
      .pipe(takeUntil(destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error, destroy$);
        }
      });

    componentInstance.productTypeChange
      .pipe(takeUntil(destroy$))
      .subscribe((filterType: string) => {
        this.productGroupMappingFacade.loadProductGroups(filterType);
      });

    //componentInstance.productTypeChange();
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
