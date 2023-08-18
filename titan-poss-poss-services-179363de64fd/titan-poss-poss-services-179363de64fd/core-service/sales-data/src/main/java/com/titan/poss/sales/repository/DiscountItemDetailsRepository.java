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

import com.titan.poss.sales.dao.DiscountItemDetailsDao;

/* 
* @author Mindtree Ltd.
* @version 1.0
*/
@Repository("SalesDiscountItemDetailsRepository")
public interface DiscountItemDetailsRepository extends JpaRepository<DiscountItemDetailsDao, String> {

	/**
	 * @param cashMemoDetailsId
	 * @return
	 */
	List<DiscountItemDetailsDao> findAllByItemId(String cashMemoDetailsId);

	List<DiscountItemDetailsDao> findAllByDiscountDetailIdIn(List<String> discountDetailIds);

	@Query(nativeQuery = true, value = "SELECT did.id,did.discount_details_id  FROM discount_item_details did where did.id IN (:ids)")
	List<Object[]> findDiscountItemIdAndDiscountDetailId(@Param("ids") List<String> ids);

	List<DiscountItemDetailsDao> findAllByItemIdInAndDiscountDetailDiscountTypeIn(List<String> cashMemoDetailsIds,
			List<String> discountTypes);

}
