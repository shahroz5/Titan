// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  ReportGroupLov,
  ReportName,
  ReportField,
  CheckBoxSelectedOption,
  ReportReponse,
  BrandSummary,
  ReportRoleSetting,
  RegionSummary,
  Lov,
  CountrySummary,
  TownSummary,
  LocationSummaryList,
  ProductGroup,
  BinCode,
  PaymentCodeList,
  AutoReportList,
  BinGroup,
  ProductCategory
} from '@poss-web/shared/models';

import { initialState } from './reports.reducer';
import * as selectors from './reports.selectors';

import { ReportsState } from './reports.state';

describe('ReportsState selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };

  describe('Testing ReportsState related Selectors', () => {
    it('selectIsLoading Should return the list of material price list', () => {
      const state: ReportsState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.ReportsSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('selectIsLoadingReports Should return the true or false', () => {
      const state: ReportsState = {
        ...initialState,
        isLoadingReports: true
      };
      expect(
        selectors.ReportsSelectors.selectIsLoadingReports.projector(state)
      ).toEqual(true);
    });
    it('selectError Should return the error object', () => {
      const state: ReportsState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.ReportsSelectors.selectError.projector(state)).toEqual(
        error
      );
    });

    it('selectReportGroups Should return the true or false', () => {
      const reportGroups: ReportGroupLov[] = [
        {
          code: 'INVENTORY_REPORT',
          value: 'Inventory Report'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        reportGroups: reportGroups
      };
      expect(
        selectors.ReportsSelectors.selectReportGroups.projector(state)
      ).toEqual(reportGroups);
    });

    it('selectTotalReports  Should return total elements', () => {
      const state: ReportsState = {
        ...initialState,
        totalReports: 10
      };
      expect(
        selectors.ReportsSelectors.selectTotalReports.projector(state)
      ).toEqual(10);
    });
    it('selectReportNames ', () => {
      const reportName: ReportName[] = [
        {
          reportDes: 'stock receive details',
          reportGroup: 'Inventory Group',
          reportType: 'DETIAL',
          maxNoOfDays: 90,
          name: 'STOCK RECEIVE DETAIL',
          id: '1'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        reportNames: reportName
      };
      expect(
        selectors.ReportsSelectors.selectReportNames.projector(state)
      ).toEqual(reportName);
    });

    it('selectReportRoles  Should return total elements', () => {
      const reportRoleSetting: ReportRoleSetting[] = [
        {
          id: '1',
          reportId: '2',
          reportName: 'Stock receive detail',
          fromAccessTime: '10:20',
          toAccessTime: '10:30'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        reportRoles: reportRoleSetting
      };
      expect(
        selectors.ReportsSelectors.selectReportRoles.projector(state)
      ).toEqual(reportRoleSetting);
    });

    it('selectReportFields  Should return total elements', () => {
      const reportField: ReportField[] = [
        {
          reportFieldId: '1',
          fieldName: 'Location code'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        reportFields: reportField
      };
      expect(
        selectors.ReportsSelectors.selectReportFields.projector(state)
      ).toEqual(reportField);
    });

    it('selectReportSettings  ', () => {
      const reportSetting: CheckBoxSelectedOption[] = [
        {
          id: '1',
          rowHeaderKey: 'Location code',
          columnHeaderKey: 'isExclude'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        reportSettings: reportSetting
      };
      expect(
        selectors.ReportsSelectors.selectReportSettings.projector(state)
      ).toEqual(reportSetting);
    });

    it('selectReports  ', () => {
      const reports: ReportReponse = {
        reports: [
          {
            reportType: 'SUMMARY',
            reportDes: 'STOCK RECEIVE',
            reportMasterId: '1',
            status: 'completed',
            id: '1'
          }
        ],
        totalReports: 1
      };
      const state: ReportsState = {
        ...initialState,
        reports: reports.reports
      };
      expect(selectors.ReportsSelectors.selectReports.projector(state)).toEqual(
        reports.reports
      );
    });

    it('selectBrands  ', () => {
      const brand: BrandSummary[] = [
        {
          brandCode: 'Tanishq',
          description: 'Tanishq'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        brands: brand
      };
      expect(selectors.ReportsSelectors.selectBrands.projector(state)).toEqual(
        brand
      );
    });

    it('selectRegions  ', () => {
      const regions: RegionSummary[] = [
        {
          regionCode: 'EAST',
          description: 'EAST'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        regions: regions
      };
      expect(selectors.ReportsSelectors.selectRegions.projector(state)).toEqual(
        regions
      );
    });

    it('selectLevels  ', () => {
      const levels: Lov[] = [
        {
          code: 'L1',
          value: 'LEVEL 1',
          isActive: true
        }
      ];
      const state: ReportsState = {
        ...initialState,
        levels: levels
      };
      expect(selectors.ReportsSelectors.selectLevels.projector(state)).toEqual(
        levels
      );
    });

    it('selectCountries  ', () => {
      const country: CountrySummary[] = [
        {
          countryCode: 'IND',
          description: 'India',
          isdCode: '+91'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        countries: country
      };
      expect(
        selectors.ReportsSelectors.selectCountries.projector(state)
      ).toEqual(country);
    });

    it('selectTowns  ', () => {
      const towns: TownSummary[] = [
        {
          townCode: 10,
          description: 'Bangalore'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        towns: towns
      };
      expect(selectors.ReportsSelectors.selectTowns.projector(state)).toEqual(
        towns
      );
    });

    it('selectLocations  ', () => {
      const locations: LocationSummaryList[] = [
        {
          locationCode: 'URB',
          description: 'Bangalore'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        locations: locations
      };
      expect(
        selectors.ReportsSelectors.selectLocations.projector(state)
      ).toEqual(locations);
    });

    it('selectProductGroups  ', () => {
      const productGroups: ProductGroup[] = [
        {
          productGroupCode: '76',
          description: 'GOLD COIN'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        productGroups: productGroups
      };
      expect(
        selectors.ReportsSelectors.selectProductGroups.projector(state)
      ).toEqual(productGroups);
    });

    it('selectProductCategories  ', () => {
      const productCategories: ProductCategory[] = [
        {
          productCategoryCode: '76',
          description: 'GOLD COIN',
          isActive: true
        }
      ];
      const state: ReportsState = {
        ...initialState,
        productCategories: productCategories
      };
      expect(
        selectors.ReportsSelectors.selectProductCategories.projector(state)
      ).toEqual(productCategories);
    });

    it('selectBinGroups  ', () => {
      const binGroups: BinGroup[] = [
        {
          binGroupCode: '76',
          description: 'DEFECTIVE COIN',
          isActive: true
        }
      ];
      const state: ReportsState = {
        ...initialState,
        binGroups: binGroups
      };
      expect(
        selectors.ReportsSelectors.selectBinGroups.projector(state)
      ).toEqual(binGroups);
    });

    it('selectBinCodes  ', () => {
      const binCodes: BinCode[] = [
        {
          binCode: '76',
          description: 'DEFECTIVE COIN'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        binCodes: binCodes
      };
      expect(
        selectors.ReportsSelectors.selectBinCodes.projector(state)
      ).toEqual(binCodes);
    });

    it('selectGenerateReportResponse  ', () => {
      const state: ReportsState = {
        ...initialState,
        generateReportResponse: { id: '120' }
      };
      expect(
        selectors.ReportsSelectors.selectGenerateReportResponse.projector(state)
      ).toEqual({ id: '120' });
    });

    it('selectSaveReportResponse  ', () => {
      const state: ReportsState = {
        ...initialState,
        saveReportResponse: { isSaved: true }
      };
      expect(
        selectors.ReportsSelectors.selectSaveReportResponse.projector(state)
      ).toEqual({ isSaved: true });
    });

    it('selectPaymentType  ', () => {
      const paymentType: PaymentCodeList[] = [
        {
          paymentCode: 'cash'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        paymentType: paymentType
      };
      expect(
        selectors.ReportsSelectors.selectPaymentType.projector(state)
      ).toEqual(paymentType);
    });

    it('selectAutoReportList  ', () => {
      const autoReportList: AutoReportList[] = [
        {
          reportDescription: 'stock receive detail',
          reportId: '1',
          cronExpression: '* * * * * *',
          frequency: 'DAILY',
          isAutoGenerated: true,
          id: '1'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        autoReportList: autoReportList
      };
      expect(
        selectors.ReportsSelectors.selectAutoReportList.projector(state)
      ).toEqual(autoReportList);
    });

    it('selectTransferTypes  ', () => {
      const autoReportList: AutoReportList[] = [
        {
          reportDescription: 'stock receive detail',
          reportId: '1',
          cronExpression: '* * * * * *',
          frequency: 'DAILY',
          isAutoGenerated: true,
          id: '1'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        transferTypes: {}
      };
      expect(
        selectors.ReportsSelectors.selectTransferTypes.projector(state.transferTypes)
      ).toBeUndefined();
    });

    it('selectSearchParameters  ', () => {
      const autoReportList: AutoReportList[] = [
        {
          reportDescription: 'stock receive detail',
          reportId: '1',
          cronExpression: '* * * * * *',
          frequency: 'DAILY',
          isAutoGenerated: true,
          id: '1'
        }
      ];
      const state: ReportsState = {
        ...initialState,
        searchParameterResponse: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectSearchParameters.projector(state.transferTypes)
      ).toBeUndefined();
    });

    it('selectSaveSearchResponse  ', () => {
      const state: ReportsState = {
        ...initialState,
        saveSearchResponse: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectSaveSearchResponse.projector(state.saveSearchResponse)
      ).toBeUndefined();
    });

    it('selectTemplateId  ', () => {
      const state: ReportsState = {
        ...initialState,
        templateId: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectTemplateId.projector(state.templateId)
      ).toBeUndefined();
    });

    it('selectTemplateName  ', () => {
      const state: ReportsState = {
        ...initialState,
        templateName: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectTemplateName.projector(state.templateName)
      ).toBeUndefined();
    });

    it('selectCnType  ', () => {
      const state: ReportsState = {
        ...initialState,
        cnType: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectCnType.projector(state.cnType)
      ).toBeUndefined();
    });

    it('selectCnStatus  ', () => {
      const state: ReportsState = {
        ...initialState,
        cnStatus: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectCnStatus.projector(state.cnStatus)
      ).toBeUndefined();
    });

    it('selectComplexityCode  ', () => {
      const state: ReportsState = {
        ...initialState,
        complexityCode: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectComplexityCode.projector(state.complexityCode)
      ).toBeUndefined();
    });

    it('selectKaratage  ', () => {
      const state: ReportsState = {
        ...initialState,
        karatage: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectKaratage.projector(state.karatage)
      ).toBeUndefined();
    });

    it('selectRso  ', () => {
      const state: ReportsState = {
        ...initialState,
        rso: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectRso.projector(state.rso)
      ).toBeUndefined();
    });

    it('selectApplicableReportNames  ', () => {
      const state: ReportsState = {
        ...initialState,
        applicableReportNames: {} as any
      };
      expect(
        selectors.ReportsSelectors.selectApplicableReportNames.projector(state.applicableReportNames)
      ).toBeUndefined();
    });
  });
});
