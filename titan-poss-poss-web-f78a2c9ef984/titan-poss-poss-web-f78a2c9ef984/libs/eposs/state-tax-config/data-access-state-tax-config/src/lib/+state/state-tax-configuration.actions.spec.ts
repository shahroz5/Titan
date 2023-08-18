import {
  CustomErrors,
  LoadStateTaxConfigurationListingPayload,
  StateTaxConfigurationListingResult,
  StateTaxConfigurationListingData,
  TaxDetailsConfig,
  TaxDetailsSubmit,
  TaxDetailsSelect,
  LoadStatesDetailsListingSuccessPayload,
  TaxsList
} from '@poss-web/shared/models';
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
  ResetStateTaxCoonfigurationState,
  SaveStateTaxConfigurationStateDetails,
  SaveStateTaxConfigurationStateDetailsFailure,
  SaveStateTaxConfigurationStateDetailsSuccess,
  SaveStateTaxConfigurationTaxDetails,
  SaveStateTaxConfigurationTaxDetailsFailure,
  SaveStateTaxConfigurationTaxDetailsSuccess,
  SearchStateTaxConfigurationListing,
  SearchStateTaxConfigurationListingFailure,
  SearchStateTaxConfigurationListingSuccess,
  SelectAllStateTaxDetails,
  SelectStateTaxDetails,
  StateTaxConfigurationActionTypes
} from './state-tax-configuration.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('State Tax Config Action Testing Suite', () => {
  const responsePayload: StateTaxConfigurationListingData = {
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

  describe('LoadStateTaxConfigurationListing Action Test Cases', () => {
    it('should check correct type is used for LoadStateTaxConfigurationListing action', () => {
      const payload: { pageEvent: LoadStateTaxConfigurationListingPayload; statementName?: string } = {
        pageEvent:
        {
          pageIndex: 0,
          pageSize: 10
        }
      };
      const action = new LoadStateTaxConfigurationListing(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING,
        payload
      });
    });

    it('should check correct type is used for LoadStateTaxConfigurationListingSuccess action', () => {
      const payload: StateTaxConfigurationListingResult = {
        stateTaxConfigurationListing: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new LoadStateTaxConfigurationListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStateTaxConfigurationListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateTaxConfigurationListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('SearchStateTaxConfigurationListing Action Test Cases', () => {
    it('should check correct type is used for SearchStateTaxConfigurationListing action', () => {
      const payload = '';
      const action = new SearchStateTaxConfigurationListing(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING,
        payload
      });
    });

    it('should check correct type is used for SearchStateTaxConfigurationListingSuccess action', () => {
      const payload: StateTaxConfigurationListingResult = {
        stateTaxConfigurationListing: [],
        pageNumber: 0,
        pageSize: 0,
        totalPages: 0,
        totalElements: 0
      };

      const action = new SearchStateTaxConfigurationListingSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SearchStateTaxConfigurationListingFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SearchStateTaxConfigurationListingFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SEARCH_STATE_TAX_CONFIGURATION_LISTING_FAILURE,
        payload
      });
    });
  });

  describe('LoadStateTaxConfigurationStateDetails Action Test Cases', () => {
    it('should check correct type is used for LoadStateTaxConfigurationStateDetails action', () => {
      const payload = '';

      const action = new LoadStateTaxConfigurationStateDetails(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadStateTaxConfigurationStateDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new LoadStateTaxConfigurationStateDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStateTaxConfigurationStateDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateTaxConfigurationStateDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveStateTaxConfigurationStateDetails Action Test Cases', () => {
    it('should check correct type is used for SaveStateTaxConfigurationStateDetails action', () => {
      const payload = responsePayload;

      const action = new SaveStateTaxConfigurationStateDetails(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveStateTaxConfigurationStateDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new SaveStateTaxConfigurationStateDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveStateTaxConfigurationStateDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveStateTaxConfigurationStateDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('EditStateTaxConfigurationStateDetails Action Test Cases', () => {
    it('should check correct type is used for EditStateTaxConfigurationStateDetails action', () => {
      const payload = {
        configId: '1',
        formData: responsePayload
      };

      const action = new EditStateTaxConfigurationStateDetails(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS,
        payload
      });
    });

    it('should check correct type is used for EditStateTaxConfigurationStateDetailsSuccess action', () => {
      const payload = responsePayload;

      const action = new EditStateTaxConfigurationStateDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for EditStateTaxConfigurationStateDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new EditStateTaxConfigurationStateDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.EDIT_STATE_TAX_CONFIGURATION_STATE_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('LoadStateTaxConfigurationTaxDetails Action Test Cases', () => {
    it('should check correct type is used for LoadStateTaxConfigurationTaxDetails action', () => {
      const payload = '';

      const action = new LoadStateTaxConfigurationTaxDetails(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS,
        payload
      });
    });

    it('should check correct type is used for LoadStateTaxConfigurationTaxDetailsSuccess action', () => {
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

      const action = new LoadStateTaxConfigurationTaxDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadStateTaxConfigurationTaxDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadStateTaxConfigurationTaxDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.LOAD_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SaveStateTaxConfigurationTaxDetails Action Test Cases', () => {
    it('should check correct type is used for SaveStateTaxConfigurationTaxDetails action', () => {
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

      const action = new SaveStateTaxConfigurationTaxDetails(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS,
        payload
      });
    });

    it('should check correct type is used for SaveStateTaxConfigurationTaxDetailsSuccess action', () => {
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

      const action = new SaveStateTaxConfigurationTaxDetailsSuccess(payload);
      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for SaveStateTaxConfigurationTaxDetailsFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new SaveStateTaxConfigurationTaxDetailsFailure(payload);

      expect({ ...action }).toEqual({
        type:
          StateTaxConfigurationActionTypes.SAVE_STATE_TAX_CONFIGURATION_TAX_DETAILS_FAILURE,
        payload
      });
    });
  });

  describe('SelectStateTaxDetails Action Test Cases', () => {
    it('should check correct type is used for SelectStateTaxDetails action', () => {
      const payload: TaxDetailsSelect = {
        checked: true,
        taxDetailsId: '1'
      };

      const action = new SelectStateTaxDetails(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.SELECT_STATE_TAX_DETAILS,
        payload
      });
    });
  });

  describe('SelectAllStateTaxDetails Action Test Cases', () => {
    it('should check correct type is used for SelectAllStateTaxDetails action', () => {
      const payload = true;

      const action = new SelectAllStateTaxDetails(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.SELECT_ALL_STATE_TAX_DETAILS,
        payload
      });
    });
  });

  describe('LoadAllStateList Action Test Cases', () => {
    it('should check correct type is used for LoadAllStateList action', () => {
      const action = new LoadAllStateList();
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST
      });
    });

    it('should check correct type is used for LoadAllStateListSuccess action', () => {
      const payload: LoadStatesDetailsListingSuccessPayload = {
        stateDetailsListing: [],
        totalElements: 1
      };

      const action = new LoadAllStateListSuccess(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAllStateListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllStateListFailure(payload);

      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_STATE_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllTaxsystemList Action Test Cases', () => {
    it('should check correct type is used for LoadAllTaxsystemList action', () => {
      const action = new LoadAllTaxsystemList();
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST
      });
    });

    it('should check correct type is used for LoadAllTaxsystemListSuccess action', () => {
      const payload: string[] = ['A'];

      const action = new LoadAllTaxsystemListSuccess(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAllTaxsystemListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllTaxsystemListFailure(payload);

      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXSYSTEM_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllTaxClassList Action Test Cases', () => {
    it('should check correct type is used for LoadAllTaxClassList action', () => {
      const action = new LoadAllTaxClassList();
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST
      });
    });

    it('should check correct type is used for LoadAllTaxClassListSuccess action', () => {
      const payload: string[] = ['A'];

      const action = new LoadAllTaxClassListSuccess(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAllTaxClassListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllTaxClassListFailure(payload);

      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXCLASS_LIST_FAILURE,
        payload
      });
    });
  });

  describe('LoadAllTaxsList Action Test Cases', () => {
    it('should check correct type is used for LoadAllTaxClassList action', () => {
      const action = new LoadAllTaxsList();
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST
      });
    });

    it('should check correct type is used for LoadAllTaxsListSuccess action', () => {
      const payload: TaxsList[] = [
        {
          description: 'desc',
          isActive: null,
          taxCode: 'code',
          taxSystem: 'system'
        }
      ];

      const action = new LoadAllTaxsListSuccess(payload);
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_SUCCESS,
        payload
      });
    });
    it('should check correct type is used for LoadAllTaxsListFailure action ', () => {
      const payload: CustomErrors = CustomErrorAdaptor.fromJson(
        Error('Some Error')
      );
      const action = new LoadAllTaxsListFailure(payload);

      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.LOAD_ALL_TAXS_LIST_FAILURE,
        payload
      });
    });
  });

  describe('ResetStateTaxCoonfigurationState Action Test Cases', () => {
    it('should check correct type is used for LoadAllTaxClassList action', () => {
      const action = new ResetStateTaxCoonfigurationState();
      expect({ ...action }).toEqual({
        type: StateTaxConfigurationActionTypes.RESET_STATE
      });
    });
  });
});
