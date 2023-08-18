import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TepFacade } from './direct-tep.facade';
import { TepState } from './direct-tep.state';

import {
  AddTepItem,
  CancelRequest,
  CancelTEPRequest,
  ConfirmTep,
  ConfirmTepRequest,
  CreateOpenTepTransaction,
  DeleteTepItem,
  DeleteTepItemSuccess,
  DeleteTepTransactionDetails,
  FileApprovalMailDownloadUrl,
  FileCancelledChequeDownloadUrl,
  FileIdProofDownloadUrl,
  FileUpload,
  GetTepCashMemoItemList,
  GetTepCashMemoItemListSuccess,
  GetTepItemConfiguration,
  GetTepItemConfigurationSuccess,
  GetTepItemExceptionConfiguration,
  LoadAvailableDiscountsListSuccess,
  LoadCmListItemTepConfiguration,
  LoadCmListItemTepConfigurationSuccess,
  LoadFtepReasons,
  LoadGoldPlusLocations,
  LoadRsoList,
  LoadStuddedProductDetails,
  LoadTepItemCodeDetails,
  LoadTepItemDetails,
  LoadTepItemPriceDetails,
  LoadTepItemPriceDetailsSuccess,
  LoadTepTransactionDetails,
  LoadWorkflowDeatils,
  ResetTep,
  SelectedPaymentMethod,
  SelectedTepType,
  SetCutPieceTotalQty,
  SetCutPieceTotalValue,
  SetHoldTransactionMetalRates,
  SetIsRefundFormValid,
  SetIsRequestRaisingScenario,
  SetRemarks,
  SetSelectedRsoName,
  SetTepItemProductCode,
  SetTotalExchangeAmt,
  SetTotalGrossWt,
  SetTotalQty,
  UpdateOpenTepTransaction,
  UpdateTepItem,
  UpdateTepItemPriceDetails,
  UpdateTepTransactionPriceDetails
} from './direct-tep.actions';
import {
  AddTepItemRequestPayload,
  ConfirmOrHoldTepRequestPayload,
  CreateTepTypesEnum,
  GetTepPriceDetailsRequestPayload,
  PartialUpdateAdvanceRequestPayload,
  PatchTepRequestPayload,
  TepStatusEnum,
  UpdateTepItemRequestPayload
} from '@poss-web/shared/models';

