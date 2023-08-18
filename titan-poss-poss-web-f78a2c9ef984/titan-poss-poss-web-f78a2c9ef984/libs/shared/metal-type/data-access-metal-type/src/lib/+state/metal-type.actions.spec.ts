import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CreateMetalTypePayload,
  MetalTypePayload,
  MetalTypeListing,
  MaterialType,
  MaterialTypelov,
  UpdateMetalTypePayload
} from '@poss-web/shared/models';
import {
  MetalTypeActions,
  LoadMetalTypeListSuccess,
  LoadMetalTypeListFailure,
  SearchMetalTypeByMaterialCode,
  SearchMetalTypeByMaterialCodeSuccess,
  SearchMetalTypeByMaterialCodeFailure,
  CreateMetalType,
  CreateMetalTypeSuccess,
  CreateMetalTypeFailure,
  LoadMetalTypeDetailByMaterialCode,
  LoadMetalTypeDetailByMaterialCodeSuccess,
  LoadMetalTypeDetailByMaterialCodeFailure,
  LoadMaterialTypeLov,
  LoadMaterialTypeLovSuccess,
  LoadMaterialTypeLovFailure,
  LoadReset,
  LoadMetalTypeList
} from './metal-type.actions';
import {
  UpdateMetalTypeDeatil,
  UpdateMetalTypeDeatilSuccess,
  UpdateMetalTypeDeatilFailure
} from './metal-type.actions';

describe('Metal type Action Testing Suite', () => {
  describe('LoadMetalTypeList Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypeList action ', () => {
      const payload: MetalTypePayload = {
        pageIndex: 0,
        pageSize: 100
      };
      const action = new LoadMetalTypeList(payload);
      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_LISTING,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalTypeListSuccess action ', () => {
      const payload: MetalTypeListing = { results: [], totalElements: 0 };
      const action = new LoadMetalTypeListSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalTypeListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypeListFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchMetalTypeByMaterialCode Action Test Cases', () => {
    it('should check correct type is used for  SearchMetalTypeByMaterialCode action ', () => {
      const payload = 'J';
      const action = new SearchMetalTypeByMaterialCode(payload);
      expect({ ...action }).toEqual({
        type: MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE,
        payload
      });
    });
    it('should check correct type is used for SearchMetalTypeByMaterialCodeSuccess action ', () => {
      const payload: MetalTypeListing = {
        totalElements: 1,
        results: [
          {
            materialCode: 'J',
            description: 'Gold'
          }
        ]
      };
      const action = new SearchMetalTypeByMaterialCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  SearchMetalTypeByMaterialCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchMetalTypeByMaterialCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE_FAILURE,
        payload
      });
    });
  });

  describe('CreateMetalType Action Test Cases', () => {
    it('should check correct type is used for  CreateMetalType action ', () => {
      const payload: CreateMetalTypePayload = {
        materialTypeCode: 'J',

        description: 'Gold',
        isActive: true,
        orgCode: 'TJ'
      };
      const action = new CreateMetalType(payload);
      expect({ ...action }).toEqual({
        type: MetalTypeActions.CREATE_METAL_TYPE,
        payload
      });
    });
    it('should check correct type is used for CreateMetalTypeSuccess action ', () => {
      const action = new CreateMetalTypeSuccess();

      expect({ ...action }).toEqual({
        type: MetalTypeActions.CREATE_METAL_TYPE_SUCCESS
      });
    });
    it('should check correct type is used for  CreateMetalTypeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreateMetalTypeFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.CREATE_METAL_TYPE_FAILURE,
        payload
      });
    });
  });

  describe('UpdateMetalTypeDeatil Action Test Cases', () => {
    it('should check correct type is used for  UpdateMetalTypeDeatil action ', () => {
      const payload: UpdateMetalTypePayload = {
        materialTypeCode: 'J',
        data: {
          isActive: true
        }
      };
      const action = new UpdateMetalTypeDeatil(payload);
      expect({ ...action }).toEqual({
        type: MetalTypeActions.UPDATE_METAL_TYPE_DETAIL,
        payload
      });
    });
    it('should check correct type is used for CreateMetalTypeSuccess action ', () => {
      const payload: MaterialType = {
        materialCode: 'J'
      };
      const action = new UpdateMetalTypeDeatilSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  UpdateMetalTypeDeatilFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdateMetalTypeDeatilFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.UPDATE_METAL_TYPE_DETAIL_FAILURE,
        payload
      });
    });
  });

  describe('LoadMetalTypeDetailByMaterialCode Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypeDetailByMaterialCode action ', () => {
      const payload = 'J';
      const action = new LoadMetalTypeDetailByMaterialCode(payload);
      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE,
        payload
      });
    });
    it('should check correct type is used for LoadMetalTypeDetailByMaterialCodeSuccess action ', () => {
      const payload: MaterialType = {
        materialCode: 'J',
        description: 'Gold'
      };

      const action = new LoadMetalTypeDetailByMaterialCodeSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalTypeDetailByMaterialCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypeDetailByMaterialCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE_FAILURE,
        payload
      });
    });
  });

  describe('LoadMaterialTypeLov Action Test Cases', () => {
    it('should check correct type is used for  LoadMaterialTypeLov action ', () => {
      const action = new LoadMaterialTypeLov();
      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_MATERIAL_TYPE_LOV
      });
    });
    it('should check correct type is used for LoadMaterialTypeLovSuccess action ', () => {
      const payload: MaterialTypelov[] = [
        {
          code: 'Metal',
          value: 'Metal'
        }
      ];

      const action = new LoadMaterialTypeLovSuccess(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadMaterialTypeLovFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMaterialTypeLovFailure(payload);

      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_MATERIAL_TYPE_LOV_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: MetalTypeActions.LOAD_RESET
      });
    });
  });
});
