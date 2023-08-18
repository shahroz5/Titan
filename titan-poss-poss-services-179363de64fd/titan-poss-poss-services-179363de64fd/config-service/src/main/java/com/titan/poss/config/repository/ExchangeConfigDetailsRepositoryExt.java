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
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigDetailsDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface ExchangeConfigDetailsRepositoryExt extends JpaRepository<ExchangeConfigDetailsDaoExt, String> {

	Optional<ExchangeConfigDetailsDaoExt> findByExchangeConfigAndId(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			String id);

	Page<ExchangeConfigDetailsDaoExt> findByExchangeConfig(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			Pageable pageable);

	List<ExchangeConfigDetailsDaoExt> findByExchangeConfigAndIdIn(ExchangeConfigMasterDaoExt exchangeConfigMasterDao,
			Collection<String> ids);

}
