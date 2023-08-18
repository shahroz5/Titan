/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.repository.RangeMasterRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface RangeMasterRepositoryExt extends RangeMasterRepository {

	/**
	 * @param purity
	 * @return
	 */

	@Query("SELECT r from RangeMasterDao r where r.rangeType=:rangeType and :value between r.fromRange and r.toRange and r.isActive=true")
	RangeMasterDao findByRangeValue(@Param("rangeType") String rangeType, @Param("value") BigDecimal value);
}
