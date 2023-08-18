/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ClubbingDiscountsDao;
import com.titan.poss.config.repository.ClubbingDiscountsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineClubbingDiscountsRepository")
public interface ClubbingDiscountsRepositoryExt extends ClubbingDiscountsRepository {

	/**
	 * @param discountDaoExt
	 * @return
	 */
	@Query("SELECT c FROM ClubbingDiscountsDao c WHERE ((c.discount1.id IS NULL OR c.discount1.id IN (:discountIds)) AND (c.discount2.id IS NULL OR c.discount2.id IN (:discountIds))  AND (c.discount3.id IS NULL OR c.discount3.id IN (:discountIds))) ")
	List<ClubbingDiscountsDao> getClubbingDetails(@Param("discountIds") Set<String> discountIds);
	
	@Query("SELECT c.discount1.id, c.discount2.id, c.discount3.id FROM ClubbingDiscountsDao c WHERE c.id = :id")
	String getClubbingDiscount(@Param("id") String id);
	
	@Query("SELECT DISTINCT(c) FROM ClubbingDiscountsDao c WHERE c.discount1.id in (:discountIds) or c.discount2.id in (:discountIds) or c.discount3.id in (:discountIds)")
	Set<ClubbingDiscountsDao> getClubDiscounts(@Param("discountIds") Set<String> discountIds);
}
