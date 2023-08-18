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

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ExchangeConfigExcludeMappingRepositoryExt
		extends JpaRepository<ExchangeConfigExcludeMappingDao, String> {

	/**
	 * @param themeCode
	 * @param itemCode
	 * @param gepConfigId
	 * @return
	 */
	// @formatter:off
	@Query("SELECT ecm FROM ExchangeConfigExcludeMappingDao ecm \r\n"
			+ " WHERE ecm.exchangeConfig.configId = :gepConfigId \r\n"
			+ " AND ((ecm.itemCode = :itemCode AND ecm.isExcluded=1) OR ecm.itemCode IS NULL) "
			+ " AND (ecm.themeCode = :themeCode OR ecm.themeCode IS NULL)")
	// @formatter:on
	List<ExchangeConfigExcludeMappingDao> validateItem(@Param("themeCode") String themeCode,
			@Param("itemCode") String itemCode, @Param("gepConfigId") String gepConfigId);

	/**
	 * This method is used to get excluded theme code and item codes based on config
	 * Id.
	 * 
	 * @param gepConfigId
	 * @return List<ExchangeConfigExcludeMappingDao>
	 */
	List<ExchangeConfigExcludeMappingDao> findByExchangeConfigConfigIdAndIsExcludedTrue(String gepConfigId);

}
