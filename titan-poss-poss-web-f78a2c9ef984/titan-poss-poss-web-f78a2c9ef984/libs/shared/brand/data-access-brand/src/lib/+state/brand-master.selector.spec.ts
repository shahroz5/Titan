// you will need to assert that the store is calling the right selector function.

import {
  CustomErrors,
  BrandMasterDetails,
  BrandCustomerDetails,
  BrandConfigDetails,
  BrandCMDetails,
  BrandPanCardDetails,
  BrandTaxDetails
} from '@poss-web/shared/models';

import { BrandEntity, brandAdaptor } from './brand-master.entity';
import { BrandMasterState } from './brand-master.state';
import { initialState } from './brand-master.reducer';
import * as selectors from './brand-master.selectors';

describe('Brand Master selector Testing Suite', () => {
  const createBrand = (
    brandCode: string,
    orgCode: string,
    description: string,
    isActive: boolean,
    parentBrandCode: string,
    configDetails: BrandConfigDetails,
    cmDetails: BrandCMDetails,
    customerDetails: BrandCustomerDetails,
    panCardDetails: BrandPanCardDetails,
    taxDetails: BrandTaxDetails
  ): BrandMasterDetails => {
    return {
      brandCode,
      orgCode,
      configDetails,
      description,
      parentBrandCode,
      cmDetails,
      customerDetails,
      panCardDetails,
      taxDetails,
      isActive
    };
  };

  const brand1 = createBrand(
    'brand1',
    'TJ',
    'brand1',
    true,
    'brand1',
    null,
    null,
    null,
    null,
    null
  );

  const brand2 = createBrand(
    'brand2',
    'TJ',
    'brand2',
    true,
    'brand2',
    null,
    null,
    null,
    null,
    null
  );
  const addElementToEntities = <T extends BrandMasterDetails>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.brandCode]: element
        };
      },
      {}
    );

    return reducedEntities;
  };

  const brandArray = [brand1, brand2];

  const brandMasterState: BrandEntity = {
    ids: [brand1.brandCode, brand2.brandCode],
    entities: addElementToEntities(brandArray)
  };

  const error: CustomErrors = {
    error: null,
    code: '',
    message: '',
    traceId: '',
    timeStamp: ''
  };
  describe('Testing brand master related Selectors', () => {
    it('Should return the list of brands', () => {
      const brandList = brandAdaptor.setAll(brandArray, {
        ...brandAdaptor.getInitialState()
      });

      const state: BrandMasterState = {
        ...initialState,
        brandlist: brandMasterState
      };
      expect(selectors.brandList.projector(state)).toEqual(brandList);
    });
    it('Should return the list of brand master', () => {
      expect(
        selectors.brandMasterSelectors.selectBrandList.projector(
          brandMasterState
        )
      ).toEqual(brandArray);
    });
    it('Should return the true or false', () => {
      const state: BrandMasterState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.brandMasterSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });
    it('Should return the error object', () => {
      const state: BrandMasterState = {
        ...initialState,
        error: {
          error: null,
          timeStamp: '',
          traceId: '',
          code: '',
          message: ''
        }
      };
      expect(
        selectors.brandMasterSelectors.selectError.projector(state)
      ).toEqual(error);
    });
    it('Should return the Brand object', () => {
      const state: BrandMasterState = {
        ...initialState,
        brandDetails: {
          brandCode: 'brand2',
          orgCode: 'TJ',
          description: 'brand2',
          isActive: true,
          configDetails: null,
          cmDetails: null,
          customerDetails: null,
          panCardDetails: null,
          parentBrandCode: 'brand2',
          taxDetails: null
        }
      };
      expect(
        selectors.brandMasterSelectors.selectBrandDetails.projector(state)
      ).toEqual(brand2);
    });

    it('hasSaved Should return the true or false', () => {
      const state: BrandMasterState = {
        ...initialState,
        hasSaved: true
      };
      expect(
        selectors.brandMasterSelectors.selectHasSaved.projector(state)
      ).toEqual(true);
    });

    it('selectTotalElements  Should return the true or false', () => {
      const state: BrandMasterState = {
        ...initialState,
        totalElements: 10
      };
      expect(
        selectors.brandMasterSelectors.selectTotalElements.projector(state)
      ).toEqual(10);
    });
  });
});
