import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DiscountConfigFacade } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  AdditionalMaxValueOrPercentage,
  AlertPopupServiceAbstraction,
  BrandSummary,
  CategoryDiscountPGConfigItem,
  CustomErrors,
  DiscountAbCoData,
  DiscountBasedOnEnum,
  DiscountBasedOnTypesEnum,
  DiscountConfigTabEnum,
  DiscountEnums,
  DiscountExcludeConfig,
  DiscountExcludeConfigTabEnum,
  DiscountExcludeItemCodes,
  DiscountExcludeThemeCode,
  DiscountLocationList,
  DiscountLOVTypes,
  DiscountLovTypesEnum,
  DiscountProductCategoryList,
  DiscountProductGroupList,
  DiscountProductGroupTypeEnum,
  DiscountTypeEnum,
  EmpowerConfigItem,
  ExcludeItemList,
  LocationFilterOption,
  Lov,
  MappedDetails,
  MaxValueOrPercentage,
  NewDiscountApplicableConfig,
  NewDiscountApplicableTheme,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductGroupMappingOption,
  ProductGroupTypesEnum,
  SlabConfig,
  SlabConfigItem,
  StatusTypesEnum,
  WeightRange
} from '@poss-web/shared/models';
import { ProductGroupMappingFacade } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import {
  getDiscountConfigListRouteUrl,
  getDiscountConfigRequestViewRouteUrl,
  getDiscountConfigRquestRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-discount-config-view',
  templateUrl: './discount-config-view.component.html',
  styleUrls: ['./discount-config-view.component.scss']
})
export class DiscountConfigViewComponent implements OnInit, OnDestroy {
  expanded = true;
  utcOffset = moment().startOf('day').utcOffset();
  pcMappingTabDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];
  pgMappingTabDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT
  ];
  pgUcpMcMappingTabDiscounts = [DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT];
  pgSchemeMappingTabDiscounts = [DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT];
  referBestDealTabDiscounts = [
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];
  excludeTabDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];

  locationMappingTabDiscounts = [
    DiscountTypeEnum.CATEGORY_DISCOUNT,
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.ULP_BIRTHDAY,
    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY,
    DiscountTypeEnum.ULP_ANNIVERSARY,
    DiscountTypeEnum.BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT,
    DiscountTypeEnum.COIN_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.TSSS_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
    DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT,
    DiscountTypeEnum.EMPOWERMENT_DISCOUNT,
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT,
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
  ];
  exchangeOfferTabDiscounts = [DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT];
  slabConfigTabDiscounts = [
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];

  applicableThemeTabDiscounts = [DiscountTypeEnum.HIGH_VALUE_DISCOUNT];
  maxConfigTabDiscounts = [
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT
  ];

  rivaahMaxConfigTabDiscounts = [
    DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT,
    DiscountTypeEnum.BEST_DEAL_DISCOUNT
  ];
  empowermentConfigTabDiscounts = [DiscountTypeEnum.EMPOWERMENT_DISCOUNT];

  ageConfigTabDiscounts = [DiscountTypeEnum.BEST_DEAL_DISCOUNT];

  tsssConfigTabDiscounts = [DiscountTypeEnum.TSSS_DISCOUNT];
  params: string;
  tabType: string;

  selectedTab = DiscountConfigTabEnum.DISCOUNT_APPILICABLE;

  destroy$ = new Subject<null>();

  isLoading$: Observable<boolean>;

  discountTypeEnumRef = DiscountTypeEnum;
  discountConfigTabEnumRef = DiscountConfigTabEnum;
  pageSizeOptions: number[];
  minPageSize: number;

  excludeComplexity: DiscountExcludeConfig[] = [];
  excludeMC: DiscountExcludeConfig[] = [];
  excludeThemeCodes: DiscountExcludeThemeCode[] = [];
  isABOfferApplicable = false;
  isCOOfferApplicable = false;
  isPreviewApplicable = false;
  isRIVAAHOfferApplicable = false;

  isActive = true;
  discountTypes;
  selectedLevels: LocationFilterOption[] = [];
  lotBinAgeConfig: {
    isSameDiscountApplicable: boolean;
    fromLotAge: number;
    toLotAge: number;
    fromBinAge: number;
    toBinAge: number;
  } = {
    isSameDiscountApplicable: true,
    fromLotAge: 0,
    toLotAge: 0,
    fromBinAge: 0,
    toBinAge: 0
  };

  maxValueConfig: MaxValueOrPercentage;
  addMaxValueConfig: AdditionalMaxValueOrPercentage;
  slabConfig: SlabConfig = {
    isSingle: true,
    valuePerWeightType: 'GrossWt',
    discountBasedOn: DiscountBasedOnEnum.WEIGHT_BASED,
    discountBasedOnType: DiscountBasedOnTypesEnum.GROSS_WEIGHT,
    isNew: true
  };

  categoryDiscountMappedPG = new Subject<ProductGroupMappingOption[]>();

  slabConfigItems: SlabConfigItem[] = [];
  empowerConfigDetailsList: EmpowerConfigItem[] = [];

  pgConfigValuePerWeightType: string = 'GrossWt';

  abCoData: DiscountAbCoData = {
    abPreview: null,
    coPreview: null,
    abPostPreview: null,
    coPostPreview: null
  };
  categoryDiscountPGConfigItems: CategoryDiscountPGConfigItem[] = [];

  discountApplicableTheme: NewDiscountApplicableTheme = {
    applicableThemes: {
      type: DiscountTypeEnum.HIGH_VALUE_DISCOUNT,
      data: {
        digit1: false,
        digit2: false,
        digit3: false,
        digit4: false,
        digit5: false,
        digit6: false,
        digit8: false,
        digit9: false,
        digit10: false,
        digit11: false,
        digit12: false,
        digit13: false,
        digit14: false
      }
    }
  };

  productGroupTypes: string[] = [
    ProductGroupTypesEnum.STUDDED,
    ProductGroupTypesEnum.PLAIN,
    ProductGroupTypesEnum.MIA
  ];

  currentDate = moment();

  durations;
  excludeItemCodes: DiscountExcludeItemCodes[] = [];

  selectedDiscounts = [];

  // TODO : Take it from location data
  currencyCode = 'INR';

  selectedDiscount: any = DiscountTypeEnum.CATEGORY_DISCOUNT;
  discountDetails$: Observable<any>;
  mappedLocations$: Observable<DiscountLocationList[]>;
  productGroups$: Observable<DiscountProductGroupList[]>;
  productCategories$: Observable<DiscountProductCategoryList[]>;
  excludeConfigs$: Observable<ExcludeItemList[]>;
  totalLocations$: Observable<number>;
  totalProductCategories$: Observable<number>;
  totalProductGroups$: Observable<number>;
  bestDealDiscount$: Observable<any>;
  totalBestDealDiscount$: Observable<number>;
  discountDetails: NewDiscountApplicableConfig;
  editDiscountApplicableTheme: any;
  allBeasDealDiscount: any;
  mappedBestDealDiscount$: Observable<any>;

  pageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  locationPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  productCategoryPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  productGroupPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  excludeConfigPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 10
  };
  select;
  invalidSearch = false;
  bestDealDiscountRequestPayload = {
    discountType: this.discountTypeEnumRef.BEST_DEAL_DISCOUNT,
    isPageable: false,
    isActive: true
  };
  selectedLocations: MappedDetails[] = [];
  selectedProductCategories: MappedDetails[] = [];
  selectedProductGroups: MappedDetails[] = [];
  selectedBestDealDiscount: MappedDetails[];
  filteredProductGroups = [];
  fileResponse;
  fileError: boolean;
  excludeItemCodes$: Observable<ExcludeItemList[]>;
  totalExcludeItemCodes$: Observable<number>;
  excludeSchemeCodesCount$: Observable<number>;
  dirty: boolean;
  karatType: any;
  productGroupFilter = false;
  excludeType: any;
  applicableLevels: Lov[];
  subBrands: BrandSummary[];
  disable = true;
  subBrandsdropDown: any[];
  brandsDropDown: any[];
  brandCode: string;
  durations$: Observable<WeightRange[]>;
  isLocationData = false;
  isCategoryPgData = false;
  isSlabData = false;
  isTsssComputed = false;
  saveHeaderData = false;
  clubbingDiscountTypes: DiscountLOVTypes[];
  approvers: DiscountLOVTypes[];
  succesMsg = '';
  totalSelectedBestDealDiscount$: Observable<number>;
  locationCodes = [];
  offerStartDate = null;
  offerEndDate = null;
  previewStartDate = null;
  previewEndDate = null;
  panelStatus: boolean[] = [];
  productType = DiscountProductGroupTypeEnum.PRODUCT_GROUP_UCP;
  excludeSchemeCodes = [];
  isApplicableField = true;
  @ViewChild('requestSentSuccessNotificationTemplate', { static: true })
  private requestSentSuccessNotificationTemplate: TemplateRef<any>;

  constructor(
    private translate: TranslateService,
    private appSettingFacade: AppsettingFacade,
    private activatedRoute: ActivatedRoute,
    public discountConfigFacade: DiscountConfigFacade,
    private router: Router,
    private productGroupMappingFacade: ProductGroupMappingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  ngOnInit(): void {
    for (let i = 0; i <= 16; i++) {
      this.panelStatus[i] = true;
    }

    this.discountConfigFacade.resetDiscounts();
    this.isLoading$ = this.discountConfigFacade.getIsloading();
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = JSON.parse(data.toString());
        this.locationPageEvent.pageSize = pageSize;
        this.productCategoryPageEvent.pageSize = pageSize;
        this.productGroupPageEvent.pageSize = pageSize;
      });

    this.discountConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.discountConfigFacade
      .getEmailResentStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(respnse => {
        if (respnse) {
          this.showNotifications(respnse);
        }
      });

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.params = param['_configId'];
        this.tabType = param['tab'];

        if (this.tabType !== 'discount') {
          this.showCancelNotification();
        }
        if (this.params !== DiscountEnums.NEW) {
          this.discountConfigFacade.loadDiscDetails({
            discountId: this.params
          });
          this.discountConfigFacade.loadEmpowermentDiscDetails({
            discountId: this.params
          });
        }
      });

    this.loadLocationList();
    this.loadProductCategoryList();
    this.loadProductGroupList();
    this.loadBestDealDiscount();
    this.loadBestDealDiscount();
    this.loadExcludeConfigList();

    this.isLoading$ = this.discountConfigFacade.getIsloading();
    this.durations$ = this.discountConfigFacade.getTEPDurationRange();
    this.discountDetails$ = this.discountConfigFacade.getDiscountDetails();
    this.mappedLocations$ = this.discountConfigFacade.getDiscountLocationDetails();
    this.totalLocations$ = this.discountConfigFacade.getTotalDiscountLocations();
    this.productCategories$ = this.discountConfigFacade.getDiscountProductCategoryDetails();
    this.totalProductCategories$ = this.discountConfigFacade.getTotalDiscountProductCategories();
    this.productGroups$ = this.discountConfigFacade.getDiscountProductGroupDetails();
    this.totalProductGroups$ = this.discountConfigFacade.getTotalDiscountProductGroups();
    this.excludeConfigs$ = this.discountConfigFacade.getDiscountExcludeTypeDetails();
    this.totalExcludeItemCodes$ = this.discountConfigFacade.getTotalDiscountExcludeItemCodes();
    this.excludeSchemeCodesCount$ = this.discountConfigFacade.getTotalDiscountExcludeTypes();
    this.excludeItemCodes$ = this.discountConfigFacade.getDiscountExcludeItemCodes();
    this.bestDealDiscount$ = this.discountConfigFacade.getBestDealDiscountList();
    this.totalBestDealDiscount$ = this.discountConfigFacade.getBestDealDiscountCount();
    this.totalSelectedBestDealDiscount$ = this.discountConfigFacade.getSelectedBestDealDiscountCount();
    this.mappedLocations$.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val) console.log('data123', val);
    });
    this.discountConfigFacade.loadDiscountDetails(this.params);
    this.discountConfigFacade.loadDiscountTypes(
      DiscountLovTypesEnum.DISCOUNT_TYPE
    );
    this.discountConfigFacade.loadClubbingDiscountTypes(
      DiscountLovTypesEnum.CLUBBING_DISCOUNT_TYPE
    );
    this.discountConfigFacade.loadApprovers(
      DiscountLovTypesEnum.APPROVAL_ROLES
    );
    this.discountConfigFacade.loadApplicableLevels(DiscountEnums.OWNERTYPE);
    this.discountConfigFacade.loadTEPDurationRange();
    this.discountConfigFacade.loadBrands();

    this.discountConfigFacade
      .getDiscountTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => {
        if (types) {
          this.discountTypes = [];
          types.forEach(type => {
            this.discountTypes.push({
              value: type.code,
              description: type.value
            });
          });
        }
      });
    this.discountConfigFacade
      .getClubbingDiscountTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(clubbingType => {
        if (clubbingType) {
          this.clubbingDiscountTypes = [];
          clubbingType.forEach(type => {
            this.clubbingDiscountTypes.push({
              value: type.code,
              description: type.value
            });
          });
        }
      });
    this.discountConfigFacade
      .getApprovers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(approvers => {
        if (approvers) {
          this.approvers = [];
          approvers.forEach(type => {
            this.approvers.push({
              value: type.code,
              description: type.value
            });
          });
        }
      });
    this.discountConfigFacade
      .getApplicableLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe(levels => {
        if (levels) {
          this.applicableLevels = levels;
        }
      });
    this.discountConfigFacade
      .getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brands => {
        if (brands) {
          this.brandsDropDown = [];
          brands.forEach(type => {
            this.brandsDropDown.push({
              value: type.brandCode,
              description: type.brandCode
            });
          });
          if (this.params === DiscountEnums.NEW) {
            this.discountConfigFacade.loadSubBrands(
              this.brandsDropDown[0].value
            );
          }
        }
      });
    this.discountConfigFacade
      .getSubBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe(subBrands => {
        if (subBrands) {
          this.subBrandsdropDown = [];
          subBrands.forEach(type => {
            this.subBrandsdropDown.push({
              value: type.brandCode,
              description: type.brandCode
            });
          });
        }
      });
    this.productGroupMappingFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        if (productGroups.length !== 0) {
          if (this.productGroupFilter) {
            this.filteredProductGroups = productGroups.map(
              p => p.productGroupCode
            );
            this.loadProductGroupList();
          }
        }
      });
    this.discountConfigFacade
      .getDiscountDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discDetails => {
        if (
          discDetails &&
          discDetails.id &&
          discDetails.id !== DiscountEnums.NEW
        ) {
          this.saveHeaderData = false;
          this.lotBinAgeConfig = discDetails?.configDetails?.data;
          this.brandCode = discDetails?.brandCode;
          this.discountConfigFacade.loadSubBrands(this.brandCode);
          this.selectedDiscount = discDetails?.discountType;
          if (
            this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
          ) {
            this.isApplicableField = false;
          } else {
            this.isApplicableField = true;
          }
          this.loadExcludeConfigList();
          this.loadProductGroupList();
          if (
            this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
            this.selectedDiscount === DiscountTypeEnum.TSSS_DISCOUNT ||
            this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT ||
            this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT ||
            this.selectedDiscount === DiscountTypeEnum.ULP_ANNIVERSARY ||
            this.selectedDiscount === DiscountTypeEnum.ULP_BIRTHDAY ||
            this.selectedDiscount === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY
          )
            this.loadPGMappingWithCharges({
              pgType: null,
              pageIndex: this.productGroupPageEvent.pageIndex,
              pageSize: this.productGroupPageEvent.pageSize
            });
          // setTimeout(() => {
          this.router.navigate([
            getDiscountConfigRequestViewRouteUrl(
              this.tabType,
              discDetails.id?.toUpperCase()
            )
          ]);
          // }, 1000);
        }
      });
    if (this.params !== DiscountEnums.NEW) {
      this.discountConfigFacade.loadSelectedProductCategories({
        id: this.params
      });
      this.discountConfigFacade.loadSelectedProductGroups({
        id: this.params,
        karatType: this.karatType ? this.karatType : null
      });
      this.discountConfigFacade.loadSelectedLocations({
        id: this.params
      });
    }
    this.discountConfigFacade
      .getSelectedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.selectedLocations = selectedLocations;
          if (this.selectedLocations.length !== 0) {
            this.isLocationData = true;
          } else this.isLocationData = false;
        }
      });
    this.discountConfigFacade
      .getIsDiscountApproved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (data === StatusTypesEnum.CANCEL_AFTER_REQUEST) {
            this.succesMsg = StatusTypesEnum.CANCELED;
          }
          this.showRequestSentSuccessMessageNotification();
        }
      });

    this.discountConfigFacade
      .getSelectedProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedProductCategories => {
        if (selectedProductCategories && selectedProductCategories.length) {
          this.selectedProductCategories = selectedProductCategories;
        }
      });
    this.discountConfigFacade
      .getSelectedBestDealDiscount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedBestDealDiscount => {
        if (selectedBestDealDiscount) {
          this.selectedBestDealDiscount = selectedBestDealDiscount;
        }
      });
    this.discountConfigFacade
      .getSelectedProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedProductGroups => {
        if (selectedProductGroups) {
          this.selectedProductGroups = selectedProductGroups;
        }
      });

    this.discountConfigFacade
      .getSlabDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.isSlabData = true;
          this.discountConfigFacade.loadDiscDetails({
            discountId: this.params
          });
        }
      });
    this.discountDetails$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (
        data &&
        (data.abCoData ||
          data.tepDetails ||
          data.grnDetails ||
          data.basicCriteria ||
          data.clubOtherOffersConfig ||
          data.clubDiscountType ||
          data.cumulativeDetails ||
          data.itemGroupConfig ||
          data.configDetails)
      ) {
        this.discountDetails = data;
        this.isABOfferApplicable = data.isAbOfferApplicable;
        this.isCOOfferApplicable = data.isCoOfferApplicable;
        this.isPreviewApplicable = data.isPreviewApplicable;
        this.isRIVAAHOfferApplicable = data.isRiva;
      }
      if (data?.applicableLevels?.length) {
        this.selectedLevels = data.applicableLevels.map(location => ({
          id: location,
          description: location
        }));
      }

      if (data && data.abCoData && data.abCoData.data) {
        this.abCoData = data.abCoData.data;
      }
      if (data && data.applicableThemes) {
        this.editDiscountApplicableTheme = data;
      }
      if (data && data.itemGroupConfig) {
        this.maxValueConfig = data.itemGroupConfig.data;
      }
      if (data && data.rivaahItemGroupConfig) {
        console.log(data.rivaahItemGroupConfig.data);
        this.addMaxValueConfig = data.rivaahItemGroupConfig.data;
      }
      if (data && data.configDetails) {
        this.lotBinAgeConfig = data.configDetails.data;
      }
      if (data && data.referOtherDiscounts) {
        this.bestDealDiscount$
          .pipe(takeUntil(this.destroy$))
          .subscribe(discounts => {
            if (discounts) {
              this.allBeasDealDiscount = discounts.filter(
                disc => disc.id !== data.referOtherDiscounts
              );
              const selectedDisc = discounts.filter(
                disc => disc.id === data.referOtherDiscounts
              );
              this.selectedDiscounts = selectedDisc.map(val => {
                return {
                  id: val.id,
                  description: val.description
                };
              });
            }
          });
      }
    });

    this.excludeConfigs$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.excludeThemeCodes = [];
        this.excludeMC = [];
        this.excludeComplexity = [];
        this.excludeSchemeCodes = [];
        data.forEach(config => {
          if (config.excludeType === DiscountExcludeConfigTabEnum.THEME_CODE) {
            this.excludeThemeCodes.push({
              id: config.id,
              themeCode: config.themeCode,
              isActive: config.isActive
            });
          } else if (
            config.excludeType === DiscountExcludeConfigTabEnum.ITEM_CODE
          ) {
            this.excludeItemCodes.push({
              id: config.id,
              itemCode: config.itemCode,
              isActive: config.isExcluded
            });
          } else if (
            config.excludeType === DiscountExcludeConfigTabEnum.PER_GRAM_MC
          ) {
            this.excludeMC.push({
              id: config.id,
              fromValue: config.fromValue,
              toValue: config.toValue,
              isActive: config.isActive
            });
          } else if (
            config.excludeType === DiscountExcludeConfigTabEnum.COMPLEXITY
          ) {
            this.excludeComplexity.push({
              id: config.id,
              fromValue: config.fromValue,
              toValue: config.toValue,
              isActive: config.isActive
            });
          } else if (
            config.excludeType === DiscountExcludeConfigTabEnum.SCHEME_CODE
          ) {
            this.excludeSchemeCodes.push({
              id: config.id,
              schemeCode: config.schemeCode,
              isActive: config.isActive
            });
          }
        });
      }
    });
    this.excludeItemCodes$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data) {
        this.excludeItemCodes = [];
        data.forEach(config => {
          if (config.excludeType === DiscountExcludeConfigTabEnum.ITEM_CODE) {
            this.excludeItemCodes.push({
              id: config.id,
              itemCode: config.itemCode,
              isActive: config.isExcluded
            });
          }
        });
      }
    });

    this.discountConfigFacade
      .getEmpowermentDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(empowerDetail => {
        if (empowerDetail.length !== 0) {
          this.empowerConfigDetailsList = empowerDetail;
        } else {
          this.empowerConfigDetailsList = [];
        }
      });

    this.discountConfigFacade
      .getEmpowermentUpdatedDiscount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((addedEmpowerment: any) => {
        if (addedEmpowerment !== null) {
          this.discountConfigFacade.loadEmpowermentDiscDetails({
            discountId: this.params
          });
        }
      });

    this.discountConfigFacade
      .getDiscDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discDetails => {
        if (discDetails.length !== 0) {
          this.isSlabData = true;
          this.slabConfigItems = [];
          this.slabConfig = {
            isSingle: discDetails[0].isSingle,
            valuePerWeightType: discDetails[0].valuePerWeightType,
            discountBasedOn: discDetails[0].discountCategory,
            discountBasedOnType: discDetails[0].eligibility,
            isNew: false
          };
          discDetails.forEach(element => {
            // TODO : Add check to load or  categoryDiscountPGConfigItem
            const newSlab: SlabConfigItem = {
              id: element.id,
              rowId: element.rowId,
              slabName: element.slabName,
              min: element.minValue,
              max: element.maxValue,
              discountBasedOn: element.discountCategory,
              isSingle: element.isSingle,
              discountBasedOnType: element.eligibility,
              regular: element.discountComponents.regular,
              preview: element.discountComponents.preview,
              ab: element.discountComponents.ab,
              co: element.discountComponents.co,
              riva: element.discountComponents.riva,
              isActive: element.isActive
            };
            this.slabConfigItems.push(newSlab);
          });
        } else {
          this.isSlabData = false;
          this.slabConfigItems = [];
          this.slabConfig = {
            isSingle: true,
            valuePerWeightType: 'GrossWt',
            discountBasedOn: DiscountBasedOnEnum.WEIGHT_BASED,
            discountBasedOnType: DiscountBasedOnTypesEnum.GROSS_WEIGHT,
            isNew: true
          };
        }
      });

    this.discountConfigFacade
      .getDiscountComponentPGConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(details => {
        this.categoryDiscountPGConfigItems = [];
        if (details && details.length !== 0) {
          this.isCategoryPgData = true;

          details.forEach(element => {
            this.categoryDiscountPGConfigItems.push({
              id: element.id,
              rowId: element.rowId,
              isActive: element.isActive,
              productGroupCount: element.productGroupCount,
              regular: element.discountComponents.regular,
              preview: element.discountComponents.preview,
              co: element.discountComponents.co,
              ab: element.discountComponents.ab,
              riva: element.discountComponents.riva
            });
            this.pgConfigValuePerWeightType = element.valuePerWeightType;
          });
        } else this.isCategoryPgData = false;
      });
  }
  toggleAccordion() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      for (let i = 0; i <= 16; i++) {
        this.panelStatus[i] = true;
      }
    } else {
      for (let i = 0; i <= 16; i++) {
        this.panelStatus[i] = false;
      }
    }
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (
          event.eventType === OverlayNotificationEventType.CLOSE &&
          this.tabType !== 'discount'
        ) {
          this.showCancelNotification();
        }
      });
  }
  enableTab(applicableDiscounts) {
    return applicableDiscounts.includes(this.selectedDiscount);
  }

  loadProductGroups(discountDetailsId) {
    this.discountConfigFacade.loadMappedProductGroupByConfigId(
      this.discountDetails.id,
      discountDetailsId
    );
  }

  loadBestDealDiscount(data?) {
    this.invalidSearch = false;
    this.discountConfigFacade.loadBestDealDiscountList(
      this.bestDealDiscountRequestPayload
    );
    this.discountConfigFacade.loadSelectedBestDealDiscount({
      id: this.params,
      pageIndex: data?.pageEvent?.pageIndex
        ? data.pageEvent.pageIndex
        : this.pageEvent.pageIndex,
      pageSize: data?.pageEvent?.pageSize
        ? data.pageEvent.pageSize
        : this.pageEvent.pageSize
    });
  }

  loadLocationList(data?) {
    this.locationCodes = data?.searchValue
      ? data.searchValue
      : this.locationCodes;
    this.offerStartDate = data?.offerStartDate
      ? data.offerStartDate.format('YYYY-MM-DD')
      : data?.clearOffer
      ? null
      : this.offerStartDate;
    this.offerEndDate = data?.offerEndDate
      ? data.offerEndDate.format('YYYY-MM-DD')
      : data?.clearOffer
      ? null
      : this.offerEndDate;
    this.previewStartDate = data?.previewStartDate
      ? data.previewStartDate.format('YYYY-MM-DD')
      : data?.clearPreview
      ? null
      : this.previewStartDate;
    this.previewEndDate = data?.previewEndDate
      ? data.previewEndDate.format('YYYY-MM-DD')
      : data?.clearPreview
      ? null
      : this.previewEndDate;
    console.log(
      this.offerStartDate,
      this.offerEndDate,
      this.previewStartDate,
      this.previewEndDate,
      'offer filterdates'
    );

    this.invalidSearch = false;
    this.discountConfigFacade.loadDiscountLocationList({
      id: this.params,
      pageSize: this.locationPageEvent.pageSize,
      pageIndex: data?.pageEvent?.pageIndex
        ? data.pageEvent.pageIndex
        : this.locationPageEvent.pageIndex,
      locationCode: this.locationCodes,
      offerEndDate: this.offerEndDate,
      offerStartDate: this.offerStartDate,
      previewEndDate: this.previewEndDate,
      previewStartDate: this.previewStartDate
    });
    this.discountConfigFacade.loadSelectedLocations({
      id: this.params
    });
  }

  clearLocationList() {
    this.locationCodes = [];
    this.discountConfigFacade.loadDiscountLocationList({
      id: this.params,
      pageSize: this.locationPageEvent.pageSize,
      pageIndex: this.locationPageEvent.pageIndex,
      locationCode: [],
      offerEndDate: null,
      offerStartDate: null,
      previewEndDate: null,
      previewStartDate: null
    });
    this.discountConfigFacade.loadSelectedLocations({
      id: this.params
    });
  }
  loadProductCategoryList(data?) {
    this.invalidSearch = false;
    this.discountConfigFacade.loadDiscountProductCategoryList({
      id: this.params,
      pagination: data ? data.pageEvent : this.productCategoryPageEvent,
      productCategoryCode: data
        ? data.searchValue
          ? data.searchValue.toUpperCase()
          : null
        : null
    });
  }
  filterProductGroups(pgType) {
    this.productGroupFilter = true;
    this.productGroupMappingFacade.loadProductGroups(pgType);
  }

  loadProductGroupList(data?) {
    this.productGroupFilter = false;
    if (data) {
      this.productType = data.productType;
    }

    if (data) this.karatType = data.karatType;
    this.discountConfigFacade.loadDiscountProductGroupList({
      id: this.params,
      pagination: data ? data.pageEvent : this.productGroupPageEvent,
      karatType: this.karatType ? this.karatType : null,
      productType: this.productType ? this.productType : null,
      productGroupCodeList: data
        ? data?.searchValue
          ? [data?.searchValue]
          : null
        : this.filteredProductGroups.length
        ? this.filteredProductGroups
        : null
    });
    this.discountConfigFacade.loadSelectedProductGroups({
      id: this.params,
      karatType: this.karatType ? this.karatType : null,
      productType: this.productType ? this.productType : null
    });
    this.filteredProductGroups = [];
  }
  loadExcludeItemCodes(data?) {
    this.discountConfigFacade.loadExcludeItemCodes({
      id: this.params,
      // isPageable: true,
      pagination: data ? data.pageEvent : this.excludeConfigPageEvent,
      excludeType: DiscountExcludeConfigTabEnum.ITEM_CODE,
      itemCode: data ? data.searchItemCode : null
    });
  }
  loadExcludeConfigList(data?) {
    if (data) {
      this.excludeType = data;
    } else {
      this.excludeType =
        this.selectedTab === DiscountConfigTabEnum.SCHEME_MAPPING
          ? DiscountExcludeConfigTabEnum.SCHEME_CODE
          : DiscountExcludeConfigTabEnum.THEME_CODE;
    }
    if (this.excludeType === DiscountExcludeConfigTabEnum.THEME_CODE) {
      this.loadExcludeItemCodes();
      this.discountConfigFacade.loadExcludeTypeList({
        id: this.params,

        pagination: { pageIndex: 0, pageSize: 50 },
        excludeType: this.excludeType
      });
    } else {
      this.discountConfigFacade.loadExcludeTypeList({
        id: this.params,

        pagination: this.excludeConfigPageEvent,
        excludeType: this.excludeType,
        sort: true
      });
    }
  }
  binAgeSave(event) {
    this.discountConfigFacade.editDiscountDetails(this.params, event);
  }

  maxValConfig(event) {
    event = {
      itemGroupConfig: event
    };

    this.discountConfigFacade.editDiscountDetails(this.params, event);
  }
  back() {
    if (this.tabType !== 'discount') {
      this.router.navigate([getDiscountConfigRquestRouteUrl()], {
        state: { clearFilter: false }
      });
    } else {
      // setTimeout(() => {
      this.router.navigate([getDiscountConfigListRouteUrl()]);
      // }, 1500);
    }
  }
  discountApplicableChange(config: NewDiscountApplicableConfig) {
    console.log(config, 'test config');

    config = {
      ...config,
      clubbingDiscountType: config.clubDiscountType?.data?.discountType
        ? config.clubDiscountType?.data?.discountType
        : null,
      itemGroupConfig: {
        data: {
          maxMetalCharge: {
            percent: config.itemGroupConfig?.data.maxMetalChargePercentage,
            value: config.itemGroupConfig?.data.maxMetalChargeValue
          },
          maxStoneCharges: {
            percent: config.itemGroupConfig?.data.maxScPercentage,
            value: config.itemGroupConfig?.data.maxScValue
          },
          maxUCP: {
            percent: config.itemGroupConfig?.data.maxUcpPercentage,
            value: config.itemGroupConfig?.data.maxUcpValue
          },
          maxWastage: {
            percent: config.itemGroupConfig?.data.maxWcPercentage,
            value: config.itemGroupConfig?.data.maxWcValue
          },
          maxMC: {
            percent: config.itemGroupConfig?.data.maxMcPercentage,
            value: config.itemGroupConfig?.data.maxMcValue
          },
          maxPsPerGram: {
            percent: config.itemGroupConfig?.data.maxPerGramVaule,
            weight: config.itemGroupConfig?.data.maxPerGramVaule
          }
        },
        type:
          this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            ? DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
            : DiscountTypeEnum.BEST_DEAL_DISCOUNT
      }
    };
    this.discountConfigFacade.editDiscountDetails(this.params, config);
  }

  discountApplicableThemeChange(config: NewDiscountApplicableTheme) {
    this.discountConfigFacade.editDiscountDetails(this.params, config);
  }

  tsssConfigChange(config: NewDiscountApplicableConfig) {
    this.discountConfigFacade.editDiscountDetails(this.params, config);
  }
  paginateLocation(pageEvent: PageEvent) {
    this.locationPageEvent = pageEvent;
    this.loadLocationList();
  }
  paginate(pageEvent: PageEvent) {
    if (this.selectedTab === DiscountConfigTabEnum.PRODUCT_CATEGORY_MAPPING) {
      this.productCategoryPageEvent = pageEvent;
      this.loadProductCategoryList();
    }
    if (this.selectedTab === DiscountConfigTabEnum.PRODUCT_GROUP_MAPPING) {
      this.productGroupPageEvent = pageEvent;
      this.loadProductGroupList();
    }
    if (
      this.selectedTab === DiscountConfigTabEnum.EXCLUDE_CONFIG ||
      this.selectedTab === DiscountConfigTabEnum.SCHEME_MAPPING
    ) {
      this.excludeConfigPageEvent = pageEvent;
      this.loadExcludeConfigList();
    }
  }
  loadPGMappingWithCharges(data: {
    pgType: string;
    pageIndex: number;
    pageSize: number;
  }) {
    if (this.params !== DiscountEnums.NEW) {
      this.discountConfigFacade.loadDiscountComponentPGConfig({
        discountId: this.params,
        pgType: data.pgType,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize
      });
    }
  }
  loadSubBrands(event) {
    this.discountConfigFacade.loadSubBrands(event);
  }

  faqFileDownload(fileDownloadData) {
    this.discountConfigFacade.loadFaqFileDownload(fileDownloadData);
  }

  closed(i: number) {
    if (i === 17) {
      this.productType = DiscountProductGroupTypeEnum.PRODUCT_GROUP_UCP;
      this.loadProductGroupList();
    }
    this.panelStatus[i] = false;
  }
  opened(i: number) {
    this.panelStatus[i] = true;
  }

  ngOnDestroy(): void {
    this.discountConfigFacade.resetDiscounts();
    this.destroy$.next();
    this.destroy$.complete();
  }

  showCancelNotification() {
    const buttonKey1 = 'pw.discountConfig.resendButtonText';
    const buttonKey2 = 'pw.discountConfig.cancelButtonText';
    this.translate
      .get([buttonKey1, buttonKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: '',
            buttons: [
              {
                id: 1,
                text: translatedMessages[buttonKey1],
                css: 'pw-accent-btn',
                hasRemarksValidation: true
              },
              {
                id: 2,
                text: translatedMessages[buttonKey2],
                css: 'pw-primary-btn',
                hasRemarksValidation: true
              }
            ],
            hasRemarks: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            switch (event.selectedId) {
              case 1: {
                this.discountConfigFacade.loadEmailResendStatus(
                  this.discountDetails.workflowProcessId
                );

                break;
              }
              case 2: {
                this.approveOrCancelDiscount(
                  StatusTypesEnum.CANCEL_AFTER_REQUEST,
                  event.data
                );

                break;
              }
            }
          });
      });
  }

  approveOrCancelDiscount(status, value = null) {
    this.discountConfigFacade.approveorCancelDiscount({
      id: this.params,
      remarks: { remarks: value },
      approvalStatus: status
    });
  }

  showNotifications(key) {
    this.translate
      .get([key])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessages[key],
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.router.navigate([getDiscountConfigRquestRouteUrl()], {
              state: { clearFilter: false }
            });
          });
      });
  }

  showRequestSentSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.requestSentSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.router.navigate([getDiscountConfigRquestRouteUrl()], {
          state: { clearFilter: false }
        });
      });
  }
}
