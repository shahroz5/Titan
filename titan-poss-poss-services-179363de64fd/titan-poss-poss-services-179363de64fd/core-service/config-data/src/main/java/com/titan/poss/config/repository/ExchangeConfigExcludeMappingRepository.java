/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigExcludeMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository("exchangeConfigExcludeMappingRepository")
public interface ExchangeConfigExcludeMappingRepository extends JpaRepository<ExchangeConfigExcludeMappingDao, String> {

	ExchangeConfigExcludeMappingDao getOneByExchangeConfigConfigIdAndItemCode(String configId, String itemCode);

}
