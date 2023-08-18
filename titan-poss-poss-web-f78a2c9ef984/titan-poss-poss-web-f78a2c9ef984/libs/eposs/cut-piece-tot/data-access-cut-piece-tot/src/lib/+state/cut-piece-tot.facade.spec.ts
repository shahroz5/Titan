import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CutPieceTot } from '@poss-web/shared/models';
import { CutPieceTotFacade } from './cut-piece-tot.facade';
import { CutPieceTotState } from './cut-piece-tot.state';
import { initialState as istate } from './cut-piece-tot.reducer';
import { LoadCutPieceTot, UpdateCutPieceTot } from './cut-piece-tot.actions';

describe('CutPieceTotFacade', () => {
  let cutPieceTotFacade: CutPieceTotFacade;
  const initialState: CutPieceTotState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), CutPieceTotFacade]
    });

    cutPieceTotFacade = TestBed.inject(CutPieceTotFacade);
  });

  it('should create facade', () => {
    expect(cutPieceTotFacade).toBeDefined();
  });

  describe('#getError', () => {
    it('should get getError', () => {
      expect(cutPieceTotFacade.getError()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should get getIsLoading', () => {
      expect(cutPieceTotFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getCutPieceTotDetails', () => {
    it('should get getCutPieceTotDetails', () => {
      expect(cutPieceTotFacade.getCutPieceTotDetails()).toBeTruthy();
    });
  });

  describe('#editUpdateCutPieceTotResponses', () => {
    it('should get editUpdateCutPieceTotResponses', () => {
      expect(cutPieceTotFacade.editUpdateCutPieceTotResponses()).toBeTruthy();
    });
  });

  describe('#loadCutPieceTotDetails', () => {
    it('should LoadCutPieceTot', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadCutPieceTot();
      cutPieceTotFacade.loadCutPieceTotDetails();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#updateCutPieceTotDetails', () => {
    it('should UpdateCutPieceTot', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: { configId: string; cutPieceTot: CutPieceTot } = {
        configId: '1',
        cutPieceTot: {
          configDetails: {
            data: {
              l3DeductionPercent: 1
            },
            type: 'TYPE'
          },
          isOfferEnabled: null,
          itemCode: 'Code',
          startDate: null,
          endDate: null,
          customerMobileNos: ['111'],
          karat: 0,
          configId: '1',
          configType: 'Type',
          createdDate: 123123123,
          description: 'desc',
          isActive: true,
          offerDetails: null
        }
      };
      const expectedAction = new UpdateCutPieceTot(payload);
      cutPieceTotFacade.updateCutPieceTotDetails(
        payload.configId,
        payload.cutPieceTot
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
