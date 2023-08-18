/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.dto.CustomerOrderDetails;
import com.titan.poss.core.dto.LocationAdvanceBookingDetailsDto;
import com.titan.poss.core.dto.PriceResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.CashMemoDetailsDaoExt;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;
import com.titan.poss.sales.dto.response.OrderAndItemIdResponseDto;
import com.titan.poss.sales.dto.response.OrderItemDetailsResponseDto;
import com.titan.poss.sales.dto.response.OrderResponseDto;
import com.titan.poss.sales.dto.response.TotalTaxAndTaxDetailsDto;

/**
 * Service interface for common order services
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface OrderUtilService {

	/**
	 * This method will verify whether the requested Order exists or not
	 * 
	 * @param orderId
	 * @param transactionType
	 * @param subTxnType
	 * @return
	 */
	OrderDaoExt checkIfOrderExistsByOrderId(String orderId, String transactionType, String subTxnType);

	/**
	 * This method will combine order header details & item id's
	 * 
	 * @param orderDao
	 * @return
	 */
	OrderAndItemIdResponseDto orderAndItemIdResponse(OrderDaoExt orderDao, List<Integer> creditNotes);

	/**
	 * This method will get order item details by order id
	 * 
	 * @param orderId
	 * @param isPaymentForRateProtectedCNOrFromAb(if rate protected CN is added ,
	 *                                               error will not be thrown)
	 * 
	 * @return List<OrderDetailsDaoExt>
	 */
	List<OrderDetailsDaoExt> getOrderDetailsIfExists(String orderId, Boolean isPaymentForRateProtectedCN);

	/**
	 * This method will combine both orderDao & salesTxnDao attributes to result in
	 * final order response
	 * 
	 * @param orderDao
	 * @return
	 */
	OrderResponseDto orderResponse(OrderDaoExt orderDao, List<Integer> creditNotes);

	/**
	 * This method will map OrderDetailsDao to Item response Dto.
	 * 
	 * @param orderDetailsDao
	 * @return
	 */
	OrderItemDetailsResponseDto mapOrderDetailsToItemDto(OrderDetailsDaoExt orderDetailsDao);

	/**
	 * This method will verify whether the requested Order by id exists or not
	 * 
	 * @return
	 */
	OrderDaoExt checkIfOrderExistsById(String id);

	/**
	 * This method will calculate Minimum order amount as per configured values
	 * 
	 * @param orderDetailsDao
	 * @param txnType
	 * @param isRateFreeze    - only In case of Freeze Rate of Confirmed Order
	 * @return
	 */
	OrderDetailsDaoExt calculateMinOrderValue(OrderDetailsDaoExt orderDetailsDao, String txnType, Boolean isRateFreeze);

	/**
	 * This method used to check if same item added in other transaction or not
	 * 
	 * @param totalInventoryQuantity
	 * @param orderDetailsDao
	 */
	void checkIfItemIsAlreadyAdded(Short totalInventoryQuantity, OrderDetailsDaoExt orderDetailsDao);

	/**
	 * This method used to validate Quantity and Weight of item.
	 * 
	 * @param orderDetailsDao
	 */
	void validateQuantityAndWeight(OrderDetailsDaoExt orderDetailsDao);

	/**
	 * This method will validate item price. If direct price update is done, then
	 * values are simply updated without validating.
	 * 
	 * @param salesTxnDaoExt
	 * @param orderDetailsDao
	 * @param orderDetailsConfigDao
	 * @param isPriceUpdate
	 * @param isMetalRateFreezedCN  -- if yes, then metal rate check should be
	 *                              ignored.
	 */
	void validateItemPrice(SalesTxnDaoExt salesTxnDao, OrderDetailsDaoExt orderDetailsDao,
			OrderDetailsConfigDaoExt orderDetailsConfigDao, boolean isPriceUpdate, boolean isMetalRateFreezedCN);

	/**
	 * This method will validate tax. If direct price update is done, then values
	 * are simply updated without validating. 'isTaxUpdate' for tax update only.
	 * 
	 * @param orderDetailsDao
	 * @param isPriceUpdate
	 * @param isTaxUpdate
	 */
	void validateTaxDetails(OrderDetailsDaoExt orderDetailsDao, boolean isPriceUpdate, boolean isTaxUpdate);

	/**
	 * This method will update tax details & final value for the given list of
	 * items.
	 * 
	 * @param orderDetailsDaoList
	 */
	void updateTaxDetails(List<OrderDetailsDaoExt> orderDetailsDaoList);

	/**
	 * This method will update order header.
	 * 
	 * @param orderDao
	 * @return OrderDaoExt
	 */
	OrderDaoExt updateOrderHeader(OrderDaoExt orderDao,List<OrderDetailsDaoExt> orderDetailsList);

	/**
	 * Method to update order item status from last status to current status
	 * 
	 * @param List<OrderDetailsDaoExt>
	 * @param currentStatus
	 */
	void updateOrderItemStatus(List<OrderDetailsDaoExt> orderDetailsDaoList, String currentStatus);

	/**
	 * Method to get weight details
	 * 
	 * @param weightDetails
	 * @return
	 */
	String getInvWeightDetails(Object weightDetails);

	/**
	 * This method will update price details for each item in order
	 * 
	 * 
	 * @param orderItemDetailsMap
	 * @param salesTxnDao
	 * @param isRateFreeze         - In case of Freeze Rate of Confirmed Order
	 * @param metalRate
	 * @param isMetalRateFreezedCN -- if yes, then metal rate check should be
	 *                             ignored.
	 */
	void updateItemPriceDetails(Map<OrderDetailsDaoExt, OrderDetailsConfigDaoExt> orderItemDetailsMap,
			SalesTxnDaoExt salesTxnDao, Boolean isRateFreeze, boolean isMetalRateFreezedCN);

	/**
	 * This method will give AB config details from location master
	 * 
	 * @return LocationAdvanceBookingDetailsDto
	 */
	LocationAdvanceBookingDetailsDto getAbDetailsFromLocation();

	/**
	 * This method will validate manual bill detials.
	 * 
	 * @param orderDao
	 * @param orderDetailsList
	 * @param isConfirmTxn
	 * @return ManualBillTxnDetailsDto
	 */
	ManualBillTxnDetailsDto validateManualBillDetails(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsList,
			boolean isConfirmTxn);

	/**
	 * This method will be referred to get Inventory coin details by BinGroup
	 * Functionality -Convert order to CM
	 * 
	 * @param itemCode
	 * @param invWeight
	 * @param reqQty
	 * @param reqBinGroup
	 * @return
	 */
	List<InventoryDetailsDao> getInventoryCoinsByBinGroup(String itemCode, BigDecimal invWeight, Short reqQty,
			String reqBinGroup);

	/**
	 * Method to release ordered items from Reserve Bin
	 * 
	 * @param orderDetailsDaoList
	 * @return
	 */
	List<InventoryDetailsDao> releaseItemsFromReserveBin(List<OrderDetailsDaoExt> orderDetailsDaoList);

	/**
	 * Method to validate update residual Tolerance & update order status
	 * 
	 * @param orderDao
	 */
	void validateResidualToleranceAndUpdateOrder(OrderDaoExt orderDao);

	/**
	 * Method to Compare CM items with ordered items to get the order item details
	 * updated.
	 * 
	 * @param orderDetailsDaoList
	 * @param orderedCmItemList
	 * @return
	 */
	List<OrderDetailsDaoExt> validateAndUpdateOrderItemDetails(List<OrderDetailsDaoExt> orderDetailsDaoList,
			List<CashMemoDetailsDaoExt> orderedCmItemList);

	/**
	 * Method to validate Order details like Residual tolerance
	 * 
	 * @param cashMemoDao
	 * @param cashMemoDetailsDaoList
	 * @param orderDao
	 */
	void validateAndUpdateOrderHeaderDetails(CashMemoDaoExt cashMemoDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList, OrderDaoExt orderDao);

	/**
	 * Method to Save Credit notes linked to Order as payment in CM
	 * 
	 * @param orderDao
	 * @param cashMemoDao
	 */
	void saveLinkedCreditNotesAsPaymentInCashMemo(OrderDaoExt orderDao, CashMemoDaoExt cashMemoDao);

	/**
	 * Method to release item from reserve bin & order details as part of delete in
	 * CM
	 * 
	 * @param cashMemoDetailsDao
	 */
	void releaseItemFromReserveBin(OrderDetailsDaoExt orderDetailsDao);

	/**
	 * This method will get order details by orderId or By Item id list if exist.
	 * 
	 * @param orderId
	 * @param itemIdList
	 * @return List<OrderDetailsDaoExt>
	 */
	List<OrderDetailsDaoExt> getOrderDetailsByItemIdIfExists(String orderId, List<String> itemIdList);

	/**
	 * Method to release linked Credit notes
	 * 
	 * @param orderDao
	 */
	void releaseLinkedCreditNotes(OrderDaoExt orderDao);

	/**
	 * Method to update Totals of order header
	 * 
	 * @param orderDao
	 * @param orderDetailsList
	 * @return
	 */
	OrderDaoExt updateTotalsOfOrderHeader(OrderDaoExt orderDao, List<OrderDetailsDaoExt> orderDetailsList);

	/**
	 * Method to validate and apply order item discounts in invoked CM
	 * 
	 * @param salesTxnDao
	 * @param cashMemoDetailsDao
	 * @param orderDetailsDao
	 */
	void validateAndApplyOrderItemDiscounts(SalesTxnDaoExt salesTxnDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsDaoList);

	/**
	 * This method will deduct the amount from total paid amount.
	 * 
	 * @param salesTxnDao
	 * @param amountToDeduct
	 * @param locationCode
	 */
	void updateTotalAmountPaid(SalesTxnDaoExt salesTxnDao, BigDecimal amountToDeduct, String locationCode);

	/**
	 * Method to validate and apply order transaction level discounts in invoked CM
	 * 
	 * @param salesTxnDao
	 * 
	 */
	void validateAndApplyOrderTransactionLevelDiscounts(SalesTxnDaoExt salesTxnDao,
			List<CashMemoDetailsDaoExt> cashMemoDetailsList);

	/**
	 * Method to Verify if an order is of Frozen rate or not
	 * 
	 * @param salesTxnDao
	 * @return
	 */
	Boolean checkIfFrozenOrder(SalesTxnDaoExt salesTxnDao);

	/**
	 * This method will get the hold time in minutes for the AB.
	 * 
	 * @return BigDecimal
	 */
	BigDecimal getHoldTimeInMinutesForAb();

	/**
	 * This method will return order item config if exists.
	 * 
	 * @param orderDetailsDao
	 * @return OrderDetailsConfigDaoExt
	 */
	OrderDetailsConfigDaoExt getItemConfigByItem(OrderDetailsDaoExt orderDetailsDao);
	
	/**
	 * Stting Attributes of Order Details Dao
	 * @param cO
	 * @param orderDao
	 * @param price
	 * @param tax
	 * @return
	 */
	OrderDetailsDaoExt setOrderDetailsDaoAttributes(CustomerOrderDetailsDto cO,OrderDaoExt orderDao,PriceResponseDto price,TotalTaxAndTaxDetailsDto tax);

	/**
	 *This method will get the hold time in minutes for the CO.
	 * 
	 * @return BigDecimal
	 */
	BigDecimal getHoldTimeInMinutesForCo();

	/**
	 * This method will give CO config details from location master
	 * 
	 * @return CustomerOrderDetails
	 */
	CustomerOrderDetails getCoDetailsFromLocation();
	
}
