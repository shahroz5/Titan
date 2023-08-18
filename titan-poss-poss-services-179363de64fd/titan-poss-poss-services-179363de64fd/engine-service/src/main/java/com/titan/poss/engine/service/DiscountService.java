/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

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

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface DiscountService {

	DiscountItemLevelResponseDto getDiscountsAtItemLevel(DiscountItemLevelRequestDto discountRequestDto,
			boolean throwError);

	DiscountBillLevelResponseDto getDiscountsAtTransactionLevel(DiscountBillLevelRequestDto discountBillLevelRequest);

	DiscountEngineResponseDto calculateDiscountValue(String discountId, String discountClubId,
			DiscountCalRequestDto discountCalDto);

	DiscountItemDetailsListResponseDto calculateDiscountValueforListOfItems(
			DiscountItemDetailsListRequestDto discountItemListDto);

	EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscounts(
			EligibleDiscountItemsRequestDto discountItemListDto, String discountType);

	DiscountDetailsBaseDto getDiscountConfigDetails(String discountId);

	ExchangeOfferResponseDto getExchangeOrCoinOfferDiscountDetails(String discountType, String transactionType,
			ExchangeOfferRequestDto exchangeOfferRequestDto);

	SlabBasedDiscountDetailsResponseDto calculateDiscountValueForSlabBasedDiscounts(String discountId,
			SlabBasedDiscountRequestDto slabBasedDiscountRequest);

	/**
	 * @param employeeID
	 * @param companyName
	 * @return
	 */
	EmployeeDiscountTxnResponse getMaxCountOfEmployeeDiscountTxn(String employeeID, String companyName);

	DiscountEngineResponseDto calculateAbDiscountValue(AbCoDiscountRequestDto abCoDiscountRequestDto);

	DiscountEngineResponseDto autoApplyBestDiscount(DiscountAutoCalRequestDto discountAutoCalRequestDto);

	SlabBasedDiscountDetailsResponseDto calculateAbCoDiscountValueForSlabBasedDiscounts(
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto);

	DiscountEngineResponseDto checkAndCalculateAbDiscountValue(
			AbCoValidateDiscountRequestDto abCoValidateDiscountRequestDto);

	GepPurityScemeValidationResponse validateGepPurityScheme(Boolean isRivaah,
			GepPurityScemeValidationRequest gepPurityScemeValidationRequest);

	EligibleDiscountItemsResponseDto getEligibleItemsForBillLevelDiscountsForAbToCm(
			EligibleDiscountAbItemsRequestDto discountItemListDto, String discountType);

	Map<String, DiscountEngineResponseDto> calculateRivaahDiscountsForAllItemsInDiscount(String discountType,
			String discountId, List<DiscountCalRequestDto> discountCalDtoList);

	List<DiscountItemMapiingDto> getDiscountItemMappingDetails(String itemCode, String lotNumber, String locationCode);

	List<ItemGroupMappingDto> discountIBTTansfer(List<ItemGroupMappingDto> discountItemMappingDaos);

	DiscountApplicableForItemResponseDto checkIfGivenDiscountApplicableForGiveItem(
			DiscountApplicableForItemCheckRequestDto discountApplicableForItemCheckRequest);
}
