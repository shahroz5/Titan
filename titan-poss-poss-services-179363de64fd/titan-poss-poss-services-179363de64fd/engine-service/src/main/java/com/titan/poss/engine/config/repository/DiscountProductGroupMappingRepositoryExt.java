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

import com.titan.poss.config.dao.DiscountProductGroupMappingDao;
import com.titan.poss.config.repository.DiscountProductGroupMappingRepository;
import com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineDiscountProductGroupMappingRepositoryExt")
public interface DiscountProductGroupMappingRepositoryExt extends DiscountProductGroupMappingRepository {

	@Query("Select dpgm.productGroupCode from DiscountProductGroupMappingDao dpgm, DiscountLocationMappingDao dlm where "
			+ " dpgm.discount.id = dlm.discount.id AND dpgm.discount.id = :discountId AND dpgm.isActive = 1 AND dlm.isActive = 1 AND dlm.locationCode = :locationCode "
			+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate AND dpgm.productGroupCode IN (:productGroupList) ")
	List<String> getValidProductGroups(@Param("discountId") String discountId, @Param("businessDate") Date businessDate,
			@Param("locationCode") String locationCode, @Param("productGroupList") Set<String> productGroupList);

	@Query("Select dpgm from DiscountProductGroupMappingDao dpgm where dpgm.discount.id = :discountId AND dpgm.isActive = 1 AND dpgm.productGroupCode IN (:productGroupList) ")
	List<DiscountProductGroupMappingDao> validateProductGroupList(@Param("discountId") String discountId,
			@Param("productGroupList") Set<String> productGroupList);

	@Query("Select new com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto(dpgm.productGroupCode, dpgm.karatType, dpgm.productType) from DiscountProductGroupMappingDao dpgm where dpgm.discount.id = :discountId AND dpgm.isActive = 1 "
			+ " AND (dpgm.karatType IS NULL OR dpgm.karatType != 'TEP')")
	List<DiscountProductGroupMappingDto> getProductGroupMappingList(@Param("discountId") String discountId);

	// @formatter:off
	@Query("SELECT new com.titan.poss.core.discount.dto.DiscountProductGroupMappingDto(dpgm.productGroupCode, dpgm.karatType, dpgm.productType) "
			+ " FROM DiscountProductGroupMappingDao dpgm "
			+ " WHERE dpgm.discount.id = :discountId "
			+ " AND dpgm.productGroupCode = :productGroupCode "
			+ " AND dpgm.isActive = 1")
	// @formatter:on
	List<DiscountProductGroupMappingDto> getProductTypeListForDiscountIdAndProductGroup(
			@Param("discountId") String discountId, @Param("productGroupCode") String productGroupCode);

}
