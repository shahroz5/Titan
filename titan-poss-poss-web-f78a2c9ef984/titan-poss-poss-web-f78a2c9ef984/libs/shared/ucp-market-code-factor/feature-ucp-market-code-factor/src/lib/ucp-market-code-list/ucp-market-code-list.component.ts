import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  AlertPopupServiceAbstraction,
  CustomErrors,
  AlertPopupTypeEnum,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  UcpMarketCode,
  ucpMarketCodeEnum,
  MarketCode,
  UcpProductGroup,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';

import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { UcpMarketCodeFactorFacade } from '@poss-web/shared/ucp-market-code-factor/data-access-ucp-market-code-factor';
import { UcpMarketCodeFactorViewComponent } from '@poss-web/shared/ucp-market-code-factor/ui-ucp-market-code-factor-view';
import { UcpMarketCodeDetailComponent } from '@poss-web/shared/ucp-market-code-factor/ui-ucp-market-code-factor-detail';

@Component({
  selector: 'poss-web-ucp-market-code-list',
  templateUrl: './ucp-market-code-list.component.html'
})
export class UcpMarketCodeListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  searchErrorCode: string;
  pageSizeOptions: number[];
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  searchInitialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  invalidSearch: boolean;
  ucpMarketCodeFactorList$: Observable<UcpMarketCode[]>;
  totalElements$: Observable<number>;
  error$: Observable<CustomErrors>;
  isLoading$: Observable<boolean>;
  destroy$ = new Subject<null>();
  noDataFoundMessage: string;
  viewOnly: boolean;
  marketCode: MarketCode[];
  productGroup: UcpProductGroup[];
  isSearch: boolean;
  searchValue: any;

  constructor(
    private dialog: MatDialog,
    private ucpMarketCodeFactorFacade: UcpMarketCodeFactorFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.ucpMarkerCodeFactorEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.ucpMarkerCodeFactorEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;

        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  ngOnInit() {
    this.ucpMarketCodeFactorFacade.loadReset();
    //this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.ucpMarketCodeFactorFacade.loadMarketCode();
    this.ucpMarketCodeFactorFacade.loadUcpProductGroup();
    this.searchErrorCode = ErrorEnums.ERR_PRO_003;
    this.isLoading$ = this.ucpMarketCodeFactorFacade.getIsloading();
    this.error$ = this.ucpMarketCodeFactorFacade.getError();

    this.ucpMarketCodeFactorFacade
      .getMarketCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(markets => (this.marketCode = markets));

    this.ucpMarketCodeFactorFacade
      .getUcpProductGroup()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ucpProductGroup => (this.productGroup = ucpProductGroup));

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSizeOptions => (this.pageSizeOptions = pageSizeOptions));

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pageSize => {
        this.initialPageEvent.pageSize = pageSize;
        this.searchInitialPageEvent.pageSize = pageSize;
        this.loadUcpMarketCodeList();
        this.ucpMarketCodeFactorList$ = this.ucpMarketCodeFactorFacade.getUcpMarketCodeFactorList();
        this.totalElements$ = this.ucpMarketCodeFactorFacade.getTotalElements();
      });
    this.ucpMarketCodeFactorFacade
      .getUcpMarketCodeFactor()
      .pipe(takeUntil(this.destroy$))
      .subscribe(ucpMarketCode => {
        if (ucpMarketCode) {
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(
              UcpMarketCodeFactorViewComponent,
              {
                width: '500px',
                height: 'auto',
                data: { ucpMarketCode: ucpMarketCode },
                disableClose: true
              }
            );
            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe();
          } else {
            const dialogRef = this.dialog.open(UcpMarketCodeDetailComponent, {
              width: '500px',
              height: 'auto',
              data: {
                ucpMarketCode: ucpMarketCode,
                marketCode: this.marketCode,
                productGroup: this.productGroup
              },
              disableClose: true
            });

            dialogRef
              .afterClosed()
              .pipe(takeUntil(this.destroy$))
              .subscribe(formData => {
                if (formData) {
                  this.alertPopupService
                    .open({
                      type: AlertPopupTypeEnum.CONFIRM,
                      message: 'pw.alertPopup.saveConfirmation'
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: boolean) => {
                      if (res) {
                        this.ucpMarketCodeFormDetails(formData);
                      }
                    });
                }
              });
          }
        }
      });

    this.ucpMarketCodeFactorFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved === true) {
          this.loadUcpMarketCodeList();
          this.showSuccessMessageNotification(
            'pw.ucpMarketFactor.saveSuccessMsg'
          );
        } else this.overlayNotification.close();
      });
    this.ucpMarketCodeFactorFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasUpdated => {
        if (hasUpdated === true) {
          this.clearSearch();
          this.showSuccessMessageNotification(
            'pw.ucpMarketFactor.updateSuccessMsg'
          );
        } else this.overlayNotification.close();
      });
    this.ucpMarketCodeFactorFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  search(searchValue) {
    this.isSearch = true;
    this.initialPageEvent = this.searchInitialPageEvent;
    this.searchValue = searchValue.toUpperCase();

    if (fieldValidation.marketCodeField.pattern.test(searchValue)) {
      this.ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorList(
        this.initialPageEvent,
        this.searchValue
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.invalidSearch = false;
    this.isSearch = false;
    this.searchForm.reset();
    this.searchValue = '';
    this.initialPageEvent = this.searchInitialPageEvent;
    this.loadUcpMarketCodeList();
  }
  loadUcpMarketCodeList() {
    this.ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorList(
      {
        pageIndex: this.initialPageEvent.pageIndex,
        pageSize: this.initialPageEvent.pageSize
      },
      this.searchValue
    );
  }
  loadPaginateData(event: PageEvent) {
    this.initialPageEvent = event;
    this.loadUcpMarketCodeList();
  }
  updateIsActive(obj) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.ucpMarketCodeFactorFacade.updateUcpMarketCodeFactor(obj);
        } else {
          this.loadUcpMarketCodeList();
        }
      });
  }

  addNew(id: string) {
    this.viewOnly = false;
    if (id !== ucpMarketCodeEnum.new) {
      this.ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorByCode(id);
    } else {
      const newFormData: UcpMarketCode = {
        id: ucpMarketCodeEnum.new,
        marketCode: '',
        ucpCfa: '',
        ucpFactor: ''
      };
      const dialogRef = this.dialog.open(UcpMarketCodeDetailComponent, {
        width: '500px',
        height: 'auto',
        data: {
          ucpMarketCode: newFormData,
          marketCode: this.marketCode,
          productGroup: this.productGroup
        },
        disableClose: true
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((res: boolean) => {
                if (res) {
                  this.ucpMarketCodeFormDetails(data);
                }
              });
          }
        });
    }
  }

  ucpMarketCodeFormDetails(data: any) {
    if (data.mode === ucpMarketCodeEnum.new) {
      this.ucpMarketCodeFactorFacade.saveUcpMarketCodeFactor({
        marketCode: data.marketCode,
        markupFactor: data.ucpFactor,
        productGroupCode: data.ucpCfa
      });
    } else if (data.mode === ucpMarketCodeEnum.edit) {
      this.ucpMarketCodeFactorFacade.updateUcpMarketCodeFactor({
        id: data.id,
        data: {
          marketCode: data.marketCode,
          markupFactor: data.ucpFactor,
          productGroupCode: data.ucpCfa
        }
      });
    }
  }
  openViewPage(complexityCode) {
    this.viewOnly = true;
    this.ucpMarketCodeFactorFacade.loadUcpMarketCodeFactorByCode(
      complexityCode
    );
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
          .events.subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      hasClose: true,
      error: error
    });
  }
  back() {
    // this.router.navigate([getProductAttributesDashboardUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.PRODUCT_PRICING_MENU_KEY
      }
    });
    this.ucpMarketCodeFactorFacade.loadReset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