describe('TEP Facade Testing Suite', () => {
  const initialState: TepState = {
    errors: null,
    isLoading: false,
    isOpenTaskLoading: false,
    selectedRsoName: null,
    isLoadingPriceUpdate: false,
    selectedCmItem: null,
    createOpenTepTransactionResponse: null,
    updateOpenTepTransactionResponse: null,
    tepItemConfiguratonResponse: null,
    tepCashMemoResponseItemList: null,
    tepPriceDetailsResponse: null,
    addTepItemResponse: null,
    updateTepItemResponse: null,
    confirmTepItemResponse: null,
    deleteTepItemResponse: null,
    rsoList: [],
    cancelResponse: null,
    cancelTEPResponse: null,
    UpdatePriceDetailsResponse: null,
    remarks: '',
    totalQty: 0,
    totalGrossWt: 0,
    selectedData: null,
    totalExchangeAmt: 0,
    selectedPaymentMethod: null,
    selectedTepType: null,
    scannedTepItemCode: null,
    viewTepTransactionResponse: null,
    viewTepItemResponse: null,
    deleteTepTransactionResponse: null,
    tepItemCutPieceDetailsResponse: null,
    cutPieceTotalQty: 0,
    cutPieceTotalValue: 0,
    cmListItemTepConfigurationResponse: null,
    isRefundFormValid: false,
    isRequestRaisingScenario: false,
    goldPlusLocations: [],
    uploadFileResponse: false,
    downloadIdProofFileUrl: null,
    downloadCancelledChequeFileUrl: null,
    downloadApprovalMailFileUrl: null,
    fvtReasons: [],
    updateTepTransactionPriceDetailsResponse: null,

    createOpenCutPieceTepTransactionResponse: null,
    patchCutPieceTepTransactionResponse: null,
    addCutPieceTepItemResponse: null,
    patchCutPieceTepItemResponse: null,
    confirmCutPieceTepItemResponse: null,
    availableDiscountsList: null
  };

  let tepFacade: TepFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), TepFacade]
    });

    tepFacade = TestBed.inject(TepFacade);
  });

  describe('Create open Tep Transaction', () => {
    it('should dispatch createOpenTepTransaction action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new CreateOpenTepTransaction(
          CreateTepTypesEnum.REGULAR_TEP,
          {}
        );
        tepFacade.createOpenTepTransaction(CreateTepTypesEnum.REGULAR_TEP, {});
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getCreateOpenTepTransactionResponse();
      }
    ));
  });

  describe('updateOpenTepTransaction', () => {
    it('should dispatch UpdateOpenTepTransaction action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const requestPayload: PatchTepRequestPayload = {
          customerId: 621
        };
        const expectedAction = new UpdateOpenTepTransaction(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP,
          requestPayload
        );
        tepFacade.updateOpenTepTransaction(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP,
          requestPayload
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getUpdateOpenTepTransactionResponse();
        tepFacade.getIsLoading();
        tepFacade.getError();
        tepFacade.getIsOpenTaskLoading();
      }
    ));
  });

  describe('loadTepItemConfiguration', () => {
    it('should dispatch GetTepItemConfiguration action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetTepItemConfiguration(
          '502218HDSAAA00',
          CreateTepTypesEnum.REGULAR_TEP,
          false,
          '8445678909'
        );
        tepFacade.loadTepItemConfiguration(
          '502218HDSAAA00',
          CreateTepTypesEnum.REGULAR_TEP,
          false,
          '8445678909'
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepItemConfiguratonResponse();
      }
    ));
  });

  describe('loadTepCashMemoItemList', () => {
    it('should dispatch GetTepCashMemoItemList action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetTepCashMemoItemList(
          'CPD',
          '258',
          '2020',
          CreateTepTypesEnum.REGULAR_TEP,
          '8445678909'
        );
        tepFacade.loadTepCashMemoItemList(
          'CPD',
          '258',
          '2020',
          CreateTepTypesEnum.REGULAR_TEP,
          '8445678909'
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepCashMemoResponseItemList();
      }
    ));
  });

  describe('loadTepItemPriceDetails', () => {
    it('should dispatch LoadTepItemPriceDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const requestPayload: GetTepPriceDetailsRequestPayload = {
          itemCode: '',
          standardPrice: null,
          tepType: ''
        };
        const expectedAction = new LoadTepItemPriceDetails(requestPayload);
        tepFacade.loadTepItemPriceDetails(requestPayload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepPriceDetailsResponse();
      }
    ));
  });

  describe('addTepItem', () => {
    it('should dispatch AddTepItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestPayload: AddTepItemRequestPayload = {
        finalValue: 1000,
        totalValue: 1000,
        itemCode: '',
        quantity: 1
      };
      const expectedAction = new AddTepItem(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      tepFacade.addTepItem(
        '1234-abcd',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getAddTepItemResponse();
    }));
  });

  describe('updateTepItem', () => {
    it('should dispatch UpdateTepItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestPayload: UpdateTepItemRequestPayload = {
        finalValue: 1000,
        isSaleable: true,
        quantity: 1,
        stonesDetails: [],
        totalValue: 1000,
        totalWeight: 1,
        unitValue: 1000,
        unitWeight: 1
      };
      const expectedAction = new UpdateTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      tepFacade.updateTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        requestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getUpdateTepItemResponse();
    }));
  });

  describe('confirmTep', () => {
    it('should dispatch ConfirmTep action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const confirmOrHoldTepRequestPayload: ConfirmOrHoldTepRequestPayload = {
        customerId: 621,
        employeeCode: 'rsocpd',
        exchangeDetails: {
          data: {},
          type: ''
        },
        metalRateList: {
          metalRates: null
        },
        remarks: '',
        totalQuantity: 1,
        totalTax: 100,
        totalValue: 1000,
        totalWeight: 1
      };
      const expectedAction = new ConfirmTep(
        '1234-abcd',
        TepStatusEnum.CONFIRMED,
        CreateTepTypesEnum.REGULAR_TEP,
        confirmOrHoldTepRequestPayload
      );
      tepFacade.confirmTep(
        '1234-abcd',
        TepStatusEnum.CONFIRMED,
        CreateTepTypesEnum.REGULAR_TEP,
        confirmOrHoldTepRequestPayload
      );
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getConfirmTepItemResponse();
    }));
  });

  describe('DeleteTepItem', () => {
    it('should dispatch DeleteTepItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      tepFacade.DeleteTepItem(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP
      );
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getDeleteTepItemResponse();
    }));
  });

  describe('LoadRsoList', () => {
    it('should dispatch LoadRsoList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRsoList('RSO');
      tepFacade.LoadRsoList('RSO');
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getRsoList();
    }));
  });

  describe('LoadTepItemProductCodeDetail', () => {
    it('should dispatch LoadTepItemCodeDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTepItemCodeDetails('512ERFDG3456');
        tepFacade.LoadTepItemProductCodeDetail('512ERFDG3456');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepItemProductCodeDetail();
      }
    ));
  });

  describe('SetRemarks', () => {
    it('should dispatch SetRemarks action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetRemarks('Remarks');
      tepFacade.SetRemarks('Remarks');
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getRemarks();
    }));
  });

  describe('SetTotalQty', () => {
    it('should dispatch SetRemarks action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetTotalQty(10);
      tepFacade.SetTotalQty(10);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getTotalQty();
    }));
  });

  describe('SetTotalGrossWt', () => {
    it('should dispatch SetTotalGrossWt action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetTotalGrossWt(10);
      tepFacade.SetTotalGrossWt(10);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getTotalGrossWt();
    }));
  });

  describe('SetTotalExchangeAmt', () => {
    it('should dispatch SetTotalExchangeAmt action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetTotalExchangeAmt(1000);
      tepFacade.SetTotalExchangeAmt(1000);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getTotalExchangeAmt();
    }));
  });

  describe('SetPaymentMethod', () => {
    it('should dispatch SelectedPaymentMethod action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SelectedPaymentMethod('CN');
        tepFacade.SetPaymentMethod('CN');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getSelectedPaymentMethod();
      }
    ));
  });

  describe('SetTepType', () => {
    it('should dispatch SelectedTepType action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SelectedTepType(
        CreateTepTypesEnum.FULL_VALUE_TEP
      );
      tepFacade.SetTepType(CreateTepTypesEnum.FULL_VALUE_TEP);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getSelectedTepType();
    }));
  });

  describe('SetSelectedRsoName', () => {
    it('should dispatch SetSelectedRsoName action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetSelectedRsoName({
        value: 'rsocpd',
        description: 'rsocpd'
      });
      tepFacade.SetSelectedRsoName({ value: 'rsocpd', description: 'rsocpd' });
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getSelectedRsoName();
    }));
  });

  describe('SetTepItemProductCode', () => {
    it('should dispatch SetTepItemProductCode action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetTepItemProductCode('');
        tepFacade.SetTepItemProductCode('');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepItemProductCodeDetail();
      }
    ));
  });

  describe('resetTepItemValuationDetails', () => {
    it('should dispatch resetTepItemValuationDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTepItemPriceDetailsSuccess(null);
        tepFacade.resetTepItemValuationDetails(null);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('resetTepCmItemList', () => {
    it('should dispatch resetTepCmItemList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GetTepCashMemoItemListSuccess(null);
      tepFacade.resetTepCmItemList(null);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadTepTransactionDetails', () => {
    it('should dispatch LoadTepTransactionDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadTepTransactionDetails(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP
        );
        tepFacade.loadTepTransactionDetails(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getTepTransactionDetails();
      }
    ));
  });

  describe('deleteTepTransactionDetails', () => {
    it('should dispatch DeleteTepTransactionDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteTepTransactionDetails(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP
        );
        tepFacade.deleteTepTransactionDetails(
          '1234-abcd',
          CreateTepTypesEnum.REGULAR_TEP
        );
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getDeleteTepTransactionResponse();
      }
    ));
  });

  describe('loadTepItemDetails', () => {
    it('should dispatch LoadTepItemDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      tepFacade.loadTepItemDetails(
        '1234-abcd',
        '1234-abcd-efgh',
        CreateTepTypesEnum.REGULAR_TEP,
        CreateTepTypesEnum.REGULAR_TEP,
        '8970890890'
      );
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getTepItemDetails();
    }));
  });

  describe('loadGoldPlusLocations', () => {
    it('should dispatch LoadGoldPlusLocations action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadGoldPlusLocations();
        tepFacade.loadGoldPlusLocations();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getGoldPlusLocations();
      }
    ));
  });

  describe('resetTep', () => {
    it('should dispatch ResetTep action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetTep();
      tepFacade.resetTep();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('SetCutPieceTotalQty', () => {
    it('should dispatch SetCutPieceTotalQty action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetCutPieceTotalQty(1);
      tepFacade.SetCutPieceTotalQty(1);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getCutPieceTotalQty();
    }));
  });

  describe('SetCutPieceTotalValue', () => {
    it('should dispatch SetCutPieceTotalValue action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetCutPieceTotalValue(1000);
        tepFacade.SetCutPieceTotalValue(1000);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getCutPieceTotalValue();
      }
    ));
  });

  describe('loadCmListItemTepConfiguration', () => {
    it('should dispatch LoadCmListItemTepConfiguration action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCmListItemTepConfiguration(
          '',
          '',
          false,
          ''
        );
        tepFacade.loadCmListItemTepConfiguration('', '', false, '');
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getCmListItemTepConfiguration();
      }
    ));
  });

  describe('setIsRefundFormValid', () => {
    it('should dispatch SetIsRefundFormValid action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SetIsRefundFormValid(true);
      tepFacade.setIsRefundFormValid(true);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      tepFacade.getIsRefundFormValid();
    }));
  });

  describe('setIsRequestRaisingScenario', () => {
    it('should dispatch SetIsRequestRaisingScenario action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetIsRequestRaisingScenario(true);
        tepFacade.setIsRequestRaisingScenario(true);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        tepFacade.getIsRequestRaising();
      }
    ));
  });

  describe('clearDeleteTepItemResponse', () => {
    it('should dispatch SetIsRequestRaisingScenario action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteTepItemSuccess(null);
        tepFacade.clearDeleteTepItemResponse();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('clearCmListItemTepConfiguration', () => {
    it('should dispatch LoadCmListItemTepConfigurationSuccess action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCmListItemTepConfigurationSuccess(null);
        tepFacade.clearCmListItemTepConfiguration();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('clearTepItemConfiguration', () => {
    it('should dispatch GetTepItemConfigurationSuccess action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetTepItemConfigurationSuccess(null);
        tepFacade.clearTepItemConfiguration();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadFvtReasons', () => {
    it('should dispatch LoadFtepReasons action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadFtepReasons();
        tepFacade.loadFvtReasons()
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadStuddedProductDetails', () => {
    it('should dispatch LoadStuddedProductDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadStuddedProductDetails('s', 'TEP');
        tepFacade.loadStuddedProductDetails('s', 'TEP')
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadTepItemExceptionConfiguration', () => {
    it('should dispatch GetTepItemExceptionConfiguration action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new GetTepItemExceptionConfiguration('s', 'TEP');
        tepFacade.loadTepItemExceptionConfiguration('s', 'TEP')
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('updateItemPriceDetails', () => {
    it('should dispatch updateItemPriceDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new UpdateTepItemPriceDetails({} as any);
        tepFacade.updateItemPriceDetails({} as any)
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));

    describe('loadFileUpload', () => {
      it('should dispatch FileUpload action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new FileUpload({} as any);
          tepFacade.loadFileUpload({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('loadFileIdProofDownloadUrl', () => {
      it('should dispatch FileIdProofDownloadUrl action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new FileIdProofDownloadUrl({} as any);
          tepFacade.loadFileIdProofDownloadUrl({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('loadFileCancelledChequeDownloadUrl', () => {
      it('should dispatch FileIdProofDownloadUrl action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new FileCancelledChequeDownloadUrl({} as any);
          tepFacade.loadFileCancelledChequeDownloadUrl({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('loadFileApprovalMailDownloadUrl', () => {
      it('should dispatch FileApprovalMailDownloadUrl action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new FileApprovalMailDownloadUrl({} as any);
          tepFacade.loadFileApprovalMailDownloadUrl({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('cancel', () => {
      it('should dispatch CancelRequest action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new CancelRequest('ac', 'ab');
          tepFacade.cancel('ac', 'ab')
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('cancelTEP', () => {
      it('should dispatch FileApprovalMailDownloadUrl action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new CancelTEPRequest({} as any);
          tepFacade.cancelTEP({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('confirmRequestTep', () => {
      it('should dispatch confirmRequestTep action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new ConfirmTepRequest('a', 'abc', 'TEP', {} as any);
          tepFacade.confirmRequestTep('a', 'abc', 'TEP', {} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('updateTepTransactionPriceDetails', () => {
      it('should dispatch confirmRequestTep action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new UpdateTepTransactionPriceDetails('a', 'abc');
          tepFacade.updateTepTransactionPriceDetails('a', 'abc')
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('setHoldTransactionMetalRates', () => {
      it('should dispatch SetHoldTransactionMetalRates action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new SetHoldTransactionMetalRates('a');
          tepFacade.setHoldTransactionMetalRates('a')
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('loadworkflowProcessDetails', () => {
      it('should dispatch SetHoldTransactionMetalRates action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new LoadWorkflowDeatils({} as any);
          tepFacade.loadworkflowProcessDetails({} as any)
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });

    describe('resetAvailableDiscountsList', () => {
      it('should dispatch LoadAvailableDiscountsListSuccess action', inject(
        [Store],
        store => {
          const storeSpy = spyOn(store, 'dispatch').and.callThrough();
          const expectedAction = new LoadAvailableDiscountsListSuccess(null);
          tepFacade.resetAvailableDiscountsList();
          expect(storeSpy).toHaveBeenCalledWith(expectedAction);
        }
      ));
    });


  });
});
