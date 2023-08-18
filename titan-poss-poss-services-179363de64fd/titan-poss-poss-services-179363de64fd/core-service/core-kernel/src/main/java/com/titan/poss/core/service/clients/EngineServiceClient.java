/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.DiscountApplicableForItemCheckRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
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
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.CashbackOfferRequestDto;
import com.titan.poss.core.dto.CashbackValueResponseDto;
import com.titan.poss.core.dto.CoinDetailsDto;
import com.titan.poss.core.dto.ConfigDetailsLocationMappingDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.CustomLotMasterDto;
import com.titan.poss.core.dto.CustomerPurchaseHistoryDto;
import com.titan.poss.core.dto.CustomerPurchaseRequestDto;
import com.titan.poss.core.dto.CustomerTransactionConfigDto;
import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.DiscountApplicableForItemResponseDto;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.EmployeePaymentDtoExt;
import com.titan.poss.core.dto.EmployeeSignatureDto;
import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.GepRequestDetail;
import com.titan.poss.core.dto.GlCodeDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.InventoryItemDto;
import com.titan.poss.core.dto.ItemDetailsDto;
import com.titan.poss.core.dto.ItemDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.ItemLiteDto;
import com.titan.poss.core.dto.ItemSearchRequestDto;
import com.titan.poss.core.dto.ItemsDto;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PayeeBankLocationDto;
import com.titan.poss.core.dto.PayerBankDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.PaymentProductGroupDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.ProductGroupDtoDigiGold;
import com.titan.poss.core.dto.PurityDto;
import com.titan.poss.core.dto.RoleAclConfigDto;
import com.titan.poss.core.dto.RoleLiteDto;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.core.dto.StoneDetailsLiteDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.dto.TownLiteDto;
import com.titan.poss.core.dto.UserLoginDto;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

import feign.Response;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "engineContextId", name = "engine-service", configuration = FeignClientInterceptor.class)
public interface EngineServiceClient {

	@PostMapping("/engine/v2/configs/foc-schemes/product-group")
	public ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(
			@RequestBody FocSchemeRequestDto focSchemeRequestDto);

	@GetMapping(value = "/engine/v2/products/product-categories/cache")
	Map<String, String> getProductCategoryList();

	@GetMapping(value = "/engine/v2/products/product-groups/cache")
	Map<String, String> getProductGroupList(
			@RequestParam(required = false, value = "plainStudded") String isPlainStudded,
			@RequestParam(required = false, value = "transactionType") String transactionType);

	@GetMapping(value = "engine/v2/price/metals/all")
	ListResponse<MetalRateDto> getMetalRate(Date businessDate);
	
	@PostMapping(value="engine/v2/price/metal-rate")
	BigDecimal getTodaysMaterialPrice(@RequestParam(required = true ,value="locationCode")  String locationCode,
			@RequestParam(required = true,value="metalTypeCode")  String metalTypeCode,
			@RequestBody (required = true) BusinessDateDto applicableDate);

	@GetMapping("engine/v2/price/metals/standard") // materials or material-rates or materials-rate
	Map<String, StandardPriceResponseDto> getMaterialRateNew(
			@RequestParam(required = false, value = "metalTypeCode") String metalTypeCode);

	@GetMapping("engine/v2/price/metals/standard") // materials or material-rates or materials-rate
	Map<String, StandardPriceResponseDto> getStandardMetalRate();

	@GetMapping(value = "engine/v2/rule-types/getRefundCashLimit")
	BigDecimal getRefundCashLimitConfig();

	@PostMapping(value = "engine/v2/rule-types/{ruleType}/values")
	Object getRuleValues(@PathVariable("ruleType") String ruleType,
			@RequestBody(required = false) RuleRequestListDto ruleRequestListDto);

	@GetMapping(value = "engine/v2/payments/lovs/{lovType}")
	LovDto getLov(@PathVariable("lovType") String lovType);

	@GetMapping(value = "engine/v2/payments/transactions/{transactionType}")
	ConfigDetailsLocationMappingDto getConfig(@PathVariable("transactionType") String transactionType,
			@RequestParam("config-type") String configType);

