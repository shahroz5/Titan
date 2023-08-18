/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountTypeMetaDataDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineDiscountTypeMetaDataRepository")
public interface DiscountTypeMetaDataRepositoryExt extends DiscountTypeMetaDataRepository {

	@Query("select discountType From DiscountTypeMetaDataDao where isDefault = true AND applicableLevel = 'ITEM_LEVEL' ")
	List<String> findByDiscountTypeForItemLevel();

	@Query("select d From DiscountTypeMetaDataDao d where d.isDefault = false AND d.applicableLevel = 'BILL_LEVEL' AND d.discountType = :discountType ")
	DiscountTypeMetaDataDao validateBillLevelDiscountType(@Param("discountType") String discountType);

	DiscountTypeMetaDataDao findByDiscountType(String discountType);

}
