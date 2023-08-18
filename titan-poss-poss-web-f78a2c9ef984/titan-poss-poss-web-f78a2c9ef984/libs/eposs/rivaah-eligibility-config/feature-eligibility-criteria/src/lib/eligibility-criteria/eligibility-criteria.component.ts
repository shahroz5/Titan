import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { RivaahConfigurationFacade } from '@poss-web/eposs/rivaah-eligibility-config/data-access-rivaah-configuration';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { ErrorGridPopupComponent } from '@poss-web/shared/components/ui-error-grid-popup';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors, 
  EligibilityConfigurationActionEnum, 
  EligibilityConfigurationEnum, 
  ListingActiveDeactiveStatus, 
  LovMasterEnum, 
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType, 
  ProductGroupMappingOption, 
  RivaahConfiguration, 
  RivaahEligibilityConfig, 
  RivaahEligibilityConfigRequest, 
  SaveProductGroups, 
  searchConfigRequest
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const errorCode = 'ERR-CONFIG-179';
@Component({
  selector: 'poss-web-eligibility-criteria',
  templateUrl: './eligibility-criteria.component.html'
})

export class EligibilityCriteriaComponent implements OnInit, OnDestroy {
  rivaahEligibilityConfig$: Observable<RivaahEligibilityConfig[]>;
  ruleId= '1';
  destroy$ = new Subject<null>();
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  loadPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  noDataFoundMessage: any;
  occasion = [];
  eleventhDigit = [];
  rivaahEligibilityConfig = [];
  productGroup: any;
  productCategory: any;
  elevenDigit: any;
  productGroupCode: any;
  title: any;
  subtitle: any;
  productGroups = [];
  mappedProductCategories = [];
  allProductCategories = [];

  selectedProductGroups$: Observable<ProductGroupMappingOption[]>;
  hasUpdatedProductGroups = false;

