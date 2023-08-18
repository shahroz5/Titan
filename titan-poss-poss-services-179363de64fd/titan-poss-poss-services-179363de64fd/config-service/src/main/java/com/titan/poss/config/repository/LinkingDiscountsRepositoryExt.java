/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.config.dao.LinkingDiscountsDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface LinkingDiscountsRepositoryExt extends JpaRepository<LinkingDiscountsDaoExt, String> {

	/**
	 * @param discountDaoExt
	 * @return
	 */
	@Query("SELECT c FROM LinkingDiscountsDaoExt c WHERE (c.srcDiscountId.id = :discountId) OR (c.destDiscountId.id = :discountId)")
	List<LinkingDiscountsDaoExt> getLinkDiscounts(@Param("discountId") String discountId);

	
}
