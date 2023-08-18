/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountTypeMetaDataDao;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface DiscountTypeMetaDataRepository extends JpaRepository<DiscountTypeMetaDataDao, String> {

	/**
	 * @param isManualDiscount
	 * @return
	 */
	@Query("SELECT d FROM DiscountTypeMetaDataDao d where d.isManualDiscount = :isManualDiscount ")
	List<DiscountTypeMetaDataDao> getDiscounts(@Param("isManualDiscount") Boolean isManualDiscount);

}
