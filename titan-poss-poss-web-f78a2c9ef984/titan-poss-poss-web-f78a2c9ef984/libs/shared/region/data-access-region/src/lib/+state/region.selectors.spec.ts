import {
  CustomErrors,
  RegionsData,
  SaveRegionDetailsPayload
} from '@poss-web/shared/models';
import { RegionsState } from './region.state';
import { initialState } from './region.reducer';
import * as selectors from './region.selectors';
import { RegionEntity, regionAdapter } from './region.entity';

describe('Region selector Testing Suite', () => {
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
  const regionState: RegionEntity = {
    ids: [regionData.regionCode],
    entities: addElementToEntities([regionData])
  };

  describe('Testing Region master related Selectors', () => {
    it('Should return the list of regions ', () => {
      const selectRegionDetailsListing = regionAdapter.setAll([regionData], {
        ...regionAdapter.getInitialState()
      });

      const state: RegionsState = {
        ...initialState,
        regionDetailsListing: regionState
      };

      expect(selectors.selectRegionDetailsListing.projector(state)).toEqual(
        selectRegionDetailsListing
      );
    });
    it('Should return the list of price group master', () => {
      expect(
        selectors.RegionSelectors.selectLoadedRegionListing.projector(
          regionState
        )
      ).toEqual([regionData]);
    });
    it('Should return the true or false', () => {
      const state: RegionsState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.RegionSelectors.selectIsRegionListingLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the count', () => {
      const state: RegionsState = {
        ...initialState,
        totalRegionDetails: 0
      };
      expect(
        selectors.RegionSelectors.selectTotalRegionDetailsCount.projector(state)
      ).toEqual(0);
    });
    it('Should return the error object', () => {
      const state: RegionsState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(selectors.RegionSelectors.selectError.projector(state)).toEqual(
        error
      );
    });
    it('Should return the Region object', () => {
      const state: RegionsState = {
        ...initialState,
        regionDetailsByRegionCode: regionData
      };

      expect(
        selectors.RegionSelectors.selectRegionByRegionCode.projector(state)
      ).toEqual(regionData);
    });

    it('Should save the Region', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const state: RegionsState = {
        ...initialState,
        saveRegionDetailsResponse: payload
      };
      expect(
        selectors.RegionSelectors.selectSaveRegionDetailsResponse.projector(
          state
        )
      ).toEqual(payload);
    });
    it('Should edit the Region', () => {
      const payload: SaveRegionDetailsPayload = {
        regionCode: 'AAA',
        description: 'AAA',
        orgCode: 'AAA',
        configDetails: {},
        parentRegionCode: 'AAA',
        isActive: true
      };
      const state: RegionsState = {
        ...initialState,
        editRegionDetailsResponse: payload
      };
      expect(
        selectors.RegionSelectors.selectEditRegionDetailsResponse.projector(
          state
        )
      ).toEqual(payload);
    });
  });
});
