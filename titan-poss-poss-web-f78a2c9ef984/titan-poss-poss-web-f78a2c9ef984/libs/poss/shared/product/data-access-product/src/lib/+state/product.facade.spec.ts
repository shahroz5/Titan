import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsRequestPayload,
  CashMemoItemValidate,
  CNDetailsRequestPayload,
  ProductDetailsPayload,
  SearchProductPayload,
  StatusTypesEnum,
  TaxDetailsPayload,
  ValidateProductAndPriceDetailsPayload
} from '@poss-web/shared/models';
import * as moment from 'moment';
import * as productActions from './product.actions';
import { ProductFacade } from './product.facade';
import { initialState } from './product.reducer';
import { ProductState } from './product.state';

const searchProductPayload: SearchProductPayload = {
  searchValue: '511107C'
};

const productDetailsPayload: ProductDetailsPayload = {
  itemCode: '511107CSIMAA00'
};

const rsoDetailsPayload = 'RSO';

const reasonsPayload = 'WEIGHT_EDIT';

const validateProductAndPriceDetailsPayload: ValidateProductAndPriceDetailsPayload = {
  inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
  orderPriceRequest: {
    checkInventory: true,
    itemCode: '511107CSIMAA00',
    lotNumber: '2JA005700',
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    standardPrice: {
      P: {
        metalTypeCode: 'P',
        purity: 92.5,
        ratePerUnit: 30,
        currency: 'INR',
        applicableDate: 1624300200000,
        karat: 0
      },
      J: {
        metalTypeCode: 'J',
        purity: 91.6666667,
        ratePerUnit: 3568,
        currency: 'INR',
        applicableDate: 1624300200000,
        karat: 22
      },
      L: {
        metalTypeCode: 'L',
        purity: 95,
        ratePerUnit: 2000,
        currency: 'INR',
        applicableDate: 1624300200000,
        karat: 0
      }
    }
  },
  isABInvoked: false
};

const taxDetailsPayload: TaxDetailsPayload = {
  customerId: 6,
  itemCode: '511107CSIMAA00',
  txnType: 'CUST_TRANSACTION_CM'
};

const cashMemoItemDetailsRequestPayload: CashMemoItemDetailsRequestPayload = {
  txnType: 'CM',
  subTxnType: 'NEW_CM',
  id: '65EA2494-74FE-4FEF-B934-574B6E133D9B',
  itemDetails: {
    employeeCode: null,
    finalValue: 36428.45,
    inventoryId: 'E4CAC29B-F951-4D20-A9C9-C9572C72FE96',
    inventoryWeight: 8.854,
    itemCode: '511107CSIMAA00',
    lotNumber: '2JA005700',
    reason: null,
    remarks: null,
    totalDiscount: 0,
    totalQuantity: 1,
    totalTax: 888.5,
    totalValue: 35539.95,
    totalWeight: 8.854,
    unitValue: 35539.95
  }
};

const validateItemPayload: CashMemoItemValidate = {
  itemId: 'f69d838b-7a96-4fdd-9bb6-704cb3ffa0a0',
  productGroupCode: '71',
  availableWeight: 8.854,
  measuredWeight: 8.855,
  measuredQuantity: 1,
  availableQuantity: 1
};

const cashMemoDetailsResponse: AdvanceBookingDetailsResponse = {
  activationDetails: {},
  cancellationDetails: {},
  confirmedTime: moment(),
  customerId: 1,
  discountDetails: 0,
  docDate: moment(),
  docNo: 1,
  employeeCode: '',
  finalValue: 123,
  firstHoldTime: moment(),
  fiscalYear: 2015,
  focDetails: {},
  id: '',
  isBestRate: true,
  isFrozenRate: true,
  lastHoldTime: moment(),
  metalRateList: {},
  minValue: 1,
  occasion: '',
  txnType: '',
  otherChargesList: {},
  paidValue: 1,
  refTxnId: '',
  refTxnType: '',
  remarks: '',
  roundingVariance: 1,
  status: StatusTypesEnum.APPROVED,
  subTxnType: '',
  taxDetails: {
    taxes: [
      {
        taxType: 'ITEMCHARGES',
        taxClass: 'TC72',
        data: {
          SGST: { taxCode: 'SGST', taxPercentage: 1.5, taxValue: 437.42 },
          CGST: { taxCode: 'CGST', taxPercentage: 1.5, taxValue: 437.42 }
        },
        cess: {}
      }
    ]
  },
  totalDiscount: 1,
  totalQuantity: 1,
  totalTax: 1,
  totalValue: 1,
  totalWeight: 1,
  txnTime: moment(),
  customerDocDetails: null,
  refSubTxnType: 'NEW_AB',
  isFrozenAmount: 0,
  hallmarkDiscount: 0,
  hallmarkCharges: 120,
  cancelTxnId: 2,
  isRivaah: false,
  refDocNo: 1,
  refFiscalYear: 2022
};

