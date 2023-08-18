import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  CPGProductGroupConfigForQCGCDetails,
  CPGProductGroupConfigForQCGCMapping,
  InstrumentType,
  LoadCPGProductGroupConfigForQCGCListingPayload,
  PaymentCode,
  RedemptionType
} from '@poss-web/shared/models';
import { CPGProductGroupForQCGCFacade } from './cpg-product-group-config-for-qcgc.facade';
import { CPGProductGroupConfigForQCGCState } from './cpg-product-group-config-for-qcgc.state';
import { initialState as istate } from './cpg-product-group-config-for-qcgc.reducer';
import {
  EditCPGProductGroupConfigForQCGCDetails,
  LoadCPGProductGroupConfigForQCGCDetails,
  LoadCPGProductGroupConfigForQCGCListing,
  LoadCPGProductGroupConfigForQCGCMapping,
  SaveCPGProductGroupConfigForQCGCDetails,
  SaveCPGProductGroupConfigForQCGCMapping,
  SearchCPGProductGroupConfigForQCGCListing
} from './cpg-product-group-config-for-qcgc.actions';

describe('LovMasterFacade', () => {
  let cpgProductGroupForQCGCFacade: CPGProductGroupForQCGCFacade;
  const initialState: CPGProductGroupConfigForQCGCState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        CPGProductGroupForQCGCFacade
      ]
    });

    cpgProductGroupForQCGCFacade = TestBed.inject(CPGProductGroupForQCGCFacade);
  });

  it('should create facade', () => {
    expect(cpgProductGroupForQCGCFacade).toBeDefined();
  });

  describe('#getCPGProductGroupConfigListing', () => {
    it('should get getCPGProductGroupConfigListing', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupConfigListing()
      ).toBeTruthy();
    });
  });

  describe('#getCPGProductGroupConfigDetails', () => {
    it('should get getCPGProductGroupConfigDetails', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupConfigDetails()
      ).toBeTruthy();
    });
  });

  describe('#getCPGProductGroupConfigDetailsSavedResponse', () => {
    it('should get getCPGProductGroupConfigDetailsSavedResponse', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupConfigDetailsSavedResponse()
      ).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(cpgProductGroupForQCGCFacade.getError()).toBeTruthy();
    });
  });

  describe('#getCPGProductGroupConfigDetailsEditedResponse', () => {
    it('should getCPGProductGroupConfigDetailsEditedResponse', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupConfigDetailsEditedResponse()
      ).toBeTruthy();
    });
  });

  describe('#getTotalCPGProductGroupConfig', () => {
    it('should getTotalCPGProductGroupConfig', () => {
      expect(
        cpgProductGroupForQCGCFacade.getTotalCPGProductGroupConfig()
      ).toBeTruthy();
    });
  });
  describe('#getError', () => {
    it('should getError', () => {
      expect(cpgProductGroupForQCGCFacade.getError()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should getIsLoading', () => {
      expect(cpgProductGroupForQCGCFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#getCPGProductGroupMapping', () => {
    it('should getCPGProductGroupMapping', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupMapping()
      ).toBeTruthy();
    });
  });

  describe('#getCPGProductGroupMappingUpdated', () => {
    it('should getCPGProductGroupMappingUpdated', () => {
      expect(
        cpgProductGroupForQCGCFacade.getCPGProductGroupMappingUpdated()
      ).toBeTruthy();
    });
  });

  describe('#loadCPGProductGroupConfigListing', () => {
    it('should loadCPGProductGroupConfigListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: LoadCPGProductGroupConfigForQCGCListingPayload = {
        pageIndex: 0,
        pageSize: 10,
        searchData: ''
      };
      const expectedAction = new LoadCPGProductGroupConfigForQCGCListing(
        payload
      );
      cpgProductGroupForQCGCFacade.loadCPGProductGroupConfigListing(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SearchCPGProductGroupConfigForQCGCListing', () => {
    it('should SearchCPGProductGroupConfigForQCGCListing', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload: string = 'Code';
        const expectedAction = new SearchCPGProductGroupConfigForQCGCListing(
          payload
        );
        cpgProductGroupForQCGCFacade.searchCPGProductGroupConfigListing(
          payload
        );

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#LoadCPGProductGroupConfigForQCGCDetails', () => {
    it('should LoadCPGProductGroupConfigForQCGCDetails', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: string = 'Code';

        const expectedAction = new LoadCPGProductGroupConfigForQCGCDetails(
          payload
        );
        cpgProductGroupForQCGCFacade.loadCPGProductGroupConfigDetails(payload);

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#SaveCPGProductGroupConfigForQCGCDetails', () => {
    it('should SaveCPGProductGroupConfigForQCGCDetails', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload: CPGProductGroupConfigForQCGCDetails = {
          description: 'desc',
          instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
          isActive: true,
          minimumAmount: 0,
          paymentCategoryName: 'name',
          paymentCode: PaymentCode.Qcgc,
          redemptionType: RedemptionType.Full
        };

        const expectedAction = new SaveCPGProductGroupConfigForQCGCDetails(
          payload
        );

        cpgProductGroupForQCGCFacade.saveCPGProductGroupConfigDetails(payload);

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#EditCPGProductGroupConfigForQCGCDetails', () => {
    it('should EditCPGProductGroupConfigForQCGCDetails', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload: CPGProductGroupConfigForQCGCDetails = {
          description: 'desc',
          instrumentType: InstrumentType.InstrumentTypeEVoucherCard,
          isActive: true,
          minimumAmount: 0,
          paymentCategoryName: 'name',
          paymentCode: PaymentCode.Qcgc,
          redemptionType: RedemptionType.Full
        };

        const expectedAction = new EditCPGProductGroupConfigForQCGCDetails(
          payload
        );

        cpgProductGroupForQCGCFacade.editCPGProductGroupConfigDetails(payload);

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#LoadCPGProductGroupConfigForQCGCMapping', () => {
    it('should LoadCPGProductGroupConfigForQCGCMapping', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload = 'Code';

        const expectedAction = new LoadCPGProductGroupConfigForQCGCMapping(
          payload
        );

        cpgProductGroupForQCGCFacade.LoadCPGProductGroupConfigMapping(payload);

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#SaveCPGProductGroupConfigForQCGCMapping', () => {
    it('should SaveCPGProductGroupConfigForQCGCMapping', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const payload: {
          data: CPGProductGroupConfigForQCGCMapping;
          id: string;
        } = {
          data: {
            addProductGroupCode: [],
            removeProductMappingIds: []
          },
          id: '1'
        };

        const expectedAction = new SaveCPGProductGroupConfigForQCGCMapping(
          payload
        );

        cpgProductGroupForQCGCFacade.saveCPGProductGroupConfigMapping(
          payload.data,
          payload.id
        );

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
});
