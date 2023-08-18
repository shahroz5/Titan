import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocationMasterFacade } from '@poss-web/shared/location-master/data-access-location-master';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CustomErrors,
  EmitCopyLocationCodePayload,
  LocationListingData,
  MasterMenuKeyEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';

import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getLocationDetailsLocationRouteUrl,
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Component({
  selector: 'poss-web-location-listing',
  templateUrl: './location-listing.component.html',
  styleUrls: ['./location-listing.component.scss']
})
export class LocationListingComponent implements OnInit, OnDestroy {
  constructor(
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private router: Router,
    private locationMasterFacade: LocationMasterFacade,
    private translate: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.locationCode'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.locationCode']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessageNonVerifiedItems =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  noDataFoundMessageNonVerifiedItems: string;

  locationListingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  hasError$: Observable<CustomErrors>;
  destroy$ = new Subject<null>();
  isLoadingLocations$: Observable<boolean>;
  totalCount$: Observable<number>;
  locationListing$: Observable<LocationListingData[]>;
  pageSize: number[];

  searchErrorCode: string;
  invalidSearch = false;
  toggleStatus: boolean;
  resetSearch = false;

  ngOnInit(): void {
    this.loadInit();
    this.loadLocationList();
  }

  search(searchValue: string) {
    if (fieldValidation.alphaNumericField.pattern.test(searchValue)) {
      this.locationMasterFacade.searchLocation(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    // this.searchForm.reset();
    this.invalidSearch = false;
    this.loadLocationList();
  }

  loadDetailsPage(locationCode: string) {
    if (locationCode) {
      // this.locationService.getLocationDetailsByLocationCode('AAA');
      // this.locationMasterFacade.loadReset();
      this.router.navigate([getLocationDetailsLocationRouteUrl(locationCode)]);
    }
  }

  viewDetailsPage(locationCode: string) {
    if (locationCode) {
      // this.locationService.getLocationDetailsByLocationCode('AAA');
      // this.locationMasterFacade.loadReset();
      this.router.navigate([getLocationDetailsLocationRouteUrl(locationCode)], {
        queryParams: {
          showViewOnly: 'true'
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  loadInit() {
    this.searchErrorCode = ErrorEnums.ERR_LOC_001;

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        //this.locationListingPageEvent.pageSize = this.pageSize;
        // this.loadLocationList();
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationListingPageEvent.pageSize = data;
        this.loadLocationList();
      });

    this.locationListing$ = this.locationMasterFacade.getLocationListing();
    this.totalCount$ = this.locationMasterFacade.getTotalCount();
    this.isLoadingLocations$ = this.locationMasterFacade.getIsLoading();

    this.locationMasterFacade
      .getIsCopySuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        let key = '';
        if (data) {
          this.loadLocationList();
          key = 'pw.locationMasterNotification.locationCopySuccessful';
          this.showNotification(key);
        }
      });

    this.locationMasterFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved === true) {
          this.loadLocationList();
          if (this.toggleStatus) {
            this.showNotification('pw.locationMaster.locationActivated');
          } else {
            this.showNotification('pw.locationMaster.locationDeactivated');
          }
        }
      });

    this.locationMasterFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  addnew() {
    this.router.navigate([getLocationDetailsLocationRouteUrl('NEW')]);
  }

  loadLocationList() {
    this.locationMasterFacade.loadLocationListing(
      this.locationListingPageEvent
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  back() {
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  paginate(pageEvent: PageEvent) {
    this.locationListingPageEvent = pageEvent;
    this.loadLocationList();
  }

  copyLocation(copyLocationDetails: EmitCopyLocationCodePayload) {
    if (
      copyLocationDetails.newLocationCode !== null &&
      copyLocationDetails.oldLocationCode !== null
    ) {
      this.locationMasterFacade.copyLocationDetails(copyLocationDetails);
    }
  }

  updateIsActive($event) {
    this.toggleStatus = $event.isActive;
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.locationMasterFacade.updateLocationDetails($event);
        } else this.loadLocationList();
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

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
}
