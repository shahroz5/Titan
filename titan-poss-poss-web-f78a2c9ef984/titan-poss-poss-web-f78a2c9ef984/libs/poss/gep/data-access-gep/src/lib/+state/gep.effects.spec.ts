import { 
    AdvanceHistoryItemsRequestPayload,
    CustomErrors, 
    GEPSearchResponse 
} from "@poss-web/shared/models";
import { CustomErrorAdaptor } from "@poss-web/shared/util-adaptors";
import { Observable } from "rxjs";
import { hot, cold } from 'jasmine-marbles';
import { 
    LoadGEPHistory, 
    LoadGEPHistoryFailure, 
    LoadGEPHistorySuccess, 
    ViewGEP, 
    ViewGEPFailure, 
    ViewGEPSuccess 
} from "./gep.actions";
import { GepEffects } from './gep.effects';
import { GepService } from "../gep.service";
import { TestBed } from "@angular/core/testing";
import { DataPersistence } from "@nrwl/angular";
import { provideMockStore } from "@ngrx/store/testing";
import { GEP_FEATURE_KEY, initialState } from "./gep.reducer";
import { provideMockActions } from '@ngrx/effects/testing';


const advanceHistoryItemsRequestPayload : AdvanceHistoryItemsRequestPayload = { docNo:4 }

const gepSearchResponse : GEPSearchResponse = { GEPList:[], totalElements:1 };
    
describe('GEP Effects Testing Suite', () => {

    let actions$: Observable<any>;
    let effect: GepEffects;

    const gepServiceSpy = jasmine.createSpyObj<GepService>(
        'gepService',
        [
          'getHistoryItems',
          'getGEPTransactionDetails',
        ]
      );

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GepEffects,
                DataPersistence,
                provideMockStore({
                    initialState: {
                        [GEP_FEATURE_KEY]: initialState
                    }
                }),
                provideMockActions(() => actions$),
                {
                    provide: GepService,
                    useValue: gepServiceSpy
                }
            ]
        });

        effect = TestBed.inject(GepEffects);
    });

    describe('LoadGEPHistory', () => {
        it('should return a LoadGEPHistory response', () => {
            const action = new LoadGEPHistory(advanceHistoryItemsRequestPayload,'','','',0,0,'','');
            const outcome = new LoadGEPHistorySuccess(gepSearchResponse);
    
            actions$ = hot('-a', { a: action });
            const response$ = cold('-b|', {
                b: gepSearchResponse
            });
            gepServiceSpy.getHistoryItems.and.returnValue(response$);
    
            const expected$ = cold('--c', { c: outcome });
            expect(effect.GepHistory$).toBeObservable(expected$);
        });
  
        it('should fail and return an action with the error', () => {
            const action = new LoadGEPHistory(advanceHistoryItemsRequestPayload,'searchField','searchType',"status", 0, 0, "txnType", "subTxnType");
            const error = new Error('some error');
            const outcome = new LoadGEPHistoryFailure(
            CustomErrorAdaptor.fromJson(error)
            );
            actions$ = hot('-a', { a: action });
            const response$ = cold('-#', {}, error);
            gepServiceSpy.getHistoryItems.and.returnValue(response$);
            const expected = cold('--b', { b: outcome });
            expect(effect.GepHistory$).toBeObservable(expected);
        });
    });

    describe('viewGEP', () => {
        it('should return a ViewGEP response', () => {
            const action = new ViewGEP('id', "subTxnType");
            const outcome = new ViewGEPSuccess(gepSearchResponse);
    
            actions$ = hot('-a', { a: action });
            const response$ = cold('-b|', {
                b: gepSearchResponse
            });
            gepServiceSpy.getGEPTransactionDetails.and.returnValue(response$);
    
            const expected$ = cold('--c', { c: outcome });
            expect(effect.viewGEP$).toBeObservable(expected$);
        });
  
        it('should fail and return an action with the error', () => {
            const action = new ViewGEP('id', "subTxnType");
            const error = new Error('some error');
            const outcome = new ViewGEPFailure(
            CustomErrorAdaptor.fromJson(error)
            );
            actions$ = hot('-a', { a: action });
            const response$ = cold('-#', {}, error);
            gepServiceSpy.getGEPTransactionDetails.and.returnValue(response$);
            const expected = cold('--b', { b: outcome });
            expect(effect.viewGEP$).toBeObservable(expected);
        });
    });
});
