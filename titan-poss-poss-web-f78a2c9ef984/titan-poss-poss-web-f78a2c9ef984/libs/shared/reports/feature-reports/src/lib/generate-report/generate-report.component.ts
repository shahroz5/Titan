import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {
  ReportFilterOptions,
  ReportFilterConfig,
  REPORT_GROUPS,
  ReportName,
  OverlayNotificationServiceAbstraction,
  BrandSummary,
  RegionSummary,
  Lov,
  CountrySummary,
  StateSummary,
  TownSummary,
  LocationSummaryList,
  ProductCategory,
  ProductGroup,
  BinGroup,
  BinCode,
  ReportBTQCodePayload,
  GenerateReportRequest,
  OverlayNotificationType,
  CustomErrors,
  SelectDropDownOption,
  SearchParameter,
  LocationSettingAttributesEnum,
  ComplexityCode,
  Karatage,
  ReportFilterOption,
  OtherReceiptsIssuesEnum,
  SharedBodEodFeatureServiceAbstraction
} from '@poss-web/shared/models';
import { ReportsFacade } from '@poss-web/shared/reports/data-access-reports';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, withLatestFrom, take, takeUntil } from 'rxjs/operators';
import {
  getReportHomeRouteUrl,
  getReportSettingsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { FormControl } from '@angular/forms';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';

@Component({
  selector: 'poss-web-generate-report',
  templateUrl: './generate-report.component.html',
  styles: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  filterOptions: ReportFilterOptions = {
    brands: [],
    subBrands: [],
    regions: [],
    levels: [],
    countries: [],
    states: [],
    towns: [],
    locations: [],
    productGroups: [],
    productCategories: [],
    binGroups: [],
    binCodes: [],
    reportNames: [],
    paymentType: [],
    cnType: [],
    cnStatus: [],
    complexityCode: [],
    karatage: [],
    confirmedByRso: [],
    receiptType: [],
    issueType: [],
    transferTypes: []
  };

  issueType: ReportFilterOption[];
  receiptType: ReportFilterOption[];
  reportNameDropDown: SelectDropDownOption[] = [];
  showFilter = false;
  filterConfig: ReportFilterConfig;
  REPORT_GROUPS = REPORT_GROUPS;

  reportGroups: SelectDropDownOption[] = [];
  selectedReportName: any;
  reportNameDetails: ReportName[] = [];
  defaultBrands: string[];
  defaultCountry = null;
  reportGroupControl: FormControl;
  reportNameControl: FormControl;
  selectedReportGroup: string;
  reportNameLabel: string;
  searchParameter$: Observable<SearchParameter>;
  queryId: string;
  empName: any;
  currentFiscalYear: string;
  savedCountryCode: string;
  savedStateId: string;

  savedBrand: string[];
  savedOwnerType: string[];
  savedTown: string[];
  savedRegion: string[];
  fetchSearchTown: boolean;
  fetchSearchLoc: boolean;
  businessDate: any;
  reportNameOptions: any[];
  loadCommon = false;
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private reportsFacade: ReportsFacade,
    private profiledatafacade: ProfileDataFacade,
    private router: Router,
    private translate: TranslateService,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction
  ) {
    const reportNameLabelKey = 'pw.reports.reportNameLabel';
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.businessDate = data;
      });
    this.translate
      .get([reportNameLabelKey])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.reportNameLabel = translatedMessages[reportNameLabelKey];
      });
  }

  ngOnInit() {
    this.reportNameOptions = [
      REPORT_GROUPS.DISCOUNTS_LOC_REPORT,
      REPORT_GROUPS.DISCOUNT_TXN_REPORT,
      REPORT_GROUPS.OTHER_RECEIPT_REPORT,
      REPORT_GROUPS.OTHER_ISSUE_REPORT,
      REPORT_GROUPS.STOCK_DETAIL_REPORT,
      REPORT_GROUPS.STOCK_SUMMARY_REPORT,
      REPORT_GROUPS.PAYMENTS_REPORT,
      REPORT_GROUPS.PAYMENT_DETAIL_REPORT,
      REPORT_GROUPS.SALES_REPORT,
      REPORT_GROUPS.CREDIT_NOTES_REPORT,
      REPORT_GROUPS.CN_REGISTER_REPORT,
      REPORT_GROUPS.STOCK_ISSUE_REPORT
    ];
    this.reportsFacade.clearReportsData();
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: string) => {
        this.currentFiscalYear = fiscalYear;
      });
    this.authFacade
      .getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe(empName => {
        this.empName = empName;
      });

    this.profiledatafacade
      .getUserType()
      .pipe(
        filter((val: string) => !!val),
        withLatestFrom(
          this.profiledatafacade.isCorpUser(),
          this.profiledatafacade.isRegUser(),
          this.profiledatafacade.isBTQUser(),
          this.profiledatafacade.getRegionCode(),
          this.profiledatafacade.getBoutiqueCode()
        ),
        take(1)
      )
      .subscribe(
        ([
          userType,
          isCorpUser,
          isRegUser,
          isBTQUser,
          regionCode,
          boutiqueCode
        ]) => {

          if (isBTQUser) {
            this.reportsFacade.loadRso({
              locationCodes: [boutiqueCode],
              roleCodes: [REPORT_GROUPS.RSOCode]
            });
          }

          if (isCorpUser || isRegUser) {
            this.reportsFacade.loadBrands();
            this.reportsFacade.loadLevels();
            this.reportsFacade.loadCountries();
            if (isCorpUser) {
              this.reportsFacade.loadRegions();
            }
          }
          this.filterConfig = {
            isCorpUser,
            isRegUser,
            isBTQUser,
            boutiqueCode,
            regionCode
          };

          this.showFilter = true;
        }
      );

    this.reportsFacade.loadReportGroups();
    this.reportsFacade.loadProductGroups();
    this.reportsFacade.loadProductCategories();
    this.reportsFacade.loadBinGroups();
    this.reportsFacade.loadPaymentType();
    this.reportsFacade.loadCnStatus();
    this.reportsFacade.loadCnType();
    this.reportsFacade.loadKaratage();
    this.reportsFacade.loadComplexityCode();
    this.reportsFacade.loadTransferTypes();

    this.issueType = [
      {
        id: OtherReceiptsIssuesEnum.ADJUSTMENT.toUpperCase(),
        description: OtherReceiptsIssuesEnum.ADJUSTMENT.toUpperCase()
      },
      {
        id: REPORT_GROUPS.CONVERSION.toUpperCase(),
        description: REPORT_GROUPS.CONVERSION.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.EXHIBITION.toUpperCase(),
        description: OtherReceiptsIssuesEnum.EXHIBITION.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.FOC.toUpperCase(),
        description: OtherReceiptsIssuesEnum.FOC.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.LOAN.toUpperCase(),
        description: OtherReceiptsIssuesEnum.LOAN.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.LOSS.toUpperCase(),
        description: OtherReceiptsIssuesEnum.LOSS.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.PSV.toUpperCase(),
        description: OtherReceiptsIssuesEnum.PSV.toUpperCase()
      }
    ];

    this.receiptType = [
      {
        id: OtherReceiptsIssuesEnum.ADJUSTMENT.toUpperCase(),
        description: OtherReceiptsIssuesEnum.ADJUSTMENT.toUpperCase()
      },
      {
        id: REPORT_GROUPS.CONVERSION.toUpperCase(),
        description: REPORT_GROUPS.CONVERSION.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.EXHIBITION.toUpperCase(),
        description: OtherReceiptsIssuesEnum.EXHIBITION.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.LOAN.toUpperCase(),
        description: OtherReceiptsIssuesEnum.LOAN.toUpperCase()
      },
      {
        id: OtherReceiptsIssuesEnum.PSV.toUpperCase(),
        description: OtherReceiptsIssuesEnum.PSV.toUpperCase()
      }
    ];
    this.filterOptions.issueType = this.issueType;
    this.filterOptions.receiptType = this.receiptType;
    this.reportsFacade
      .getGenerateReportResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((generateReportResponse: { id: string }) => {
        if (generateReportResponse?.id) {
          this.showSuccessNotifcation(generateReportResponse.id);
        }
      });

    this.reportsFacade
      .getApplicableReportNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reportNames: ReportName[]) => {
        this.reportNameControl = new FormControl(reportNames[0]?.id);

          this.filterOptions.reportNames = reportNames;
          this.reportNameDropDown = reportNames?.map(reportName => ({
            value: reportName.id,
            description: reportName.reportDes
          }));
          this.reportNameDetails = reportNames;
          this.selectedReportName = reportNames[0];
          this.reportNameControl.patchValue(this.selectedReportName?.id);
          if (reportNames.length > 0) {
            this.reportsFacade.loadSearchParameter({
              reportMasterId: this.selectedReportName.id,
              employeeCode: this.empName
            });
          }


      });

    this.reportsFacade
      .getReportGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reportGroups => {
        this.reportGroupControl = new FormControl(reportGroups[0]?.code);
        if (reportGroups.length) {
          this.selectedReportGroup = reportGroups[0]?.code;

          this.reportsFacade.loadReportNames(reportGroups[0]?.code);
          this.reportGroups = reportGroups?.map(reportGroup => ({
            value: reportGroup.code,
            description: reportGroup.value
          }));
        }
      });
    this.reportsFacade
      .getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe((brands: BrandSummary[]) => {
        if (brands.length) {
          this.filterOptions.brands = brands.map(brand => ({
            id: brand.brandCode,
            description: brand.brandCode
          }));
          this.defaultBrands = [brands[0].brandCode];
        }
      });

    this.reportsFacade
    .getSubBrands()
    .pipe(takeUntil(this.destroy$))
    .subscribe((brands: BrandSummary[]) => {
      if (brands.length) {
        this.filterOptions.subBrands = brands.map(brand => ({
          id: brand.brandCode,
          description: brand.brandCode
        }));
        // this.defaultBrands = [brands[0].brandCode];
      }
    });
    this.reportsFacade
      .getRegions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((regions: RegionSummary[]) => {
        this.filterOptions.regions = regions.map(region => ({
          id: region.regionCode,
          description: region.regionCode
        }));
      });
    this.reportsFacade
      .getCnStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnStatuses => {
        if (cnStatuses) {
          this.filterOptions.cnStatus = cnStatuses.map(cnStatus => ({
            id: cnStatus.code,
            description: cnStatus.value
          }));
        }
      });

    this.reportsFacade
      .getCnType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnTypes => {
        if (cnTypes) {
          const array = Object.entries(cnTypes);

          for (const arr of array) {
            this.filterOptions.cnType.push({
              id: arr[0],
              description: arr[1].toString()
            });
          }
        }
      });

    this.reportsFacade
      .getLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe((levels: Lov[]) => {
        this.filterOptions.levels = levels
          .map(level => ({
            id: level.code,
            description: level.code
          }))
          .sort((level1, level2) =>
            level1.description.toLocaleLowerCase() >
            level2.description.toLocaleLowerCase()
              ? 1
              : -1
          );
      });

    this.reportsFacade
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries: CountrySummary[]) => {
        if (countries.length) {
          const countryArray = countries.map(country => ({
            value: '' + country.countryCode,
            description: country.description
          }));
          this.filterOptions.countries = countryArray;

          this.defaultCountry = countries[0].countryCode;
          this.reportsFacade.loadStates(countries[0].countryCode);
        }
      });

    this.reportsFacade
      .getStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe((states: StateSummary[]) => {
        const statesArray = states.map(state => ({
          value: '' + state.stateId,
          description: state.description
        }));

        this.filterOptions.states = statesArray;
      });

    this.reportsFacade
      .getTowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe((towns: TownSummary[]) => {
        const townArray = towns.map(town => ({
          id: '' + town.townCode,
          description: town.description
        }));
        if (this.fetchSearchTown) {
          this.filterOptions = {
            ...this.filterOptions,
            towns: townArray
          };
          this.fetchSearchTown = false;
        } else {
          this.filterOptions.towns = towns.map(town => ({
            id: '' + town.townCode,
            description: town.description
          }));
        }
      });

    this.reportsFacade
      .getLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        const locationsArray = locations.map(location => ({
          id: '' + location.locationCode,
          description: location.description
        }));
        if (this.fetchSearchLoc) {
          this.filterOptions = {
            ...this.filterOptions,
            locations: locationsArray
          };
          this.fetchSearchLoc = false;
        } else {
          this.filterOptions.locations = locations.map(location => ({
            id: '' + location.locationCode,
            description: location.description
          }));
        }
      });

    this.reportsFacade
      .getProductCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productCategories: ProductCategory[]) => {
        this.filterOptions.productCategories = productCategories.map(
          productCategory => ({
            id: '' + productCategory.productCategoryCode,
            description: productCategory.description
          })
        );
      });

    this.reportsFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        this.filterOptions.productGroups = productGroups.map(productGroup => ({
          id: '' + productGroup.productGroupCode,
          description: productGroup.description
        }));
      });

    this.reportsFacade
      .getTransferTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.filterOptions.transferTypes = data.map(x => ({
          id: x.code,
          description: x.value
        }));
      });

    this.reportsFacade
      .getBinGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((binGroups: BinGroup[]) => {
        this.filterOptions.binGroups = binGroups.map(binGroup => ({
          id: binGroup.binGroupCode,
          description: binGroup.description
        }));
      });

    this.reportsFacade
      .getBinCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((binCodes: BinCode[]) => {
        this.filterOptions.binCodes = binCodes.map(binCode => ({
          id: binCode.binCode,
          description: binCode.description
        }));
      });

    this.reportsFacade
      .getPaymentType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentTypes: any) => {
        this.filterOptions.paymentType = paymentTypes.map(paymentTypeOb => ({
          id: paymentTypeOb.paymentCode,
          description: paymentTypeOb.paymentCode
        }));
      });
    this.reportsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.reportsFacade
      .getSearchParameter()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.queryId = data.id;
          this.savedCountryCode = data.countryCode;

          this.savedStateId = data.stateId;
          this.savedBrand = data.brandCode;
          this.savedOwnerType = data.ownerType;
          this.savedTown = data.townId;
          this.savedRegion = data.regionCode;
        } else {
          this.queryId = null;
        }
      });

    this.reportsFacade
      .getSaveSearchResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(saved => {
        if (saved) {
          this.showSaveSearchSuccessNotifcation();
        }
      });

    this.reportsFacade
      .getComplexityCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((complexityCode: ComplexityCode[]) => {
        if (complexityCode.length) {
          this.filterOptions.complexityCode = complexityCode.map(
            complexity => ({
              id: complexity.complexityCode,
              description: complexity.complexityCode
            })
          );
        }
      });

    this.reportsFacade
      .getKaratage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((karatage: Karatage[]) => {
        if (karatage.length) {
          this.filterOptions.karatage = karatage.map(karat => ({
            id: karat.karat,
            description: karat.karat
          }));
        }
      });

    this.reportsFacade
      .getRso()
      .pipe(takeUntil(this.destroy$))
      .subscribe(rsoArray => {
        if (rsoArray.length) {
          this.filterOptions.confirmedByRso = rsoArray.map(employeeCode => ({
            id: employeeCode,
            description: employeeCode
          }));
        }
      });
  }

  back() {
    this.reportsFacade.clearReportsData();
    this.router.navigate([getReportHomeRouteUrl()]);
  }

  countryChange(countryCode: string) {
    this.reportsFacade.loadStates(countryCode);
  }

  stateChange(stateCode: string) {
    this.reportsFacade.loadTowns(stateCode);
  }

  loadLocations(data: ReportBTQCodePayload) {
    console.log(data, 'check payload loc');
    this.reportsFacade.loadLocations(data);
  }
  binGroupChange(binGroup: string) {
    this.reportsFacade.loadBinCodes(binGroup);
  }
  locationCodeChange(locationCodes: string[]) {
    this.reportsFacade.loadRso({
      locationCodes: locationCodes,
      roleCodes: [REPORT_GROUPS.RSOCode]
    });
  }

  generateReport(request: GenerateReportRequest) {
    const data = {
      reportId: this.selectedReportName.id,
      request: request
    };
    this.reportsFacade.generateReport(data);
    this.showProgressNotification();
  }

  showProgressNotification() {
    const key = 'pw.reports.progressMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.PROGRESS,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }

  fieldSet() {
    this.router.navigate([
      getReportSettingsRouteUrl(
        this.selectedReportName.id + '-_-' + this.selectedReportGroup
      )
    ]);
  }
  onReprotGroupChange(event) {
    this.reportsFacade.clearReportsData();
    this.selectedReportGroup = event.value;
    this.reportGroupControl.patchValue(event.value);
    this.reportsFacade.loadReportNames(event.value);
    this.searchParameter$ = null;
    this.fetchSearchLoc = false;
    this.fetchSearchTown = false;
    this.loadCommon = false;
  }

  onReportNameChange(event) {
    this.reportNameControl.patchValue(event.value);
    this.selectedReportName = this.reportNameDetails.find(
      report => report.id === event.value
    );
    // condiotion to load common layout
    this.loadCommon = !this.reportNameOptions.includes(
      this.selectedReportName.name
    );

    console.log(this.selectedReportName.name, 'this.selectedReportName.name');

    // loading saved search parameter
    this.reportsFacade.loadSearchParameter({
      reportMasterId: this.selectedReportName.id,
      employeeCode: this.empName
    });
    //get the details
    this.searchParameter$ = null;
    this.fetchSearchLoc = false;
    this.fetchSearchTown = false;
  }
  fetch() {
    this.fetchSearchTown = true;
    this.fetchSearchLoc = true;
    this.reportsFacade.loadSearchParameter({
      reportMasterId: this.selectedReportName.id,
      employeeCode: this.empName
    });
    if (this.savedStateId) {
      this.stateChange(this.savedStateId);
    }
    if (this.savedCountryCode) {
      this.countryChange(this.savedCountryCode);
    }
    this.loadLocations({
      brands: this.savedBrand,
      towns: this.savedTown,
      states: [this.savedStateId],
      countries: [this.savedCountryCode],
      regions: this.savedRegion,
      levels: this.savedOwnerType
    });
    this.searchParameter$ = this.reportsFacade.getSearchParameter();
  }

  generateSalesOrDiscountTxnReport(event, isSalesReport) {
    const formGroup = event.form;

    const request = event.request;

    if (
      formGroup.get('fromDate').value === null &&
      formGroup.get('toDate').value === null &&
      (formGroup.get('fiscalYear').value === null ||
        formGroup.get('fiscalYear').value === '')
    ) {
      this.showAlertNotification('pw.reports.alertMessage1');
    } else if (
      formGroup.get('fromDate').value === null &&
      formGroup.get('toDate').value !== null
    ) {
      this.showAlertNotification('pw.reports.alertMessage3');
    } else if (
      formGroup.get('fromDate').value !== null &&
      formGroup.get('toDate').value === null
    ) {
      this.showAlertNotification('pw.reports.alertMessage3');
    } else if (
      formGroup?.get('fromGrossWeight')?.value !== null &&
      formGroup?.get('toGrossWeight')?.value === null
    ) {
      this.showAlertNotification('pw.reports.alertMessage4');
    } else if (
      formGroup?.get('fromGrossWeight')?.value === null &&
      formGroup?.get('toGrossWeight')?.value !== null
    ) {
      this.showAlertNotification('pw.reports.alertMessage4');
    } else if (
      formGroup?.get('fromValue')?.value === null &&
      formGroup?.get('toValue')?.value !== null
    ) {
      this.showAlertNotification('pw.reports.alertMessage5');
    } else if (
      formGroup?.get('fromValue')?.value !== null &&
      formGroup?.get('toValue')?.value === null
    ) {
      this.showAlertNotification('pw.reports.alertMessage5');
    } else if (
      formGroup?.get('fromValue')?.value !== null &&
      formGroup?.get('toValue')?.value !== null &&
      Number(formGroup?.get('fromValue')?.value) >
        Number(formGroup?.get('toValue')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage6');
    } else if (
      formGroup?.get('fromGrossWeight')?.value !== null &&
      formGroup?.get('toGrossWeight')?.value !== null &&
      Number(formGroup?.get('fromGrossWeight')?.value) >
        Number(formGroup?.get('toGrossWeight')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage7');
    } else if (
      formGroup?.get('fromGrossWeight')?.value !== null &&
      formGroup?.get('toGrossWeight')?.value !== null &&
      Number(formGroup?.get('fromGrossWeight')?.value) ===
        Number(formGroup?.get('toGrossWeight')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage8');
    } else if (
      formGroup?.get('fromValue')?.value !== null &&
      formGroup?.get('toValue')?.value !== null &&
      Number(formGroup?.get('fromValue')?.value) ===
        Number(formGroup?.get('toValue')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage9');
    } else if (isSalesReport === true) {
      if (
        (formGroup.get('fiscalYear').value === null ||
        formGroup.get('fiscalYear').value === '') &&
        !((formGroup.get('customerMobileNo').value === null || formGroup.get('customerMobileNo').value === '') &&
        (formGroup.get('docNo').value === null || formGroup.get('docNo').value === '') &&
        (formGroup.get('customerName').value === null || formGroup.get('customerName').value === '') &&
        (formGroup.get('ulpNo').value === null || formGroup.get('ulpNo').value === ''))
      ) {
        this.showAlertNotification('pw.reports.alertMessage15');
      } else {
        const data = {
          reportId: this.selectedReportName.id,
          request: request
        };
        this.reportsFacade.generateReport(data);
        this.showProgressNotification();
      }
    } else if (isSalesReport === false) {
      if (
        !((formGroup.get('customerMobileNo').value === null || formGroup.get('customerMobileNo').value === '') &&
        (formGroup.get('customerName').value === null || formGroup.get('customerName').value === '') &&
        (formGroup.get('ulpNo').value === null || formGroup.get('ulpNo').value === '')) &&
        (formGroup.get('fiscalYear').value === null || formGroup.get('fiscalYear').value === '')
      ) {
        this.showAlertNotification('pw.reports.alertMessage14');
      } else {
        const data = {
          reportId: this.selectedReportName.id,
          request: request
        };
        this.reportsFacade.generateReport(data);
        this.showProgressNotification();
      }
    }
  }
  generateCreditNoteReport(event) {
    const formGroup = event.form;
    const request = event.request;
    if (
      formGroup.get('fromAmount')?.value !== null &&
      formGroup.get('toAmount')?.value !== null &&
      Number(formGroup.get('fromAmount')?.value) >
        Number(formGroup.get('toAmount')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage10');
    } else if (
      formGroup.get('fromAmount')?.value !== null &&
      formGroup.get('toAmount')?.value !== null &&
      Number(formGroup.get('fromAmount')?.value) ===
        Number(formGroup.get('toAmount')?.value)
    ) {
      this.showAlertNotification('pw.reports.alertMessage11');
    } else if (
      formGroup.get('fromAmount')?.value === null &&
      formGroup.get('toAmount')?.value !== null
    ) {
      this.showAlertNotification('pw.reports.alertMessage12');
    } else if (
      formGroup.get('fromAmount')?.value !== null &&
      formGroup.get('toAmount')?.value === null
    ) {
      this.showAlertNotification('pw.reports.alertMessage12');
    } else {
      const data = {
        reportId: this.selectedReportName.id,
        request: request
      };

      this.reportsFacade.generateReport(data);
      this.showProgressNotification();
    }
  }
  showAlertNotification(key: string, fieldName?: string): void {
    this.translate
      .get(key, fieldName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            hasClose: true,
            hasBackdrop: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  saveSearchParameters(saveSearchParametersPayload) {
    if (this.queryId) {
      const updateSearchParametersPayload = {
        ...saveSearchParametersPayload,

        queryId: this.queryId,
        data: {
          ...saveSearchParametersPayload.data,
          employeeCode: this.empName
        }
      };
      this.reportsFacade.updateSearchParameter(updateSearchParametersPayload);

      this.showProgressNotification();
    } else {
      saveSearchParametersPayload = {
        ...saveSearchParametersPayload,
        data: {
          ...saveSearchParametersPayload.data,
          employeeCode: this.empName
        }
      };
      this.reportsFacade.saveSearchParameter(saveSearchParametersPayload);

      this.showProgressNotification();
    }
  }

  onBrandChange(brandValues: string[]) {
    this.reportsFacade.loadSubBrands(brandValues);
  }
  showSaveSearchSuccessNotifcation() {
    const key = 'pw.reports.saveSearchSuccessMessage';

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasClose: true,
            hasBackdrop: true,
            message: translatedMsg
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  showSuccessNotifcation(reportReferenceId: string) {
    const key = 'pw.reports.generateSuccessMessage';

    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            hasClose: true,
            hasBackdrop: true,
            message: translatedMsg + reportReferenceId
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
