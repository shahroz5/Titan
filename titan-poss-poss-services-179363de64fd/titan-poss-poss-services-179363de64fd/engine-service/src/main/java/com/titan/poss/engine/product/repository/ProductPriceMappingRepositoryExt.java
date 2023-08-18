/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.product.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.core.dto.MakingChargeMarginDto;
import com.titan.poss.product.dao.ProductPriceMappingDao;
import com.titan.poss.product.repository.ProductPriceMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ProductPriceMappingRepositoryExt extends ProductPriceMappingRepository {

	/**
	 * @param sumOfVandF1
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return
	 */
	@Query("SELECT r from ProductPriceMappingDao r Where (r.fromPrice<=:price AND :price<=r.toPrice) and (r.fromBand<=:numberOfStones AND :numberOfStones<=r.toBand) and r.productGroup.productGroupCode=:productGroupCode")
	List<ProductPriceMappingDao> findByCombination(@Param("price") BigDecimal price,
			@Param("productGroupCode") String productGroupCode, @Param("numberOfStones") Integer numberOfStones);

	/**
	 * This method will return all the marign details based on input.
	 * 
	 * @param productGroupCode
	 * @param numberOfStones
	 * @return List<MakingChargeMarginDto>
	 */
	// @formatter:off
	@Query("SELECT new com.titan.poss.core.dto.MakingChargeMarginDto(pm.fromPrice, pm.toPrice, pm.margin) \r\n"
			+ " FROM ProductPriceMappingDao pm \r\n"
			+ " WHERE pm.productGroup.productGroupCode = :productGroupCode \r\n"
			+ " AND (pm.fromBand <= :numberOfStones AND pm.toBand >= :numberOfStones)")
	// @formatter:on
	List<MakingChargeMarginDto> fingByProductGroupAndNoOfStones(@Param("productGroupCode") String productGroupCode,
			@Param("numberOfStones") Integer numberOfStones);

}
