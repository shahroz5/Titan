import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { GEPPurityConfigFacade } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  ConfigTypeEnum,
  ExcludeItemCodes,
  ExcludeThemeCodes,
  GepDetails,
  GepPurityConfigEnums,
  Lov,
  MetalType,
  ProductGroup,
  ProductGroupsDeduction,
  PurityDetailsResponse,
  Ranges
} from '@poss-web/shared/models';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { fieldValidation } from '@poss-web/shared/util-field-validators';
import {
  getGepPurityConfigurationRouteUrl,
  getGepPurityConfigViewUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-gep-purity-config-view',
  templateUrl: './gep-purity-config-view.component.html'
})
export class GepPurityConfigViewComponent implements OnInit, OnDestroy {
  GepPurityConfigEnumsRef = GepPurityConfigEnums;
  gepDetails: GepDetails;
  purityDetails$: Observable<PurityDetailsResponse[]>;
  configId: string;
  tabType = GepPurityConfigEnums.PURITY_DETAILS;
  destroy$ = new Subject<null>();
  metalTypes$: Observable<MetalType[]> = null;
  itemTypes$: Observable<Lov[]> = null;
  goldRanges$: Observable<Ranges[]> = null;
  silverRanges$: Observable<Ranges[]> = null;
  platinumRanges$: Observable<Ranges[]> = null;
  dateFormat: string;
  isLoading$: Observable<boolean>;
  excludeThemeCodes: ExcludeThemeCodes[] = [];
  excludeItemCodes: ExcludeItemCodes[] = [];
  excludeItemCodesPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  productGroupsMap: Map<string, string> = new Map();
  pageSize: number;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  totalItemCodes$: Observable<number>;
  productGroups: ProductGroup[];
  productGroupsCount$: Observable<number>;
  productGroupsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  mappedGroups: any = [];
  mappedLocations = [];
  groupsDediction: Map<string, {}> = new Map<string, any>();
  expanded = true;
  constructor(
    private gepPurityConfigFacade: GEPPurityConfigFacade,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private locationMappingFacade: LocationMappingFacade,
    private selectionDialog: SelectionDialogService,
    private appSettingFacade: AppsettingFacade,
    @Inject(POSS_WEB_CURRENCY_CODE) public currencyCode,

  ) {
    this.tabType = GepPurityConfigEnums.PURITY_DETAILS;
  }
  ngOnInit(): void {
    console.log('viewpage is loaded');
    this.locationMappingFacade.resetMappedLocations();
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        this.excludeItemCodesPageEvent.pageSize = this.pageSize;
        this.productGroupsPageEvent.pageSize = this.pageSize;
      });
    this.gepPurityConfigFacade.loadMetalTypes();
    this.gepPurityConfigFacade.loadItemTypes();
    this.gepPurityConfigFacade.loadGoldRanges('GEP_GOLD_PURITY');
    this.gepPurityConfigFacade.loadSilverRanges('GEP_SILVER_PURITY');
    this.gepPurityConfigFacade.loadPlatinumRanges('GEP_PLATINUM_PURITY');
    this.gepPurityConfigFacade.loadProductGroups();
    this.configId = this.activatedRoute.snapshot.params['_configName'];
    this.tabType = this.activatedRoute.snapshot.params['_tabType'];
    this.tabType = GepPurityConfigEnums.PURITY_DETAILS;
    this.isLoading$ = this.gepPurityConfigFacade.getIsLoading();
    this.totalItemCodes$ = this.gepPurityConfigFacade.getTotalItemCodes();
    if (this.configId) {
      this.gepPurityConfigFacade.loadGepDetails(this.configId);
      this.gepPurityConfigFacade.loadGepPurityDetails(this.configId);
      this.gepPurityConfigFacade.loadExcludeThemeCodes(this.configId);
      this.loadExcludeItemCodes();
      this.loadProductGroupDeduction();
      this.locationMappingFacade.loadMappedLocations({
        ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
        ruleID: this.configId
      });
    }
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mappedLocations: any) => {
        if (mappedLocations) {
          this.mappedLocations = mappedLocations;
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

    this.purityDetails$ = this.gepPurityConfigFacade.getPurityDetails();
    this.gepPurityConfigFacade
      .getGepDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gepDetails: GepDetails) => {
        if (gepDetails) {
          this.gepDetails = gepDetails;
        }
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        this.dateFormat = dateFormat;
      });
    this.metalTypes$ = this.gepPurityConfigFacade.getMetalTypes();
    this.itemTypes$ = this.gepPurityConfigFacade.getItemTypes();
    this.goldRanges$ = this.gepPurityConfigFacade.getGoldRanges();
    this.silverRanges$ = this.gepPurityConfigFacade.getSilverRanges();
    this.platinumRanges$ = this.gepPurityConfigFacade.getPlatinumRanges();
    this.productGroupsCount$ = this.gepPurityConfigFacade.getProductGroupsCount();
    this.gepPurityConfigFacade
      .getExcludeThemeCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((excludeThemeCodes: ExcludeThemeCodes[]) => {
        if (excludeThemeCodes) {
          this.excludeThemeCodes = excludeThemeCodes;
        }
      });
    this.gepPurityConfigFacade
      .getExcludeItemCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((excludeItemCodes: ExcludeItemCodes[]) => {
        if (excludeItemCodes) {
          this.excludeItemCodes = excludeItemCodes;
        }
      });
    this.gepPurityConfigFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups) {
          this.productGroupsMap = new Map();
          productGroups.forEach((groups: ProductGroup) => {
            this.productGroupsMap.set(
              groups.productGroupCode,
              groups.description
            );
          });
        }
      });
    this.gepPurityConfigFacade
      .getProductGroupsDeduction()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroupsDeduction: ProductGroupsDeduction[]) => {
        if (productGroupsDeduction) {
          this.gepPurityConfigFacade.loadProductGroups();
          this.mappedGroups = [];
          this.groupsDediction = new Map();
          for (const deduction of productGroupsDeduction) {
            if (!this.groupsDediction.has(deduction.productGroupCode)) {
              this.groupsDediction.set(deduction.productGroupCode, {
                productGroupCode: deduction.productGroupCode,
                id: deduction.id,
                [deduction.rangeId]: deduction.percentValue,
                configId: deduction.configId,
                description: this.productGroupsMap.get(
                  deduction.productGroupCode
                ),
                rivaahAdditionalDiscount: deduction.rivaahAdditionalDiscount
              });
            } else {
              this.groupsDediction.set(deduction.productGroupCode, {
                ...this.groupsDediction.get(deduction.productGroupCode),
                [deduction.rangeId]: deduction.percentValue,
                id:
                  this.groupsDediction.get(deduction.productGroupCode)['id'] +
                  ',' +
                  deduction.id,
                  rivaahAdditionalDiscount: deduction.rivaahAdditionalDiscount
              });
            }
          }
          for (const values of Array.from(this.groupsDediction.values())) {
            this.mappedGroups.push(values);
          }
          this.productGroups = [];
        }
      });
  }
  loadExcludeItemCodes() {
    this.gepPurityConfigFacade.loadExcludeItemCodes({
      configId: this.configId,
      pageIndex: this.excludeItemCodesPageEvent.pageIndex,
      pageSize: this.excludeItemCodesPageEvent.pageSize
    });
  }
  loadProductGroupDeduction() {
    this.gepPurityConfigFacade.loadProductGroupsDeduction({
      configId: this.configId,
      pageIndex: this.productGroupsPageEvent.pageIndex,
      pageSize: this.productGroupsPageEvent.pageSize
    });
  }
  tab(tabType: GepPurityConfigEnums) {
    this.router.navigate([getGepPurityConfigViewUrl(this.configId)]);
    this.tabType = tabType;
  }
  back() {
    this.router.navigate([getGepPurityConfigurationRouteUrl()]);
    this.gepPurityConfigFacade.resetGepPurityConfiguration();
  }
  paginate(pageEvent: PageEvent) {
    this.excludeItemCodesPageEvent = pageEvent;
    this.loadExcludeItemCodes();
  }
  clearGridSearch(event: boolean) {
    this.loadExcludeItemCodes();
  }
  productGroupPaginator(pageEvent: PageEvent) {
    this.productGroupsPageEvent = pageEvent;
    this.loadProductGroupDeduction();
  }
  excludeItemCodeSearch(searchValue) {
    if (fieldValidation.itemCodeField.pattern.test(searchValue)) {
      this.gepPurityConfigFacade.searchItemCodes({
        itemCode: searchValue.toUpperCase(),
        configId: this.configId
      });
    } else {
      this.excludeItemCodes = [];
    }
  }
  search(searchValue) {
    if (fieldValidation.productGroupCodeField.pattern.test(searchValue)) {
      this.gepPurityConfigFacade.searchProductGroup({
        searchValue: searchValue.toUpperCase(),
        configId: this.configId
      });
    } else {
      this.mappedGroups = [];
      this.productGroups = [];
    }
  }
  openViewLocationMapping() {
    this.selectionDialog
      .open({
        title: 'Mapped Locations',
        placeholder: 'Search Location',
        options: this.mappedLocations,
        isPopupClosed: false
      })
      .pipe(take(1))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
        }
      });
  }
  clearSearch() {
    this.loadProductGroupDeduction();
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
