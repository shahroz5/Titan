import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { GrnInterboutiqueConfig } from '@poss-web/shared/models';
import { GrnInterboutiqueConfigFacade } from './grn-interboutique-config.facade';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';
import { initialState as istate } from './grn-interboutique-config.reducer';
import {
  AddNewGrnInterboutiqueConfig,
  EditGrnInterboutiqueConfig,
  LoadGrnInterboutiqueConfig
} from './grn-interboutique-config.actions';

describe('LovMasterFacade', () => {
  let grnInterboutiqueConfigFacade: GrnInterboutiqueConfigFacade;
  const initialState: GrnInterboutiqueConfigState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        GrnInterboutiqueConfigFacade
      ]
    });

    grnInterboutiqueConfigFacade = TestBed.inject(GrnInterboutiqueConfigFacade);
  });

  it('should create facade', () => {
    expect(grnInterboutiqueConfigFacade).toBeDefined();
  });

  describe('#getGrnInterboutiqueConfigDetails', () => {
    it('should get getGrnInterboutiqueConfigDetails', () => {
      expect(
        grnInterboutiqueConfigFacade.getGrnInterboutiqueConfigDetails()
      ).toBeTruthy();
    });
  });

  describe('#editEditGrnInterboutiqueConfigResponses', () => {
    it('should get editEditGrnInterboutiqueConfigResponses', () => {
      expect(
        grnInterboutiqueConfigFacade.editEditGrnInterboutiqueConfigResponses()
      ).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(grnInterboutiqueConfigFacade.getError()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should getIsLoading', () => {
      expect(grnInterboutiqueConfigFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#loadGrnInterboutiqueConfigDetails', () => {
    it('should loadGrnInterboutiqueConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = 1;
      const expectedAction = new LoadGrnInterboutiqueConfig(payload);
      grnInterboutiqueConfigFacade.loadGrnInterboutiqueConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#addNewGrnInterboutiqueConfigDetails', () => {
    it('should addNewGrnInterboutiqueConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

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
      const expectedAction = new AddNewGrnInterboutiqueConfig(payload);
      grnInterboutiqueConfigFacade.addNewGrnInterboutiqueConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editGrnInterboutiqueConfigDetails', () => {
    it('should editGrnInterboutiqueConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: {
        ruleId: number;
        grnInterboutiqueConfig: GrnInterboutiqueConfig;
      } = {
        ruleId: 1,
        grnInterboutiqueConfig: {
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
        }
      };

      const expectedAction = new EditGrnInterboutiqueConfig(payload);
      grnInterboutiqueConfigFacade.editGrnInterboutiqueConfigDetails(
        payload.ruleId,
        payload.grnInterboutiqueConfig
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
