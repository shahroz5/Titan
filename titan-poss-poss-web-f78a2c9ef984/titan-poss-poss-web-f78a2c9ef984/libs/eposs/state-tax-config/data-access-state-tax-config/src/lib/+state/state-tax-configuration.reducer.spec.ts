import {
  GrnInterboutiqueConfig,
  LoadStatesDetailsListingSuccessPayload,
  LoadStateTaxConfigurationListingPayload,
  StateData,
  StateTaxConfigurationListingData,
  StateTaxConfigurationListingResult,
  TaxDetailsConfig,
  TaxDetailsSelect,
  TaxDetailsSubmit,
  TaxsList
} from '@poss-web/shared/models';
import * as actions from './state-tax-configuration.actions';
import { StateTaxConfigurationState } from './state-tax-configuration.state';
import {
  initialState as istate,
  StateTaxConfigurationReducer
} from './state-tax-configuration.reducer';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('GRN Interboutique config Reducer Testing Suite', () => {
  const initialState: StateTaxConfigurationState = { ...istate };

  describe('Testing LoadStateTaxConfigurationListing Functionality', () => {
    it('LoadStateTaxConfigurationListing should be called', () => {
      const payload: { pageEvent: LoadStateTaxConfigurationListingPayload, stateName?: string } = {
        pageEvent:
        {
          pageIndex: 0,
          pageSize: 10
        }
      };
      const action = new actions.LoadStateTaxConfigurationListing(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadStateTaxConfigurationListingSuccess should return details', () => {
      const payload: StateTaxConfigurationListingResult = {
        stateTaxConfigurationListing: [
          {
            id: '1',
            isActive: true,
            stateCode: 'code',
            stateId: 'id',
            stateName: 'name'
          }
        ],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new actions.LoadStateTaxConfigurationListingSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.stateTaxConfigurationListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadStateTaxConfigurationListingFailure should return error', () => {
      const action = new actions.LoadStateTaxConfigurationListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SearchStateTaxConfigurationListing Functionality', () => {
    it('SearchStateTaxConfigurationListing should be called', () => {
      const payload = '';
      const action = new actions.SearchStateTaxConfigurationListing(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SearchStateTaxConfigurationListingSuccess should return details', () => {
      const payload: StateTaxConfigurationListingResult = {
        stateTaxConfigurationListing: [
          {
            id: '1',
            isActive: true,
            stateCode: 'code',
            stateId: 'id',
            stateName: 'name'
          }
        ],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new actions.SearchStateTaxConfigurationListingSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.stateTaxConfigurationListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SearchStateTaxConfigurationListingFailure should return error', () => {
      const action = new actions.SearchStateTaxConfigurationListingFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadStateTaxConfigurationStateDetails Functionality', () => {
    it('LoadStateTaxConfigurationStateDetails should be called', () => {
      const payload = '';
      const action = new actions.LoadStateTaxConfigurationStateDetails(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadStateTaxConfigurationStateDetailsSuccess should return details', () => {
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

      const action = new actions.LoadStateTaxConfigurationStateDetailsSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.taxDetailsStateDetails).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadStateTaxConfigurationStateDetailsFailure should return error', () => {
      const action = new actions.LoadStateTaxConfigurationStateDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveStateTaxConfigurationStateDetails Functionality', () => {
    it('SaveStateTaxConfigurationStateDetails should be called', () => {
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
      const action = new actions.SaveStateTaxConfigurationStateDetails(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveStateTaxConfigurationStateDetailsSuccess should return details', () => {
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

      const action = new actions.SaveStateTaxConfigurationStateDetailsSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.taxDetailsStateDetailsSaveResponse).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveStateTaxConfigurationStateDetailsFailure should return error', () => {
      const action = new actions.SaveStateTaxConfigurationStateDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing EditStateTaxConfigurationStateDetails Functionality', () => {
    it('EditStateTaxConfigurationStateDetails should be called', () => {
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
      const action = new actions.EditStateTaxConfigurationStateDetails({
        formData: payload,
        configId: '1'
      });

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('EditStateTaxConfigurationStateDetailsSuccess should return details', () => {
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

      const action = new actions.EditStateTaxConfigurationStateDetailsSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.taxDetailsStateDetailsEditResponse).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('EditStateTaxConfigurationStateDetailsFailure should return error', () => {
      const action = new actions.EditStateTaxConfigurationStateDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing LoadStateTaxConfigurationTaxDetails Functionality', () => {
    it('LoadStateTaxConfigurationTaxDetails should be called', () => {
      const payload = '';
      const action = new actions.LoadStateTaxConfigurationTaxDetails(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('LoadStateTaxConfigurationTaxDetailsSuccess should return details', () => {
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

      const action = new actions.LoadStateTaxConfigurationTaxDetailsSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.taxDetailsListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('LoadStateTaxConfigurationTaxDetailsFailure should return error', () => {
      const action = new actions.LoadStateTaxConfigurationTaxDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SaveStateTaxConfigurationTaxDetails Functionality', () => {
    it('SaveStateTaxConfigurationTaxDetails should be called', () => {
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

      const action = new actions.SaveStateTaxConfigurationTaxDetails(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.isLoading).toEqual(true);
      expect(result.error).toEqual(null);
    });
    it('SaveStateTaxConfigurationTaxDetailsSuccess should return details', () => {
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

      const action = new actions.SaveStateTaxConfigurationTaxDetailsSuccess(
        payload
      );
      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.taxDetailsListing).toBeDefined();
      expect(result.isLoading).toBe(false);
    });
    it('SaveStateTaxConfigurationTaxDetailsFailure should return error', () => {
      const action = new actions.SaveStateTaxConfigurationTaxDetailsFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  });

  describe('Testing SelectStateTaxDetails Functionality', () => {
    it('SelectStateTaxDetails should be called', () => {
      const payload: TaxDetailsSelect = {
        checked: true,
        taxDetailsId: '1'
      };

      const action = new actions.SelectStateTaxDetails(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.taxDetailsListing).toBeDefined();
      expect(result.error).toEqual(null);
    });
  });

  describe('Testing SelectAllStateTaxDetails Functionality', () => {
    it('SelectAllStateTaxDetails should be called', () => {
      const action = new actions.SelectAllStateTaxDetails(true);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.taxDetailsListing).toBeDefined();
      expect(result.error).toEqual(null);
    });
  });

  describe('Testing LoadAllStateList Functionality', () => {
    it('LoadAllStateList should be called', () => {
      const action = new actions.LoadAllStateList();

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allStateList).toBeDefined();
      expect(result.error).toEqual(null);
    });
    it('LoadAllStateListSuccess should return details', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [
          {
            configDetails: {},
            countryCode: 'ABC',
            description: null,
            isActive: true,
            stateCode: 'KAR',
            isUnionTerritory: false,
          },
        ],
        totalElements: 0
      }

      const action = new actions.LoadAllStateListSuccess(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allStateList).toBeDefined();
      expect(result.isLoading).toBe(false);
    })
    it('LoadAllStateListFailure should return error', () => {
      const action = new actions.LoadAllStateListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  })

  describe('Testing LoadAllTaxSystemList Functionality', () => {
    it('LoadAllTaxSystemList should be called', () => {
      const action = new actions.LoadAllTaxsystemList();

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allTaxSystemList).toBeDefined();
      expect(result.error).toEqual(null);
    })
    it('LoadAllTaxSystemListSuccess should return details', () => {
      const payload: string[] = ['GST']

      const action = new actions.LoadAllTaxsystemListSuccess(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allStateList).toBeDefined();
      expect(result.isLoading).toBe(false);
    })
    it('LoadAllTaxSystemListFailure should return error', () => {
      const action = new actions.LoadAllTaxsystemListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  })

  describe('Testing LoadAllTaxClassList Functionality', () => {
    it('LoadAllTaxClassList should be called', () => {
      const action = new actions.LoadAllTaxClassList();

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allTaxClassList).toBeDefined();
      expect(result.error).toEqual(null);
    })
    it('LoadAllTaxClassListSuccess should return details', () => {
      const payload: string[] = [ 'GST' ]

      const action = new actions.LoadAllTaxClassListSuccess(payload);

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );
      expect(result.allStateList).toBeDefined();
      expect(result.isLoading).toBe(false);
    })
    it('LoadAllTaxClassListFailure should return error', () => {
      const action = new actions.LoadAllTaxClassListFailure(
        CustomErrorAdaptor.fromJson(Error('some error'))
      );

      const result: StateTaxConfigurationState = StateTaxConfigurationReducer(
        initialState,
        action
      );

      expect(result.error.message).toEqual('some error');
    });
  })
});
