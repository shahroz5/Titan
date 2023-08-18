import {
  ComplexityPriceGroupDetails,
  Complexity,
  PriceGroups,
  EditComplexityPriceGroupFormPayload
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadComplexityPriceGroupListingPayload,
  LoadComplexityPriceGroupListingSuccessPayload,
  SaveComplexityPriceGroupFormPayload
} from '@poss-web/shared/models';
import {
  ComplexityPriceGroupActionTypes,
  LoadComplexityPricegroupMappingDetails,
  LoadComplexityPricegroupMappingDetailsSuccess,
  LoadComplexityPricegroupMappingDetailsFailure,
  LoadComplexityPricegroupMappingDetailsById,
  LoadComplexityPricegroupMappingDetailsByIdSuccess,
  LoadComplexityPricegroupMappingDetailsByIdFailure,
  ResetComplexityPricegroupDialog,
  SaveComplexityPricegroupFormDetails,
  SaveComplexityPricegroupFormDetailsSuccess,
  SaveComplexityPricegroupFormDetailsFailure,
  EditComplexityPricegroupFormDetails,
  EditComplexityPricegroupFormDetailsSuccess,
  EditComplexityPricegroupFormDetailsFailure,
  LoadComplexityCode,
  LoadComplexityCodeSuccess,
  LoadComplexityCodeFailure,
  LoadPricegroup,
  LoadPricegroupSuccess,
  LoadPricegroupFailure
} from './complexity-pricegroup-map.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
describe('Complexuty Price group Action Testing Suite', () => {
  describe('LoadStoneTypeDetails Action Test Cases', () => {
    it('should check correct type is used for  LoadComplexityPriceGroupList action ', () => {
      const payload: LoadComplexityPriceGroupListingPayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const searchParamater = 'aaa';
      const action = new LoadComplexityPricegroupMappingDetails(
        payload,
        searchParamater
      );
      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING,
        payload,
        searchParamater
      });
    });
    it('should check correct type is used for  LoadStoneTypeDetailsSuccess action ', () => {
      const payload: LoadComplexityPriceGroupListingSuccessPayload = {
        complexityPricegroupListing: [],
        totalElements: 0
      };
      const action = new LoadComplexityPricegroupMappingDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadStoneTypeDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadComplexityPricegroupMappingDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadComplexityPricegroupMappingDetailsById Action Test Cases', () => {
    it('should check correct type is used for  LoadComplexityPricegroupMappingDetailsById action ', () => {
      const payload = 'abc';
      const action = new LoadComplexityPricegroupMappingDetailsById(payload);
      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID,
        payload
      });
    });
    it('should check correct type is used for LoadComplexityPricegroupMappingDetailsByIdSuccess action ', () => {
      const payload: ComplexityPriceGroupDetails = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };
      const action = new LoadComplexityPricegroupMappingDetailsByIdSuccess(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadComplexityPricegroupMappingDetailsByIdFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadComplexityPricegroupMappingDetailsByIdFailure(
        payload
      );

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_PRICEGROUP_MAPPING_DETAILS_BY_ID_FAILURE,
        payload
      });
    });
  });

  describe('SaveComplexityPricegroupFormDetails Action Test Cases', () => {
    it('should check correct type is used for  SaveComplexityPricegroupFormDetails action ', () => {
      const payload: SaveComplexityPriceGroupFormPayload = {
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };
      const action = new SaveComplexityPricegroupFormDetails(payload);
      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for SaveStoneTypeFormDetailsSuccess action ', () => {
      const payload: ComplexityPriceGroupDetails = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };

      const action = new SaveComplexityPricegroupFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SaveStoneTypeFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveComplexityPricegroupFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.SAVE_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditComplexityPricegroupFormDetails Action Test Cases', () => {
    it('should check correct type is used for  EditComplexityPricegroupFormDetails action ', () => {
      const payload: EditComplexityPriceGroupFormPayload = {
        id: 'ab',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargePunit: 'abc',
        makingChargePgram: 'abc',
        wastagePct: 'abc',
        makingChargePct: 'abc'
      };
      const action = new EditComplexityPricegroupFormDetails(payload);
      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS,
        payload
      });
    });
    it('should check correct type is used for EditComplexityPricegroupFormDetailsSuccess action ', () => {
      const payload: ComplexityPriceGroupDetails = {
        id: 'abc',
        complexityCode: 'abc',
        priceGroup: 'abc',
        makingChargesPerUnit: 'abc',
        makingChargesPerGram: 'abc',
        wastagePercentage: 'abc',
        makingChargesPercentage: 'abc'
      };

      const action = new EditComplexityPricegroupFormDetailsSuccess(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  EditComplexityPricegroupFormDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditComplexityPricegroupFormDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.EDIT_COMPLEXITY_PRICEGROUP_FORM_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadComplexityCode Action Test Cases', () => {
    it('should check correct type is used for  LoadComplexityCode action ', () => {
      const action = new LoadComplexityCode();
      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE
      });
    });
    it('should check correct type is used for LoadComplexityCodeSuccess action ', () => {
      const payload: Complexity[] = [
        {
          complexityCode: 'abc',
          description: 'abc'
        }
      ];

      const action = new LoadComplexityCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadComplexityCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadComplexityCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_COMPLEXITY_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadPricegroup Action Test Cases', () => {
    it('should check correct type is used for  LoadPricegroup action ', () => {
      const action = new LoadPricegroup();
      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP
      });
    });
    it('should check correct type is used for LoadPricegroupSuccess action ', () => {
      const payload: PriceGroups[] = [
        {
          priceGroup: 'abc',
          description: 'abc'
        }
      ];

      const action = new LoadPricegroupSuccess(payload);

      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPricegroupFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPricegroupFailure(payload);

      expect({ ...action }).toEqual({
        type: ComplexityPriceGroupActionTypes.LOAD_PRICEGROUP_FAILURE,
        payload
      });
    });
  });
  describe('ResetComplexityPricegroupDialog Action Test Cases', () => {
    it('should check correct type is used for  ResetComplexityPricegroupDialog action ', () => {
      const action = new ResetComplexityPricegroupDialog();
      expect({ ...action }).toEqual({
        type:
          ComplexityPriceGroupActionTypes.RESET_COMPLEXITY_PRICEGROUP_DIALOG_DATA
      });
    });
  });
});
