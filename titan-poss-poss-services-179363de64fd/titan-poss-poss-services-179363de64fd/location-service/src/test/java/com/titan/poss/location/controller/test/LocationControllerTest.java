package com.titan.poss.location.controller.test;

import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.test.AuthUtil;
import com.titan.poss.location.dto.LocationDto;
import com.titan.poss.location.dto.request.LocationPriceGroupDto;
import com.titan.poss.location.dto.request.LocationUpdateDto;
import com.titan.poss.location.dto.request.PriceGroupMapCreateDto;
import com.titan.poss.location.test.LocationBase;

class LocationControllerTest extends LocationBase {

	private static HttpHeaders headers1 = new HttpHeaders();

	@BeforeAll
	public static void initAuthUser() {
		headers1.add("Authorization", "Bearer " + AuthUtil.getAuthToken("commercial", "welcome123"));
	}

	@ParameterizedTest
	@CsvSource({ "ANP,OK", "qwewq,BAD_REQUEST" })
	void testGetLocation(String locationCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("locations/" + locationCode),
				HttpMethod.GET, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "INR,OK,L1,BTQ", ",UNPROCESSABLE_ENTITY,L1,BTQ", "INR,BAD_REQUEST,L1,BTQ", "INR,BAD_REQUEST,L3,BTQ" })
	void testAddLocation(String currencyCode, String status, String ownerType, String locationType) {
		LocationDto locationDto = new LocationDto();

		String config = "{\"locationStepOne\":{\"locationDetails\":{\"subBrandName\":\"12345\"},\"personalDetails\":{\"phoneNumberTwo\":\"1234567890\",\"adressTwo\":\"\",\"name\":\"Avinash\",\"subRegion\":\"East1\"}},\"locationStepTwo\":{\"otherDetails\":{\"regdOffice\":\"14566\",\"cinNumber\":\"123\",\"corporateAddress\":\"123\",\"marketCode\":\"1\"},\"configurationDetails\":{\"checkBoxes\":{\"isPasswordMandatory\":true,\"iFeedbackAllowedForCM\":true,\"isFeedbackAllowedForAssm\":true,\"isStuddedSplitAllowed\":true,\"enableCashDeposit\":true,\"enableChequeDeposit\":true,\"digitalSignatureEnable\":false}}},\"locationStepThree\":{\"remarks\":{\"remarks\":\"good\",\"SAPCode\":\"123\",\"paymentCodeForRefund\":\"1\"},\"locationCheckbox\":{\"locationCheckbox\":{\"isActive\":true}}},\"ghsStepOne\":{\"dayDetails\":{\"baseCurrency\":1,\"suspendingCNs\":\"12\",\"transferredCNs\":\"12\",\"activatedCNs\":\"12\",\"DDvalidityDays\":\"12\",\"consolidateAttempts\":\"12\",\"realisationDays\":\"12\",\"validityDays\":\"12\"}},\"ghsStepTwo\":{\"ghsIbtCheckBox\":{\"isConsentLetterUploadMandatory\":true,\"isClubbingGHSMandatory\":true,\"eGHSRedemption\":true,\"eGHSRevenue\":true}},\"printStepOne\":{\"checkItOut1\":{\"printMakingCharges\":true,\"printPrice\":true,\"printStoneValue\":true,\"printWastageCharge\":true,\"printWastageComponent\":true,\"printWastagePercent\":true},\"makingWastageCharge\":\"12\",\"checkItOut2\":{\"printCashMemo\":true,\"printCustomerNumberinReport\":true,\"printGoldValue\":true,\"printGuaranteeCard\":true,\"printImage\":true,\"printOtherStoneWeightinAnnexure\":true,\"printOtherStoneWtinGuaranteeCard\":true,\"freeTextForGrams\":\"123\",\"noOfInvoicecopiesforRegularOrQuickCM\":\"123\"}},\"GRNIBTInventoryStepOne\":{\"GRNGRFConfiguration\":{\"noOfDaysGRNAllowed\":\"12\",\"maximumNoOfDaysForApprovedGRN\":\"12\",\"noOfDaysToProtectGoldRateForGRN\":\"12\",\"minimumUtilization\":\"12\",\"GRNGRFCheckBoxes\":{\"isGRFAllowed\":true,\"isInterBoutiqueGRNAllowed\":true,\"isGRFAllowedInCM\":true,\"isGRFAllowedInAdavnceBooking\":true,\"isGRFAllowedInCustomerOrder\":true}},\"inventory\":{\"maximumNoOfDaysForPhysicalReceiptDate\":\"12\",\"configurationAmountForStuddedSplit\":\"12\",\"maximumNoOfDaysForSTNCancellation\":\"12\",\"inventoryCheckBoxes\":{\"isAcceptTEP_GEP_DisputeStocks\":true,\"isStockTransferForBoutique\":true,\"isConversionRestricted\":true,\"isSTNcancellationAllowed\":true}},\"walkins\":{\"isWaliknsDetailsMandatory\":true,\"noOfDays\":\"12\",\"numberOfDaysToDisplay\":\"12\"}},\"GRNIBTInventoryStepTwo\":{\"KYCConfiguration\":{\"isUploadDocumentAllowed\":true,\"isDownloadDocumentAllowed\":true},\"ULPConfiguration\":{\"isEncirclePaymentAllowed\":true},\"IBTConfiguration\":{\"noOfTimesrequestedInCurrentMonth\":\"12\",\"totalValueRequestedInCurrentMonth\":\"12\",\"noOfItemsRequestedInCurrentMonth\":\"12\"}},\"loyalityStepOne\":{\"loyality\":{\"isSynchronised\":true,\"isBankingMandatory\":true},\"GVPayment\":{\"enableCNCancellationForGVPayment\":true,\"enableCNTarnsferForGVpayment\":true},\"personalDetails\":{\"GEPPureGoldPurity\":\"12\",\"GEPPureSilverPurity\":\"12\",\"GEPPurePlatinumPurity\":\"12\",\"GEPStandardDeductionGold\":\"12\",\"GEPStandardDeductionSilver\":\"12\",\"GEPStandardDeductionPlatinum\":\"12\",\"enableGEPSale\":true}},\"loyalityStepTwo\":{\"CCPayment\":{\"enableUniPay\":true},\"employeeDiscount\":{\"enableEmployeeDiscount\":true},\"giftCardConfiguration\":{\"maximumAmount\":\"12\",\"minimumAmount\":\"12\",\"multiplesValue\":\"12\",\"giftCardConfigurationCheckBoxes\":{\"isCardCancellationAllowed\":true,\"isCardInwardingAllowed\":true,\"isCardActivationAllowed\":true,\"isCardReedemAlowed\":true}}},\"loyalityStepThree\":{\"tep\":{\"noOfDaysForFVTPassword\":\"12\",\"enableRTGSrefund\":true}},\"advanceStepOne\":{\"advanceCustomOrderConfiguration\":{\"advanceCustomOrderStepOneCheckBox\":{\"cancellationAllowedforAdvanceBooking\":true,\"cancellationAllowedforCustomerOrder\":true,\"activateAllowedforAdvanceBooking\":true,\"activateAllowedforCustomerOrder\":true,\"printMandatoryFieldsInReport\":true},\"validityDaysforAutoClosureInAdvanceBooking\":\"12\",\"validityDaysforActivateInAdvanceBooking\":\"12\",\"validityDaysforReleaseInvInAdvancebooking\":\"12\",\"validityDaysforAutoClosureInCustomerOrder\":\"12\",\"validityDaysforActivateInCustomerOrder\":\"12\",\"validitydaysforReleaseInvInCustomerOrder\":\"12\",\"goldRateAttempts\":\"12\",\"manualBillWeightDeviation\":\"12\",\"sparewtToleranceforStockItem\":\"12\",\"servicewtToleranceforStockItem\":\"12\"}},\"advanceStepTwo\":{\"foc\":{\"advanceCustomOrderTabTwoFoccheckBoxes\":{\"bintobintransferallowedforFOCitems\":true,\"isTEPsaleableitemsallowedforFOC\":true,\"isTEPallowedforFOCitems\":true,\"isFOCitemssaleable\":true},\"maxWeightforFOC\":\"12\",\"maxValueforFOC\":\"12\"},\"rtgs\":{\"advanceCustomOrderTabTwoRtgscheckBoxes\":{\"enableRTGSPayment\":true},\"maxNoofCN\":\"12\",\"minOTPCNValue\":\"12\",\"OTPHelpdeskEmailId\":\"ramaiit@gmail.com\",\"maxNoofdaysforPOLikelyDate\":\"12\",\"serviceTaxGSTRegistrationno\":\"12\"}},\"advanceStepThree\":{\"otpConfigurations\":{\"advanceCustomOrderTabThreecheckBoxes\":{\"isOTPallowedASSM\":true,\"isOTPallowedCM\":true,\"isOTPallowedAdvance\":true,\"isOTPallowedAB\":true,\"isOTPallowedGHS\":true,\"isOTPallowedCO\":true,\"isOTPrequiredforGC\":true}},\"configurePaymentMode\":{\"configurePaymentModeCheckBoxes\":{\"configurePaymentModeCheckBoxes\":{\"isApplicableforLocation\":true,\"isApplicableforReversal\":true}},\"paymentCode\":\"123\"},\"locationPriceMapping\":{\"priceGroupTypeCode\":\"123\",\"priceGroupCode\":\"1\"}}}";
		Object obj = MapperUtil.getJsonFromString(config);
		StoreDetails configDetails = (StoreDetails) MapperUtil.getObjectMapping(obj, new StoreDetails());
		locationDto.setBaseCurrency(currencyCode);
		locationDto.setBrandCode("Tanishq");
		locationDto.setCfaCodeValue(generateString(4));
		// locationDto.setStoreDetails(configDetails);
		locationDto.setCountryCode("IND");
		locationDto.setDescription("FHJR");
		if (status.equals("BAD_REQUEST") && ownerType.equals("L3"))
			locationDto.setFactoryCodeValue(generateString(4));
		else if (status.equals("BAD_REQUEST"))
			locationDto.setFactoryCodeValue(generateString(4));
		else
			locationDto.setFactoryCodeValue("ANP");
		locationDto.setLocationTypeCode(locationType);
		locationDto.setLocationCode(locationDto.getCfaCodeValue());
//		locationDto.setFax(generateString(3));
		locationDto.setIsActive(false);

		locationDto.setLocationFormat("MICF");
		locationDto.setMarketCode("KA");
		locationDto.setMasterCurrency("INR");
		locationDto.setOwnerTypeCode(ownerType);
		locationDto.setPaymentCurrencies("INR");
		locationDto.setRegionCode("South");
//		locationDto.setStateId(1);
		locationDto.setSubBrandCode(generateString(4));
		locationDto.setStockCurrency("INR");
		locationDto.setSubRegionCode("South");
//		locationDto.setTownId(1);

		HttpEntity<LocationDto> entity = new HttpEntity<>(locationDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("locations"), HttpMethod.POST, entity,
				String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "$$$,BAD_REQUEST", "TST4,UNPROCESSABLE_ENTITY", "ANP,OK" })
	void testUpdateLocation(String locationCode, String status) {
		LocationUpdateDto locationUpdateDto = new LocationUpdateDto();
		StoreDetails configDetails = new StoreDetails();
		String config = "{\"locationStepOne\":{\"locationDetails\":{\"subBrandName\":\"12345\"},\"personalDetails\":{\"phoneNumberTwo\":\"1234567890\",\"adressTwo\":\"\",\"name\":\"Avinash\",\"subRegion\":\"East1\"}},\"locationStepTwo\":{\"otherDetails\":{\"regdOffice\":\"14566\",\"cinNumber\":\"123\",\"corporateAddress\":\"123\",\"marketCode\":\"1\"},\"configurationDetails\":{\"checkBoxes\":{\"isPasswordMandatory\":true,\"iFeedbackAllowedForCM\":true,\"isFeedbackAllowedForAssm\":true,\"isStuddedSplitAllowed\":true,\"enableCashDeposit\":true,\"enableChequeDeposit\":true,\"digitalSignatureEnable\":false}}},\"locationStepThree\":{\"remarks\":{\"remarks\":\"good\",\"SAPCode\":\"123\",\"paymentModeForRefund\":\"1\"},\"locationCheckbox\":{\"locationCheckbox\":{\"isActive\":true}}},\"ghsStepOne\":{\"dayDetails\":{\"baseCurrency\":1,\"suspendingCNs\":\"12\",\"transferredCNs\":\"12\",\"activatedCNs\":\"12\",\"DDvalidityDays\":\"12\",\"consolidateAttempts\":\"12\",\"realisationDays\":\"12\",\"validityDays\":\"12\"}},\"ghsStepTwo\":{\"ghsIbtCheckBox\":{\"isConsentLetterUploadMandatory\":true,\"isClubbingGHSMandatory\":true,\"eGHSRedemption\":true,\"eGHSRevenue\":true}},\"printStepOne\":{\"checkItOut1\":{\"printMakingCharges\":true,\"printPrice\":true,\"printStoneValue\":true,\"printWastageCharge\":true,\"printWastageComponent\":true,\"printWastagePercent\":true},\"makingWastageCharge\":\"12\",\"checkItOut2\":{\"printCashMemo\":true,\"printCustomerNumberinReport\":true,\"printGoldValue\":true,\"printGuaranteeCard\":true,\"printImage\":true,\"printOtherStoneWeightinAnnexure\":true,\"printOtherStoneWtinGuaranteeCard\":true,\"freeTextForGrams\":\"123\",\"noOfInvoicecopiesforRegularOrQuickCM\":\"123\"}},\"GRNIBTInventoryStepOne\":{\"GRNGRFConfiguration\":{\"noOfDaysGRNAllowed\":\"12\",\"maximumNoOfDaysForApprovedGRN\":\"12\",\"noOfDaysToProtectGoldRateForGRN\":\"12\",\"minimumUtilization\":\"12\",\"GRNGRFCheckBoxes\":{\"isGRFAllowed\":true,\"isInterBoutiqueGRNAllowed\":true,\"isGRFAllowedInCM\":true,\"isGRFAllowedInAdavnceBooking\":true,\"isGRFAllowedInCustomerOrder\":true}},\"inventory\":{\"maximumNoOfDaysForPhysicalReceiptDate\":\"12\",\"configurationAmountForStuddedSplit\":\"12\",\"maximumNoOfDaysForSTNCancellation\":\"12\",\"inventoryCheckBoxes\":{\"isAcceptTEP_GEP_DisputeStocks\":true,\"isStockTransferForBoutique\":true,\"isConversionRestricted\":true,\"isSTNcancellationAllowed\":true}},\"walkins\":{\"isWaliknsDetailsMandatory\":true,\"noOfDays\":\"12\",\"numberOfDaysToDisplay\":\"12\"}},\"GRNIBTInventoryStepTwo\":{\"KYCConfiguration\":{\"isUploadDocumentAllowed\":true,\"isDownloadDocumentAllowed\":true},\"ULPConfiguration\":{\"isEncirclePaymentAllowed\":true},\"IBTConfiguration\":{\"noOfTimesrequestedInCurrentMonth\":\"12\",\"totalValueRequestedInCurrentMonth\":\"12\",\"noOfItemsRequestedInCurrentMonth\":\"12\"}},\"loyalityStepOne\":{\"loyality\":{\"isSynchronised\":true,\"isBankingMandatory\":true},\"GVPayment\":{\"enableCNCancellationForGVPayment\":true,\"enableCNTarnsferForGVpayment\":true},\"personalDetails\":{\"GEPPureGoldPurity\":\"12\",\"GEPPureSilverPurity\":\"12\",\"GEPPurePlatinumPurity\":\"12\",\"GEPStandardDeductionGold\":\"12\",\"GEPStandardDeductionSilver\":\"12\",\"GEPStandardDeductionPlatinum\":\"12\",\"enableGEPSale\":true}},\"loyalityStepTwo\":{\"CCPayment\":{\"enableUniPay\":true},\"employeeDiscount\":{\"enableEmployeeDiscount\":true},\"giftCardConfiguration\":{\"maximumAmount\":\"12\",\"minimumAmount\":\"12\",\"multiplesValue\":\"12\",\"giftCardConfigurationCheckBoxes\":{\"isCardCancellationAllowed\":true,\"isCardInwardingAllowed\":true,\"isCardActivationAllowed\":true,\"isCardReedemAlowed\":true}}},\"loyalityStepThree\":{\"tep\":{\"noOfDaysForFVTPassword\":\"12\",\"enableRTGSrefund\":true}},\"advanceStepOne\":{\"advanceCustomOrderConfiguration\":{\"advanceCustomOrderStepOneCheckBox\":{\"cancellationAllowedforAdvanceBooking\":true,\"cancellationAllowedforCustomerOrder\":true,\"activateAllowedforAdvanceBooking\":true,\"activateAllowedforCustomerOrder\":true,\"printMandatoryFieldsInReport\":true},\"validityDaysforAutoClosureInAdvanceBooking\":\"12\",\"validityDaysforActivateInAdvanceBooking\":\"12\",\"validityDaysforReleaseInvInAdvancebooking\":\"12\",\"validityDaysforAutoClosureInCustomerOrder\":\"12\",\"validityDaysforActivateInCustomerOrder\":\"12\",\"validitydaysforReleaseInvInCustomerOrder\":\"12\",\"goldRateAttempts\":\"12\",\"manualBillWeightDeviation\":\"12\",\"sparewtToleranceforStockItem\":\"12\",\"servicewtToleranceforStockItem\":\"12\"}},\"advanceStepTwo\":{\"foc\":{\"advanceCustomOrderTabTwoFoccheckBoxes\":{\"bintobintransferallowedforFOCitems\":true,\"isTEPsaleableitemsallowedforFOC\":true,\"isTEPallowedforFOCitems\":true,\"isFOCitemssaleable\":true},\"maxWeightforFOC\":\"12\",\"maxValueforFOC\":\"12\"},\"rtgs\":{\"advanceCustomOrderTabTwoRtgscheckBoxes\":{\"enableRTGSPayment\":true},\"maxNoofCN\":\"12\",\"minOTPCNValue\":\"12\",\"OTPHelpdeskEmailId\":\"ramaiit@gmail.com\",\"maxNoofdaysforPOLikelyDate\":\"12\",\"serviceTaxGSTRegistrationno\":\"12\"}},\"advanceStepThree\":{\"otpConfigurations\":{\"advanceCustomOrderTabThreecheckBoxes\":{\"isOTPallowedASSM\":true,\"isOTPallowedCM\":true,\"isOTPallowedAdvance\":true,\"isOTPallowedAB\":true,\"isOTPallowedGHS\":true,\"isOTPallowedCO\":true,\"isOTPrequiredforGC\":true}},\"configurePaymentMode\":{\"configurePaymentModeCheckBoxes\":{\"configurePaymentModeCheckBoxes\":{\"isApplicableforLocation\":true,\"isApplicableforReversal\":true}},\"paymentCode\":\"123\"},\"locationPriceMapping\":{\"priceGroupTypeCode\":\"123\",\"priceGroupCode\":\"1\"}}}";
		Object obj = MapperUtil.getJsonFromString(config);
		configDetails = (StoreDetails) MapperUtil.getObjectMapping(obj, new StoreDetails());
		locationUpdateDto.setBaseCurrency("INR");
		locationUpdateDto.setBrandCode("Tanishq");
		locationUpdateDto.setCfaCodeValue("ANP");
		locationUpdateDto.setCountryCode("IND");
		locationUpdateDto.setDescription("ANP");
		locationUpdateDto.setFactoryCodeValue("ANP");
		locationUpdateDto.setFax(generateString(3));
		locationUpdateDto.setIsActive(false);
		locationUpdateDto.setLocationFormat("MICF");
		if (status.equals("UNPROCESSABLE_ENTITY"))
			locationUpdateDto.setLocationTypeCode("#");
		else
			locationUpdateDto.setLocationTypeCode("BTQ");
		locationUpdateDto.setMarketCode("KA");
		locationUpdateDto.setMasterCurrency("INR");
		locationUpdateDto.setOwnerTypeCode("L1");
		locationUpdateDto.setPaymentCurrencies("INR");
		locationUpdateDto.setRegionCode("South");
//		locationUpdateDto.setStateId(1);
		locationUpdateDto.setSubBrandCode(generateString(4));
		locationUpdateDto.setStockCurrency("INR");
		locationUpdateDto.setSubRegionCode("South");
//		locationUpdateDto.setTownId(1);

		HttpEntity<LocationUpdateDto> entity = new HttpEntity<>(locationUpdateDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("locations/" + locationCode),
				HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testCopyLocation() {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("locations/clone?dstLocationCode=" + generateString(4) + "&srcLocationCode=PLVD"),
				HttpMethod.POST, entity, String.class);

		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

	@ParameterizedTest
	@CsvSource({ "ANP,BAD_REQUEST", "PLVD,OK" })
	void testActivateLocation(String locationCode, String status) {
		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("locations/" + locationCode + "/activate"), HttpMethod.PATCH, entity, String.class);

		assertTrue(response.getStatusCode().name().equals(status));
	}

	@ParameterizedTest
	@CsvSource({ "ANP,OK", "$$$$,BAD_REQUEST" })
	void testListLocationPriceGroupMapping(String locationCode, String status) {

		HttpEntity<String> entity = new HttpEntity<>(null, headers1);
		ResponseEntity<String> response = restTemplate.exchange(
				createURLWithPort("locations/" + locationCode + "/price-groups"), HttpMethod.GET, entity, String.class);
		assertTrue(response.getStatusCode().name().equals(status));
	}

	@Test
	void testLocationPriceGroupMapping() {

		LocationPriceGroupDto locationPriceGroupDto = new LocationPriceGroupDto();

		Set<PriceGroupMapCreateDto> addPriceGroup = new HashSet<>();

		PriceGroupMapCreateDto priceGroupMapDto = new PriceGroupMapCreateDto();
		priceGroupMapDto.setPriceGroup(generateString(3));
		priceGroupMapDto.setPricingGroupType(generateString(3));

		addPriceGroup.add(priceGroupMapDto);

		locationPriceGroupDto.setAddPriceGroup(addPriceGroup);

		HttpEntity<LocationPriceGroupDto> entity = new HttpEntity<>(locationPriceGroupDto, headers1);
		ResponseEntity<String> response = restTemplate.exchange(createURLWithPort("locations/ANP/price-groups"),
				HttpMethod.PATCH, entity, String.class);
		assertTrue(response.getStatusCode().equals(HttpStatus.OK));
	}

}
