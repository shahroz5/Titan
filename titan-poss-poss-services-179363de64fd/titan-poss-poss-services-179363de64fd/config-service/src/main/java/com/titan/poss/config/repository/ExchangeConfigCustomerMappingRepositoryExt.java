/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigCustomerMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("exchangeConfigCustomerMappingRepositoryRepository")
public interface ExchangeConfigCustomerMappingRepositoryExt
		extends JpaRepository<ExchangeConfigCustomerMappingDaoExt, String> {

	ExchangeConfigCustomerMappingDaoExt findByExchangeConfigAndCustomerMobileNo(
			ExchangeConfigMasterDaoExt exchangeConfig, String customerMobileNo);

	List<ExchangeConfigCustomerMappingDaoExt> findByExchangeConfig(ExchangeConfigMasterDaoExt exchangeConfig);

}
