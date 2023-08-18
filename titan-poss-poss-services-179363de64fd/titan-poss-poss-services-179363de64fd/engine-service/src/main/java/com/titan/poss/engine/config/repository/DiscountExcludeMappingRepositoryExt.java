/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.repository.DiscountExcludeMappingRepository;
import com.titan.poss.core.discount.dto.DiscountExcludeComplexityPercentDto;
import com.titan.poss.core.discount.dto.DiscountExcludeMcPerGramDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineDiscountExcludeMappingRepository")
public interface DiscountExcludeMappingRepositoryExt extends DiscountExcludeMappingRepository {

	@Query("Select dem from DiscountExcludeMappingDao dem where dem.discount.id = :discountId AND dem.isActive =1 AND ((dem.itemCode = :itemCode AND dem.isExcluded=1)"
			+ " OR (dem.themeCode = :themeCode) OR (:complexityPercent is not NULL AND (:complexityPercent >= dem.fromValue and"
			+ " :complexityPercent <= dem.toValue) and dem.excludeType = 'COMPLEXITY_PERCENT') OR (:makingChargePerGram is not NULL and (:makingChargePerGram >= dem.fromValue and "
			+ ":makingChargePerGram <= dem.toValue) and dem.excludeType = 'MC_PER_GRAM'))")
	List<DiscountExcludeMappingDao> validateItemCode(@Param("discountId") String discountId,
			@Param("itemCode") String itemCode, @Param("themeCode") String themeCode,
			@Param("complexityPercent") BigDecimal complexityPercent,
			@Param("makingChargePerGram") BigDecimal makingChargePerGram);

	@Query("Select dem.itemCode from DiscountExcludeMappingDao dem where dem.discount.id = :discountId AND dem.isActive = 1 "
			+ "AND (dem.itemCode IN (:itemcodes) AND dem.isExcluded=1)" + " OR dem.themeCode IN (:themecodeList) ")
	List<String> validateItemsAndThemeCode(@Param("discountId") String discountId,
			@Param("itemcodes") Set<String> itemcodes, @Param("themecodeList") List<String> themecodeList);

	@Query("Select dem from DiscountExcludeMappingDao dem where dem.isActive = 1 AND dem.discount.id IN (:discountIds ) AND ((dem.itemCode = :itemCode AND dem.isExcluded=1"
			+ " OR dem.themeCode = :themeCode) OR (:complexityPercent is not NULL AND (:complexityPercent >= dem.fromValue and "
			+ " :complexityPercent <= dem.toValue) and dem.excludeType = 'COMPLEXITY_PERCENT') OR (:makingChargePerGram is not NULL and (:makingChargePerGram >= dem.fromValue and "
			+ " :makingChargePerGram <= dem.toValue) and dem.excludeType = 'MC_PER_GRAM'))")
	List<DiscountExcludeMappingDao> validateItemCodeForDiscountList(@Param("discountIds") List<String> discountIds,
			@Param("itemCode") String itemCode, @Param("themeCode") String themeCode,
			@Param("complexityPercent") BigDecimal complexityPercent,
			@Param("makingChargePerGram") BigDecimal makingChargePerGram);

	@Query("Select dem.itemCode from DiscountExcludeMappingDao dem where dem.discount.id = :discountId "
			+ "AND dem.excludeType='ITEM_CODE' and dem.isActive='1' ")
	List<String> getExcludedItemCodes(@Param("discountId") String discountId);

	@Query("Select dem.themeCode from DiscountExcludeMappingDao dem where dem.discount.id = :discountId "
			+ "AND dem.excludeType='THEME_CODE' and dem.isActive='1' ")
	List<String> getExcludedThemeCodes(@Param("discountId") String discountId);

	@Query("Select new com.titan.poss.core.discount.dto.DiscountExcludeComplexityPercentDto(dem.fromValue, dem.toValue) from DiscountExcludeMappingDao dem where dem.discount.id = :discountId "
			+ "AND dem.excludeType='COMPLEXITY_PERCENT' and dem.isActive='1' ")
	List<DiscountExcludeComplexityPercentDto> getExcludedComplexityPercent(@Param("discountId") String discountId);

	@Query("Select new com.titan.poss.core.discount.dto.DiscountExcludeMcPerGramDto(dem.fromValue, dem.toValue) from DiscountExcludeMappingDao dem where dem.discount.id = :discountId "
			+ "AND dem.excludeType='MC_PER_GRAM' and dem.isActive='1' ")
	List<DiscountExcludeMcPerGramDto> getExcludedMcPerGram(@Param("discountId") String discountId);

	// @formatter:off
	@Query("SELECT dem.schemeCode "
			+ " FROM DiscountExcludeMappingDao dem "
			+ " WHERE dem.discount.id = :discountId "
			+ " AND dem.excludeType='SCHEME_CODE' "
			+ " AND dem.isActive='1' ")
	// @formatter:on
	List<String> getMappedSchemeCodes(@Param("discountId") String discountId);
}
