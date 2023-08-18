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

import com.titan.poss.config.dao.RuleMarketMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleMarketMappingRepository extends JpaRepository<RuleMarketMappingDao, String> {

	/**
	 * @param ruleType
	 * @param ruleId
	 * @return
	 */
	@Query("SELECT c FROM RuleMarketMappingDao c WHERE c.ruleMasterDao.ruleIdDao.ruleType =:ruleType AND c.ruleMasterDao.ruleIdDao.ruleId =:ruleId")
	List<RuleMarketMappingDao> findByRuleTypeAndRuleId(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param marketCode
	 * @return RuleMarketMappingDao
	 */
	@Query("SELECT cp From RuleMarketMappingDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.marketCode=:marketCode")
	RuleMarketMappingDao findMappedProduct(@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("marketCode") String marketCode);

}
