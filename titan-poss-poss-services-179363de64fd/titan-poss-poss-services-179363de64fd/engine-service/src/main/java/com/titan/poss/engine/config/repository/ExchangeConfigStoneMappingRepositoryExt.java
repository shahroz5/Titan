/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dao.ExchangeConfigStoneMappingDao;
import com.titan.poss.config.repository.ExchangeConfigStoneMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("engineExchangeConfigStoneMappingRepository")
public interface ExchangeConfigStoneMappingRepositoryExt extends ExchangeConfigStoneMappingRepository {

	@Query(value = "SELECT stone FROM ExchangeConfigStoneMappingDao stone,RangeMasterDao range WHERE stone.stoneTypeCode = :stoneTypeCode"
			+ " AND stone.range.id = range.id AND stone.exchangeConfig = :exchangeConfig AND stone.stoneQuality = :stoneQuality"
			+ " AND :carat BETWEEN range.fromRange AND range.toRange")
	ExchangeConfigStoneMappingDao findByStoneTypeCodeAndStoneQualityAndRangeAndExchangeConfig(
			@Param("stoneTypeCode") String stoneTypeCode, @Param("carat") BigDecimal carat,
			@Param("exchangeConfig") ExchangeConfigMasterDao exchangeConfig,
			@Param("stoneQuality") String stoneQuality);
}
