import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DiscountState } from './discount.state';
import { DiscountFacade } from './discount.facade';
import {
  ApplyDiscountRequest,
  AutoDiscRequest,
  ConfirmTransactionLevelDiscountPayload,
  DiscountsRequestPayload,
  DiscountsResponse,
  DiscountTransactionLevelRequest,
  DiscountVoucherDetailsRequestPayload,
  ItemLevelDiscountsDetailsRequestPayload,
  ItemLevelDiscountsRequestPayload,
  LoadAppliedTransactionDiscountsRequest,
  RemoveAllAppliedTransactionLevelDiscountsPayload,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  UpdateTransactionLevelDiscountByIDPayload
} from '@poss-web/shared/models';
import {
  ApplyDiscountAtTransactionLevel,
  CheckABCOEligibility,
  Clear,
  ClearEncircle,
  ClearIsEncircleAdded,
  ClearItemLevelDiscountDetails,
  ClearOrderDiscDetails,
  ClearTransactionLevelDiscountDetails,
  ClearUpdateItemLevelDiscountDetails,
  ConfirmAppliedTransactionLevelDiscount,
  DeleteItemLevelDiscounts,
  GetItemLevelDiscounts,
  LoadABCOConfigDetails,
  LoadABCODiscountDetails,
  LoadABCODiscounts,
  LoadAppliedTransactionLevelDiscounts,
  LoadAutoDiscounts,
  LoadAvailableEmployeeDiscounts,
  LoadAvailableEmpowementDiscounts,
  LoadAvailableSystemDvDiscounts,
  LoadAvailableTataEmployeeDiscounts,
  LoadAvailableTSSSDiscounts,
  LoadDiscountTypes,
  LoadDiscountVoucherDetails,
  LoadItemLevelDiscounts,
  LoadItemLevelDiscountsDetails,
  LoadNewABCODiscounts,
  LoadPcDesc,
  LoadPgDesc,
  LoadReasonForChangingDiscounts,
  LoadReasonForNotGivingDiscounts,
  LoadRivaahGHSDiscounts,
  LoadTataCompanyNameList,
  LoadTransactionLevelDiscounts,
  RealodDiscountsGrid,
  RefreshDiscountsAndOffersPanel,
  RemoveAllAppliedTransactionLevelDiscounts,
  RemoveAppliedTransactionLevelDiscountByID,
  SaveItemLevelDiscounts,
  SaveRivaahGHSDiscounts,
  SetDiscountState,
  SetEnableCalculateRivaahGHSDiscounts,
  SetIsEncircleDetails,
  SetIsRsoSelected,
  SetOrderDiscDetails,
  UpdateAppliedTransactionLevelDiscount,
  UpdateItemLevelDiscounts
} from './discount.actions';
import * as moment from 'moment';

