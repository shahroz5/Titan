/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ExchangeConfigExcludeMappingRepositoryExt
		extends JpaRepository<ExchangeConfigExcludeMappingDaoExt, String> {

	@Query(value = "SELECT ec FROM ExchangeConfigExcludeMappingDaoExt ec WHERE ec.exchangeConfig= :exchangeConfig AND "
			+ " (ec.itemCode = :itemCode OR :itemCode IS NULL) AND ec.themeCode IS NULL")
	Page<ExchangeConfigExcludeMappingDaoExt> getItemMapping(
			@Param("exchangeConfig") ExchangeConfigMasterDaoExt exchangeConfig, @Param("itemCode") String itemCode,
			Pageable pageable);

	@Query(value = "SELECT ec FROM ExchangeConfigExcludeMappingDaoExt ec WHERE ec.exchangeConfig= :exchangeConfig AND "
			+ " (ec.themeCode = :themeCode OR :themeCode IS NULL) AND ec.itemCode IS NULL")
	Page<ExchangeConfigExcludeMappingDaoExt> getThemeMapping(
			@Param("exchangeConfig") ExchangeConfigMasterDaoExt exchangeConfig, @Param("themeCode") String themeCode,
			Pageable pageable);

	List<ExchangeConfigExcludeMappingDaoExt> findByExchangeConfigAndIdIn(ExchangeConfigMasterDaoExt exchangeConfig,
			Collection<String> ids);
}
