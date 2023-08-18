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
import { takeUntil, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  CountriesDetails,
  stateEnum,
  StateData,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventType,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  ListingActiveDeactiveStatus,
  OverlayNotificationType,
} from '@poss-web/shared/models';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { StateDetailsComponent } from '@poss-web/shared/state/ui-state-detail';
import { StateFacade } from '@poss-web/shared/state/data-access-state';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { StateViewComponent } from '@poss-web/shared/state/ui-state-view';
@Component({
  selector: 'poss-web-state-listing',
  templateUrl: './state-listing.component.html'
})
export class StateListingComponent implements OnInit, AfterViewInit, OnDestroy {
  stateList$: Observable<StateData[]>;
  destroy$ = new Subject<null>();
  stateTotalCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  isSearching$: Observable<boolean>;
  searchErrorCode: string;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  countryDropdown: CountriesDetails[];
  hasError$: Observable<CustomErrors>;
  invalidSearch: boolean;
  noDataFoundMessage: string;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private stateFacade: StateFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.stateEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.stateEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  statePageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  viewMode = false;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  ngOnInit() {
    this.stateFacade.resetStateDialogData();
    this.searchErrorCode = ErrorEnums.ERR_LOC_008;
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.statePageEvent.pageSize = pageSize;
        this.loadStateList();
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

    this.stateFacade.loadCountriesListing();
    this.isSearching$ = this.stateFacade.getIsSerchElements();
    this.isLoading$ = this.stateFacade.getIsStateListingLoading();
    this.stateList$ = this.stateFacade.getStateDetailsListing();
    this.stateTotalCount$ = this.stateFacade.getTotalStateDetails();

    this.stateFacade
      .getCountryDetailsListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(countires => {
        if (countires) {
          this.countryDropdown = countires;
        }
      });

    this.stateFacade
      .getStateDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadStateList();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.states.successMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });

    this.stateFacade
      .getStateDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadStateList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.states.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          this.clearSearch();
        }
      });

    this.stateFacade
      .getStateByStateCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (this.viewMode) {
            const dialogRef = this.dialog.open(StateViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
          } else {
            const dialogRef = this.dialog.open(StateDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: {
                data: data,
                countryDropdown: this.countryDropdown
              },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe(formData => {
              if (formData) {
                this.stateFormDetails(formData);
              }
            });
          }
        }
      });
    this.hasError$ = this.stateFacade.getError();
    this.stateFacade
      .getIsActiveToggle()
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => {
        if (d) {
          this.loadStateList();
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;
        }
      });
    this.stateFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
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

  updateToggleValue(toggleValue) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.toggleStatus = toggleValue.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;

          this.stateFacade.updateIsactive({
            stateId: toggleValue.stateId,
            isActive: toggleValue.isActive
          });
        } else {
          this.loadStateList();
        }
      });
  }

  search(searchValue: string) {
    if (fieldValidation.stateField.pattern.test(searchValue)) {
      this.stateFacade.searchState(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      // We are not showing error for location not found from search.
      return;
    }

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
    this.stateFacade.resetStateDialogData();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  addNew(stateId) {
    this.viewMode = false;
    if (stateId !== stateEnum.NEW) {
      this.stateFacade.loadStateByStateCode(stateId);
    } else {
      const data: any = {
        countryCode: '',
        description: '',
        stateCode: 'NEW',
        isUnionTerritory: false
      };

      const dialogRef = this.dialog.open(StateDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: {
          data: data,
          countryDropdown: this.countryDropdown
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.stateFormDetails(result);
        }
      });
    }
  }

  view(stateId) {
    this.viewMode = true;
    this.stateFacade.loadStateByStateCode(stateId);
  }

  paginate(pageEvent: PageEvent) {
    this.statePageEvent = pageEvent;
    this.loadStateList();
  }

  loadStateList() {
    this.stateFacade.loadStateDetailsListing(this.statePageEvent);
  }

  stateFormDetails(data: any) {
    const formData = {
      configDetails: {},
      countryCode: data.countryCode,
      isUnionTerritory: data.isUnionTerritory,
      stateCode: data.stateCode,

      description: data.description
    };
    if (data.mode === stateEnum.NEW) {
      this.stateFacade.saveStateFormDetails(formData);
    } else {
      const formDetals = {
        configDetails: {},
        countryCode: data.countryCode,
        isUnionTerritory: data.isUnionTerritory,
        stateCode: data.stateCode,
        description: data.description,
        isActive: true,
        stateId: data.stateId
      };
      this.stateFacade.editStateFormDetails(formDetals);
    }
  }

  showNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }
  clearSearch() {
    this.invalidSearch = false;
    this.searchForm.reset();
    this.loadStateList();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
