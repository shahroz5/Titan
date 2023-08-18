import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  RegionsData,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { RegionFacade } from '@poss-web/shared/region/data-access-region';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { RegionDetailsComponent } from '@poss-web/shared/region/ui-region-detail';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { RegionViewComponent } from '@poss-web/shared/region/ui-region-view';

@Component({
  selector: 'poss-web-region-listing',
  templateUrl: './region-listing.component.html'
})
export class RegionListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  regionDetailsList$: Observable<RegionsData[]>;
  destroy$ = new Subject<null>();
  regionDetailsCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  regionDetailsByCode: RegionsData;
  townSaveResponse$: Observable<RegionsData>;
  townEditResponse$: Observable<RegionsData>;
  totalElements: number;
  filterRegionDetailsList$: Observable<RegionsData[]>;
  regionError: CustomErrors = null;
  hasError$: Observable<CustomErrors>;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  isToggleChanged: boolean;

  orgCode: string;
  searchErrorCode: ErrorEnums;
  noDataFoundMessage: any;
  viewOnly: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private regionFacade: RegionFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profileDataFacade: ProfileDataFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.regionsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.regionsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  regionPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  filterPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  invalidSearch = false;

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngOnInit() {
    this.regionFacade.resetRegionDialogData();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.regionPageEvent.pageSize = pageSize;
        this.loadRegionDetails();
      });
    this.isLoading$ = this.regionFacade.getIsRegionListingLoading();
    this.regionDetailsList$ = this.regionFacade.getRegionDetailsListing();

    this.regionDetailsCount$ = this.regionFacade.getTotalRegionDetails();
    this.hasError$ = this.regionFacade.getError();
    this.searchErrorCode = ErrorEnums.ERR_LOC_003;
    this.regionDetailsCount$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.filterPageEvent.pageSize = data;
    });
    this.regionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
          console.log(error.code, 'errcode');
        }
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

    this.regionFacade
      .getRegionDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.region.successMsg');
          this.loadRegionDetails();
          // this.translate
          //   .get(key)
          //   .pipe(takeUntil(this.destroy$))
          //   .subscribe((translatedMessage: string) => {
          //   });
        }
      });

    this.regionFacade
      .getRegionDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.clearSearch();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.region.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.loadRegionDetails();
        }
      });

    this.regionFacade
      .getRegionByRegionCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.regionDetailsByCode = data;
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(RegionViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
            dialogRef.afterClosed().subscribe(close => {});
          } else {
            const dialogRef = this.dialog.open(RegionDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                data: this.regionDetailsByCode,
                mode: 'edit'
              },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe(formData => {
              if (formData) {
                this.alertPopupService
                  .open({
                    type: AlertPopupTypeEnum.CONFIRM,
                    message: 'pw.alertPopup.saveConfirmation'
                  })
                  .pipe(takeUntil(this.destroy$))
                  .subscribe((res: boolean) => {
                    if (res) {
                      this.regionFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });

    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
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

  search(searchValue: string) {
    if (fieldValidation.regionCodeField.pattern.test(searchValue)) {
      this.regionFacade.searchRegion(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error,
          hasBackdrop: true
        })
        .events.pipe(take(1))
        .subscribe();
    }
  }

  backArrow() {
    this.regionFacade.resetRegionDialogData();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  updateIsActive(event) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = event.event.checked
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.isToggleChanged = true;
          const toggleData: any = {
            regionCode: event.regionItem.regionCode,
            description: event.regionItem.description,
            configDetails: '',
            isActive: event.event.checked
          };
          this.regionFacade.editRegionFormDetails(toggleData);
        } else this.loadRegionDetails();
      });
  }

  getCorporateTownCode(regionCode: string) {
    this.viewOnly = false;
    if (regionCode !== 'NEW') {
      this.regionFacade.loadRegionByRegionCode(regionCode);
    } else {
      const data: RegionsData = {
        regionCode: '',
        description: '',
        configDetails: '',
        parentRegionCode: '',
        isActive: true,
        orgCode: this.orgCode
      };

      const dialogRef = this.dialog.open(RegionDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          data,
          mode: 'new'
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.regionFormDetails(result);
        }
      });
    }
  }

  paginate(pageEvent: PageEvent) {
    this.regionPageEvent = pageEvent;
    this.loadRegionDetails();
  }

  loadRegionDetails() {
    this.regionFacade.loadRegionDetailsListing(this.regionPageEvent);
  }

  regionFormDetails(data: any) {
    this.searchForm.reset();
    if (data.mode === 'new') {
      const formData = {
        regionCode: data.regionCode,
        description: data.description,
        configDetails: {},
        parentRegionCode: null,
        isActive: data.isActive,
        orgCode: this.orgCode
      };
      this.regionFacade.saveRegionFormDetails(formData);
    } else {
      const formData = {
        regionCode: data.regionCode,
        description: data.description,
        configDetails: {},
        isActive: data.isActive
      };
      this.regionFacade.editRegionFormDetails(formData);
    }
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

  // showTimerError(translatedMessage: string) {
  //   this.overlayNotification.show({
  //     type: OverlayNotificationType.TIMER,
  //     message: translatedMessage,
  //     hasClose: true,
  //     hasBackdrop: true
  //   });
  // }
  openViewPage(regionCode) {
    this.viewOnly = true;
    this.regionFacade.loadRegionByRegionCode(regionCode);
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadRegionDetails();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
