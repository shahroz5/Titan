/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.CustomerOrderTempDao;
import com.titan.poss.sales.dto.CustomerOrderDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */


@Repository
public interface CustomerOrderTempRepository extends JpaRepository<CustomerOrderTempDao, String> {


	@Query(nativeQuery = true, value ="SELECT * FROM sales.dbo.customer_order_temp WHERE com_order_number IN (:coNumberList)")
	 public List<CustomerOrderTempDao> getAllByCONumberList(@Param("coNumberList")List<String> coNumberList);
	
	List<CustomerOrderTempDao> findByComOrderNumberIn(List<String> comOrderNumber);
	
    List<CustomerOrderTempDao> findByRequestTypeIn(List<String> requestTypes);
		
}
