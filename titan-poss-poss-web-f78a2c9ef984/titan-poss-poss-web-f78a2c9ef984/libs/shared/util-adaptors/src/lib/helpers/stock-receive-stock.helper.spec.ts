import { StockReceiveStockHelper } from '@poss-web/shared/util-adaptors';
import { StockReceiveStock } from '@poss-web/shared/models';
import { StockReceiveStockAdaptor } from '../stock-receive/stock-receive-stock.adaptor';
import * as moment from 'moment';

describe('StockReceiveStockHelper', () => {
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

  const typefield = 'transferType';
  const inputStock = {
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
  };
  const stock: StockReceiveStock = {
    id: 1408,
    currencyCode: 'INR',
    courierDetails: {
      type: 'courier',
      data: {
        lockNumber: '',
        roadPermitNumber: '',
        companyName: 'SEQUEL LOGISTICS',
        docketNumber: '592826558',
        employeeId: '',
        employeeMobileNumber: '',
        employeeName: ''
      }
    },
    courierReceivedDate: null,
    orderType: 'R',
    srcDocNo: 5611018,
    srcDocDate: moment(),
    srcFiscalYear: null,
    srcLocationCode: 'FROW',
    status: 'ISSUED',
    destDocDate: null,
    destDocNo: null,
    destLocationCode: 'BEL',
    totalAvailableWeight: 288.695,
    totalAvailableQuantity: 19,
    totalAvailableValue: 1044682.69,
    totalMeasuredQuantity: 19,
    totalMeasuredValue: 1044682.69,
    totalMeasuredWeight: 288.695,
    type: 'FAC_BTQ',
    weightUnit: 'gms',
    srcLocationDescription: 'Mumbai Office',
    destLocationDescription: 'Tanishq - Bellary',
    reasonForDelay: null
  };

  it('should call StockReceiveStockAdaptor with proper arguments', () => {
    spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(stock);
    const result = StockReceiveStockHelper.getStocks(input, typefield);
    expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledWith(
      inputStock,
      typefield
    );
  });

  it('should return the expected result', () => {
    const expectedResult = {
      stocks: [stock],
      count: 1
    };
    spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(stock);
    const result = StockReceiveStockHelper.getStocks(input, typefield);
    expect(result.stocks).toEqual(expectedResult.stocks);
    expect(result.count).toEqual(expectedResult.count);
  });

  it('should call correct number of stock receive stock', () => {
    spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(stock);
    const result = StockReceiveStockHelper.getStocks(input, typefield);
    expect(StockReceiveStockAdaptor.fromJson).toHaveBeenCalledTimes(1);
  });

  it('should not call stock receive stock when result is empty', () => {
    spyOn(StockReceiveStockAdaptor, 'fromJson').and.returnValue(stock);
    const result = StockReceiveStockHelper.getStocks(
      { results: [], totalElements: 1 },
      typefield
    );
    expect(StockReceiveStockAdaptor.fromJson).not.toHaveBeenCalled();
  });
});