describe(' Discount Facade Testing Suite', () => {
  const initialState: DiscountState = {
    error: null,
    isLoading: false,
    isDropdownLoading: false,
    isAlreadyAddedDiscountsLoading: false,
    isAutoDiscLoading: false,
    isABDropdownLoading: false,
    isDiscountDetailsLoading: false,
    currentConfirmedDiscount: null,
    isRsoSelected: true,
    discountState: null,
    itemLevelDiscounts: null,
    itemLevelDiscountsDetails: null,
    getItemLevelDiscountsRes: null,
    saveItemLevelDiscountsRes: { response: [], data: null },
    updateItemLevelDiscountsRes: [],
    deleteItemLevelDiscountsRes: { response: false, data: null },
    productCategoryDesc: null,
    productGroupDesc: null,
    isDescLoaded: false,
    discountTypes: [],
    digiDiscounts: null,
    transactionLevelDiscounts: [],
    isLoadingAvailableDiscounts: false,
    availableEmployeeDiscounts: null,
    availableTsssDiscounts: null,
    availableTataEmployeeDiscounts: null,
    availableSystemDvDiscounts: null,
    availableEmpowermentDiscounts: null,
    isTransactionLevelDiscountApplied: false,
    appliedTransactionLevelDiscounts: [],
    isAllAppliedTransactionLevelDiscountDeleted: {
      isDeleted: true,
      discountType: null
    },
    isSelectedTransactionLevelDiscountDeleted: false,
    isTransactionLevelDiscountUpdated: false,
    isTransactionLevelDiscountConfirmed: false,
    currentDeleteDiscount: null,
    tataCompanyList: [],
    refreshOffersAndDiscountsPanel: false,

    isEncircleDiscDetails: null,
    eligibileItemsResponseForKaratOrCoinOffer: null,
    appliedKaratorCoinOfferDiscountResponse: null,

    discountVoucherDetails: null,

    ABCOEligibilityRes: null,
    ABCODiscountsRes: null,
    newABCODiscountsRes: null,
    ABCODiscountDetailsRes: null,
    ABCOConfigDetailsRes: null,
    autoDiscountsRes: { response: null, data: null },
    // ghsPaymentDetails: null
    eligibleItemsResponseForGepPurityOffer: null,
    isClearEncircle: false,
    reloadDiscounts: false,
    orderDiscountDetails: null,
    rivaahGHSDiscounts: null,
    saveRivaahGHSDiscountsResponse: null,
    enableCalculateRivaahGHSDiscounts: false,
    reasonForChangingDiscounts: [],
    reasonForNotGivingDiscounts: []
  };

  let discountFacade: DiscountFacade;
  let store: MockStore<DiscountFacade>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), DiscountFacade]
    });
    store = TestBed.inject<any>(Store);
    discountFacade = TestBed.inject<any>(DiscountFacade);
  });

  describe('Dispatch Actions action', () => {
    it('should call LoadTransactionLevelDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const action = new LoadTransactionLevelDiscounts(payload);
      discountFacade.loadAvailableTransactionLevelDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadAvailableEmployeeDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPLOYEE_DISCOUNT',
        itemDetails: [],
        employeeDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };

      const action = new LoadAvailableEmployeeDiscounts(paylaod);
      discountFacade.loadAvailableEmployeeDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAvailableTsssDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'TSSS_DISCOUNT',
        itemDetails: [],
        tsssDetails: { couponDetails: [{ couponCode: '1234567' }] }
      };
      const action = new LoadAvailableTSSSDiscounts(paylaod);
      discountFacade.loadAvailableTsssDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAvailableTataEmployeeDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'TATA_EMPLOYEE_DISCOUNT',
        itemDetails: [],
        tataEmployeeDetails: {
          companyName: 'TCS',
          employeeId: '1234',
          isIdProofUploaded: true,
          employeeName: 'Joe'
        }
      };
      const action = new LoadAvailableTataEmployeeDiscounts(paylaod);
      discountFacade.loadAvailableTataEmployeeDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAvailableSystemDvDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'SYSTEM_DISCOUNT_DV',
        itemDetails: []
      };
      const action = new LoadAvailableSystemDvDiscounts(paylaod);
      discountFacade.loadAvailableSystemDvDiscount(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAvailableEmpowermentDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'EMPOWERMENT_DISCOUNT',
        itemDetails: [],
        empowermentDetails: { applyEmpowermentDiscount: true }
      };
      const action = new LoadAvailableEmpowementDiscounts(paylaod);
      discountFacade.loadAvailableEmpowermentDiscount(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call applyTransactionLevelDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: ApplyDiscountRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        discountType: 'BILL_LEVEL_DISCOUNT',
        txnType: 'CM',
        hasDiscounts: false,
        requestBody: {
          discountDetails: [
            {
              discountCode: 'Test bill discount',
              discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
              discountType: 'BILL_LEVEL_DISCOUNT',
              discountValue: 1000,
              discountValueDetails: {},
              isEdited: false
            }
          ]
        }
      };
      const action = new ApplyDiscountAtTransactionLevel(paylaod);
      discountFacade.applyTransactionLevelDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call loadAppliedTransactionLevelDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: LoadAppliedTransactionDiscountsRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM'
      };
      const action = new LoadAppliedTransactionLevelDiscounts(paylaod);
      discountFacade.loadAppliedTransactionLevelDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RemoveAllAppliedTransactionLevelDiscounts action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: RemoveAllAppliedTransactionLevelDiscountsPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT'
      };
      const action = new RemoveAllAppliedTransactionLevelDiscounts(paylaod);
      discountFacade.removeAllAppliedTransactionLevelDiscounts(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RemoveAppliedTransactionLevelDiscountByID action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: RemoveAppliedTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountId: '1111111111111'
      };
      const action = new RemoveAppliedTransactionLevelDiscountByID(paylaod);
      discountFacade.removeSelectedTransactionLevelDiscount(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateAppliedTransactionLevelDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: UpdateTransactionLevelDiscountByIDPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        isPriceUpdate: false
      };
      const action = new UpdateAppliedTransactionLevelDiscount(paylaod);
      discountFacade.updateTransactionLevelDiscount(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ConfirmAppliedTransactionLevelDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const paylaod: ConfirmTransactionLevelDiscountPayload = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        txnType: 'CM',
        discountType: 'BILL_LEVEL_DISCOUNT',
        discountTxnId: ['111111111111111']
      };
      const action = new ConfirmAppliedTransactionLevelDiscount(paylaod);
      discountFacade.confirmTransactionLevelDiscount(paylaod);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearTransactionLevelDiscountDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearTransactionLevelDiscountDetails();
      discountFacade.clearTransactionLevelDiscountDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SetIsRsoSelected action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = true;
      const action = new SetIsRsoSelected(true);
      discountFacade.setIsRsoSelected(true);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateAppliedTransactionLevelDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = 'TATA_COMPANY';
      const action = new LoadTataCompanyNameList(payload);
      discountFacade.loadTataCompanyList(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateAppliedTransactionLevelDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload = true;
      const action = new RefreshDiscountsAndOffersPanel(payload);
      discountFacade.setRefreshDiscountsAndOffersPanel(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateAppliedTransactionLevelDiscount action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const payload: DiscountVoucherDetailsRequestPayload = {
        accountNo: 12345,
        vendorCode: 'DV',
        voucherCode: 9876543
      };
      const action = new LoadDiscountVoucherDetails(payload);
      discountFacade.loadDiscountVoucherDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    // Item Level Discounts
    it('should call Clear action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new Clear();
      discountFacade.clear();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearItemLevelDiscountDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearItemLevelDiscountDetails();
      discountFacade.clearItemLevelDiscountDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearUpdateItemLevelDiscountDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearUpdateItemLevelDiscountDetails();
      discountFacade.clearUpdateItemLevelDiscountDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SetDiscountState action', () => {
      const payload = '';
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SetDiscountState(payload);
      discountFacade.setDiscountState(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call RealodDiscountsGrid action', () => {
      const payload = true;
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new RealodDiscountsGrid(payload);
      discountFacade.loadReloadDiscountsGrid(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadItemLevelDiscounts action', () => {
      const payload: ItemLevelDiscountsRequestPayload = {
        businessDate: 1650652200000,
        itemDetails: {
          itemCode: '511881VQMQ2AP1',
          lotNumber: '2CD000002',
          mfgDate: moment(1608834600000),
          stockInwardDate: moment(1614450600000),
          totalTax: 4966.33,
          totalWeight: 52.731,
          netWeight: 52.731,
          totalValue: 365890.83,
          complexityPercent: 26,
          makingChargePerGram: 0,
          productCategoryCode: 'V',
          productGroupCode: '75'
        },
        transactionDetails: {
          transactionType: 'CM',
          subTransactionType: 'NEW_CM',
          isFrozenRate: null
        },
        encircleDiscount: {},
        employeeDetails: {},
        tsssDetails: null,
        tataEmployeeDetails: null,
        empowermentDetails: null,
        rivaahGhsDetails: null
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadItemLevelDiscounts(payload);
      discountFacade.loadItemLevelDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadItemLevelDiscountsDetails action', () => {
      const payload: ItemLevelDiscountsDetailsRequestPayload = {
        requestBody: {
          businessDate: 1650652200000,
          itemDetails: {
            itemCode: '511881VQMQ2AP1',
            lotNumber: '2CD000002',
            productCategoryCode: 'V',
            productGroupCode: '75',
            priceDetails: {
              isUcp: false,
              printGuranteeCard: false,
              metalPriceDetails: {
                preDiscountValue: 290020.5,
                metalPrices: [
                  {
                    weightUnit: 'gms',
                    netWeight: 52.731,
                    metalValue: 290020.5,
                    type: 'Gold',
                    ratePerUnit: 5500,
                    karat: 22,
                    purity: 92,
                    metalTypeCode: 'J'
                  }
                ]
              },
              stonePriceDetails: {
                numberOfStones: null,
                preDiscountValue: 465,
                stoneWeight: null,
                weightUnit: null,
                stoneWeightForView: null,
                weightUnitForView: null
              },
              makingChargeDetails: {
                preDiscountValue: 75405.33,
                makingChargePercentage: 26,
                isDynamicPricing: false,
                makingChargePct: 0,
                makingChargePgram: 0,
                wastagePct: 26
              },
              itemHallmarkDetails: {
                hallmarkGstPct: null,
                hallmarkingCharges: null,
                hmQuantity: null,
                isFOCForHallmarkingCharges: null,
                isHallmarked: true
              },
              netWeight: 52.731
            },
            totalQuantity: 1,
            totalValue: 365890.83,
            totalWeight: 52.731,
            netWeight: 52.731,
            totalTax: 4966.33
          },
          customerDetails: {
            enrollmentDate: moment(1650652200000),
            ulpId: '700001358840'
          },
          transactionDetails: {
            transactionType: 'CM',
            subTransactionType: 'NEW_CM',
            isFrozenRate: null
          },
          eligibleRivaahGhsDetails: null
        },
        discountId: '',
        discountClubId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadItemLevelDiscountsDetails(payload);
      discountFacade.loadItemLevelDiscountsDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call GetItemLevelDiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new GetItemLevelDiscounts(payload);
      discountFacade.loadGetItemLevelDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SaveItemLevelDiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveItemLevelDiscounts(reqPayload);
      discountFacade.loadSaveItemLevelDiscounts(reqPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call UpdateItemLevelDiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new UpdateItemLevelDiscounts(payload);
      discountFacade.loadUpdateItemLevelDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call DeleteItemLevelDiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      const reqPayload = {
        request: payload,
        data: null
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new DeleteItemLevelDiscounts(reqPayload);
      discountFacade.loadDeleteItemLevelDiscounts(reqPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadPcDesc action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPcDesc();
      discountFacade.loadPcDesc();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadPgDesc action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadPgDesc();
      discountFacade.loadPgDesc();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadDiscountTypes action', () => {
      const payload = '';
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadDiscountTypes(payload);
      discountFacade.loadDiscountTypes(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SetIsEncircleDetails action', () => {
      const payload = '';
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SetIsEncircleDetails(payload);
      discountFacade.setEncircle(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearIsEncircleAdded action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearIsEncircleAdded();
      discountFacade.clearEncircleAdded();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call CheckABCOEligibility action', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const reqPayload = {
        data: null,
        existingDiscounts: payload,
        id: ['']
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new CheckABCOEligibility(reqPayload);
      discountFacade.checkABCOEligibility(reqPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadABCODiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadABCODiscounts(payload);
      discountFacade.loadABCODiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadNewABCODiscounts action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadNewABCODiscounts(payload);
      discountFacade.loadNewABCODiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadABCODiscountDetails action', () => {
      const payload: DiscountsResponse[] = [
        {
          discountCode: 'catapr22',
          discountType: 'CATEGORY_DISCOUNT',
          discountId: '898642B7-28FC-4149-B64E-9AC79DD53323',
          discountValue: 34802.46,
          discountValueDetails: {
            type: 'DISCOUNT_VALUE_DETAILS',
            data: [
              {
                component: 'UCP',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'MAKING_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'METAL_CHARGE',
                discountValue: 34802.46,
                discountPercent: 12,
                isDiscountPercentage: true
              },
              {
                component: 'STONE_CHARGE',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              },
              {
                component: 'UNIT_WEIGHT',
                discountValue: 0,
                discountPercent: null,
                isDiscountPercentage: null
              }
            ]
          },
          referenceId: null,
          referenceType: null,
          isEdited: false,
          clubbedDiscountId: null,
          discountSubType: null,
          discountTxnId: '9BC4129C-0571-4EB2-A02E-F1959E97EBC1',
          itemId: 'C5FF8C3F-2B72-48BD-9BA5-3225BE5B1354',
          discountAttributes: {
            isRiva: true,
            isAccrualUlpPoints: false,
            clubbingDiscountType: 'TYPE1',
            occasion: 'catapr22'
          },
          status: 'CONFIRMED',
          txnLevelDiscountValueDetails: null,
          isNarationMandatory: false,
          occasion: ''
        }
      ];
      const reqPayload = {
        id: [''],
        existingDiscounts: payload,
        data: null
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadABCODiscountDetails(reqPayload);
      discountFacade.loadABCODiscountDetails(reqPayload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadABCOConfigDetails action', () => {
      const payload: DiscountsRequestPayload = {
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        transactionId: ''
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadABCOConfigDetails(payload);
      discountFacade.loadABCOConfigDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadAutoDiscounts action', () => {
      const payload: AutoDiscRequest = {
        request: {
          customerDetails: {
            enrollmentDate: moment(),
            ulpId: '700001358840'
          },
          discountRequestDto: {
            businessDate: 1650652200000,
            itemDetails: {
              itemCode: '511881VQMQ2AP1',
              lotNumber: '2CD000002',
              mfgDate: moment(1608834600000),
              stockInwardDate: moment(1614450600000),
              totalTax: 4515.48,
              totalWeight: 52.731,
              netWeight: 52.731,
              totalValue: 332670.3,
              complexityPercent: 26,
              makingChargePerGram: 0,
              productCategoryCode: 'V',
              productGroupCode: '75'
            },
            transactionDetails: {
              transactionType: 'CM',
              subTransactionType: 'NEW_CM',
              isFrozenRate: null
            },
            encircleDiscount: {},
            employeeDetails: null,
            tsssDetails: null,
            tataEmployeeDetails: null,
            empowermentDetails: null,
            rivaahGhsDetails: null
          },
          itemDetails: {
            itemCode: '511881VQMQ2AP1',
            lotNumber: '2CD000002',
            productCategoryCode: 'V',
            productGroupCode: '75',
            priceDetails: {
              isUcp: false,
              printGuranteeCard: false,
              metalPriceDetails: {
                preDiscountValue: 263655,
                metalPrices: [
                  {
                    weightUnit: 'gms',
                    netWeight: 52.731,
                    metalValue: 263655,
                    type: 'Gold',
                    ratePerUnit: 5000,
                    karat: 22,
                    purity: 92,
                    metalTypeCode: 'J'
                  }
                ]
              },
              stonePriceDetails: {
                numberOfStones: null,
                preDiscountValue: 465,
                stoneWeight: null,
                weightUnit: null,
                stoneWeightForView: null,
                weightUnitForView: null
              },
              makingChargeDetails: {
                preDiscountValue: 68550.3,
                makingChargePercentage: 26,
                isDynamicPricing: false,
                makingChargePct: 0,
                makingChargePgram: 0,
                wastagePct: 26
              },
              itemHallmarkDetails: {
                hallmarkGstPct: null,
                hallmarkingCharges: null,
                hmQuantity: null,
                isFOCForHallmarkingCharges: null,
                isHallmarked: true
              },
              netWeight: 52.731
            },
            totalQuantity: 1,
            totalValue: 332670.3,
            totalWeight: 52.731,
            netWeight: 52.731,
            totalTax: 4515.48
          }
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadAutoDiscounts(payload);
      discountFacade.loadAutoDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SetOrderDiscDetails action', () => {
      const payload = null;
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SetOrderDiscDetails(payload);
      discountFacade.setOrderDiscDetails(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearEncircle action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearEncircle();
      discountFacade.clearEncircle();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call ClearOrderDiscDetails action', () => {
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new ClearOrderDiscDetails();
      discountFacade.clearOrderDiscDetails();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadRivaahGHSDiscounts action', () => {
      const payload: DiscountTransactionLevelRequest = {
        businessDate: '1624300200000',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT'
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadRivaahGHSDiscounts(payload);
      discountFacade.loadRivaahGHSDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SaveRivaahGHSDiscounts action', () => {
      const payload: ApplyDiscountRequest = {
        subTxnType: 'NEW_CM',
        transactionId: '49F02FAB-76CA-435A-BF84-A5E56E29AC76',
        discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
        txnType: 'CM',
        hasDiscounts: false,
        requestBody: {
          discountDetails: [
            {
              discountCode: 'Test rivaah discount',
              discountId: '3DFC0981-5F67-4CB4-BD90-80EE1421C2FC',
              discountType: 'RIVAAH_ASHIRWAAD_DISCOUNT',
              discountValue: 1000,
              discountValueDetails: {},
              isEdited: false
            }
          ]
        }
      };
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SaveRivaahGHSDiscounts(payload);
      discountFacade.saveRivaahGHSDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call SetEnableCalculateRivaahGHSDiscounts action', () => {
      const payload = true;
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new SetEnableCalculateRivaahGHSDiscounts(payload);
      discountFacade.setEnableCalculateRivaahGHSDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadReasonForChangingDiscounts action', () => {
      const payload = 'REASON_FOR_CHANGING_DISCOUNTS';
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReasonForChangingDiscounts(payload);
      discountFacade.loadReasonForChangingDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
    it('should call LoadReasonForNotGivingDiscounts action', () => {
      const payload = 'REASON_FOR_NOTGIVING_DISCOUNTS';
      spyOn(store, 'dispatch').and.returnValue({});
      const action = new LoadReasonForNotGivingDiscounts(payload);
      discountFacade.loadReasonForNotGivingDiscounts(payload);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('Access Discount Selectors', () => {
    it('should get getHasError data', () => {
      expect(discountFacade.getError()).toEqual(discountFacade['error$']);
    });

    it('should get getIsLoading data', () => {
      expect(discountFacade.getIsLoading()).toEqual(discountFacade['isLoading$']);
    });

    it('should get getConfimrationDiscountState data', () => {
      expect(discountFacade.getConfimrationDiscountState()).toEqual(discountFacade['selectCurrentdiscountState$']);
    });

    it('should get getIsDropdownLoading data', () => {
      expect(discountFacade.getIsDropdownLoading()).toEqual(discountFacade['isDropdownLoading$']);
    });

    it('should get getIsAlreadyAddedDiscountsLoading data', () => {
      expect(discountFacade.getIsAlreadyAddedDiscountsLoading()).toEqual(discountFacade['isAlreadyAddedDiscountsLoading$']);
    });

    it('should get getIsDiscountDetailsLoading data', () => {
      expect(discountFacade.getIsDiscountDetailsLoading()).toEqual(discountFacade['isDiscountDetailsLoading$']);
    });

    it('should get getItemLevelDiscounts data', () => {
      expect(discountFacade.getItemLevelDiscounts()).toEqual(discountFacade['itemLevelDiscounts$']);
    });

    it('should get getItemLevelDiscountsDetails data', () => {
      expect(discountFacade.getItemLevelDiscountsDetails()).toEqual(discountFacade['itemLevelDiscountsDetails$']);
    });
   
    it('should get getConfirmedDiscount data', () => {
      expect(discountFacade.getConfirmedDiscount()).toEqual(discountFacade['selectCurrentConfirmedDiscount$']);
    });

    // it('should get getTransactionLevelDiscountByKey data', () => {
    //   expect(discountFacade.getTransactionLevelDiscountByKey()).toEqual(discountFacade['selectAppliedTransactionLevelDiscountsBykey$']);
    // });
   
    it('should get getDeletedDiscount data', () => {
      expect(discountFacade.getDeletedDiscount()).toEqual(discountFacade['currentDeletedDiscount$']);
    });

    it('should get getItemLevelDiscountsRes data', () => {
      expect(discountFacade.getItemLevelDiscountsRes()).toEqual(discountFacade['getItemLevelDiscountsRes$']);
    });

    it('should get saveItemLevelDiscountsRes data', () => {
      expect(discountFacade.saveItemLevelDiscountsRes()).toEqual(discountFacade['saveItemLevelDiscountsRes$']);
    });

    it('should get updateItemLevelDiscountsRes data', () => {
      expect(discountFacade.updateItemLevelDiscountsRes()).toEqual(discountFacade['updateItemLevelDiscountsRes$']);
    });

    it('should get deleteItemLevelDiscountsRes data', () => {
      expect(discountFacade.deleteItemLevelDiscountsRes()).toEqual(discountFacade['deleteItemLevelDiscountsRes$']);
    });

    it('should get getDiscountTypes data', () => {
      expect(discountFacade.getDiscountTypes()).toEqual(discountFacade['discTypes$']);
    });

    it('should get getPcDesc data', () => {
      expect(discountFacade.getPcDesc()).toEqual(discountFacade['pcDesc$']);
    });

    it('should get getPgDesc data', () => {
      expect(discountFacade.getPgDesc()).toEqual(discountFacade['pgDesc$']);
    });

    it('should get getIsDescLoaded data', () => {
      expect(discountFacade.getIsDescLoaded()).toEqual(discountFacade['isDescLoaded$']);
    });

    it('should get getIsEncircleDiscDetails data', () => {
      expect(discountFacade.getIsEncircleDiscDetails()).toEqual(discountFacade['isEncircleDiscDetails$']);
    });

    it('should get getAvailableTransactionLevelDiscounts data', () => {
      expect(discountFacade.getAvailableTransactionLevelDiscounts()).toEqual(discountFacade['availableTransactionLevelDiscount$']);
    });

    it('should get getDigiDiscounts data', () => {
      expect(discountFacade.getDigiDiscounts()).toEqual(discountFacade['avaliableDigiDiscount$']);
    });

    it('should get getAvailableSystemDvDiscounts data', () => {
      expect(discountFacade.getAvailableSystemDvDiscounts()).toEqual(discountFacade['availableDvDiscounts$']);
    });

    it('should get getAvailableEmployeeDiscounts data', () => {
      expect(discountFacade.getAvailableEmployeeDiscounts()).toEqual(discountFacade['availableEmployeeDiscounts$']);
    });

    it('should get getAvailableTsssDiscounts data', () => {
      expect(discountFacade.getAvailableTsssDiscounts()).toEqual(discountFacade['availableTsssDiscounts$']);
    });

    it('should get getAvailableTataEmployeeDiscounts data', () => {
      expect(discountFacade.getAvailableTataEmployeeDiscounts()).toEqual(discountFacade['availableTataEmployeeDiscount$']);
    });

    it('should get getAvailableEmpowermentDiscounts data', () => {
      expect(discountFacade.getAvailableEmpowermentDiscounts()).toEqual(discountFacade['availableEmpowermentDiscounts$']);
    });

    it('should get getIsLoadingAvailableDiscounts data', () => {
      expect(discountFacade.getIsLoadingAvailableDiscounts()).toEqual(discountFacade['isLoadingAvailableDiscount$']);
    });

    it('should get getIsTransactionLevelDiscountApplied data', () => {
      expect(discountFacade.getIsTransactionLevelDiscountApplied()).toEqual(discountFacade['isTransactionLevelDiscountApplied$']);
    });

    it('should get getAppliedTransactionLevelDiscounts data', () => {
      expect(discountFacade.getAppliedTransactionLevelDiscounts()).toEqual(discountFacade['appliedTransactionLevelDiscounts$']);
    });

    it('should get getAppliedBillLevelTransactionLevelDiscounts data', () => {
      expect(discountFacade.getAppliedBillLevelTransactionLevelDiscounts()).toEqual(discountFacade['appliedBillLevelTransactionLevelDiscounts$']);
    });

    it('should get getAppliedEmployeeLevelDiscounts data', () => {
      expect(discountFacade.getAppliedEmployeeLevelDiscounts()).toEqual(discountFacade['appliedEmployeeDiscounts$']);
    });

    it('should get getAppliedTSSSLevelDiscounts data', () => {
      expect(discountFacade.getAppliedTSSSLevelDiscounts()).toEqual(discountFacade['appliedTSSSDiscounts$']);
    });

    it('should get getAppliedTataEmployeeLevelDiscounts data', () => {
      expect(discountFacade.getAppliedTataEmployeeLevelDiscounts()).toEqual(discountFacade['appliedTataEmployeeDiscounts$']);
    });

    it('should get getAppliedSystemDvDiscounts data', () => {
      expect(discountFacade.getAppliedSystemDvDiscounts()).toEqual(discountFacade['appliedSystemDvDiscounts$']);
    });

    it('should get getAppliedSystemGhsDiscounts data', () => {
      expect(discountFacade.getAppliedSystemGhsDiscounts()).toEqual(discountFacade['appliedSystemGhsBonusDiscount$']);
    });

    it('should get getAppliedEmpowermentDiscounts data', () => {
      expect(discountFacade.getAppliedEmpowermentDiscounts()).toEqual(discountFacade['appliedEmpowermentDiscount$']);
    });

    it('should get getIsAllAppliedTransactionLevelDiscountsDeleted data', () => {
      expect(discountFacade.getIsAllAppliedTransactionLevelDiscountsDeleted()).toEqual(discountFacade['isAllAppliedTransactionLevelDiscountDeleted$']);
    });

    it('should get getIsSelectedTransactionLevelDiscountDeleted data', () => {
      expect(discountFacade.getIsSelectedTransactionLevelDiscountDeleted()).toEqual(discountFacade['isSelectedTransactionLevelDiscountDeleted$']);
    });

    it('should get getIsTransactionLevelDiscountUpdated data', () => {
      expect(discountFacade.getIsTransactionLevelDiscountUpdated()).toEqual(discountFacade['isTransactionLevelDiscountUpdated$']);
    });

    it('should get getIsRsoSelected data', () => {
      expect(discountFacade.getIsRsoSelected()).toEqual(discountFacade['isRsoSelected$']);
    });

    it('should get getIsTransactionLevelDiscountConfirmed data', () => {
      expect(discountFacade.getIsTransactionLevelDiscountConfirmed()).toEqual(discountFacade['isTransactionLevelDiscountConfirmed$']);
    });

    it('should get getTataCompanyList data', () => {
      expect(discountFacade.getTataCompanyList()).toEqual(discountFacade['tataCompanyList$']);
    });

    it('should get getEligibleItemsResponseForKaratOrCoinOffer data', () => {
      expect(discountFacade.getEligibleItemsResponseForKaratOrCoinOffer()).toEqual(discountFacade['eligibleItemsResponseForKaratOrCoinOffer$']);
    });

    it('should get getEligibleItemsResponseForGepPurityOfferOffer data', () => {
      expect(discountFacade.getEligibleItemsResponseForGepPurityOfferOffer()).toEqual(discountFacade['eligibleItemsResponseForGepPurityOffer$']);
    });

    it('should get getAppliedKaratorCoinOfferDiscountResponse data', () => {
      expect(discountFacade.getAppliedKaratorCoinOfferDiscountResponse()).toEqual(discountFacade['appliedKaratorCoinOfferDiscountResponse$']);
    });

    it('should get getDiscountVoucherDetails data', () => {
      expect(discountFacade.getDiscountVoucherDetails()).toEqual(discountFacade['discountVoucherDetails$']);
    });

    it('should get getIsRefresh data', () => {
      expect(discountFacade.getIsRefresh()).toEqual(discountFacade['refreshDiscountAndOffersPanel$']);
    });

    it('should get getCheckABCOEligibilityRes data', () => {
      expect(discountFacade.getCheckABCOEligibilityRes()).toEqual(discountFacade['checkABCOEligibility$']);
    });

    it('should get getLoadABCODiscountsRes data', () => {
      expect(discountFacade.getLoadABCODiscountsRes()).toEqual(discountFacade['loadABCODiscountsRes$']);
    });

    it('should get getLoadNewABCODiscountsRes data', () => {
      expect(discountFacade.getLoadNewABCODiscountsRes()).toEqual(discountFacade['loadNewABCODiscountsRes$']);
    });

    it('should get getLoadABCODiscountDetailsRes data', () => {
      expect(discountFacade.getLoadABCODiscountDetailsRes()).toEqual(discountFacade['loadABCODiscountDetailsRes$']);
    });

    it('should get getLoadABCOConfigDetailsRes data', () => {
      expect(discountFacade.getLoadABCOConfigDetailsRes()).toEqual(discountFacade['loadABCOConfigDetailsRes$']);
    });

    it('should get getLoadAutoDiscountsRes data', () => {
      expect(discountFacade.getLoadAutoDiscountsRes()).toEqual(discountFacade['loadAutoDiscountsRes$']);
    });

    it('should get getIsAutoDiscLoading data', () => {
      expect(discountFacade.getIsAutoDiscLoading()).toEqual(discountFacade['isAutoDiscLoading$']);
    });

    it('should get getIsABDropdownLoading data', () => {
      expect(discountFacade.getIsABDropdownLoading()).toEqual(discountFacade['isABDropdownLoading$']);
    });

    it('should get getIsReloadDiscountsGrid data', () => {
      expect(discountFacade.getIsReloadDiscountsGrid()).toEqual(discountFacade['reloadDiscountsGrid$']);
    });

    it('should get getIsClearEncircle data', () => {
      expect(discountFacade.getIsClearEncircle()).toEqual(discountFacade['clearEncircle$']);
    });

    it('should get getOrderDiscDetails data', () => {
      expect(discountFacade.getOrderDiscDetails()).toEqual(discountFacade['getOrderDiscDetails$']);
    });

    it('should get getRivaahGHSDiscounts data', () => {
      expect(discountFacade.getRivaahGHSDiscounts()).toEqual(discountFacade['rivaahGHSDiscounts$']);
    });

    it('should get getSaveRivaahGHSDiscountsResponse data', () => {
      expect(discountFacade.getSaveRivaahGHSDiscountsResponse()).toEqual(discountFacade['saveRivaahGHSDiscountsResponse$']);
    });

    it('should get getEnableCalculateRivaahGHSDiscounts data', () => {
      expect(discountFacade.getEnableCalculateRivaahGHSDiscounts()).toEqual(discountFacade['enableCalculateRivaahGHSDiscounts$']);
    });

    it('should get getReasonForChangingDiscounts data', () => {
      expect(discountFacade.getReasonForChangingDiscounts()).toEqual(discountFacade['reasonForChangingDiscounts$']);
    });

    it('should get getReasonForNotGivingDiscounts data', () => {
      expect(discountFacade.getReasonForNotGivingDiscounts()).toEqual(discountFacade['reasonForNotGivingDiscounts$']);
    });
  });
});
