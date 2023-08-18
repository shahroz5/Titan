/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigStoneMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface ExchangeConfigStoneMappingRepository extends JpaRepository<ExchangeConfigStoneMappingDao, String> {

	/**
	 * @param rangeId
	 * @param stoneTypeCode
	 * @param configId
	 * @param string
	 * @return ExchangeConfigStoneMappingDao
	 */
	@Query("SELECT sm FROM ExchangeConfigStoneMappingDao sm WHERE sm.range.id = :rangeId AND sm.stoneTypeCode = :stoneTypeCode AND sm.exchangeConfig.configId = :configId AND sm.stoneQuality = :stoneQuality")
	ExchangeConfigStoneMappingDao findExchangeConfigStone(@Param("rangeId") String rangeId,
			@Param("stoneTypeCode") String stoneTypeCode, @Param("configId") String configId,
			@Param("stoneQuality") String stoneQuality);

}
