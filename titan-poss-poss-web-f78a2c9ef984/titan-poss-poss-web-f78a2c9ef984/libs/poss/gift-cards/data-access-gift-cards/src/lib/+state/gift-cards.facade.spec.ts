import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { GiftCardsFacade } from './gift-cards.facade';
import { GiftCardsState } from './gift-cards.state';

import {
  SetSelectedRSOName,
  SetCardsTotalAmount,
  SetGcTotalPaidAmount,
  SetCardsTotalQty,
  LoadCardsList,
  ResetGiftCardsData,
  CreateGcCashMemo,
  PartiallyUpdateGcCashMemo,
  AddGiftCardItem,
  GetAddedGiftCardItem,
  DeleteAddedGiftCardItem,
  PartiallyUpdateGiftCardItem,
  UpdateGcCashMemo,
  LoadRSODetails,
  LoadCashMemoBillsAvailableForCancellation,
  LoadSelectedGcCashMemoDetails,
  LoadCancelGcCashMemo,
  LoadGcCancellationReasons,
  SetSelectedCancellationReason
} from './gift-cards.actions';
import { AddGiftCardItemPayload } from '@poss-web/shared/models';

describe('Gift cards facade Testing Suite', () => {
  const initialState: GiftCardsState = {
    errors: null,
    isLoading: false,
    selectedRSOName: null,
    cardsTotalAmount: 0,
    gcTotalAmountPaid: 0,
    cardsTotalQty: 0,
    cardsList: [],
    maxAmount: 50000,
    minAmount: 10000,
    gcCashMemoDetails: null,
    partiallyUpdatedGcCmResponse: null,
    addGiftCardItemResponse: null,
    getAddedGiftCardItemResponse: null,
    deleteAddedGiftCardItemResponse: null,
    partiallyUpdateGiftCardItemResponse: null,
    updateGcCashMemoResponse: null,
    rsoDetails: [],
    printDataResponse: null,
    gcCashMemoBillsReadyForCancellation: [],
    selectedGcCashMemoData: null,
    cancelGcCashMemoResponse: null,
    selectedGcCancellationReason: null,
    gcCancellationReasons: [],
    remarks: '',
    orderNumber: null,
    gcBalance: null,
    gcHistoryListItems: null,
    gcHistoryTotalElements: null,
    historySearchParameter: null
  };

  let giftCardsFacade: GiftCardsFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), GiftCardsFacade]
    });

    giftCardsFacade = TestBed.inject(GiftCardsFacade);
  });

  describe('Cards Total Amount', () => {
    it('should dispatch set CardsTotalAmount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalAmount = 22345;
      const expectedAction = new SetCardsTotalAmount(totalAmount);
      giftCardsFacade.setCardsTotalAmount(totalAmount);
      giftCardsFacade.getTotalCardsAmount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Cards Total Qty', () => {
    it('should dispatch set CardsTotalQty action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalQty = 3;
      const expectedAction = new SetCardsTotalQty(totalQty);
      giftCardsFacade.setCardsTotalQty(totalQty);
      giftCardsFacade.getTotalCardsQty();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Cards Total Qty', () => {
    it('should dispatch set CardsTotalQty action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalQty = 3;
      const expectedAction = new SetCardsTotalQty(totalQty);
      giftCardsFacade.setCardsTotalQty(totalQty);
      giftCardsFacade.getTotalCardsQty();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('GC Total Paid Amount', () => {
    it('should dispatch setGcTotalPaidAmount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const totalPaidAmount = 3000;
      const expectedAction = new SetGcTotalPaidAmount(totalPaidAmount);
      giftCardsFacade.setGcTotalPaidAmount(totalPaidAmount);
      giftCardsFacade.getGcTotalPaidAmount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Cards List', () => {
    it('should dispatch load CardsList action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const cardsList = [
        {
          cardNo: '24223532532',
          bin: 'QCGC',
          amount: 5000,
          tax: 0,
          finalPrice: 0,
          itemId: 'sfs4sds-fsfsdfw3'
        }
      ];
      const expectedAction = new LoadCardsList(cardsList);
      giftCardsFacade.loadCardsList(cardsList);
      giftCardsFacade.getCardsList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Selected SO Name', () => {
    it('should dispatch load SelectedSOName action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const selectedSOName = { value: 'SO Name 1', description: 'SO Name 2' };
      const expectedAction = new SetSelectedRSOName(selectedSOName);
      giftCardsFacade.loadSelectedRSOName(selectedSOName);
      giftCardsFacade.getSelectedRSONames();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Reset GC details', () => {
    it('should dispatch ResetGiftCardsData action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetGiftCardsData();
      giftCardsFacade.resetGiftCardsData();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));

    describe('Reset GC details', () => {
      it('should dispatch ResetGiftCardsData action', inject([Store], store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetGiftCardsData();
        giftCardsFacade.resetGiftCardsData();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }));
    });

    describe('get Error', () => {
      it('should get stored error', () => {
        expect(giftCardsFacade.getError()).toBeTruthy();
      });
    });

    describe('is Loading', () => {
      it('should get if isLoading is there', () => {
        expect(giftCardsFacade.getIsLoading()).toBeTruthy();
      });
    });
  });

  describe('Create Gc Cash Memo', () => {
    it('should dispatch CreateGcCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new CreateGcCashMemo();
      giftCardsFacade.createGcCashMemo();
      expect(giftCardsFacade.getGcCashMemoDetails()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('partiallyUpdateGcCashMemo', () => {
    it('should dispatch partiallyUpdateGcCashMemo action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new PartiallyUpdateGcCashMemo('123456', {
          customerId: 625
        });
        giftCardsFacade.partiallyUpdateGcCashMemo('123456', {
          customerId: 625
        });
        expect(giftCardsFacade.getPartiallyUpdatedGcCmResponse()).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('addGiftCardItem', () => {
    it('should dispatch addGiftCardItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestPayload: AddGiftCardItemPayload = {
        finalValue: 1000,
        instrumentNo: '12345678900987654321123456',
        rowId: 0,
        totalTax: 0,
        totalValue: 1000
      };
      const expectedAction = new AddGiftCardItem('123456', requestPayload);
      giftCardsFacade.addGiftCardItem('123456', requestPayload);
      expect(giftCardsFacade.getAddGiftCardItemResponse()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('getAddedGiftCardItem', () => {
    it('should dispatch getAddedGiftCardItem action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new GetAddedGiftCardItem('123456', '23456');
      giftCardsFacade.getAddedGiftCardItem('123456', '23456');
      expect(giftCardsFacade.getAddedGiftCardItemResponse()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('deleteAddedGiftCardItem', () => {
    it('should dispatch deleteAddedGiftCardItem action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new DeleteAddedGiftCardItem('123456', '23456');
        giftCardsFacade.deleteAddedGiftCardItem('123456', '23456');
        expect(
          giftCardsFacade.getDeleteAddedGiftCardItemResponse()
        ).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('partiallyUpdateGiftCardItem', () => {
    it('should dispatch partiallyUpdateGiftCardItem action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const requestPayload = {
          finalValue: 1000,
          totalTax: 0,
          totalValue: 1000
        };
        const expectedAction = new PartiallyUpdateGiftCardItem(
          '123456',
          '23456',
          requestPayload
        );
        giftCardsFacade.partiallyUpdateGiftCardItem(
          '123456',
          '23456',
          requestPayload
        );
        expect(
          giftCardsFacade.getPartiallyUpdateGiftCardItemResponse()
        ).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('updateGcCashMemo', () => {
    it('should dispatch updateGcCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestDetails = {
        customerId: 625,
        finalValue: 1000,
        remarks: 'Some remarks',
        totalDiscount: 0,
        totalQuantity: 1,
        totalTax: 0,
        totalValue: 1000,
        paidValue: 1000,
        totalWeight: 0
      };
      const expectedAction = new UpdateGcCashMemo('123456', requestDetails);
      giftCardsFacade.updateGcCashMemo('123456', requestDetails);
      expect(giftCardsFacade.getUpdateGcCashMemoResponse()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadRsoDetails', () => {
    it('should dispatch loadRsoDetails action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const roleCode = 'RSO';
      const expectedAction = new LoadRSODetails(roleCode);
      giftCardsFacade.loadRsoDetails(roleCode);
      expect(giftCardsFacade.getRsoDetails()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadGcCashMemoAvailableForCancellation', () => {
    it('should dispatch LoadCashMemoBillsAvailableForCancellation action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadCashMemoBillsAvailableForCancellation(
          '9876543210',
          65
        );
        giftCardsFacade.loadGcCashMemoAvailableForCancellation(
          '9876543210',
          65
        );
        expect(
          giftCardsFacade.getCashMemoAvailableForCancellation()
        ).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadSelectedGcCashMemoDetails', () => {
    it('should dispatch LoadSelectedGcCashMemoDetails action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadSelectedGcCashMemoDetails('12345678');
        giftCardsFacade.loadSelectedGcCashMemoDetails('12345678');
        expect(giftCardsFacade.getSelectedGcCashMemoDetails()).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadCancelGcCashMemo', () => {
    it('should dispatch LoadCancelGcCashMemo action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const requestBody = {
        cancelType: '',
        reasonForCancellation: '',
        refTxnId: '',
        remarks: '',
        employeeCode: ''
      };
      const expectedAction = new LoadCancelGcCashMemo(requestBody);
      giftCardsFacade.loadCancelGcCashMemo(requestBody);
      expect(giftCardsFacade.getGcCashMemoCancelResponse()).toBeTruthy();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('loadGcCancellationReasons', () => {
    it('should dispatch LoadGcCancellationReasons action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadGcCancellationReasons();
        giftCardsFacade.loadGcCancellationReasons();
        expect(giftCardsFacade.getGcCancellationReasons()).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('setSelectedCancellationReason', () => {
    it('should dispatch SetSelectedCancellationReason action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new SetSelectedCancellationReason('Reason 1');
        giftCardsFacade.setSelectedCancellationReason('Reason 1');
        expect(giftCardsFacade.getSelectedCancellationReason()).toBeTruthy();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Max and Min amount', () => {
    it('should get Max and min amount', () => {
      giftCardsFacade.getMaxAmount();
      giftCardsFacade.getMinAmount();
    });
  });
});
