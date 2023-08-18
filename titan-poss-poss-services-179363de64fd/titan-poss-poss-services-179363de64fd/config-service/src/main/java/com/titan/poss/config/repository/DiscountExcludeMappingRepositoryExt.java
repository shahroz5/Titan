/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountExcludeMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface DiscountExcludeMappingRepositoryExt extends JpaRepository<DiscountExcludeMappingDaoExt, String> {

	/**
	 * @param discountDaoExt
	 * @return
	 */
	List<DiscountExcludeMappingDaoExt> findAllByDiscount(DiscountDaoExt discountDaoExt);

	@Query("SELECT d from DiscountExcludeMappingDaoExt d WHERE d.discount.id = :discountId AND (d.excludeType = :excludeType OR :excludeType IS NULL) AND (d.isExcluded = :isExcluded OR :isExcluded IS NULL ) AND "
			+ "(d.itemCode = :itemCode OR :itemCode IS NULL)")
	Page<DiscountExcludeMappingDaoExt> findAllByFilters(@Param("discountId") String discountId,
			@Param("excludeType") String excludeType, @Param("isExcluded") Boolean isExcluded,
			@Param("itemCode") String itemCode, Pageable pageable);

	/**
	 * @param discount
	 * @param record
	 * @return
	 */
	List<DiscountExcludeMappingDaoExt> findAllByDiscountAndSchemeCode(DiscountDaoExt discount, String schemeCode);

}
