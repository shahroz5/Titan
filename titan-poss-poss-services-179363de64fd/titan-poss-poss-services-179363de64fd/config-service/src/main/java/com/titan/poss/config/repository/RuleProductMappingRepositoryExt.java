/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RuleProductDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository
public interface RuleProductMappingRepositoryExt extends JpaRepository<RuleProductDaoExt, String> {

	/**
	 * This method will delete the Payment Configuration Details.
	 * 
	 * @param configDetailList
	 */
	@Modifying
	@Query("SELECT c from RuleProductDaoExt c WHERE c.id IN (:ruleDetailList)")
	List<RuleProductDaoExt> getRuleProductDetails(@Param("ruleDetailList") List<String> ruleDetailList);

	/**
	 * This method will return the list of ProductGroup and ProductCategory codes
	 * based on ruleType and ruleId.
	 * 
	 * @param configId
	 * @return List<ConfigurationLocationMappingDao>
	 */
	@Query("SELECT cp From RuleProductDaoExt cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId")
	public List<RuleProductDaoExt> findByRuleTypeAndRuleId(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId);

	/**
	 * This method will return the list of ProductGroup and ProductCategory codes
	 * based on ruleType and ruleId.
	 * 
	 * @param configId
	 * @return List<ConfigurationLocationMappingDao>
	 */
	@Query("SELECT cp From RuleProductDaoExt cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId")
	public Page<RuleProductDaoExt> findByRuleTypeAndRuleIdPagination(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, Pageable pageable);

	@Query("SELECT cp From RuleProductDaoExt cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.productGroupCode=:productGroupCode AND (:productCategoryCode IS NULL OR cp.productCategoryCode = :productCategoryCode) AND"
			+ "(:rangeId IS NULL OR cp.rangeId.id = :rangeId)")
	RuleProductDaoExt findMappedProduct(@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("rangeId") String rangeId);

	/**
	 * @param ruleProductList
	 */
	@Modifying
	@Query("DELETE from RuleProductDaoExt c WHERE c.id IN (:ruleDetailList)")
	void deleteRuleProductDetails(@Param("ruleDetailList") List<String> ruleDetailList);

	/**
	 * @param keySet
	 */
	List<RuleProductDaoExt> findByIdIn(@Param("productCategoryCode") Set<String> idList);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productGroupCode
	 * @param productCategoryCode
	 * @param pageable
	 * @return
	 */
	@Query("SELECT cp From RuleProductDaoExt cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND (:productGroupCode IS NULL OR cp.productGroupCode = :productGroupCode) AND (:productCategoryCode IS NULL OR cp.productCategoryCode = :productCategoryCode)")
	Page<RuleProductDaoExt> findByRuleTypeAndRuleIdAndProductGroupCodeAndProductCategoryCodePagination(
			@Param("ruleType") String ruleType, @Param("ruleId") Integer ruleId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("pageable") Pageable pageable);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productGroupCode
	 * @param productCategoryCode
	 * @return
	 */
	@Query("SELECT cp From RuleProductDaoExt cp where cp.ruleMasterDao.ruleIdDao.ruleType = :ruleType AND cp.ruleMasterDao.ruleIdDao.ruleId=:ruleId AND cp.productCategoryCode = :productCategoryCode")
	List<RuleProductDaoExt> findByRuleTypeAndRuleIdAndProductCategoryCode(@Param("ruleType") String ruleType,
			@Param("ruleId") Integer ruleId, @Param("productCategoryCode") String productCategoryCode);

	/**
	 * @param productMappingIds
	 * @param pageable
	 * @return
	 */
	@Query("SELECT c from RuleProductDaoExt c WHERE c.id IN (:productMappingIds)")
	Page<RuleProductDaoExt> getRivaahRuleDetails(@Param("productMappingIds") Set<String> productMappingIds,
			Pageable pageable);

	@Query(nativeQuery = true, value = "SELECT TOP 1 rpm.product_group_code FROM rule_product_mapping rpm where rpm.rule_id = 1 and rpm.rule_type = 'RIVAAH_CARD_ELIGIBILITY' order by rpm.created_date desc")
	Object[] getLatestProductCount();
}
