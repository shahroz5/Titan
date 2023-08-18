import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import {
  CustomErrors,
  CreatePurityPayload,
  UpdatePurityPayload,
  PurityListPayload,
  PurityListResult,
  MaterialType
} from '@poss-web/shared/models';
import {
  LoadPurityListSuccess,
  LoadPurityListFailure,
  CreatePurity,
  CreatePuritySuccess,
  CreatePurityFailure,
  LoadPurityByMaterialCodeAndPurity,
  LoadPurityByMaterialCodeAndPuritySuccess,
  LoadPurityByMaterialCodeAndPurityFailure,
  LoadReset,
  LoadPurityList,
  UpdatePurity,
  UpdatePuritySuccess,
  UpdatePurityFailure,
  PurityActionTypes
} from './purity.actions';
import {
  LoadMetalTypes,
  LoadMetalTypesSuccess,
  LoadMetalTypesFailure
} from './purity.actions';

describe('Purity Action Testing Suite', () => {
  describe('LoadPurityList Action Test Cases', () => {
    it('should check correct type is used for  LoadPurityList action ', () => {
      const payload: PurityListPayload = {
        pageIndex: 0,
        pageSize: 100,
        length: 0
      };
      const searchValue = 'J';
      const action = new LoadPurityList(payload, searchValue);
      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_PURITY_LISTING,
        payload,
        searchValue
      });
    });
    it('should check correct type is used for  LoadPurityListSuccess action ', () => {
      const payload: PurityListResult = {
        purityList: [
          {
            purity: '90',
            offset: '1',
            materialCode: 'J',
            karat: '24',
            description: 'purity for j',
            isActive: true
          }
        ],
        totalElements: 1
      };
      const action = new LoadPurityListSuccess(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_PURITY_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPurityListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPurityListFailure(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_PURITY_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('CreatePurity Action Test Cases', () => {
    it('should check correct type is used for  CreatePurity action ', () => {
      const payload: CreatePurityPayload = {
        purity: '90',
        offset: '1',
        itemTypeCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };

      const action = new CreatePurity(payload);
      expect({ ...action }).toEqual({
        type: PurityActionTypes.CREATE_PURITY,
        payload
      });
    });
    it('should check correct type is used for CreatePuritySuccess action ', () => {
      const action = new CreatePuritySuccess();

      expect({ ...action }).toEqual({
        type: PurityActionTypes.CREATE_PURITY_SUCCESS
      });
    });
    it('should check correct type is used for  CreatePurityFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new CreatePurityFailure(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.CREATE_PURITY_FAILURE,
        payload
      });
    });
  });

  describe('UpdatePurity Action Test Cases', () => {
    it('should check correct type is used for  UpdatePurity action ', () => {
      const payload: UpdatePurityPayload = {
        id: 1,
        data: {
          isActive: false
        }
      };
      const action = new UpdatePurity(payload);
      expect({ ...action }).toEqual({
        type: PurityActionTypes.UPDATE_PURITY_DETAIL,
        payload
      });
    });
    it('should check correct type is used for CreatePuritySuccess action ', () => {
      const action = new UpdatePuritySuccess();

      expect({ ...action }).toEqual({
        type: PurityActionTypes.UPDATE_PURITY_DETAIL_SUCCESS
      });
    });
    it('should check correct type is used for  UpdatePurityFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new UpdatePurityFailure(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.UPDATE_PURITY_DETAIL_FAILURE,
        payload
      });
    });
  });

  describe('LoadPurityByMaterialCodeAndPurity Action Test Cases', () => {
    it('should check correct type is used for  LoadPurityByMaterialCodeAndPurity action ', () => {
      const payload = 'J';
      const action = new LoadPurityByMaterialCodeAndPurity(payload);
      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY,
        payload
      });
    });
    it('should check correct type is used for LoadPurityByMaterialCodeAndPuritySuccess action ', () => {
      const payload = {
        purity: '90',
        offset: '1',
        materialCode: 'J',
        karat: '24',
        description: 'purity for j',
        isActive: true
      };

      const action = new LoadPurityByMaterialCodeAndPuritySuccess(payload);

      expect({ ...action }).toEqual({
        type:
          PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadPurityByMaterialCodeAndPurityFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadPurityByMaterialCodeAndPurityFailure(payload);

      expect({ ...action }).toEqual({
        type:
          PurityActionTypes.LOAD_PURITY_DETAIL_BY_MATERIAL_CODE_AND_PURITY_FAILURE,
        payload
      });
    });
  });

  describe('LoadMetalTypes Action Test Cases', () => {
    it('should check correct type is used for  LoadMetalTypes action ', () => {
      const action = new LoadMetalTypes();
      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_METAL_TYPES
      });
    });
    it('should check correct type is used for LoadMetalTypesSuccess action ', () => {
      const payload: MaterialType[] = [
        {
          materialCode: 'J',
          description: 'Gold'
        }
      ];

      const action = new LoadMetalTypesSuccess(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_METAL_TYPES_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for  LoadMetalTypesFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadMetalTypesFailure(payload);

      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_METAL_TYPES_FAILURE,
        payload
      });
    });
  });

  describe('LoadReset Action Test Cases', () => {
    it('should check correct type is used for  LoadReset action ', () => {
      const action = new LoadReset();
      expect({ ...action }).toEqual({
        type: PurityActionTypes.LOAD_RESET
      });
    });
  });
});
