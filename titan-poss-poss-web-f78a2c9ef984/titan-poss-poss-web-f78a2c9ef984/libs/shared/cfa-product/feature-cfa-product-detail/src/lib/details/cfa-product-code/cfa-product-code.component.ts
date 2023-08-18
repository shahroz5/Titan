import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  CustomErrors,
  ProductType,
  OverlayNotificationServiceAbstraction,
  ItemTypesResponse,
  ProductGroupDetails,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventType,
} from '@poss-web/shared/models';
import { takeUntil, take } from 'rxjs/operators';
import { getCFAProductsRouteUrl } from '@poss-web/shared/util-site-routes';
import { TranslateService } from '@ngx-translate/core';
import { CFAProductCodeFacade } from '@poss-web/shared/cfa-product/data-access-cfa-product';
export enum ProductGroupEnum {
  NEW = 'new',
  PLAINSTUDDEDTYPE = 'PLAINSTUDDEDTYPE',
  PRICINGTYPE = 'PRICINGTYPE',
  HALLMARKINGEXCLUDEKARATTYPE = 'HALLMARK_KARAT'
}
@Component({
  selector: 'poss-web-cfa-product-code',
  templateUrl: './cfa-product-code.component.html'
})
export class CFAProductCodeComponent implements OnInit, OnDestroy {
  productGroupCode: string;
  CFAProduct$: Observable<ProductGroupDetails>;
  destroy$: Subject<null> = new Subject<null>();
  isSaving$: boolean;
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  productTypes$: Observable<ProductType[]>;
  itemTypes$: Observable<ItemTypesResponse[]>;
  plainStuddedType$: Observable<{ id: string; name: string }[]>;
  pricingType$: Observable<{ id: string; name: string }[]>;
  hallmarkingExcludeKaratType$: Observable<{ id: string; name: string }[]>;
  showViewOnly: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private CFAProductFacade: CFAProductCodeFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.overlayNotification.close();
    this.CFAProductFacade.resetCFAProducts();
    const fromPath = this.route.pathFromRoot[2];
    this.CFAProductFacade.loadProdcutTypes();
    this.CFAProductFacade.loadItemTypes();
    this.CFAProductFacade.loadPlainStuddedTypes(
      ProductGroupEnum.PLAINSTUDDEDTYPE
    );
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.showViewOnly = params?.showViewOnly ? true : false;
      this.productGroupCode = params?.productGroupCode;
    });
    this.CFAProductFacade.loadPricingType(ProductGroupEnum.PRICINGTYPE);
    this.CFAProductFacade.loadhallmarkingExcludeKaratTypes(ProductGroupEnum.HALLMARKINGEXCLUDEKARATTYPE);
    this.CFAProductFacade.loadCFAProductCode(this.productGroupCode);
    this.productTypes$ = this.CFAProductFacade.getProductTypes();
    this.itemTypes$ = this.CFAProductFacade.getItemTypes();
    this.plainStuddedType$ = this.CFAProductFacade.getPlainStuddedType();
    this.pricingType$ = this.CFAProductFacade.getPricingType();
    this.hallmarkingExcludeKaratType$ = this.CFAProductFacade.gethallmarkingExcludeKaratType();
    this.CFAProduct$ = this.CFAProductFacade.getCFAProductCodeBasedOnProductGroup();
    this.isLoading$ = this.CFAProductFacade.getIsLoading();

    this.CFAProductFacade.getCFAProductCodeBasedOnProductGroup()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroupDetails) => {
        if (productGroups.productGroupCode !== '' && productGroups)
          this.productGroupCode = productGroups.productGroupCode;
      });
    this.CFAProductFacade.getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.CFAProductFacade.getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showNotifications('pw.CFAProduct.UpdateSuccessMessage');
        }
      });
    this.CFAProductFacade.getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved) {
          this.showNotifications('pw.CFAProduct.saveSuccessMessage');
        }
      });
  }
  back() {
    this.router.navigate([getCFAProductsRouteUrl()]);
    this.CFAProductFacade.resetCFAProducts();
  }
  saveDetails(saveFormDetails) {
    if (!saveFormDetails.isActive) {
      this.showMessage('pw.global.masterDeactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            if (this.productGroupCode === ProductGroupEnum.NEW) {
              this.CFAProductFacade.saveCFAProducts(saveFormDetails);
            } else {
              this.CFAProductFacade.updateCFAProducts({
                productGroupCode: this.productGroupCode,
                data: saveFormDetails
              });
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
          .events.subscribe();
      });
  }
  showNotifications(key) {
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
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.router.navigate([getCFAProductsRouteUrl()]);
          });
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
}
