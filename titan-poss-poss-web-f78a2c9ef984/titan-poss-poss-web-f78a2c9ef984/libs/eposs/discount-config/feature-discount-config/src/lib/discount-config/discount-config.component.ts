import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DiscountConfigFacade } from '@poss-web/eposs/discount-config/data-access-discount-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { DateFormatterService } from '@poss-web/shared/components/ui-formatters';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import {
  AdditionalMaxValueOrPercentage,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  BrandSummary,
  CategoryDiscountPGConfigItem,
  CustomErrors,
  DiscountAbCoData,
  DiscountBasedOnEnum,
  DiscountBasedOnTypesEnum,
  DiscountCompTypeEnum,
  DiscountConfigTabEnum,
  DiscountEnums,
  DiscountExcludeConfig,
  DiscountExcludeConfigTabEnum,
  DiscountExcludeItemCodes,
  DiscountExcludeSchemeCode,
  DiscountExcludeThemeCode,
  DiscountLocationList,
  DiscountLovTypesEnum,
  DiscountProductCategoryList,
  DiscountProductGroupList,
  DiscountProductGroupTypeEnum,
  DiscountTypeEnum,
  EmpowerConfigItem,
  ExcludeItemList,
  FileGroupEnum,
  FileNamesEnum,
  FilePathEnum,
  FileUploadPopupEnum,
  FileUploadTypeEnum,
  LocationFilterOption,
  Lov,
  MappedDetails,
  MaxValueOrPercentage,
  NewDiscountApplicableConfig,
  NewDiscountApplicableTheme,
  NewFileUploadResponse,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductGroupMappingOption,
  ProductGroupTypesEnum,
  SaveDiscountLocationsPayload,
  SelectDropDownOption,
  SlabConfig,
  SlabConfigItem,
  StatusTypesEnum,
  TSSSRequestPayload,
  WeightRange,
  DiscountApplicableEnum,
  FaqFileUploadResponse
} from '@poss-web/shared/models';
import { ProductGroupMappingFacade } from '@poss-web/shared/product-group-mapping/data-access-product-group-mapping';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  POSS_WEB_CURRENCY_CODE,
  POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE
} from '@poss-web/shared/util-config';
import {
  getDiscountConfigListRouteUrl,
  getDiscountConfigRequestRouteUrl,
  getDiscountConfigRquestRouteUrl,
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take, filter } from 'rxjs/operators';

const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-discount-config',
  templateUrl: './discount-config.component.html',
  styleUrls: ['./discount-config.component.scss']
})
export class DiscountConfigComponent implements OnInit, OnDestroy {
  utcOffset = moment().startOf('day').utcOffset();

  pcMappingTabDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
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
  pgMappingTabDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
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
  referBestDealTabDiscounts = [
    DiscountTypeEnum.SLAB_BASED_DISCOUNT,
    DiscountTypeEnum.HIGH_VALUE_DISCOUNT
  ];
  excludeTabDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
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
  pgSchemeMappingTabDiscounts = [DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT];

  locationMappingTabDiscounts = [
    DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT,
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
    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
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
  revertIsActiveToggle$ = new Subject<boolean>();
  isLoading$: Observable<boolean>;

  discountTypeEnumRef = DiscountTypeEnum;
  discountConfigTabEnumRef = DiscountConfigTabEnum;
  pageSizeOptions: number[];
  minPageSize: number;

  discountWorkflow = false;

  excludeComplexity: DiscountExcludeConfig[] = [];
  excludeMC: DiscountExcludeConfig[] = [];
  excludeThemeCodes: DiscountExcludeThemeCode[] = [];
  excludeSchemeCodes: DiscountExcludeSchemeCode[] = [];
  isABOfferApplicable = false;
  isCOOfferApplicable = false;
  isPreviewApplicable = false;
  isRiva = false;
  isActive = true;
  discountTypes: SelectDropDownOption[];
  selectedLevels: LocationFilterOption[] = [];
  remarksValue: string;

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
  succesMsg = '';

  maxValueConfig: MaxValueOrPercentage;
  addMaxValueConfig: AdditionalMaxValueOrPercentage;
  uploadResponse$: Observable<any>;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('requestSentSuccessNotificationTemplate', { static: true })
  private requestSentSuccessNotificationTemplate: TemplateRef<any>;

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

  selectedDiscount: any = DiscountTypeEnum.CATEGORY_DISCOUNT;
  discountDetails$: Observable<any>;
  mappedLocations$: Observable<DiscountLocationList[]>;
  productGroups$: Observable<DiscountProductGroupList[]>;
  productCategories$: Observable<DiscountProductCategoryList[]>;
  excludeConfigs$: Observable<ExcludeItemList[]>;
  totalLocations$: Observable<number>;
  totalProductCategories$: Observable<number>;
  totalProductGroups$: Observable<number>;
  totalSelectedBestDealDiscount$: Observable<number>;
  bestDealDiscount$: Observable<any>;
  totalBestDealDiscount$: Observable<number>;
  discountDetails: NewDiscountApplicableConfig;
  editDiscountApplicableTheme: any;
  allBeasDealDiscount: any;
  mappedBestDealDiscount$: Observable<any>;
  uploadedFaqFileData$: Observable<FaqFileUploadResponse>;
  downloadFileResponse$: Observable<any>;

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
  totalExcludeTypeCount$: Observable<number>;
  dirty: boolean;
  karatType;
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
  clubbingDiscountTypes: SelectDropDownOption[];
  approvers: SelectDropDownOption[];
  showViewOnly: boolean;
  isFilterApplied = false;
  locationCodes = [];
  offerStartDate = null;
  offerEndDate = null;
  previewStartDate = null;
  previewEndDate = null;
  productType = DiscountProductGroupTypeEnum.PRODUCT_GROUP_UCP;
  discountsLabel: string;

  constructor(
    private translate: TranslateService,
    private dateFormatterService: DateFormatterService,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private activatedRoute: ActivatedRoute,
    public discountConfigFacade: DiscountConfigFacade,
    private router: Router,
    private fileFacade: FileFacade,
    private fileDownloadService: FileDownloadService,
    private dialog: MatDialog,
    private productGroupMappingFacade: ProductGroupMappingFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE) public fileSize,
    @Inject(POSS_WEB_CURRENCY_CODE) public currencyCode
  ) {}

