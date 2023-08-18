import {
  CPGProductGroupConfigForQCGCDetails,
  CustomErrors,
  PaymentCode,
  RedemptionType,
  InstrumentType,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCMapping,
  GrnInterboutiqueConfig
} from '@poss-web/shared/models';
import {
  AddNewGrnInterboutiqueConfig,
  AddNewGrnInterboutiqueConfigFailure,
  AddNewGrnInterboutiqueConfigSuccess,
  EditGrnInterboutiqueConfig,
  EditGrnInterboutiqueConfigFailure,
  EditGrnInterboutiqueConfigSuccess,
  GrnInterboutiqueConfigActionTypes,
  LoadGrnInterboutiqueConfig,
  LoadGrnInterboutiqueConfigFailure,
  LoadGrnInterboutiqueConfigSuccess
} from './grn-interboutique-config.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('GRN Interboutique Config Action Testing Suite', () => {
  const responsePayload: CPGProductGroupConfigForQCGCDetails = {
    description: 'desc',
    instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
    isActive: true,
    minimumAmount: 0,
    paymentCategoryName: 'name',
    paymentCode: PaymentCode.Qcgc,
    redemptionType: RedemptionType.Full
  };

  describe('LoadGrnInterboutiqueConfig Action Test Cases', () => {
    it('should check correct type is used for LoadGrnInterboutiqueConfig action', () => {
      const payload = 1;
      const action = new LoadGrnInterboutiqueConfig(payload);
      expect({ ...action }).toEqual({
        type: GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG,
        payload
      });
    });

    it('should check correct type is used for LoadCPGProductGroupConfigForQCGCListingSuccess action', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };

      const action = new LoadGrnInterboutiqueConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadGrnInterboutiqueConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGrnInterboutiqueConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('AddNewGrnInterboutiqueConfig Action Test Cases', () => {

    it('should check correct type is used for AddNewGrnInterboutiqueConfig action', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const action = new AddNewGrnInterboutiqueConfig(payload);
      expect({ ...action }).toEqual({
        type: GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG,
        payload
      });
    });

    it('should check correct type is used for AddNewGrnInterboutiqueConfigSuccess action', () => {
      const payload: GrnInterboutiqueConfig = {
        description: 'Desc',
        isActive: true,
        ruleDetails: {
          type: 'Type',
          data: {
            config: {
              L1: ['1'],
              L2: ['1'],
              L3: ['1']
            },
            type: 'Type'
          }
        },
        ruleId: 1,
        ruleType: 'Type'
      };
      const action = new AddNewGrnInterboutiqueConfigSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for AddNewGrnInterboutiqueConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new AddNewGrnInterboutiqueConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_FAILURE,
        payload
      });
    });
  });

  describe('EditGrnInterboutiqueConfig Action Test Cases', () => {
    const payload1: GrnInterboutiqueConfig = {
      description: 'Desc',
      isActive: true,
      ruleDetails: {
        type: 'Type',
        data: {
          config: {
            L1: ['1'],
            L2: ['1'],
            L3: ['1']
          },
          type: 'Type'
        }
      },
      ruleId: 1,
      ruleType: 'Type'
    };
    it('should check correct type is used for EditGrnInterboutiqueConfig action', () => {
      const payload = {
        ruleId: 1,
        grnInterboutiqueConfig: payload1
      };
      const action = new EditGrnInterboutiqueConfig(payload);
      expect({ ...action }).toEqual({
        type: GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG,
        payload
      });
    });

    it('should check correct type is used for EditGrnInterboutiqueConfigSuccess action', () => {
      const payload = payload1;
      const action = new EditGrnInterboutiqueConfigSuccess(payload1);
      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditGrnInterboutiqueConfigFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditGrnInterboutiqueConfigFailure(payload);

      expect({ ...action }).toEqual({
        type:
          GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_FAILURE,
        payload
      });
    });
  });
});
