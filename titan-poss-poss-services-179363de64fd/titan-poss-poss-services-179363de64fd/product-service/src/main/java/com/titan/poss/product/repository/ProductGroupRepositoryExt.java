/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.product.dao.ProductGroupDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("ProductProductGroupRepositoryExt")
public interface ProductGroupRepositoryExt extends ProductGroupRepository {

	/**
	 * @param isActive
	 * @param productGroupCode
	 * @param pricingType
	 * @param isConversionAllowed
	 * @param pageable
	 * @return
	 */
	@Query("select dm from ProductGroupDao dm where (dm.isActive = :isActive OR :isActive IS NULL) AND "
			+ " (dm.productGroupCode = :productGroupCode OR :productGroupCode IS NULL ) AND "
			+ " (dm.pricingType = :pricingType OR :pricingType IS NULL) AND "
			+ " ((json_value(config_details,'$.data.isConversionEnabled')= : isConversionEnabled ) OR :isConversionEnabled IS NULL) ")
	Page<ProductGroupDao> findAllProductGroups(@Param("isActive") Boolean isActive,
			@Param("productGroupCode") String productGroupCode, @Param("pricingType") String pricingType,
			@Param("isConversionEnabled") Boolean isConversionEnabled, Pageable pageable);
	
}
