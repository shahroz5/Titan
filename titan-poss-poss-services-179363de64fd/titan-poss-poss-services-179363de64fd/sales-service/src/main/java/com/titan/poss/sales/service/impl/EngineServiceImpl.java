/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.DiscountApplicableForItemCheckRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListResponseDto;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsResponseDto;
import com.titan.poss.core.discount.dto.ExchangeOfferRequestDto;
import com.titan.poss.core.discount.dto.ExchangeOfferResponseDto;
import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationRequest;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationResponse;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountRequestDto;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.DiscountApplicableForItemResponseDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.GepRequestDetail;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.service.EngineService;

/**
 * Service interface for Customer.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesEngineService")
public class EngineServiceImpl implements EngineService {

	@Autowired
	EngineServiceClient engineClient;

	@Override
	public Map<String, StandardPriceResponseDto> getMaterialPrices(String materialTypeCode) {

		return engineClient.getMaterialRateNew(materialTypeCode);
	}

	@Override
	public Map<String, StandardPriceResponseDto> getStandardMetalRate() {

		return engineClient.getStandardMetalRate();
	}

	@Override
	public CountryDetailsDto getCountryDetails(String locationCode) {

		return engineClient.getCountryDetails(locationCode);
	}

	@Override
	public CountryDetailsDto getCountryDetails() {

		CountryDetailsDto countryDetails = engineClient.getCountryDetails(null);
		JsonUtils.validateDto(countryDetails, SalesConstants.ERR_CORE_036,
				SalesConstants.INCORRECT_DATA_DEFINED_IN_DATABASE);

		return countryDetails;
	}

	@Override
	public LovDto getLov(String lovType) {

		return engineClient.getLov(lovType);
	}

	@Override
	public ConfigDetailsLocationMappingDto getValidPaymentCodes(String transactionType, String configType) {

		return engineClient.getConfig(transactionType, configType);
	}

	@Override
	public ListResponse<String> payeeBankList(String paymentCode) {

		return engineClient.getPayeeBankNames(paymentCode);
	}

	@Override
	public StorePrintDetailsDto getStorePrintInformation() {
		return engineClient.getStorePrintInformation();
	}

	@Override
	public PaymentProductGroupDto getProductGroups(String paymentCode, String cardNumber) {

		return engineClient.getProductGroups(paymentCode, cardNumber);
	}

	@Override
	public PriceResponseDto getPriceDetails(OrdersPriceRequest orderPriceRequest) {

		return engineClient.getPriceDetails(orderPriceRequest);
	}

	@Override
	public void checkWeightToleranceValue(String productGroupCode, BigDecimal availableWeight,
			BigDecimal measuredWeight, short availableQuantity, short measuredQuantity) {

		engineClient.checkWeightToleranceValue(productGroupCode, availableWeight, measuredWeight, availableQuantity,
				measuredQuantity);

	}

	@Override
	public List<InventoryItemDto> getInventoryItemLotDetails(String itemCode, String lotNumber) {

		return engineClient.getInventoryItemLotDetails(itemCode, lotNumber).getResults();
	}

	@Override
	public TaxCalculationResponseDto getTaxDetails(String destBtqLocationCode, Integer customerId, String txnType,
			String itemCode, Boolean isfullvalueTep, Boolean isIGST) {

		return engineClient.getTaxDetails(destBtqLocationCode, customerId,null, txnType, itemCode, isfullvalueTep, isIGST);
	}

	@Override
	public ListResponse<String> getDevices() {

		return engineClient.getDevices();
	}

	@Override
	public PayerBankDto getPayerBankDetails(String paymentCode) {

		return engineClient.getPayerBankDetails(paymentCode);
	}

	@Override
	public InventoryItemDto validateInventoryItem(String inventoryId, String itemCode) {
		return engineClient.validateInventoryItem(inventoryId, itemCode);

	}

	@Override
	public GepPriceResponseDto getGepPriceDetails(GepPriceRequest gepPriceRequest) {
		return engineClient.getGepPriceDetails(gepPriceRequest);
	}

	@Override
	public Object getGEPConfigDetails(GepRequestDetail gepRequestDetail) {
		return engineClient.getGEPConfigDetails(gepRequestDetail);
	}

	@Override
	public ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest) {

		return engineClient.getStandardHistoryPrice(metalPriceRequest);
	}

	@Override
	public CustomLotMasterDto generateLotNumber(String docTypeEnum) {

		return engineClient.generateLotNumber(docTypeEnum);
	}

	@Override
	public CustomerTransactionConfigDto getCustomerConfig(String customerType, String configType) {

		return engineClient.getCustomerConfig(customerType, configType);
	}

	@Override
	public PagedRestResponse<List<ItemDto>> getItems(ItemSearchRequestDto itemSearchRequestDto) {

		return engineClient.getItems(itemSearchRequestDto);
	}

	@Override
	public ListResponse<CoinDetailsDto> getCoinDetails(String itemCode, Boolean withSaleableCheck) {

		return engineClient.getCoinDetails(itemCode, withSaleableCheck);
	}

	@Override
	public Object getRuleFieldValues(RuleTypeEnum ruleType, RuleRequestListDto ruleRequestListDto) {

		Object response = engineClient.getRuleValues(ruleType.name(), ruleRequestListDto);
		if (response == null) {
			throw new ServiceException("Response is Empty.Please set Configurations for Rule:" + ruleType + " ",
					"Error-Code");
		}

		return response;
	}

	@Override
	public Object ruleValueMappingListBasedOnFilters(String ruleType, RuleRequestListDto ruleRequestListDto) {

		return engineClient.ruleValueMappingListBasedOnFilters(ruleType, ruleRequestListDto);
	}

	@Override
	public BrandDto getBrand(String brandCode) {

		return engineClient.getBrand(brandCode);
	}

	@Override
	public BrandDto getBrand() {

		return engineClient.getBrand(null);
	}

	@Override
	public ListResponse<String> getCashBackProductGroups(String offerId) {

		return engineClient.getCashBackProductGroups(offerId);
	}

	@Override
	public CashbackValueResponseDto getCashbackValue(String offerId, CashbackOfferRequestDto cbOfferDto) {

		return engineClient.getCashbackValue(offerId, cbOfferDto);
	}

	@Override
	public LocationCacheDto getStoreLocation(String locationCode) {

		return engineClient.getStoreLocation(locationCode);
	}

	@Override
	public TepItemResponseDto getTepItem(String itemCode, String customerMobileNo, String subTxnType) {
		return engineClient.getTepItem(itemCode, customerMobileNo, subTxnType);
	}

	@Override
	public TepPriceResponseDto getTepPriceDetails(TepPriceRequest tepPriceRequest) {
		return engineClient.getTepPriceDetails(tepPriceRequest);
	}

	@Override
	public Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes) {

		return engineClient.listItemDetails(itemCodes);
	}

	@Override
	public BusinessDayDto getBusinessDay(String locationCode) {
		return engineClient.getBusinessDay(locationCode);
	}

	@Override
	public Map<String, String> getProductGroupList(String isPlainStudded, String transactionType) {

		return engineClient.getProductGroupList(isPlainStudded, transactionType);
	}

	@Override
	public DiscountEngineResponseDto calculateDiscountValue(String discountId, String discountClubId,
			DiscountCalRequestDto discountCalDto) {
		return engineClient.calculateDiscountValue(discountId, discountClubId, discountCalDto);
	}

	@Override
	public BusinessDayDto getBusinessDayInProgress() {
		return engineClient.getBusinessDayInProgress(CommonUtil.getLocationCode());
	}

	@Override
	public DiscountDetailsBaseDto getDiscountConfigDetails(String discountId) {
		return engineClient.getDiscountConfigDetails(discountId);
	}

	@Override
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(String discountType,
			EligibleDiscountItemsRequestDto discountItemListDto) {

		return engineClient.getEligibleItemsForBillLevelDiscounts(discountType, discountItemListDto);
	}

	@Override
	public DiscountBillLevelResponseDto getDiscountsAtBillLevel(DiscountBillLevelRequestDto discountBillLevelRequest) {

		return engineClient.getDiscountsAtBillLevel(discountBillLevelRequest);
	}

	@Override
	public DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(
			DiscountItemDetailsListRequestDto discountItemListDto) {
		return engineClient.calculateDiscountValueforListOfItems(discountItemListDto);
	}

	@Override
	public TepValidationConfigDetails getTepCancelDetails(String tepType) {
		return engineClient.getTepCancelDetails(tepType);
	}

	@Override
	public ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(String discountType, String transactionType,
			ExchangeOfferRequestDto exchangeOfferRequestDto) {
		return engineClient.getExchangeOrCoinOfferDiscountDetails(discountType, transactionType,
				exchangeOfferRequestDto);
	}

	@Override
	public SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(String discountId,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest) {

		return engineClient.calculateDiscountValueForSlabBasedDiscounts(discountId, slabBasedDiscountRequest);
	}

	@Override
	public DiscountEngineResponseDto calculateAbDiscountValue(AbCoDiscountRequestDto abCoDiscountRequestDto) {

		return engineClient.calculateAbDiscountValue(abCoDiscountRequestDto);
	}

	@Override
	public SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto) {

		return engineClient.calculateAbCoDiscountValueForSlabBasedDiscounts(abCoSlabDiscountRequestDto);
	}

	@Override
	public ProductGroupDtoDigiGold getProductGroupsForDigiGold(ProductGroupDtoDigiGold productGroupCodeDigiGold) {
		return engineClient.getProductGroupsForDigiGold(productGroupCodeDigiGold);
	}

	@Override
	public GepPurityScemeValidationResponse validateGepPurityScheme(Boolean isRivaah,
			GepPurityScemeValidationRequest gepPurityScemeValidationRequest) {
		return engineClient.validateGepPurityScheme(isRivaah, gepPurityScemeValidationRequest);
	}

	@Override
	public FocSchemeIndividualDto getFocSchemeConfigById(String schemeId) {
		return engineClient.getFocSchemeConfigById(schemeId);
	}

	@Override
	public ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(
			FocSchemeRequestDto focSchemeRequestDto) {
		return engineClient.getFocSchemesOnProductGroups(focSchemeRequestDto);
	}

	@Override
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(String discountType,
			EligibleDiscountAbItemsRequestDto discountItemListDto) {

		return engineClient.getEligibleItemsForBillLevelDiscountsForAbToCm(discountType, discountItemListDto);
	}

	@Override
	public ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(List<BigDecimal> purityList) {
		return engineClient.getGEPDiscountConfigs(purityList);
	}

	@Override
	public Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(String discountType,
			String discountId, List<DiscountCalRequestDto> discountCalDtoList) {
		return engineClient.calculateRivaahDiscountsForAllItemsInDiscount(discountType, discountId, discountCalDtoList);
	}

	@Override
	public FocSchemeIndividualDto getFocSchemeDetails(String focSchemeId, String productGroup) {
		return engineClient.getFocSchemeDetails(focSchemeId, productGroup);
		
	}
	
	@Override
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode) {
		return engineClient.getEmployeeLoanConfigDetails(employeeCode);
	}

	@Override
	public PriceResponseDto getCOPriceDetails(OrdersPriceRequest orderPriceRequest, String locationCode) {
		return engineClient.getCOPriceDetails(orderPriceRequest, locationCode);
	}

	@Override
	public TepItemResponseDto getTepItems(String itemCode, String customerMobileNo, String subTxnType) {
		return engineClient.getTepItems(itemCode, customerMobileNo, subTxnType);
	}

	@Override
	public InventoryItemDto validateInventoryItems(String inventoryId, String itemCode) {
		return engineClient.validateInventoryItems(inventoryId, itemCode);

	}

	@Override
	public BusinessDayDto getBusinessDayInProgress(String locationCode) {
		return engineClient.getBusinessDayInProgress(locationCode);
	}

	@Override
	public BigDecimal getTodaysMaterialPrice(String locationCode, String metalTypeCode,
			BusinessDateDto applicableDate) {
		return engineClient.getTodaysMaterialPrice(locationCode, metalTypeCode, applicableDate);
	}
	
	@Override
	public ListResponse<MetalRateDto> getBasicMetalDetails(Date businessDate) {
		return engineClient.getMetalRate(businessDate);
	}

	@Override
	public DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			DiscountApplicableForItemCheckRequestDto discountApplicableForItemCheckRequest) {
		return engineClient.checkIfGivenDiscountApplicableForGiveItem(discountApplicableForItemCheckRequest);
	}
	
	@Override
	public  PagedRestResponse<List<LiteEmployeeListDto>> getUserList(Set<String> locationCodes, Set<String> roleCodes, 
			Set<String> employeeCodes) {
		return engineClient.getUserList(locationCodes, roleCodes, employeeCodes);
	}

	public void checkIfIGSTAllowed(Integer customerId, Boolean isIGST)
	{
		engineClient.checkIfIGSTAllowed(customerId, isIGST);
	}

	@Override
	public List<StoneDetailsLiteDto> getStoneDetails(String itemCode, String lotNumber) {
		return (List<StoneDetailsLiteDto>) engineClient.getLotStoneDetails(itemCode, lotNumber).getResults();
	}
}
