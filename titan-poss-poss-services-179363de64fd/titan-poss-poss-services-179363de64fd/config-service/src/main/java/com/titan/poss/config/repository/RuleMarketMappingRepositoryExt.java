/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleMarketMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleMarketMappingRepositoryExt extends JpaRepository<RuleMarketMappingDaoExt, String> {

	/**
	 * @param ruleType
	 * @param ruleId
	 * @return
	 */
	@Query("SELECT c FROM RuleMarketMappingDaoExt c WHERE c.ruleMasterDao.ruleIdDao.ruleType =:ruleType AND c.ruleMasterDao.ruleIdDao.ruleId =:ruleId")
	List<RuleMarketMappingDaoExt> findByRuleTypeAndRuleId(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId);

}
