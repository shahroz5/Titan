/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleRangeDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleRangeMappingRepositoryExt extends JpaRepository<RuleRangeDaoExt, String> {

	/**
	 * @param ruleId
	 * @param ruleType
	 * @param pageable 
	 * @return
	 */
	@Query("select c from RuleRangeDaoExt c where c.ruleMasterDao.ruleIdDao.ruleId = :ruleId and c.ruleMasterDao.ruleIdDao.ruleType = :ruleType ")
	Page<RuleRangeDaoExt> findAllByRuleIdAndRuleType(@Param("ruleId") Integer ruleId,
			@Param("ruleType") String ruleType, Pageable pageable);

}
