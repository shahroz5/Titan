/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleLocationMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleLocationMappingRepositoryExt extends JpaRepository<RuleLocationMappingDaoExt, String> {
	/**
	 * This method will return the list of location codes based on ruleType and
	 * ruleId.
	 * 
	 * @param ruleId
	 * @return List<RuleLocationMappingDao>
	 */
	@Query("SELECT cm From RuleLocationMappingDaoExt cm where cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.ruleMasterDao.ruleIdDao.ruleId=:ruleId")
	public List<RuleLocationMappingDaoExt> findByRuleTypeAndRuleId(@Param("ruleType") String rule,
			@Param("ruleId") Integer ruleId);

	/**
	 * This method will return the list of location codes based on ruleId and
	 * locations.
	 * 
	 * @param ruleId
	 * @param addLocations
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT cm FROM RuleLocationMappingDaoExt cm where cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.locationCode IN (:addLocations)")
	List<RuleLocationMappingDaoExt> findByRuleTypeAndLocationCode(@Param("ruleType") String ruleType,
			@Param("addLocations") Set<String> addLocations);

	/**
	 * This method will delete the RuleLocationMapping.
	 * 
	 * @param ruleId
	 * @param locations
	 */
	@Modifying
	@Query("DELETE from RuleLocationMappingDaoExt cm where cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.locationCode IN (:locationList)")
	void deleteRuleLocationMapping(@Param("ruleType") String ruleType, @Param("locationList") Set<String> locationList);

	/**
	 * This method will return the list of location codes based on ruleId and
	 * locations.
	 * 
	 * @param includeLocations
	 * @param ruleId
	 * 
	 * @param ruleId
	 * @param addLocations
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT clm FROM RuleLocationMappingDaoExt clm where clm.ruleMasterDao.ruleIdDao.ruleType = :ruleType"
			+ " AND (:ruleId IS NULL OR clm.ruleMasterDao.ruleIdDao.ruleId !=:ruleId)"
			+ " AND (nullif(CHOOSE(1,:includeLocations),'') IS NULL OR clm.locationCode IN (:includeLocations)) \r\n")
	List<RuleLocationMappingDaoExt> findOtherRuleMappedLocationCode(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, @Param("includeLocations") Set<String> includeLocations);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param offerStartDate
	 * @param offerEndDate
	 * @param locationCodes
	 * @param pageable
	 * @return
	 */
	@Query("SELECT cm FROM RuleLocationMappingDaoExt cm WHERE cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND "
			+ "(nullif(CHOOSE(1,:locationCodes),'') IS NULL OR cm.locationCode in (:locationCodes)) "
			+ "AND ((:offerStartDate IS NULL OR :offerStartDate = cm.offerStartDate) and (:offerEndDate IS NULL OR :offerEndDate = cm.offerEndDate))")
	public Page<RuleLocationMappingDaoExt> findRivaahLocationDetails(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, @Param("offerStartDate") Date offerStartDate,
			@Param("offerEndDate") Date offerEndDate, @Param("locationCodes") List<String> locationCodes,
			Pageable pageable);

}
