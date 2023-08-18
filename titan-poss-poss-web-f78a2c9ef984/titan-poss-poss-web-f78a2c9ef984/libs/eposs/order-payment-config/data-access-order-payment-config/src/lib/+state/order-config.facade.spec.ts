import { Store } from '@ngrx/store';
import { OrderPaymentFacade } from './order-config.facade';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { OrderPaymentConfigState } from './order-config.state';
import {
  OrderPayementRulesRequest,
  OrderPaymentConfigReqPayload,
  SaveOrderPaymentsPayload,
  UpdateOrderPaymentConfigPayload
} from '@poss-web/shared/models';
import {
  LoadAllConfigRules,
  LoadOrderConfigByConfigId,
  LoadOrderPaymentsConfigList,
  LoadProductGroupMapping,
  LoadReset,
  LoadSelectedConfigDetails,
  RemoveOrderPaymentConfig,
  SaveOderPaymentConfig,
  SearchConfigDetailsByConfigName,
  UpdateConfigIsActive,
  UpdateOrderPaymentConfig
} from './order-config.actions';

describe(' weightToleranceFacade Testing Suite', () => {
  const initialState: OrderPaymentConfigState = {
    orderConfigList: [],
    orderConfig: null,
    error: null,
    hasSaved: false,
    IsUpdated: false,
    isLoading: false,
    totalElements: null,
    productGroups: [],
    configId: null,
    isCleared: null,
    orderPaymentConfigDetails: [],
    allOrderPaymentConfigDetails: [],
    ruleDetailsCount: 0,
    uniqueNameCheckCount: 0
  };

  let weightToleranceFacade: OrderPaymentFacade;
  let store: MockStore<OrderPaymentFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), OrderPaymentFacade]
    });
    store = TestBed.inject<any>(Store);
    weightToleranceFacade = TestBed.inject<any>(OrderPaymentFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LoadOrderPaymentsConfigList action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OrderPaymentConfigReqPayload = {
        pageIndex: 1,
        pageSize: 10,
        length: 10
      };
      const action = new LoadOrderPaymentsConfigList(payload);
      weightToleranceFacade.LoadOrderPaymentConfigList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadSelectedConfigDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '11111111';
      const action = new LoadSelectedConfigDetails(payload);
      weightToleranceFacade.loadSelectedConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SearchConfigDetailsByConfigName action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = '11111111';
      const action = new SearchConfigDetailsByConfigName(payload);
      weightToleranceFacade.searchConfigDetailsByConfigName(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SaveOderPaymentConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: SaveOrderPaymentsPayload = {
        configDetail: {
          description: 'config test',
          isActive: true,
          ruleDetails: null
        },
        orderPaymentConfigRequest: null
      };
      const action = new SaveOderPaymentConfig(payload);
      weightToleranceFacade.saveConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateConfigIsActive action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateOrderPaymentConfigPayload = {
        data: null,
        id: '111111'
      };
      const action = new UpdateConfigIsActive(payload);
      weightToleranceFacade.updateIsActive(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateOrderPaymentConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new UpdateOrderPaymentConfig(payload);
      weightToleranceFacade.updateConfig(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RemoveOrderPaymentConfig action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: UpdateOrderPaymentConfigPayload = {
        id: '1111111',
        data: null
      };
      const action = new RemoveOrderPaymentConfig(payload);
      weightToleranceFacade.removeConfiguration(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadReset action', () => {
      spyOn(store, 'dispatch').and.returnValue({});

      const action = new LoadReset();
      weightToleranceFacade.loadReset();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadProductGroupMapping action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadProductGroupMapping();
      weightToleranceFacade.loadProductGroups();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadAllConfigRules action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        isPageable: false
      };

      const action = new LoadAllConfigRules(payload);
      weightToleranceFacade.loadAllOrderPaymentRulesById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadOrderConfigByConfigId action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: OrderPayementRulesRequest = {
        configId: '1111',
        pageIndex: 0,
        pageSize: 10
      };
      const action = new LoadOrderConfigByConfigId(payload);
      weightToleranceFacade.loadOrderPaymentConfigById(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
  describe('Access Selector action', () => {
    it('should access the getError selector action', () => {
      expect(weightToleranceFacade.getError()).toEqual(
        weightToleranceFacade['error$']
      );
    });
    it('should access the getIsloading selector action', () => {
      expect(weightToleranceFacade.getIsloading()).toEqual(
        weightToleranceFacade['isLoading$']
      );
    });
    it('should access the getHasSaved selector action', () => {
      expect(weightToleranceFacade.getHasSaved()).toEqual(
        weightToleranceFacade['hasSaved$']
      );
    });
    it('should access the getIsUpdated selector action', () => {
      expect(weightToleranceFacade.getIsUpdated()).toEqual(
        weightToleranceFacade['IsUpdated$']
      );
    });
    it('should access the getTotalElement selector action', () => {
      expect(weightToleranceFacade.getTotalElement()).toEqual(
        weightToleranceFacade['totalElements$']
      );
    });
    it('should access the getConfiguration selector action', () => {
      expect(weightToleranceFacade.getConfiguration()).toEqual(
        weightToleranceFacade['orderPaymentConfig$']
      );
    });
    it('should access the getConfigurationList selector action', () => {
      expect(weightToleranceFacade.getConfigurationList()).toEqual(
        weightToleranceFacade['orderPaymentConfigList$']
      );
    });
    it('should access the getProductGroups selector action', () => {
      expect(weightToleranceFacade.getProductGroups()).toEqual(
        weightToleranceFacade['productGroups$']
      );
    });
    it('should access the getConfigId selector action', () => {
      expect(weightToleranceFacade.getConfigId()).toEqual(
        weightToleranceFacade['selectConfigId$']
      );
    });
    it('should access the getIsCleared selector action', () => {
      expect(weightToleranceFacade.getIsCleared()).toEqual(
        weightToleranceFacade['isCleared$']
      );
    });
    it('should access the getOrderPaymentCOnfigDetails selector action', () => {
      expect(weightToleranceFacade.getOrderPaymentCOnfigDetails()).toEqual(
        weightToleranceFacade['orderPaymentConfigDetails']
      );
    });
    it('should access the getOrderPaymentRulesDetailsCount selector action', () => {
      expect(weightToleranceFacade.getOrderPaymentRulesDetailsCount()).toEqual(
        weightToleranceFacade['ruleDetailsCount$']
      );
    });
    it('should access the getAllOrderPaymentRulesDetailst selector action', () => {
      expect(weightToleranceFacade.getAllOrderPaymentRulesDetailst()).toEqual(
        weightToleranceFacade['allRuleDetails$']
      );
    });
  });
});
