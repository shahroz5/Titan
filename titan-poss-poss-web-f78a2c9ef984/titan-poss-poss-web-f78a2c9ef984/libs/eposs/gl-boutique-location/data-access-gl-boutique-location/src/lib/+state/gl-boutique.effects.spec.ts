import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { DataPersistence } from "@nrwl/angular";
import { Observable } from "rxjs";
import { hot, cold } from 'jasmine-marbles';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { GlBoutiqueLocationService } from "../gl-boutique-location.service";
import { GlBoutiqueLocationEffect } from "./gl-boutique.effects";
import { POSS_WEB_API_URL } from "@poss-web/shared/util-config";
import { EditGlBoutqueLocationDetails, EditGlBoutqueLocationDetailsFailure, EditGlBoutqueLocationDetailsSuccess, LoadGlBoutiqueList, LoadGlBoutiqueListByLocationCode, LoadGlBoutiqueListByLocationCodeFailure, LoadGlBoutiqueListByLocationCodeSuccess, LoadGlBoutiqueListFailure, LoadGlBoutiqueListSuccess, SaveGlBoutqueLocationDetails, SaveGlBoutqueLocationDetailsFailure, SaveGlBoutqueLocationDetailsSuccess, SearchByLocationCode, SearchByLocationCodeFailure, SearchByLocationCodeSuccess } from "./gl-botique.action";
import { GlBoutiqueLocationList, GlBoutiqueLocationListingPayload, GlBoutiqueLocationSuccessPayload } from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";

