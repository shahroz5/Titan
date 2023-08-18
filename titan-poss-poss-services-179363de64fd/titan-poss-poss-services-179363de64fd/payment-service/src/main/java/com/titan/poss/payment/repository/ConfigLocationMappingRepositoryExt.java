package com.titan.poss.payment.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.payment.dao.ConfigDaoExt;
import com.titan.poss.payment.dao.ConfigLocationMappingDaoExt;

@Repository
public interface ConfigLocationMappingRepositoryExt extends JpaRepository<ConfigLocationMappingDaoExt, String> {

	/**
	 * This method will return the list of location codes based on configId.
	 * 
	 * @param configId
	 * @return List<LocationCodeDto>
	 */
	List<ConfigLocationMappingDaoExt> findByConfigId(ConfigDaoExt configId);

	/**
     * @param configId
     * @param string
     * @param locationCodes
     * @return List<ConfigLocationMappingDaoExt>
     */
    @Query("SELECT clm FROM ConfigLocationMappingDaoExt clm where clm.configType = :configType AND (:configId IS NULL OR clm.configId.configId !=:configId)"
            + " AND (nullif(CHOOSE(1,:includeLocations),'') IS NULL OR clm.locationCode IN (:includeLocations))")
    List<ConfigLocationMappingDaoExt> findOtherConfigMappedLocationCode(@Param("configType") String configType,
            @Param("configId") String configId, @Param("includeLocations") Set<String> locationCodes);

	

	/**
	 * @param configType
	 * @param removeLocations
	 * @return
	 */
	@Query("SELECT clm FROM ConfigLocationMappingDaoExt clm where clm.configType = :configType AND clm.locationCode IN (:removeLocations)")
	List<ConfigLocationMappingDaoExt> findByConfigTypeAndLocationCodeIn(@Param("configType") String configType,  @Param("removeLocations") Set<String> removeLocations);

	/**
	 * @param configDao
	 * @param configType
	 * @return
	 */
	List<ConfigLocationMappingDaoExt> findByConfigIdAndConfigType(ConfigDaoExt configDao, String configType);
}
