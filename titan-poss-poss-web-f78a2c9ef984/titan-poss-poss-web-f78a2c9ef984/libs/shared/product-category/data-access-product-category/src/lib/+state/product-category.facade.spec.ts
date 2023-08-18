import { ProductCategoryFacade } from './product-category.facade';
import { ProductCategoryState } from './product-category.state';
import { provideMockStore } from '@ngrx/store/testing';
import {
  EditProductCategoryFormDetails,
  LoadProductCategoryByProductCategoryCode,
  LoadProductCategoryDetails,
  SaveProductCategoryFormDetails,
  SearchProductCategoryCode
} from './product-category.actions';
import { TestBed, inject } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { SaveProductCategoryFormDetailsPayload } from '@poss-web/shared/models';

describe('ProductCategoryFacade', () => {
  let productCategoryFacade: ProductCategoryFacade;
  const initialState: ProductCategoryState = {
    productCategoryListing: null,
    productCategoryDetails: null,
    totalProductCategoryDetails: 0,
    isLoading: false,
    error: null,
    saveProductCategoryResponses: null,
    editProductCategoryResponses: null
  };

  const payload: SaveProductCategoryFormDetailsPayload = {
    orgCode: 'orgCode',
    productCategoryCode: 'A',
    description: 'desc',
    isActive: true,
    isConversionEnabled: true,
    hallmarkQuantity: 10,
    hallmarkDetails: {
      data: {
        hallmarkingCharges: '10',
        isAllowedForHallmarking: false,
        isFOCForHallmarkingCharges: false
      },
      type: 'HALLMARK_DETAILS'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ProductCategoryFacade]
    });

    productCategoryFacade = TestBed.inject(ProductCategoryFacade);
  });

  it('should create facade', () => {
    expect(productCategoryFacade).toBeDefined();
  });

  describe('#getproductCategoryDetailsListing', () => {
    it('should get listing', () => {
      expect(
        productCategoryFacade.getproductCategoryDetailsListing()
      ).toBeTruthy();
    });
  });

  describe('#getproductCategoryEditResponse', () => {
    it('should get getproductCategoryEditResponse', () => {
      expect(
        productCategoryFacade.getproductCategoryEditResponse()
      ).toBeTruthy();
    });
  });

  describe('#getproductCategorySaveResponse', () => {
    it('should get getproductCategorySaveResponse', () => {
      expect(
        productCategoryFacade.getproductCategorySaveResponse()
      ).toBeTruthy();
    });
  });

  describe('#getTotalproductCategoryDetails', () => {
    it('should getTotalproductCategoryDetails', () => {
      expect(
        productCategoryFacade.getTotalproductCategoryDetails()
      ).toBeTruthy();
    });
  });

  describe('#getisLoading', () => {
    it('should getisLoading', () => {
      expect(productCategoryFacade.getisLoading()).toBeTruthy();
    });
  });

  describe('#getTotalproductCategoryDetails', () => {
    it('should getTotalproductCategoryDetails', () => {
      expect(
        productCategoryFacade.getTotalproductCategoryDetails()
      ).toBeTruthy();
    });
  });

  describe('#getproductCategoryDetailsByproductCategoryCode', () => {
    it('should getproductCategoryDetailsByproductCategoryCode', () => {
      expect(
        productCategoryFacade.getproductCategoryDetailsByproductCategoryCode()
      ).toBeTruthy();
    });
  });

  describe('#getError', () => {
    it('should getError', () => {
      expect(productCategoryFacade.getError()).toBeTruthy();
    });
  });

  describe('#loadProductCategoryDetailsByproductCategoryCode', () => {
    it('should loadProductCategoryDetailsByproductCategoryCode', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadProductCategoryByProductCategoryCode(
          'test'
        );
        productCategoryFacade.loadProductCategoryDetailsByproductCategoryCode(
          'test'
        );

        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('#loadProductCategoryDetailsListing', () => {
    it('should loadProductCategoryDetailsListing', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadProductCategoryDetails({
        pageIndex: 0,
        pageSize: 8
      });
      productCategoryFacade.loadProductCategoryDetailsListing({
        pageIndex: 0,
        pageSize: 8
      });

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#editproductCategoryFormDetails', () => {
    it('should editproductCategoryFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new EditProductCategoryFormDetails(payload);
      productCategoryFacade.editproductCategoryFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#saveproductCategoryFormDetails', () => {
    it('should saveproductCategoryFormDetails', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SaveProductCategoryFormDetails(payload);
      productCategoryFacade.saveproductCategoryFormDetails(payload);

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('#searchProductCategor', () => {
    it('should searchProductCategor', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchProductCategoryCode('searchKey');
      productCategoryFacade.searchProductCategor('searchKey');

      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
