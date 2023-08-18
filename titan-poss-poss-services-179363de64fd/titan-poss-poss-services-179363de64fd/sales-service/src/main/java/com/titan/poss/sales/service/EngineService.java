/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * Service interface for Engine.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface EngineService {

	/**
	 * This method will return List of material rates
	 * 
	 * @param materialTypeCode
	 * @return ListResponse<MaterialRateDto>
	 */
	Map<String, StandardPriceResponseDto> getMaterialPrices(String materialTypeCode);

	/**
	 * This method will return lov details based on lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	LovDto getLov(String lovType);

	/**
	 * This method will return location mapping for payment modes based on
	 * transactionType.
	 * 
	 * @param transactionType
	 * @param configType
	 * @return ConfigDetailsLocationMappingDto
	 */
	ConfigDetailsLocationMappingDto getValidPaymentCodes(String transactionType, String configType);

	/**
	 * This method will return list of payee banks based on paymentCode
	 * 
	 * @param paymentCode
	 * @return ListResponse<String>
	 */
	ListResponse<String> payeeBankList(String paymentCode);

	/**
	 * This method will return list of product groups mapped based on payment code
	 * and card number.
	 * 
	 * @param paymentCode
	 * @param cardNumber
	 * @return ListResponse<String>
	 */
	PaymentProductGroupDto getProductGroups(String paymentCode, String cardNumber);

	/**
	 * This method will return price details of the item.
	 * 
	 * @param orderPriceRequest
	 * @return PriceResponseDto
	 */
	PriceResponseDto getPriceDetails(OrdersPriceRequest orderPriceRequest);

	/**
	 * This method will check weight tolerance
	 * 
	 * @param productGroupCode
	 * @param availableWeight
	 * @param measuredWeight
	 * @param availableQuantity
	 * @param measuredQuantity
	 */
	void checkWeightToleranceValue(String productGroupCode, BigDecimal availableWeight, BigDecimal measuredWeight,
			short availableQuantity, short measuredQuantity);

	/**
	 * This method will check weight tolerance.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @return List<InventoryItemDto>
	 */
	List<InventoryItemDto> getInventoryItemLotDetails(String itemCode, String lotNumber);

	/**
	 * This method will give tax details.
	 * 
	 * @param destBtqLocationCode
	 * @param customerId
	 * @param txnType
	 * @param itemCode
	 * @param isfullvalueTep
	 * @return TaxCalculationResponseDto
	 */
	TaxCalculationResponseDto getTaxDetails(String destBtqLocationCode, Integer customerId, String txnType,
			String itemCode, Boolean isfullvalueTep, Boolean isIGST);

	/**
	 * This method will give list of paymentCodes based on HOSTNAME from token.
	 * 
	 * @return ListResponse<String>
	 */
	ListResponse<String> getDevices();

	/**
	 * This method will give pa payer bank details based on paymentCode.
	 * 
	 * @param paymentCode
	 * @return PayerBankDto
	 */
	PayerBankDto getPayerBankDetails(String paymentCode);

	/**
	 * This method will validate if the item is sale able or not based on inventory
	 * id or itemCode.
	 * 
	 * @param inventoryId
	 * @param itemCode
	 * @return InventoryItemDto
	 */
	InventoryItemDto validateInventoryItem(String inventoryId, String itemCode);

	GepPriceResponseDto getGepPriceDetails(GepPriceRequest gepPriceRequest);

	Object getGEPConfigDetails(GepRequestDetail gepRequestDetail);

	/**
	 * This method will get metal rates from history.
	 * 
	 * @param metalPriceRequest
	 * @return ListResponse<HistoryPriceResponse>
	 */
	ListResponse<HistoryPriceResponse> getStandardHistoryPrice(MetalPriceRequestDto metalPriceRequest);

	/**
	 * This method will generate custom lot number.
	 * 
	 * @param docTypeEnum
	 * @return CustomLotMasterDto
	 */
	CustomLotMasterDto generateLotNumber(String docTypeEnum);

	/**
	 * This method will list valid txnTypes based on customer type.
	 * 
	 * @param customerType
	 * @param configType
	 * @return CustomerTransactionConfigDto
	 */
	CustomerTransactionConfigDto getCustomerConfig(String customerType, String configType);

	/**
	 * This method will get item details based on search params.
	 * 
	 * @param itemSearchRequestDto
	 * @return PagedRestResponse<List<ItemDto>>
	 */
	PagedRestResponse<List<ItemDto>> getItems(ItemSearchRequestDto itemSearchRequestDto);

	/**
	 * This method will get coin details for the location.
	 * 
	 * @param itemCode
	 * @param withSaleableCheck
	 * @return ListResponse<CoinDetailsDto>
	 */
	ListResponse<CoinDetailsDto> getCoinDetails(String itemCode, Boolean withSaleableCheck);

	/**
	 * This method will be used to get fiscal year and currency code.
	 * 
	 * @param locationCode
	 * @return CountryDetailsDto
	 */
	CountryDetailsDto getCountryDetails(String locationCode);

	CountryDetailsDto getCountryDetails();

	/**
	 * This method will get Configuration values defined at header level or Product
	 * level
	 * 
	 * @param ruleType
	 * @param ruleRequestListDto
	 * @return
	 */
	Object getRuleFieldValues(RuleTypeEnum ruleType, RuleRequestListDto ruleRequestListDto);

	/**
	 * This method will get the rule based on rule type and req body.
	 * 
	 * @param ruleType
	 * @param ruleRequestListDto
	 * @return Object
	 */
	Object ruleValueMappingListBasedOnFilters(String ruleType, RuleRequestListDto ruleRequestListDto);

	/**
	 * This method will get brand details.
	 * 
	 * @param brandCode
	 * @return BrandDto
	 */
	BrandDto getBrand(String brandCode);

	/**
	 * This method will get product group codes mapped for cash back offer id.
	 * 
	 * @param offerId
	 * @return ListResponse<String>
	 */
	ListResponse<String> getCashBackProductGroups(String offerId);

	/**
	 * This method will get the cash back details for a given card number and offer
	 * id.
	 * 
	 * @param offerId
	 * @param cbOfferDto
	 * @return CashbackValueResponseDto
	 */
	CashbackValueResponseDto getCashbackValue(String offerId, CashbackOfferRequestDto cbOfferDto);

	/**
	 * This method will get the store details based on locationCode.
	 * 
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	LocationCacheDto getStoreLocation(String locationCode);

	TepItemResponseDto getTepItem(String itemCode, String customerMobileNo, String subTxnType);

	TepPriceResponseDto getTepPriceDetails(TepPriceRequest tepPriceRequest);

	/**
	 * 
	 * @param itemCodes
	 * @return Map<String, ItemDetailsDto>
	 */
	Map<String, ItemDetailsDto> listItemDetails(List<String> itemCodes);

	/**
	 * @return
	 */
	BrandDto getBrand();

	BusinessDayDto getBusinessDay(String locationCode);

	/**
	 * @param isPlainStudded
	 * @param transactionType
	 * @return
	 */
	Map<String, String> getProductGroupList(String isPlainStudded, String transactionType);

	StorePrintDetailsDto getStorePrintInformation();

	/**
	 * @return
	 */
	Map<String, StandardPriceResponseDto> getStandardMetalRate();

	/**
	 * Method to Get Discount value calculated for a item
	 * 
	 * @param discountId
	 * @param discountCalDto
	 * @return
	 */
	DiscountEngineResponseDto calculateDiscountValue(String discountId, String discountClubId,
			DiscountCalRequestDto discountCalDto);

	/**
	 * @return
	 */
	BusinessDayDto getBusinessDayInProgress();

	/**
	 * Method to get Discount config details for particular discount id
	 * 
	 * @param discountId
	 * @return
	 */
	DiscountDetailsBaseDto getDiscountConfigDetails(String discountId);

	/**
	 * Method to Get Eligible Items for bill level discounts
	 * 
	 * @param discountItemListDto
	 * @return
	 */
	EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(String discountType,
			EligibleDiscountItemsRequestDto discountItemListDto);

	/**
	 * Method to Validate Bill level details like employee coupon details to apply
	 * discount
	 * 
	 * @param discountBillLevelRequest
	 * @return
	 */
	DiscountBillLevelResponseDto getDiscountsAtBillLevel(DiscountBillLevelRequestDto discountBillLevelRequest);

	/**
	 * Method to get the Best discount for a item
	 * 
	 * @param DiscountItemDetailsListRequestDto
	 * @return
	 */
	DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(
			DiscountItemDetailsListRequestDto discountItemListDto);

	TepValidationConfigDetails getTepCancelDetails(String tepType);

	ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(String discountType, String transactionType,
			ExchangeOfferRequestDto exchangeOfferRequestDto);

	/**
	 * This api calculates discountValue for an item wrt particular discount for a
	 * itemCode,lotNumber and locationCode.
	 * 
	 * @param discountId
	 * @param DiscountCalRequestDto
	 * @return DiscountDetailsResponseDto.
	 */
	SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(String discountId,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest);

	/**
	 * This api calculates discountValue for an item for ab to cm scenario
	 * 
	 * @param abCoDiscountRequestDto
	 * @return
	 */
	DiscountEngineResponseDto calculateAbDiscountValue(AbCoDiscountRequestDto abCoDiscountRequestDto);

	/**
	 * Method to calculate cumulative discount for Order to CM item discounts
	 * 
	 * @param abCoSlabDiscountRequestDto
	 * @return
	 */
	SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto);

	/**
	 * @param ProductGroupDtoDigiGold
	 * @return ProductGroupDtoDigiGold
	 */
	ProductGroupDtoDigiGold getProductGroupsForDigiGold(ProductGroupDtoDigiGold productGroupCodeDigiGold);

	/**
	 * This method will get GEP Purity offer related details.
	 * 
	 * @param gepPurityScemeValidationRequest
	 * @param isRivaah
	 * @return GepPurityScemeValidationResponse
	 */
	GepPurityScemeValidationResponse validateGepPurityScheme(Boolean isRivaah,
			GepPurityScemeValidationRequest gepPurityScemeValidationRequest);

	/**
	 * Method to fetch FOC configuration details by scheme id
	 * 
	 * @param schemeId
	 * @return
	 */
	FocSchemeIndividualDto getFocSchemeConfigById(String schemeId);

	ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(FocSchemeRequestDto focSchemeRequestDto);

	/**
	 * Method to get Eligible items for Bill level discounts for Order to CM
	 * 
	 * @param discountType
	 * @param discountItemListDto
	 * @return
	 */
	EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(String discountType,
			EligibleDiscountAbItemsRequestDto discountItemListDto);

	/**
	 * This method will get discount configuration details.
	 * 
	 * @param purityList
	 * @return ListResponse<GepDiscountConfigurationDetailsDto>
	 */
	ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(List<BigDecimal> purityList);

	Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(String discountType,
			String discountId, List<DiscountCalRequestDto> discountCalDtoList);

	FocSchemeIndividualDto getFocSchemeDetails(String schemeId, String productGroupCode);

	EmployeePaymentDtoExt getEmployeeLoanConfigDetails(String employeeCode);
	
	PriceResponseDto getCOPriceDetails(OrdersPriceRequest orderPriceRequest,String locationCode);
	TepItemResponseDto getTepItems(String itemCode, String customerMobileNo, String subTxnType);
	/**
	 * This method will validate if the item is present in inventory or not based on inventory
	 * id or itemCode.
	 * 
	 * @param inventoryId
	 * @param itemCode
	 * @return InventoryItemDto
	 */
	InventoryItemDto validateInventoryItems(String inventoryId, String itemCode);
	BusinessDayDto getBusinessDayInProgress(String locationCode);
	BigDecimal getTodaysMaterialPrice(String locationCode, String metalTypeCode, BusinessDateDto applicableDate);
	ListResponse<MetalRateDto> getBasicMetalDetails(Date businessdate);

	DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			DiscountApplicableForItemCheckRequestDto discountApplicableForItemCheckRequest);
	PagedRestResponse<List<LiteEmployeeListDto>> getUserList(Set<String> locationCodes, Set<String> roleCodes, 
			Set<String> employeeCodes);
	
	void checkIfIGSTAllowed(Integer customerId,Boolean isIGST);

	List<StoneDetailsLiteDto> getStoneDetails(String itemCode, String lotNumber);
}
