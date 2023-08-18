import * as selectors from './cpg-product-group-config-for-qcgc.selectors';

import { initialState } from './cpg-product-group-config-for-qcgc.reducer';
import { CPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.state';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  InstrumentType,
  PaymentCode,
  ProductGroupMappingOption,
  RedemptionType
} from '@poss-web/shared/models';

describe('CPG Product group Selector Testing Suite', () => {
  describe('Testing selectTotalCpgProductGroupConfig Related Selectors', () => {
    it('should return selectTotalCpgProductGroupConfig Selector', () => {
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        totalCpgProductGroupConfig: 1
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectTotalCpgProductGroupConfig.projector(
          state
        )
      ).toEqual(1);
    });
  });

  describe('Testing selectIsLoading Related Selectors', () => {
    it('should return selectIsLoading Selector', () => {
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectIsLoading.projector(
          state
        )
      ).toEqual(true);
    });
  });

  describe('Testing selectCPGProductGroupConfigListing Related Selectors', () => {
    it('should return selectCPGProductGroupConfigListing Selector', () => {
      const cpgProductGroupConfigListing = [
        {
          description: 'desc',
          instrumentNumber: '0',
          instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
          isActive: true,
          minimumAmount: 0,
          paymentCategoryName: 'name',
          paymentCode: PaymentCode.Qcgc,
          redemptionType: RedemptionType.Full
        }
      ];
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupConfigListing
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupConfigListing.projector(
          state
        )
      ).toEqual(cpgProductGroupConfigListing);
    });
  });
  describe('Testing selectHasSaved Related Selectors', () => {
    it('should return selectHasSaved Selector', () => {
      const cpgProductGroupConfigDetails = {
        description: 'desc',
        instrumentNumber: '0',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupConfigDetails
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetails.projector(
          state
        )
      ).toEqual(cpgProductGroupConfigDetails);
    });
  });
  describe('Testing selectCPGProductGroupConfigDetailsSavedResponse Related Selectors', () => {
    it('should return selectCPGProductGroupConfigDetailsSavedResponse Selector', () => {
      const cpgProductGroupConfigDetails = {
        description: 'desc',
        instrumentNumber: '0',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupConfigDetailsSavedResponse: cpgProductGroupConfigDetails
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetailsSavedResponse.projector(
          state
        )
      ).toEqual(cpgProductGroupConfigDetails);
    });
  });
  describe('Testing selectCPGProductGroupConfigDetailsEditedResponse Related Selectors', () => {
    it('should return selectCPGProductGroupConfigDetailsEditedResponse Selector', () => {
      const cpgProductGroupConfigDetails = {
        description: 'desc',
        instrumentNumber: '0',
        instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
        isActive: true,
        minimumAmount: 0,
        paymentCategoryName: 'name',
        paymentCode: PaymentCode.Qcgc,
        redemptionType: RedemptionType.Full
      };
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupConfigDetailsEditedResponse: cpgProductGroupConfigDetails
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupConfigDetailsEditedResponse.projector(
          state
        )
      ).toEqual(cpgProductGroupConfigDetails);
    });
  });
  describe('Testing selectCPGProductGroupMappingUpdated Related Selectors', () => {
    it('should return selectCPGProductGroupMappingUpdated Selector', () => {
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupMappingUpdated: true
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupMappingUpdated.projector(
          state
        )
      ).toEqual(true);
    });
  });
  describe('Testing selectCPGProductGroupMapping Related Selectors', () => {
    it('should return selectCPGProductGroupMapping Selector', () => {
      const cpgProductGroupMapping: ProductGroupMappingOption[] = [
        {
          description: 'desc',
          id: '1',
          uuid: '2'
        }
      ];
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        cpgProductGroupMapping
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectCPGProductGroupMapping.projector(
          state
        )
      ).toEqual(cpgProductGroupMapping);
    });
  });
  describe('Testing selectError Related Selectors', () => {
    it('should return selectError Selector', () => {
      const state: CPGProductGroupConfigForQCGCState = {
        ...initialState,
        error: CustomErrorAdaptor.fromJson(Error('some error'))
      };
      expect(
        selectors.CPGProductGroupConfigSelectors.selectError.projector(state)
      ).toEqual(CustomErrorAdaptor.fromJson(Error('some error')));
    });
  });
});
