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

import org.springframework.stereotype.Service;

import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountCalRequestDto;
import com.titan.poss.core.discount.dto.DiscountCustDetails;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountEngineResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.EligibleDiscountAbItemsRequestDto;
import com.titan.poss.core.discount.dto.EligibleDiscountItemsRequestDto;
import com.titan.poss.core.discount.dto.GepConfigDetailsRes;
import com.titan.poss.core.discount.dto.RivaahGhsDiscountDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountDetailsResponseDto;
import com.titan.poss.core.discount.dto.SlabBasedDiscountRequestDto;
import com.titan.poss.core.discount.dto.TransactionDetailsDto;
import com.titan.poss.core.dto.AbCoDiscountRequestDto;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.discount.dto.request.DiscountBillLevelCreateDto;
import com.titan.poss.sales.dto.DiscountDetailDto;
import com.titan.poss.sales.dto.DiscountTransactionDetails;
import com.titan.poss.sales.dto.DiscountValueDetailsObjectDto;
import com.titan.poss.sales.dto.SalesInvoiceDetailsDto;
import com.titan.poss.sales.dto.SalesItemDetailsDto;
import com.titan.poss.sales.dto.request.DiscountOtherDetailsDto;
import com.titan.poss.sales.dto.response.DiscountDetailResponseDto;

