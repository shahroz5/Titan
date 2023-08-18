/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDetailsDaoExt;

/**
 * 
 * Handles repository operations for <b>order_details</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("salesOrderDetailsRepository")
public interface OrderDetailsRepositoryExt extends JpaRepository<OrderDetailsDaoExt, String> {

	Integer countByOrderId(@Param("orderId") String orderId);

	List<OrderDetailsDaoExt> findAllByOrderId(@Param("orderId") String orderId);

	@Query("Select o from OrderDetailsDaoExt o where inventoryId in (:inventoryIds)")
	List<OrderDetailsDaoExt> findAllByInventoryIds(@Param("inventoryIds") List<String> inventoryIds);

	@Query("Select o from OrderDetailsDaoExt o where o.order.id in :orderIds")
	List<OrderDetailsDaoExt> findAllByOrderIds(@Param("orderIds") List<String> orderIds);

	OrderDetailsDaoExt findOneByIdAndOrderId(String itemId, String orderId);

	boolean existsByItemCodeAndOrderIdAndOrderSalesTxnLocationCodeAndInventoryWeight(@Param("itemCode") String itemCode,
			@Param("orderId") String orderId, @Param("locationCode") String locationCode,
			@Param("inventoryWeight") BigDecimal inventoryWeight);

	// @formatter:off
		@Query(" SELECT odtls FROM com.titan.poss.sales.dao.OrderDetailsDaoExt odtls \r\n"
				+ " WHERE (:id IS NULL OR odtls.id != :id) \r\n"
				+ " AND odtls.order.salesTxn.docDate = :currentDate \r\n"
				+ " AND odtls.itemCode = :itemCode \r\n"
				+ " AND (odtls.inventoryId = :inventoryId) \r\n"
				+ " AND ((odtls.order.salesTxn.status IN (:statusList)) OR (odtls.order.id = :orderId)) \r\n"
				+ " AND odtls.order.salesTxn.locationCode = :locationCode")
		// @formatter:on
	List<OrderDetailsDaoExt> listByIdNotInAndItemCodeAndDocDateAndInventoryIdAndStatusandLocationCode(
			@Param("id") String id, @Param("currentDate") Date currentDate, @Param("itemCode") String itemCode,
			@Param("inventoryId") String inventoryId, @Param("statusList") List<String> statusList,
			@Param("locationCode") String locationCode, @Param("orderId") String orderId);

	/**
	 * Query to fetch order item details by status
	 * 
	 * @param id
	 * @param name
	 * @return
	 */
	List<OrderDetailsDaoExt> findAllByOrderIdAndStatus(String id, String name);

	/**
	 * @param updatedItemIds
	 * @return
	 */
	List<OrderDetailsDaoExt> findByIdIn(Collection<String> updatedItemIds);

	@Query("SELECT orderDtls FROM com.titan.poss.sales.dao.OrderDetailsDaoExt orderDtls "
			+ "WHERE orderDtls.order.id = :orderId AND (NULLIF(CHOOSE(1,:itemIdList),'') IS NULL OR orderDtls.id IN (:itemIdList))")
	List<OrderDetailsDaoExt> listItemDetailsByOrderIdAndItemIds(@Param("orderId") String orderId,
			@Param("itemIdList") List<String> itemIdList);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT * FROM sales_order_details sod "
			+ " WHERE sod.order_id = :orderId "
			+ " AND (sod.total_discount IS NULL OR sod.total_discount = 0) "
			+ " AND (nullif(CHOOSE(1, :itemIdsNotIn), '') IS NULL OR sod.id NOT IN (:itemIdsNotIn)) "
			+ " AND (nullif(CHOOSE(1, :itemIdsIn), '') IS NULL OR sod.id IN (:itemIdsIn)) "
			+ " AND (:productGroupCode IS NULL OR sod.product_group_code = :productGroupCode)")
	// @formatter:on
	List<OrderDetailsDaoExt> findAllByOrderIdAndTotalDiscountEqualsZeroAndIdNotIn(@Param("orderId") String orderId,
			@Param("itemIdsNotIn") List<String> itemIdsNotIn, @Param("productGroupCode") String productGroupCode,
			@Param("itemIdsIn") List<String> itemIdsIn);

}
