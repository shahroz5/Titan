import {
  BinGroupDetails,
  CustomErrors,
  SaveBinGroupFormDetailsPayload
} from '@poss-web/shared/models';
import { BinGroupState } from './bin-group.state';
import { initialState } from './bin-group.reducer';
import * as selectors from './bin-group.selectors';
import { BinGroupEntity, binGrouptAdapter } from './bin-group.entity';

describe('Bin Group selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const binGroupData: BinGroupDetails = {
    binGroupCode: 'AAA',
    description: 'AAA',
    isActive: true
  };
  const addElementToEntities = <T extends BinGroupDetails>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.binGroupCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const binGroupState: BinGroupEntity = {
    ids: [binGroupData.binGroupCode],
    entities: addElementToEntities([binGroupData])
  };

  describe('Testing Region master related Selectors', () => {
    // it('Should return the list of regions ', () => {
    //   const selectRegionDetailsListing = binGrouptAdapter.setAll(
    //     [binGroupData],
    //     {
    //       ...binGrouptAdapter.getInitialState()
    //     }
    //   );

    //   const state: BinGroupState = {
    //     ...initialState,
    //     binGroupDetailsListing: binGroupState
    //   };

    //   expect(selectors.selectBinGroupDetailsListing.projector(state)).toEqual(
    //     selectRegionDetailsListing
    //   );
    // });
    // it('Should return the list of price group master', () => {
    //   expect(
    //     selectors.BinGroupSelectors.selectLoadedBinGroupListing.projector(
    //       binGroupState
    //     )
    //   ).toEqual([binGroupData]);
    // });
    it('Should return the true or false', () => {
      const state: BinGroupState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.BinGroupSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: BinGroupState = {
        ...initialState,
        totalBinGroupDetails: 0
      };
      expect(
        selectors.BinGroupSelectors.selectTotalBinGroupDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: BinGroupState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.BinGroupSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the Region object', () => {
      const state: BinGroupState = {
        ...initialState,
        binGroupDetails: binGroupData
      };

      expect(
        selectors.BinGroupSelectors.selectbinGroupDetailsByBinGroupCode.projector(
          state
        )
      ).toEqual(binGroupData);
    });

    it('Should save the Region', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const state: BinGroupState = {
        ...initialState,
        saveBinGroupResponses: payload
      };
      expect(
        selectors.BinGroupSelectors.selectSaveBinGroupFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should edit the Region', () => {
      const payload: SaveBinGroupFormDetailsPayload = {
        binGroupCode: 'AAA',
        description: 'AAA',
        isActive: true
      };
      const state: BinGroupState = {
        ...initialState,
        editBinGroupResponses: payload
      };
      expect(
        selectors.BinGroupSelectors.selectEditBinGroupFormResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should select isSearchElements ', () => {
      const payload = true;
      const state: BinGroupState = {
        ...initialState,
        isSearchElements: payload
      };
      expect(
        selectors.BinGroupSelectors.selectIssearchElements.projector(state)
      ).toEqual(payload);
    });
  });
});
