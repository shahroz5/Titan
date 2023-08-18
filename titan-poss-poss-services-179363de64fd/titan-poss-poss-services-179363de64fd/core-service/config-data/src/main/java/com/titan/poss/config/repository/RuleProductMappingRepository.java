/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleProductDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RuleProductMappingRepository extends JpaRepository<RuleProductDao, String> {

	/**
	 * This method will delete the Payment Configuration Details.
	 * 
	 * @param configDetailList
	 */
	@Modifying
	@Query("DELETE from RuleProductDao c WHERE c.id IN (:ruleDetailList)")
	void getRuleProductDetails(@Param("ruleDetailList") List<String> ruleDetailList);

	/**
	 * This method will return the list of ProductGroup and ProductCategory codes
	 * based on ruleType and ruleId.
	 * 
	 * @param configId
	 * @return List<ConfigurationLocationMappingDao>
	 */
	@Query("SELECT cp From RuleProductDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId")
	public List<RuleProductDao> findByRuleTypeAndRuleId(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId);

	@Query("SELECT cp From RuleProductDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.productGroupCode=:productGroupCode AND (cp.productCategoryCode =:productCategoryCode OR :productCategoryCode IS NULL)")
	RuleProductDao findMappedProduct(@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productGroupCode
	 * @param productCategoryCode
	 * @param rangeId
	 * @return RuleProductDao
	 */
	@Query("SELECT cp From RuleProductDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.productGroupCode=:productGroupCode AND (cp.productCategoryCode =:productCategoryCode OR :productCategoryCode IS NULL) AND cp.rangeId.id = :rangeId")
	RuleProductDao findRuleProductMapping(@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("rangeId") String rangeId);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productCategoryCode
	 */
	@Query("SELECT cp From RuleProductDao cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.productCategoryCode =:productCategoryCode")
	List<RuleProductDao> findByRuleTypeAndRuleIdAndProductCategoryCode(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, @Param("productCategoryCode") String productCategoryCode);

}
