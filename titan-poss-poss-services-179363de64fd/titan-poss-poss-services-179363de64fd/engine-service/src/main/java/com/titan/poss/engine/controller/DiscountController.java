/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.EmployeeDiscountTxnResponse;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.AbCoValidateDiscountRequestDto;
import com.titan.poss.core.discount.dto.DiscountApplicableForItemCheckRequestDto;
import com.titan.poss.core.discount.dto.DiscountAutoCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsListResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelResponseDto;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsResponseDto;
import com.titan.poss.core.discount.dto.ExchangeOfferRequestDto;
import com.titan.poss.core.discount.dto.ExchangeOfferResponseDto;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationRequest;
import com.titan.poss.core.discount.dto.GepPurityScemeValidationResponse;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountRequestDto;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.DiscountApplicableForItemResponseDto;
import com.titan.poss.core.dto.DiscountItemMapiingDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.PreAuthorizeDetails;
import com.titan.poss.engine.service.DiscountService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("engineDiscountController")
@RequestMapping("engine/v2/discounts")
public class DiscountController {

	@Autowired
	DiscountService discountService;

	/**
	 * This method will return the list of applicable discounts at the item level
	 * for a itemCode,lotNumber and locationCode.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @return List<String>.
	 */
	@ApiOperation(value = "API to get the list of applicable discounts at the ItemLevel at a location", notes = "This API will get the list of applicable discounts at an Item level for given itemCode,lotNumber wrt locationCode.")
	@PostMapping(value = "/item-level")
	public DiscountItemLevelResponseDto getDiscountsAtItemLevel(
			@RequestBody DiscountItemLevelRequestDto discountRequestDto) {
		return discountService.getDiscountsAtItemLevel(discountRequestDto, true);

	}

	/**
	 * This method will return the list of applicable discounts at the transaction
	 * level for a itemCode,lotNumber and locationCode.
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @return List<String>.
	 */
	@ApiOperation(value = "API to get the list of applicable discounts at transaction level at a location", notes = "This API will get the list of  discounts  at transaction level at a location - For Bill Level Discounts,Employee,TSSS and Tata employee discounts")
	@PostMapping(value = "/transaction-level")
	@PreAuthorize("isUserName('" + PreAuthorizeDetails.LEGACY_USER + "')"+ OR +IS_STORE_USER)
	public DiscountBillLevelResponseDto getDiscountsAtBillLevel(
			@Valid @RequestBody DiscountBillLevelRequestDto discountBillLevelRequest) {
		return discountService.getDiscountsAtTransactionLevel(discountBillLevelRequest);

	}

	/**
	 * This api calculates discountValue for an item wrt particular discount for a
	 * itemCode,lotNumber and locationCode.
	 * 
	 * @param discountId
	 * @param DiscountCalRequestDto
	 * @return AutoDiscountResponseDto.
	 */
	@ApiOperation(value = "This api calculates discountValue for an item wrt particular discount", notes = "This api calculates discountValue for an item wrt particular discount")
	@PostMapping
	public DiscountEngineResponseDto calculateDiscountValue(
			@RequestParam(required = false, name = "discountId") String discountId,
			@RequestParam(required = false, name = "discountClubId") String discountClubId,
			@RequestBody DiscountCalRequestDto discountCalDto) {
		return discountService.calculateDiscountValue(discountId, discountClubId, discountCalDto);

	}

	/**
	 * This api calculates the discountValue for every item present in the list wrt
	 * every discount id and returns the max discount applicable for a item in the
	 * response
	 * 
	 * @param discountItemListDto
	 * @return DiscountItemDetailsListResponseDto.
	 */
	@ApiOperation(value = "This API calculates the discountValue for every item present in the list wrt to every discount id from the request"
			+ " and returns max allowed discount applicable for a item.", notes = "This API calculates the discountValue for every item present in the list wrt to every discount id from the request  and returns max allowed discount applicable for a item.")
	@PostMapping(value = "/items")
	public DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(
			@RequestBody DiscountItemDetailsListRequestDto discountItemListDto) {
		return discountService.calculateDiscountValueforListOfItems(discountItemListDto);

	}

	/**
	 * This method will return the eligible items at the bill level for the given
	 * item details.
	 * 
	 * @param discountId
	 * @param discountItemListDto
	 */
	@ApiOperation(value = "API to get the eligible items for the given ItemDetails for Bill level discount types", notes = "This API will give eligible items for the given ItemDetails for Bill level discount types.")
	@PostMapping(value = "/eligible-items")
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(
			@RequestParam(required = false) @ApiParam(required = false, value = "Discount Type", allowableValues = "KARAT_EXCHANGE_OFFER_DISCOUNT,BILL_LEVEL_DISCOUNT,COIN_OFFER_DISCOUNT") String discountType,
			@RequestBody EligibleDiscountItemsRequestDto discountItemListDto) {
		return discountService.getEligibleItemsForBillLevelDiscounts(discountItemListDto, discountType);

	}

