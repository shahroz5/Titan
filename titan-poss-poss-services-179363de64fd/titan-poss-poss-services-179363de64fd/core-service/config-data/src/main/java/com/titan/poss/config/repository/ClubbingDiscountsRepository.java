/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ClubbingDiscountsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ClubbingDiscountsRepository extends JpaRepository<ClubbingDiscountsDao, String> {

	/**
	 * @param discountDaoExt
	 * @return
	 */
	@Query("SELECT c FROM ClubbingDiscountsDao c WHERE (c.discount1.id IS NULL OR c.discount1.id = :discount1) And (c.discount2.id IS NULL OR c.discount2.id = :discount2) And (c.discount3.id IS NULL OR c.discount3.id = :discount3) ")
	List<ClubbingDiscountsDao> getByDiscount(@Param("discount1") String discount1, @Param("discount2") String discount2,
			@Param("discount3") String discount3);
}
