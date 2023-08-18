import { CustomErrors } from '@poss-web/shared/models';
import { initialState } from './cut-piece-config.reducer';
import { CutPieceConfigSelectors } from './cut-piece-config.selectors';
import { CutPieceConfigState } from './cut-piece-config.state';

describe('CutPieceConfig Selector Testing Suite', () => {
  it('Should return the error ', () => {
    const error: CustomErrors = {
      code: 'ERR_1',
      message: 'Error',
      traceId: 'TraceID',
      timeStamp: '122131',
      error: null
    };
    const state: CutPieceConfigState = {
      ...initialState,
      error: error
    };
    expect(CutPieceConfigSelectors.selectError.projector(state)).toEqual(error);
  });

  it('Should return the isloading ', () => {
    const state: CutPieceConfigState = {
      ...initialState,
      isLoading: true
    };
    expect(CutPieceConfigSelectors.selectIsLoading.projector(state)).toEqual(
      true
    );
  });

  it('Should return the configId ', () => {
    const state: CutPieceConfigState = {
      ...initialState,
      configId: 'abc123'
    };
    expect(CutPieceConfigSelectors.selectConfigId.projector(state)).toEqual(
      'abc123'
    );
  });

  it('Should return the hassaved ', () => {
    const state: CutPieceConfigState = {
      ...initialState,
      hasSaved: true
    };
    expect(CutPieceConfigSelectors.selectHasSaved.projector(state)).toEqual(
      true
    );
  });

  it('Should return the totalElements ', () => {
    const state: CutPieceConfigState = {
      ...initialState,
      totalElements: 1
    };
    expect(
      CutPieceConfigSelectors.selectTotalElements.projector(state)
    ).toEqual(1);
  });

  it('Should return the cutPieceConfigList ', () => {
    const response = [
      {
        cutPieceTepPercent: 12,
        productCategoryCode: 'I',
        id: 'abc123',
        description: 'abc123'
      }
    ];
    const state: CutPieceConfigState = {
      ...initialState,
      cutPieceConfigList: response
    };
    expect(
      CutPieceConfigSelectors.selectCutPieceConfigList.projector(state)
    ).toEqual(response);
  });

  it('Should return the product categories ', () => {
    const response = [
      {
        description: 'abc123',
        productCategoryCode: 'I',
        isActive: true
      }
    ];
    const state: CutPieceConfigState = {
      ...initialState,
      productCategories: response
    };
    expect(
      CutPieceConfigSelectors.selectProductCategories.projector(state)
    ).toEqual(response);
  });
});
