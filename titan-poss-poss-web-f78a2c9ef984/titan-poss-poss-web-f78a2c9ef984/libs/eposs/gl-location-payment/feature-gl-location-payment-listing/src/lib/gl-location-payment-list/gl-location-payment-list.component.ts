import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable, fromEvent, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, take } from 'rxjs/operators';

import { GlLocationPaymentFacade } from '@poss-web/eposs/gl-location-payment/data-access-gl-location-payment';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  ConfigurationsMenuKeyEnum,
  LocationMappingServiceAbstraction,
  SelectedLocationFilters,
  PaymentCodes,
  OverlayNotificationEventType,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { getConfigurationHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import {
  fieldValidation,
  FieldValidatorsService
} from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'poss-web-gl-location-payment-list',
  templateUrl: './gl-location-payment-list.component.html'
})
export class GlLocationPaymentListComponent implements OnInit, AfterViewInit {
  destroy$ = new Subject<null>();
  searchData : any;
  invalidSearch = false;
  @ViewChild('searchBox', { static: true })
  searchBox: ElementRef;
  searchForm = new FormGroup({
    searchValue: new FormControl()
  });
  selectedLocationFilters: SelectedLocationFilters = {
    brands: [],
    regions: [],
    levels: [],
    countries: [],
    states: [],
    towns: []
  };
  isLoading$: Observable<boolean>;
  hasError$: Observable<CustomErrors>;
  totalElements$: Observable<number>;

