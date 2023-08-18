/**
 * Copyright 2019. Titan Company Limited All rights reserved.
 */

package com.titan.poss.payment.repository;

import static com.titan.poss.payment.constants.PaymentConstants.CONFIG_LOCATION_REPOSITORY;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigLocationMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository(CONFIG_LOCATION_REPOSITORY)
public interface ConfigLocationMappingRepository extends JpaRepository<ConfigLocationMappingDao, String> {

	/**
	 * This method will return the list of location codes based on configId.
	 * 
	 * @param configId
	 * @return List<LocationCodeDto>
	 */
	List<ConfigLocationMappingDao> findByConfigId(ConfigDao configId);

	/**
	 * This method will return the list of location codes based on configId and
	 * locations.
	 * 
	 * @param configId
	 * @param addLocations
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT clm FROM ConfigLocationMappingDao clm where clm.configId = :configId AND clm.locationCode IN (:addLocations)")
	List<ConfigLocationMappingDao> findByConfigIdAndLocationCode(@Param("configId") ConfigDao configId,
			@Param("addLocations") Set<String> addLocations);

	@Query("SELECT clm FROM ConfigLocationMappingDao clm where clm.locationCode IN (:addLocations)")
	List<ConfigLocationMappingDao> findOtherConfigMappedLocationCode(@Param("addLocations") Set<String> addLocations);

	/**
	 * This method will return the Config Id based on location codes based.
	 * 
	 * @param locationCode
	 * @return ConfigLocationMappingDao
	 */
	ConfigLocationMappingDao findByLocationCode(String locationCode);

	/**
	 * @param configId
	 * @param locationCodes
	 * @return
	 */
	@Query("SELECT clm FROM ConfigLocationMappingDao clm where clm.configId = :configId AND clm.locationCode IN (:addLocations)")
	List<ConfigLocationMappingDao> findOtherConfigMappedLocationCode(@Param("configId") ConfigDao configId,
			@Param("addLocations") Set<String> locationCodes);
	
	/**
	 * This method will return the Config Id based on location codes based.
	 * 
	 * @param locationCode
	 * @return ConfigLocationMappingDao
	 */
	ConfigLocationMappingDao findByLocationCodeAndConfigType(String locationCode, String configType);

	/**
	 * @param configId
	 * @param locationCode
	 * @param configType
	 * @return ConfigLocationMappingDao
	 */
	ConfigLocationMappingDao findByConfigIdConfigIdAndLocationCodeAndConfigType(String configId, String locationCode,
			String configType);

}
