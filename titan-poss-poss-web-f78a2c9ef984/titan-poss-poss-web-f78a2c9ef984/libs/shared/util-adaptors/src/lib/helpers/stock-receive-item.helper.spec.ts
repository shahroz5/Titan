import { StockReceiveItemHelper } from '@poss-web/shared/util-adaptors';
import { StockReceiveItem } from '@poss-web/shared/models';
import { StockRecevieItemAdaptor } from '../stock-receive/stock-receive-item.adaptor';
import * as moment from 'moment';

describe('StockReceiveItemHelper', () => {
  const input: any = {
    results: [
      {
        id: 1408,
        srcLocationCode: 'FROW',
        destLocationCode: 'BEL',
        status: 'ISSUED',
        weightUnit: 'gms',
        currencyCode: 'INR',
        srcLocationDescription: 'Mumbai Office',
        destLocationDescription: 'Tanishq - Bellary',
        srcDocNo: 5611018,
        srcFiscalYear: null,
        srcDocDate: 1561573800000,
        destDocNo: null,
        destDocDate: null,
        orderType: 'R',
        totalAvailableQuantity: 19,
        totalMeasuredQuantity: 19,
        totalAvailableValue: 1044682.69,
        totalMeasuredValue: 1044682.69,
        totalAvailableWeight: 288.695,
        totalMeasuredWeight: 288.695,
        transferType: 'FAC_BTQ',
        courierReceivedDate: null,
        carrierDetails: {
          type: 'courier',
          data: {
            lockNumber: '',
            roadPermitNumber: '',
            companyName: 'SEQUEL LOGISTICS',
            docketNumber: '592826558'
          }
        },
        reasonForDelay: null
      }
    ],
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 1
  };

  const item: StockReceiveItem = {
    id: 'TestingId',
    currencyCode: 'INR',
    imageURL: '',
    itemCode: 'IC',
    itemDetails: 'ID',
    stdValue: 1,
    stdWeight: 1,
    lotNumber: '',
    mfgDate: moment(),
    orderType: 'P',
    productCategory: 'PC',
    productCategoryDesc: 'PCD',
    productGroup: 'PG',
    productGroupDesc: 'PGD',
    status: 'S',
    availableQuantity: 1,
    availableValue: 1,
    availableWeight: 1,
    weightUnit: '',
    measuredQuantity: 1,
    measuredWeight: 1,
    binCode: 'B',
    binGroupCode: 'B',
    remarks: 'test',
    isUpdating: false,
    isUpdatingSuccess: null,
    isValidating: false,
    isValidatingSuccess: null,
    isValidatingError: false,
    isStudded: false
  };

  it('should return the expected result', () => {
    const expectedResult = {
      items: [item],
      count: 1
    };
    spyOn(StockRecevieItemAdaptor, 'fromJson').and.returnValue(item);
    const result = StockReceiveItemHelper.getItems(input, []);
    expect(result.items).toEqual(expectedResult.items);
    expect(result.count).toEqual(expectedResult.count);
  });

  it('should call correct number of stock receive item adaptor', () => {
    spyOn(StockRecevieItemAdaptor, 'fromJson').and.returnValue(item);
    StockReceiveItemHelper.getItems(input, []);
    expect(StockRecevieItemAdaptor.fromJson).toHaveBeenCalledTimes(1);
  });

  it('should not call stock receive adaptor when result is empty', () => {
    spyOn(StockRecevieItemAdaptor, 'fromJson').and.returnValue(item);
    StockReceiveItemHelper.getItems({ results: [], totalElements: 0 }, []);
    expect(StockRecevieItemAdaptor.fromJson).not.toHaveBeenCalled();
  });
});
