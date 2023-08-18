import {
  CustomErrors,
  PrinterConfigDetails,
  Lov
} from '@poss-web/shared/models';

import {
  PrinterConfigAdapter,
  PrinterConfigEntity
} from './printer-config.entity';
import { PrinterConfigurationState } from './printer-config.state';
import { initialState } from './printer-config.reducers';
import * as selectors from './printer-config.selectors';
import { Moment } from 'moment';

describe('printer config Selector Testing Suite', () => {
 const printerConfigDetails1: PrinterConfigDetails = {
    documentType: '',
    hostname: '',
    locationCode: '',
    printerName: '',
    id: '123',
    isActive: 'true'
  };

  const printerConfigDetails2: PrinterConfigDetails = {
    documentType: '',
    hostname: '',
    locationCode: '',
    printerName: '',
    id: '456',
    isActive: 'true'
  };
  const lov: Lov[] = [{ code: '', isActive: true, value: '' }];

  const printerConfigDetailsArray = [printerConfigDetails1, printerConfigDetails2];

  const addPrinterListToEntities = <T extends PrinterConfigDetails>(
    payload: T[]
  ): { [id: string]: T } => {
    const reducedEntities = payload.reduce(
      (entities: { [id: string]: T }, element: T) => {
        return {
          ...entities,
          [element.id]: element
        };
      },
      {}
    );
    return reducedEntities;
  };

  const printerElements: PrinterConfigEntity = {
    ids: [printerConfigDetails1.id, printerConfigDetails2.id],
    entities: addPrinterListToEntities(printerConfigDetailsArray)
  };


  describe('Testing Printer Config Related selectors', () => {
    it('Should return the error', () => {
      const error: CustomErrors = {
        code: 'ERR_1',
        message: 'Error',
        traceId: 'TraceID',
        timeStamp: '122131',
        error: null
      };
      const state: PrinterConfigurationState = {
        ...initialState,
        hasError: error
      };
      expect(
        selectors.printerConfigurationSelectors.selectHasError.projector(state)
      ).toEqual(error);
    });




    it('Should return selectAccessList', () => {
      // const state: PrinterConfigurationState = {
      //   ...initialState,
      //   accessList: printerElements
      // };
      expect(
        selectors.printerConfigurationSelectors.selectPrinterList.projector(
          printerElements
        )
      ).toEqual(printerConfigDetailsArray);
    });

    it('Should return selectTotalElements', () => {
      const state: PrinterConfigurationState = {
        ...initialState,
        totalCount: 1
      };
      expect(
        selectors.printerConfigurationSelectors.selectTotalElements.projector(
          state
        )
      ).toEqual(1);
    });

    it('should return isLoading selector', () => {
      const state: PrinterConfigurationState = {
        ...initialState,
        isLoading: true
      };
      expect(
        selectors.printerConfigurationSelectors.selectIsLoading.projector(state)
      ).toEqual(true);
    });

    it('should return selectDocTypes selector', () => {
      const state: PrinterConfigurationState = {
        ...initialState,
        docType: lov
      };
      expect(
        selectors.printerConfigurationSelectors.selectDocTypes.projector(state)
      ).toEqual(lov);
    });


    it('should return printerNames selector', () => {
      const state: PrinterConfigurationState = {
        ...initialState,
        printernameList: []
      };
      expect(
        selectors.printerConfigurationSelectors.printerNames.projector(state)
      ).toEqual([]);
    });
  });
});