	/**
	 * This method will return all the discount configurations for a given
	 * discountId
	 * 
	 */
	@ApiOperation(value = "API to get the discount config details for the given discountId", notes = "This API gives all the config details for the given discountId")
	@GetMapping(value = "/{discountId}")
	public DiscountDetailsBaseDto getDiscountConfigDetails(@PathVariable String discountId) {
		return discountService.getDiscountConfigDetails(discountId);

	}

	/**
	 * This method will return discount item mapping for given
	 * itemCode and locationCode
	 */
	@ApiOperation(value = "API to get the discount item mapping for given itemCode", notes = "API to get the discount item mapping for given itemCode")
	@GetMapping(value = "/discount-item-mapping")
	public List<DiscountItemMapiingDto> getDiscountItemMappingDetails(@RequestParam(required = true) String itemCode,
			@RequestParam( required = true)  String lotNumber,
			@RequestParam(required = true) String locationCode) {
		return discountService.getDiscountItemMappingDetails(itemCode,lotNumber,locationCode);

	}	
	
	@ApiOperation(value = "API to transfer the discount to from one loaction to other location ", notes = "API to transfer the discount to from one loaction to other location")
	@PostMapping(value="/transfer")
	public List<ItemGroupMappingDto> discountIBTTransfer(@RequestBody List<ItemGroupMappingDto> discountItemMappingDaos)
	{
		return discountService.discountIBTTansfer(discountItemMappingDaos);
	}
	
	/**
	 * This method will return CoinOffer or Karatage Discounts type based on the
	 * request
	 * 
	 * @param exchangeOfferRequestDto
	 */
	@ApiOperation(value = "API to get the CoinOffer or Karatage Discounts type based on the request", notes = "API to get the eligible CoinOffer or Karatage Discounts type based on the request")
	@PostMapping(value = "/exchange")
	public ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(
			@RequestParam(required = true) @ApiParam(required = true, value = "Transaction Type", allowableValues = "TEP, GEP") String transactionType,
			@RequestParam(required = true) @ApiParam(required = true, value = "Discount Type", allowableValues = "COIN_OFFER_DISCOUNT,KARAT_EXCHANGE_OFFER_DISCOUNT") String discountType,
			@RequestBody ExchangeOfferRequestDto exchangeOfferRequestDto) {
		return discountService.getExchangeOrCoinOfferDiscountDetails(discountType, transactionType,
				exchangeOfferRequestDto);

	}

	/**
	 * This api calculates discountValue for an item wrt particular discount for a
	 * itemCode,lotNumber and locationCode.
	 * 
	 * @param discountId
	 * @param DiscountCalRequestDto
	 * @return DiscountDetailsResponseDto.
	 */
	@ApiOperation(value = "This api calculates discountValue for an item wrt particular discount", notes = "This api calculates discountValue for an item wrt particular discount")
	@PostMapping(value = "/{discountId}/slabs")
	public SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(
			@PathVariable String discountId, @RequestBody SlabBasedDiscountRequestDto slabBasedDiscountRequest) {
		return discountService.calculateDiscountValueForSlabBasedDiscounts(discountId, slabBasedDiscountRequest);

	}

	@GetMapping("/maxCount")
	public EmployeeDiscountTxnResponse getMaxCountOfEmployeeDiscountTxn(
			@ApiParam(name = "employeeID", value = "Provide employeeID'", required = true) @RequestParam(name = "employeeID", required = true) String employeeID,
			@ApiParam(name = "companyName", value = "Provide companyName'", required = true) @RequestParam(name = "companyName", required = true) String companyName) {
		return discountService.getMaxCountOfEmployeeDiscountTxn(employeeID, companyName);

	}

	/**
	 * This api calculates discountValue for an item for ab to cm scenario
	 * 
	 * @param discountId
	 * @param DiscountCalRequestDto
	 * @return DiscountDetailsResponseDto.
	 */
	@ApiOperation(value = "This api calculates discountValue for ab/co", notes = "This api calculates discountValue for an item wrt particular discount")
	@PostMapping(value = "/orders")
	public DiscountEngineResponseDto calculateAbDiscountValue(
			@RequestBody AbCoDiscountRequestDto abCoDiscountRequestDto) {

		return discountService.calculateAbDiscountValue(abCoDiscountRequestDto);
	}

