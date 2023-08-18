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
import { getMasterHomeRouteUrl } from '@poss-web/shared/util-site-routes';

import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  CurrencyFormDetails,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  MasterMenuKeyEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ListingActiveDeactiveStatus
} from '@poss-web/shared/models';

import { ErrorEnums } from '@poss-web/shared/util-error';

import { CurrencyFacade } from '@poss-web/shared/currency-master/data-access-currency-master';
import { CurrencyDetailsComponent } from '@poss-web/shared/currency-master/ui-currency-master-detail';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  CurrencyDetailsEnum,
  CurrencyDetails
  // CountryDropDownData,
  // CurrencySymbolData,
  // UnicodeData
} from '@poss-web/shared/models';
import { CurrencyViewComponent } from '@poss-web/shared/currency-master/ui-currency-view';

@Component({
  selector: 'poss-web-currency-listing',
  templateUrl: './currency-listing.component.html'
})
export class CurrencyListingComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() formEmit = new EventEmitter<any>();

  destroy$ = new Subject<null>();
  currencyPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  // countryPageEvent: PageEvent = {
  //   pageIndex: 0,
  //   pageSize: 0,
  //   length: 0
  // };
  pageSizeOptions: number[] = [];
  minPageSize: number;

  invalidSearch = false;

  isLoading$: Observable<boolean>;
  currencyListing$: Observable<CurrencyDetails[]>;
  currencyCount$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  searchErrorCode: string;
  currencyByCurrencyCode: CurrencyFormDetails;
  // country: CountryDropDownData[];
  // currencySymbol: CurrencySymbolData[];
  // unicode: UnicodeData[];

  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  noDataFoundMessage: any;
  viewOnly: boolean;
  toggleStatus = ListingActiveDeactiveStatus.NORMAL;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private currencyFacade: CurrencyFacade,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {
    this.translate
      .get(['pw.entity.currenciesEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.currenciesEntity']
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

    this.isLoading$ = this.currencyFacade.getisLoading();
    this.currencyListing$ = this.currencyFacade.getCurrencyDetailsListing();
    this.currencyCount$ = this.currencyFacade.getTotalCurrencyDetails();
    this.currencyFacade.resetCurrencyDialogData();
    this.hasError$ = this.currencyFacade.getError();
    // this.searchErrorCode = ErrorEnums.ERR_LOC_002;
    this.searchErrorCode = ErrorEnums.ERR_LOC_046;
    this.currencyFacade
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
        this.currencyPageEvent.pageSize = pageSize;
        this.loadCurrencyDetails();
      });

    this.currencyFacade
      .getCurrencySaveResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.loadCurrencyDetails();
          this.showNotification('pw.currencyMaster.successMsg');
        }
      });

    this.currencyFacade
      .getCurrencyEditResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.loadCurrencyDetails();

          if (this.toggleStatus === ListingActiveDeactiveStatus.NORMAL) {
            this.showNotification('pw.currencyMaster.editSuccessMsg');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.ACTIVE) {
            this.showNotification('pw.global.listActivated');
          }
          if (this.toggleStatus === ListingActiveDeactiveStatus.DEACTIVE) {
            this.showNotification('pw.global.listDeactivated');
          }
          this.toggleStatus = ListingActiveDeactiveStatus.NORMAL;

          // this.loadCurrencyDetails();
        }
      });
    this.currencyFacade
      .getCurrencyDetailsByCurrencyCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log(data, 'in feature data');
          this.currencyByCurrencyCode = data;
          if (this.viewOnly) {
            const dialogRef = this.dialog.open(CurrencyViewComponent, {
              width: '500px',
              height: 'auto',
              data: data,
              disableClose: true
            });
            dialogRef.afterClosed().subscribe();
          } else {
            const dialogRef = this.dialog.open(CurrencyDetailsComponent, {
              width: '500px',
              height: 'auto',
              data: this.currencyByCurrencyCode,
              disableClose: true
              // country: this.country,
              // currencySymbol: this.currencySymbol,
              // unicode: this.unicode
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
                      this.createCurrencyFormDetails(formData);
                    }
                  });
              }
            });
          }
        }
      });
  }
  loadCurrencyDetails() {
    this.currencyFacade.loadCurrencyDetailsListing(this.currencyPageEvent);
    // this.currencyFacade.loadCountryDetails();
    // this.currencyFacade.loadCurrencySymbol();
    // this.currencyFacade.loadUnicode();
  }

  getCurrencyCode(currencyCode: string) {
    this.viewOnly = false;
    if (currencyCode !== CurrencyDetailsEnum.NEW) {
      this.currencyFacade.loadCurrencyDetailsByCurrencyCode(currencyCode);
    } else {
      const newFormData: CurrencyFormDetails = {
        currencyCode: CurrencyDetailsEnum.NEW,
        currencySymbol: '',
        description: '',
        isActive: true
      };
      console.log(newFormData, 'FEATURE2');
      const dialogRef = this.dialog.open(CurrencyDetailsComponent, {
        width: '500px',
        height: 'auto',
        data: newFormData,
        disableClose: true
        // {
        //   currencyByCurrencyCode : newFormData,
        // country: this.country,
        // currencySymbol: this.currencySymbol,
        // unicode: this.unicode
        // }
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
                this.createCurrencyFormDetails(data);
              }
            });
        }
      });
    }
  }
  createCurrencyFormDetails(data: any) {
    this.searchForm.reset();
    if (data.mode === CurrencyDetailsEnum.new) {
      this.currencyFacade.saveCurrencyFormDetails({
        currencyCode: data.currencyCode,
        currencySymbol: data.currencySymbol,
        description: data.description,
        isActive: data.isActive
      });
    } else if (data.mode === CurrencyDetailsEnum.edit) {
      this.currencyFacade.editCurrencyFormDetails({
        currencyCode: data.currencyCode,
        currencySymbol: data.currencySymbol,
        description: data.description,
        isActive: data.isActive
      });
    }
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
  paginate(pageEvent: PageEvent) {
    this.currencyPageEvent = pageEvent;
    this.loadCurrencyDetails();
  }
  search(searchValue) {
    if (fieldValidation.currencyCodeField.pattern.test(searchValue)) {
      this.currencyFacade.searchCurrency(searchValue.toUpperCase());
      this.invalidSearch = false;
    } else {
      this.invalidSearch = true;
    }
  }
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.loadCurrencyDetails();
  }
  // omit_special_char($event: KeyboardEvent) {
  //   const pattern = /^[-_A-Z0-9]$/;
  //   return pattern.test($event.key);
  // }
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

  errorHandler(error: CustomErrors) {
    if (error.code === this.searchErrorCode) {
      return;
    } else {
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

  openViewPage(currencyCode) {
    this.viewOnly = true;
    this.currencyFacade.loadCurrencyDetailsByCurrencyCode(currencyCode);
  }
  backArrow() {
    this.currencyFacade.resetCurrencyDialogData();
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
          this.toggleStatus = event.isActive
            ? ListingActiveDeactiveStatus.ACTIVE
            : ListingActiveDeactiveStatus.DEACTIVE;
          this.searchForm.reset();
          this.currencyFacade.editCurrencyFormDetails({
            currencyCode: event.currencyCode,
            currencySymbol: null,
            description: null,
            isActive: event.isActive
          });
        } else this.loadCurrencyDetails();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
