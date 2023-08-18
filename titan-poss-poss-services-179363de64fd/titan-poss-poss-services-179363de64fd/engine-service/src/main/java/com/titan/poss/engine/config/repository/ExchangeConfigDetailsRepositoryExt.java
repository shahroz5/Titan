/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigDetailsDao;
import com.titan.poss.config.repository.ExchangeConfigDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineExchangeConfigDetailsRepository")
public interface ExchangeConfigDetailsRepositoryExt extends ExchangeConfigDetailsRepository {

	/**
	 * @param configId
	 * @param buisnessDate
	 * @param metalType
	 * @param itemType
	 * @param string
	 * @return
	 */
	// @formatter:off
	@Query("SELECT ecd FROM ExchangeConfigDetailsDao ecd,RangeMasterDao rm,ExchangeConfigMasterDao ecm "
			+ " WHERE ecd.exchangeConfig.configId=ecm.configId AND ecd.range.id=rm.id AND :purity between rm.fromRange AND rm.toRange "
			+ " AND ecd.exchangeConfig.configId=:configId AND ecd.metalType=:metalType AND ecd.itemType=:itemType "
			+ " AND ecm.isActive=1 AND rm.isActive=1")
	// @formatter:on
	ExchangeConfigDetailsDao findByCombination(@Param("configId") String configId, @Param("metalType") String metalType,
			@Param("itemType") String itemType, @Param("purity") BigDecimal purity);

}