describe('GlBoutiqueLocationEffect', () => {
  let actions$: Observable<any>;
  let effect: GlBoutiqueLocationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};
  let glBoutiqueLocationService = jasmine.createSpyObj<GlBoutiqueLocationService>(
    'GlBoutiqueLocationService',
    [
      'getGlBoutiqueLocationList',
      'getGlBoutiqueLocationDetailsByLocationCode',
      'saveGlBoutiqueLocationDetails',
      'editGlBoutiqueLocationDetails',
      'getGlBoutiqueLocationSearchResult'
    ]
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GlBoutiqueLocationEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: GlBoutiqueLocationService,
          useValue: {
            getGlBoutiqueLocationList: jasmine.createSpy(),
            getGlBoutiqueLocationDetailsByLocationCode: jasmine.createSpy(),
            saveGlBoutiqueLocationDetails: jasmine.createSpy(),
            editGlBoutiqueLocationDetails: jasmine.createSpy(),
            getGlBoutiqueLocationSearchResult: jasmine.createSpy()
          }
        }
      ]
    })
    effect = TestBed.inject(GlBoutiqueLocationEffect);
    glBoutiqueLocationService = TestBed.inject<any>(GlBoutiqueLocationService);
  });
  describe('loadGlBoutiqueDetails', () => {
    it('should return loadOrderPaymentConfig response', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const successPayload: GlBoutiqueLocationSuccessPayload = {
        glBoutiqueLocationListing: [{
          costCenter: 'costCenter',
          fitCode: 'fitCode',
          glCode: 'glCode',
          pifSeriesNo: 'number',
          locationCode: 'location',
          isActive: false
        }],
        totalElements: 6
      }
      const action = new LoadGlBoutiqueList(payload);
      const outcome = new LoadGlBoutiqueListSuccess(successPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.getGlBoutiqueLocationList.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadGlBoutiqueDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadGlBoutiqueList(payload);
      const error = new Error('some error');
      const outcome = new LoadGlBoutiqueListFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      glBoutiqueLocationService.getGlBoutiqueLocationList.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlBoutiqueDetails$).toBeObservable(expected);
    });
  })

  describe('loadGlBoutiqueDetailsBylocationCode', () => {
    it('should return loadGlBoutiqueDetailsBylocationCode response', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const successPayload: GlBoutiqueLocationList = {
          costCenter: 'costCenter',
          fitCode: 'fitCode',
          glCode: 'glCode',
          pifSeriesNo: 'number',
          locationCode: 'location',
          isActive: false
      }
      const action = new LoadGlBoutiqueListByLocationCode('payload');
      const outcome = new LoadGlBoutiqueListByLocationCodeSuccess(successPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.getGlBoutiqueLocationDetailsByLocationCode.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.loadGlBoutiqueDetailsBylocationCode$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const action = new LoadGlBoutiqueListByLocationCode('payload');
      const error = new Error('some error');
      const outcome = new LoadGlBoutiqueListByLocationCodeFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      glBoutiqueLocationService.getGlBoutiqueLocationDetailsByLocationCode.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.loadGlBoutiqueDetailsBylocationCode$).toBeObservable(expected);
    });
  })
  describe('saveGlBoutiqueFormDetails', () => {
    it('should return saveGlBoutiqueFormDetails response', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const successPayload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'location',
        isActive: false
      }
      const action = new SaveGlBoutqueLocationDetails(successPayload);
      const outcome = new SaveGlBoutqueLocationDetailsSuccess(successPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.saveGlBoutiqueLocationDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.saveGlBoutiqueFormDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const successPayload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'location',
        isActive: false
      }
      const action = new SaveGlBoutqueLocationDetails(successPayload);
      const error = new Error('some error');
      const outcome = new SaveGlBoutqueLocationDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      glBoutiqueLocationService.saveGlBoutiqueLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.saveGlBoutiqueFormDetails$).toBeObservable(expected);
    });
  })

  describe('EditGlBoutqueLocationDetails', () => {
    it('should return EditGlBoutqueLocationDetails response', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const successPayload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'location',
        isActive: false
      }
      const action = new EditGlBoutqueLocationDetails(successPayload);
      const outcome = new EditGlBoutqueLocationDetailsSuccess(successPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.editGlBoutiqueLocationDetails.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.editGlBoutiqueDetails$).toBeObservable(expected$);
    })
    it('should fail and return an action with the error', () => {
      const successPayload: GlBoutiqueLocationList = {
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'location',
        isActive: false
      }
      const action = new EditGlBoutqueLocationDetails(successPayload);
      const error = new Error('some error');
      const outcome = new EditGlBoutqueLocationDetailsFailure(
      CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#', {}, error);
      glBoutiqueLocationService.editGlBoutiqueLocationDetails.and.returnValue(response$);
      const expected = cold('--b', { b: outcome });
      expect(effect.editGlBoutiqueDetails$).toBeObservable(expected);
    });
  })
  describe('SearchByLocationCode', () => {
    it('should return SearchByLocationCode response', () => {
      const payload: GlBoutiqueLocationListingPayload = {
        pageIndex: 0,
        pageSize: 10
      }
      const successPayload: GlBoutiqueLocationList[] = [{
        costCenter: 'costCenter',
        fitCode: 'fitCode',
        glCode: 'glCode',
        pifSeriesNo: 'number',
        locationCode: 'location',
        isActive: false
      }]
      const action = new SearchByLocationCode('successPayload');
      const outcome = new SearchByLocationCodeSuccess(successPayload);

      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.getGlBoutiqueLocationSearchResult.and.returnValue(response$);

      const expected$ = cold('--c', { c: outcome });
      expect(effect.searchGlBoutiqueDetails$).toBeObservable(expected$);
    })
    /* it('should fail and return an action with the error', () => {
      const successPayload: GlBoutiqueLocationSuccessPayload = {
        glBoutiqueLocationListing: [{
          costCenter: 'costCenter',
          fitCode: 'fitCode',
          glCode: 'glCode',
          pifSeriesNo: 'number',
          locationCode: 'location',
          isActive: false
        }],
        totalElements: 6
      }
      const action = new SearchByLocationCode('successPayload');
      const error = new Error('some error');
      const outcome = new LoadGlBoutiqueListSuccess(
        successPayload
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-b|', {
        b: successPayload
      });
      glBoutiqueLocationService.getGlBoutiqueLocationSearchResult.and.returnValue(response$);
      const expected = cold('--c', { c: outcome });
      expect(effect.searchGlBoutiqueDetails$).toBeObservable(expected);
    });*/
  })
})



