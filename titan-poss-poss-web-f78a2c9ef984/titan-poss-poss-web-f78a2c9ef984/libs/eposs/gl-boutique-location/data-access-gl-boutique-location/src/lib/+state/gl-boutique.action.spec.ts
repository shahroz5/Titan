import { CustomErrors, GlBoutiqueLocationList, GlBoutiqueLocationListingPayload, GlBoutiqueLocationSuccessPayload } from "@poss-web/shared/models";
import { EditGlBoutqueLocationDetails, EditGlBoutqueLocationDetailsFailure, EditGlBoutqueLocationDetailsSuccess, GlBoutiqueLocationActionTypes, LoadGlBoutiqueList, LoadGlBoutiqueListByLocationCode, LoadGlBoutiqueListByLocationCodeFailure, LoadGlBoutiqueListByLocationCodeSuccess, LoadGlBoutiqueListFailure, LoadGlBoutiqueListSuccess, ResetGlBoutiqueDetails, SaveGlBoutqueLocationDetails, SaveGlBoutqueLocationDetailsFailure, SaveGlBoutqueLocationDetailsSuccess, SearchByLocationCode, SearchByLocationCodeFailure, SearchByLocationCodeSuccess } from "./gl-botique.action";
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

const glBoutiqueLocationList: GlBoutiqueLocationList = {
  costCenter: 'costCenter',
  fitCode: 'fitCode',
  glCode: 'glCode',
  pifSeriesNo: 'number',
  locationCode: 'locationCode',
  isActive: false
}
describe('GlBoutiqueLocation Action Testing Suite', () => {
  describe('LoadGlBoutiqueLocationList Action Test Cases', () => {
    it('should check correct type is used for LoadGlBoutiqueLocationList action', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadGlBoutiqueList(payload);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST,
        payload
      })
    })
    it('should check correct type is used for LoadGlBoutiqueLocationListSuccess action', () => {
      const payload: GlBoutiqueLocationSuccessPayload = {
        glBoutiqueLocationListing: [{
          costCenter: 'costCenter',
          fitCode: 'fitCode',
          glCode: 'glCode',
          pifSeriesNo: 'number',
          locationCode: 'locationCode',
          isActive: false
        }],
        totalElements: 6
      }
      const action = new LoadGlBoutiqueListSuccess(payload);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_SUCCESS,
        payload
      })
    })
    it('should check correct type is used for LoadGlBoutiqueListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGlBoutiqueListFailure(payload);

      expect({ ...action }).toEqual({
        type:
        GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_LIST_FAILURE,
        payload
      });
    });
  })
  describe('LoadGlBoutiqueListByLocationCode  Action Test Cases', () => {
    it('should check correct type is used for 8 action', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadGlBoutiqueListByLocationCode('payload');
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE,
        payload: 'payload'
      })
    })
    it('should check correct type is used for LoadGlBoutiqueListByLocationCodeSuccess action', () => {
      const action = new LoadGlBoutiqueListByLocationCodeSuccess(glBoutiqueLocationList);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_SUCCESS,
        payload: glBoutiqueLocationList
      })
    })
    it('should check correct type is used for  LoadGlBoutiqueListByLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadGlBoutiqueListByLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type:
        GlBoutiqueLocationActionTypes.LOAD_GL_BTQ_LOCATION_BY_LOCATION_CODE_FAILURE,
        payload
      });
    });
  })

  describe('SaveGlBoutqueLocationDetails   Action Test Cases', () => {
    it('should check correct type is used for SaveGlBoutqueLocationDetails action', () => {
      const action = new SaveGlBoutqueLocationDetails(glBoutiqueLocationList);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS,
        payload: glBoutiqueLocationList
      })
    })
    it('should check correct type is used for SaveGlBoutqueLocationDetailsSuccess action', () => {
      const action = new SaveGlBoutqueLocationDetailsSuccess(glBoutiqueLocationList);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_SUCCESS,
        payload: glBoutiqueLocationList
      })
    })
    it('should check correct type is used for  SaveGlBoutqueLocationDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveGlBoutqueLocationDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
        GlBoutiqueLocationActionTypes.SAVE_GL_BTQ_LOCATION_DETAILS_FAILURE,
        payload
      });
    });
  })

  describe('EditGlBoutqueLocationDetails Action Test Cases', () => {
    it('should check correct type is used for EditGlBoutqueLocationDetails action', () => {
      const action = new EditGlBoutqueLocationDetails(glBoutiqueLocationList);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS,
        payload: glBoutiqueLocationList
      })
    })
    it('should check correct type is used for EditGlBoutqueLocationDetailsSuccess action', () => {
      const action = new EditGlBoutqueLocationDetailsSuccess(glBoutiqueLocationList);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_SUCCESS,
        payload: glBoutiqueLocationList
      })
    })
    it('should check correct type is used for  SaveGlBoutqueLocationDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditGlBoutqueLocationDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type: GlBoutiqueLocationActionTypes.EDIT_GL_BTQ_LOCATION_DETAILS_FAILURE,
        payload
      });
    });
  })

  describe('SearchByLocationCode Action Test Cases', () => {
    it('should check correct type is used for SearchByLocationCode action', () => {
      const action = new SearchByLocationCode('payload');
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE,
        payload: 'payload'
      })
    })
    it('should check correct type is used for SearchByLocationCodeSuccess action', () => {
      const payload: GlBoutiqueLocationList[] = [{
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'locationCode',
        isActive: false
      }]
      const action = new SearchByLocationCodeSuccess(payload);
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_SUCCESS,
        payload
      })
    })
    it('should check correct type is used for  SearchByLocationCodeFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchByLocationCodeFailure(payload);

      expect({ ...action }).toEqual({
        type: GlBoutiqueLocationActionTypes.SEARCH_BY_LOCATION_CODE_FAILURE,
        payload
      });
    });
  })
  describe('ResetGlBoutiqueDetails Action Test Cases', () => {
    it('should check correct type is used for ResetGlBoutiqueDetails action', () => {
      const action = new ResetGlBoutiqueDetails();
      expect({...action}).toEqual({
        type: GlBoutiqueLocationActionTypes.RESET_GL_BOUTIQUE,
      })
    })
  })
})
