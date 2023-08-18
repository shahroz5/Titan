/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMasterDao;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RuleMasterRepository extends JpaRepository<RuleMasterDao, RuleIdDao>, RuleMasterRepositoryCustom {

	RuleMasterDao findByRuleIdDaoRuleType(String name);

}
