import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  MarketCodeEnums,
  OverlayNotificationType,
  MarketMaterialFactors,
  OverlayNotificationServiceAbstraction,
  MarketCodeDetails,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  MetalTypeEnum
} from '@poss-web/shared/models';
import { MarketCodeDetailsComponent } from '@poss-web/shared/market-code/ui-market-code-detail';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { MarketCodeFacade } from '@poss-web/shared/market-code/data-access-market-code';
import { MarketCodeViewComponent } from '@poss-web/shared/market-code/ui-market-code-view';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
@Component({
  selector: 'poss-web-market-code-listing',
  templateUrl: './market-code-listing.component.html'
})
export class MarketCodeListingComponent implements OnInit, OnDestroy {
  materialCodeEnums: MarketCodeEnums;
  status = new EventEmitter();
  dialogRef: any;
  destroy$ = new Subject<null>();
  se;
  searchValue = null;
  marketCodePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  isLoading$: Observable<boolean>;
  totalMarketCodesCount$: Observable<number>;
  marketCodesListing$: Observable<MarketCodeDetails[]>;
  marketMaterialFacators$: Observable<MarketMaterialFactors>;
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  hasMarketCodeDetailsSaved: boolean;
  hasMarketMaterialFactorsSaved: boolean;
  invalidSearch = false;
  noDataFoundMessage: string;
  viewOnly: boolean;
  ADD_EDIT_MARKET_CODE_PERMISSIONS =
    'MarketCode Master - Add/Edit MarketCode Master';
  constructor(
    private router: Router,
    private marketCodeFacade: MarketCodeFacade,
    private appsettingFacade: AppsettingFacade,
    public dialog: MatDialog,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    this.translate
      .get(['pw.entity.marketCodeEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.marketCodeEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }
  isActive: boolean;
  permissions$: Observable<any[]>;
  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.marketCodeFacade.resetMarketCodeDetails();
    this.hasError$ = this.marketCodeFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_LOC_017;
    this.marketCodeFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.marketCodePageEvent.pageSize = pageSize;
        this.loadMarketCodes();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.marketCodeFacade
      .getHasSavedMarketCodeDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved) {
          this.status.emit(hasSaved);
          this.showNotification('pw.marketCode.successMsg');
          this.loadMarketCodes();
        }
      });
    this.marketCodeFacade
      .getSavedMarketMaterialFacators()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasMarketMaterialFactorsSaved => {
        if (hasMarketMaterialFactorsSaved) {
          this.showNotification('pw.marketCode.successMsg');
          this.loadMarketCodes();
        }
      });
    this.marketCodeFacade
      .getHasUpdatedMarketMaterialFacators()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated) {
          this.showNotification('pw.marketCode.editSuccessMsg');
          this.loadMarketCodes();
        }
      });
    this.marketCodeFacade
      .getHasUpdatedMarketCodeDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.marketCode.editSuccessMsg');
          this.loadMarketCodes();
        }
      });
    this.marketCodeFacade
      .getHasStatusUpdate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.isActive) {
            this.showNotification('pw.marketCode.activeMsg');
          } else {
            this.showNotification('pw.marketCode.deactiveMsg');
          }
          this.loadMarketCodes();
        }
      });
    this.isLoading$ = this.marketCodeFacade.getIsLoading();
    this.totalMarketCodesCount$ = this.marketCodeFacade.getTotalMarketCodesCount();
    this.marketCodesListing$ = this.marketCodeFacade.getMarketCodes();

    this.marketCodeFacade
      .getMarketCodeDetailsBasedOnMarketCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.searchValue) {
            this.clearSearch();
          }
          const emitData = { ...data, status: this.status };
          if (this.viewOnly) {
            this.dialogRef = this.dialog.open(MarketCodeViewComponent, {
              width: '500px',
              height: 'auto',
              data: emitData,
              disableClose: true
            });
            this.dialogRef.afterClosed().subscribe();
          } else {
            this.dialogRef = this.dialog.open(MarketCodeDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: emitData,
              disableClose: true
            });
            this.dialogRef.componentInstance.marketDetails
              .pipe(takeUntil(this.destroy$))
              .subscribe(value => {
                this.createMarketCodeFormDetails(value);
              });
            this.dialogRef.afterClosed().subscribe(formData => {
              if (formData) {
                this.alertPopupService
                  .open({
                    type: AlertPopupTypeEnum.CONFIRM,
                    message: 'pw.alertPopup.saveConfirmation'
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((res: boolean) => {
                    if (res) {
                      this.createMarketCodeFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });
  }
  marketCodeDetailsStatus($event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.isActive = $event.isActive;
          this.marketCodeFacade.updateToggleButton({
            marketCode: $event.marketCode,
            updateMarketDetails: {
              isActive: $event.isActive
            }
          });
        } else this.loadMarketCodes();
      });
  }

  createMarketCodeFormDetails(data: any) {
    if (
      data.mode === MarketCodeEnums.new &&
      data.type === MarketCodeEnums.marketDetails
    ) {
      this.marketCodeFacade.saveMarketCodeDetails({
        marketCode: data.marketDetails.marketCode,
        description: data.marketDetails.description,
        isActive: true
      });
    } else if (
      data.mode === MarketCodeEnums.new &&
      data.type === MarketCodeEnums.materialTypes
    ) {
      this.marketCodeFacade.saveMarketMaterialFacators({
        marketCode: data.marketCode,
        marketMarkupFactors: [
          {
            addAmount: Number(data.materialTypes.goldAddAmount),
            deductAmount: Number(data.materialTypes.goldDeductAmount),
            markupFactor: Number(data.materialTypes.goldMarkupFactor),
            metalTypeCode: MetalTypeEnum.GOLD
          },
          {
            addAmount: Number(data.materialTypes.silverAddAmount),
            deductAmount: Number(data.materialTypes.silverDeductAmount),
            markupFactor: Number(data.materialTypes.silverMarkupFactor),
            metalTypeCode: MetalTypeEnum.SILVER
          },
          {
            addAmount: Number(data.materialTypes.platinumAddAmount),
            deductAmount: Number(data.materialTypes.platinumDeductAmount),
            markupFactor: Number(data.materialTypes.platinumMarkupFactor),
            metalTypeCode: MetalTypeEnum.PLATINUM
          },

          {
            addAmount: 0,
            deductAmount: 0,
            markupFactor: Number(data.materialTypes.f1MarkupFactor),
            metalTypeCode: MarketCodeEnums.f1
          },
          {
            addAmount: 0,
            deductAmount: 0,
            markupFactor: Number(data.materialTypes.f2MarkupFactor),
            metalTypeCode: MarketCodeEnums.f2
          }
        ]
      });
    } else if (data.mode === MarketCodeEnums.edit) {
      this.marketCodeFacade.updateMarketMaterialFactors({
        marketCode: data.marketCode,
        marketMarkupFactors: [
          {
            addAmount: Number(data.materialTypes.goldAddAmount),
            deductAmount: Number(data.materialTypes.goldDeductAmount),
            markupFactor: Number(data.materialTypes.goldMarkupFactor),
            metalTypeCode: MetalTypeEnum.GOLD
          },
          {
            addAmount: Number(data.materialTypes.silverAddAmount),
            deductAmount: Number(data.materialTypes.silverDeductAmount),
            markupFactor: Number(data.materialTypes.silverMarkupFactor),
            metalTypeCode: MetalTypeEnum.SILVER
          },
          {
            addAmount: Number(data.materialTypes.platinumAddAmount),
            deductAmount: Number(data.materialTypes.platinumDeductAmount),
            markupFactor: Number(data.materialTypes.platinumMarkupFactor),
            metalTypeCode: MetalTypeEnum.PLATINUM
          },

          {
            addAmount: 0,
            deductAmount: 0,
            markupFactor: Number(data.materialTypes.f1MarkupFactor),
            metalTypeCode: MarketCodeEnums.f1
          },
          {
            addAmount: 0,
            deductAmount: 0,
            markupFactor: Number(data.materialTypes.f2MarkupFactor),
            metalTypeCode: MarketCodeEnums.f2
          }
        ]
      });
    }
  }
  loadMarketCodes() {
    this.marketCodeFacade.loadMarketCodesLisitng(this.marketCodePageEvent);
  }

  validSearchInput(searchValue: string) {
    return fieldValidation.marketCodeField.pattern.test(searchValue);
  }
  search(searchValue) {
    if (fieldValidation.marketCodeField.pattern.test(searchValue)) {
      this.searchValue = searchValue;
      this.marketCodeFacade.searchMarketCode(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else this.invalidSearch = true;
  }
  clearSearch() {
    this.invalidSearch = false;
    this.loadMarketCodes();
  }
  paginate(pageEvent) {
    this.marketCodePageEvent = pageEvent;
    this.loadMarketCodes();
  }
  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
    this.marketCodeFacade.resetMarketCodeDetails();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getMarketCode(marketCode) {
    this.viewOnly = false;
    this.marketCodeFacade.loadMarketDetailsBasedOnMarketCode(marketCode);
  }
  openViewPage(marketCode) {
    this.viewOnly = true;
    this.marketCodeFacade.loadMarketDetailsBasedOnMarketCode(marketCode);
  }
  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    }
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
