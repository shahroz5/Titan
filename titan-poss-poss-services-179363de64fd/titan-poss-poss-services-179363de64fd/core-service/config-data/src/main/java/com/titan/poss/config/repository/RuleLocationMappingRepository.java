/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleLocationMappingDao;
import com.titan.poss.config.dao.RuleMasterDao;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleLocationMappingRepository extends JpaRepository<RuleLocationMappingDao, String> {
	/**
	 * This method will return the list of location codes based on ruleType and
	 * ruleId.
	 * 
	 * @param ruleId
	 * @return List<RuleLocationMappingDao>
	 */
	@Query("SELECT cm From RuleLocationMappingDao cm where cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.ruleMasterDao.ruleIdDao.ruleId=:ruleId")
	public List<RuleLocationMappingDao> findByRuleTypeAndRuleId(@Param("ruleType") String rule,
			@Param("ruleId") Integer ruleId);

	/**
	 * This method will delete the RuleLocationMapping.
	 * 
	 * @param ruleId
	 * @param locations
	 */
	@Modifying
	@Query("DELETE from RuleLocationMappingDao cm where cm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cm.locationCode IN (:locationList)")
	void deleteRuleLocationMapping(@Param("ruleType") String ruleType, @Param("locationList") Set<String> locationList);

	/**
	 * This method will return the list of location codes based on ruleId and
	 * locations.
	 * 
	 * @param ruleId
	 * @param addLocations
	 * @return List<LocationCodeDto>
	 */
	@Query("SELECT clm FROM RuleLocationMappingDao clm where clm.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND clm.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND clm.locationCode IN (:addLocations)")
	List<RuleLocationMappingDao> findOtherRuleMappedLocationCode(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, @Param("addLocations") Set<String> addLocations);

	/**
	 * @param ruleMasterDao
	 * @param locationCode
	 * @return RuleLocationMappingDao
	 */
	public RuleLocationMappingDao findOneByRuleMasterDaoAndLocationCode(RuleMasterDao ruleMasterDao,
			String locationCode);

	/**
	 * @param id
	 * @return RuleLocationMappingDao
	 */
	public RuleLocationMappingDao findOneById(String id);

	/**
	 * @param ruleType
	 * @param locationCode
	 * @return RuleLocationMappingDao
	 */
	public RuleLocationMappingDao findOneByRuleMasterDaoRuleIdDaoRuleTypeAndLocationCode(String ruleType,
			String locationCode);

}
