/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.CutPieceTepPriceResponseDto;
import com.titan.poss.core.dto.GepPriceRequest;
import com.titan.poss.core.dto.GepPriceResponseDto;
import com.titan.poss.core.dto.HistoryPriceResponse;
import com.titan.poss.core.dto.MetalPriceRequestDto;
import com.titan.poss.core.dto.MetalRateDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.core.dto.StandardPriceResponseDto;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TepPriceRequest;
import com.titan.poss.core.dto.TepPriceResponseDto;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.config.dto.request.StandardMetalRateDto;
import com.titan.poss.engine.service.PriceService;
import com.titan.poss.engine.service.PriceUtilService;
import com.titan.poss.engine.service.TaxService;
import com.titan.poss.location.acl.LocationACLConstants;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("priceEngineController")
@RequestMapping(value = "engine/v2/price")
public class PriceController {

	@Autowired
	private PriceService priceService;
	
	@Autowired
	private PriceUtilService priceUtilService;

	@Autowired
	private TaxService taxService;

	private static final String METAL_RATE_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.BOUTIQUE_METAL_RATE_VIEW + "' )";
	private static final String FIND_PRICE_VIEW_PERMISSION = "hasPermission(true,'"+ LocationACLConstants.FIND_PRICE_VIEW + "' )";

