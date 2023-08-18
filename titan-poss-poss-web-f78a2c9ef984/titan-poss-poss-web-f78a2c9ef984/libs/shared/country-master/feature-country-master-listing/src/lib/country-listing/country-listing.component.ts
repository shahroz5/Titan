import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  CustomErrors,
  CountryDetails,
  CountryEnum,
  CountryMaster,
  CurrencyCodeData,
  OverlayNotificationServiceAbstraction,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus,
  Lov,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { CountryDetailComponent } from '@poss-web/shared/country-master/ui-country-master-detail';
import { CountryFacade } from '@poss-web/shared/country-master/data-access-country-master';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import { CountryViewComponent } from '@poss-web/shared/country-master/ui-country-view';

@Component({
  selector: 'poss-web-country-listing',
  templateUrl: './country-listing.component.html'
})
export class CountryListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() formEmit = new EventEmitter<any>();
  pageSize: any;
  destroy$ = new Subject<null>();
  currencyNew: any[] = [];

  countryPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  pageSizeOptions: number[] = [];
  minPageSize: number;

  isLoading$: Observable<boolean>;
  countryListing$: Observable<CountryDetails[]>;
  countryCount$: Observable<number>;

  hasError$: Observable<CustomErrors>;

  searchErrorCode: string;

  // countryName: CountryNameData[];
  currencyCode: CurrencyCodeData[];

  invalidSearch = false;

  countryDetailsByCode$: CountryDetails;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: any;
  viewOnly: boolean;
  timeFormats: Lov[];
  dateFormats: Lov[];
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private countryFacade: CountryFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.countriesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.countriesEntity']
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
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    // this.countryFacade.loadCountryName();
    // this.countryFacade
    //   .getCountryName()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(countryName => {
    //     this.countryName = countryName;
    //   });

    this.countryFacade.loadCurrencyCode();
    this.countryFacade.loadTimeFormats();
    this.countryFacade.loadDateFormats();
    this.countryFacade
      .getCurrencyCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        console.log(currencyCode, 'currency in comp');

        this.currencyCode = [];
        if (currencyCode) {
          currencyCode.forEach(currency => {
            this.currencyCode.push({
              id: currency.currencyCode,
              name: currency.currencyCode
            });
          });
        }
        console.log(this.currencyCode, 'check currency code');

        // this.currencyCode = currencyCode;
      });
    this.countryFacade
      .getTimeFormats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(timeFormats => {
        if (timeFormats) this.timeFormats = timeFormats;
      });
    this.countryFacade
      .getDateFormats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dateFormats => {
        if (dateFormats) this.dateFormats = dateFormats;
      });

    this.countryFacade.resetCountryDialogData();
    this.hasError$ = this.countryFacade.getError();
    // this.searchErrorCode = ErrorEnums.ERR_LOC_002;
    this.searchErrorCode = ErrorEnums.ERR_CORE_023;
    this.countryFacade
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
        const pageSize = JSON.parse(data.toString());
        this.countryPageEvent.pageSize = pageSize;
        this.loadCountryDetails();
      });
    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
      });

    this.isLoading$ = this.countryFacade.getisLoading();
    this.countryListing$ = this.countryFacade.getCountryDetailsListing();
    this.countryCount$ = this.countryFacade.getTotalCountryDetails();

    this.countryFacade
      .getCountrySaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadCountryDetails();
          this.showNotification('pw.countryMaster.successMsg');
        }
      });

    this.countryFacade
      .getCountryEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadCountryDetails();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.countryMaster.editSuccessMsg');
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

    this.countryFacade
      .getCountryDetailsByCountryCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.countryDetailsByCode$ = data;
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(CountryViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
            dialogRef.afterClosed().subscribe();
          } else {
            const dialogRef = this.dialog.open(CountryDetailComponent, {
              width: '500px',
              height: 'auto',
              data: {
                countryDetailsByCode: this.countryDetailsByCode$,
                currencyDropdown: this.currencyCode,
                timeFormats: this.timeFormats,
                dateFormats: this.dateFormats
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
                      this.createCountryFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });
  }

  loadCountryDetails() {
    this.countryFacade.loadCountryDetailsListing(this.countryPageEvent);
  }

  getCountryCode(countryCode: string) {
    this.viewOnly = false;
    if (countryCode !== CountryEnum.NEW) {
      this.countryFacade.loadCountryDetailsByCountryCode(countryCode);
    } else {
      const newFormData: CountryMaster = {
        countryCode: CountryEnum.NEW,
        description: '',
        currencyCode: '',
        dateFormat: '',
        fiscalYearStart: '',
        isdCode: '',
        phoneLength: '',
        locale: '',
        timeFormat: '',
        fiscalYear: 0,
        weightUnit: '',
        stoneWeightUnit: '',
        isActive: true
      };
      const dialogRef = this.dialog.open(CountryDetailComponent, {
        width: '500px',
        height: 'auto',
        data: {
          countryDetailsByCode: newFormData,
          currencyDropdown: this.currencyCode,
          timeFormats: this.timeFormats,
          dateFormats: this.dateFormats
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.alertPopupService
            .open({
              type: AlertPopupTypeEnum.CONFIRM,
              message: 'pw.alertPopup.saveConfirmation'
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.createCountryFormDetails(data);
              }
            });
        }
      });
    }
  }

  createCountryFormDetails(data: any) {
    console.log('save', data);
    this.searchForm.reset();
    if (data.mode === CountryEnum.new) {
      this.countryFacade.saveCountryFormDetails({
        countryCode: data.countryCode,
        description: data.description,
        currencyCode: data.currencyCode,
        dateFormat: data.dateFormat,
        fiscalYearStart: data.fiscalYearStart,
        isdCode: data.isdCode,
        phoneLength: data.phoneLength,
        locale: data.locale,
        timeFormat: data.timeFormat,
        fiscalYear: data.fiscalYear,
        weightUnit: data.weightUnit,
        stoneWeightUnit: data.stoneWeightUnit,
        isActive: data.isActive
      });
    } else if (data.mode === CountryEnum.edit) {
      this.countryFacade.editCountryFormDetails({
        countryCode: data.countryCode,
        description: data.description,
        currencyCode: data.currencyCode,
        dateFormat: data.dateFormat,
        fiscalYearStart: data.fiscalYearStart,
        isdCode: data.isdCode,
        phoneLength: data.phoneLength,
        locale: data.locale,
        timeFormat: data.timeFormat,
        fiscalYear: data.fiscalYear,
        weightUnit: data.weightUnit,
        stoneWeightUnit: data.stoneWeightUnit,
        isActive: data.isActive
      });
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

          this.searchForm.reset();
          this.countryFacade.editCountryFormDetails({
            countryCode: event.countryCode,
            description: event.description,
            currencyCode: event.currencyCode,
            dateFormat: event.dateFormat,
            fiscalYearStart: event.fiscalYearStart,
            isdCode: event.isdCode,
            phoneLength: event.phoneLength,
            locale: event.locale,
            timeFormat: event.timeFormat,
            fiscalYear: event.fiscalYear,
            weightUnit: event.weightUnit,
            stoneWeightUnit: event.stoneWeightUnit,
            isActive: event.isActive
          });
        } else this.loadCountryDetails();
      });
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.search(searchValue);
        } else {
          this.clearSearch();
        }
      });
  }

  search(searchValue: string) {
    // if (!searchValue.search('^[_A-z0-9]*((-|s)*[_A-z0-9])*$')) {
    //   this.countryFacade.searchCountry(searchValue.toUpperCase());
    // }
    if (fieldValidation.countryNameField.pattern.test(searchValue)) {
      this.countryFacade.searchCountry(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }

  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadCountryDetails();
  }

  paginate(pageEvent: PageEvent) {
    this.countryPageEvent = pageEvent;
    this.loadCountryDetails();
  }

  openViewPage(countryCode) {
    this.viewOnly = true;
    this.countryFacade.loadCountryDetailsByCountryCode(countryCode);
  }

  showNotification(key: string) {
    this.overlayNotification.close();

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

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
  backArrow() {
    this.countryFacade.resetCountryDialogData();
    this.router.navigate([getMasterHomeRouteUrl()], {
      queryParams: {
        menu: MasterMenuKeyEnum.LOCATION_MENU_KEY
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // omit_special_char($event: KeyboardEvent) {
  //   const pattern = /^[-_A-Z0-9]$/;
  //   return pattern.test($event.key);
  // }
}
