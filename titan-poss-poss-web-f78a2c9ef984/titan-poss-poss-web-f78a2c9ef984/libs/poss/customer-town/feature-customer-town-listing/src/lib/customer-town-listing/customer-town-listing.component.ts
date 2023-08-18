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
import {
  CustomerTown,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  StateSummary,
  MasterMenuKeyEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { CustomerTownFacade } from '@poss-web/poss/customer-town/data-access-customer-town';
import { CustomerTownDetailComponent } from '@poss-web/poss/customer-town/ui-customer-town-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getMasterHomeRouteUrl
} from '@poss-web/shared/util-site-routes';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Observable, Subject, fromEvent } from 'rxjs';
@Component({
  selector: 'poss-web-customer-town-listing',
  templateUrl: './customer-town-listing.component.html'
})
export class CustomerTownListingComponent
  implements OnInit, AfterViewInit, OnDestroy {
  customerTownDetailsList$: Observable<CustomerTown[]>;
  destroy$ = new Subject<null>();
  hasError$: Observable<CustomErrors>;
  customerTownCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  townDetailsByCode$: CustomerTown;
  townSaveResponse$: Observable<CustomerTown>;
  townEditResponse$: Observable<CustomerTown>;
  isSearching$: Observable<boolean>;
  stateDropdown: StateSummary[];
  searchElement: CustomerTown[] = [];
  noSearchFound: boolean;
  totalElements: number;
  filterTownDetailsList$: Observable<CustomerTown[]>;
  customerTownError: CustomErrors = null;
  pageSizeOptions: number[] = [];
  minPageSize = 0;
  invalidSearch = false;

  customerTownPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: any;
  constructor(
    public router: Router,
    public dialog: MatDialog,
    private appsettingFacade: AppsettingFacade,
    private customerTownFacade: CustomerTownFacade,
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.customerTownsEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.customerTownsEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.customerTownPageEvent.pageSize = pageSize;
        this.loadCustomerTownDetails();
      });
    this.hasError$ = this.customerTownFacade.getError();
    this.customerTownFacade.resetTownDialogData();
    // this.isSearching$ = this.customerTownFacade.getIsSerchElements();
    this.isLoading$ = this.customerTownFacade.getisCustomerTownListingLoading();
    this.customerTownDetailsList$ = this.customerTownFacade.getCustomerTownDetailsListing();
    this.customerTownCount$ = this.customerTownFacade.getTotalCustomerTownDetails();
    this.customerTownFacade.loadStateListing('IND');

    this.customerTownFacade.getStateDetailsListing().subscribe(result => {
      this.stateDropdown = result;
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
    this.customerTownFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        this.errorHandler(error);
      });
    this.customerTownFacade
      .getTownDetailsSaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          const key = 'pw.customerTown.successMsg';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.showTimerError(translatedMessage);
              this.loadCustomerTownDetails();
            });
        }
      });

    this.customerTownFacade
      .getTownDetailsEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.clearSearch();
          const key = 'pw.customerTown.editSuccessMsg';
          this.translate
            .get(key)
            .pipe(takeUntil(this.destroy$))
            .subscribe((translatedMessage: string) => {
              this.showTimerError(translatedMessage);
              if (this.searchForm.value.searchValue) {
                this.search(this.searchForm.value.searchValue);
              } else {
                this.loadCustomerTownDetails();
              }
            });
        }
      });

    this.customerTownFacade
      .getTownDetailsByTownCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.townDetailsByCode$ = data;
          // if (this.customerTownError === null) {
          const dialogRef = this.dialog.open(CustomerTownDetailComponent, {
            width: '500px',
            height: 'auto',
            data: {
              data,
              mode: 'edit',
              state: this.stateDropdown
            }
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
                    this.customerTownFormDetails(formData);
                  }
                });
            }
          });
          // }
        }
      });

    this.customerTownFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          // this.customerTownError = error;
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
  search(searchValue: string) {
    if (fieldValidation.countryNameField.pattern.test(searchValue)) {
      this.customerTownFacade.loadCustomerTownListing(
        this.customerTownPageEvent,
        searchValue
      );
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
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
          const toggleUpdate: CustomerTown = {
            townCode: event.customerListItem.townCode,
            description: event.customerListItem.description,
            stateName: event.customerListItem.stateName,
            isActive: event.isActive
          };

          this.customerTownFacade.editTownFormDetails(toggleUpdate);
        } else this.loadCustomerTownDetails();
      });
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
    this.customerTownFacade.resetTownDialogData();
    // this.router.navigate([getMasterHomeRouteUrl()]);
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.BOUTIQUE_MENU_KEY
      }
    });
  }

  getCustomerTownCode(townCode: string) {
    if (townCode !== 'NEW') {
      // const code = Number(townCode);
      this.customerTownFacade.loadTownDetailsByTownCode(townCode);
    } else {
      const data: CustomerTown = {
        townCode: '',
        description: '',
        stateName: '',
        isActive: true
      };
      const dialogRef = this.dialog.open(CustomerTownDetailComponent, {
        width: '500px',
        height: 'auto',
        data: {
          data,
          mode: 'new',
          state: this.stateDropdown
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.customerTownFormDetails(result);
        }
      });
    }
  }
  paginate(pageEvent: PageEvent) {
    this.customerTownPageEvent = pageEvent;
    this.loadCustomerTownDetails();
  }

  loadCustomerTownDetails() {
    this.customerTownFacade.loadCustomerTownListing(this.customerTownPageEvent);
  }

  customerTownFormDetails(data: any) {
    this.searchForm.reset();
    if (data.mode === 'new') {
      const formData = {
        description: data.description,
        isActive: data.isActive,
        // stateId: data.stateId,
        stateCode: data.stateName
      };
      this.customerTownFacade.saveTownFormDetails(formData);
    } else {
      this.customerTownFacade.editTownFormDetails(data);
    }
  }

  showTimerError(translatedMessage: string) {
    this.overlayNotification.show({
      type: OverlayNotificationType.TIMER,
      message: translatedMessage,
      hasClose: true,
      hasBackdrop: true
    });
  }
  clearSearch() {
    this.noSearchFound = false;
    this.searchElement = [];
    this.searchForm.reset();
    this.customerTownFacade.resetTownDialogData();
    this.loadCustomerTownDetails();
    this.invalidSearch = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