	@GetMapping(value = "engine/v2/rule-types/validate/weight-tolerance")
	Response getWeightToleranceValue(@RequestParam(name = "productGroupCode", required = true) String productGroupCode,
			@RequestParam(name = "availableWeight", required = true) BigDecimal availableWeight,
			@RequestParam(name = "measuredWeight", required = true) BigDecimal measuredWeight,
			@RequestParam(name = "availableQuantity", required = true) short availableQuantity,
			@RequestParam(name = "measuredQuantity", required = true) short measuredQuantity);

	@GetMapping(value = "engine/v2/payments/payee-banks")
	ListResponse<String> getPayeeBankNames(@RequestParam(name = "paymentCode", required = true) String paymentCode);

	@GetMapping(value = "engine/v2/locations/print-info")
	StorePrintDetailsDto getStorePrintInformation();

	@GetMapping(value = "engine/v2/locations/{locationCode}/cache")
	LocationCacheDto getStoreLocation(@PathVariable("locationCode") String locationCode);

	@GetMapping(value = "engine/v2/locations/{locationCode}/cacheTaxCode")
	StorePrintDetailsDto getStoreLocationWithTaxCode(@PathVariable("locationCode") String locationCode);
	
	@GetMapping(value = "engine/v2/locations/{locationCode}/cache")
	LocationCacheDto getStoreLocationWithToken(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@PathVariable("locationCode") String locationCode);

	@GetMapping(value = "engine/v2/payments/{paymentCode}/product-groups")
	PaymentProductGroupDto getProductGroups(@PathVariable("paymentCode") String paymentCode,
			@RequestParam(name = "cardNumber", required = false) String cardNumber);