	/**
	 * This method will auto apply the best discount applicable
	 * 
	 * @param itemCode
	 * @param lotNumber
	 * @return List<String>.
	 */
	@ApiOperation(value = "API to auto apply the best discount applicable", notes = "This API will auto apply the best discount applicable")
	@PostMapping(value = "/auto")
	public DiscountEngineResponseDto getAutoDiscount(@RequestBody DiscountAutoCalRequestDto discountAutoCalRequestDto) {
		try {
			DiscountEngineResponseDto response = discountService.autoApplyBestDiscount(discountAutoCalRequestDto);
			if (response == null) {
				throw new ServiceException("Item is not eligible for auto discount.", "ERR-ENG-040",
						"Auto discount failed for item");
			}
			return response;
		} catch (ServiceException ex) {
			throw new ServiceException("Item is not eligible for auto discount.", "ERR-ENG-040",
					"Auto discount failed for item");
		}

	}

	@ApiOperation(value = "This api calculates discountValue for an item wrt particular discount", notes = "This api calculates discountValue for an item wrt particular discount")
	@PostMapping(value = "/orders/slabs")
	public SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			@RequestBody AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto) {

		return discountService.calculateAbCoDiscountValueForSlabBasedDiscounts(abCoSlabDiscountRequestDto);
	}

	@ApiOperation(value = "This api checks and calculates discountValue for ab/co", notes = "This api checks and calculates discountValue for an item wrt particular discount")
	@PostMapping(value = "/orders/eligibility")
	public DiscountEngineResponseDto checkAndCalculateAbDiscountValue(
			@RequestBody AbCoValidateDiscountRequestDto abCoValidateDiscountRequestDto) {

		return discountService.checkAndCalculateAbDiscountValue(abCoValidateDiscountRequestDto);
	}

	@ApiOperation(value = "This api will validate against GEP purity scheme", notes = "This api will validate against GEP purity scheme")
	@PostMapping(value = "/eligible-items/gep-purity")
	public GepPurityScemeValidationResponse validateGepPurityScheme(
			@RequestParam(name = "isRivaah", required = false) Boolean isRivaah,
			@RequestBody GepPurityScemeValidationRequest gepPurityScemeValidationRequest) {

		return discountService.validateGepPurityScheme(isRivaah, gepPurityScemeValidationRequest);

	}

	/**
	 * This method will return the eligible items at the bill level for ab to cm
	 * scenario
	 * 
	 * @param discountId
	 * @param discountItemListDto
	 */
	@ApiOperation(value = "API to get the eligible items for the given ItemDetails for Bill level discount types for ab to cm", notes = "This API will give eligible items for the given ItemDetails for Bill level discount types for ab to cm.")
	@PostMapping(value = "/orders/eligible-items")
	public EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(
			@RequestParam(required = false) @ApiParam(required = false, value = "Discount Type", allowableValues = "KARAT_EXCHANGE_OFFER_DISCOUNT,BILL_LEVEL_DISCOUNT,COIN_OFFER_DISCOUNT") String discountType,
			@RequestBody EligibleDiscountAbItemsRequestDto discountItemListDto) {
		return discountService.getEligibleItemsForBillLevelDiscountsForAbToCm(discountItemListDto, discountType);

	}

	/**
	 * This api calculates additional discountValue for rivaah card for a list of
	 * items wrt particular discount for a itemCode,lotNumber and locationCode.
	 * 
	 * @param discountType
	 * @param discountId
	 * @param List<DiscountCalRequestDto>
	 * @return Map<String,DiscountEngineResponseDto>
	 */
	@ApiOperation(value = "This api calculates discountValue for an item wrt particular discount", notes = "This api calculates discountValue for an item wrt particular discount")
	@PostMapping("/rivaah")
	public Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(
			@RequestParam(name = "discountType", required = true) String discountType,
			@RequestParam(name = "discountId", required = true) String discountId,
			@RequestBody List<DiscountCalRequestDto> discountCalDtoList) {
		return discountService.calculateRivaahDiscountsForAllItemsInDiscount(discountType, discountId,
				discountCalDtoList);

	}

	/**
	 * This API checks if given discount is applicable for the given item based on
	 * input.
	 * 
	 * @param discountApplicableForItemCheckRequest
	 * @return DiscountApplicableForItemResponseDto
	 */
	@ApiOperation(value = "This API checks if discount is applicable", notes = "This API checks if given discount is applicable for the given item based on input<br/>"
			+ " NOTE: Currently works for SLAB_BASED_DISCOUNT and HIGH_VALUE_DISCOUNT only.")
	@PostMapping("/validate")
	public DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			@ApiParam(name = "body", value = "Item Details object that needs to be validated", required = true) @RequestBody DiscountApplicableForItemCheckRequestDto discountApplicableForItemCheckRequest) {
		return discountService.checkIfGivenDiscountApplicableForGiveItem(discountApplicableForItemCheckRequest);

	}

}
