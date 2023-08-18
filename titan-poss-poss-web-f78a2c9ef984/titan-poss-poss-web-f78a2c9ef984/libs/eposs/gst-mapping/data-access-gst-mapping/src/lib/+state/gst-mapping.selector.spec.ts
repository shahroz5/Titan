import { CustomErrors, GSTMappingDetails, Lov } from '@poss-web/shared/models';
import { initialState } from './gst-mapping.reducer';
import { GSTMappingState } from './gst-mapping.state';
import { GSTMappingSelectors } from './gst-mapping.selector';

describe('Testing GST mapping related Selectors', () => {
  it('Should return the error', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: GSTMappingState = {
      ...initialState,
      error: error
    };
    expect(GSTMappingSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return the gst mapping list', () => {
    const gstMappingList: GSTMappingDetails[] = [
      {
        isActive: true,
        customerTaxType: 'REGISTERED',
        destLocationTaxType: 'L2',
        srcLocationTaxType: 'CFA',
        txnType: 'SERVICE_TAx',
        applicableTax: 'GST',
        destLocationApplicableTax: 'GST',
        isSameState: false,
        srcLocationApplicableTax: 'GST',
        srcTaxApplicable: false,
        id: 'ID'
      }
    ];
    const state: GSTMappingState = {
      ...initialState,
      gstMappingList: gstMappingList
    };
    expect(GSTMappingSelectors.selectGSTMappingList.projector(state)).toEqual(
      gstMappingList
    );
  });

  it('Should return the loading status ', () => {
    const isLoading = true;
    const state: GSTMappingState = {
      ...initialState,
      isLoading: isLoading
    };
    expect(GSTMappingSelectors.selectIsLoading.projector(state)).toEqual(
      isLoading
    );
  });

  it('Should return the tax transaction types ', () => {
    const txnTypes: Lov[] = [
      {
        code: 'TYPE 1',
        value: 'TYPE 1',
        isActive: true
      }
    ];
    const state: GSTMappingState = {
      ...initialState,
      txnTypes: txnTypes
    };
    expect(GSTMappingSelectors.selectTxnTypes.projector(state)).toEqual(
      txnTypes
    );
  });

  it('Should return the reload status ', () => {
    const reloadStatus = {
      reload: true,
      type: 'NEW'
    };
    const state: GSTMappingState = {
      ...initialState,
      reloadStatus: reloadStatus
    };
    expect(GSTMappingSelectors.selectReloadStatus.projector(state)).toEqual(
      reloadStatus
    );
  });

  it('Should return the reload status ', () => {
    const reloadStatus = {
      reload: true,
      type: 'NEW'
    };
    const state: GSTMappingState = {
      ...initialState,
      reloadStatus: reloadStatus
    };
    expect(GSTMappingSelectors.selectReloadStatus.projector(state)).toEqual(
      reloadStatus
    );
  });

  it('Should return the total elements count ', () => {
    const totalElements = 100;
    const state: GSTMappingState = {
      ...initialState,
      totalElements: totalElements
    };
    expect(GSTMappingSelectors.selectTotalElements.projector(state)).toEqual(
      totalElements
    );
  });

  it('Should return the taxes ', () => {
    const taxes = [
      {
        taxCode: 'TAX-1',
        description: 'TAX DESC 1'
      }
    ];
    const state: GSTMappingState = {
      ...initialState,
      taxes: taxes
    };
    expect(GSTMappingSelectors.selectTaxes.projector(state)).toEqual(taxes);
  });
});
