/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.RivaahProductMappingDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface RivaahProductMappingRepositoryExt extends JpaRepository<RivaahProductMappingDaoExt, String> {

	/**
	 * @param productId
	 * @return
	 */
	@Query("select rp from RivaahProductMappingDaoExt rp where rp.ruleProductDao.id = :productId")
	List<RivaahProductMappingDaoExt> findAllByProductMap(@Param("productId") String productId);

	/**
	 * @param productGroupCode
	 * @return
	 */
	List<RivaahProductMappingDaoExt> findByProductGroupCode(String productGroupCode);

	/**
	 * @param ruleProductIds
	 */
	@Modifying
	@Query("DELETE from RivaahProductMappingDaoExt c WHERE c.ruleProductDao.id IN (:ruleDetailList)")
	void deleteRivaahProductDetails(@Param("ruleDetailList") List<String> ruleProductIds);

}
