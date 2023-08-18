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

import com.titan.poss.config.dao.ClubbingDiscountsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ClubbingDiscountsRepositoryExt extends JpaRepository<ClubbingDiscountsDaoExt, String> {

	/**
	 * @param discountId
	 * @param pageable
	 * @return
	 */
	@Query("SELECT c FROM ClubbingDiscountsDaoExt c WHERE (c.discount1.id IN(:discountId)) OR (c.discount2.id IN(:discountId)) OR (c.discount3.id IN (:discountId)) ")
	Page<ClubbingDiscountsDaoExt> getClubbingDiscountList(@Param("discountId") List<String> discountId,
			Pageable pageable);

	/**
	 * @param discountDaoExt
	 * @return
	 */
	@Query("SELECT c FROM ClubbingDiscountsDaoExt c WHERE (:discountId IS NULL OR c.discount1.id = :discountId) OR (:discountId IS NULL OR c.discount2.id = :discountId) OR (:discountId IS NULL OR c.discount3.id = :discountId) ")
	List<ClubbingDiscountsDaoExt> getByDiscount(@Param("discountId") String discountId);
}
