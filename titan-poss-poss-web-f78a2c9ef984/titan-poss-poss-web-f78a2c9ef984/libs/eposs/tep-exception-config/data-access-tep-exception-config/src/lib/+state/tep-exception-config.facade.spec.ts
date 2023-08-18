import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CashPaymentConfiguration,
  LovMaster,
  TEPExceptionConfig,
  TEPExceptionConfigFilter,
  TEPExceptionConfigListingPayload
} from '@poss-web/shared/models';
import { TepExceptionConfigFacade } from './tep-exception-config.facade';
import { TepExceptionConfigState } from './tep-exception-config.state';
import { initialState as istate } from './tep-exception-config.reducer';
import {
  LoadTepExceptionConfigDetails,
  LoadTepExceptionConfigListing,
  SaveTepExceptionConfigDetails,
  SearchTepExceptionConfigDetails,
  UpdateTepExceptionConfigDetails
} from './tep-exception-config.actons';

describe('LovMasterFacade', () => {
  let tepExceptionConfigFacade: TepExceptionConfigFacade;
  const initialState: TepExceptionConfigState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TepExceptionConfigFacade]
    });

    tepExceptionConfigFacade = TestBed.inject(TepExceptionConfigFacade);
  });

  it('should create facade', () => {
    expect(tepExceptionConfigFacade).toBeDefined();
  });

  describe('#getMaxFlatTepExchangeValue', () => {
    it('should get getMaxFlatTepExchangeValue', () => {
      expect(
        tepExceptionConfigFacade.getMaxFlatTepExchangeValue()
      ).toBeTruthy();
    });
  });

  describe('#getTepExceptionConfigList', () => {
    it('should get getTepExceptionConfigList', () => {
      expect(tepExceptionConfigFacade.getTepExceptionConfigList()).toBeTruthy();
    });
  });

  describe('#getIsloading', () => {
    it('should get getIsloading', () => {
      expect(tepExceptionConfigFacade.getIsloading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(tepExceptionConfigFacade.getError()).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should getTotalElements', () => {
      expect(tepExceptionConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getTepExceptionConfigDetails', () => {
    it('should getTepExceptionConfigDetails', () => {
      expect(
        tepExceptionConfigFacade.getTepExceptionConfigDetails()
      ).toBeTruthy();
    });
  });

  describe('#getHasSaved', () => {
    it('should getHasSaved', () => {
      expect(tepExceptionConfigFacade.getHasSaved()).toBeTruthy();
    });
  });

  describe('#getHasUpdated', () => {
    it('should getHasUpdated', () => {
      expect(tepExceptionConfigFacade.getHasUpdated()).toBeTruthy();
    });
  });

  describe('#LoadTepExceptionConfigListing', () => {
    it('should loadTepExceptionConfigList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPExceptionConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const expectedAction = new LoadTepExceptionConfigListing(payload);
      tepExceptionConfigFacade.loadTepExceptionConfigList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SearchTepExceptionConfigDetails', () => {
    it('should searchTepExceptionConfig', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPExceptionConfigFilter = {
        configName: 'Name',
        variantCode: 'Code'
      };
      const expectedAction = new SearchTepExceptionConfigDetails(payload);
      tepExceptionConfigFacade.searchTepExceptionConfig(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SaveTepExceptionConfigDetails', () => {
    it('should saveTepExceptionConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const expectedAction = new SaveTepExceptionConfigDetails(payload);
      tepExceptionConfigFacade.saveTepExceptionConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#UpdateTepExceptionConfigDetails', () => {
    it('should updateTepExceptionConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: TEPExceptionConfig = {
        configId: '1',
        isActive: true,
        configDetails: {
          data: null,
          type: 'TYPE'
        },
        configType: 'TYPE',
        createdDate: 222222,
        customerMobileNos: ['3333333'],
        description: 'Desc',
        endDate: 444444,
        isOfferEnabled: true,
        itemCode: 'Code',
        offerDetails: {
          data: null,
          type: 'TYPE'
        },
        startDate: 111111
      };

      const expectedAction = new UpdateTepExceptionConfigDetails(payload);
      tepExceptionConfigFacade.updateTepExceptionConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#UpdateTepExceptionConfigDetails', () => {
    it('should loadTepExceptionConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const expectedAction = new LoadTepExceptionConfigDetails('Code');
      tepExceptionConfigFacade.loadTepExceptionConfigDetails('Code');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