	@PostMapping(value = "engine/v2/price/orders")
	PriceResponseDto getPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest);
	
	@RequestMapping(value = "engine/v2/price/orders",method=RequestMethod.POST)
	PriceResponseDto getPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest,@RequestParam("locationCode") String locationCode);

	@GetMapping("engine/v2/rule-types/validate/weight-tolerance")
	void checkWeightToleranceValue(@RequestParam(name = "productGroupCode", required = true) String productGroupCode,
			@RequestParam(name = "availableWeight", required = true) BigDecimal availableWeight,
			@RequestParam(name = "measuredWeight", required = true) BigDecimal measuredWeight,
			@RequestParam(name = "availableQuantity", required = true) short availableQuantity,
			@RequestParam(name = "measuredQuantity", required = true) short measuredQuantity);

	@GetMapping("engine/v2/inventory/items/{itemCode}/lots")
	PagedRestResponse<List<InventoryItemDto>> getInventoryItemLotDetails(@PathVariable("itemCode") String itemCode,
			@RequestParam(value = "lotNumber", required = false) String lotNumber);

	@GetMapping(value = "engine/v2/price/taxes")
	TaxCalculationResponseDto getTaxDetails(
			@RequestParam(name = "destBoutiqueLocationCode", required = false) String destBoutiqueLocationCode,
			@RequestParam(name = "customerId", required = false) Integer customerId,
			@RequestParam(name = "sourceLocationCode", required = false) String sourceLocationCode,
			@RequestParam(name = "txnType", required = true) String txnType,
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "isfullvalueTep", required = false) Boolean isfullvalueTep,
			@RequestParam(name = "isIGST", required = false) Boolean isIGST);
			
	@GetMapping(value = "engine/v2/payments/hostnames")
	ListResponse<String> getDevices();

	@GetMapping(value = "engine/v2/payments/payer-banks")
	PayerBankDto getPayerBankDetails(@RequestParam(name = "paymentCode", required = false) String paymentCode);

	@GetMapping("engine/v2/inventory/saleable")
	InventoryItemDto validateInventoryItem(@RequestParam(value = "inventoryId", required = false) String inventoryId,
			@RequestParam(value = "itemCode", required = false) String itemCode);

	@PostMapping(value = "engine/v2/price/gep")
	public GepPriceResponseDto getGepPriceDetails(@RequestBody GepPriceRequest gepPriceRequest);

	@PostMapping(value = "/engine/v2/configs/gep")
	public Object getGEPConfigDetails(@RequestBody GepRequestDetail gepRequestDetail);

	@PostMapping(value = "engine/v2/locations/stores/cache")
	public ListResponse<LocationCacheDto> getStoreLocationDetails(
			@RequestBody LocationCacheRequestDto locationCacheRequestDto);

	@PostMapping("engine/v2/price/metals/history")
	ListResponse<HistoryPriceResponse> getStandardHistoryPrice(@RequestBody MetalPriceRequestDto metalPriceRequest);

	@GetMapping("engine/v2/users/profile/roles")
	ListResponse<String> getRoleList();

	@PostMapping("engine/v2/products/lotNumber")
	CustomLotMasterDto generateLotNumber(@RequestParam(name = "docTypeEnum", required = true) String docTypeEnum);

	@PostMapping("engine/v2/products/lotNumber")
	String generateTheLotNumber(@RequestParam(name = "docTypeEnum", required = true) String docTypeEnum);

	@GetMapping(value = "engine/v2/products/items")
	public ListResponse<ItemLiteDto> getItemList(
			@RequestParam(name = "itemCodes", required = true) List<@PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String> itemCodes);

	@PostMapping("engine/v2/notifications/publish-event")
	public void publishEvent(@RequestBody(required = true) NotificationRequestDto notificationRequestDto);

	@GetMapping(value = "engine/v2/payments/customers/{customerType}")
	CustomerTransactionConfigDto getCustomerConfig(@PathVariable("customerType") String customerType,
			@RequestParam("config-type") String configType);

	@PostMapping("engine/v2/products/items")
	PagedRestResponse<List<ItemDto>> getItems(@RequestBody ItemSearchRequestDto itemSearchRequestDto);

	@GetMapping("engine/v2/inventory/coins")
	ListResponse<CoinDetailsDto> getCoinDetails(@RequestParam(value = "itemCode", required = false) String itemCode,
			@RequestParam(value = "withSaleableCheck", required = false) Boolean withSaleableCheck);

	@GetMapping("engine/v2/locations/country-details")
	CountryDetailsDto getCountryDetails(@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "engine/v2/revenues/business-day")
	BusinessDayDto getBusinessDay(@RequestParam(name = "locationCode", required = false) String locationCode);

	@PostMapping("engine/v2/price/metals/standard")
	Map<String, StandardPriceResponseDto> getAvailableMetalRate(@RequestBody BusinessDateDto businessDateDto);

	@GetMapping(value = "engine/v2/locations/markets/{marketCode}/cache")
	MarketDto getMarketDetails(@PathVariable("marketCode") String marketCode);

	@PostMapping(value = "engine/v2/rule-types/{ruleType}/values")
	Object ruleValueMappingListBasedOnFilters(@PathVariable("ruleType") String ruleType,
			RuleRequestListDto ruleRequestListDto);

	@GetMapping(value = "engine/v2/payments/cash-back-offers/{offerId}/product-groups")
	ListResponse<String> getCashBackProductGroups(@PathVariable("offerId") String offerId);

	@PostMapping(value = "engine/v2/payments/cash-back-offers/{offerId}/discounts")
	CashbackValueResponseDto getCashbackValue(@PathVariable("offerId") String offerId,
			@RequestBody CashbackOfferRequestDto cbOfferDto);

	@GetMapping(value = "engine/v2/locations/brand-details")
	BrandDto getBrand(@RequestParam(name = "brandCode", required = false) String brandCode);

	@GetMapping(value = "engine/v2/locations/location-details")
	List<String> getAppBasedLocations();

	@PostMapping(value = "engine/v2/price/orders")
	PriceResponseDto getPriceDetailsWithHeader(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestBody OrdersPriceRequest orderPriceRequest, @RequestParam("locationCode") String locationCode);

	@GetMapping(value = "engine/v2/configs/tep-item")
	TepItemResponseDto getTepItem(@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "tepType", required = true) String tepType);

	@PostMapping(value = "engine/v2/price/tep")
	TepPriceResponseDto getTepPriceDetails(@RequestBody TepPriceRequest tepPriceRequest);

	@GetMapping("engine/v2/products/items/details")
	Map<String, ItemDetailsDto> listItemDetails(
			@RequestParam(name = "itemCodes", required = true) List<String> itemCodes);

	@GetMapping(value = "engine/v2/revenues/business-day/in-progress")
	BusinessDayDto getBusinessDayInProgress(@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "engine/v2/revenues/business-day/in-progress")
	BusinessDayDto getBusinessDayInProgress(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestParam(name = "locationCode", required = false) String locationCode);

	@GetMapping(value = "engine/v2/payments/{locationCode}")
	public GlCodeDto getGLCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode);

	@PutMapping(value = "engine/v2/payments//{locationCode}")
	public void updateGlCode(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode);

	@PostMapping(value = "engine/v2/discounts")
	public DiscountEngineResponseDto calculateDiscountValue(
			@RequestParam(name = "discountId", required = false) String discountId,
			@RequestParam(name = "discountClubId", required = false) String discountClubId,
			@RequestBody DiscountCalRequestDto discountCalDto);

	@PostMapping(value = "engine/v2/discounts/rivaah")
	public Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(
			@RequestParam(name = "discountType", required = true) String discountType,
			@RequestParam(name = "discountId", required = true) String discountId,
			@RequestBody List<DiscountCalRequestDto> discountCalDtoList);

	@GetMapping(value = "engine/v2/discounts/{discountId}")
	DiscountDetailsBaseDto getDiscountConfigDetails(@PathVariable("discountId") String discountId);

	@PostMapping(value = "engine/v2/discounts/eligible-items")
	EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(
			@RequestParam(name = "discountType", required = false) String discountType,
			@RequestBody EligibleDiscountItemsRequestDto discountItemListDto);

	@GetMapping(value = "engine/v2/cache/clear-cache")
	void clearCache(@RequestParam(name = "cacheValue", required = true) String cacheValue,
			@RequestParam(name = "cacheKey", required = false) String cacheKey);

	@GetMapping(value = "engine/v2/cache/clear-cache")
	void clearCacheWithToken(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestParam(name = "cacheValue", required = true) String cacheValue,
			@RequestParam(name = "cacheKey", required = false) String cacheKey);

	@PostMapping(value = "engine/v2/discounts/transaction-level")
	DiscountBillLevelResponseDto getDiscountsAtBillLevel(
			@RequestBody DiscountBillLevelRequestDto discountBillLevelRequest);

	@PostMapping(value = "engine/v2/discounts/items")
	DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(@RequestBody Object discountItemListDto);

	@GetMapping(value = "engine/v2/configs/tep-cancel")
	TepValidationConfigDetails getTepCancelDetails(@RequestParam(name = "tepType", required = true) String tepType);

	@PostMapping(value = "engine/v2/discounts/exchange")
	ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(
			@RequestParam(name = "discountType", required = true) String discountType,
			@RequestParam(name = "transactionType", required = true) String transactionType,
			@RequestBody ExchangeOfferRequestDto exchangeOfferRequestDto);

	@PostMapping(value = "engine/v2/discounts/{discountId}/slabs")
	SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(
			@PathVariable("discountId") String discountId,
			@RequestBody SlabBasedDiscountRequestDto slabBasedDiscountRequest);

	@GetMapping(value = "engine/v2/locations/{countryCode}")
	CountryDto getCountry(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@PathVariable("countryCode") @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode);

	@PostMapping(value = "engine/v2/discounts/orders")
	public DiscountEngineResponseDto calculateAbDiscountValue(
			@RequestBody AbCoDiscountRequestDto abCoDiscountRequestDto);

	@PostMapping(value = "engine/v2/discounts/orders/slabs")
	SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			@RequestBody AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto);

	@PostMapping(value = "engine/v2/discounts/eligible-items/gep-purity")
	GepPurityScemeValidationResponse validateGepPurityScheme(
			@RequestParam(name = "isRivaah", required = false) Boolean isRivaah,
			@RequestBody GepPurityScemeValidationRequest gepPurityScemeValidationRequest);

	@PostMapping(value = "engine/v2/payments/digi-gold/product-groups")
	public ProductGroupDtoDigiGold getProductGroupsForDigiGold(
			@RequestBody ProductGroupDtoDigiGold productGroupCodeDigiGold);

	@GetMapping(value = "engine/v2/configs/foc-schemes/{focSchemeId}")
	public FocSchemeIndividualDto getFocSchemeConfigById(@PathVariable(name = "focSchemeId") String schemeId);

	@GetMapping(value = "engine/v2/configs/foc-schemes/details/{focSchemeId}")
	public FocSchemeIndividualDto getFocSchemeDetails(@PathVariable(name = "focSchemeId") String focSchemeId,
			@RequestParam(required = false, value = "productGroup") String productGroup);

	@PostMapping(value = "engine/v2/discounts/orders/eligible-items")
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(
			@RequestParam(required = false, name = "discountType") String discountType,
			@RequestBody EligibleDiscountAbItemsRequestDto discountItemListDto);

	@GetMapping(value = "engine/v2/configs/gep-item")
	ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(
			@RequestParam(required = false, name = "purityList") List<BigDecimal> purityList);

	@GetMapping(value = "engine/v2/locations/countries/{countryCode}/states")
	public PagedRestResponse<List<StateLiteDto>> listStatelite(
			@PathVariable("countryCode") @PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX) String countryCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable);

	@GetMapping(value = "engine/v2/locations/state-town")
	public TownLiteDto getStateAndTownDetails(
			@RequestParam(name = "stateId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String stateId,
			@RequestParam(name = "townId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String townId);

	@GetMapping(value = "engine/v2/users/employee-signature-details")
	public EmployeeSignatureDto getEmployeeSignatureDetails(
			@ApiParam(value = "Provide 'employee code'", required = true) @RequestParam(name = "employeeCode", required = true) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode);

	@GetMapping(value = "engine/v2/users/employee-signature")
	public Map<String, String> getEmployeeSignature(
			@RequestParam(name = "employeeCode", required = true) String employeeCode);

	@PostMapping(value = "engine/v2/payments/employee-loan/config-details")
	public EmployeePaymentDtoExt getEmployeeLoanConfigDetails(
			@RequestParam(required = true, value = "employeeCode") String employeeCode);

	@GetMapping(value = "engine/v2/users/roles/{roleCode}")
	public RoleLiteDto getRoleDetails(@PathVariable("roleCode") String roleCode);
	
	@GetMapping(value = "engine/v2/users/roles/access/{roleCode}/{aclCode}")
	public RoleAclConfigDto getEmpRoleConfig(@PathVariable("roleCode") String roleCode,@PathVariable("aclCode") String aclCode);

	@PostMapping("engine/v2/price/cut-piece-tep")
	// @formatter:on
	public CutPieceTepPriceResponseDto getCutPieceTepPriceDetails(@RequestBody @Valid TepPriceRequest tepPriceRequest);

	@GetMapping("engine/v2/payments/creditNote/{creditNoteType}")
	public Object getCreditNote(@PathVariable("creditNoteType") String creditNoteType);

	@GetMapping(value = "engine/v2/locations/details")
	public LocationResponseDto getBoutiqueLocationDetails();
	
	@GetMapping(value = "engine/v2/locations/active-locations")
	public List<LocationCoordinateDto> getAllByLocationIfIsActive();
	
	@PostMapping(value = "engine/v2/price/cust-orders")
	public PriceResponseDto getCOPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest,
			@RequestParam(name="locationCode",required = false) String locationCode);
	
	@GetMapping(value = "engine/v2/configs/tep-Items")
	TepItemResponseDto getTepItems(@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "customerMobileNo", required = false) String customerMobileNo,
			@RequestParam(name = "tepType", required = true) String tepType);
	@GetMapping("engine/v2/inventory/item")
	InventoryItemDto validateInventoryItems(@RequestParam(value = "inventoryId", required = false) String inventoryId,
			@RequestParam(value = "itemCode", required = false) String itemCode);

	@GetMapping("engine/v2/products/itemDetails")
	public ItemsDto getItemDetails(@RequestParam("itemCode") @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode);

	@GetMapping(value = "engine/v2/payments/payee-banks-default")
	public Object getPayeeBankLocationDetails();
	
	@GetMapping(value = "engine/v2/payments/payee-bank")
	public PayeeBankLocationDto getPayeeBank(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode);
	
	@GetMapping("engine/v2/discounts/discount-item-mapping")
	List<DiscountItemMapiingDto> getDiscountItemMappingDetails(
			@RequestParam(name = "itemCode", required = true) String itemCode,
			@RequestParam(name = "lotNumber", required = true)  String lotNumber,
			@RequestParam(name = "locationCode", required = true) String locationCode);

	@GetMapping("engine/v2/discounts/transfer")
	public List<ItemGroupMappingDto> discountIBTTansfer(@RequestBody List<ItemGroupMappingDto> discountItemMappingDaos);
	
	@GetMapping(value = "engine/v2/payments/payee-bank/isActive")
	public Boolean getIsActive(@RequestParam(name = "bankName", required = true) String bankName);

	@PostMapping("engine/v2/discounts/validate")
	DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			@RequestBody DiscountApplicableForItemCheckRequestDto discountApplicableForItemCheckRequest);
	
	@GetMapping("engine/v2/users/get")
	 PagedRestResponse<List<LiteEmployeeListDto>> getUserList(@RequestParam(name = "locationCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCodes,
			@RequestParam(name = "roleCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String> roleCodes,
			@RequestParam(name = "employeeCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String> employeeCodes);
	
	@GetMapping(value = "engine/v2/price/taxes-iGST")
	public void checkIfIGSTAllowed(@RequestParam(name = "customerId", required = false) Integer customerId,
			@RequestParam(name = "isIGST", required = false) Boolean isIGST);
	
	@GetMapping(value = "engine/v2/payments/payer-banks/{locationCode}")
	public List<PayerBankDtoRes>  getBankName(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode);
	
	@GetMapping(value = "engine/v2/locations/location-details/{locationCode}")
	public List<LocationServicesDto>  getLocationDetails(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode);
	
	@PostMapping("engine/v2/locations/metal-details/{locationCode}")
	public List<MetalGoldPriceDto> getMarketMetalDetails(
			@RequestBody @Valid MetalApplicableDto applicableDate,
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode);
	
	@PostMapping(value = "engine/v2/payments/edc-bank")
	public List<EdcBanksDto> getEdcBank(
			@RequestParam(name = "paymentCode", required = true) @PatternCheck(regexp = RegExConstants.PAYMENT_CODE_REGEX) String paymentCode,
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto);
	
	@ApiOperation(value = "Get all employee master data of all locations", notes = "Get all employee master data of all locations.")
	@PostMapping(value = "engine/v2/users/employee-master")
	public List<EmployeeMasterDto> getAllEmployeeList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto);
	
	@ApiOperation(value = "Get all login master data of all locations", notes = "Get all login master data of all locations.")
	@PostMapping(value = "engine/v2/users/login-master")
	public List<UserLoginDto> getAllLoginMasterList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto);
	
	@GetMapping(value = "/engine/v2/products/purities")
	PagedRestResponse<List<PurityDto>> listPurity(@RequestParam(name = "isActive",required = false) Boolean isActive,
			@RequestParam(name = "purity", required = false) BigDecimal purity,
			@RequestParam(name = "itemTypeCode", required = false) @PatternCheck(regexp = RegExConstants.ITEM_TYPE_CODE_REGEX) String itemTypeCode);

	@GetMapping(value = "/engine/v2/products/items/{itemCode}/stones")
	public ListResponse<StoneDetailsLiteDto> getLotStoneDetails(@PathVariable("itemCode") String itemCode,
			@RequestParam(name = "lotNumber", required = true) String lotNumber);
	
	@GetMapping(value = "engine/v2/sales/checkGrn")
	public Boolean getRefundId(@RequestParam(name = "id", required = true) String id);
	
	@PostMapping(value = "engine/v2/sales/cashMemo-details")
	public List<CustomerPurchaseHistoryDto> getAllCashMemoPurchase(
			@RequestBody(required = false) @Validated CustomerPurchaseRequestDto customerPurchaseRequestDto);
	
	
	@PostMapping(value = "engine/v2/locations/service-location-details")
	public List<String>  getLocationCodes(
			@RequestBody(required = true) @Validated EdcBankRequestDto edcBankRequestDto);
	

}
