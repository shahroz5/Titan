/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.ExchangeConfigLocationMappingDaoExt;
import com.titan.poss.config.dao.ExchangeConfigMasterDaoExt;
import com.titan.poss.config.dto.response.TepExceptionErrorResponseDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface ExchangeConfigLocationMappingRepositoryExt
		extends JpaRepository<ExchangeConfigLocationMappingDaoExt, String> {

	List<ExchangeConfigLocationMappingDaoExt> findByExchangeConfig(ExchangeConfigMasterDaoExt exchangeConfigMasterDao);

	//@formatter:off
	@Query(value = "SELECT exchangeLocation from ExchangeConfigLocationMappingDaoExt exchangeLocation \r\n"
			+ " WHERE exchangeLocation.exchangeConfig != :exchangeConfig \r\n "
			+ " AND (nullif(CHOOSE(1,:includeLocations),'') IS NULL OR exchangeLocation.locationCode IN (:includeLocations)) \r\n"
			+ " AND exchangeLocation.configType = :configType")
	//@formatter:on
	List<ExchangeConfigLocationMappingDaoExt> findOtherLocationCode(
			@Param("exchangeConfig") ExchangeConfigMasterDaoExt exchangeConfig,
			@Param("includeLocations") Set<String> includeLocations, @Param("configType") String configType);

	List<ExchangeConfigLocationMappingDaoExt> findByLocationCodeInAndConfigType(Collection<String> locationList,
			String configType);

	//@formatter:off
	/**
	 * This query will be used to check start date,end date is overlapping between
	 * any date or not based on location codes,customer mobile nos,item code and config id. 
	 * If record is available then count should be more than 0 ..
	 * This query is used only for TEP_EXCEPTION config type.
	 */
	@Query(value="select new com.titan.poss.config.dto.response.TepExceptionErrorResponseDto(loc.locationCode,ecm.configId,ecm.description,ecm.configType,"
			+ " ecm.itemCode,ecm.startDate,ecm.endDate,cus.customerMobileNo) "
			+ " from ExchangeConfigMasterDaoExt ecm,ExchangeConfigCustomerMappingDaoExt cus, "
			+ " ExchangeConfigLocationMappingDaoExt loc where ecm.configId=cus.exchangeConfig.configId "
			+ " and loc.exchangeConfig.configId=ecm.configId and "
			+ " (:startDate between ecm.startDate and ecm.endDate or :endDate between ecm.startDate and ecm.endDate) "
			+ " and ecm.itemCode = :itemCode and loc.locationCode in (:addLocations) "
			+ " and cus.customerMobileNo in (select cu.customerMobileNo from "
			+ " ExchangeConfigCustomerMappingDaoExt cu where cu.exchangeConfig.configId = :configId)")

	//@formatter:on
	List<TepExceptionErrorResponseDto> checkLocationMappingExist(@Param("startDate") Date startDate,
			@Param("endDate") Date endDate, @Param("addLocations") Collection<String> addLocations,
			@Param("itemCode") String itemCode, @Param("configId") String configId);

	//@formatter:off
	@Query(value = "SELECT exchangeLocation from ExchangeConfigLocationMappingDaoExt exchangeLocation \r\n"
			+ " WHERE (nullif(CHOOSE(1,:includeLocations),'') IS NULL OR exchangeLocation.locationCode IN (:includeLocations)) \r\n"
			+ " AND exchangeLocation.configType = :configType")
	//@formatter:on
	List<ExchangeConfigLocationMappingDaoExt> getAllLocations(@Param("includeLocations") Set<String> includeLocations,
			@Param("configType") String configType);
}
