import { provideMockStore } from '@ngrx/store/testing';

import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import {
  GrnInterboutiqueConfig,
  LoadStateTaxConfigurationListingPayload,
  StateTaxConfigurationStateDetails,
  TaxDetailsSelect,
  TaxDetailsSubmit
} from '@poss-web/shared/models';
import { StateTaxConfigurationFacade } from './state-tax-configuration.facade';
import { StateTaxConfigurationState } from './state-tax-configuration.state';
import { initialState as istate } from './state-tax-configuration.reducer';
import {
  EditStateTaxConfigurationStateDetails,
  LoadAllStateList,
  LoadAllTaxClassList,
  LoadAllTaxsList,
  LoadAllTaxsystemList,
  LoadStateTaxConfigurationListing,
  LoadStateTaxConfigurationStateDetails,
  LoadStateTaxConfigurationTaxDetails,
  ResetStateTaxCoonfigurationState,
  SaveStateTaxConfigurationStateDetails,
  SaveStateTaxConfigurationTaxDetails,
  SearchStateTaxConfigurationListing,
  SelectAllStateTaxDetails,
  SelectStateTaxDetails
} from './state-tax-configuration.actions';

describe('StateTaxConfigFacade', () => {
  let stateTaxConfigurationFacade: StateTaxConfigurationFacade;
  const initialState: StateTaxConfigurationState = { ...istate };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        StateTaxConfigurationFacade
      ]
    });

    stateTaxConfigurationFacade = TestBed.inject(StateTaxConfigurationFacade);
  });

  it('should create facade', () => {
    expect(stateTaxConfigurationFacade).toBeDefined();
  });

  describe('#getTotalListingCount', () => {
    it('should get getTotalListingCount', () => {
      expect(stateTaxConfigurationFacade.getTotalListingCount()).toBeTruthy();
    });
  });

  describe('#getTaxDetailsStateDetails', () => {
    it('should get getTaxDetailsStateDetails', () => {
      expect(
        stateTaxConfigurationFacade.getTaxDetailsStateDetails()
      ).toBeTruthy();
    });
  });

  describe('#getTaxDetailsStateDetailsSaveResponse', () => {
    it('should get getTaxDetailsStateDetailsSaveResponse', () => {
      expect(
        stateTaxConfigurationFacade.getTaxDetailsStateDetailsSaveResponse()
      ).toBeTruthy();
    });
  });

  describe('#getTaxDetailsStateDetailsEditResponse', () => {
    it('should get getTaxDetailsStateDetailsEditResponse', () => {
      expect(
        stateTaxConfigurationFacade.getTaxDetailsStateDetailsEditResponse()
      ).toBeTruthy();
    });
  });

  describe('#getTaxDetailsSaveResponse', () => {
    it('should get getTaxDetailsSaveResponse', () => {
      expect(
        stateTaxConfigurationFacade.getTaxDetailsSaveResponse()
      ).toBeTruthy();
    });
  });

  describe('#getTaxComponentDetails', () => {
    it('should get getTaxComponentDetails', () => {
      expect(stateTaxConfigurationFacade.getTaxComponentDetails()).toBeTruthy();
    });
  });

  describe('#getStateTaxConfigurationListing', () => {
    it('should get getStateTaxConfigurationListing', () => {
      expect(
        stateTaxConfigurationFacade.getStateTaxConfigurationListing()
      ).toBeTruthy();
    });
  });

  describe('#getAllStateList', () => {
    it('should get getAllStateList', () => {
      expect(stateTaxConfigurationFacade.getAllStateList()).toBeTruthy();
    });
  });

  describe('#getAllTaxSystemList', () => {
    it('should get getAllTaxSystemList', () => {
      expect(stateTaxConfigurationFacade.getAllTaxSystemList()).toBeTruthy();
    });
  });

  describe('#getAllTaxClassList', () => {
    it('should get getAllTaxClassList', () => {
      expect(stateTaxConfigurationFacade.getAllTaxClassList()).toBeTruthy();
    });
  });

  describe('#getAllTaxsList', () => {
    it('should get getAllTaxsList', () => {
      expect(stateTaxConfigurationFacade.getAllTaxsList()).toBeTruthy();
    });
  });

  describe('#getTaxDetailsListing', () => {
    it('should get getTaxDetailsListing', () => {
      expect(stateTaxConfigurationFacade.getTaxDetailsListing()).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(stateTaxConfigurationFacade.getError()).toBeTruthy();
    });
  });

  describe('#getIsLoading', () => {
    it('should getIsLoading', () => {
      expect(stateTaxConfigurationFacade.getIsLoading()).toBeTruthy();
    });
  });

  describe('#loadStateTaxConfigurationListing', () => {
    it('should loadStateTaxConfigurationListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: { pageEvent: LoadStateTaxConfigurationListingPayload; stateName?: string } = {
        pageEvent:
        {
          pageIndex: 0,
          pageSize: 10
        },
        stateName: undefined
      };
      const expectedAction = new LoadStateTaxConfigurationListing(payload);
      stateTaxConfigurationFacade.loadStateTaxConfigurationListing(payload.pageEvent);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadStateTaxDetails', () => {
    it('should loadStateTaxDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadStateTaxConfigurationStateDetails(payload);
      stateTaxConfigurationFacade.loadStateTaxDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadTaxDetailsList', () => {
    it('should loadTaxDetailsList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadStateTaxConfigurationTaxDetails(payload);
      stateTaxConfigurationFacade.loadTaxDetailsList(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadAllStateList', () => {
    it('should loadAllStateList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadAllStateList();
      stateTaxConfigurationFacade.loadAllStateList();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadAllTaxClassList', () => {
    it('should loadAllTaxClassList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadAllTaxClassList();
      stateTaxConfigurationFacade.loadAllTaxClassList();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadAllTaxsList', () => {
    it('should loadAllTaxsList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadAllTaxsList();
      stateTaxConfigurationFacade.loadAllTaxsList();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#loadAllTaxSystemList', () => {
    it('should loadAllTaxSystemList', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = '';
      const expectedAction = new LoadAllTaxsystemList();
      stateTaxConfigurationFacade.loadAllTaxSystemList();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#selectTaxDetailsCheckbox', () => {
    it('should selectTaxDetailsCheckbox', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TaxDetailsSelect = {
        checked: true,
        taxDetailsId: '1'
      };
      const expectedAction = new SelectStateTaxDetails(payload);
      stateTaxConfigurationFacade.selectTaxDetailsCheckbox(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SelectAllStateTaxDetails', () => {
    it('should SelectAllStateTaxDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = true;
      const expectedAction = new SelectAllStateTaxDetails(payload);
      stateTaxConfigurationFacade.selectAllTaxDetailsCheckbox(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#resetState', () => {
    it('should resetState', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload = true;
      const expectedAction = new ResetStateTaxCoonfigurationState();
      stateTaxConfigurationFacade.resetState();

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#SaveStateTaxConfigurationStateDetails', () => {
    it('should SaveStateTaxConfigurationStateDetails', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload: StateTaxConfigurationStateDetails = {
          isActive: true
        };
        const expectedAction = new SaveStateTaxConfigurationStateDetails(
          payload
        );
        stateTaxConfigurationFacade.saveStateTaxConfigurationStateDetails(
          payload
        );

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#editStateTaxConfigurationStateDetails', () => {
    it('should editStateTaxConfigurationStateDetails', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();

        const payload: StateTaxConfigurationStateDetails = {
          isActive: true
        };
        const expectedAction = new EditStateTaxConfigurationStateDetails({
          configId: '1',
          formData: payload
        });
        stateTaxConfigurationFacade.editStateTaxConfigurationStateDetails(
          payload,
          '1'
        );

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#editStateTaxConfigurationTaxDetails', () => {
    it('should editStateTaxConfigurationTaxDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TaxDetailsSubmit = {
        addStateTaxDetails: [
          {
            taxClassCode: '1',
            taxDetails: {
              data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
            },
            id: '1'
          }
        ]
      };
      const expectedAction = new SaveStateTaxConfigurationTaxDetails({
        configId: '1',
        formData: payload
      });
      stateTaxConfigurationFacade.editStateTaxConfigurationTaxDetails(
        payload,
        '1'
      );

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchStateTaxConfigurationListing', () => {
    it('should searchStateTaxConfigurationListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();

      const payload: TaxDetailsSubmit = {
        addStateTaxDetails: [
          {
            taxClassCode: '1',
            taxDetails: {
              data: { IGST: 3, SGST: 1, UTGST: 0, CGST: 3 }
            },
            id: '1'
          }
        ]
      };
      const expectedAction = new SearchStateTaxConfigurationListing('1');
      stateTaxConfigurationFacade.searchStateTaxConfigurationListing('1');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
