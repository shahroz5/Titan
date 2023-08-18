/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;
import com.titan.poss.config.dao.ExchangeConfigProductMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ExchangeConfigProductMappingRepositoryExt
		extends JpaRepository<ExchangeConfigProductMappingDaoExt, String> {

	List<ExchangeConfigProductMappingDaoExt> findByExchangeConfigAndIdIn(ExchangeConfigMasterDaoExt exchangeConfig,
			Collection<String> id);

	Optional<ExchangeConfigProductMappingDaoExt> findByExchangeConfigAndId(ExchangeConfigMasterDaoExt exchangeConfig,
			String id);
	
	Optional<ExchangeConfigProductMappingDaoExt> findByExchangeConfigAndProductGroupCodeAndRangeId(ExchangeConfigMasterDaoExt exchangeConfig,
			String productGroupCode, String rangeId);

	@Query("SELECT ecp FROM ExchangeConfigProductMappingDaoExt ecp WHERE (:productCategory IS NULL OR ecp.productCategoryCode LIKE '%'+:productCategory +'%') AND (:productGroup IS NULL OR ecp.productGroupCode = :productGroup) AND (:configId IS NULL OR ecp.exchangeConfig.configId = :configId)")
	Page<ExchangeConfigProductMappingDaoExt> findAllProductCategory(@Param("productGroup")String productGroup, @Param("productCategory") String productCategory, @Param("configId") String configId, Pageable pageable);
}
