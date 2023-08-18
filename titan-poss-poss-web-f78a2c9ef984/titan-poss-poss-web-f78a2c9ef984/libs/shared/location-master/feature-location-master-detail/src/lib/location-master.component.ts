import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { LocationMasterFacade } from '@poss-web/shared/location-master/data-access-location-master';
import {
  CustomErrors,
  LocationMasterDetails,
  OverlayNotificationServiceAbstraction,
  LocationTypes,
  OwnerTypes,
  Towns,
  StateTypes,
  CurrencyTypes,
  RegionSummary,
  BrandSummary,
  MarketCodeTypes,
  CountryAcn,
  LocationMasterDropdownList,
  LocationCFAType,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  getLocationRouteUrl,
  getLocationMasterGhsRouterLink,
  getLocationMasterPrintRouterLink,
  getLocationMasterGrnRouterLink,
  getLocationMasterLoyalityRouterLink,
  getLocationMasterAdvanceRouterLink,
  getLocationMasterListRouteUrl,
  getLocationDetailsLocationRouteUrl,
  getPriceGroupMappingRouteUrl
} from '@poss-web/shared/util-site-routes';
import { FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'poss-web-location-master',
  templateUrl: './location-master.component.html',
  styleUrls: ['./location-master.component.scss']
})
export class LocationMasterComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  isLoading$: Observable<boolean>;
  locationDetails$: Observable<LocationMasterDetails>;
  locationDetails: LocationMasterDetails;
  isLoading = true;
  isNew: boolean;
  destroy$: Subject<null> = new Subject<null>();

  locationUrl: string;
  ghsUrl: string;
  printUrl: string;
  grnUrl: string;
  loyalityUrl: string;
  advanceUrl: string;

  // Extras
  locationTypes$: Observable<LocationTypes>;
  ownerInfo$: Observable<OwnerTypes>;
  locationStates$: Observable<StateTypes[]>;
  locationTowns$: Observable<Towns[]>;
  currency$: Observable<CurrencyTypes[]>;
  regions$: Observable<LocationMasterDropdownList[]>;
  subRegion$: Observable<RegionSummary[]>;
  brandName$: Observable<LocationMasterDropdownList[]>;
  subBrandName$: Observable<BrandSummary[]>;
  currencyTypes$: Observable<CurrencyTypes[]>;
  locationSize$: Observable<StateTypes[]>;
  invoiceType$: Observable<StateTypes[]>;
  refundMode$: Observable<StateTypes[]>;
  locationCFATypes$: Observable<LocationCFAType[]>;
  countryCode$: Observable<{ id: string; name: string }[]>;
  marketCode$: Observable<MarketCodeTypes>;
  locationCode: string;
  country$: Observable<CountryAcn[]>;
  newLocCode$: Subject<null> = new Subject<null>();
  page: string;
  disabled = true;
  hasError: Observable<CustomErrors>;
  // Extras end

  tabIndex = 0;

  showViewOnly: boolean;
  locationSubForm: FormGroup;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public locationMasterFacade: LocationMasterFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private cdRef: ChangeDetectorRef
  ) {}

  locationSections: {
    value: string;
    disabled: boolean;
    className: string;
  }[] = [
    {
      value: 'pw.locationMaster.leftMenuLOCATION',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuPRINT',
      disabled: false,
      className: 'pw-cta-button pw-sixth-color'
    },
    {
      value: 'pw.locationMaster.leftMenuTRANSACTIONTYPE',
      disabled: true,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuGHS',
      disabled: false,
      className: 'mat-list-location-saved'
    },
    {
      value: 'pw.locationMaster.leftMenuINVENTORY',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuGHS',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuBANKING',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuOTP',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuCUSTOMER',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuPAYMENTS',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuFOC',
      disabled: false,
      className: ''
    },
    {
      value: 'pw.locationMaster.leftMenuDIGIGOLD',
      disabled: false,
      className: ''
    }
  ];

  locationSectionChange(section: MatSelectionListChange) {
    this.updateTab(section.option.value);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.showViewOnly = params?.showViewOnly ? true : false;
      });

    this.locationMasterFacade.loadCountryCode();

    this.countryCode$ = this.locationMasterFacade.getCountryCode();

    this.countryCode$.pipe(takeUntil(this.destroy$)).subscribe(code => {
      this.locationMasterFacade.loadStates(code[0].id);
    });

    this.locationMasterFacade
      .getLocationDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationDetails = data;

        if (data) {
          if (this.tabIndex === 0) {
            if (data.stateId) {
              this.locationMasterFacade.loadTowns(data.stateId);
            }
            if (data.regionCode) {
              this.locationMasterFacade.loadSubRegion(data.regionCode);
            }
            if (data.brandCode) {
              this.locationMasterFacade.loadSubBrand(data.brandCode);
            }
          }
        }
      });

    this.locationMasterFacade.loadlocationTypes();
    this.locationMasterFacade.loadRegion();
    this.locationMasterFacade.loadMarketCode();
    this.locationMasterFacade.loadBrands();
    this.locationMasterFacade.loadOwnerInfo();
    this.locationMasterFacade.loadCurrency();
    this.locationMasterFacade.loadLocationSize();
    this.locationMasterFacade.loadInvoiceType();
    this.locationMasterFacade.loadRefundMode();
    this.locationMasterFacade.loadLocationCFATypes();

    this.isLoading$ = this.locationMasterFacade.getIsLoading();

    this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      if (loading) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });

    this.locationCode = this.activatedRoute.snapshot.params['_locCode'];
    this.locationMasterFacade.loadLocationDetails(this.locationCode);

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['params']['_locCode'] === 'NEW') {
          this.isNew = true;
        } else {
          this.isNew = false;
          if (this.locationSubForm) {
            this.locationFormGroupCreated(this.locationSubForm);
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

    this.locationMasterFacade
      .getIsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved === true) {
          this.showNotification('pw.locationMaster.savedSuccessfully');
        }
      });

    this.locationUrl = getLocationRouteUrl();
    this.ghsUrl = getLocationMasterGhsRouterLink();
    this.printUrl = getLocationMasterPrintRouterLink();
    this.grnUrl = getLocationMasterGrnRouterLink();
    this.loyalityUrl = getLocationMasterLoyalityRouterLink();
    this.advanceUrl = getLocationMasterAdvanceRouterLink();

    this.getDetails();
  }

  getDetails() {
    this.locationDetails$ = this.locationMasterFacade.getLocationDetails();
    this.locationTypes$ = this.locationMasterFacade.getLocationTypes();
    this.ownerInfo$ = this.locationMasterFacade.getOwnerInfo();
    this.marketCode$ = this.locationMasterFacade.getMarketCode();
    this.regions$ = this.locationMasterFacade.getRegions();
    this.subRegion$ = this.locationMasterFacade.getSubRegions();
    this.locationStates$ = this.locationMasterFacade.getStates();
    this.locationTowns$ = this.locationMasterFacade.getTowns();
    this.brandName$ = this.locationMasterFacade.getBrandName();
    this.subBrandName$ = this.locationMasterFacade.getSubBrand();
    this.currencyTypes$ = this.locationMasterFacade.getCurrencyTypes();
    this.locationSize$ = this.locationMasterFacade.getLocationSize();
    this.invoiceType$ = this.locationMasterFacade.getInvoiceType();
    this.refundMode$ = this.locationMasterFacade.getRefundMode();
    this.locationCFATypes$ = this.locationMasterFacade.getLocationCFATypes();
    this.isLoading$ = this.locationMasterFacade.getIsLoading();

    this.locationDetails$.pipe(takeUntil(this.newLocCode$)).subscribe(data => {
      if (data) {
        if (
          this.locationCode === 'NEW' &&
          data.locationCode !== 'NEW' &&
          data.locationCode !== '' &&
          data.locationCode
        ) {
          this.newLocCode$.next();
          this.newLocCode$.complete();
          this.isNew = false;
          setTimeout(() => {
            this.router.navigate([
              getLocationDetailsLocationRouteUrl(data.locationCode)
            ]);
          }, 2000);
        }
      }
    });
  }

  back() {
    this.router.navigate([getLocationMasterListRouteUrl()]);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
            time: 2000,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }

  updateTab(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  formOutput_location($event: LocationMasterDetails) {
    if (this.isNew) {
      this.locationMasterFacade.saveLocationDetails($event);
    } else {
      this.locationMasterFacade.updateLocationDetails($event);
    }
  }

  formOutput($event: LocationMasterDetails) {
    this.locationMasterFacade.updateLocationDetails($event);
  }

  public formGroupCreated_location(formGroup: FormGroup) {
    const subForm: FormGroup = <FormGroup>(
      formGroup.get('1-locationBoutiqueFactoryModel')
    );

    subForm
      .get('1-state')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(stateIdSF => {
        if (stateIdSF) {
          subForm.get('1-cityTown')['options'] = [];
          this.locationMasterFacade.loadTowns(stateIdSF);
        }
      });

    subForm
      .get('1-region')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        if (region) {
          subForm.get('1-subRegion')['options'] = [];
          this.locationMasterFacade.loadSubRegion(region);
        }
      });

    subForm
      .get('1-brand')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(brand => {
        if (brand) {
          subForm.get('1-subBrand')['options'] = [];
          this.locationMasterFacade.loadSubBrand(brand);
        }
      });
  }

  locationFormGroupCreated(locationSubForm: FormGroup) {
    this.locationSubForm = locationSubForm;
    if (!this.isNew) {
      locationSubForm.get('1-locationCode').disable({ onlySelf: true });
    }
  }
  priceGroupMapping() {
    this.router.navigate([getPriceGroupMappingRouteUrl(), this.locationCode]);
  }
}
