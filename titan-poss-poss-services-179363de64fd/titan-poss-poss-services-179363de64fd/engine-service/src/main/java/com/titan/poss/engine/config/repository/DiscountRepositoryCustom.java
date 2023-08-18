/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineDiscountRepositoryCustom")
public interface DiscountRepositoryCustom {

	List<DiscountDao> getDiscountCodes(String query);

}
