import { StockRecevieItemAdaptor } from '@poss-web/shared/util-adaptors';
import { StockReceiveItem } from '@poss-web/shared/models';
import * as moment from 'moment';

describe('StockRecevieItemAdaptor', () => {
  it('should return stock receive item', () => {
    const items: any = {
      id: 'TestingId',
      currencyCode: 'INR',
      imageURL: '',
      itemCode: 'IC',
      itemDetails: 'ID',
      stdValue: 1,
      stdWeight: 1,
      lotNumber: '',
      mfgDate: moment(),
      orderType: 'TEST_TYPE',
      productCategory: 'prod_cat',
      productCategoryDesc: 'prod_cat_desc',
      productGroup: 'prod_group',
      productGroupDesc: 'prod_group_desc',
      status: 'status',
      availableQuantity: 1,
      availableValue: 1,
      availableWeight: 1,
      weightUnit: 'test',
      measuredQuantity: 1,
      measuredWeight: 1,
      binCode: 'B',
      binGroupCode: 'B',
      remarks: 'remarks'
    };
    const studdedProductGroups = [];
    const expectedResult: StockReceiveItem = {
      ...items,
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: false
    };
    const result = StockRecevieItemAdaptor.fromJson(
      items,
      studdedProductGroups
    );
    expect(result).toEqual(expectedResult);
  });

  it('should return order type in uppercase', () => {
    const items: any = {
      id: 'TestingId',
      currencyCode: 'INR',
      imageURL: '',
      itemCode: 'IC',
      itemDetails: 'ID',
      stdValue: 0,
      stdWeight: 1,
      lotNumber: '',
      mfgDate: null,
      orderType: 'test_type',
      productCategory: 'prod_cat',
      productCategoryDesc: 'prod_cat_desc',
      productGroup: 'stones',
      productGroupDesc: 'prod_group_desc',
      status: 'status',
      availableQuantity: 0,
      availableValue: 0,
      availableWeight: 1,
      weightUnit: 'test',
      measuredQuantity: 0,
      measuredWeight: 1,
      binCode: 'B',
      binGroupCode: 'B',
      remarks: 'remarks'
    };
    const studdedProductGroups = [];
    const expectedResult: StockReceiveItem = {
      ...items,
      orderType: 'TEST_TYPE',
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: false
    };
    const result = StockRecevieItemAdaptor.fromJson(
      items,
      studdedProductGroups
    );
    expect(result.orderType).toEqual(expectedResult.orderType);
  });

  it('should return order type in uppercase', () => {
    const items: any = {
      id: 'TestingId',
      currencyCode: 'INR',
      imageURL: '',
      itemCode: 'IC',
      itemDetails: 'ID',
      stdValue: 0,
      stdWeight: 1,
      lotNumber: '',
      mfgDate: null,
      orderType: 'test_type',
      productCategory: 'prod_cat',
      productCategoryDesc: 'prod_cat_desc',
      productGroup: 'stones',
      productGroupDesc: 'prod_group_desc',
      status: 'status',
      availableQuantity: 0,
      availableValue: 0,
      availableWeight: 1,
      weightUnit: 'test',
      measuredQuantity: 0,
      measuredWeight: 1,
      binCode: 'B',
      binGroupCode: 'B',
      remarks: 'remarks'
    };
    const studdedProductGroups = ['A', 'B', 'C'];
    const expectedResult: StockReceiveItem = {
      ...items,
      orderType: 'TEST_TYPE',
      isUpdating: false,
      isUpdatingSuccess: null,
      isValidating: false,
      isValidatingSuccess: null,
      isValidatingError: false,
      isStudded: false
    };
    const result = StockRecevieItemAdaptor.fromJson(
      items,
      studdedProductGroups
    );
    expect(result.isStudded).toEqual(expectedResult.isStudded);
  });
});
