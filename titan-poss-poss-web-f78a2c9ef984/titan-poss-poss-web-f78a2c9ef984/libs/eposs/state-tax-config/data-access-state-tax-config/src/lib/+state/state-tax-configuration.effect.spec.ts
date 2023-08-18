import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { hot, cold } from 'jasmine-marbles';
import {
  POSS_WEB_API_URL,
  POSS_WEB_CACHING_STRATEGY
} from '@poss-web/shared/util-config';
import {
  LoadStatesDetailsListingSuccessPayload,
  LoadStateTaxConfigurationListingPayload,
  StateTaxConfigurationListingData,
  StateTaxConfigurationListingResult,
  TaxDetailsConfig,
  TaxDetailsSubmit,
  TaxsList
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { StateTaxConfigurationService } from '../state-tax-configuration.service';
import { StateTaxConfigurationEffect } from './state-tax-configuration.effect';
import { STATE_TAX_CONFIGURATION_FEATURE_KEY } from './state-tax-configuration.reducer';
import {
  EditStateTaxConfigurationStateDetails,
  EditStateTaxConfigurationStateDetailsFailure,
  EditStateTaxConfigurationStateDetailsSuccess,
  LoadAllStateList,
  LoadAllStateListFailure,
  LoadAllStateListSuccess,
  LoadAllTaxClassList,
  LoadAllTaxClassListFailure,
  LoadAllTaxClassListSuccess,
  LoadAllTaxsList,
  LoadAllTaxsListFailure,
  LoadAllTaxsListSuccess,
  LoadAllTaxsystemList,
  LoadAllTaxsystemListFailure,
  LoadAllTaxsystemListSuccess,
  LoadStateTaxConfigurationListing,
  LoadStateTaxConfigurationListingFailure,
  LoadStateTaxConfigurationListingSuccess,
  LoadStateTaxConfigurationStateDetails,
  LoadStateTaxConfigurationStateDetailsFailure,
  LoadStateTaxConfigurationStateDetailsSuccess,
  LoadStateTaxConfigurationTaxDetails,
  LoadStateTaxConfigurationTaxDetailsFailure,
  LoadStateTaxConfigurationTaxDetailsSuccess,
  SaveStateTaxConfigurationStateDetails,
  SaveStateTaxConfigurationStateDetailsFailure,
  SaveStateTaxConfigurationStateDetailsSuccess,
  SaveStateTaxConfigurationTaxDetails,
  SaveStateTaxConfigurationTaxDetailsFailure,
  SaveStateTaxConfigurationTaxDetailsSuccess,
  SearchStateTaxConfigurationListing,
  SearchStateTaxConfigurationListingFailure,
  SearchStateTaxConfigurationListingSuccess
} from './state-tax-configuration.actions';

describe('State Tax Config Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: StateTaxConfigurationEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get', 'post', 'patch']
  );
  const initialState = {};

  const stateTaxConfigServiceSpy = jasmine.createSpyObj<
    StateTaxConfigurationService
  >([
    'getStateTaxConfigurationList',
    'getStateTaxConfigurationStateDetails',
    'getStateTaxConfigurationTaxDetails',
    'getAllStateList',
    'getAllTaxSystemList',
    'getAllTaxClassList',
    'getAllTaxList',
    'saveStateTaxConfigurationStateDetails',
    'editStateTaxConfigurationStateDetails',
    'saveStateTaxConfigurationTaxDetails'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StateTaxConfigurationEffect,
        DataPersistence,
        provideMockStore({
          initialState: {
            [STATE_TAX_CONFIGURATION_FEATURE_KEY]: initialState
          }
        }),
        provideMockActions(() => actions$),
        {
          provide: POSS_WEB_API_URL,
          useValue: ''
        },
        {
          provide: POSS_WEB_CACHING_STRATEGY,
          useValue: []
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: StateTaxConfigurationService,
          useValue: stateTaxConfigServiceSpy
        }
      ]
    });

    effect = TestBed.inject(StateTaxConfigurationEffect);
  });

  describe('LoadStateTaxConfigurationListing', () => {
    it('should return LoadStateTaxConfigurationListingSuccess', () => {
      const payload1: { pageEvent: LoadStateTaxConfigurationListingPayload; stateName?: string } = {
        pageEvent:
        {
          pageIndex: 0,
          pageSize: 10
        }
      };
      const action = new LoadStateTaxConfigurationListing(payload1);

      const payload2: StateTaxConfigurationListingResult = {
        stateTaxConfigurationListing: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const outcome = new LoadStateTaxConfigurationListingSuccess(payload2);
      actions$ = hot('-a', { a: action });

      const response$ = cold('-a|', {
        a: payload2
      });
      stateTaxConfigServiceSpy.getStateTaxConfigurationList.and.returnValue(
        response$
      );

      const expected$ = cold('--b', { b: outcome });
      expect(effect.loadStateTaxConfigurationListing$).toBeObservable(
        expected$
      );
    });

    // it('should fail and return an action with the error', () => {
    //   it('should return LoadStateTaxConfigurationListingFailure', () => {
    //     const payload1: LoadStateTaxConfigurationListingPayload = {
    //       pageIndex: 0,
    //       pageSize: 10
    //     };
    //     const action = new LoadStateTaxConfigurationListing(payload1);
    //     const error = new Error('some error');
    //     const outcome = new LoadStateTaxConfigurationListingFailure(
    //       CustomErrorAdaptor.fromJson(error)
    //     );
    //     actions$ = hot('-a', { a: action });
    //     const response$ = cold('-#|', {}, error);
    //     stateTaxConfigServiceSpy.getStateTaxConfigurationList.and.returnValue(
    //       response$
    //     );
    //     const expected = cold('--b', { b: outcome });
    //     expect(effect.loadStateTaxConfigurationListing$).toBeObservable(
    //       expected
    //     );
    //   });
    // });

    describe('SearchStateTaxConfigurationListing', () => {
      it('should return SearchStateTaxConfigurationListingSuccess', () => {
        const payload: StateTaxConfigurationListingResult = {
          stateTaxConfigurationListing: [],
          pageNumber: 0,
          pageSize: 0,
          totalPages: 0,
          totalElements: 0
        };
        const action = new SearchStateTaxConfigurationListing('');

        const outcome = new SearchStateTaxConfigurationListingSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getStateTaxConfigurationList.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.searchStateTaxConfigurationDetails$).toBeObservable(
          expected$
        );
      });

      it('should fail and return an action with the error', () => {
        const action = new SearchStateTaxConfigurationListing('');
        const error = new Error('some error');
        const outcome = new SearchStateTaxConfigurationListingFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getStateTaxConfigurationList.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.searchStateTaxConfigurationDetails$).toBeObservable(
          expected$
        );
      });
    });

    describe('LoadStateTaxConfigurationStateDetails', () => {
      it('should return LoadStateTaxConfigurationStateDetailsSuccess', () => {
        const payload: StateTaxConfigurationListingData = {
          isActive: true,
          id: '1',
          stateCode: 'KAR',
          stateId: 'ID',
          stateName: 'Karnaataka',
          stateTaxCode: 1,
          taxComponent: {
            cess: [
              {
                cessCode: 'cess code',
                cessOnTax: true,
                selected: true
              }
            ],
            tax: [
              {
                taxCode: 'TaxCode'
              }
            ],
            taxSystem: 'GST'
          }
        };
        const action = new LoadStateTaxConfigurationStateDetails('');

        const outcome = new LoadStateTaxConfigurationStateDetailsSuccess(
          payload
        );
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getStateTaxConfigurationStateDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadStateTaxConfigurationStateDetails$).toBeObservable(
          expected$
        );
      });

      // it('should fail and return an action with the error', () => {
      //   const action = new LoadStateTaxConfigurationStateDetails('');
      //   const error = new Error('some error');
      //   const outcome = new LoadStateTaxConfigurationStateDetailsFailure(
      //     CustomErrorAdaptor.fromJson(error)
      //   );
      //   actions$ = hot('-a', { a: action });
      //   const response$ = cold('-#|', {}, error);
      //   stateTaxConfigServiceSpy.getStateTaxConfigurationStateDetails.and.returnValue(
      //     response$
      //   );

      //   const expected$ = cold('--b', { b: outcome });
      //   expect(effect.loadStateTaxConfigurationStateDetails$).toBeObservable(
      //     expected$
      //   );
      // });
    });

    describe('SaveStateTaxConfigurationStateDetails', () => {
      const payload: StateTaxConfigurationListingData = {
        isActive: true,
        id: '1',
        stateCode: 'KAR',
        stateId: 'ID',
        stateName: 'Karnaataka',
        stateTaxCode: 1,
        taxComponent: {
          cess: [
            {
              cessCode: 'cess code',
              cessOnTax: true,
              selected: true
            }
          ],
          tax: [
            {
              taxCode: 'TaxCode'
            }
          ],
          taxSystem: 'GST'
        }
      };
      it('should return SaveStateTaxConfigurationStateDetailsSuccess', () => {
        const action = new SaveStateTaxConfigurationStateDetails(payload);

        const outcome = new SaveStateTaxConfigurationStateDetailsSuccess(
          payload
        );
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.saveStateTaxConfigurationStateDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.saveStateTaxConfigurationStateDetails$).toBeObservable(
          expected$
        );
      });

      it('should fail and return an action with the error', () => {
        const action = new SaveStateTaxConfigurationStateDetails(payload);
        const error = new Error('some error');
        const outcome = new SaveStateTaxConfigurationStateDetailsFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.saveStateTaxConfigurationStateDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.saveStateTaxConfigurationStateDetails$).toBeObservable(
          expected$
        );
      });
    });

    describe('EditStateTaxConfigurationStateDetails', () => {
      const payload = {
        configId: '1',
        formData: {
          isActive: true,
          id: '1',
          stateCode: 'KAR',
          stateId: 'ID',
          stateName: 'Karnaataka',
          stateTaxCode: 1,
          taxComponent: {
            cess: [
              {
                cessCode: 'cess code',
                cessOnTax: true,
                selected: true
              }
            ],
            tax: [
              {
                taxCode: 'TaxCode'
              }
            ],
            taxSystem: 'GST'
          }
        }
      };
      it('should return EditStateTaxConfigurationStateDetailsSuccess', () => {
        const action = new EditStateTaxConfigurationStateDetails(payload);

        const outcome = new EditStateTaxConfigurationStateDetailsSuccess(
          payload.formData
        );
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload.formData
        });
        stateTaxConfigServiceSpy.editStateTaxConfigurationStateDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.editStateTaxConfigurationStateDetails$).toBeObservable(
          expected$
        );
      });

      it('should fail and return an action with the error', () => {
        const action = new EditStateTaxConfigurationStateDetails(payload);
        const error = new Error('some error');
        const outcome = new EditStateTaxConfigurationStateDetailsFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.editStateTaxConfigurationStateDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.editStateTaxConfigurationStateDetails$).toBeObservable(
          expected$
        );
      });
    });

    describe('LoadStateTaxConfigurationTaxDetails', () => {
      const payload: TaxDetailsConfig[] = [
        {
          id: '1',
          isSelected: true,
          taxClassCode: 'code',
          taxDetails: {
            data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
          }
        }
      ];
      it('should return LoadStateTaxConfigurationTaxDetailsSuccess', () => {
        const action = new LoadStateTaxConfigurationTaxDetails('');

        const outcome = new LoadStateTaxConfigurationTaxDetailsSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getStateTaxConfigurationTaxDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadStateTaxConfigurationTaxDetails$).toBeObservable(
          expected$
        );
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadStateTaxConfigurationTaxDetails('');
        const error = new Error('some error');
        const outcome = new LoadStateTaxConfigurationTaxDetailsFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getStateTaxConfigurationTaxDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadStateTaxConfigurationTaxDetails$).toBeObservable(
          expected$
        );
      });
    });

    describe('SaveStateTaxConfigurationTaxDetails', () => {
      const payload: { formData: TaxDetailsSubmit; configId: string } = {
        formData: {
          addStateTaxDetails: [
            {
              taxClassCode: '1',
              taxDetails: {
                data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
              },
              id: '1'
            }
          ]
        },
        configId: '1'
      };
      it('should return SaveStateTaxConfigurationTaxDetailsSuccess', () => {
        const action = new SaveStateTaxConfigurationTaxDetails(payload);

        const outcome = new SaveStateTaxConfigurationTaxDetailsSuccess(
          payload.formData
        );
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload.formData
        });
        stateTaxConfigServiceSpy.saveStateTaxConfigurationTaxDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.saveStateTaxConfigurationTaxDetails$).toBeObservable(
          expected$
        );
      });

      it('should fail and return an action with the error', () => {
        const action = new SaveStateTaxConfigurationTaxDetails(payload);
        const error = new Error('some error');
        const outcome = new SaveStateTaxConfigurationTaxDetailsFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.saveStateTaxConfigurationTaxDetails.and.returnValue(
          response$
        );

        const expected$ = cold('--b', { b: outcome });
        expect(effect.saveStateTaxConfigurationTaxDetails$).toBeObservable(
          expected$
        );
      });
    });

    describe('LoadAllStateList', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [],
        totalElements: 1
      };
      it('should return LoadAllStateListSuccess', () => {
        const action = new LoadAllStateList();

        const outcome = new LoadAllStateListSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getAllStateList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllStateList$).toBeObservable(expected$);
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadAllStateList();
        const error = new Error('some error');
        const outcome = new LoadAllStateListFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getAllStateList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllStateList$).toBeObservable(expected$);
      });
    });

    describe('LoadAllTaxsystemList', () => {
      const payload: string[] = ['A'];
      it('should return LoadAllTaxsystemListSuccess', () => {
        const action = new LoadAllTaxsystemList();

        const outcome = new LoadAllTaxsystemListSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getAllTaxSystemList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsystemList$).toBeObservable(expected$);
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadAllTaxsystemList();
        const error = new Error('some error');
        const outcome = new LoadAllTaxsystemListFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getAllTaxSystemList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsystemList$).toBeObservable(expected$);
      });
    });

    describe('LoadAllTaxClassList', () => {
      const payload: string[] = ['A'];
      it('should return LoadAllTaxClassListSuccess', () => {
        const action = new LoadAllTaxClassList();

        const outcome = new LoadAllTaxClassListSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getAllTaxClassList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxClassList$).toBeObservable(expected$);
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadAllTaxClassList();
        const error = new Error('some error');
        const outcome = new LoadAllTaxClassListFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getAllTaxClassList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxClassList$).toBeObservable(expected$);
      });
    });

    describe('LoadAllTaxsList', () => {
      const payload: TaxsList[] = [
        {
          description: 'desc',
          isActive: null,
          taxCode: 'code',
          taxSystem: 'system'
        }
      ];
      it('should return LoadAllTaxsListSuccess', () => {
        const action = new LoadAllTaxsList();

        const outcome = new LoadAllTaxsListSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getAllTaxList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsList$).toBeObservable(expected$);
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadAllTaxsList();
        const error = new Error('some error');
        const outcome = new LoadAllTaxsListFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getAllTaxList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsList$).toBeObservable(expected$);
      });
    });

    describe('LoadAllTaxsList', () => {
      const payload: TaxsList[] = [
        {
          description: 'desc',
          isActive: null,
          taxCode: 'code',
          taxSystem: 'system'
        }
      ];
      it('should return LoadAllTaxsListSuccess', () => {
        const action = new LoadAllTaxsList();

        const outcome = new LoadAllTaxsListSuccess(payload);
        actions$ = hot('-a', { a: action });

        const response$ = cold('-a|', {
          a: payload
        });
        stateTaxConfigServiceSpy.getAllTaxList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsList$).toBeObservable(expected$);
      });

      it('should fail and return an action with the error', () => {
        const action = new LoadAllTaxsList();
        const error = new Error('some error');
        const outcome = new LoadAllTaxsListFailure(
          CustomErrorAdaptor.fromJson(error)
        );
        actions$ = hot('-a', { a: action });
        const response$ = cold('-#|', {}, error);
        stateTaxConfigServiceSpy.getAllTaxList.and.returnValue(response$);

        const expected$ = cold('--b', { b: outcome });
        expect(effect.loadAllTaxsList$).toBeObservable(expected$);
      });
    });
  });
});
