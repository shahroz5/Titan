/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigLocationMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository("exchangeConfigLocationMappingRepository")
public interface ExchangeConfigLocationMappingRepository
		extends JpaRepository<ExchangeConfigLocationMappingDao, String> {

	/**
	 * @param configType
	 * @param locationCode
	 * @return
	 */
	ExchangeConfigLocationMappingDao findByConfigTypeAndLocationCode(String configType, String locationCode);

}
