/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.DiscountDetailsDao;

/* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Repository("SalesDiscountDetailsRepository")
public interface DiscountDetailsRepository extends JpaRepository<DiscountDetailsDao, String> {

	List<DiscountDetailsDao> findAllBySalesTxnIdAndDiscountTypeIn(String salesTxnId, Set<String> discountTypeList);

	@Query(nativeQuery = true, value = "SELECT dd.id,dd.discount_config_id  FROM discount_details_sales dd where dd.id IN (:ids)")
	List<Object[]> findDiscountIdAndDiscountConfigId(@Param("ids") List<String> ids);
}
