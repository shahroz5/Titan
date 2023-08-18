import { SubRegionState } from './sub-region.state';
import { initialState } from './sub-region.reducer';
import * as selectors from './sub-region.selectors';
import {
  SubRegionEntity,
  subRegionAdapter,
  regionAdapter
} from './sub-region.entity';
import { CustomErrors, RegionsData, SubRegion } from '@poss-web/shared/models';

describe('Sub Region selector Testing Suite', () => {
  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  const regionData: RegionsData = {
    regionCode: 'AAA',
    description: 'AAA',
    orgCode: 'AAA',
    configDetails: {},
    parentRegionCode: 'AAA',
    isActive: true
  };
  const subRegionData: SubRegion = {
    regionCode: 'AAA',
    description: 'AAA',
    orgCode: 'AAA',
    configDetails: {},
    parentRegionCode: 'AAA',
    isActive: true
  };
  const addElementToEntities = <T extends RegionsData>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.regionCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const addElementToEntities2 = <T extends SubRegion>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.regionCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };
  const regionState: SubRegionEntity = {
    ids: [regionData.regionCode],
    entities: addElementToEntities([regionData])
  };
  const subRegionState: SubRegionEntity = {
    ids: [subRegionData.regionCode],
    entities: addElementToEntities2([subRegionData])
  };

  describe('Testing Sub Region master related Selectors', () => {
    it('Should return the list of regions ', () => {
      const selectRegionDetailsListing = regionAdapter.setAll([regionData], {
        ...regionAdapter.getInitialState()
      });

      const state: SubRegionState = {
        ...initialState,
        regionDetailsListing: regionState
      };

      expect(selectors.selectRegionDetailsListing.projector(state)).toEqual(
        selectRegionDetailsListing
      );
    });
    it('Should return the list of regions', () => {
      expect(
        selectors.SubRegionSelectors.selectLoadedRegionListing.projector(
          regionState
        )
      ).toEqual([regionData]);
    });

    it('Should return the list of sub regions ', () => {
      const selectSubRegionDetailsListing = subRegionAdapter.setAll(
        [subRegionData],
        {
          ...subRegionAdapter.getInitialState()
        }
      );

      const state: SubRegionState = {
        ...initialState,
        subRegionDetailsListing: subRegionState
      };

      expect(selectors.selectSubRegionDetailsListing.projector(state)).toEqual(
        selectSubRegionDetailsListing
      );
    });
    it('Should return the list of sub regions', () => {
      expect(
        selectors.SubRegionSelectors.selectLoadedSubRegionListing.projector(
          subRegionState
        )
      ).toEqual([subRegionData]);
    });
    it('Should return the true or false', () => {
      const state: SubRegionState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.SubRegionSelectors.selectIsSubRegionListingLoading.projector(
          state
        )
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: SubRegionState = {
        ...initialState,
        totalSubRegionDetails: 0
      };
      expect(
        selectors.SubRegionSelectors.selectTotalSubRegionDetailsCount.projector(
          state
        )
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: SubRegionState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.SubRegionSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the Region object', () => {
      const state: SubRegionState = {
        ...initialState,
        subRegionDetailsBySubRegionCode: regionData
      };

      expect(
        selectors.SubRegionSelectors.selectSubRegionByRegionCode.projector(
          state
        )
      ).toEqual(regionData);
    });

    it('Should save the Region', () => {
      const payload: SubRegion = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const state: SubRegionState = {
        ...initialState,
        saveSubRegionDetailsResponse: payload
      };
      expect(
        selectors.SubRegionSelectors.selectSaveSubRegionDetailsResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should edit the Region', () => {
      const payload: SubRegion = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const state: SubRegionState = {
        ...initialState,
        editSubRegionDetailsResponse: payload
      };
      expect(
        selectors.SubRegionSelectors.selectEditSubRegionDetailsResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should return the boolean search', () => {
      const state: SubRegionState = {
        ...initialState,
        isSearchElements: true
      };

      expect(
        selectors.SubRegionSelectors.selectIssearchElements.projector(state)
      ).toEqual(true);
    });
  });
});
