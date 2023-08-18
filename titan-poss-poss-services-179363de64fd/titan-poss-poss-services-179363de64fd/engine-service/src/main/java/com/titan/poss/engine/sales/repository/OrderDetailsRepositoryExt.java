/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.OrderDetailsDao;
import com.titan.poss.sales.repository.OrderDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineOrderDetailsRepository")
public interface OrderDetailsRepositoryExt extends OrderDetailsRepository {

	/**
	 * @param itemIds
	 * @return
	 */
	@Query("Select od from OrderDetailsDao od where od.id in (:itemIds)")
	List<OrderDetailsDao> findByOrderId(@Param("itemIds") List<String> itemIds);
}
