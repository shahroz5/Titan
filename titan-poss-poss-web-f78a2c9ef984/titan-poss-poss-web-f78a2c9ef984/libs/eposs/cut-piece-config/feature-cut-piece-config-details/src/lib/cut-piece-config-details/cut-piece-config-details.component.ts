import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CutPieceConfigFacade } from '@poss-web/eposs/cut-piece-config/data-access-cut-piece-config';

import {
  AlertPopupServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  AlertPopupTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductCategory,
  ProductCategoryMappingFormType,
  ProductCategoryMappingList,
  ProductCategoryMappingServiceAbstraction,
  ProductCategoryWithFormServiceResponse,
  ProductGroupMappingOption,
  CustomErrors
} from '@poss-web/shared/models';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'poss-web-cut-piece-config-details',
  templateUrl: './cut-piece-config-details.component.html'
})
export class CutPieceConfigDetailsComponent implements OnInit, OnDestroy {
  configurationForm: FormGroup;
  destroy$ = new Subject<null>();
  configId = null;
  cutPieceConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  hasRemoved = false;
  hasSaved = false;
  totalElements$: Observable<number>;
  productCategories: Map<string, string> = new Map<string, string>();
  cutPieceConfigList: ProductCategoryMappingList[];
  isLoading$: Observable<boolean>;
  hasUpdated = false;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  totalCount = 0;
  mappedPcs: ProductGroupMappingOption[] = [];
  constructor(
    private router: Router,
    private productCategoryMappingServiceAbstraction: ProductCategoryMappingServiceAbstraction,
    private cutPieceConfigFacade: CutPieceConfigFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.productCategories = new Map();
    this.cutPieceConfigFacade.resetCutPieceConfig();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.cutPieceConfigPageEvent.pageSize = pageSize;
      });

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.cutPieceConfigFacade.loadProductCategories();
    this.totalElements$ = this.cutPieceConfigFacade.getTotalElements();
    this.cutPieceConfigFacade.loadCutPieceConfig();
    this.isLoading$ = this.cutPieceConfigFacade.getIsLoading();
    this.cutPieceConfigFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pc: ProductCategory[]) => {
        if (pc) {
          pc.forEach(prod => {
            this.productCategories.set(
              prod.productCategoryCode,
              prod.description
            );
          });
          if (this.configId) this.loadCutPieceConfigList();
        }
      });
    this.cutPieceConfigFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((configId: string) => {
        if (configId) {
          this.configId = configId;
          if (this.productCategories.values()) this.loadCutPieceConfigList();
        } else if (configId === ''){
          this.showErrorNotifications('Missing Configuration for configType: [TEP_CUT_PIECE]');
        }
      });

    this.cutPieceConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          if (this.hasSaved) {
            this.showNotifications('pw.cutPieceConfig.saveSuccessMsg');
          } else if (this.hasRemoved) {
            this.showNotifications('pw.cutPieceConfig.removeSuccessMsg');
          } else if (this.hasUpdated) {
            this.showNotifications('pw.cutPieceConfig.updateSuccessMsg');
          }
          this.loadCutPieceConfigList();
        }
      });

    this.cutPieceConfigFacade
      .getCutPieceConfigList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((configList: ProductCategoryMappingList[]) => {
        if (configList) {
          this.cutPieceConfigList = [];
          configList.forEach((data: ProductCategoryMappingList) => {
            this.cutPieceConfigList.push({
              cutPieceTepPercent: data.cutPieceTepPercent,
              productCategoryCode: data.productCategoryCode,
              id: data.id,
              description: this.productCategories.get(data.productCategoryCode)
            });
          });
        }
      });

    this.cutPieceConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((totalElements: number) => {
        if (totalElements !== this.totalCount) {
          this.totalCount = totalElements;
          this.cutPieceConfigFacade.loadSelectedPcs({
            configId: this.configId,
            pageIndex: 0,
            pageSize: this.totalCount
          });
        }
      });

    this.cutPieceConfigFacade
      .getSelectedPcs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pcs: ProductCategoryMappingList[]) => {
        if (pcs) {
          this.mappedPcs = [];
          pcs.forEach(data => {
            this.mappedPcs.push({
              uuid: data.id,
              id: data.productCategoryCode,
              description: this.productCategories.get(data.productCategoryCode)
            });
          });
        }
      });
  }
  loadCutPieceConfigList() {
    this.cutPieceConfigFacade.loadProductCategoryMapping({
      configId: this.configId,
      pageIndex: this.cutPieceConfigPageEvent.pageIndex,
      pageSize: this.cutPieceConfigPageEvent.pageSize
    });
  }

  search(searchValue) {
    this.cutPieceConfigFacade.searchProductCategoryCode({
      productCategoryCode: searchValue.toUpperCase(),
      configId: this.configId
    });
  }
  openProductCategoryMapping() {
    this.productCategoryMappingServiceAbstraction
      .openProductCategoryMappingWithForm({
        formType: ProductCategoryMappingFormType.CUT_PIECE,
        selectedProductCategories: this.mappedPcs
      })
      .subscribe((res: ProductCategoryWithFormServiceResponse) => {
        if (res) {
          const addedProductCategories = [];
          const cutPiecePercentage = res?.data?.config?.cutPiece;

          res.data.productCategories.addedProductCategories.forEach(groups => {
            addedProductCategories.push({
              cutPieceTepPercent: cutPiecePercentage,
              productCategoryCode: groups.id
            });
          });

          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: boolean) => {
              if (data) {
                this.hasRemoved = false;
                this.hasSaved = true;
                this.hasUpdated = false;
                this.cutPieceConfigFacade.saveCutPieceConfig({
                  configId: this.configId,
                  payload: {
                    addProductCategories: addedProductCategories,
                    updateProductCategories: [],
                    removeProductCategories: []
                  }
                });
              }
            });
        }
      });
  }
  paginate(pageEvent: PageEvent) {
    this.cutPieceConfigPageEvent = pageEvent;
    this.loadCutPieceConfigList();
  }
  showNotifications(key: string) {
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
  showErrorNotifications(key: string) {
    this.overlayNotification
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
  deleteProductCategory(id: string) {
    this.hasRemoved = true;
    this.hasSaved = false;
    this.hasUpdated = false;
    this.cutPieceConfigFacade.saveCutPieceConfig({
      configId: this.configId,
      payload: {
        addProductCategories: [],
        updateProductCategories: [],
        removeProductCategories: [id]
      }
    });
  }
  updateCutPieceConfig(updateCutPieceConfig) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.hasUpdated = true;
          this.hasSaved = false;
          this.hasRemoved = false;
          this.cutPieceConfigFacade.saveCutPieceConfig({
            configId: this.configId,
            payload: {
              addProductCategories: [],
              updateProductCategories: updateCutPieceConfig,
              removeProductCategories: []
            }
          });
        }
      });
  }

  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.TEP_CONFIGURATIONS_MENU_KEY
      }
    });
    this.cutPieceConfigFacade.resetCutPieceConfig();
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
