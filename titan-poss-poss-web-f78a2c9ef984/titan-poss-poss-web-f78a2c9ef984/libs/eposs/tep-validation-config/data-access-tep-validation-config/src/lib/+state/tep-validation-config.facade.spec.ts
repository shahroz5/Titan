import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';
import { TepValidationConfigFacade } from './tep-validation-config.facade';
import { TepValidationConfigState } from './tep-validation-config.state';
import { initialState as istate } from './tep-validation-config.reducer';
import {
  LoadTepValidationConfigDetails,
  LoadTepValidationConfigListing,
  SaveTepValidationConfigDetails,
  SearchTepValidationConfigDetails,
  UpdateTepValidationConfigDetails
} from './tep-validation-config.actons';

describe('LovMasterFacade', () => {
  let tepValidationConfigFacade: TepValidationConfigFacade;
  const initialState: TepValidationConfigState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TepValidationConfigFacade]
    });

    tepValidationConfigFacade = TestBed.inject(TepValidationConfigFacade);
  });

  it('should create facade', () => {
    expect(tepValidationConfigFacade).toBeDefined();
  });

  describe('#getTepValidationConfigList', () => {
    it('should get getTepValidationConfigList', () => {
      expect(
        tepValidationConfigFacade.getTepValidationConfigList()
      ).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should get getTotalElements', () => {
      expect(tepValidationConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getIsloading', () => {
    it('should get getIsloading', () => {
      expect(tepValidationConfigFacade.getIsloading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(tepValidationConfigFacade.getError()).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should getTotalElements', () => {
      expect(tepValidationConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getTepValidationConfigDetails', () => {
    it('should getTepValidationConfigDetails', () => {
      expect(
        tepValidationConfigFacade.getTepValidationConfigDetails()
      ).toBeTruthy();
    });
  });

  describe('#getHasUpdated', () => {
    it('should getHasUpdated', () => {
      expect(tepValidationConfigFacade.getHasUpdated()).toBeTruthy();
    });
  });

  describe('#getHasSaved', () => {
    it('should getHasSaved', () => {
      expect(tepValidationConfigFacade.getHasSaved()).toBeTruthy();
    });
  });

  describe('#loadTepValidationConfigList', () => {
    it('should loadTepExceptionConfigList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPValidationConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const expectedAction = new LoadTepValidationConfigListing(payload);
      tepValidationConfigFacade.loadTepValidationConfigList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SearchTepValidationConfigDetails', () => {
    it('should searchTepValidationConfig', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: string = 'Code';
      const expectedAction = new SearchTepValidationConfigDetails(payload);
      tepValidationConfigFacade.searchTepValidationConfig(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#LoadTepValidationConfigDetails', () => {
    it('should loadTepValidationConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: string = 'Code';

      const expectedAction = new LoadTepValidationConfigDetails(payload);
      tepValidationConfigFacade.loadTepValidationConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SaveTepValidationConfigDetails', () => {
    it('should saveTepValidationConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const expectedAction = new SaveTepValidationConfigDetails(payload);
      tepValidationConfigFacade.saveTepValidationConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#UpdateTepExceptionConfigDetails', () => {
    it('should updateTepValidationConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPValidationConfigResult = {
        configDetails: {
          data: {
            fvtCNCancellationDeductionPercent: 10,
            isAnnexurePrintingAllowed: true,
            isFVTCNCancellationAllowed: true,
            isInterBrandCashRefundAllowed: true,
            tepCancellationDays: 1
          },
          type: 'TYPE'
        },
        configId: '1',
        configType: 'Type',
        description: 'Desc',
        isActive: true,
        offerDetails: null
      };

      const expectedAction = new UpdateTepValidationConfigDetails(payload);

      tepValidationConfigFacade.updateTepValidationConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
