import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  CorporateTown,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  StateSummary,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';
import {
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { CorporateTownFacade } from '@poss-web/shared/corporate-town/data-access-corporate-town';
import { CorporateTownDetailsComponent } from '@poss-web/shared/corporate-town/ui-corporate-town-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';

import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { Observable, Subject, fromEvent } from 'rxjs';
import { UserManagementFacade } from '@poss-web/shared/user-mgmt/data-access-user';
import { CorporateTownViewComponent } from '@poss-web/shared/corporate-town/ui-corporate-town-view';
@Component({
  selector: 'poss-web-corporate-town-listing',
  templateUrl: './corporate-town-listing.component.html'
})
export class CorporateTownListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  corporateTownDetailsList$: Observable<CorporateTown[]>;
  destroy$ = new Subject<null>();
  corporateTownCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  townDetailsByCode$: CorporateTown;
  townSaveResponse$: Observable<CorporateTown>;
  townEditResponse$: Observable<CorporateTown>;
  isSearching$: Observable<boolean>;
  stateDropdown: StateSummary[];
  searchElement: CorporateTown[] = [];
  noSearchFound: boolean;
  totalElements: number;
  filterTownDetailsList$: Observable<CorporateTown[]>;
  corporateTownError: CustomErrors = null;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  invalidSearch = false;
  countryName: string;
  noDataFoundMessage: any;
  viewOnly: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private corporateTownFacade: CorporateTownFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private userManagementFacade: UserManagementFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private profileDataFacade: ProfileDataFacade
  ) {
    this.translate
      .get(['pw.entity.corporateTownsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.corporateTownsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  corporateTownPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  statePageEvent: PageEvent = {
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
    this.userManagementFacade.loadUserProfile();
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.corporateTownPageEvent.pageSize = pageSize;
        this.loadCorporateTownDetails();
      });

    this.corporateTownFacade.resetTownDialogData();
    this.isSearching$ = this.corporateTownFacade.getIsSerchElements();
    this.isLoading$ = this.corporateTownFacade.getisCorporateTownListingLoading();
    this.corporateTownDetailsList$ = this.corporateTownFacade.getCorporateTownDetailsListing();
    this.corporateTownCount$ = this.corporateTownFacade.getTotalCorporateTownDetails();

    this.profileDataFacade
      .getUserCountryName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => {
        console.log(code, 'code');
        this.corporateTownFacade.loadStateListing(code);
      });

    this.corporateTownFacade.getStateDetailsListing().subscribe(result => {
      if (result) this.stateDropdown = result;
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

    this.corporateTownFacade
      .getTownDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotification('pw.corporateTown.successMsg');
          this.loadCorporateTownDetails();
        }
      });

    this.corporateTownFacade
      .getTownDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.corporateTown.editSuccessMsg');
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
            this.loadCorporateTownDetails();
          }
        }
      });

    this.corporateTownFacade
      .getTownDetailsByTownCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.townDetailsByCode$ = data;

          if (this.viewOnly) {
            const dialogRef = this.dialog.open(CorporateTownViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
            dialogRef.afterClosed().subscribe();
          } else {
            const dialogRef = this.dialog.open(CorporateTownDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                data,
                mode: 'edit',
                state: this.stateDropdown
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
                      this.corporateTownFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });

    this.corporateTownFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  // error(error: CustomErrors) {
  //   if (error) {
  //     this.corporateTownError = null;
  //     this.errorHandler(error);
  //   }
  // }

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
    if (fieldValidation.alphabetWithSpaceField.pattern.test(searchValue)) {
      this.corporateTownFacade.searchCorporateTown(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  openViewPage(townCode) {
    this.viewOnly = true;
    this.corporateTownFacade.loadTownDetailsByTownCode(townCode);
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  backArrow() {
    this.corporateTownFacade.resetTownDialogData();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  getCorporateTownCode(townCode: string) {
    this.viewOnly = false;
    if (townCode !== 'NEW') {
      // const code = Number(townCode);
      this.corporateTownFacade.loadTownDetailsByTownCode(townCode);
    } else {
      const data: CorporateTown = {
        townCode: '',
        stateId: '',
        description: '',
        stateName: '',
        isActive: true
      };

      const dialogRef = this.dialog.open(CorporateTownDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          data,
          mode: 'new',
          state: this.stateDropdown
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.corporateTownFormDetails(result);
        }
      });
    }
  }

  paginate(pageEvent: PageEvent) {
    this.corporateTownPageEvent = pageEvent;
    this.loadCorporateTownDetails();
  }

  loadCorporateTownDetails() {
    this.corporateTownFacade.loadCorporateTownListing(
      this.corporateTownPageEvent
    );
  }

  corporateTownFormDetails(data: any) {
    this.searchForm.reset();
    if (data.mode === 'new') {
      const formData = {
        description: data.description,
        isActive: data.isActive,
        stateId: data.stateId
      };
      this.corporateTownFacade.saveTownFormDetails(formData);
    } else {
      this.corporateTownFacade.editTownFormDetails(data);
    }
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
          const toggleUpdate = {
            townCode: event.corporateListItem.townCode,
            isActive: event.isActive
          };

          this.corporateTownFacade.editTownFormDetails(toggleUpdate);
        } else this.loadCorporateTownDetails();
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

  // showTimerError(translatedMessage: string) {
  //   this.overlayNotification.show({
  //     type: OverlayNotificationType.SIMPLE,
  //     message: translatedMessage,
  //     hasClose: true,
  //     hasBackdrop: true
  //   });
  // }
  clearSearch() {
    this.noSearchFound = false;
    this.searchElement = [];
    this.searchForm.reset();
    this.corporateTownFacade.resetTownDialogData();
    this.loadCorporateTownDetails();
    this.invalidSearch = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
