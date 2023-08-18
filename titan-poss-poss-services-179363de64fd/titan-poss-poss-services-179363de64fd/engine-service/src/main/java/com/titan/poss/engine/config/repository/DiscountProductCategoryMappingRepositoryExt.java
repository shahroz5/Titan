/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.repository.DiscountProductCategoryMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineDiscountProductCategoryMappingRepository")
public interface DiscountProductCategoryMappingRepositoryExt extends DiscountProductCategoryMappingRepository {



	@Query("Select dpgm.productCategoryCode from DiscountProductCategoryMappingDao dpgm, DiscountLocationMappingDao dlm where "
			+ " dpgm.discount.id = dlm.discount.id AND dpgm.discount.id = :discountId AND dlm.locationCode = :locationCode "
			+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate AND dpgm.productCategoryCode IN (:productCategoryList) ")
	List<String> getValidProductCategories(@Param("discountId") String discountId,
			@Param("businessDate") Date businessDate, @Param("locationCode") String locationCode,
			@Param("productCategoryList") Set<String> productCategoryList);

	@Query("Select dpcm.productCategoryCode from DiscountProductCategoryMappingDao dpcm where dpcm.discount.id = :discountId AND dpcm.isActive = 1")
	List<String> getProductCategoryList(@Param("discountId") String discountId);
}