const cNDetailsRequestPayload: CNDetailsRequestPayload = {
  customerId: 353,
  cnType: 'ADV',
  isFrozenRateCnRequired: true
};

describe('Product facade Testing Suite action', () => {
  let productFacade: ProductFacade;
  let store: Store<ProductState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), ProductFacade]
    });

    productFacade = TestBed.inject(ProductFacade);
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue({});
  });

  describe('Dispatch Product actions', () => {
    it('should call SearchProduct action', () => {
      const action = new productActions.SearchProduct(searchProductPayload);
      productFacade.loadSearchProduct(searchProductPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadProductDetails action', () => {
      const action = new productActions.LoadProductDetails(
        productDetailsPayload
      );
      productFacade.loadProductDetails(productDetailsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadRSODetails action', () => {
      const action = new productActions.LoadRSODetails(rsoDetailsPayload);
      productFacade.loadRSODetails(rsoDetailsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadReasons action', () => {
      const action = new productActions.LoadReasons(reasonsPayload);
      productFacade.loadReasons(reasonsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ValidateProductAndPriceDetails action', () => {
      const action = new productActions.ValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      productFacade.loadValidateProductAndPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadTaxDetails action', () => {
      const action = new productActions.LoadTaxDetails(taxDetailsPayload);
      productFacade.loadTaxDetails(taxDetailsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCoinDetails action', () => {
      const action = new productActions.LoadCoinDetails({
        itemCode: '600102ZNARAS00',
        withSaleableCheck: true
      });
      productFacade.loadCoinDetails({
        itemCode: '600102ZNARAS00',
        withSaleableCheck: true
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadValidCoinDetails action', () => {
      const action = new productActions.LoadValidCoinDetails({
        itemCode: '600102ZNARAS00',
        withSaleableCheck: true
      });
      productFacade.loadValidCoinDetails({
        itemCode: '600102ZNARAS00',
        withSaleableCheck: true
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadPriceDetails action', () => {
      const action = new productActions.LoadPriceDetails(
        validateProductAndPriceDetailsPayload
      );
      productFacade.loadPriceDetails(validateProductAndPriceDetailsPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call AddItemtoCashMemo action', () => {
      const action = new productActions.AddItemtoCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.addItemToCashMemo(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetItemfromCashMemo action', () => {
      const action = new productActions.GetItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.getItemFromCashMemo(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call GetItemDetails action', () => {
      const action = new productActions.GetItemDetails(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.loadAbItemDetails(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call PartialUpdateIteminCashMemo action', () => {
      const action = new productActions.PartialUpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.partialUpdateItemInCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call UpdateIteminCashMemo action', () => {
      const action = new productActions.UpdateIteminCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.updateItemInCashMemo(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DeleteItemfromCashMemo action', () => {
      const action = new productActions.DeleteItemfromCashMemo(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.deleteItemFromCashMemo(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call DeleteItemDetails action', () => {
      const action = new productActions.DeleteItemDetails(
        cashMemoItemDetailsRequestPayload
      );
      productFacade.deleteItemDetails(cashMemoItemDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ValidateItem action', () => {
      const action = new productActions.ValidateItem(validateItemPayload);
      productFacade.validateItem(validateItemPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSelectedLotNumberDetails action', () => {
      const action = new productActions.LoadSelectedLotNumberDetails(
        'A1B32BD8-8D3A-4990-821D-66E21C51FFC2'
      );
      productFacade.loadLotNumber('A1B32BD8-8D3A-4990-821D-66E21C51FFC2');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadSelectedItemDetails action', () => {
      const action = new productActions.LoadSelectedItemDetails(
        'A1B32BD8-8D3A-4990-821D-66E21C51FFC2'
      );
      productFacade.loadItemDetails('A1B32BD8-8D3A-4990-821D-66E21C51FFC2');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call LoadCreditNoteDetails action', () => {
      const action = new productActions.LoadCreditNoteDetails(
        cNDetailsRequestPayload
      );
      productFacade.loadCreditNoteDetailsByCNType(cNDetailsRequestPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetItemIDList action', () => {
      const action = new productActions.SetItemIDList({
        item: cashMemoDetailsResponse,
        isUpdate: false
      });
      productFacade.setItemIDList({
        item: cashMemoDetailsResponse,
        isUpdate: false
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetStandardPrice action', () => {
      const action = new productActions.SetStandardPrice({
        price: 800
      });
      productFacade.setStandardPrice({
        price: 800
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetMetalRate action', () => {
      const action = new productActions.SetMetalRate({
        price: 800
      });
      productFacade.setMetalRate({
        price: 800
      });
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetCreateOrder action', () => {
      const action = new productActions.SetCreateOrder(false);
      productFacade.setCreateOrder(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetDiscountSelected action', () => {
      const action = new productActions.SetDiscountSelected(false);
      productFacade.setDiscountSelected(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetABInvokedFirstTime action', () => {
      const action = new productActions.SetABInvokedFirstTime(false);
      productFacade.setIsABInvokedFirstTime(false);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetItemDetailsOperation action', () => {
      const action = new productActions.SetItemDetailsOperation('LOT');
      productFacade.setItemDetailsOperation('LOT');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetValues action', () => {
      const action = new productActions.ResetValues();
      productFacade.resetValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetItemIdValues action', () => {
      const action = new productActions.ResetItemIdValues();
      productFacade.resetItemIdValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetItemIdList action', () => {
      const action = new productActions.ResetItemIdList();
      productFacade.resetItemIdList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetLotNumberValues action', () => {
      const action = new productActions.ResetLotNumberValues();
      productFacade.resetLotNumberValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetProductValues action', () => {
      const action = new productActions.ResetProductValues();
      productFacade.resetProductValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ResetCoinValues action', () => {
      const action = new productActions.ResetCoinValues();
      productFacade.resetCoinValues();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearSearchProductList action', () => {
      const action = new productActions.ClearSearchProductList();
      productFacade.clearSearchProductList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearProductList action', () => {
      const action = new productActions.ClearProductList();
      productFacade.clearProductList();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearProductRelatedDetails action', () => {
      const action = new productActions.ClearProductRelatedDetails();
      productFacade.clearProductRelatedDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearValidateItem action', () => {
      const action = new productActions.ClearValidateItem();
      productFacade.clearValidateItem();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call ClearProductGrid action', () => {
      const action = new productActions.ClearProductGrid();
      productFacade.clearProductGrid();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });

    it('should call SetGridSearchEnable action', () => {
      const action = new productActions.SetGridSearchEnable(true);
      productFacade.setGridSearchEnable(true);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Product Selectors', () => {
    it('should get getHasError data', () => {
      expect(productFacade.getHasError()).toEqual(productFacade['hasError$']);
    });

    it('should get getIsLoading data', () => {
      expect(productFacade.getIsLoading()).toEqual(productFacade['isLoading$']);
    });

    it('should get getIsPriceLoading data', () => {
      expect(productFacade.getIsPriceLoading()).toEqual(
        productFacade['isPriceLoading$']
      );
    });

    it('should get getIsTaxLoading data', () => {
      expect(productFacade.getIsTaxLoading()).toEqual(
        productFacade['isTaxLoading$']
      );
    });

    it('should get getIsItemLoading data', () => {
      expect(productFacade.getIsItemLoading()).toEqual(
        productFacade['isItemLoading$']
      );
    });

    it('should get getIsCoinLoading data', () => {
      expect(productFacade.getIsCoinLoading()).toEqual(
        productFacade['isCoinLoading$']
      );
    });

    it('should get getSearchProductList data', () => {
      expect(productFacade.getSearchProductList()).toEqual(
        productFacade['searchProductList$']
      );
    });

    it('should get getSearchProductListCount data', () => {
      expect(productFacade.getSearchProductListCount()).toEqual(
        productFacade['searchProductListCount$']
      );
    });

    it('should get getProductDetails data', () => {
      expect(productFacade.getProductDetails()).toEqual(
        productFacade['productDetails$']
      );
    });

    it('should get getProductDetailsCount data', () => {
      expect(productFacade.getProductDetailsCount()).toEqual(
        productFacade['productDetailsCount$']
      );
    });

    it('should get getRSODetails data', () => {
      expect(productFacade.getRSODetails()).toEqual(
        productFacade['RSODetails$']
      );
    });

    it('should get getReasons data', () => {
      expect(productFacade.getReasons()).toEqual(productFacade['reasons$']);
    });

    it('should get getValidateProductAndPriceDetails data', () => {
      expect(productFacade.getValidateProductAndPriceDetails()).toEqual(
        productFacade['validateProductAndPriceDetails$']
      );
    });

    it('should get getTaxDetails data', () => {
      expect(productFacade.getTaxDetails()).toEqual(
        productFacade['taxDetails$']
      );
    });

    it('should get getDeleteItemFromCashMemoResponse data', () => {
      expect(productFacade.getDeleteItemFromCashMemoResponse()).toEqual(
        productFacade['deleteItemFromCashMemoResponse$']
      );
    });

    it('should get getValidateWeight data', () => {
      expect(productFacade.getValidateWeight()).toEqual(
        productFacade['validateWeightResponse$']
      );
    });

    it('should get getItemDetails data', () => {
      expect(productFacade.getItemDetails()).toEqual(
        productFacade['itemDetails$']
      );
    });

    it('should get getAbItemDetails data', () => {
      expect(productFacade.getAbItemDetails()).toEqual(
        productFacade['abItemDetails$']
      );
    });

    it('should get getLotNumberDetails data', () => {
      expect(productFacade.getLotNumberDetails()).toEqual(
        productFacade['lotNumberDetails$']
      );
    });

    it('should get getCoinDetails data', () => {
      expect(productFacade.getCoinDetails()).toEqual(
        productFacade['coinDetails$']
      );
    });

    it('should get getPriceDetails data', () => {
      expect(productFacade.getPriceDetails()).toEqual(
        productFacade['priceDetails$']
      );
    });

    it('should get getItemIDList data', () => {
      expect(productFacade.getItemIDList()).toEqual(
        productFacade['itemIDList$']
      );
    });

    it('should get getClearProductGrid data', () => {
      expect(productFacade.getClearProductGrid()).toEqual(
        productFacade['clearProductGrid$']
      );
    });

    it('should get getGridSearchEnable data', () => {
      expect(productFacade.getGridSearchEnable()).toEqual(
        productFacade['gridSearchEnable$']
      );
    });

    it('should get getStandardPrice data', () => {
      expect(productFacade.getStandardPrice()).toEqual(
        productFacade['standardPrice$']
      );
    });

    it('should get getMetalRate data', () => {
      expect(productFacade.getMetalRate()).toEqual(productFacade['metalRate$']);
    });

    it('should get getCreateOrder data', () => {
      expect(productFacade.getCreateOrder()).toEqual(
        productFacade['createOrder$']
      );
    });

    it('should get getSelectedItemDetails data', () => {
      expect(productFacade.getSelectedItemDetails()).toEqual(
        productFacade['selectedItemDetails$']
      );
    });

    it('should get getDiscountSelected data', () => {
      expect(productFacade.getDiscountSelected()).toEqual(
        productFacade['discoutSelected$']
      );
    });

    it('should get getIsABInvokedFirstTime data', () => {
      expect(productFacade.getIsABInvokedFirstTime()).toEqual(
        productFacade['isABInvokedFirstTime$']
      );
    });

    it('should get getSpecificItemId data', () => {
      expect(productFacade.getSpecificItemId()).toEqual(
        productFacade['specificItemId$']
      );
    });

    it('should get getValidCoinDetails data', () => {
      expect(productFacade.getValidCoinDetails()).toEqual(
        productFacade['validCoinDetails$']
      );
    });

    it('should get getCNDetailsByCNType data', () => {
      expect(productFacade.getCNDetailsByCNType()).toEqual(
        productFacade['CNDetails$']
      );
    });

    it('should get getItemDetailsOperation data', () => {
      expect(productFacade.getItemDetailsOperation()).toEqual(
        productFacade['itemDetailsOperation$']
      );
    });

    it('should get getIsABDiscountsSelected data', () => {
      expect(productFacade.getIsABDiscountsSelected()).toEqual(
        productFacade['isABDiscountsSelected$']
      );
    });
  });
});
