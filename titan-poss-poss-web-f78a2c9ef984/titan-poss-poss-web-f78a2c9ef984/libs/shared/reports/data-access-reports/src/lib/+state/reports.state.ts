import {
  CustomErrors,
  BrandSummary,
  RegionSummary,
  Lov,
  CountrySummary,
  StateSummary,
  TownSummary,
  LocationSummaryList,
  ProductGroup,
  ProductCategory,
  BinGroup,
  BinCode,
  ReportName,
  Report,
  CheckBoxSelectedOption,
  ReportField,
  PaymentCodeList,
  ReportGroupLov,
  ReportRoleSetting,
  AutoReportList,
  SearchParameter,
  ComplexityCode,
  Karatage
} from '@poss-web/shared/models';

export const REPORTS_FEATURE_KEY = 'reports';

export interface ReportsState {
  reportGroups: ReportGroupLov[];
  reportNames: ReportName[];
  applicableReportNames: ReportName[];
  reportRoles: ReportRoleSetting[];
  reportFields: ReportField[];
  reportSettings: CheckBoxSelectedOption[];
  isLoading: boolean;
  isLoadingReports: boolean;
  error: CustomErrors;

  reports: Report[];
  totalReports: number;
  brands: BrandSummary[];
  subBrands: BrandSummary[];
  regions: RegionSummary[];
  levels: Lov[];
  countries: CountrySummary[];
  states: StateSummary[];
  towns: TownSummary[];
  locations: LocationSummaryList[];
  productGroups: ProductGroup[];
  productCategories: ProductCategory[];
  binGroups: BinGroup[];
  binCodes: BinCode[];
  cnType: any;
  cnStatus: any;

  generateReportResponse: {
    id: string;
  };

  saveReportResponse: {
    isSaved: boolean;
  };
  paymentType: PaymentCodeList[];
  roles: any;
  transferTypes: any;
  autoReportList: AutoReportList[];
  searchParameterResponse: SearchParameter;
  saveSearchResponse: boolean;
  templateId: string;
  templateName: string;
  complexityCode: ComplexityCode[];
  karatage: Karatage[];
  rso: string[];
}
