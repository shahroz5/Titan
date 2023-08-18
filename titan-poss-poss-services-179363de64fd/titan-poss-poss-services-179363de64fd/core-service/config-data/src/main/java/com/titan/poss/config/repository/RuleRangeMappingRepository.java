/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleRangeDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RuleRangeMappingRepository extends JpaRepository<RuleRangeDao, String> {

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param id
	 * @param metalType
	 * @return RuleRangeDao
	 */
	@Query("SELECT cp From RuleRangeDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.rangeId.id = :rangeId AND (cp.metalType =:metalType OR :metalType IS NULL)")
	RuleRangeDao findRuleRangeMapping(@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("rangeId") String rangeId, @Param("metalType") String metalType);

}
