/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.product.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.core.dto.ProductGroupDigiGoldResponseDto;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.repository.ProductGroupRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface ProductGroupRepositoryExt extends ProductGroupRepository {

	/**
	 * This method will return the ProductGroupDao details based on the
	 * productGroupCode
	 * 
	 * @param productGroupCode
	 * @return ProductGroupDao
	 */

	@Override
	public ProductGroupDao findOneByProductGroupCode(String productGroupCode);

	/**
	 * This query will filter for all plain_studded(P,S,M) and
	 * plain_studded_tep,plain_studded_grn,plain_studded_grf
	 * 
	 */
	// @formatter:off
	@Query("select p from ProductGroupDao p where p.isActive = :isActive AND "
			+ "((:transactionType is null AND (p.plainStudded = :plainStudded OR :plainStudded IS NULL OR ('M' = :plainStudded AND p.isMia = 1)))"
			+ " OR "
			+ "(:transactionType is not null AND ('TEP' = :transactionType AND (p.plainStuddedTep = :plainStudded OR :plainStudded IS NULL)) "
			+ " OR ('GRN'= :transactionType AND (p.plainStuddedGrf = :plainStudded OR :plainStudded IS NULL)) "
			+ "OR ('GRF'= :transactionType AND (p.plainStuddedGrn = :plainStudded OR :plainStudded IS NULL))))")
	// @formatter:on
	public Page<ProductGroupDao> getProductGroupCode(@Param("isActive") Boolean isActive,
			@Param("plainStudded") String plainStudded, @Param("transactionType") String transactionType,
			Pageable pageable);

	@Query("SELECT new com.titan.poss.core.dto.ProductGroupDigiGoldResponseDto(pg.productGroupCode, pg.pricingDetails) FROM ProductGroupDao pg WHERE pg.productGroupCode IN (:productGroupList)")
	public List<ProductGroupDigiGoldResponseDto> getProductGroupDetails(
			@Param("productGroupList") List<String> productGroupList);
}
