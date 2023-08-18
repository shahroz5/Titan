/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigDetailsDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository("exchangeConfigDetailsRepository")
public interface ExchangeConfigDetailsRepository extends JpaRepository<ExchangeConfigDetailsDao, String> {

	/**
	 * @param id
	 * @param metalType
	 * @param itemType
	 * @param configId
	 * @return ExchangeConfigDetailsDao
	 */
	@Query("SELECT ec FROM ExchangeConfigDetailsDao ec WHERE ec.range.id = :rangeId AND ec.metalType = :metalType AND ec.itemType = :itemType AND ec.exchangeConfig.configId = :configId")
	ExchangeConfigDetailsDao findExchangeConfigDetails(@Param("rangeId") String rangeId,
			@Param("metalType") String metalType, @Param("itemType") String itemType,
			@Param("configId") String configId);

}