  selectedGroups: Subject<any> = new Subject<any>();
  observable = this.selectedGroups.asObservable();
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public rivaahConfigurationFacade: RivaahConfigurationFacade,
    public appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private lovDataService: LovDataService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.rivaahConfigurationFacade.loadReset();
    this.rivaahConfigurationFacade.loadProductCategory();
    this.selectedProductGroups$ = this.rivaahConfigurationFacade.getProductGroups();
    this.isLoading$ = this.rivaahConfigurationFacade.getIsloading();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => {
        this.pageSizeOptions = pageSizeOptions
      });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.loadPageEvent.pageSize = pageSize;
        this.loadRivaahEligibility();
        this.rivaahEligibilityConfig$ = this.rivaahConfigurationFacade.getRivaahEligibilityConfiguration();
        this.totalElements$ = this.rivaahConfigurationFacade.getTotalElements();
      });

    this.translate
      .get([
        'pw.rivaahEligibilityConfig.productGroupCode',
        'pw.rivaahEligibilityConfig.productCategoryCode',
        'pw.rivaahEligibilityConfig.title',
        'pw.rivaahEligibilityConfig.subtitle',
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.productCategory = translatedMessages['pw.rivaahEligibilityConfig.productCategoryCode'];
        this.elevenDigit = translatedMessages['pw.rivaahEligibilityConfig.11thDigit'];
        this.productGroupCode = translatedMessages['pw.rivaahEligibilityConfig.productGroupCode'];
        this.title = translatedMessages['pw.rivaahEligibilityConfig.title'];
        this.subtitle = translatedMessages['pw.rivaahEligibilityConfig.subtitle'];
      });

    this.rivaahEligibilityConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rivaahEligibilityConfigArray => {
        this.rivaahEligibilityConfig = [];
        if (rivaahEligibilityConfigArray) {
          for (const item of rivaahEligibilityConfigArray)
            this.rivaahEligibilityConfig.push({
              id: item.id,
              isNew: item.isNew,
              isConcate: item.isConcate,
              productGroupCount: item.productGroupCount,
              productCategoryCode: item.productCategoryCode,
              isActive: item.isActive,
              grammage: item.grammage,
              eleventhDigit: item.eleventhDigit,
              occasion: item.occasion
            });
        }
      });

    this.rivaahConfigurationFacade
      .getIsRivaahCreated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRivaahCreated => {
        if (isRivaahCreated === true) {
          this.showSuccessMessageNotification(
            'pw.rivaahEligibilityConfig.rivaahEligilityCreateMsg'
          );
          this.loadRivaahEligibility();
        } 
      });

    this.rivaahConfigurationFacade
      .getIsRivaahUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRivaahUpdated => {
        if (isRivaahUpdated === true) {
          this.showSuccessMessageNotification(
            'pw.rivaahEligibilityConfig.rivaahEligilityUpdateMsg'
          );
          this.loadRivaahEligibility();
        } 
      });

    this.rivaahConfigurationFacade
      .getIsRivaahDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRivaahDeleted => {
        if (isRivaahDeleted === true) {
          this.showSuccessMessageNotification(
            'pw.rivaahEligibilityConfig.rivaahEligilityDeleteMsg'
          );
          this.initialPageEvent = this.loadPageEvent;
          this.loadRivaahEligibility();
        } 
      });
    
    this.rivaahConfigurationFacade
      .getIsRivaahToggled()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isRivaahToggled => {
        if (isRivaahToggled === true) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showSuccessMessageNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showSuccessMessageNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
          this.loadRivaahEligibility();
        } 
      });

    this.rivaahConfigurationFacade
      .getProductCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: any) => {
        if (productCategories) {
          this.allProductCategories = productCategories.map(productCategory => ({
            id: productCategory.productCategoryCode,
            description: productCategory.productCategoryCode + ' - ' + productCategory.description
          }));
        }
      });

    this.rivaahConfigurationFacade
      .getMappedProductCategory()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedProductCategories: any) => {
        if (mappedProductCategories) {
          this.mappedProductCategories = mappedProductCategories.map(productCategory => ({
            id: productCategory.productCategoryCode,
            description: productCategory.productCategoryCode + ' - ' + productCategory.description
          }));
        }
      });

    this.lovDataService
      .getPaymentLovs(LovMasterEnum.OCCASION_TYPE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(occasion => {
        if (occasion) {
          this.occasion = occasion;
        }
      });

    this.lovDataService
      .getEngineConfigLovs(LovMasterEnum.RIVAAH_CARD)
      .pipe(takeUntil(this.destroy$))
      .subscribe(eleventhDigit => {
        if (eleventhDigit) {
          this.eleventhDigit = eleventhDigit;
        }
      });

    this.rivaahConfigurationFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        if (productGroups !== null) {
          this.selectedGroups.next(productGroups);
        }
      });

    this.rivaahConfigurationFacade
      .getHasProductsUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasProductsUpdated => {
        if (hasProductsUpdated) {
          this.hasUpdatedProductGroups = hasProductsUpdated;
          this.showSuccessMessageNotification('pw.rivaahEligibilityConfig.productGrpMapdMsg');
          this.loadRivaahEligibility();
        }
      });

      this.rivaahConfigurationFacade
        .getError()
        .pipe(takeUntil(this.destroy$))
        .subscribe(error => {
          if(error)
          {
            if ( error.code === errorCode ) {
              if (error.errorCause && error.errorCause?.length > 0) {
                const repCombinations = [];
                for (const combinations of error.errorCause) {
                  repCombinations.push({
                    productCategory: combinations.productCategoryCode,
                    productGroupCode: combinations.productGroupCode,
                    eleventhDigit: combinations.eleventhDigit,
                  });
                }
                const columnDefs = [
                  {
                    field: 'productCategory',
                    headerName: this.productCategory,
                    flex: 1
                  },
                  {
                    field: 'productGroupCode',
                    headerName: this.elevenDigit,
                    flex: 1
                  },{
                    field: 'eleventhDigit',
                    headerName: this.elevenDigit,
                    flex: 1
                  }
                ];
    
                this.callPopup(columnDefs, repCombinations);
              }
            }
            else {
              this.errorHandler(error,this.destroy$);
            }
          }
        });
  }

  loadRivaahEligibility() {
    this.rivaahConfigurationFacade.loadRivaahEligibilityConfiguration({
      configId: this.ruleId,
      ruleType: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY,
      pageIndex: this.initialPageEvent.pageIndex,
      pageSize: this.initialPageEvent.pageSize,
    });
    this.rivaahConfigurationFacade.loadMappedProductCategory({
      ruleId: this.ruleId,
      ruleType: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY
    });
  }

  saveEligibility(event) {
    if(event.configAction === EligibilityConfigurationActionEnum.CREATE)
    {
      this.rivaahConfigurationFacade.createRivaahEligibilityConfiguration(event.configRequest);
    }
    else if(event.configAction === EligibilityConfigurationActionEnum.UPDATE)
    {
      this.rivaahConfigurationFacade.updateRivaahEligibilityConfiguration(event.configRequest);
    }
    else if(event.configAction === EligibilityConfigurationActionEnum.DELETE)
    {
      this.rivaahConfigurationFacade.deleteRivaahEligibilityConfiguration(event.configRequest);
    }
    else if(
      event.configAction === EligibilityConfigurationActionEnum.ACTIVE ||
      event.configAction === EligibilityConfigurationActionEnum.INACTIVE
    )
    {
      this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.configAction === EligibilityConfigurationActionEnum.ACTIVE
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

            this.rivaahConfigurationFacade.toggleRivaahEligibilityConfigurationStatus(
              event.configRequest
            );
        } else this.loadRivaahEligibility();
      });
    }
  }

  loadPaginateData(pageEvent) {
    this.initialPageEvent = pageEvent;
    this.loadRivaahEligibility();
  }

  mapProductGroup(saveProductGroup: SaveProductGroups) {
    this.rivaahConfigurationFacade.updateProductGroupByProductId(saveProductGroup);
  }

  loadProductGroups(event) {
    this.hasUpdatedProductGroups = false;
    this.rivaahConfigurationFacade.loadMappedProductGroupsByProductId(event);
  }

  searchProductGroup(event) {
    this.initialPageEvent = this.loadPageEvent;
    this.rivaahConfigurationFacade.loadRivaahEligibilityConfiguration({
      configId: this.ruleId,
      ruleType: RivaahConfiguration.RIVAAH_CARD_ELIGIBILITY,
      productCategoryCode: 
        event.searchBy === EligibilityConfigurationEnum.PRODUCTCATEGORYCODE 
          ? event.searchValue
          : null,
      productGroupCode: 
        event.searchBy === EligibilityConfigurationEnum.PRODUCTGROUPCODE 
          ? event.searchValue
          : null,
      pageIndex : this.initialPageEvent.pageIndex,
      pageSize : this.initialPageEvent.pageSize,
    });
  }

  clearProductGroupSearch() {
    this.loadRivaahEligibility();
  }

  showSuccessMessageNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  callPopup(columnDefs, rowData) {
    const dialogRef = this.dialog.open(ErrorGridPopupComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data: {
        title: this.title,
        subTitle: this.subtitle,
        columnDefs: columnDefs,
        rowData: rowData,
        buttonText: 'OK'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.loadRivaahEligibility();
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
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
