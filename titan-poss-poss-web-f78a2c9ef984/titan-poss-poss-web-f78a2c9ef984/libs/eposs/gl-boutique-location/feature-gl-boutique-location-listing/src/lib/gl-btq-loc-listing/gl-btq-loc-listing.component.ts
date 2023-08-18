import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import {
  getConfigurationHomeRouteUrl,
  getGLBoutiqueLocatonConfigDetailRouteUrl
} from '@poss-web/shared/util-site-routes';
import {
  ConfigurationsMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  GlBoutiqueLocationList,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationEventType,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { GlBoutiqueLocationFacade } from '@poss-web/eposs/gl-boutique-location/data-access-gl-boutique-location';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ErrorEnums } from '@poss-web/shared/util-error';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-gl-btq-loc-listing',
  templateUrl: './gl-btq-loc-listing.component.html'
})
export class GlBtqLocListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  destroy$ = new Subject<null>();
  glBoutiquePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize: number;
  invalidSearch = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  isLoading$: Observable<boolean>;
  glBoutiqueListing$: Observable<GlBoutiqueLocationList[]>;
  glBoutiqueCount$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  glBoutiqueDetails: GlBoutiqueLocationList;
  noDataFoundMessage: any;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private glBoutiqueFacade: GlBoutiqueLocationFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.glBoutiquesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.glBoutiquesEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.glBoutiqueFacade.resetGlBoutiqueDetails();
    this.hasError$ = this.glBoutiqueFacade.getError();
    this.isLoading$ = this.glBoutiqueFacade.getIsLoading();
    this.glBoutiqueListing$ = this.glBoutiqueFacade.getGlBoutiqueListingListing();
    this.glBoutiqueCount$ = this.glBoutiqueFacade.getTotalglBoutiqueLocation();
    this.searchErrorCode = ErrorEnums.ERR_PAY_011;
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.glBoutiquePageEvent.pageSize = pageSize;
        this.loadGlBoutiqueList();
      });

    this.glBoutiqueFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
          console.log(this.errorHandler(error), 'checkkkk');
        }
      });

    this.glBoutiqueFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          console.log(saved, 'saved');
          this.loadGlBoutiqueList();
          this.showNotifications('pw.glBoutique.successMsg');
        }
      });
    this.glBoutiqueFacade
      .getIsEdited()
      .pipe(takeUntil(this.destroy$))
      .subscribe(edited => {
        if (edited) {
          console.log(edited, 'edited');
          this.loadGlBoutiqueList();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotifications('pw.glBoutique.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotifications('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotifications('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });
  }
  loadGlBoutiqueList() {
    this.glBoutiqueFacade.loadGlBoutiqueLocationListing(
      this.glBoutiquePageEvent
    );
  }

  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
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
            hasClose: true,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
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
  search(searchValue) {
    if (
      fieldValidation.locationCodeField.pattern.test(searchValue.toUpperCase())
    ) {
      console.log('pat true');

      this.invalidSearch = false;
      this.glBoutiqueFacade.searchGlBoutiqueLocation(searchValue.toUpperCase());
    } else {
      console.log('pat fal');
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadGlBoutiqueList();
  }

  getDetails(locationCode) {
    console.log(locationCode, 'locationCode');

    this.router.navigate([
      getGLBoutiqueLocatonConfigDetailRouteUrl(locationCode)
    ]);
  }
  openViewPage(locationCode) {
    this.router.navigate(
      [getGLBoutiqueLocatonConfigDetailRouteUrl(locationCode)],
      {
        queryParams: { showViewOnly: 'true' },
        queryParamsHandling: 'merge'
      }
    );
  }
  errorHandler(error: CustomErrors) {
    console.log(error.code, 'error');

    if (error.code === this.searchErrorCode) {
      return;
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  onChangeToggle(event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.searchForm.reset();
          this.glBoutiqueFacade.editGlBoutiqueLocationDetails({
            locationCode: event.locationCode,
            glCode: event.glCode,
            pifSeriesNo: event.pifSeriesNo,
            costCenter: event.costCenter,
            fitCode: event.fitCode,
            isActive: event.isActive
          });
        } else this.loadGlBoutiqueList();
      });
  }
  paginate(pageEvent: PageEvent) {
    this.glBoutiquePageEvent = pageEvent;
    this.loadGlBoutiqueList();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
