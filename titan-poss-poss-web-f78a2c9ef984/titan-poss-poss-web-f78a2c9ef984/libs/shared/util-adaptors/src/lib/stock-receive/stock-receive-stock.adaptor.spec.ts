import { StockReceiveStockAdaptor } from '@poss-web/shared/util-adaptors';
import {
  StockReceiveStock,
  StockReceiveCourierDetails
} from '@poss-web/shared/models';
import * as moment from 'moment';

describe('StockReceiveStockAdaptor', () => {
  it('should return null if data is empty', () => {
    const data = null;
    const typeField = '';
    const result = StockReceiveStockAdaptor.fromJson(data, typeField);
    expect(result).toEqual(null);
  });

  it('should return the stock', () => {
    const input: any = {
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
    const typefield = 'transferType';

    const expectedResult: StockReceiveStock = {
      id: 1408,
      srcDocNo: 5611018,
      srcLocationCode: 'FROW',
      type: input[typefield],
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
      orderType: 'R',
      courierReceivedDate: null,
      totalAvailableValue: 1044682.69,
      totalAvailableWeight: 288.695,
      totalAvailableQuantity: 19,
      totalMeasuredQuantity: 19,
      totalMeasuredValue: 1044682.69,
      totalMeasuredWeight: 288.695,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'ISSUED',
      srcFiscalYear: null,
      destDocDate: null,
      destDocNo: null,
      destLocationCode: 'BEL',
      srcLocationDescription: 'Mumbai Office',
      destLocationDescription: 'Tanishq - Bellary',
      reasonForDelay: null,
      remarks: ''
    };
    const result = StockReceiveStockAdaptor.fromJson(input, typefield);
    expect(result).not.toEqual(expectedResult);
  });

  it('should return the stock having null or zero values', () => {
    const courierDetailsData: StockReceiveCourierDetails = {
      type: null,
      data: null
    };
    const data: any = {
      id: 1408,
      srcDocNo: 5611018,
      srcLocationCode: 'FROW',
      courierDetails: courierDetailsData,
      type: '',
      orderType: 'R',
      courierReceivedDate: null,
      totalAvailableValue: 0,
      totalAvailableWeight: 0,
      totalAvailableQuantity: 0,
      totalMeasuredQuantity: 0,
      totalMeasuredValue: 0,
      totalMeasuredWeight: 0,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'ISSUED',
      srcFiscalYear: null,
      destDocDate: null,
      destDocNo: null,
      destLocationCode: 'BEL',
      srcLocationDescription: 'Mumbai Office',
      destLocationDescription: 'Tanishq - Bellary',
      reasonForDelay: null,
      remarks: ''
    };
    const typefield = '';

    const expected: StockReceiveStock = {
      id: 1408,
      srcDocNo: 5611018,
      srcLocationCode: 'FROW',
      type: '',
      courierDetails: courierDetailsData,
      orderType: 'R',
      courierReceivedDate: null,
      totalAvailableValue: 0,
      totalAvailableWeight: 0,
      totalAvailableQuantity: 0,
      totalMeasuredQuantity: 0,
      totalMeasuredValue: 0,
      totalMeasuredWeight: 0,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'ISSUED',
      srcFiscalYear: null,
      destDocDate: null,
      destDocNo: null,
      destLocationCode: 'BEL',
      srcLocationDescription: 'Mumbai Office',
      destLocationDescription: 'Tanishq - Bellary',
      reasonForDelay: null,
      remarks: ''
    };

    const result = StockReceiveStockAdaptor.fromJson(data, typefield);
    expect(result).not.toEqual(expected);
    expect(result.courierDetails.type).toEqual(expected.courierDetails.type);
    expect(result.courierDetails.data).toEqual(expected.courierDetails.data);
  });

  it('should convert the courier details to lowercase', () => {
    const input: any = {
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
        type: 'COURIER',
        data: {
          lockNumber: '',
          roadPermitNumber: '',
          companyName: 'SEQUEL LOGISTICS',
          docketNumber: '592826558'
        }
      },
      reasonForDelay: null
    };
    const typefield = 'transferType';

    const expectedResult: StockReceiveStock = {
      id: 1408,
      srcDocNo: 5611018,
      srcLocationCode: 'FROW',
      type: input[typefield],
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
      orderType: 'R',
      courierReceivedDate: null,
      totalAvailableValue: 1044682.69,
      totalAvailableWeight: 288.695,
      totalAvailableQuantity: 19,
      totalMeasuredQuantity: 19,
      totalMeasuredValue: 1044682.69,
      totalMeasuredWeight: 288.695,
      srcDocDate: moment(),
      currencyCode: 'INR',
      weightUnit: 'gms',
      status: 'ISSUED',
      srcFiscalYear: null,
      destDocDate: null,
      destDocNo: null,
      destLocationCode: 'BEL',
      srcLocationDescription: 'Mumbai Office',
      destLocationDescription: 'Tanishq - Bellary',
      reasonForDelay: null,
      remarks: ''
    };
    const result = StockReceiveStockAdaptor.fromJson(input, typefield);
    expect(result.courierDetails.type).toEqual(
      expectedResult.courierDetails.type
    );
  });
});
