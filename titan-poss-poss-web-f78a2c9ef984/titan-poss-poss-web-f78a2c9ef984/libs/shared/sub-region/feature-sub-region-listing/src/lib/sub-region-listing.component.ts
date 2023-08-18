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
  SubRegion,
  CustomErrors,
  RegionsData,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
  OverlayNotificationEventRef
} from '@poss-web/shared/models';
import { SubRegionFacade } from '@poss-web/shared/sub-region/data-access-sub-region';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { SubRegionDetailsComponent } from '@poss-web/shared/sub-region/ui-sub-region-detail';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { SubRegionViewComponent } from '@poss-web/shared/sub-region/ui-sub-region-view';

@Component({
  selector: 'poss-web-sub-region-listing',
  templateUrl: './sub-region-listing.component.html'
})
export class SubRegionListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  subRegionDetailsList$: Observable<SubRegion[]>;
  destroy$ = new Subject<null>();
  subRegionDetailsCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  subRegionDetailsByCode: SubRegion;
  isSearching$: Observable<boolean>;
  searchElement: SubRegion[] = [];
  //noSearchFound: boolean;
  totalElements: number;
  filterSubRegionDetailsList$: Observable<SubRegion[]>;
  subRegionError: CustomErrors = null;
  regionDropdownList: RegionsData[];
  selectedDropdown: string = null;
  subRegionList = false;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  searchValue: any;
  isToggleChanged: boolean;
  invalidSearch = false;

  orgCode: string;
  noDataFoundMessage: any;
  regionSelect: any[];
  viewOnly: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private subRegionFacade: SubRegionFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private profileDataFacade: ProfileDataFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.subRegionsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.subRegionsEntity']
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

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });

  ngOnInit() {
    this.profileDataFacade
      .getOrgCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgCode => {
        this.orgCode = orgCode;
      });

    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.regionPageEvent.pageSize = pageSize;
        this.loadRegionDetails();
      });
    this.subRegionFacade.resetRegionDialogData();
    this.subRegionDetailsList$ = this.subRegionFacade.getSubRegionDetailsListing();
    this.isSearching$ = this.subRegionFacade.getIsSerchElements();
    this.isLoading$ = this.subRegionFacade.getIsRegionListingLoading();
    this.filterSubRegionDetailsList$ = this.subRegionFacade.getSubRegionDetailsListing();

    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.subRegionDetailsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.subRegionList = false;
        if (this.selectedDropdown && data.length === 0) {
          this.subRegionList = true;
        }
      });
    this.subRegionDetailsCount$ = this.subRegionFacade.getTotalRegionDetails();
    this.subRegionFacade.getRegionDetailsListing().subscribe(data => {
      if (data) {
        this.regionSelect = [];
        data.forEach(val => {
          this.regionSelect.push({
            value: val.regionCode,
            description: val.regionCode
          });

          // const region = {};
          // region['value'] = val.regionCode;
          // region['description'] = val.regionCode;
        });
        this.regionDropdownList = data;
      }
    });

    this.subRegionFacade
      .getRegionDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key = 'pw.region.subRegionSuccessMsg';
          this.showNotification(key);
          if (this.selectedDropdown) this.loadSubRegionDetails();
        }
      });

    this.subRegionFacade
      .getRegionDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.region.subRegionEditSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          if (this.searchForm.value.searchValue) {
            this.search(this.searchForm.value.searchValue);
          } else {
            this.loadSubRegionDetails();
          }
        }
      });

    this.subRegionFacade
      .getRegionByRegionCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.subRegionDetailsByCode = data;
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(SubRegionViewComponent, {
              width: '500px',
              height: 'auto',
              data: {
                editData: this.subRegionDetailsByCode,
                dropdown: this.regionDropdownList
              },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe();
          } else {
            if (this.subRegionError === null) {
              const dialogRef = this.dialog.open(SubRegionDetailsComponent, {
                width: '500px',
                height: 'auto',
                data: {
                  editData: this.subRegionDetailsByCode,
                  dropdown: this.regionDropdownList,
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
            } else {
              this.subRegionFacade
                .getError()
                .pipe(takeUntil(this.destroy$))
                .subscribe((error: CustomErrors) => {
                  this.error(error);
                });
            }
          }
        }
      });

    this.subRegionFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  error(error: CustomErrors) {
    if (error) {
      this.subRegionError = null;
      this.errorHandler(error);
    }
  }
  openViewPage(subRegonCode) {
    this.viewOnly = true;
    this.subRegionFacade.loadRegionByRegionCode(subRegonCode);
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
            parentRegionCode: event.subRegionItem.parentRegionCode,
            regionCode: event.subRegionItem.regionCode,
            description: event.subRegionItem.description,
            configDetails: '',
            isActive: event.event.checked
          };
          this.subRegionFacade.editRegionFormDetails(toggleData);
        } else {
          if (this.searchForm.value.searchValue) {
            this.isToggleChanged = false;
            this.search(this.searchForm.value.searchValue);
          } else {
            this.loadSubRegionDetails();
          }
        }
      });
  }

  search(searchedValue: string) {
    if (fieldValidation.subRegionCodeField.pattern.test(searchedValue)) {
      console.log(this.selectedDropdown, 'this.selectedDropdown ');

      this.subRegionFacade.searchSubRegion({
        regionCode: searchedValue.toUpperCase(),
        parentRegionCode: this.selectedDropdown ? this.selectedDropdown : null
      });
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_LOC_003) {
      return;
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.searchForm.value != null && this.isToggleChanged) {
            this.isToggleChanged = false;
            this.loadSubRegionDetails();
            this.search(this.searchForm.value.searchValue);
          } else if (this.isToggleChanged) {
            this.isToggleChanged = false;
            this.loadSubRegionDetails();
          }
        });
    }
  }

  backArrow() {
    // this.regionFacade.resetRegionDialogData();
    this.selectedDropdown = null;
    this.subRegionFacade.resetRegionDialogData();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  getSubRegionCode(regionCode: string) {
    this.viewOnly = false;
    this.subRegionList = false;
    if (regionCode !== 'NEW') {
      this.subRegionFacade.loadRegionByRegionCode(regionCode);
    } else {
      const data: SubRegion = {
        regionCode: '',
        description: '',
        configDetails: '',
        parentRegionCode: '',
        orgCode: this.orgCode,
        isActive: true
      };

      if (this.subRegionError === null) {
        const dialogRef = this.dialog.open(SubRegionDetailsComponent, {
          width: '500px',
          height: 'auto',
          data: {
            editData: data,
            dropdown: this.regionDropdownList,
            mode: 'new'
          },
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.regionFormDetails(result);
          }
        });
      } else {
        this.subRegionFacade
          .getError()
          .pipe(takeUntil(this.destroy$))
          .subscribe((error: CustomErrors) => {
            this.error(error);
          });
      }
    }
  }

  paginate(pageEvent: PageEvent) {
    this.regionPageEvent = pageEvent;
    this.loadSubRegionDetails();
  }

  loadSubRegionDetails() {
    this.subRegionFacade.loadSubRegionDetailsListing({
      parentRegionCode: this.selectedDropdown,
      pageIndex: this.regionPageEvent.pageIndex,
      pageSize: this.regionPageEvent.pageSize
    });
  }

  dropDownSelection(event: any) {
    this.searchValue = null;
    // this.noSearchFound = false;
    this.searchForm.reset();
    this.subRegionList = false;
    this.selectedDropdown = event.value;
    this.loadSubRegionDetails();
  }

  loadRegionDetails() {
    this.subRegionList = false;
    this.subRegionFacade.loadRegionDetailsListing();
  }

  regionFormDetails(data: any) {
    if (data.mode === 'new') {
      const formData = {
        regionCode: data.subRegionCode,
        description: data.description,
        configDetails: {},
        orgCode: this.orgCode,
        parentRegionCode: data.parentRegionCode,
        isActive: data.isActive
      };
      this.subRegionFacade.saveRegionFormDetails(formData);
    } else {
      const formData = {
        parentRegionCode: data.parentRegionCode,
        regionCode: data.subRegionCode,
        description: data.description,
        configDetails: '',
        isActive: data.isActive
      };
      this.subRegionFacade.editRegionFormDetails(formData);
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
  clearSearch() {
    this.searchValue = null;
    // this.noSearchFound = false;
    this.searchElement = [];
    this.subRegionList = false;
    this.searchForm.reset();
    this.subRegionFacade.resetRegionDialogData();
    this.loadSubRegionDetails();
    this.invalidSearch = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
