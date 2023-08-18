/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.OrderDetailsConfigDaoExt;
import com.titan.poss.sales.dao.OrderDetailsDaoExt;

/**
 * Repository for <b>sales_order_details_config</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesOrderDetailsConfigRepositoryExt")
public interface OrderDetailsConfigRepositoryExt extends JpaRepository<OrderDetailsConfigDaoExt, String> {

	/**
	 * This method will fetch config details based on item id.
	 * 
	 * @param orderItem
	 * @return OrderDetailsConfigDaoExt
	 */
	OrderDetailsConfigDaoExt findByOrderItem(OrderDetailsDaoExt orderItem);

	/**
	 * This method will fetch all the item configurations in an order.
	 * 
	 * @param order
	 * @return List<OrderDetailsConfigDaoExt>
	 */
	List<OrderDetailsConfigDaoExt> findAllByOrderItemOrder(OrderDaoExt order);
}
