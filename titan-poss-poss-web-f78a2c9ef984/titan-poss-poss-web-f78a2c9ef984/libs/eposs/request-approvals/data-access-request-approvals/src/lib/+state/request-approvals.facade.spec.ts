import { Store } from '@ngrx/store';

import { TestBed, inject } from '@angular/core/testing';
import { RequestApprovalsFacade } from './request-approvals.facade';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  ibtRequestAdapter,
  itemAdapter,
  ibtRequestItemAdapter
} from './request-approvals.entity';
import * as moment from 'moment';
import {
  SelectedStockPayload,
  LoadBinRequestApprovalsCount,
  LoadIBTRequestApprovalsCount,
  LoadIBTCancelRequestApprovalsCount,
  LoadIBTRequestApprovalsItemsCount,
  LoadStuddedProductGroups,
  LoadLocationCount,
  ResetBinRequestApprovals,
  ResetBinRequestApprovalsCount,
  ResetIBTRequestApprovals,
  ResetIBTRequestApprovalsCount,
  ResetFOCRequestApprovals,
  ResetFOCRequestApprovalsCount,
  ResetADJRequestApprovals,
  ResetADJRequestApprovalsCount,
  ResetLOSSRequestApprovals,
  ResetLOSSRequestApprovalsCount,
  ResetLOANRequestApprovals,
  ResetLOANRequestApprovalsCount,
  ResetEXHRequestApprovals,
  ResetEXHRequestApprovalsCount,
  ResetPSVRequestApprovals,
  ResetPSVRequestApprovalsCount,
  ResetRequestApprovalsItems,
  ResetError,
  ResetStatus,
  ResetRequestApprovalsItemsCount,
  LoadBinRequestApprovals,
  LoadLocation,
  UpdateBinRequestApprovals,
  UpdateIBTRequestApprovals,
  IBTRequest,
  IBTCancelRequest,
  SearchClear,
  LoadItemsTotalCount,
  LoadIBtRequest,
  LoadIBtCancellationRequest,
  LoadFOCRequest,
  LoadPSVRequest,
  LoadEXHRequest,
  LoadLOSSRequest,
  ClearPSVRequest,
  ClearFOCRequest,
  ClearLOSSRequest,
  ClearLOANRequest,
  ClearADJRequest,
  ClearExhRequest,
  ClearIbtSearchItems,
  LoadLOANRequest,
  LoadADJRequest,
  LoadIbtRequestApprovals,
  LoadIbtCancelRequestItemsApprovals,
  LoadSelectedRequest,
  LoadSelectedCancelRequest,
  ClearItemList
} from './request-approvals.actions';
import { RequestApprovalsState } from './request-approvals.state';
describe('Request Approval facade Testing Suite', () => {
  const initialState: RequestApprovalsState = {
    binRequestApprovalsItem: itemAdapter.getInitialState(),
    binRequestItemsCount: 0,
    ibtRequestItemsCount: 0,
    isbinRequestItemsLoading: false,
    isLoading: false,
    error: null,
    isibtRequestCancelItemsLoading: false,
    hasUpdatingFailure: null,
    isBinRequestItemsCountReset: false,
    isBinRequestItemsReset: false,
    isIbtRequestItemsCountReset: false,
    isIbtRequestItemsReset: false,
    binRequestApproval: null,
    isUpdatingItemSuccess: false,
    isCancelUpdatingSuccess: false,
    ibtCancelUpdateRequest: null,
    hasUpadatingCancelApprovalsFailure: null,
    ibtCancelRequestItemsListCount: null,
    ibtCancelItems: ibtRequestItemAdapter.getInitialState(),

    locationCount: 0,
    isLocationLoading: false,
    location: [],
    ibtRequest: ibtRequestAdapter.getInitialState(),
    ibtCancellationRequest: ibtRequestAdapter.getInitialState(),
    isLoadingIbtCancellationRequest: false,
    searchIbtCancellationRequestResults: ibtRequestAdapter.getInitialState(),
    isSearchingCancellationIbtRequest: false,
    hasSearchCancellationIbtRequest: false,
    isLoadingIbtRequest: false,
    isSearchingIbtRequest: false,
    searchIbtRequestResults: ibtRequestAdapter.getInitialState(),
    hasSearchIbtRequest: null,
    selectedRequest: null,
    isLoadingSelectedStock: false,
    ibtCancelRequestItemsCount: 0,
    isIbtCancelRequestItemsCountReset: false,
    isIbtCancelRequestItemsReset: false,
    selectedCancelRequest: null,
    isLoadingSelectedCancelStock: false,

    adjRequest: ibtRequestAdapter.getInitialState(),
    isLoadingadjRequest: false,
    adjRequestItemsCount: 0,
    isadjRequestItemsCountReset: false,
    isadjRequestItemsReset: false,
    selectedAdjRequest: null,
    isLoadingSelectedAdjStock: false,

    lossRequest: ibtRequestAdapter.getInitialState(),
    isLoadinglossequest: false,
    lossRequestItemsCount: 0,
    islossRequestItemsCountReset: false,
    islossRequestItemsReset: false,
    selectedlossRequest: null,
    isLoadingSelectedlossStock: false,

    loanRequest: ibtRequestAdapter.getInitialState(),
    isLoadingloanRequest: false,
    loanRequestItemsCount: 0,
    isloanRequestItemsCountReset: false,
    isloanRequestItemsReset: false,
    selectedloanRequest: null,
    isLoadingSelectedloanStock: false,

    psvRequest: ibtRequestAdapter.getInitialState(),
    isLoadingpsvRequest: false,
    psvRequestItemsCount: 0,
    ispsvRequestItemsCountReset: false,
    ispsvRequestItemsReset: false,
    selectedpsvRequest: null,
    isLoadingSelectedpsvStock: false,

    exhRequest: ibtRequestAdapter.getInitialState(),
    isLoadingexhRequest: false,
    exhRequestItemsCount: 0,
    isexhRequestItemsCountReset: false,
    isexhRequestItemsReset: false,
    selectedexhRequest: null,
    isLoadingSelectedexhStock: false,

    focRequest: ibtRequestAdapter.getInitialState(),
    isLoadingfocRequest: false,
    focRequestItemsCount: 0,
    isfocRequestItemsCountReset: false,
    isfocRequestItemsReset: false,
    selectedfocRequest: null,
    isLoadingSelectedfocStock: false,

    ibtRequestApprovalsItem: ibtRequestItemAdapter.getInitialState(),
    ibtRequestApprovalsItemsCount: 0,
    isibtRequestItemsLoading: false,
    ibtRequestApproval: null,
    hasUpdatingIbtFailure: null,
    isUpdatingIbtSuccess: false,
    isUpdatingSuccess: false,
    hasUpadatingApprovalsFailure: null,
    ibtUpdateRequest: null,
    selectedItems: ibtRequestItemAdapter.getInitialState(),

    otherIssuesCount: 0,

    isRequestItemsReset: false,
    isRequestItemsCountReset: false,
    studdedProductGroups: []
  };

  let facade: RequestApprovalsFacade;
  /*
 | LoadPendingFactorySTN
  | LoadPendingFactorySTNSuccess
  | LoadPendingFactorySTNFailure
*/

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), RequestApprovalsFacade]
    });

    facade = TestBed.inject(RequestApprovalsFacade);
  });

  describe(' bin request item', () => {
    it('should bin request  item action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadBinRequestApprovalsCount();

      facade.loadbinRequestApprovalsItemCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  loadibtCancelCount', () => {
    it('should dispatch  loadibtCancelCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIBTRequestApprovalsCount();

      facade.loadibtRequestApprovalsItemCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  loadibtCancelCount(', () => {
    it('should dispatch  loadibtCancelCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIBTCancelRequestApprovalsCount();

      facade.loadibtCancelCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' Pending Factory STN', () => {
    it('should dispatch load pending factory stn action', inject(
      [Store],
      store => {
        const payload = null;
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadIBTRequestApprovalsItemsCount(null);

        facade.loadIbtRequestApprovalsItemsCount(payload);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' LoadStuddedProductGroups', () => {
    it('should dispatch LoadStuddedProductGroups action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadStuddedProductGroups();

        facade.loadStuddedProductGroups();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('loadLocationCount', () => {
    it('should dispatch loadLocationCount action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLocationCount();

      facade.loadLocationCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('ResetBinRequestApprovals', () => {
    it('should dispatch ResetBinRequestApprovals action', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetBinRequestApprovals();

        facade.resetBinRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('ResetBinRequestApprovalsCount', () => {
    it('should dispatch load ResetBinRequestApprovalsCount', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetBinRequestApprovalsCount();

        facade.resetBinRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('ResetBinRequestApprovalsCount', () => {
    it('should dispatch load ResetBinRequestApprovalsCount', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetBinRequestApprovalsCount();

        facade.resetBinRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('ResetIBTRequestApprovals()', () => {
    it('should dispatch load ResetIBTRequestApprovals()', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetIBTRequestApprovals();

        facade.resetIbtRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe(' resetIbtRequestApprovalsCount()', () => {
    it('should dispatch load  resetIbtRequestApprovalsCount()', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetIBTRequestApprovalsCount();

        facade.resetIbtRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('  resetFocRequestApprovals()', () => {
    it('should dispatch load   resetFocRequestApprovals()', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetFOCRequestApprovals();

        facade.resetFocRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('  resetFocRequestApprovalsCount() ', () => {
    it('should dispatch load    resetFocRequestApprovalsCount() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetFOCRequestApprovalsCount();

        facade.resetFocRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });
  describe('    resetadjRequestApprovals() ', () => {
    it('should dispatch load    resetadjRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetADJRequestApprovals();

        facade.resetadjRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetadjRequestApprovals() Ciunt ', () => {
    it('should dispatch load    resetadjRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetADJRequestApprovalsCount();

        facade.resetadjRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetLossRequestApprovals() ', () => {
    it('should dispatch load resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetLOSSRequestApprovals();

        facade.resetLossRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   resetLossRequestApprovals() Ciunt ', () => {
    it('should dispatch load    resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetLOSSRequestApprovalsCount();

        facade.resetLossRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetLoanRequestApprovals() ', () => {
    it('should dispatch load resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetLOANRequestApprovals();

        facade.resetLoanRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   resetLoanRequestApprovals() Ciunt ', () => {
    it('should dispatch load    resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetLOANRequestApprovalsCount();

        facade.resetLoanRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetexhRequestApprovals() ', () => {
    it('should dispatch load resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetEXHRequestApprovals();

        facade.resetExhtRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   resetEXHRequestApprovals() Ciunt ', () => {
    it('should dispatch load    resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetEXHRequestApprovalsCount();

        facade.resetExhRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetPSVRequestApprovals() ', () => {
    it('should dispatch load resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetPSVRequestApprovals();

        facade.resetPsvRequestApprovals();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   resetPSVRequestApprovals() Ciunt ', () => {
    it('should dispatch load    resetLossRequestApprovals() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetPSVRequestApprovalsCount();

        facade.resetPsvRequestApprovalsCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('    resetRequestApprovalsItem() Ciunt ', () => {
    it('should dispatch load    r resetRequestApprovalsItem() ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRequestApprovalsItems();

        facade.resetRequestApprovalsItem();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   resetError() ', () => {
    it('should dispatch load   resetError() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetError();

      facade.resetError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('    resetUpdate() ', () => {
    it('should dispatch load    resetUpdate() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetStatus();

      facade.resetUpdate();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('   resetRequestApprovalsItemCount()  ', () => {
    it('should dispatch load    resetRequestApprovalsItemCount()  ', inject(
      [Store],
      store => {
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new ResetRequestApprovalsItemsCount();

        facade.resetRequestApprovalsItemCount();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   loadBinRequestApprovalsItems  ', () => {
    it('should dispatch load   loadBinRequestApprovalsItems ', inject(
      [Store],
      store => {
        const parameter = {};
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadBinRequestApprovals(parameter);

        facade.loadBinRequestApprovalsItems(parameter);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   loadLocations() ', () => {
    it('should dispatch load    loadLocations() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLocation();

      facade.loadLocations();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('   searchClear()', () => {
    it('should dispatch load     searchClear() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchClear();

      facade.searchClear();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('    loadRequestCount()', () => {
    it('should dispatch load    loadRequestCount() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadItemsTotalCount();

      facade.loadRequestCount();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Access Selector action', () => {
    it('should access  getIbtRequest() selector action', () => {
      expect(facade.getIbtRequest()).toEqual(facade['ibtRequest$']);
    });

    it('should access   getibtCancelItems() selector action', () => {
      expect(facade.getibtCancelItems()).toEqual(facade['ibtCancelItems$']);
    });

    it('should access  getibtCancelItemsLoading()selector action', () => {
      expect(facade.getibtCancelItemsLoading()).toEqual(
        facade['ibtCancelItemsLoading']
      );
    });

    it('should access getibtCancelItemCount() selector action', () => {
      expect(facade.getibtCancelItemCount()).toEqual(
        facade['ibtCancelItemCount']
      );
    });

    it('should access gethasUpadatingCancelApprovalsFailure() selector action', () => {
      expect(facade.gethasUpadatingCancelApprovalsFailure()).toEqual(
        facade['hasUpadatingCancelApprovalsFailure']
      );
    });

    it('should access  getisCancelUpdatingSuccess()selector action', () => {
      expect(facade.getisCancelUpdatingSuccess()).toEqual(
        facade['isCancelUpdatingSuccess']
      );
    });
    it('should access  getibtCancelUpdateRequest() selector action', () => {
      expect(facade.getibtCancelUpdateRequest()).toEqual(
        facade['ibtCancelUpdateRequest']
      );
    });

    it('should access  getIbtCancellationRequest()  selector action', () => {
      expect(facade.getIbtCancellationRequest()).toEqual(
        facade['ibtCancellationRequest$']
      );
    });
    it('should access   getfocRequest()selector action', () => {
      expect(facade.getfocRequest()).toEqual(facade['focRequest$']);
    });

    it('should access   getpsvRequest()selector action', () => {
      expect(facade.getpsvRequest()).toEqual(facade['psvRequest$']);
    });
    it('should access getadjRequest()selector action', () => {
      expect(facade.getadjRequest()).toEqual(facade['adjRequest$']);
    });
    it('should access  getlossRequest()selector action', () => {
      expect(facade.getlossRequest()).toEqual(facade['lossRequest$']);
    });
    it('should access   getloanRequest()  selector action', () => {
      expect(facade.getloanRequest()).toEqual(facade['loanRequest$']);
    });
    it('should access  getexhRequest()selector action', () => {
      expect(facade.getexhRequest()).toEqual(facade['exhRequest$']);
    });
    it('should access  getIbtRequestItems() selector action', () => {
      expect(facade.getIbtRequestItems()).toEqual(facade['ibtRequestItems$']);
    });
    it('should access getIsLoadingIbt() selector action', () => {
      expect(facade.getIsLoadingIbt()).toEqual(facade['isLoadingIbtRequest$']);
    });
    it('should access  getIsLoadingIbtCancellation()selector action', () => {
      expect(facade.getIsLoadingIbtCancellation()).toEqual(
        facade['isLoadingIbtCancellationRequest$']
      );
    });
    it('should access  getIsLoadingexh()selector action', () => {
      expect(facade.getIsLoadingexh()).toEqual(facade['isexhLoading$']);
    });
    it('should access  g getIsLoadingadj()selector action', () => {
      expect(facade.getIsLoadingadj()).toEqual(facade['isadjLoading$']);
    });
    it('should access  getIsLoadingloss()selector action', () => {
      expect(facade.getIsLoadingloss()).toEqual(facade['islossLoading$']);
    });
    it('should access   getIsLoadingpsv()elector action', () => {
      expect(facade.getIsLoadingpsv()).toEqual(facade['ispsvLoading$']);
    });
    it('should access getIsLoadingfoc() selector action', () => {
      expect(facade.getIsLoadingfoc()).toEqual(facade['isFocLoading$']);
    });
    it('should access  getError()selector action', () => {
      expect(facade.getError()).toEqual(facade['Error$']);
    });
    it('should access getIsBinRequestApprovalsItemsReset() selector action', () => {
      expect(facade.getIsBinRequestApprovalsItemsReset()).toEqual(
        facade['selectIsBinRequestApprovalsItemsReset$']
      );
    });
    it('should access  getIsBinRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIsBinRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsBinRequestApprovalsItemsCountReset$']
      );
    });
    it('should access  getIsIbtRequestApprovalsItemsReset() selector action', () => {
      expect(facade.getIsIbtRequestApprovalsItemsReset()).toEqual(
        facade['selectIsIbtRequestApprovalsItemsReset$']
      );
    });
    it('should access  getIsIbtRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIsIbtRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsIbtRequestApprovalsItemsCountReset$']
      );
    });
    it('should access  getIsFocRequestApprovalsItemsReset()selector action', () => {
      expect(facade.getIsFocRequestApprovalsItemsReset()).toEqual(
        facade['selectIsFocRequestApprovalsItemsReset$']
      );
    });
    it('should access  getIsFocRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIsFocRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsFoctRequestApprovalsItemsCountReset$']
      );
    });

    it('should access   getIsadjtRequestApprovalsItemsReset()selector action', () => {
      expect(facade.getIsadjtRequestApprovalsItemsReset()).toEqual(
        facade['selectIsadjRequestApprovalsItemsReset$']
      );
    });

    it('should access  getisCancelUpdatingSuccess()selector action', () => {
      expect(facade.getisCancelUpdatingSuccess()).toEqual(
        facade['isCancelUpdatingSuccess']
      );
    });
    it('should access getIsadjRequestApprovalsItemsCountReset()selector action', () => {
      expect(facade.getIsadjRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsadjRequestApprovalsItemsCountReset$']
      );
    });
    it('should access getIspsvRequestApprovalsItemsReset() selector action', () => {
      expect(facade.getIspsvRequestApprovalsItemsReset()).toEqual(
        facade['selectIspsvRequestApprovalsItemsReset$']
      );
    });
    it('should access  getIspsvRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIspsvRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsPsvRequestApprovalsItemsCountReset$']
      );
    });
    it('should access getIslossRequestApprovalsItemsReset()selector action', () => {
      expect(facade.getIslossRequestApprovalsItemsReset()).toEqual(
        facade['selectIslossRequestApprovalsItemsReset$']
      );
    });
    it('should access getIslossRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIslossRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIslossRequestApprovalsItemsCountReset$']
      );
    });
    it('should access   getIsloanRequestApprovalsItemsReset()selector action', () => {
      expect(facade.getIsloanRequestApprovalsItemsReset()).toEqual(
        facade['selectIsloanRequestApprovalsItemsReset$']
      );
    });
    it('should access  getIsexhRequestApprovalsItemsReset() selector action', () => {
      expect(facade.getIsexhRequestApprovalsItemsReset()).toEqual(
        facade['selectIsexhRequestApprovalsItemsReset$']
      );
    });

    it('should access  getIsexhRequestApprovalsItemsCountReset()selector action', () => {
      expect(facade.getIsexhRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsexhRequestApprovalsItemsCountReset$']
      );
    });
    it('should access  getIsLoading()selector action', () => {
      expect(facade.getIsLoading()).toEqual(facade['isLoading$']);
    });
    it('should access   getIsLoadingloan()selector action', () => {
      expect(facade.getIsLoadingloan()).toEqual(facade['isloanLoading$']);
    });
    it('should access   getIsLocationLoading()selector action', () => {
      expect(facade.getIsLocationLoading()).toEqual(
        facade['isLocationLoading$']
      );
    });
    it('should access  getItemCount() selector action', () => {
      expect(facade.getItemCount()).toEqual(
        facade['binRequestApprovalsItemCount$']
      );
    });
    it('should access    getIbtCount()selector action', () => {
      expect(facade.getIbtCount()).toEqual(
        facade['ibtRequestApprovalsItemCount$']
      );
    });
    it('should access  g getIbtCancelCount()selector action', () => {
      expect(facade.getIbtCancelCount()).toEqual(
        facade['cancelRequestApprovalsCount$']
      );
    });

    it('should access getIsloanRequestApprovalsItemsCountReset() selector action', () => {
      expect(facade.getIsloanRequestApprovalsItemsCountReset()).toEqual(
        facade['selectIsloanRequestApprovalsItemsCountReset$']
      );
    });
    it('should access getloanCount()selector action', () => {
      expect(facade.getloanCount()).toEqual(
        facade['loanRequestApprovalsCount$']
      );
    });
    it('should access  getexhCount()selector action', () => {
      expect(facade.getexhCount()).toEqual(facade['exhRequestApprovalsCount$']);
    });
    it('should access getfocCount() selector action', () => {
      expect(facade.getfocCount()).toEqual(facade['focRequestApprovalsCount$']);
    });
    it('should access  getIbtItemsCount() selector action', () => {
      expect(facade.getIbtItemsCount()).toEqual(
        facade['ibtRequestApprovalsItemsCount$']
      );
    });
    it('should access getLocationCount() selector action', () => {
      expect(facade.getLocationCount()).toEqual(facade['locationCount$']);
    });
    it('should access  getbinItems()selector action', () => {
      expect(facade.getbinItems()).toEqual(facade['binRequestApprovalsItems$']);
    });
    it('should access   getLocations()selector action', () => {
      expect(facade.getLocations()).toEqual(facade['location$']);
    });
    it('should access  g getIbtCancelCount()selector action', () => {
      expect(facade.getIbtCancelCount()).toEqual(
        facade['cancelRequestApprovalsCount$']
      );
    });
    it('should access  getIsBinRequestApprovalsItemsLoading()selector action', () => {
      expect(facade.getIsBinRequestApprovalsItemsLoading()).toEqual(
        facade['isbinRequestItemsLoading$']
      );
    });
    it('should access  getIsIbtRequestApprovalsItemsLoading() selector action', () => {
      expect(facade.getIsIbtRequestApprovalsItemsLoading()).toEqual(
        facade['isIbtRequestItemsLoading$']
      );
    });
    it('should access  getHasUpdatingFailure() selector action', () => {
      expect(facade.getHasUpdatingFailure()).toEqual(
        facade['hasUpdatingFailure']
      );
    });
    it('should access getupdateItem()selector action', () => {
      expect(facade.getupdateItem()).toEqual(facade['updateItem$']);
    });
    it('should access getIsUpdatingItem() selector action', () => {
      expect(facade.getIsUpdatingItem()).toEqual(facade['isUpdatingItem$']);
    });
    it('should access   getHasUpdatingIbtFailure()selector action', () => {
      expect(facade.getHasUpdatingIbtFailure()).toEqual(
        facade['hasUpdatingIbtFailure']
      );
    });
    it('should access   getupdateIbt() selector action', () => {
      expect(facade.getupdateIbt()).toEqual(facade['updateIbt$']);
    });
    it('should access  getIsUpdatingIbt() selector action', () => {
      expect(facade.getIsUpdatingIbt()).toEqual(facade['isUpdatingIbt$']);
    });
    it('should access  getHasUpdatingApprovalsFailure()selector action', () => {
      expect(facade.getHasUpdatingApprovalsFailure()).toEqual(
        facade['hasUpdatingApprovalsFailure']
      );
    });
    it('should access    getIbt()selector action', () => {
      expect(facade.getIbt()).toEqual(facade['IbtApproval$']);
    });
    it('should access  getIsUpdatingSuccess()selector action', () => {
      expect(facade.getIsUpdatingSuccess()).toEqual(
        facade['isUpdatingSuccess$']
      );
    });
    it('should access getSelectedRequest()selector action', () => {
      expect(facade.getSelectedRequest()).toEqual(facade['selectedRequest$']);
    });
    it('should access getSelectedCancelRequest() selector action', () => {
      expect(facade.getSelectedCancelRequest()).toEqual(
        facade['selectedCancelRequest$']
      );
    });

    it('should access getadjCount() selector action', () => {
      expect(facade.getadjCount()).toEqual(facade['adjRequestApprovalsCount$']);
    });
    it('should access   getpsvCount() selector action', () => {
      expect(facade.getpsvCount()).toEqual(facade['psvRequestApprovalsCount$']);
    });
    it('should access  getlossCount() selector action', () => {
      expect(facade.getlossCount()).toEqual(
        facade['lossRequestApprovalsCount$']
      );
    });
  });

  describe('   updateItem( ', () => {
    it('should dispatch load   updateItem( ', inject([Store], store => {
      const parameter = {
        id: 899,
        binRequestUpdateDto: null
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateBinRequestApprovals(parameter);

      facade.updateItem(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' updateIbt  ', () => {
    it('should dispatch load   updateIbt ', inject([Store], store => {
      const parameter = {
        id: 90,
        itemId: '48488',
        itemUpdateDto: null
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new UpdateIBTRequestApprovals(parameter);

      facade.updateIbt(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadIbtCancellationRequest  ', () => {
    it('should dispatch load loadIbtCancellationRequest', inject(
      [Store],
      store => {
        const parameter = {
          requestType: 'IBT',
          pageIndex: 9,
          pageSize: 8,
          status: 'app'
        };
        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadIBtCancellationRequest(parameter);

        facade.loadIbtCancellationRequest(parameter);
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('   loadFocRequest  ', () => {
    it('should dispatch load    loadFocRequest ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadFOCRequest(parameter);

      facade.loadFocRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadPSVRequest  ', () => {
    it('should dispatch  loadPSVRequest ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadPSVRequest(parameter);

      facade.loadPSVRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  loadEXHRequest  ', () => {
    it('should dispatch loadEXHRequest ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadEXHRequest(parameter);

      facade.loadEXHRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' loadLOSSRequest  ', () => {
    it('should dispatch load loadLOSSRequest', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 8
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLOSSRequest(parameter);

      facade.loadLOSSRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('   updateIbtSucess ', () => {
    it('should dispatch load    updateIbtSucess ', inject([Store], store => {
      const parameter = {
        id: 89,
        requestType: 'ADJ',
        requestUpdateDto: null
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new IBTRequest(parameter);

      facade.updateIbtSucess(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  updateIbtCancel  ', () => {
    it('should dispatch load   updateIbtCancel ', inject([Store], store => {
      const parameter = {
        id: 89,
        stUpdateDto: null,

        transferType: 'IBT'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new IBTCancelRequest(parameter);

      facade.updateIbtCancel(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  loadIbtRequest ', () => {
    it('should dispatch load   loadIbtRequest', inject([Store], store => {
      const parameter = {
        pageIndex: 0,
        pageSize: 8,

        requestType: 'IBT'
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIBtRequest(parameter);

      facade.loadIbtRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('   ClearPSVRequest() ', () => {
    it('should dispatch load   ClearPSVRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearPSVRequest();

      facade.ClearPSVRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  ClearFOCRequest(  ', () => {
    it('should dispatch load   ClearFOCRequest(', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearFOCRequest();

      facade.ClearFOCRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe(' ClearLOSSRequest()  ', () => {
    it('should dispatch load  ClearLOSSRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearLOSSRequest();

      facade.ClearLOSSRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  ClearLOANRequest() ', () => {
    it('should dispatch load  ClearLOANRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearLOANRequest();

      facade.ClearLOANRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  ClearADJRequest() ', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearADJRequest();

      facade.ClearADJRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('  ClearExhRequest() ', () => {
    it('should dispatch load  ClearExhRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearExhRequest();

      facade.ClearExhRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' ClearIbtRequest() ', () => {
    it('should dispatch load  ClearIbtRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearIbtSearchItems();

      facade.ClearIbtRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('   ClearBinRequest() ', () => {
    it('should dispatch load   ClearBinRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new SearchClear();

      facade.ClearBinRequest();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  loadLOANRequest', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLOANRequest(parameter);

      facade.loadLOANRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  loadLOANRequest ', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadLOANRequest(parameter);

      facade.loadLOANRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  loadADJRequest() ', () => {
    it('should dispatch load loadADJRequest ', inject([Store], store => {
      const parameter = {
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadADJRequest(parameter);

      facade.loadADJRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadIbtRequestItems', () => {
    it('should dispatch load  loadIbtRequestItems', inject([Store], store => {
      const parameter = {
        id: null,
        isSelectedArray: [],
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIbtRequestApprovals(parameter);

      facade.loadIbtRequestItems(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe(' loadIbtCancelRequestItems', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const parameter = {
        id: null,
        isSelectedArray: [],
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadIbtCancelRequestItemsApprovals(parameter);

      facade.loadIbtCancelRequestItems(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('  ClearADJRequest() ', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const parameter = {
        id: null,
        isSelectedArray: [],
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedRequest(parameter);

      facade.loadSelectedRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
  describe('   loadSelectedCancelRequest ', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const parameter = {
        id: null,
        isSelectedArray: [],
        requestType: 'IBT',
        pageIndex: 9,
        pageSize: 0
      };
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadSelectedCancelRequest(parameter);

      facade.loadSelectedCancelRequest(parameter);
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('   loadSelectedCancelRequest ', () => {
    it('should dispatch load  ClearADJRequest() ', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearItemList();

      facade.clearItemList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
