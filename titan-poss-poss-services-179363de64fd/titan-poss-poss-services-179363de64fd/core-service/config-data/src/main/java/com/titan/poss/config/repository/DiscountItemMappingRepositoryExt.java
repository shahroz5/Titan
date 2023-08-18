/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountItemMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountItemMappingRepositoryExt extends JpaRepository<DiscountItemMappingDaoExt, String> {

	@Query("select count(*) from DiscountItemMappingDaoExt c where c.discount.discountCode = :discountCode AND c.locationCode = :locationCode AND c.isActive=:status"
			+ " AND c.itemCode = :itemCode AND c.lotNumber = :lotNumber And c.isActive = :isActive AND (:startDate between c.startDate and c.endDate \r\n"
			+ "or :endDate between c.startDate and c.endDate)")
	int ifDiscountExist(@Param("discountCode") String discountCode, @Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("lotNumber") String lotNumber,
			@Param("isActive") Boolean isActive, @Param("startDate") Date startDate, @Param("endDate") Date endDate,
			@Param("status") Boolean status);

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountItemMappingDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);
}
