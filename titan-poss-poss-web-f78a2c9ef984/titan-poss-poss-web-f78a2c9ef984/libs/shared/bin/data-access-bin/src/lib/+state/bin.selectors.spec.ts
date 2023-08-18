import {
  BinCodeSaveModel,
  BinCodesByBinGroup,
  CustomErrors,
  LocationMappingPost,
  SaveBinCodeFormPayload
} from '@poss-web/shared/models';
import { BinState } from './bin.state';
import { initialState } from './bin.reducer';
import * as selectors from './bin.selectors';
import { BinEntity, binAdapter } from './bin.entity';

describe('Bin selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const binData: BinCodesByBinGroup = {
    binCode: 'AAA',
    description: 'AAA',
    isActive: true
  };
  const addElementToEntities = <T extends BinCodesByBinGroup>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.binCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const binState: BinEntity = {
    ids: [binData.binCode],
    entities: addElementToEntities([binData])
  };

  describe('Testing Bin master related Selectors', () => {
    it('Should return bincode by bin group code ', () => {
      const selectBinCode = binAdapter.setAll([binData], {
        ...binAdapter.getInitialState()
      });

      const state: BinState = {
        ...initialState,
        binCodesByBinGroup: binState
      };
      expect(selectors.binCodesByBinGroupCode.projector(state)).toEqual(
        selectBinCode
      );
    });

    it('Should return the list of bins ', () => {
      const binCodeList = [
        {
          locationCode: 'aaa',
          brandCode: 'aaa',
          regionCode: 'aaa',
          isActive: true
        }
      ];
      const state: BinState = {
        ...initialState,
        binCodeDetailsListing: binCodeList
      };

      expect(selectors.selectBinCodeDetailsListing.projector(state)).toEqual(
        binCodeList
      );
    });
    it('Should return selectLocationMappingResponse', () => {
      const payload: LocationMappingPost = {
        addLocations: [],
        binCodes: [],
        removeLocations: []
      };
      const state: BinState = {
        ...initialState,
        locationMappingResponse: payload
      };
      expect(
        selectors.BinSelectors.selectLocationMappingResponse.projector(state)
      ).toEqual(payload);
    });
    it('Should return the true or false', () => {
      const state: BinState = {
        ...initialState,
        isBinCodeLoading: true
      };
      expect(
        selectors.BinSelectors.selectIsBinCodeLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: BinState = {
        ...initialState,
        totalBinCodeDetails: 0
      };
      expect(
        selectors.BinSelectors.selectTotalBinCodeDetailsCount.projector(state)
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: BinState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.BinSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the locationsByBinCodesAndBinGroup list', () => {
      const locationlist = [
        {
          id: '1',
          description: 'aaa'
        }
      ];

      const state: BinState = {
        ...initialState,
        locationsByBinCodesAndBinGroup: locationlist
      };

      expect(
        selectors.BinSelectors.selectLocationsByBinCodesAndBinGroup.projector(
          state
        )
      ).toEqual(locationlist);
    });
    it('Should save the bin', () => {
      const payload: SaveBinCodeFormPayload = {
        binCode: 'aaa',
        binGroups: ['AAA'],
        description: 'aaa'
      };
      const state: BinState = {
        ...initialState,
        binCodeSaveNewResponses: payload
      };
      expect(
        selectors.BinSelectors.selectBinCodeNewFormResponse.projector(state)
      ).toEqual(payload);
    });
    it('Should edit the bin', () => {
      const payload: BinCodeSaveModel = {
        binCode: 'aaa',
        binGroups: [{ binGroupCode: 'aaa', isActive: true }],
        description: 'aaa'
      };
      const state: BinState = {
        ...initialState,
        editBinCodeResponses: payload
      };
      expect(
        selectors.BinSelectors.selectBinCodeEditFormResponse.projector(state)
      ).toEqual(payload);
    });
    it('Should return search true or false', () => {
      const state: BinState = {
        ...initialState,
        isSearchElements: true
      };
      expect(
        selectors.BinSelectors.selectIssearchElements.projector(state)
      ).toEqual(true);
    });
  });
});
