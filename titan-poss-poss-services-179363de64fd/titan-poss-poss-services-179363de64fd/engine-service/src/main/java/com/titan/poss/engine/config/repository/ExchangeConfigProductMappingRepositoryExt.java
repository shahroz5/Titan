/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.dao.ExchangeConfigProductMappingDao;
import com.titan.poss.config.repository.ExchangeConfigProductMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("engineExchangeConfigProductMappingRepository")
public interface ExchangeConfigProductMappingRepositoryExt extends ExchangeConfigProductMappingRepository {

	ExchangeConfigProductMappingDao findByExchangeConfigAndProductGroupCode(ExchangeConfigMasterDao exchangeConfig,
			String productGroup);

	List<ExchangeConfigProductMappingDao> findByExchangeConfig(ExchangeConfigMasterDao exchangeConfig);

	ExchangeConfigProductMappingDao findByExchangeConfigAndProductCategoryCode(ExchangeConfigMasterDao exchangeConfig,
			String productCategory);
}
