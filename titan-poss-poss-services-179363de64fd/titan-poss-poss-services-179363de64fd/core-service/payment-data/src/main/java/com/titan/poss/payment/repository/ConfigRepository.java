/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CONFIG_REPOSITORY;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(PAYMENT_CONFIG_REPOSITORY)
public interface ConfigRepository extends JpaRepository<ConfigDao, String> {
	/**
	 * This method will return the Payment Configuration details based on the
	 * configId.
	 * 
	 * @param configId
	 * @return ConfigDao
	 */
	ConfigDao findOneByConfigId(String configId);

	/**
	 * This method will return the Payment Configuration details based on the
	 * configId and description.
	 * 
	 * @param configId
	 * @param description
	 * @return ConfigDao
	 */
	@Query("SELECT cd FROM ConfigDao cd WHERE (cd.configId = :configId) AND (cd.description = :description OR nullif(CHOOSE(1,:description),'') IS NULL)")
	ConfigDao findOneByConfigIdAndDescription(@Param("configId") String configId,
			@Param("description") String description);

}