  ngOnInit() {
    this.translate
      .get(['pw.discountConfig.discountsLabel'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: any) => {
        this.discountsLabel = translatedMsg['pw.discountConfig.discountsLabel'];
      });

    this.fileFacade.clearResponse();
    this.discountConfigFacade.resetDiscounts();

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

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.params = this.activatedRoute.snapshot.params['_configId'];
        this.tabType = this.activatedRoute.snapshot.params['tab'];
        if (this.tabType !== 'discount') {
          this.discountWorkflow = true;
          this.enableWorkflowNotification();
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

    if (this.activatedRoute.snapshot.params['_configId']) {
      this.params = this.activatedRoute.snapshot.params['_configId'];
      this.tabType = this.activatedRoute.snapshot.params['tab'];
      if (this.tabType !== 'discount') {
        this.discountWorkflow = true;
        this.enableWorkflowNotification();
      }

      if (this.params !== DiscountEnums.NEW) {
        this.discountConfigFacade.loadDiscDetails({
          discountId: this.params
        });
        this.discountConfigFacade.loadEmpowermentDiscDetails({
          discountId: this.params
        });
      }
    }

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
    this.totalExcludeTypeCount$ = this.discountConfigFacade.getTotalDiscountExcludeTypes();
    this.excludeItemCodes$ = this.discountConfigFacade.getDiscountExcludeItemCodes();
    this.bestDealDiscount$ = this.discountConfigFacade.getBestDealDiscountList();
    this.totalBestDealDiscount$ = this.discountConfigFacade.getBestDealDiscountCount();
    this.totalSelectedBestDealDiscount$ = this.discountConfigFacade.getSelectedBestDealDiscountCount();
    this.uploadedFaqFileData$ = this.discountConfigFacade.getFaqFileUpload();
    this.downloadFileResponse$ = this.discountConfigFacade.getFaqFileDownload();

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

    this.componentInit();

    if (this.params !== DiscountEnums.NEW) {
      this.discountConfigFacade.loadSelectedProductCategories({
        id: this.params
      });
      this.discountConfigFacade.loadSelectedProductGroups({
        id: this.params,
        karatType: this.karatType ? this.karatType : null,
        productType: this.productType ? this.productType : null
      });
      this.discountConfigFacade.loadSelectedLocations({
        id: this.params
      });
    }

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
          data.configDetails ||
          data?.rivaahItemGroupConfig)
      ) {
        this.discountDetails = data;
        this.isABOfferApplicable = data.isAbOfferApplicable;
        this.isCOOfferApplicable = data.isCoOfferApplicable;
        this.isPreviewApplicable = data.isPreviewApplicable;
        this.isRiva = data.isRiva;
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
      console.log(data?.rivaahItemGroupConfig);
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
    this.discountConfigFacade
      .getIsThemeCodeSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.showNotifications('pw.gePurityConfiguration.saveThemeCodes');
          this.discountConfigFacade.loadExcludeTypeList({
            id: this.params,
            pagination: { pageIndex: 0, pageSize: 50 },
            excludeType: DiscountExcludeConfigTabEnum.THEME_CODE
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
            this.excludeThemeCodes.sort((ob1, ob2) =>
              ob1.themeCode > ob2.themeCode ? 1 : -1
            );
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
    this.uploadResponse$ = this.fileFacade.getFileUploadResponse();
    this.uploadResponse$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: NewFileUploadResponse) => {
        if (fileResponse) {
          if (fileResponse.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: fileResponse.message
            });
          } else {
            this.fileResponse = fileResponse.records;
            if (
              fileResponse.uploadType === FileUploadTypeEnum.SYNC &&
              this.fileResponse
            ) {
              this.fileError = fileResponse.hasError;
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    isFileError: this.fileError,
                    label: this.discountsLabel
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === FileUploadPopupEnum.DOWNLOAD) {
                    this.fileFacade.downloadErrorLog(
                      this.fileResponse.errorLogId,
                      FileGroupEnum.DISCOUNT_EXCLUDE_ITEM_MAPPING
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadExcludeItemCodes();
            } else if (fileResponse.uploadType === FileUploadTypeEnum.ASYNC) {
              this.showConfirmReceiveSuccessNotification();
              this.loadExcludeItemCodes();
            }
          }
        }
      });
  }

  componentInit() {
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

    this.discountConfigFacade
      .getTsssConfigDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe(downloadFileData => {
        if (downloadFileData) {
          this.fileDownloadService.downloadErrorFile(
            downloadFileData.url,
            downloadFileData.filename
          );
        }
      });

    this.discountConfigFacade
      .getHasSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSaved => {
        if (isSaved) {
          this.saveHeaderData = false;
          this.showNotifications(
            'pw.discountConfig.discountSaveSuccessMessage'
          );
        }
      });

    this.discountConfigFacade
      .getIsTsssComputed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isComputed => {
        if (isComputed) {
          this.isTsssComputed = isComputed;
          this.showNotifications('pw.discountConfig.tsssSuccessMsg');
        }
      });

    this.discountConfigFacade
      .getHasUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isUpdated => {
        if (isUpdated) {
          this.dirty = false;
          this.saveHeaderData = false;

          this.showNotifications(
            'pw.discountConfig.discountEditSuccessMessage'
          );

          this.discountConfigFacade.loadDiscountDetails(this.params);
        }
      });

    this.discountConfigFacade
      .getIsLocationSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(locationSaved => {
        if (locationSaved) {
          this.isLocationData = true;
          this.locationPageEvent = this.pageEvent;
          this.showNotifications('pw.discountConfig.locationsSuccessMsg');
          this.loadLocationList();
        }
      });
    this.discountConfigFacade
      .getIsProductCategoriesSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productCategoriesSaved => {
        if (productCategoriesSaved) {
          this.showNotifications(
            'pw.discountConfig.productCatergorySuccessMsg'
          );
          const proctCategoryPageEvent = {
            pageEvent: this.productCategoryPageEvent
          };
          this.loadProductCategoryList(proctCategoryPageEvent);
          this.discountConfigFacade.loadSelectedProductCategories({
            id: this.params
          });
        }
      });
    this.discountConfigFacade
      .getIsProductGroupsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroupsSaved => {
        if (productGroupsSaved) {
          this.showNotifications('pw.discountConfig.productGroupsSuccessMsg');
          this.loadProductGroupList();
          this.discountConfigFacade.loadSelectedProductGroups({
            id: this.params,
            karatType: this.karatType,
            productType: this.productType
          });
        }
      });
    this.discountConfigFacade
      .getIsExcludeTypeSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(excludeTypeSaved => {
        if (excludeTypeSaved) {
          this.showNotifications('pw.discountConfig.excludeTypeSuccessMsg');
          this.excludeConfigPageEvent = this.pageEvent;
          this.loadExcludeConfigList(this.excludeType);
        }
      });

    this.discountConfigFacade
      .getIsExcludeSchemeSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(excludeSchemeSaved => {
        if (excludeSchemeSaved) {
          this.showNotifications('pw.discountConfig.excludeSchemeSuccessMsg');
          this.excludeConfigPageEvent = this.pageEvent;
          this.loadExcludeConfigList(this.excludeType);
        }
      });
    this.discountConfigFacade
      .getIsBestDealDiscountSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bestDealDiscountSaved => {
        if (bestDealDiscountSaved) {
          this.showNotifications('pw.discountConfig.bestDealSuccessMsg');
          this.loadBestDealDiscount();
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

          if (!this.showViewOnly) {
            this.router.navigate([
              getDiscountConfigRequestRouteUrl(
                this.tabType,
                discDetails.id?.toUpperCase()
              )
            ]);
          } else {
            this.router.navigate(
              [
                getDiscountConfigRequestRouteUrl(
                  this.tabType,
                  discDetails.id?.toUpperCase()
                )
              ],
              {
                queryParams: { showViewOnly: 'true' },
                queryParamsHandling: 'merge'
              }
            );
          }
        }
      });

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
      .getIsLocationSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === true) {
          this.loadLocationList();
        }
      });

    this.discountConfigFacade
      .getIsDiscountSentForApproval()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.succesMsg = 'Sent For Approval';
          this.showRequestSentSuccessMessageNotification();
        }
      });

    this.discountConfigFacade
      .getIsDiscountApproved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.succesMsg = StatusTypesEnum.APPROVED;
          if (data === StatusTypesEnum.REJECTED) {
            this.succesMsg = StatusTypesEnum.REJECTED;
          }
          this.showRequestSentSuccessMessageNotification();
        }
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.discountConfigFacade
      .getSlabDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.isSlabData = true;
          this.showNotifications(
            'pw.discountConfig.discountSaveSuccessMessage'
          );
          this.discountConfigFacade.loadDiscDetails({
            discountId: this.params
          });
        }
      });

    this.discountConfigFacade
      .getIsDiscDetailsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showNotifications(
            'pw.discountConfig.discountSaveSuccessMessage'
          );
          this.discountConfigFacade.loadDiscDetails({
            discountId: this.params
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

    this.discountConfigFacade
      .getIsDiscountComponentPGConfigSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSaved => {
        if (isSaved) {
          this.isCategoryPgData = true;

          this.showNotifications(
            'pw.discountConfig.discountSaveSuccessMessage'
          );
        }
      });
  }
  enableTab(applicableDiscounts) {
    return applicableDiscounts.includes(this.selectedDiscount);
  }

  enableWorkflowNotification() {
    if (this.tabType === 'request' || this.tabType === 'amendment') {
      this.showSendForApprovalNotification();
    } else if (this.tabType === 'approval') {
      this.acceptOrRejectRequestNotification();
    }
  }

  faqFileUpload(fileUploadData) {
    this.discountConfigFacade.loadFaqFileUpload(fileUploadData);
  }

  faqFileDownload(fileDownloadData) {
    this.discountConfigFacade.loadFaqFileDownload(fileDownloadData);
  }

  loadProductGroups(discountDetailsId) {
    this.discountConfigFacade.loadMappedProductGroupByConfigId(
      this.discountDetails.id,
      discountDetailsId
    );
  }

  updateProductGroups(data: {
    id: string;
    addProducts: ProductGroupMappingOption[];
    removeProducts: ProductGroupMappingOption[];
    updateProducts: ProductGroupMappingOption[];
    updateProductGroupsDtoList?: any;
    loadData: {
      pgType: string;
      pageIndex: number;
      pageSize: number;
    };
  }) {
    this.discountConfigFacade.updateMappedProductGroupByConfigId(
      this.discountDetails.id,
      data.id,
      {
        addProducts: data.addProducts,
        removeProducts: data.removeProducts,
        updateProducts: [],
        updateProductGroupsDtoList: data.updateProducts
      },
      { discountId: this.params, ...data.loadData }
    );
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
  getSelectedDiscount(discount) {
    this.selectedDiscount = discount;

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
  }
  addDetails(formDetails) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(take(1))
      .subscribe((res: boolean) => {
        if (res) {
          this.disable = true;
          if (formDetails.isRiva === false) {
            formDetails = {
              ...formDetails,
              rivaahItemGroupConfig: {
                data: {
                  additionalMaxMetalCharge: {
                    percent: null,
                    value: null
                  },
                  additionalMaxStoneCharges: {
                    percent: null,
                    value: null
                  },
                  additionalMaxUCP: {
                    percent: null,
                    value: null
                  },

                  additionalMaxMC: {
                    percent: null,
                    value: null
                  },
                  additionalMaxPsPerGram: {
                    percent: null,

                    weight: null
                  }
                },
                type:
                  this.selectedDiscount ===
                  DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT
                    ? DiscountApplicableEnum.RIVAAH_ITEM_GROUP_LEVEL
                    : DiscountApplicableEnum.RIVAAH_BEST_DEAL
              }
            };
          }
          if (
            this.activatedRoute.snapshot.params['_configId'] ===
            DiscountEnums.NEW
          ) {
            this.discountConfigFacade.saveDiscountDetails({
              ...formDetails,
              isCreatedByWorkflow: this.discountWorkflow
            });
          } else {
            this.discountConfigFacade.editDiscountDetails(
              this.params,
              formDetails
            );
          }
        } else this.disable = false;
      });
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
      pageSize: this.pageEvent.pageSize
    });
  }

  clearLocationFilters() {
    this.offerStartDate = null;
    this.offerEndDate = null;
    this.previewStartDate = null;
    this.previewEndDate = null;
    this.locationCodes = [];
  }
  loadLocationList(data?) {
    this.locationCodes = data?.searchValue
      ? data.searchValue
      : this.locationCodes;
    this.offerStartDate = data?.offerStartDate
      ? moment(data.offerStartDate).startOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerStartDate;
    this.offerEndDate = data?.offerEndDate
      ? moment(data.offerEndDate).endOf('day').valueOf()
      : data?.clearOffer
      ? null
      : this.offerEndDate;
    this.previewStartDate = data?.previewStartDate
      ? moment(data.previewStartDate).startOf('day').valueOf()
      : data?.clearPreview
      ? null
      : this.previewStartDate;
    this.previewEndDate = data?.previewEndDate
      ? moment(data.previewEndDate).endOf('day').valueOf()
      : data?.clearPreview
      ? null
      : this.previewEndDate;
    //   ? moment(data.offerStartDate).startOf('day').valueOf()
    //   : null;
    // this.offerEndDate = data?.offerEndDate
    //   ? moment(data.offerEndDate).endOf('day').valueOf()
    //   : null;
    // this.previewStartDate = data?.previewStartDate
    //   ? moment(data.previewStartDate).startOf('day').valueOf()
    //   : null;
    // this.previewEndDate = data?.previewEndDate
    //   ? moment(data.previewEndDate).endOf('day').valueOf()
    //   : null;
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
    if (data?.pageEvent) {
      this.productCategoryPageEvent = data.pageEvent;
    }
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
  filterProductGroups(ob: {
    value: string;
    selectedTab: DiscountProductGroupTypeEnum;
  }) {
    this.productGroupFilter = true;
    this.productType = ob.selectedTab;
    this.productGroupMappingFacade.loadProductGroups(ob.value);
  }
  loadProductGroupList(data?) {
    if (data) {
      this.productGroupPageEvent = data.pageEvent;
    }
    this.productGroupFilter = false;
    this.productType =
      this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
        ? data
          ? data?.productType
          : this.productType
        : null;

    this.karatType =
      this.selectedDiscount === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT
        ? data
          ? data.karatType
          : this.karatType
        : null;
    console.log('data', data);
    console.log('productType', this.productType);
    this.discountConfigFacade.loadDiscountProductGroupList({
      id: this.params,
      pagination: data ? data.pageEvent : this.productGroupPageEvent,
      karatType: this.karatType,
      productType: this.productType,
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
  rivaMaxValConfig(event) {
    event = {
      rivaahItemGroupConfig: event
    };

    this.discountConfigFacade.editDiscountDetails(this.params, event);
  }
  formDirty(check) {
    this.dirty = check;
  }

  deleteProductCategory(data) {
    this.discountConfigFacade.saveDiscountProductCategories({
      id: this.params,
      removeProductCategories: data
    });
  }
  deleteProductGroup(data) {
    this.discountConfigFacade.saveDiscountProductGroups({
      id: this.params,
      removeProducts: data,
      addProducts: [],
      eligibleKarat: null,
      updateProducts: []
    });
  }
  deleteBestDealDiscount(data) {
    this.discountConfigFacade.saveBestDealDiscount({
      id: this.params,
      removeLinks: data,
      addLinks: []
    });
  }
  updateBestDealDiscountStatus(data) {
    this.discountConfigFacade.saveBestDealDiscount({
      id: this.params,
      removeLinks: [],
      addLinks: [],
      isActive: data.status,
      updateLinks: [data.id]
    });
  }
  deleteLocations(data) {
    this.discountConfigFacade.saveDiscountLocations({
      id: this.params,
      payload: { removeLocations: data }
    });
  }
  back() {
    if (this.tabType === 'discount') {
      this.router.navigate([getDiscountConfigListRouteUrl()]);
    } else {
      this.router.navigate([getDiscountConfigRquestRouteUrl()]);
    }
  }

  changeTab(newTab: DiscountConfigTabEnum) {
    if (
      newTab !== DiscountConfigTabEnum.DISCOUNT_APPILICABLE &&
      newTab !== DiscountConfigTabEnum.EXCHANGE_OFFER_CONFIG &&
      this.dirty
    ) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountConfig.tabChangeErrorMsg'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.dirty = false;
            this.selectedTab = newTab;
            switch (this.selectedTab) {
              case this.discountConfigTabEnumRef.LOCATION_MAPPING: {
                this.locationPageEvent = this.pageEvent;
                this.clearLocationFilters();
                this.loadLocationList();
                break;
              }
              case this.discountConfigTabEnumRef.PRODUCT_CATEGORY_MAPPING: {
                this.loadProductCategoryList();
                break;
              }
              case this.discountConfigTabEnumRef.PRODUCT_GROUP_MAPPING: {
                if (
                  this.selectedDiscount !==
                    DiscountTypeEnum.CATEGORY_DISCOUNT &&
                  this.selectedDiscount !== DiscountTypeEnum.TSSS_DISCOUNT &&
                  this.selectedDiscount !== DiscountTypeEnum.ULP_ANNIVERSARY &&
                  this.selectedDiscount !== DiscountTypeEnum.ULP_BIRTHDAY &&
                  this.selectedDiscount !==
                    DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY &&
                  this.selectedDiscount !==
                    DiscountTypeEnum.EMPLOYEE_DISCOUNT &&
                  this.selectedDiscount !==
                    DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT
                ) {
                  this.loadProductGroupList();
                }
                break;
              }
              case this.discountConfigTabEnumRef.EXCLUDE_CONFIG: {
                this.loadExcludeConfigList();

                break;
              }
              case this.discountConfigTabEnumRef.REFER_BEST_DEAL_DISC: {
                this.loadBestDealDiscount();
                break;
              }
            }
          }
        });
    } else {
      this.selectedTab = newTab;
      switch (this.selectedTab) {
        case this.discountConfigTabEnumRef.LOCATION_MAPPING: {
          this.locationPageEvent = this.pageEvent;
          this.clearLocationFilters();
          this.loadLocationList();
          break;
        }
        case this.discountConfigTabEnumRef.PRODUCT_CATEGORY_MAPPING: {
          this.loadProductCategoryList();
          break;
        }
        case this.discountConfigTabEnumRef.PRODUCT_GROUP_MAPPING: {
          this.loadProductGroupList();
          break;
        }
        case this.discountConfigTabEnumRef.SCHEME_MAPPING:
        case this.discountConfigTabEnumRef.EXCLUDE_CONFIG: {
          this.excludeConfigPageEvent = this.pageEvent;
          this.loadExcludeConfigList();

          break;
        }

        case this.discountConfigTabEnumRef.REFER_BEST_DEAL_DISC: {
          this.loadBestDealDiscount();
          break;
        }
      }
    }
  }

  discountApplicableChange(config: NewDiscountApplicableConfig) {
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

  addBestDealDiscount(bestDealDiscountIds: string[]) {
    this.discountConfigFacade.saveBestDealDiscount({
      id: this.params,
      addLinks: bestDealDiscountIds,
      removeLinks: [],
      isActive: true
    });
  }

  eventTesting(data) {
    console.log(data);
  }
  mapProductCategories(data) {
    this.discountConfigFacade.saveDiscountProductCategories({
      id: this.params,
      isActive: true,
      addProductCategories: data.map(l => l.id),
      removeProductCategories: [],
      updateProductCategories: []
    });
  }
  updateProductCategoryStatus(data) {
    this.discountConfigFacade.saveDiscountProductCategories({
      id: this.params,
      isActive: data.status,
      updateProductCategories: [data.id]
    });
  }
  updateStatus(data) {
    const payload = {
      discountComponents: [],
      isActive: data.status,
      removeDetails: [],
      updateDetails: [data.id]
    };
    this.discountConfigFacade.saveDiscDetails({
      discountId: this.params,
      discountComponents: payload
    });
  }
  mapProductGroups(productGroups) {
    this.discountConfigFacade.saveDiscountProductGroups({
      id: this.params,
      addProducts: productGroups,
      removeProducts: [],
      updateProducts: [],
      isActive: true
    });
  }
  updateProductGroupsStatus(data) {
    this.discountConfigFacade.saveDiscountProductGroups({
      id: this.params,
      isActive: data.status,
      updateProducts: [data.id],
      addProducts: [],
      removeProducts: []
    });
  }

  mapExchangeOfferProductGroups(data) {
    console.log(data);
    this.karatType = data.karatType;
    this.productType = data.productType;
    this.discountConfigFacade.saveDiscountProductGroups({
      id: this.params,
      removeProducts: data.removedProductGroups,
      addProducts: data.productGroups,
      eligibleKarat: data.karat ? data.karat : null,
      updateProducts: [],
      karatType: data.karatType,
      productType: data.productType
    });
  }
  updateExchangeOfferProductGroupsKaratage(data) {
    this.discountConfigFacade.saveDiscountProductGroups({
      id: this.params,
      removeProducts: [],
      addProducts: [],
      eligibleKarat: data.karat,
      updateProducts: data.productGroups
    });
  }
  mapLocations(data) {
    const addlocs = data.locations.map(l => l.id);
    const locationPayload: SaveDiscountLocationsPayload = {
      id: this.params,
      payload: {
        addLocations: addlocs,
        configDetails: {
          data: null,
          type: null
        },
        validity: {
          offerEndDate: data.config?.offerEndDate
            ? moment(data.config.offerEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          offerStartDate: data.config?.offerStartDate
            ? // ? data.config.offerStartDate
              moment(data.config.offerStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          previewEndDate: data.config?.previewEndDate
            ? // ? data.config.previewEndDate
              moment(data.config.previewEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          previewStartDate: data.config?.previewStartDate
            ? // ? data.config.previewStartDate
              moment(data.config.previewStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null
        },
        removeLocations: [],
        status: true,
        updateLocations: []
      }
    };
    if (!this.isDateRangeApplicable()) {
      delete locationPayload.payload.validity;
    }
    this.discountConfigFacade.saveDiscountLocations(locationPayload);
    this.loadLocationList();
  }

  mapEmpowermentLocations(data) {
    const addlocs = data.locations.map(l => l.id);
    this.discountConfigFacade.saveDiscountLocations({
      id: this.params,
      payload: {
        addLocations: addlocs,
        configDetails: {
          type: DiscountApplicableEnum.EMPOWERMENT_CONFIG,
          data: {
            Q1: {
              isQ1Enabled: data.config.q1Enable,
              value: data.config.q1Value
            },
            Q2: {
              isQ2Enabled: data.config.q2Enable,
              value: data.config.q2Value
            },
            Q3: {
              isQ3Enabled: data.config.q3Enable,
              value: data.config.q3Value
            },
            Q4: {
              isQ4Enabled: data.config.q4Enable,
              value: data.config.q4Value
            }
          }
        },
        removeLocations: [],
        status: true,
        updateLocations: []
      }
    });
    this.loadLocationList();
  }

  editLocations(data) {
    this.discountConfigFacade.saveDiscountLocations({
      id: this.params,
      payload: { status: data.status, updateLocations: [data.id] }
    });
  }

  updateLocationValue(data) {
    this.discountConfigFacade.saveDiscountLocations({
      id: this.params,
      payload: {
        configDetails: {
          type: DiscountApplicableEnum.EMPOWERMENT_CONFIG,
          data: {
            Q1: {
              isQ1Enabled: data.configDetails.q1Enable,
              value: data.configDetails.q1Value
            },
            Q2: {
              isQ2Enabled: data.configDetails.q2Enable,
              value: data.configDetails.q2Value
            },
            Q3: {
              isQ3Enabled: data.configDetails.q3Enable,
              value: data.configDetails.q3Value
            },
            Q4: {
              isQ4Enabled: data.configDetails.q4Enable,
              value: data.configDetails.q4Value
            }
          }
        },
        updateLocations: data.id
      }
    });
  }
  updateLocationDateRange(data) {
    this.discountConfigFacade.saveDiscountLocations({
      id: this.params,
      payload: {
        validity: {
          offerStartDate: data.dateRange.offerStartDate
            ? moment(data.dateRange.offerStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          offerEndDate: data.dateRange.offerEndDate
            ? moment(data.dateRange.offerEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          previewStartDate: data.dateRange.previewStartDate
            ? moment(data.dateRange.previewStartDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null,
          previewEndDate: data.dateRange.previewEndDate
            ? moment(data.dateRange.previewEndDate)
                .startOf('day')
                .add(this.utcOffset, 'm')
                .valueOf()
            : null
        },
        updateLocations: data.id
      }
    });
  }

  mapExcludeThemes(data) {
    console.log(data);
    this.excludeType = data.excludeType;
    if (this.excludeType === DiscountExcludeConfigTabEnum.SCHEME_CODE) {
      this.discountConfigFacade.saveDiscountExcludeSchemes({
        id: this.params,
        excludeType: data.excludeType,
        addSchemes: [data.schemeCode],
        removeSchemes: [],
        isActive: true,
        updateSchemes: []
      });
    } else {
      this.discountConfigFacade.saveDiscountExcludeThemes({
        id: this.params,
        excludeType: data.excludeType,
        addThemes: [data.themeCode],
        removeThemes: [],
        isActive: true,
        updateThemes: []
      });
    }
  }
  deleteExcludeThemes(data) {
    if (data) {
      this.excludeType = data.excludeType;
    } else {
      this.excludeType =
        this.selectedTab === DiscountConfigTabEnum.SCHEME_MAPPING
          ? DiscountExcludeConfigTabEnum.SCHEME_CODE
          : DiscountExcludeConfigTabEnum.THEME_CODE;
    }

    if (this.excludeType === DiscountExcludeConfigTabEnum.SCHEME_CODE) {
      this.discountConfigFacade.saveDiscountExcludeSchemes({
        id: this.params,
        excludeType: this.excludeType,
        addSchemes: [],
        removeSchemes: [data.id],
        updateSchemes: []
      });
    } else {
      this.discountConfigFacade.saveDiscountExcludeThemes({
        id: this.params,
        excludeType: this.excludeType,
        addThemes: [],
        removeThemes: [data.id],
        updateThemes: []
      });
    }
  }
  updateThemeCodeStatus(data) {
    this.excludeType =
      this.selectedTab === DiscountConfigTabEnum.SCHEME_MAPPING
        ? DiscountExcludeConfigTabEnum.SCHEME_CODE
        : DiscountExcludeConfigTabEnum.THEME_CODE;

    this.discountConfigFacade.saveDiscountExcludeThemes({
      id: this.params,
      excludeType: this.excludeType,
      isActive: data.status,
      addThemes: [],
      removeThemes: [],
      updateThemes: [data.id]
    });
  }
  mapExcludeTypes(data) {
    this.discountConfigFacade.saveDiscountExcludeTypes({
      id: this.params,
      excludeType: data.excludeType,
      payload: {
        isActive: data.isActive,
        addValues: data.addValues,
        removeValues: data.removeValues,
        updateValue: data.updateValue
      }
    });
  }
  updateExcludeTypeStatus(data) {
    if (data) {
      this.excludeType = data.excludeType;
    } else {
      this.excludeType =
        this.selectedTab === DiscountConfigTabEnum.SCHEME_MAPPING
          ? DiscountExcludeConfigTabEnum.SCHEME_CODE
          : DiscountExcludeConfigTabEnum.THEME_CODE;
    }
    if (this.excludeType === DiscountExcludeConfigTabEnum.SCHEME_CODE) {
      this.discountConfigFacade.saveDiscountExcludeSchemes({
        id: this.params,
        excludeType: this.excludeType,

        isActive: data.status,
        addSchemes: [],
        removeSchemes: [],
        updateSchemes: [data.id]
      });
    } else {
      this.discountConfigFacade.saveDiscountExcludeTypes({
        id: this.params,
        excludeType: this.excludeType,
        payload: {
          isActive: data.status,
          addValues: [],
          removeValues: [],
          updateValue: [{ id: data.id }]
        }
      });
    }
  }

  downLoadFormatFn() {
    this.fileDownloadService.download(
      FileNamesEnum.EXCLUDE_ITEM_CODES,
      FilePathEnum.EXCLUDE_ITEM_CODES
    );
  }

  uploadItemCodesFn(data: { event: any; fileInput: any }) {
    // TODO : Create this action

    this.overlayNotification.close();
    const fileList: FileList = data.event.target.files;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.size > this.fileSize) {
        const errorKey =
          'pw.discountExculdeConfig.maximumFileSizeErrorMessage3';
        this.showFileUploadNotification(errorKey);
        data.fileInput.nativeElement.value = '';
      }
      const extn = file.name.split('.').pop();
      if (extn !== csvExtn) {
        const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
        this.showFileUploadNotification(errorKey);
        data.fileInput.nativeElement.value = '';
      }

      formData.append(reqfileKey, file);
      if (extn === csvExtn && file.size < this.fileSize) {
        // TODO : Create this action
        formData.set(reqfileKey, file, file.name);
        this.fileFacade.loadFileUpload(
          formData,
          FileGroupEnum.DISCOUNT_EXCLUDE_ITEM_MAPPING,
          this.params
        );
        data.fileInput.nativeElement.value = '';
      }
    }
  }

  computesTsssConfig(event) {
    const requestPaylaod: TSSSRequestPayload = {
      discountId: this.params,
      couponRequest: event
    };

    this.discountConfigFacade.loadTsssConfigCompute(requestPaylaod);
  }

  downloadTSSSCoupons(event) {
    this.discountConfigFacade.loadTsssConfigDownloadUrl(this.params);
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
            if (this.discountWorkflow) {
              this.enableWorkflowNotification();
            }
          });
      });
  }

  showFileUploadNotification(key: any) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  showConfirmReceiveSuccessNotification() {
    const key = 'pw.fileUpload.fileUploadStatusMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.overlayNotification.close();
            }
          });
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
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
          this.discountWorkflow
        ) {
          this.enableWorkflowNotification();
        }
      });
  }

  enableWorkflowNotificationevent(event) {
    if (event) {
      this.enableWorkflowNotification();
    }
  }
  paginate(pageEvent: PageEvent) {
    console.log(this.selectedTab);
    if (this.selectedTab === DiscountConfigTabEnum.LOCATION_MAPPING) {
      this.locationPageEvent = pageEvent;
      this.loadLocationList();
    }
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

  updatePGMappingWithCharges(event: {
    data: any;
    valuePerWeightType: string;
    isNew: boolean;
    loadData: {
      pgType: string;
      pageIndex: number;
      pageSize: number;
    };
  }) {
    const data = event.data;
    let discountComponents = {
      discountComponents: [
        {
          type: DiscountCompTypeEnum.REGULAR,
          data: {
            isUCP: {
              isPercent: data.regular.ucp.isPercent,
              value: data.regular.ucp.value
            },
            mcCharges: {
              isPercent: data.regular.mcCharges.isPercent,
              value: data.regular.mcCharges.value
            },

            goldCharges: {
              isPercent: data.regular.goldCharges.isPercent,
              value: data.regular.goldCharges.value
            },
            stoneCharges: {
              isPercent: data.regular.stoneCharges.isPercent,
              value: data.regular.stoneCharges.value
            },
            rsPerGram: {
              isGrossWeight:
                event.valuePerWeightType === 'GrossWt' ? true : false,
              weight: data.regular.rsPerGram.value
            }
          }
        },
        {
          type: DiscountCompTypeEnum.PREVIEW,
          data: {
            isUCP: {
              isPercent: data.preview.ucp.isPercent,
              value: data.preview.ucp.value
            },
            mcCharges: {
              isPercent: data.preview.mcCharges.isPercent,
              value: data.preview.mcCharges.value
            },

            goldCharges: {
              isPercent: data.preview.goldCharges.isPercent,
              value: data.preview.goldCharges.value
            },
            stoneCharges: {
              isPercent: data.preview.stoneCharges.isPercent,
              value: data.preview.stoneCharges.value
            },
            rsPerGram: {
              isGrossWeight:
                event.valuePerWeightType === 'GrossWt' ? true : false,
              weight: data.preview.rsPerGram.value
            }
          }
        },
        {
          type: DiscountCompTypeEnum.AB,
          data: {
            isUCP: {
              isPercent: data.ab.ucp.isPercent,
              value: data.ab.ucp.value
            },
            mcCharges: {
              isPercent: data.ab.mcCharges.isPercent,
              value: data.ab.mcCharges.value
            },

            goldCharges: {
              isPercent: data.ab.goldCharges.isPercent,
              value: data.ab.goldCharges.value
            },
            stoneCharges: {
              isPercent: data.ab.stoneCharges.isPercent,
              value: data.ab.stoneCharges.value
            },
            rsPerGram: {
              isGrossWeight:
                event.valuePerWeightType === 'GrossWt' ? true : false,
              weight: data.ab.rsPerGram.value
            }
          }
        },
        {
          type: DiscountCompTypeEnum.CO,
          data: {
            isUCP: {
              isPercent: data.co.ucp.isPercent,
              value: data.co.ucp.value
            },
            mcCharges: {
              isPercent: data.co.mcCharges.isPercent,
              value: data.co.mcCharges.value
            },
            goldCharges: {
              isPercent: data.co.goldCharges.isPercent,
              value: data.co.goldCharges.value
            },
            stoneCharges: {
              isPercent: data.co.stoneCharges.isPercent,
              value: data.co.stoneCharges.value
            },
            rsPerGram: {
              isGrossWeight:
                event.valuePerWeightType === 'GrossWt' ? true : false,
              weight: data.co.rsPerGram.value
            }
          }
        },
        {
          type: DiscountCompTypeEnum.RIVAAH,
          data: {
            isUCP: {
              isPercent: data.riva.ucp.isPercent,
              value: data.riva.ucp.value
            },
            mcCharges: {
              isPercent: data.riva.mcCharges.isPercent,
              value: data.riva.mcCharges.value
            },

            goldCharges: {
              isPercent: data.riva.goldCharges.isPercent,
              value: data.riva.goldCharges.value
            },
            stoneCharges: {
              isPercent: data.riva.stoneCharges.isPercent,
              value: data.riva.stoneCharges.value
            },
            rsPerGram: {
              isGrossWeight:
                event.valuePerWeightType === 'GrossWt' ? true : false,
              weight: data.riva.rsPerGram.value
            }
          }
        }
      ],
      isActive: data.isActive,
      removeDetails: [],
      updateDetails: []
    };

    if (!event.isNew) {
      discountComponents = { ...discountComponents, updateDetails: [data.id] };
    }
    this.discountConfigFacade.updateDiscountComponentPGConfig({
      discountId: this.params,
      discountComponents: discountComponents,
      loadData: { discountId: this.params, ...data.loadData }
    });
  }

  deletePGMappingWithCharges(data: {
    id: string;
    loadData: {
      pgType: string;
      pageIndex: number;
      pageSize: number;
    };
  }) {
    const discountComponents = {
      discountComponents: [],
      removeDetails: [data.id]
    };

    this.discountConfigFacade.updateDiscountComponentPGConfig({
      discountId: this.params,
      discountComponents: discountComponents,
      loadData: { discountId: this.params, ...data.loadData }
    });
  }

  activatePGMappingWithCharges(data: {
    id: string;
    isActive: boolean;
    loadData: {
      pgType: string;
      pageIndex: number;
      pageSize: number;
    };
  }) {
    const discountComponents = {
      discountComponents: [],
      updateDetails: [data.id],
      isActive: data.isActive
    };

    this.discountConfigFacade.updateDiscountComponentPGConfig({
      discountId: this.params,
      discountComponents: discountComponents,
      loadData: { discountId: this.params, ...data.loadData }
    });
  }
  checkHeaderChange(data) {
    this.saveHeaderData = data;
  }
  pgMappingAbCoValue(data) {
    this.discountConfigFacade.editDiscountDetails(this.params, data);
  }

  saveSlabDetails(event) {
    const slabDetailsArray = [];
    const addData = event.addData;

    event.updateData.forEach(element => {
      slabDetailsArray.push({
        discountCategory: element.discountBasedOn,
        eligibility: element.discountBasedOnType,
        isSingle: element.isSingle,
        maxValue: element.max,
        minValue: element.min,
        rowId: element.rowId,
        slabName: element.slabName,
        id: element.id,
        isActive: element.isActive
      });
    });

    const slabDetails = {
      discountCategory: addData.discountBasedOn,
      eligibility: addData.discountBasedOnType,
      isSingle: addData.isSingle,
      maxValue: addData.max,
      minValue: addData.min,
      rowId: addData.rowId,
      slabName: addData.slabName,
      isActive: addData.isActive
    };
    const payload = {
      addSlabDetails: [slabDetails],
      updateSlabDetails: slabDetailsArray,
      isActive: true,
      removeDetails: []
    };
    this.discountConfigFacade.saveSlabDetails({
      discountId: this.params,
      slabDetails: payload
    });
  }

  deleteSlabDetails(event) {
    const slabDetailsArray = [];

    event.updateData.forEach(element => {
      slabDetailsArray.push({
        discountCategory: element.discountBasedOn,
        eligibility: element.discountBasedOnType,
        isSingle: element.isSingle,
        maxValue: element.max,
        minValue: element.min,
        rowId: element.rowId,
        slabName: element.slabName,
        id: element.id
      });
    });

    const payload = {
      addSlabDetails: [],
      isActive: true,
      removeDetails: event.deleteData,
      updateSlabDetails: slabDetailsArray
    };
    this.discountConfigFacade.saveSlabDetails({
      discountId: this.params,
      slabDetails: payload
    });
  }

  saveSlabDiscountDetails(data) {
    this.discountConfigFacade.editDiscountDetails(this.params, data);
  }

  updateSlabDiscountDetails(event) {
    const discountComponents = {
      discountComponents: event.discountComponents,
      isActive: event.isActive,
      removeDetails: [],
      updateDetails: [event.id]
    };
    this.discountConfigFacade.saveDiscDetails({
      discountId: this.params,
      discountComponents: discountComponents
    });
  }

  getSlabDiscountDetails() {
    this.discountConfigFacade.loadDiscDetails({
      discountId: this.params
    });
  }

  saveEmpowermentDetails(event) {
    const empowermentDetailsArray = [];
    const addData = event.addData;

    event.updateData.forEach(element => {
      empowermentDetailsArray.push({
        discountPercent: element.discountPercent,
        maxValue: element.maxValue,
        minValue: element.minValue,
        rowId: element.rowId,
        id: element.id
      });
    });

    const empowermentDetails = {
      discountPercent: Number(addData.discountPercent),
      maxValue: Number(addData.maxValue),
      minValue: Number(addData.minValue),
      rowId: Number(addData.rowId),
      configDetails: addData.configDetails
    };
    const payload = {
      addSlabDetails: [empowermentDetails],
      updateSlabDetails: empowermentDetailsArray,
      isActive: true,
      removeDetails: []
    };
    this.discountConfigFacade.saveEmpowermentDetails({
      discountId: this.params,
      slabDetails: payload
    });
  }

  deleteEmpowermentDetails(event) {
    const empowermentDetailsArray = [];

    event.updateData.forEach(element => {
      empowermentDetailsArray.push({
        discountPercent: element.discountPercent,
        maxValue: element.maxValue,
        minValue: element.minValue,
        rowId: element.rowId,
        id: element.id
      });
    });

    const payload = {
      addSlabDetails: [],
      isActive: true,
      removeDetails: event.deleteData,
      updateSlabDetails: empowermentDetailsArray
    };
    this.discountConfigFacade.saveEmpowermentDetails({
      discountId: this.params,
      slabDetails: payload
    });
  }
  sendForApproval(value: string) {
    if (this.discountDetails?.workflowFileUploadDetails) {
      if (this.discountDetails?.id) {
        this.discountConfigFacade.sendDiscountForApproval({
          id: this.discountDetails.id,

          remarks: {
            remarks: value,
            fileDetils: {
              fileId: this.discountDetails.workflowFileUploadDetails.data.fileId
                ? this.discountDetails.workflowFileUploadDetails.data.fileId
                : null,
              fileName: this.discountDetails.workflowFileUploadDetails.data
                .fileName
                ? this.discountDetails.workflowFileUploadDetails.data.fileName
                : null
            }
          },
          typeOfDiscount:
            this.tabType === 'amendment'
              ? DiscountEnums.REQUEST_AMENDMENT
              : DiscountEnums.REQUEST_NEW
        });
      }
    } else {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'Please Upload FAQ Document'
      });
    }
  }
  updateEmpowermentDiscountDetails(event) {
    const discountComponents = {
      configDetails: event.configDetails,
      isActive: event.isActive,
      discountPercent: Number(event.discountPercent),
      removeDetails: [],
      updateDetails: [event.id]
    };
    this.discountConfigFacade.updateEmpowermentDetails({
      discountId: this.params,
      discountComponents: discountComponents
    });
  }

  acceptOrRejectRequestNotification() {
    const key = 'pw.discountConfig.acceptRejectMsg';
    const buttonKey1 = 'pw.discountConfig.acceptButtonText';
    const buttonKey2 = 'pw.discountConfig.rejectButtonText';
    this.translate
      .get([key, buttonKey1, buttonKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: translatedMessages[key],
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
            hasRemarks: true,
            isRemarksMandatory: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            switch (event.selectedId) {
              case 1: {
                this.approveOrCancelDiscount(
                  StatusTypesEnum.APPROVED,
                  event.data
                );

                break;
              }
              case 2: {
                this.approveOrCancelDiscount(
                  StatusTypesEnum.REJECTED,
                  event.data
                );

                break;
              }
            }
          });
      });
  }
  showSendForApprovalNotification() {
    this.overlayNotification.close();
    if (this.params !== DiscountEnums.NEW) {
      const buttonKey1 = 'pw.discountConfig.cancelButtonText';
      const buttonKey2 = 'pw.discountConfig.sendForApprovaltButtonText';
      this.translate
        .get(['', buttonKey1, buttonKey2])
        .pipe(take(1))
        .subscribe((translatedMessages: any) => {
          const ref = this.overlayNotification.show({
            type: OverlayNotificationType.MULTI_ACTION,
            message: '',
            buttons: [
              {
                id: 1,
                text: translatedMessages[buttonKey1],
                css: 'pw-primary-btn'
              },
              {
                id: 2,
                text: translatedMessages[buttonKey2],
                css: 'pw-accent-btn',
                hasRemarksValidation: true
              }
            ],
            hasRemarks: true,
            isRemarksMandatory: true,
            remarksValue:
              this.remarksValue !== '' &&
              this.remarksValue !== null &&
              this.remarksValue !== undefined
                ? this.remarksValue
                : ''
          });

          ref.remarksEvent
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: string) => {
              this.remarksValue = event;
            });
          ref.events
            .pipe(take(1))
            .subscribe((event: OverlayNotificationEventRef) => {
              switch (event.selectedId) {
                case 1: {
                  this.router.navigate([getDiscountConfigRquestRouteUrl()]);

                  break;
                }
                case 2: {
                  this.sendForApproval(event.data);
                  this.enableWorkflowNotification();

                  break;
                }
              }
            });
        });
    }
  }

  approveOrCancelDiscount(status, value = null) {
    this.discountConfigFacade.approveorCancelDiscount({
      id: this.params,
      remarks: { remarks: value },
      approvalStatus: status
    });
  }

  isActiveValue(event) {
    this.isActive = event;
  }
  loadSubBrands(event) {
    this.discountConfigFacade.loadSubBrands(event);
  }
  isDateRangeApplicable() {
    return (
      this.selectedDiscount !==
      this.discountTypeEnumRef.RIVAAH_ASHIRWAAD_DISCOUNT
    );
  }

  getProductGroupDetails() {
    this.loadPGMappingWithCharges({
      pgType: null,
      pageIndex: this.productGroupPageEvent.pageIndex,
      pageSize: this.productGroupPageEvent.pageSize
    });
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.discountConfigFacade.resetDiscounts();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