/**
 * Service Interface for Discount Util methods
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service("salesDiscountUtilService")
public interface DiscountUtilService {

	/**
	 * Method to apportion fixed bill level discount value on to eligible items
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param billDiscountEligibleItemIds
	 */
	void apportionBillLevelDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails, SalesTxnDaoExt salesTxn,
			List<String> billDiscountEligibleItemIds, DiscountOtherDetailsDto discountOtherDetails);

	/**
	 * Method to calculate UCP discount at each eligible item level and sum up as
	 * bill level discount applicable
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param billDiscountEligibleItemIds
	 * @return
	 */
	DiscountDetailsDaoExt calculateBillLevelDiscountOnUCPOfEachItemAndSumUp(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<String> billDiscountEligibleItemIds);

	/**
	 * Method to create Discount details
	 * 
	 * @param discountDetail
	 * @param salesTxn
	 * @param applicableLevel
	 * @param discountOtherDetails
	 * @param status
	 * @param refPaymentDetails
	 * @return DiscountDetailsDaoExt
	 */
	DiscountDetailsDaoExt createDiscountDetails(DiscountDetailDto discountDetail, SalesTxnDaoExt salesTxn,
			String applicableLevel, DiscountOtherDetailsDto discountOtherDetails, String status,
			PaymentDetailsDaoExt refPaymentDetails);

	/**
	 * Method to save Discount config details from Discount engine
	 * 
	 * @param discountConfigs
	 * @return
	 */
	DiscountConfigDetailsDaoExt saveDiscountConfigDetails(DiscountDetailsBaseDto discountConfigs);

	/**
	 * Method to validate Common basic criteria configurations applicable across
	 * discounts
	 * 
	 * @param basicCriteriaConfigs
	 * @param discountValue
	 * @param isEdited
	 * @param engineDiscountValue
	 * @param discountCode
	 * @return
	 */
	BigDecimal validateCommonBasicCriteriaConfigs(BaseBasicCriteriaDetails basicCriteriaConfigs,
			BigDecimal discountValue, Boolean isEdited, BigDecimal engineDiscountValue, String discountCode);

	/**
	 * Method validate common Clubbing offers applicable across discounts
	 * 
	 * @param clubOfferConfigs
	 * @param discountCode
	 * @param salesTxn
	 */
	void validateCommonEligibleClubOfferConfigs(ClubbingConfigDetails clubOfferConfigs, String discountCode,
			SalesTxnDaoExt salesTxn);

	/**
	 * Method to Get transaction specific item details for AB/CM into common dto
	 * 
	 * @param salesTxn
	 * @param itemIdList
	 * @return
	 */
	List<SalesItemDetailsDto> getTransactionSpecificItemDetails(SalesTxnDaoExt salesTxn, List<String> itemIdList);

	/**
	 * Method to Update transaction specific item details for AB/CM
	 * 
	 * @param salesTxn
	 * @param itemIdList
	 * @return
	 */
	void updateTransactionSpecificItemDetails(SalesTxnDaoExt salesTxn, Set<String> updatedItemIds,
			Boolean isPriceUpdate);

	/**
	 * Method to Frame Request dto for Discount Engine API to calculate discount
	 * value for a item
	 * 
	 * @param salesTxn
	 * @param itemId
	 * @param rivaahGhsDetails
	 * @return DiscountCalRequestDto
	 */
	DiscountCalRequestDto getDiscountEngineRequestDto(SalesTxnDaoExt salesTxn, String itemId,
			RivaahGhsDiscountDto rivaahGhsDetails,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails);

	/**
	 * Method to get transaction details required for Discount engine
	 * 
	 * @param salesTxn
	 * @return
	 */
	TransactionDetailsDto getTransactionDetailsRequestDto(SalesTxnDaoExt salesTxn);

	/**
	 * Method to get customer details required for Discount engine
	 * 
	 * @param salesTxn
	 * @return
	 */
	DiscountCustDetails getCustomerDetailsRequestDto(SalesTxnDaoExt salesTxn);

	/**
	 * Method to get item specific discounts details
	 * 
	 * @param salesTxn
	 * @param itemIds
	 * @return
	 */
	List<DiscountItemDetailsReqDto> getDiscountItemDetailsRequestDto(SalesTxnDaoExt salesTxn, List<String> itemIds);

	/**
	 * Method to Frame DTO for item level discount details entry
	 * 
	 * @param itemId
	 * @param discountDetails
	 * @param discountOtherDetails
	 * @param discountValueDetailsJson
	 * @return
	 */
	DiscountItemDetailsDaoExt getItemDiscountDetails(String itemId, DiscountDetailsDaoExt discountDetails,
			DiscountOtherDetailsDto discountOtherDetails, JsonData discountValueDetailsJson);

	/**
	 * Method to validate eligible discounts and create Best discount for each item
	 * - for Employee discount, Tata employee, TSSS discount
	 * 
	 * @param salesTxn
	 * @param discountEligibleItemResponseDto
	 * @param discountBillLevelCreateDto
	 * @return List<String> //discount txn ids of applied items(used for Rivaah GHS)
	 */
	List<String> validateAndCreateBestDiscountForEligibleItems(SalesTxnDaoExt salesTxn,
			DiscountBillLevelResponseDto discountEligibleItemResponseDto,
			DiscountBillLevelCreateDto discountBillLevelCreateDto);

	/**
	 * Method to Get request body to check eligible discounts w.r.t coupon or
	 * employee details like Employee discount, TATAT employee & TSSS discount
	 * 
	 * @param salesTxn
	 * @param discountBillLevelCreateDto
	 * @param discountType
	 * @return
	 */
	DiscountBillLevelRequestDto getDiscountEligibleRequestDto(SalesTxnDaoExt salesTxn,
			DiscountBillLevelCreateDto discountBillLevelCreateDto, String discountType);

	/**
	 * Method to Validate atleast one item should have opted for the applied
	 * transaction level discounts like employee,Tata employee, TSSS discounts
	 * 
	 * @param discountType
	 * @param salesTxn
	 * @param discountTxnId
	 * @return
	 */
	List<DiscountDetailsDaoExt> checkIfDiscountDetailsExistsByDiscountType(String discountType, SalesTxnDaoExt salesTxn,
			String discountTxnId);

	/**
	 * Method to get Discount txn details like employee coupon codes, TSSS coupon
	 * codes, TATA employee details.etc stored at sales_transcation table
	 * 
	 * @param salesTxn
	 * @return
	 */
	DiscountTransactionDetails getDiscountTxnDetails(SalesTxnDaoExt salesTxn);

	/**
	 * Method to re apportionate the bill level discount on price update
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param apportionedItemDiscountDetails
	 * @param isPriceUpdate
	 */
	void reApportionBillLevelDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails, SalesTxnDaoExt salesTxn,
			List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails, Boolean isPriceUpdate);

	/**
	 * Method to re calculate the bill level discount on price update
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param apportionedItemDiscountDetails
	 * @param isPriceUpdate
	 */
	void reCalculateBillLevelDiscountOnUCPOfEachItemAndSumUp(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails,
			Boolean isPriceUpdate);

	/**
	 * Method to form Discount details response dto at transaction level with
	 * discountDetailsDao as input
	 * 
	 * @param discountDetail
	 * @return
	 */
	DiscountDetailResponseDto getDiscountDetailsResponseDto(DiscountDetailsDaoExt discountDetail);

	/**
	 * Method to validate transaction status for discount value update
	 * 
	 * @param status
	 * @param txnType
	 */
	void checkSalesTranscationStatusForDiscount(String status, String txnType);

	/**
	 * Method to check if any bill level discounts applied in a transaction
	 * 
	 * @param salesTxn
	 * @return
	 */
	void checkIfBillLevelDiscountApplied(SalesTxnDaoExt salesTxn);

	/**
	 * Method to check if any applied discounts are in OPEN status in a transaction
	 * 
	 * @param salesTxn
	 * @return
	 */
	Set<String> checkIfAnyAppliedDiscountsAreInOpenStatus(SalesTxnDaoExt salesTxn);

	/**
	 * Method to check if any customer dependent discounts applied in a transaction
	 * 
	 * @param salesTxn
	 * @param newCustomerIdForUpdate
	 * @return
	 */
	Set<String> checkIfAnyCustomerDependentDiscountsApplied(SalesTxnDaoExt salesTxn, Integer newCustomerIdForUpdate);

	/**
	 * Method to get transaction type specific Invoice details
	 * 
	 * @param salesTxn
	 * @return
	 */
	SalesInvoiceDetailsDto getTransactionSpecificInvoiceDetails(SalesTxnDaoExt salesTxn);

	/**
	 * Method to Create Request body to fetch Eligible items for Bill level
	 * discounts like Coin offer discount,Bill level discount,Karatage offer
	 * discount
	 * 
	 * @param salesTxn
	 * @param discountBillDetail
	 * @return
	 */
	EligibleDiscountItemsRequestDto getEligibleItemRequestBody(SalesTxnDaoExt salesTxn,
			DiscountBillLevelItemDetailsDto discountBillDetail);

	/**
	 * Method to validate Max discount allowed
	 * 
	 * @param discountValue
	 * @param maxDiscountAlloweed
	 * @param discountCode
	 */
	void validateMaxDiscountAllowed(BigDecimal discountValue, BigDecimal maxDiscountAlloweed, String discountCode);

	/**
	 * Method to apportion karatage type specific discount value on to eligible
	 * items
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param billDiscountEligibleItemIds
	 * @param applicableDiscountValue
	 */
	BigDecimal apportionKaratageDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn, List<String> eligibleSalesItemIds, BigDecimal applicableDiscountValue,
			String applicableKaratageType, List<String> karatageEligibleItemIds,
			DiscountOtherDetailsDto discountOtherDetails);

	/**
	 * Method to get Discount value details Object
	 * 
	 * @param discountValueDetails
	 * @return
	 */
	DiscountValueDetailsObjectDto getDiscountValueDetailsObject(String discountValueDetails);

	/**
	 * Method to re apportion karatage type specific discount value on to eligible
	 * items
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @param apportionedItemDiscountDetails
	 * @param isPriceUpdate
	 * @param applicableDiscountValue
	 */
	void reApportionKaratageDiscountsToApplicableItems(DiscountDetailsDaoExt discountDetails, SalesTxnDaoExt salesTxn,
			List<DiscountItemDetailsDaoExt> apportionedItemDiscountDetails, Boolean isPriceUpdate,
			BigDecimal applicableDiscountValue);

	/**
	 * Method to create Bill level Discount details Dao
	 * 
	 * @param discountBillDetail
	 * @param salesTxn
	 * @param applicableLevel
	 * @param status
	 * @param discountValue
	 * @return
	 */
	DiscountDetailsDaoExt createBillLevelDiscountDetails(DiscountBillLevelItemDetailsDto discountBillDetail,
			SalesTxnDaoExt salesTxn, String applicableLevel, String status, BigDecimal discountValue);

	/**
	 * Method to check if DV is applied.
	 * 
	 * @param salesTxn
	 * @param message
	 * @param isPriceUpdate
	 */
	void checkIfDVApplied(SalesTxnDaoExt salesTxn, String message, Boolean isPriceUpdate);

	/**
	 * Method to get Request dto to calculate cumulative discount applicable
	 * 
	 * @param salesTxn
	 * @param cumulativeItemIds
	 * @param currentItem               - helpful for application of cumm. discount
	 *                                  on new item.
	 * @param applicableCumulativeItems
	 * @param itemsValidOrExclude
	 * @return
	 */
	SlabBasedDiscountRequestDto getCumulativeDiscountRequestDto(SalesTxnDaoExt salesTxn, String currentItem,
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems, List<String> itemsValidOrExclude);

	/**
	 * Method to apply cumulative discounts on applicable items and returns if
	 * discount is applicable(true) or not(false).
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 * @param itemId
	 * @param applicableCumulativeItems
	 * 
	 * @return Boolean
	 */
	Boolean applyCumulativeDiscounts(SalesTxnDaoExt salesTxn, DiscountDetailDto discountDetail, String itemId,
			List<DiscountItemDetailsDaoExt> applicableCumulativeItems, String cumulativeDiscountId,
			List<String> itemsValidOrExclude, DiscountOtherDetailsDto discountOtherDetails);

	/**
	 * Method to verify and delete impacted cumulative item discounts, if applicable
	 * 
	 * @param salesTxn
	 * @param currentDiscountItemDetailsList
	 */
	void verifyAndDeleteCumulativeItemDiscounts(SalesTxnDaoExt salesTxn,
			List<DiscountItemDetailsDaoExt> currentDiscountItemDetailsList, Boolean isCurrentItemIgnore);

	/**
	 * Method to delete item discount details and discount config details
	 * 
	 * @param discountItemDetailsList
	 */
	void deleteAllItemDiscountDetails(List<DiscountItemDetailsDaoExt> discountItemDetailsList);

	/**
	 * Method to generate request body for order to CM discount value calculate
	 * request to engine
	 * 
	 * @param salesTxn
	 * @param cmItemId
	 * @param appliedItemDiscount
	 * @param rivaahGhsDetails
	 * @return AbCoDiscountRequestDto
	 */
	AbCoDiscountRequestDto createOrderToCmDiscountRequestDto(SalesTxnDaoExt salesTxn, String cmItemId,
			DiscountItemDetailsDaoExt appliedItemDiscount, RivaahGhsDiscountDto rivaahGhsDetails);

	/**
	 * 
	 * Method to apply Order to CM cumulative discounts
	 * 
	 * @param salesTxn
	 * @param discountDetail
	 * @param itemId
	 * @param applicableCumulativeItems
	 * @param referenceId
	 * @param appliedItemDiscount
	 * @param itemsValidOrExclude
	 * @return SlabBasedDiscountDetailsResponseDto
	 */
	SlabBasedDiscountDetailsResponseDto applyCumulativeOrderToCmDiscounts(SalesTxnDaoExt salesTxn,
			DiscountDetailDto discountDetail, String itemId, List<DiscountItemDetailsDaoExt> applicableCumulativeItems,
			String cumulativeDiscountId, DiscountItemDetailsDaoExt appliedItemDiscount,
			List<String> itemsValidOrExclude);

	/**
	 * This method will filter the non eligible items from the given discount.
	 * 
	 * @param discountDetails
	 * @param salesTxn
	 * @return List<SalesItemDetailsDto>
	 */
	List<SalesItemDetailsDto> filterAndGetEligibleItemsForCurrentDiscount(DiscountDetailsDaoExt discountDetails,
			SalesTxnDaoExt salesTxn);

	/**
	 * Method to get order discount config details
	 * 
	 * @param discountConfig
	 * @param itemDiscountConfigDetails
	 */
	void getOrderDiscountConfigDetails(DiscountConfigDetailsDaoExt discountConfig,
			DiscountDetailsBaseDto itemDiscountConfigDetails, Boolean configsRequired);

	/**
	 * This method will get the best discount out of all the discount added based on
	 * payment......................................................................
	 * true - older discount will be deleted and the current discount to be saved.
	 * false - current discount should not be saved.
	 * 
	 * @param bestDiscountAmount
	 * @param salesTxn
	 * @param paymentDetailsDao
	 * @return Map<Boolean,List<DiscountDetailsDaoExt>>
	 */
	Map<Boolean, List<DiscountDetailsDaoExt>> getBestDiscount(BigDecimal bestDiscountAmount, SalesTxnDaoExt salesTxn,
			PaymentDetailsDaoExt paymentDetailsDao);

	/**
	 * This method will get the payment details based on refpaymentId.
	 * 
	 * @param refPaymentId
	 * @param paymentCode
	 * @param locationCode
	 * @return PaymentDetailsDaoExt
	 */
	PaymentDetailsDaoExt getRefPaymentDetailById(String refPaymentId, String paymentCode, String locationCode);

	/**
	 * This method will delete the payment individually. Assumption: payment will be
	 * in 'OPEN' status and used only for Credit note payments
	 * 
	 * @param paymentDetails
	 * @param locationCode
	 */
	void deletePaymentIndividually(PaymentDetailsDaoExt paymentDetails, String locationCode);

	/**
	 * This method is used to delete header level(bill level) discounts.
	 * 
	 * @param salesTxn
	 * @param discountDetails
	 */
	void deleteHeaderDiscountByDiscountDetails(SalesTxnDaoExt salesTxn, DiscountDetailsDaoExt discountDetails);

	/**
	 * Method to frame request body to check eligible items for transaction level
	 * discounts like karatage exchange offer or coin offer discounts
	 * 
	 * @param salesTxn
	 * @param orderDiscountDetailDao
	 * @return
	 */
	EligibleDiscountAbItemsRequestDto getEligibleItemRequestBodyForOrderToCM(SalesTxnDaoExt salesTxn,
			DiscountDetailsDaoExt orderDiscountDetailDao);

	/**
	 * Method to create Bill level Discount details Dao for Order To CM discounts
	 * 
	 * @param orderDiscountDetailsDao
	 * @param salesTxn
	 * @param status
	 * @return
	 */
	DiscountDetailsDaoExt createBillLevelDiscountDetailsForOrderToCM(DiscountDetailsDaoExt orderDiscountDetailDao,
			SalesTxnDaoExt salesTxn, String status);

	/**
	 * This method is used to validate GEP purity config.
	 * 
	 * @param gepConfigDetailsRes
	 * @param utilzPct
	 * @param businessDate
	 * @param creditNoteDao
	 * @param isAppliedAsDiscount
	 * @param salesTxnDao
	 * @return boolean
	 */
	boolean validateGepPutiryConfig(GepConfigDetailsRes gepConfigDetailsRes, BigDecimal utilzPct, Date businessDate,
			CreditNoteDaoExt creditNoteDao, boolean isAppliedAsDiscount, SalesTxnDaoExt salesTxnDao);

	/**
	 * Method to validate Order items discount applicability on new item
	 * 
	 * @param salesTxnDao
	 * @param itemId
	 */
	void validateOrderDiscountsApplicabilityOnNewItem(SalesTxnDaoExt salesTxnDao, String itemId);

	/**
	 * @param salesTxn
	 */
	void validateRivaahDiscounts(SalesTxnDaoExt salesTxn);

	/**
	 * @param salesTxn
	 */
	void removeRivaahDiscounts(SalesTxnDaoExt salesTxn);

	/**
	 * @param impactedItemIds
	 * @param itemDiscounts
	 * @param salesTxn
	 */
	void recalculateCumulateDiscount(Set<String> impactedItemIds, List<DiscountItemDetailsDaoExt> itemDiscounts,
			SalesTxnDaoExt salesTxn, Set<String> itemsToIgnore, String discountIdToCheck, Boolean isPriceUpdate);

	/**
	 * @param referenceId
	 * @param discountId
	 * @param rivaahGhsDiscountDetails
	 * @param salesTxn
	 * @param itemId
	 * @return
	 */
	DiscountEngineResponseDto getEngineResponseDto(String referenceId, String discountId,
			RivaahGhsDiscountDto rivaahGhsDiscountDetails, SalesTxnDaoExt salesTxn, String itemId,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExcludeDetails);

	void checkIfDiscountApplied(SalesTxnDaoExt salesTxnDao);

	void verifyIfBillLevelDiscountAppliedInTransaction(SalesTxnDaoExt salesTxn, String discountCode);

	List<String> getPossibleExcludeItemsForCummulativeDiscount(SalesTxnDaoExt salesTxn, List<String> itemsToIgnore,
			String productGroupCode);

	AbCoSlabDiscountRequestDto getOrderToCmCumulativeDiscountRequestDto(SalesTxnDaoExt salesTxn,
			List<String> cumulativeItemIds, DiscountItemDetailsDaoExt appliedItemDiscount);

	/**
	 * Method to delete 'BILL_LEVEL' item discount details and discount config
	 * details
	 * 
	 * @param discountItemDetailsList
	 */
	void deleteAllBillLevelDiscountDetailsForTheItems(List<DiscountItemDetailsDaoExt> discountItemDetailsList);

	String checkIfItemCanBeIncludedInSlabOrHighValueDiscount(String discountDetailsAtItem,
			SalesItemDetailsDto salesItemDetailsDto);

	void getInventoryItemDetails(String itemDetails, String inventoryId, SalesItemDetailsDto salesItemDetailsDto);

	Set<String> getPossibleExcludeItemsForCummulativeDiscountForAbToCm(SalesTxnDaoExt salesTxn,
			List<String> itemsToConsider, String productGroupCode);

	PaymentDetailsDaoExt disableIsDiscountPresent(PaymentDetailsDaoExt paymentDetailsDao);
}
