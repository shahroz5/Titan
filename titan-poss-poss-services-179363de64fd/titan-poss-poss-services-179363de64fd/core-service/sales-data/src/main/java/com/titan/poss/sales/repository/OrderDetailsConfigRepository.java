/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDetailsConfigDao;

/**
 * Repository to handle operations on <b>sales_order_details_config</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("orderDetailsConfigRepository")
public interface OrderDetailsConfigRepository extends JpaRepository<OrderDetailsConfigDao, String> {

}
