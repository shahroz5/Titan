import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { LocationSettingsService } from '../location-settings.service';
import { LocationSettingsEffect } from './location-settings.effect';
import { LocationSettingDetails } from '@poss-web/shared/models';
import {
  LoadLocationSettings,
  LoadLocationSettingsFailure,
  LoadLocationSettingsSuccess
} from './location-settings.actions';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

describe('Location Settings record Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: LocationSettingsEffect;
  const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
    'httpClient',
    ['get']
  );
  const initialState = {};
  const locationSettingsServiceSpy = jasmine.createSpyObj<
    LocationSettingsService
  >('LocationSettingsService', ['loadLocationSettings']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationSettingsEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        {
          provide: HttpClient,
          useValue: httpClientSpy
        },
        {
          provide: LocationSettingsService,
          useValue: locationSettingsServiceSpy
        }
      ]
    });
    effect = TestBed.inject(LocationSettingsEffect);
  });

  describe('loadLocationSettings', () => {
    const requestPayload = {
      isBTQUser: true,
      countryName: 'IND'
    };

    const locationSettingDetailsResponse: LocationSettingDetails = {
      factory_locationCode: '',
      factory_brandCode: '',
      factory_townId: '',
      factory_townName: '',
      factory_stateId: '',
      factory_stateName: '',
      factory_regionCode: '',
      factory_locationTypeCode: '',
      factory_locationFormat: '',
      factory_isActive: null,
      factory_description: '',
      factory_marketCode: '',
      factory_countryCode: '',
      factory_ownerTypeCode: '',
      factory_factoryCodeValue: '',
      factory_fax: '',
      factory_cfaCodeValue: '',
      factory_subRegionCode: '',
      factory_subBrandCode: '',
      factory_remarks: null,
      factory_baseCurrency: '',
      factory_stockCurrency: '',
      factory_masterCurrency: '',
      factory_paymentCurrencies: '',

      cfa_locationCode: '',
      cfa_brandCode: '',
      cfa_townId: '',
      cfa_townName: '',
      cfa_stateId: '',
      cfa_stateName: '',
      cfa_regionCode: '',
      cfa_locationTypeCode: '',
      cfa_locationFormat: '',
      cfa_isActive: null,
      cfa_description: '',
      cfa_marketCode: '',
      cfa_countryCode: '',
      cfa_ownerTypeCode: '',
      cfa_factoryCodeValue: null,
      cfa_fax: '',
      cfa_cfaCodeValue: null,
      cfa_subRegionCode: '',
      cfa_subBrandCode: '',
      cfa_remarks: '',
      cfa_baseCurrency: '',
      cfa_stockCurrency: '',
      cfa_masterCurrency: '',
      cfa_paymentCurrencies: '',

      country_countryCode: '',
      country_description: '',
      country_isActive: null,
      country_currencyCode: '',
      country_dateFormat: '',
      country_locale: '',
      country_phoneLength: null,
      country_fiscalYear: null,
      country_timeFormat: '',
      country_isdCode: '',
      country_fiscalYearEnd: '',
      country_fiscalYearStart: '',
      country_lastModifiedDate: null,
      country_weightUnit: '',
      country_stoneWeightUnit: '',

      baseCurrency_currencyCode: '',
      baseCurrency_currencySymbol: '',
      baseCurrency_description: '',
      baseCurrency_unicode: '',
      baseCurrency_isActive: null,
      baseCurrency_lastModifiedDate: null,

      store_companyName: '',
      store_addressLines: null,
      store_phoneNumber1: '',
      store_phoneNumber2: '',
      store_contactNumber: '',
      store_corporateAddress: '',
      store_cinNumber: '',
      store_isWalkInsDetailsMandatory: null,
      store_pincode: '',
      store_boutiqueEmailId: '',
      store_noOfDays: null,
      store_numberOfDaysToDisplay: null,
      store_regdOffice: '',
      store_maxRateRetryAttempt: null,
      store_isDial: null,

      print_freeTextForGrams: '',
      print_noOfInvoicecopiesforRegularOrQuickCM: '',
      print_invoiceType: '',
      print_mcOrWastageExpense: '',
      print_printWastageComponent: null,
      print_printWastagePercent: null,
      print_printWastageCharge: null,
      print_printStoneValue: null,
      print_printGoldValue: null,
      print_printPrice: null,
      print_isMCAndWastage: null,
      print_isDisplayWastagePercent: null,
      print_isVariablePrice: null,
      print_printMakingCharges: null,
      print_printCustomerNumberinReport: null,
      print_printCashMemo: null,
      print_printGuaranteeCard: null,
      print_printOtherStoneWtinGuaranteeCard: null,
      print_printOtherStoneWeightinAnnexure: null,
      print_printImage: null,

      cn_suspendingCNs: '',
      cn_transferredCNs: '',
      cn_activatedCNs: '',
      cn_maxNoOfCN: '',
      cn_otpForMinCN: '',
      cn_maxNoOfTimesCNinEGHS: '',
      cn_isEmployeeLoanCNCancel: null,
      cn_isEmployeeLoanCNTransfer: null,

      tax_isGST: null,
      tax_gstRegisterationNo: '',
      tax_gstValidFrom: '',
      tax_gstPrintValidFrom: '',

      cm_isBillCancelApprovalRequired: null,
      cm_maxNoOfHoursForBillCancel: '',
      cm_isTitle: null,
      cm_isMobileAndEmailMandatoryForCorrection: null,
      cm_isEditWeightAllowed: null,
      cm_isMobileAndEmail: null,
      cm_cmHoldTimeInMinutes: '',
      cm_noOfHoursForOpenTaskDeletionCM: '',

      grn_noOfDaysGRNAllowed: '',
      grn_maximumNoOfDaysForApprovedGRN: '',
      grn_noOfDaysToProtectGoldRateForGRN: '',
      grn_minUtilizationPercentForGRN: '',
      grn_isInterBoutiqueGRNAllowed: null,
      grn_isGRNAllowedInCM: null,

      grf_minimumUtilization: '',
      grf_isGRFAllowed: null,
      grf_isGRFAllowedInCM: null,
      grf_isGRFAllowedInAdvanceBooking: null,
      grf_isGRFAllowedInCustomerOrder: null,
      grf_isMergeCNAllowed: null,
      grf_currentOwner: null,
      grf_thirdPerson: null,

      gep_enableGEPSale: null,
      gep_gepPureGoldPurity: '',
      gep_gepPurePlatinumPurity: '',
      gep_gepPureSilverPurity: '',
      gep_gepStandardDeductionGold: '',
      gep_gepStandardDeductionPlatinum: '',
      gep_gepStandardDeductionSilver: '',
      gep_noOfDaysGepCancel: '',
      gep_karatAcceptedForGEP: '',
      gep_isPreMeltingDetailsMandatory: null,
      gep_gepHoldTime: '',

      gc_maximumAmount: '',
      gc_minimumAmount: '',
      gc_multiplesValue: '',
      gc_isCardCancellationAllowed: null,
      gc_isCardInwardingAllowed: null,
      gc_isCardActivationAllowed: null,

      ab_cancellationAllowedforAdvanceBooking: null,
      ab_activateAllowedforAdvanceBooking: null,
      ab_requestApprovalForNonFrozenOrderCancel: null,
      ab_validityDaysforAutoClosureInAdvanceBooking: '',
      ab_validityDaysforActivateInAdvanceBooking: '',
      ab_validityDaysforReleaseInvInAdvancebooking: '',
      ab_minPercentToBePaidForFrozenOrder: '',
      ab_minPercentToBePaidForNonFrozenOrder: '',
      ab_abHoldTime: '',
      ab_noOfHoursForOpenTaskDeletion: '',

      co_cancellationAllowedforCustomerOrder: null,
      co_activateAllowedforCustomerOrder: null,
      co_validityDaysforAutoClosureInCustomerOrder: '',
      co_validitydaysforReleaseInvInCustomerOrder: '',
      co_maxNoofdaysforPOLikelyDate: '',

      ghs_grammageCNTransfer: null,
      ghs_isConsentLetterUploadMandatory: null,
      ghs_isClubbingGHSAccRestricted: null,
      ghs_isEghsMandatory: null,
      ghs_isOtpRequired: null,
      ghs_noOfDaysForSuspendingGhs: '',
      ghs_consolidateAttempts: '',
      ghs_gracePeriodAfterSuspenededGhs: '',
      ghs_isGHSRedemptionAllowed: null,

      inv_isIssueToFactory: null,
      inv_isIssueToMerchandise: null,
      inv_isIssueToOtherBoutique: null,
      inv_isIssueToTEP: null,
      inv_isIssueToGEP: null,
      inv_isIssueDefective: null,
      inv_isIssueOthers: null,
      inv_maximumNoOfDaysForPhysicalReceiptDate: '',
      inv_maximumNoOfDaysForSTNCancellation: '',
      inv_isConversionRestricted: null,
      inv_isSTNcancellationAllowed: null,
      inv_isStuddedSplitAllowed: null,
      inv_sparewtToleranceforStockItem: '',
      inv_servicewtToleranceforStockItem: '',

      banking_isBankingMandatory: null,
      banking_isPasswordMandatory: null,
      banking_enableCashDeposit: null,
      banking_enableChequeDeposit: null,
      banking_remarksForPassword: null,
      banking_sapCode: '',
      banking_paymentMode: '',

      otp_isOTPallowedASSM: null,
      otp_isOTPallowedCM: null,
      otp_isOTPallowedAdvance: null,
      otp_isOTPallowedAB: null,
      otp_isOTPallowedGHS: null,
      otp_isOTPallowedCO: null,
      otp_isOTPrequiredforGC: null,
      otp_isOTPrequiredforGHSRedemption: null,
      otp_otpHelpDeskEmailId: '',

      customer_isUploadDocumentAllowed: null,
      customer_isDownloadDocumentAllowed: null,
      customer_isDocumentDisplayForCC: null,
      customer_isEmailForEncircleCustomer: null,
      customer_isMobileNoForOneTimeCustomer: null,
      customer_isEmailForOneTimeCustomer: null,
      customer_isMobileNoForInstitutionalCustomer: null,
      customer_isEmailForInstitutionalCustomer: null,
      customer_isMobileNoForInternationalCustomer: null,
      customer_isEmailForInternationalCustomer: null,

      digigold_digiGoldDiscountPercent: '',
      digigold_isCNCancelAllowedForDigiGold: null,
      digigold_isCNCancelAllowedForNonDigiGold: null,
      digigold_isCNPartialRedemptionAllowedForDigiGold: null,
      digigold_isCNTransferAllowedForDigiGold: null,
      digigold_isCNTransferAllowedForNonDigiGold: null,

      payment_chequeValidityDays: '',
      payment_ddValidityDays: '',
      payment_realisationDays: '',
      payment_isUlpAllowed: null,
      payment_enableCNCancellationForGVPayment: null,
      payment_enableCNTarnsferForGVpayment: null,
      payment_isMultipleGVAllowed: null,
      payment_approvedRORequestDeletion: '',
      payment_pendingRORequestDeletion: '',
      payment_enableRtgsPayment: null,
      payment_isRRNumberValidation: null,
      payment_maximumAmount: '',
      payment_minimumAmount: '',
      payment_noOfDaysForChequeOrDDAcceptance: '',
      payment_isROApprovedByWorkflow: null,
      payment_isEnableAirpayForIntegration: null,
      payment_isEnableUnipayForIntegration: null,

      offer_maxWeightforFOC: '',
      offer_maxValueforFOC: '',
      offer_bintobintransferallowedforFOCitems: null,
      offer_isTEPsaleableitemsallowedforFOC: null,
      offer_isTEPallowedforFOCitems: null,
      offer_isFOCitemssaleable: null,
      offer_isEmployeeDiscount: null,

      global_locationCode: '',
      global_description: '',
      global_fax: null,
      global_locationTypeCode: '',
      global_townId: '',
      global_stateId: '',
      global_regionCode: '',
      global_ownerTypeCode: '',
      global_factoryCodeValue: '',
      global_locationFormat: '',
      global_brandCode: null,
      global_isActive: null,
      global_cfaCodeValue: '',
      global_stockCurrency: '',
      global_masterCurrency: '',
      global_paymentCurrencies: '',
      global_marketCode: '',
      global_subRegionCode: '',
      global_subBrandCode: '',

      tep_tepHoldTime: '',

      isEncirclePaymentAllowed: null
    };

    it('should Load Location Settings Details', () => {
      const action = new LoadLocationSettings(requestPayload);
      const outCome = new LoadLocationSettingsSuccess(
        locationSettingDetailsResponse
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: locationSettingDetailsResponse });
      locationSettingsServiceSpy.loadLocationSettings.and.returnValue(
        response$
      );
      const expected$ = cold('--b', { b: outCome });
      expect(effect.loadLocationSettings$).toBeObservable(expected$);
    });
    it('should fail and return an action with the error', () => {
      const action = new LoadLocationSettings(requestPayload);
      const error = new Error('some error');
      const outCome = new LoadLocationSettingsFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      locationSettingsServiceSpy.loadLocationSettings.and.returnValue(
        response$
      );
      const expected = cold('--b', { b: outCome });
      expect(effect.loadLocationSettings$).toBeObservable(expected);
    });
  });
});
