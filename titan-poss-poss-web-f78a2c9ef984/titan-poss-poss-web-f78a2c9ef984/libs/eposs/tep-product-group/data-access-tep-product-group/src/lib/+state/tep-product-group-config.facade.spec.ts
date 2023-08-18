import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  AddTEPProductGroupsMapping,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListingPayload,
  TEPProductGroupMappingListingPayload
} from '@poss-web/shared/models';
import { TepProductGroupConfigFacade } from './tep-product-group-config.facade';
import { TepProductGroupConfigState } from './tep-product-group-config.state';
import { initialState as istate } from './tep-product-group-config.reducer';
import {
  LoadTepProductGroupConfigDetails,
  LoadTepProductGroupConfigListing,
  LoadTepProductGroupMappintListing,
  SaveTepProductGroupConfigDetails,
  SaveTepProductGroupMapping,
  SearchTepProductConfigDetails,
  SearchTepProductGroupMappintListing,
  UpdateTepProductGroupConfigDetails
} from './tep-product-group-config.actons';

describe('LovMasterFacade', () => {
  let tepProductGroupConfigFacade: TepProductGroupConfigFacade;
  const initialState: TepProductGroupConfigState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        TepProductGroupConfigFacade
      ]
    });

    tepProductGroupConfigFacade = TestBed.inject(TepProductGroupConfigFacade);
  });

  it('should create facade', () => {
    expect(tepProductGroupConfigFacade).toBeDefined();
  });

  describe('#getTepProductGroupConfigList', () => {
    it('should get getTepProductGroupConfigList', () => {
      expect(
        tepProductGroupConfigFacade.getTepProductGroupConfigList()
      ).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should get getTotalElements', () => {
      expect(tepProductGroupConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getIsloading', () => {
    it('should get getIsloading', () => {
      expect(tepProductGroupConfigFacade.getIsloading()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(tepProductGroupConfigFacade.getError()).toBeTruthy();
    });
  });

  describe('#getTotalElements', () => {
    it('should getTotalElements', () => {
      expect(tepProductGroupConfigFacade.getTotalElements()).toBeTruthy();
    });
  });

  describe('#getTepProductGroupConfigDetails', () => {
    it('should getTepProductGroupConfigDetails', () => {
      expect(
        tepProductGroupConfigFacade.getTepProductGroupConfigDetails()
      ).toBeTruthy();
    });
  });
  describe('#getTepProductGroupMappingList', () => {
    it('should getTepProductGroupMappingList', () => {
      expect(
        tepProductGroupConfigFacade.getTepProductGroupMappingList()
      ).toBeTruthy();
    });
  });

  describe('#getHasUpdated', () => {
    it('should getHasUpdated', () => {
      expect(tepProductGroupConfigFacade.getHasUpdated()).toBeTruthy();
    });
  });

  describe('#getHasSaved', () => {
    it('should getHasSaved', () => {
      expect(tepProductGroupConfigFacade.getHasSaved()).toBeTruthy();
    });
  });

  describe('#getTotalMappingElements', () => {
    it('should getTotalMappingElements', () => {
      expect(
        tepProductGroupConfigFacade.getTotalMappingElements()
      ).toBeTruthy();
    });
  });

  describe('#getTotalMappingElements', () => {
    it('should getTotalMappingElements', () => {
      expect(
        tepProductGroupConfigFacade.getTotalMappingElements()
      ).toBeTruthy();
    });
  });

  describe('#loadTepProductGroupConfigList', () => {
    it('should loadTepProductGroupConfigList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPProductGroupConfigListingPayload = {
        pageIndex: 0,
        pageSize: 10
      };
      const expectedAction = new LoadTepProductGroupConfigListing(payload);
      tepProductGroupConfigFacade.loadTepProductGroupConfigList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SearchTepProductConfigDetails', () => {
    it('should SearchTepProductConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: string = 'Code';
      const expectedAction = new SearchTepProductConfigDetails(payload);
      tepProductGroupConfigFacade.searchTepProductGroupConfig(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTepProductGroupConfigDetails', () => {
    it('should loadTepProductGroupConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const payload: string = 'Code';

      const expectedAction = new LoadTepProductGroupConfigDetails(payload);
      tepProductGroupConfigFacade.loadTepProductGroupConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveTepProductGroupConfigDetails', () => {
    it('should saveTepProductGroupConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const expectedAction = new SaveTepProductGroupConfigDetails(payload);

      tepProductGroupConfigFacade.saveTepProductGroupConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#updateTepProductGroupConfigDetails', () => {
    it('should updateTepProductGroupConfigDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPProductGroupConfigDetails = {
        configDetails: {
          data: 'Data',
          type: 'Type'
        },
        configId: 'ConfigId',
        configType: 'ConfigType',
        customerMobileNos: ['123', '456'],
        description: 'Desc',
        isActive: true,
        offerDetails: {
          data: 'Data',
          type: 'Type'
        }
      };

      const expectedAction = new UpdateTepProductGroupConfigDetails(payload);

      tepProductGroupConfigFacade.updateTepProductGroupConfigDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTepProductGroupMappingList', () => {
    it('should loadTepProductGroupMappingList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TEPProductGroupMappingListingPayload = {
        configId: '123',
        pageIndex: 0,
        pageSize: 10,
        sort: []
      };

      const expectedAction = new LoadTepProductGroupMappintListing(payload);

      tepProductGroupConfigFacade.loadTepProductGroupMappingList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchTepProductGroupMapping', () => {
    it('should searchTepProductGroupMapping', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: {
        configId: string;
        filter: string;
      } = {
        configId: 'configId',
        filter: 'filter'
      };

      const expectedAction = new SearchTepProductGroupMappintListing(payload);

      tepProductGroupConfigFacade.searchTepProductGroupMapping(
        payload.configId,
        payload.filter
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveTepProductGroupMappingDetails', () => {
    it('should saveTepProductGroupMappingDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: {
        configId: string;
        addTEPProductGroupsMapping: AddTEPProductGroupsMapping;
      } = {
        configId: 'configId',
        addTEPProductGroupsMapping: {
          addProductGroups: [
            {
              productGroupCode: 'productGroupCode',
              configDetails: {
                data: {
                  uuid: 'uuid',
                  productGroups: 'product group',
                  isTepAllowed: true,
                  goldDeductionPercent: 10,
                  silverDeductionPercent: 10,
                  platinumDeductionPercent: 10,
                  ucpDeductionPercent: 20,
                  ucpDeductionFlatValue: 30,
                  isStoneChargesApplicable: true,
                  stoneDeductionPercent: 1,
                  isCMMandatory: true,
                  cmUnavailableDeductionPercent: 10,
                  isFVTAllowed: true,
                  fvtDeductionPercent: 1,
                  isCutPieceTepAllowed: true,
                  isInterBrandTepAllowed: true,
                  typeOfExchange: 'typeOfExchange',
                  recoverDiscountPercent: 10,
                  refundDeductionPercent: 1,
                  isTEPSaleBin: true,
                  weightTolerancePercent: 50,
                  isProportionedValue: true
                },
                type: 'type'
              }
            }
          ]
        }
      };

      const expectedAction = new SaveTepProductGroupMapping(payload);

      tepProductGroupConfigFacade.saveTepProductGroupMappingDetails(
        payload.configId,
        payload.addTEPProductGroupsMapping
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