  onFormSubmit: FormGroup;
  locationsAdded: any[];
  locations = false;
  glLocationPaymentData$: Observable<any>;
  locationData$: Observable<any>;
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  count = 0;
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];

  paymentCodes = [];
  arr1 = [];
  arr2 = [];
  glLocationList = [];
  initialFilter: SelectedLocationFilters;
  isfilterApplied: boolean;
  initialPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };
  filteredLocations = [];

  constructor(
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private glLocationPaymentFacade: GlLocationPaymentFacade,
    private locationMappingService: LocationMappingServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService
  ) {
    this.onFormSubmit = new FormGroup({
      locations: new FormControl(
        { value: '', disabled: true },
        this.fieldValidatorsService.requiredField('Location ')
      ),
      paymentCode: new FormControl(
        '',
        this.fieldValidatorsService.requiredField('Payment Code')
      ),
      glCode: new FormControl('', [
        this.fieldValidatorsService.fitGlCodeField('GL Code'),
        this.fieldValidatorsService.requiredField('GL Code')
      ])
    });
  }

  ngOnInit() {
    this.initialFilter = this.selectedLocationFilters;
    this.glLocationPaymentFacade.resetGlPaymentDetails();
    this.glLocationPaymentFacade.loadPaymentCodes();
    this.glLocationPaymentFacade.loadLocations();

    this.hasError$ = this.glLocationPaymentFacade.getError();
    this.isLoading$ = this.glLocationPaymentFacade.getIsLoading();
    this.glLocationPaymentData$ = this.glLocationPaymentFacade.getGlLocationPaymentList();
    this.totalElements$ = this.glLocationPaymentFacade.getTotalElements();
    this.locationData$ = this.glLocationPaymentFacade.getLocationData();
    this.glLocationPaymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    combineLatest([
      this.glLocationPaymentFacade
        .getGlLocationPaymentList()
        .pipe(takeUntil(this.destroy$)),
      this.glLocationPaymentFacade
        .getLocationData()
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(([val, val1]) => {
      if (val && val1) {
        this.arr1 = val;
        this.arr2 = val1;
        this.glLocationList = [];
        for (let i = 0; i < this.arr1.length; i++) {
          this.glLocationList.push({
            ...this.arr1[i],
            ...this.arr2.find(
              itmInner => itmInner.locationCode === this.arr1[i].locationCode
            )
          });
        }
      }
    });

    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.listingPageEvent.pageSize = pageSize;
        this.loadDetails();
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

    this.totalElements$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.count = data;
        }
      });

    this.glLocationPaymentData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        if (data) {
          this.length = data.length;
        }
      });

    this.glLocationPaymentFacade
      .getPaymentCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PaymentCodes[]) => {
        if (data) {
          this.paymentCodes = data;
        }
      });
    this.glLocationPaymentFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showNotifications('pw.glLocationPayment.editSuccessMsg');
          this.loadDetails();
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
            type: OverlayNotificationType.TIMER,
            message: translatedMessage,
            hasBackdrop: true
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
          });
      });
  }
  loadDetails() {
    this.filteredLocations = this.searchData
      ? this.searchData
      : this.filteredLocations;
    this.glLocationPaymentFacade.loadGlLocationPaymentListing(
      this.listingPageEvent,
      this.filteredLocations
    );
  }
  back() {
    this.router.navigate([getConfigurationHomeRouteUrl()], {
      queryParams: {
        menu: ConfigurationsMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }
  deleteRow(data) {
    const codedata = [];
    this.glLocationPaymentFacade.deleteRowData(data.id);
    this.glLocationPaymentFacade.saveGlLocationPaymentListing({
      addLocations: [data.locationCode],
      addPaymentCodes: [],
      removeLocations: [],
      removePaymentCodes: [data.paymentCode],
      updatePaymentCodes: []
    });
  }
  saveDetails(data) {
    this.glLocationPaymentFacade.saveGlLocationPaymentListing(data);
  }

  updateData(data) {
    if (data) {
      console.log(data, 'updaterow');

      data.forEach(item => {
        this.glLocationPaymentFacade.updateRowData(item);
      });

      this.glLocationPaymentFacade.saveGlLocationPaymentListing({
        addLocations: [],
        addPaymentCodes: [],
        removePaymentCodes: [],
        removeLocations: [],
        updatePaymentCodes: data
      });
    }
  }
  openLocationFilter() {
    this.locationMappingService
      .openFilter({
        selectedLocationFilters: this.selectedLocationFilters
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.checkFilter(res);
          if (res.type === 'apply' && res.locations.length) {
            if(this.searchData.length > 0){
              this.searchForm.reset();
              this.searchData = [];
            }
            this.selectedLocationFilters = res.selectedLocationFilters;
            this.filteredLocations = res.locations.map(l => l.id);
            this.glLocationPaymentFacade.loadGlLocationPaymentListing(
              this.listingPageEvent,
              this.filteredLocations
            );
          } else {
            this.selectedLocationFilters = res.selectedLocationFilters;
            this.glLocationList = [];
          }
        }
      });
  }
  checkFilter(res) {
    if (
      !res.selectedLocationFilters.brands.length &&
      !res.selectedLocationFilters.regions.length &&
      !res.selectedLocationFilters.levels.length &&
      !res.selectedLocationFilters.countries.length &&
      !res.selectedLocationFilters.states.length &&
      !res.selectedLocationFilters.towns.length
    ) {
      this.isfilterApplied = false;
    } else this.isfilterApplied = true;
  }
  ngAfterViewInit(): void {
    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(event => {
        const searchValue = this.searchForm.value.searchValue;
        if (searchValue) {
          this.searchData = [searchValue.toUpperCase()];
          this.search();
        } else {
          this.clearSearch();
        }
      });
  }
  search() {
    if (
      fieldValidation.locationCodeField.pattern.test(this.searchData)
    ) {
      this.selectedLocationFilters = this.initialFilter;
      this.invalidSearch = false;
      this.listingPageEvent = { ...this.listingPageEvent, pageIndex: 0 };
      this.loadDetails();
    } else {
      this.invalidSearch = true;
    }
  }
  errorHandler(error: CustomErrors) {
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
  clearSearch() {
    this.searchForm.reset();
    this.invalidSearch = false;
    this.searchData = [];
    this.listingPageEvent = { ...this.listingPageEvent, pageIndex: 0 };
    this.loadDetails();
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadDetails();
  }
}
