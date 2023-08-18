/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.LocationCashMemoDetailsDto;
import com.titan.poss.core.dto.OrdersPriceRequest;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.print.ReturnSalesTxnDto;
import com.titan.poss.sales.dto.response.CashMemoAndDetialsIdResponseDto;
import com.titan.poss.sales.dto.response.CashMemoResponseDto;
import com.titan.poss.sales.dto.response.ItemDetailsResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CommonCashMemoService {

	/**
	 * This method will check if cash memo exists based on cashMemoId.
	 * 
	 * @param cashMemoId
	 * @param transactionType
	 * @param subTxnType
	 * @return CashMemoDao
	 */
	CashMemoDaoExt checkIfCashMemoExistsByCashMemoId(String cashMemoId, String transactionType, String subTxnType);

	/**
	 * This method will map Cash Memo to Response DTO.
	 * 
	 * @param cashMemoDao
	 * @return CashMemoResponseDto
	 */
	CashMemoResponseDto cashMemoResponse(CashMemoDaoExt cashMemoDao);

	/**
	 * This method will list all cash memo details based on cashMemoId.
	 * 
	 * @param cashMemoId
	 * @return List<CashMemoDetailsDao>
	 */
	List<CashMemoDetailsDaoExt> getCashMemoDetails(String cashMemoId);

	/**
	 * This method will map CashMemo Header and item is list to response.
	 * 
	 * @param cashMemoDao
	 * @return CashMemoAndDetialsIdResponseDto
	 */
	CashMemoAndDetialsIdResponseDto cashMemoAndDetailsIdResponse(CashMemoDaoExt cashMemoDao,
			BigDecimal tcsToBeCollected);

	/**
	 * This method will get cash memo details if exist.
	 * 
	 * @param cashMemoId
	 * @param isPaymentForRateProtectedCNOrFromAb(if rate protected CN is added or
	 *                                               payment from AB, error will not
	 *                                               be thrown)
	 * @return List<CashMemoDetailsDao>
	 */
	List<CashMemoDetailsDaoExt> getCashMemoDetailsIfExists(String cashMemoId,
			Boolean isPaymentForRateProtectedCNOrFromAb);

	/**
	 * This method will return list of gift details if exists.
	 * 
	 * @param cashMemoId
	 * @return List<GiftDetailsDao>
	 */
	List<GiftDetailsDaoExt> getGiftDetailsIfExists(String cashMemoId);

	/**
	 * 
	 * This method will update price for all items in cash memo based on cash memo
	 * id.
	 *
	 * @param cashMemoDetailsDaoList
	 * @param salesTxnDaoExt
	 * @param isMetalRateFreezedCN   -- if yes, then metal rate check should be
	 *                               ignored.
	 */
	void updateItemPriceDetails(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, SalesTxnDaoExt salesTxnDaoExt,
			boolean isMetalRateFreezedCN);

	/**
	 * This method will update cash memo header.
	 * 
	 * @param cashMemoDao
	 * @param cashMemoDetailsDaoList
	 * @return CashMemoDaoExt
	 */
	CashMemoDaoExt updatedCashMemoHeader(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList);

	/**
	 * This method will map CashMemoDetailsDao to Dto.
	 * 
	 * @param cashMemoDetailsDao
	 * @return ItemDetailsResponseDto
	 */
	ItemDetailsResponseDto mapCashMemoDetailsToItemDto(CashMemoDetailsDaoExt cashMemoDetailsDao);

	/**
	 * This method will validate item price. If direct price update is done, then
	 * values are simply updated without validating.
	 * 
	 * @param salesTxnDaoExt
	 * @param cashMemoDetailsDao
	 * @param isPriceUpdate
	 * @param isMetalRateFreezedCN -- if yes, then metal rate check should be
	 *                             ignored.
	 */
	void validateItemPrice(SalesTxnDaoExt salesTxnDaoExt, CashMemoDetailsDaoExt cashMemoDetailsDao,
			boolean isPriceUpdate, boolean isMetalRateFreezedCN);

	/**
	 * This method will validate tax. If direct price update is done, then values
	 * are simply updated without validating. If tax update, then call engine to get
	 * tax details.
	 * 
	 * @param cashMemoDetailsDao
	 * @param isPriceOrTaxUpdate
	 * @param isTaxUpdate
	 */
	void validateTaxDetails(CashMemoDetailsDaoExt cashMemoDetailsDao, boolean isPriceUpdate, boolean isTaxUpdate);

	/**
	 * This method will update tax details & final value for the given list of
	 * items.
	 * 
	 * @param cashMemoDetailsDaoList
	 */
	void updateTaxDetails(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList);

	/*
	 * This method will verify whether the requested Cash memo by id exists or not
	 * 
	 * @return
	 */
	CashMemoDaoExt checkIfCashMemoExistsById(String id);

	/**
	 * This method will check whether pre-order data exists
	 * 
	 * @param cashMemoDao
	 * @return
	 */
	OrderDaoExt checkIfPreOrderExistsByRefTxn(SalesTxnDaoExt refTxn);

	/**
	 * This method will validate whether cash memo is against frozen pre order
	 * 
	 * @param refTxn
	 */
	void validatePreOrderDetailsIfExists(CashMemoDaoExt cashMemoDao);

	/**
	 * Method to verify, if pre-order is of Frozen rate
	 * 
	 * @param salesTxnDaoExt
	 * @return
	 */
	Boolean checkIfFrozenRatePreOrder(SalesTxnDaoExt salesTxnDaoExt);

	/**
	 * This method used to check if same item added in other transaction or notse
	 * 
	 * @param totalInventoryQuantity
	 * @param cashMemoDetailsDao
	 */
	void checkIfItemIsAlreadyAdded(Short totalInventoryQuantity, CashMemoDetailsDaoExt cashMemoDetailsDao);

	/**
	 * This method used to validate Quantity and Weight of item. Also, check if
	 * weight can be edited in CM if weight is already edited in inventory. If UCP
	 * product, then weight edit is not allowed.
	 * 
	 * @param cashMemoDetailsDao
	 * @param itemPricingType
	 */
	void validateQuantityAndWeight(CashMemoDetailsDaoExt cashMemoDetailsDao, String itemPricingType);

	/**
	 * This method will give CM config details in location.
	 * 
	 * @return LocationCashMemoDetailsDto
	 */
	LocationCashMemoDetailsDto getCmDetailsFromLocation();

	/**
	 * This method will check if FOC added or Kept FOC pending to restrict
	 * adding/updating the item
	 * 
	 * @param salesTxnDao
	 * @param isHoldCheck
	 * @param errorMessage
	 */
	void checkIfFocAdded(SalesTxnDaoExt salesTxnDao, boolean isHoldCheck, String errorMessage);

	/**
	 * This method will check if all items in CM are in stock or not.
	 * 
	 * @param cashMemoDetailsDaoList
	 */
	void checkIfItemsInStock(List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList);

	/**
	 * This method will get the hold time in minutes for the Cash memo.
	 * 
	 * @return BigDecimal
	 */
	BigDecimal getHoldTimeInMinutesForCm();

	/**
	 * This method will validate manula bill details.
	 * 
	 * @param cashMemoDao
	 * @param cashMemoDetailsDaoList
	 * @param isConfirmTxn
	 * @return ManualBillTxnDetailsDto
	 */
	ManualBillTxnDetailsDto validateManualBillValues(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, boolean isConfirmTxn);

	ReturnSalesTxnDto getSalesPrintInfo(String txnId);

	/**
	 * This method will set the best gold rate for the transaction based on BGR
	 * config and return the set of metals that should be ignored for metal rate
	 * check.
	 * 
	 * @param salesTxnDaoExt
	 * @param isPriceUpdate
	 * @param orderDao
	 * @param isHeaderCheck  --> 'true' when CM is put on 'HOLD' or 'CONFIRMED' or
	 *                       'APPROVAL PENDING'. else, 'false'
	 * @return Set<String>
	 */
	Set<String> getBestRate(SalesTxnDaoExt salesTxnDaoExt, OrderDaoExt orderDao, boolean isPriceUpdate,
			boolean isHeaderCheck);

	/**
	 * This method will get cash memo details by cashMemoId or By Item ids if exist.
	 * 
	 * @param cashMemoId
	 * @param itemIdList
	 * @return List<CashMemoDetailsDao>
	 */
	List<CashMemoDetailsDaoExt> getCashMemoDetailsByItemIdIfExists(String cashMemoId, List<String> itemIdList);

	/**
	 * This method will get cash memo details by cashMemoId or By Item ids if exist.
	 * 
	 * @param cashMemoId
	 * @param itemIdList
	 * @return List<CashMemoDetailsDao>
	 */
	List<CashMemoDetailsDaoExt> findCashMemoDetailsByItemIdIfExists(String cashMemoId, List<String> itemIdList);

	/**
	 * This method will deduct the amount from total paid amount.
	 * 
	 * @param salesTxnDao
	 * @param amountToDeduct
	 * @param locationCode
	 */
	void updateTotalAmountPaid(SalesTxnDaoExt salesTxnDao, BigDecimal amountToDeduct, String locationCode);

	CustomerTcsDetailsDto cumulativeTcsValueCheck(CashMemoDaoExt cashMemoDao);

	CustomerTcsDetailsDto mapCustomerTcsDetailsDaoToDto(CustomerTcsDetailsDaoExt customerTcsDetailsDao,
			AtomicReference<BigDecimal> cummulativeCashAmount, boolean cancelled);

	/**
	 * This method will check if item code and unit weight combination is already
	 * added in transaction.
	 * 
	 * @param cashMemoDetailsDao
	 */
	void checkIfCoinIsAddedAlready(CashMemoDetailsDaoExt cashMemoDetailsDao);

	/**
	 * this method will get item weight details.
	 * 
	 * @param weightDetails
	 * @return String
	 */
	String getInvWeightDetails(Object weightDetails);

	ApiResponseDto callEpossCustomerCoupon(String customerMasterId, String couponCode, String status,
			String transactionId);

	/**
	 * This method will calculate price API based on Ab to CM details.
	 * 
	 * @param salesTxnDao
	 * @param orderPriceRequest
	 * @param binGroup
	 * @param inventoryDetailsDao
	 * @param productGroupCode
	 * @return PriceResponseDto
	 */
	PriceResponseDto getOrderItemPriceDetails(SalesTxnDaoExt salesTxnDao, OrdersPriceRequest orderPriceRequest,
			String binGroup, InventoryDetailsDao inventoryDetailsDao, String productGroupCode);
}
