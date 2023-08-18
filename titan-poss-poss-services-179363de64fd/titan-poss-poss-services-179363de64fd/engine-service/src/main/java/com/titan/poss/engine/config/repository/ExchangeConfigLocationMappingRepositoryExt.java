/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigLocationMappingDao;
import com.titan.poss.config.repository.ExchangeConfigLocationMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineExchangeConfigLocationMappingRepository")
public interface ExchangeConfigLocationMappingRepositoryExt extends ExchangeConfigLocationMappingRepository {

	/**
	 * @param locationCode
	 * @return
	 */
	Optional<ExchangeConfigLocationMappingDao> findByLocationCodeAndConfigType(String locationCode, String configType);

}
