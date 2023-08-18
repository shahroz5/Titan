/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMasterDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RuleMasterRepository extends JpaRepository<RuleMasterDao, RuleIdDao>, RuleMasterRepositoryCustom {

	/*
	 * @Query("SELECT cm From RuleMasterDao cm where cm.ruleIdDao.ruleType = :ruleType"
	 * ) Page<RuleMasterDao> findByRuleIdDaoRuleType(@Param("ruleType") String
	 * ruleType, Pageable pageable);
	 */

	List<RuleMasterDao> findByRuleIdDaoRuleType(String ruleType);

	RuleMasterDao findByRuleIdDaoRuleTypeAndRuleIdDaoRuleId(String ruleType, Integer ruleId);

	@Query ("SELECT r From RuleMasterDao r Where r.ruleIdDao.ruleType = :ruleType AND (:configName IS NULL OR r.description LIKE '%'+:configName +'%')")
	Page<RuleMasterDao> getList(@Param("ruleType")String ruleType, @Param("configName")String configName, Pageable pageable);

	@Query ("SELECT r From RuleMasterDao r Where r.ruleIdDao.ruleType = :ruleType AND (:configName IS NULL OR r.description = :configName)")
	Page<RuleMasterDao> getRule(@Param("ruleType")String ruleType, @Param("configName")String configName, Pageable pageable);
	
	/**
	 * @param description
	 * @param ruleType
	 * @return
	 */
	RuleMasterDao getOneByDescriptionAndRuleIdDaoRuleType(String description, String ruleType);

	List<RuleMasterDao> findByRuleIdDaoRuleTypeAndDescription(String ruleType, String description);

	@Query ("SELECT r From RuleMasterDao r Where r.ruleIdDao.ruleType in(select r.ruleType from RuleMetadataDao r where r.ruleGroup = :ruleGroup) AND (:description IS NULL OR r.description LIKE '%'+:description +'%')")
	Page<RuleMasterDao> getRuleByRuleGroup(@Param("ruleGroup")String ruleGroup, @Param("description")String description, Pageable pageable);

	@Query ("SELECT r From RuleMasterDao r Where r.ruleIdDao.ruleType in(select r.ruleType from RuleMetadataDao r where r.ruleGroup = :ruleGroup) AND r.ruleIdDao.ruleType = :ruleType ")
	Page<RuleMasterDao> getRuleByRuleGroupAndRuleType(@Param("ruleGroup")String ruleGroup,@Param("ruleType") String ruleType, Pageable pageable);

}