	// @formatter:off
	@PostMapping(value = "/orders")
	@ApiOperation(value="Get price details",notes="Get PriceDetails based on <b>ItemCode</b> and <b>LotNumber</b> and <b>Quantity</b> and <b>Weight</b>"
			+"</br> <b>ItemCode</b>	 and <b>Lotnumber</b> are mandatory. and checkInventory is true for FindPrice."
			+"</br></br> Response::"
			+"</br> metalPriceDetails V"
			+"</br> stonePriceDetails F1"
			+"</br> makingChargeDetails F2"
			+"</br></br></br>*****************NOTE**********************"
			+"</br> for <b> coins <b>itemCode</b> are mandatory."
			+"</br> for others <b> lotNumber</b>  and <b> itemCode</b>  are mandatory."
			+ "</br> for UCP products pass \"standardPrice\": {}")
	// @formatter:on
	public PriceResponseDto getPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest,
			@RequestParam(required = false) String locationCode) {
		return priceService.getPriceDetails(orderPriceRequest, locationCode);
	}

	/**
	 * This method will return the list of metal rate details.
	 * 
	 * @return ListResponse<MetalRateDto>
	 */
	// @formatter:off
	@ApiOperation(value = "API to get the list of metal rate details", notes = "This API will get the list of metal rate details for the day.<br>"
			+ "<b>Default</b>" + "<ul>" + "<li> Gold rate for 22K</li>" + "<li> Platinum rate for 95% purity</li>"
			+ "<li> Silver rate for 92.5% purity</li>" + "</ul><br>")
	@GetMapping("/metals/all")  
	// @formatter:on
	public ListResponse<MetalRateDto> getMetalRate() {

		return priceService.getMetalRate(null);
	}
	
	@ApiOperation(value="API to get todays material price",notes="API to get todays material price")
	@PostMapping("/metal-rate")
	public BigDecimal getTodaysMaterialPrice(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.METAL_TYPE_REGEX) String metalTypeCode,
			@RequestBody (required = true) BusinessDateDto applicableDate) {
		return priceUtilService.getTodaysMaterialPrice(locationCode, metalTypeCode, applicableDate);
	}

	// update swagger documentation...
		@ApiOperation(value = "List all the GST tax percentage", notes = "list all GST tax components based on customer transaction or IBT. Here parameters are src location code,dest location code,txn type,item code and customer id. This API will <b>not</b> include Hallmark related tax details.<br>")
		@GetMapping(value = "/taxes")
		public TaxCalculationResponseDto getTaxDetails(
				@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String destBoutiqueLocationCode,
				@RequestParam(required = false) Integer customerId,
				@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String sourceLocationCode,
				@RequestParam(required = true) @ApiParam(value = "Transaction Type", allowableValues = "CUST_TRANSACTION_ADV_BOOKING,CUST_TRANSACTION_CM,CUST_TRANSACTION_PRIORITY_ORDER,INV_MANAGMNT_STOCK_ISSUE,INV_MANAGMNT_STOCK_ISSUE_OTHER_ISSUE,INV_MANAGMNT_STOCK_ISSUE_TEP_GEP,INV_MANAGMNT_STOCK_RECEIPT_OTHER_RECEIPT,SERVICE_PAYMENT,SERVICE_PROCESSING,TEP_GEP,TEP_GEP_TANISHQ_EXCHANGE", required = true) @ValueOfEnum(enumClass = TxnTaxTypeEnum.class) String txnType,
				@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
				@RequestParam(required = false) @ApiParam(value = "is full value TEP", required = false) Boolean isfullvalueTep,
				@RequestParam(required = false) @ApiParam(value = "is IGST", required = false) Boolean isIGST) {

			return taxService.getTaxValues(sourceLocationCode, destBoutiqueLocationCode, customerId, txnType, itemCode,
					isfullvalueTep, isIGST);
		}

	// @formatter:off
		@ApiOperation(value = "API to get standard metal rate details", notes = "This API will get metal rate details for the day. <br>"
				+ "<b> ***API works only for POSS***"
				+ "<br> POSS:: this api is used for fetching standard metal rate"
				+ "<br> this API will only be used to fetch today's standard rate for a specific boutique"
				+ "<ul>" + "<li> Gold rate for 22K91.6%</li>" + "<li> Platinum rate for 95% purity</li>"
				+ "<li> Silver rate for 92.5% purity</li>" + "</ul><br>")
		@GetMapping("/metals/standard") // metals or metalrates or metalsrate
		@PreAuthorize(METAL_RATE_VIEW_PERMISSION)
		// @formatter:on
	public Map<String, StandardPriceResponseDto> getStandardMetalRate() {

		return priceService.getStandardMetalRate(null);
	}

	// @formatter:off
	@ApiOperation(value = "API to get standard metal rate details", notes = "This API will get metal rate details for the day.<br>"
				+ "<br>API will only be used to fetch standard rate for a specific applicable date"
				+ "<br>if metal rate is not available in boutique this API connects EPOSS to fetch the metalrate"
				+ "<ul>" + "<li> Gold rate for 22K91.6%</li>" + "<li> Platinum rate for 95% purity</li>"
				+ "<li> Silver rate for 92.5% purity</li>" + "</ul><br>")
	// @formatter:on
	@PostMapping("/metals/standard")
	// BusinessDateDto
	public Map<String, StandardPriceResponseDto> getAvailableMetalRate(@RequestBody StandardMetalRateDto metalRateDto) {

		return priceService.getAvailableMetalRate(metalRateDto);
	}

	// @formatter:off
	@PostMapping(value = "/gep")
	@ApiOperation(value = "Get GEP price details", notes = "Get GEP PriceDetails based on")
	// @formatter:on
	public GepPriceResponseDto getGepPriceDetails(@RequestBody @Valid GepPriceRequest gepPriceRequest) {
		return priceService.getGepPriceDetails(gepPriceRequest);
	}

	// @formatter:off
	@ApiOperation(value = "API to get metal rate details from history", notes = "This API will get metal rate details for a given day and metal code w.r.t priceType(D,F) <br>"
				+ "<b> ***API works only for EPOSS***"
				+ "<br>EPOSS::This api will be used in generatePasssword for manual CM/GEP </b><br>"
				+ "<br>ServiceTeam: to use this api in validating manual price input from UI, "
				+ "<br>can pass null in metalType to fetch all metals metalRate" 
				+ "<ul>" 
				+ "<li> J (Gold) rate for 22K91.6% purity</li>" 
				+ "<li> L (Platinum) rate for 95% purity</li>"
				+ "<li> P (Silver) rate for 92.5% purity</li>" 
				+ "</ul><br>")
	@PostMapping("/metals/history")
	// metals or metal-rates or metal-rate
	// @formatter:on
	public ListResponse<HistoryPriceResponse> getStandardHistoryPrice(
			@RequestBody @Valid MetalPriceRequestDto metalPriceRequest) {
		return priceService.getStandardHistoryPrice(metalPriceRequest);
	}

	// @formatter:off
	@ApiOperation(value = "Get TEP price details", notes = "Get TEP PriceDetails. In request we have **tepType**.<br>"
			+ "**tepType** should be <b>NEW_TEP</b>,<b>INTER_BRAND_TEP</b>,<b>FULL_VALUE_TEP</b>,<b>MANUAL_TEP</b>")
	@PostMapping("/tep")
	// @formatter:on
	public TepPriceResponseDto getTepPriceDetails(@RequestBody @Valid TepPriceRequest tepPriceRequest) {
		return priceService.getTepPriceDetails(tepPriceRequest);
	}

	@ApiOperation(value = "Get Cut Piece TEP price details", notes = "Get Cut Piece TEP PriceDetails. In request we have **tepType**.<br>"
			+ "**tepType** should be <b>NEW_TEP</b>,<b>INTER_BRAND_TEP</b>,<b>FULL_VALUE_TEP</b>,<b>MANUAL_TEP</b>,<b>CUT_PIECE_TEP</b>")
	@PostMapping("/cut-piece-tep")
	// @formatter:on
	public CutPieceTepPriceResponseDto getCutPieceTepPriceDetails(@RequestBody @Valid TepPriceRequest tepPriceRequest) {
		return priceService.getCutPieceTepPriceDetails(tepPriceRequest);
	}
	
	// @formatter:off
	@PostMapping(value = "/cust-orders")
	@ApiOperation(value="Get price details",notes="Get PriceDetails based on <b>ItemCode</b> and <b>LotNumber</b> and <b>Quantity</b> and <b>Weight</b>"
			+"</br> <b>ItemCode</b>	is mandatory. and checkInventory is true for FindPrice."
			+"</br></br> Response::"
			+"</br> metalPriceDetails V"
			+"</br> stonePriceDetails F1"
			+"</br> makingChargeDetails F2"
			+"</br></br></br>*****************NOTE**********************"
			+"</br> for <b> coins <b>itemCode</b> are mandatory."
			+"</br> for others <b> lotNumber</b>  and <b> itemCode</b>  are mandatory."
			+ "</br> for UCP products pass \"standardPrice\": {}")
	// @formatter:on
	public PriceResponseDto getCOPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest,
			@RequestParam(required = false) String locationCode) {
		return priceService.getCOPriceDetails(orderPriceRequest, locationCode);
	}
	
	
	// @formatter:off
	@PostMapping(value = "/find-price")
	@ApiOperation(value="Find price details",notes="Find Price Details based on <b>ItemCode</b> and <b>LotNumber</b> and <b>Quantity</b> and <b>Weight</b>"
			+"</br> <b>ItemCode</b>	 is mandatory. "
			+"</br> CheckInventory is TRUE for item from Inventory and FALSE for item from Item Master."
			+"</br></br> Response::"
			+"</br> metalPriceDetails V"
			+"</br> stonePriceDetails F1"
			+"</br> makingChargeDetails F2"
			+"</br></br></br>*****************NOTE**********************"
			+"</br> for <b> coins <b>itemCode</b> are mandatory."
			+"</br> for others <b> lotNumber</b>  and <b> itemCode</b>  are mandatory."
			+ "</br> for UCP products pass \"standardPrice\": {}")
	// @formatter:on
	@PreAuthorize(FIND_PRICE_VIEW_PERMISSION)
	public PriceResponseDto findPrice(@RequestBody OrdersPriceRequest orderPriceRequest,
			@RequestParam(required = false) String locationCode) {
		return priceService.findPrice(orderPriceRequest, locationCode);
	}
	
	// @formatter:off
		@ApiOperation(value = "API to get standard metal rate details", notes = "This API will get metal rate details for the day.<br>"
					+ "<br>API will only be used to fetch standard rate for a specific applicable date"
					+ "<br>if metal rate is not available in boutique this API connects EPOSS to fetch the metalrate")
		// @formatter:on
		@PostMapping("/metals/all")
		// BusinessDateDto
		public ListResponse<MetalRateDto> getMetalPriceDetails(@RequestBody (required = true) Date businessDate) {

			return priceService.getMetalPriceDetails(businessDate);
		}
		
		
		@PostMapping(value = "/conversion-price")
		@ApiOperation(value="Get price details",notes="Get PriceDetails based on <b>ItemCode</b> and <b>LotNumber</b> and <b>Quantity</b> and <b>Weight</b>"
				+"</br> <b>ItemCode</b>	 and <b>Lotnumber</b> are mandatory. and checkInventory is true for FindPrice."
				+"</br></br> Response::"
				+"</br> metalPriceDetails V"
				+"</br> stonePriceDetails F1"
				+"</br> makingChargeDetails F2"
				+"</br></br></br>*****************NOTE**********************"
				+"</br> for <b> coins <b>itemCode</b> are mandatory."
				+"</br> for others <b> lotNumber</b>  and <b> itemCode</b>  are mandatory."
				+ "</br> for UCP products pass \"standardPrice\": {}")
		// @formatter:on
		public List<PriceResponseDto> getConversionPriceDetails(@RequestBody OrdersPriceRequest orderPriceRequest,
				@RequestParam(required = false) String locationCode) {
			return priceService.getConversionPriceDetails(orderPriceRequest, locationCode);
		}
		
		@GetMapping(value = "/taxes-iGST")
		@ApiOperation(value = "To check if IGST allowed for the customer in logged in state", notes = "API will check if IGST is allowed for the customer before adding the product in varient grid.")
		public void checkIfIGSTAllowed(@RequestParam(name = "customerId", required = false) Integer customerId,
				@RequestParam(name = "isIGST", required = false) Boolean isIGST) {
			
			taxService.isIGSTAllowedCheck(isIGST, customerId);
		}
		
}