/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigMasterDao;
import com.titan.poss.config.repository.ExchangeConfigMasterRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("engineExchangeConfigMasterRepository")
public interface ExchangeConfigMasterReporsitoryExt extends ExchangeConfigMasterRepository {

	/**
	 * This query will be used for TEP exception
	 * 
	 * @param locationCode
	 * @param itemCode
	 * @param customerMobileNo
	 * @param businessDate
	 * @param configType
	 * @return ExchangeConfigMasterDao
	 */
	// @formatter:off
	@Query(value = "SELECT config FROM ExchangeConfigMasterDao config, ExchangeConfigLocationMappingDao loc,"
			+ " ExchangeConfigCustomerMappingDao cus WHERE config.configId=loc.exchangeConfig.configId AND "
			+ " cus.exchangeConfig.configId=config.configId AND loc.locationCode = :locationCode AND config.itemCode = :itemCode "
			+ " AND cus.customerMobileNo = :customerMobileNo AND :businessDate BETWEEN config.startDate AND config.endDate "
			+ " AND config.configType = :configType")
	// @formatter:on
	ExchangeConfigMasterDao getExchangeConfigMaster(@Param("locationCode") String locationCode,
			@Param("itemCode") String itemCode, @Param("customerMobileNo") String customerMobileNo,
			@Param("businessDate") Date businessDate, @Param("configType") String configType);

	/**
	 * This query should be used for tepType: INTER_BRAND_TEP
	 */
	ExchangeConfigMasterDao findByItemCodeAndConfigType(String itemCode, String configType);

	/**
	 * This query should be used for tepType: CUT_PIECE_TEP
	 */
	ExchangeConfigMasterDao findByConfigType(String configType);

	ExchangeConfigMasterDao findByConfigTypeAndKarat(String configType, BigDecimal karat);
}
