/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.config.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.repository.DiscountRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineDiscountRepository")
public interface DiscountRepositoryExt extends DiscountRepository, DiscountRepositoryCustom {

	DiscountDao findAllByDiscountType(String discountType);

	// @formatter:off
	@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
			+ "d.isActive = 1 AND dlm.isActive = 1 AND d.discountType = :discountType AND dlm.locationCode = :locationCode "
			+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate")
	// @formatter:off
	List<DiscountDao> getDiscountsBasedOnDiscountTypeAndLocationCode(@Param("discountType") String discountType,@Param("businessDate")  Date businessDate, @Param("locationCode") String locationCode);

	@Query("select dm from DiscountDao dm ,DiscountLocationMappingDao dlm  where"
			+ " dm.id = dlm.discount.id AND dm.isActive=1 AND dlm.isActive = 1 AND dm.id = :discountId "
			+ "AND :businessDate between dlm.previewStartDate AND dlm.previewEndDate AND "
			+ "dm.ulpCreateDate >= :encircleCreationDate and dlm.locationCode = :locationCode")
	DiscountDao getPreviewDetails(@Param("discountId") String discountId,@Param("encircleCreationDate") Date encircleCreationDate, @Param("businessDate") Date businessDate, @Param("locationCode") String locationCode);

	// @formatter:off
	@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
			+ "	discount_product_category_mapping dpcm "
			+ "	where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
			+ " dm.is_active =1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id = :discountId AND dlm.location_code = :locationCode AND :businessDate "
			+ " between dlm.offer_start_date AND dlm.offer_end_date AND dpm.product_group_code = :productGroupCode "
			+ " AND dpcm.product_category_code = :productCategoryCode AND (dpm.karat_type is null or dpm.karat_type != 'TEP') ")
	// @formatter:on
	DiscountDao validateRequestDetails(@Param("discountId") String discountId, @Param("businessDate") Date businessDate,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode);

	// @formatter:off
		@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
				+ "d.isActive = 1 AND dlm.isActive = 1 AND d.id IN (:discountIds) AND dlm.locationCode = :locationCode "
				+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate")
		// @formatter:off
	List<DiscountDao> validateDiscountIds(@Param("businessDate") Date businessDate,
			@Param("locationCode") String locationCode, @Param("discountIds") List<String> discountIds);

	// @formatter:off
	@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
				+ "d.isActive = 1 AND dlm.isActive = 1 AND d.id = :discountId AND dlm.locationCode = :locationCode "
				+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate")
	// @formatter:off	
	DiscountDao validateDiscountIdAndLocationCode(@Param("discountId") String discountId,@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate);

	
	@Query("Select d from DiscountDao d where d.discountType = :discountType AND d.isActive = 1")
	List<DiscountDao> getDiscountDetails(@Param("discountType") String discountType);



	
	// @formatter:off
		@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
				+ "	discount_product_category_mapping dpcm "
				+ "	where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
				+ " dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id IN (:discountIds) AND dlm.location_code = :locationCode AND :businessDate "
				+ " between dlm.offer_start_date AND dlm.offer_end_date AND dpm.product_group_code = :productGroupCode "
				+ " AND dpcm.product_category_code = :productCategoryCode ")
		// @formatter:on
	List<DiscountDao> validateOtherRequestDetailsForDiscountList(@Param("discountIds") List<String> discountIds,
			@Param("businessDate") Date businessDate, @Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode);

	// @formatter:off
		@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
				+ "d.isActive = 1 AND dlm.isActive = 1 AND d.discountType = :discountType AND dlm.locationCode = :locationCode ")
		// @formatter:off
	List<DiscountDao> getDiscountsBasedOnDiscountTypeAndLocationCode(@Param("discountType") String discountType, @Param("locationCode") String locationCode);

		//query on tep period 
		// @formatter:off
		@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm "
				+ "	where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND "
				+ " dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dm.discount_type = :discountType  AND dlm.location_code = :locationCode AND :tepDate "
				+ " between dlm.offer_start_date AND dlm.offer_end_date AND dpm.product_group_code = :productGroupCode "
				+ " AND dpm.karat_type = 'TEP' AND dpm.min_eligible_karat <= :karatage")
		// @formatter:on
	List<DiscountDao> getDiscountsBasedOnDiscountTypeAndLocationCodeAndProductGroupCode(
			@Param("discountType") String discountType, @Param("tepDate") Date tepDate,
			@Param("locationCode") String locationCode, @Param("productGroupCode") String productGroupCode,
			@Param("karatage") BigDecimal karatage);

	// @formatter:off
	@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
					+ "discount_product_category_mapping dpcm "
					+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
					+ "dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id =:discountId "
					+ "AND dlm.location_code = :locationCode AND :businessDate between dlm.offer_start_date AND dlm.offer_end_date "
					+ "AND dpm.product_group_code = :productGroupCode "
					+ "AND dpcm.product_category_code = :productCategoryCode")
	// @formatter:on
	DiscountDao validateItemRequestDetailsForDiscount(@Param("discountId") String discountId,
			@Param("businessDate") Date businessDate, @Param("locationCode") String locationCode,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode);

	/**
	 * @param discountId
	 * @param startOfDay
	 * @param productGroupCode
	 * @param productCategoryCode
	 * @param locationCode
	 * @param karatageTypeList
	 * @return
	 */
	// @formatter:off
		@Query(nativeQuery = true, value = "select dpm.karat_type from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
				+ "	discount_product_category_mapping dpcm "
				+ "	where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
				+ " dm.is_active =1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id = :discountId AND dlm.location_code = :locationCode AND :businessDate "
				+ " between dlm.offer_start_date AND dlm.offer_end_date AND dpm.product_group_code = :productGroupCode "
				+ " AND dpcm.product_category_code = :productCategoryCode AND (dpm.karat_type IN (:karatageTypeList) OR nullif(CHOOSE(1, :karatageTypeList), '') IS NULL)")
		// @formatter:on
	String getKaratType(@Param("discountId") String discountId, @Param("businessDate") Date businessDate,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode,
			@Param("karatageTypeList") List<String> karatageTypeList);

	// @formatter:off
	@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
			+ "discount_product_category_mapping dpcm "
			+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
			+ "dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id =:discountId AND dlm.location_code = :locationCode "
			+ "AND dpm.product_group_code = :productGroupCode "
			+ "AND dpcm.product_category_code = :productCategoryCode")
	// @formatter:on
	DiscountDao validateItemRequestDetailsListWithoutDate(@Param("discountId") String discountId,
			@Param("locationCode") String locationCode, @Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode);

	@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
			+ "d.isActive = 1 AND dlm.isActive = 1 AND d.discountType = :discountType AND dlm.locationCode = :locationCode ")
	// @formatter:off
	List<DiscountDao> getEmpowermentDiscounts(@Param("discountType") String discountType, @Param("locationCode") String locationCode);
	
	// @formatter:off
		@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
				+ "discount_product_category_mapping dpcm "
				+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
				+ " dm.is_active =1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id = :discountId AND dlm.location_code = :locationCode "
				+ " AND dpm.product_group_code = :productGroupCode "
				+ " AND dpcm.product_category_code = :productCategoryCode ")
		// @formatter:on
	DiscountDao validateEmpowermentOrRivaahGhsRequestDetails(@Param("discountId") String discountId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode);

	@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
			+ "discount_product_category_mapping dpcm "
			+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
			+ " dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id IN (:discountIds) AND dlm.location_code = :locationCode "
			+ " AND dpm.product_group_code = :productGroupCode "
			+ " AND dpcm.product_category_code = :productCategoryCode ")
	List<DiscountDao> validateOtherRequestDetailsForEmpowermentDiscountList(
			@Param("discountIds") List<String> discountIds, @Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode);

	@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
			+ "d.isActive = 1 AND dlm.isActive = 1 AND d.discountType = :discountType AND  d.id IN (:discountIds) AND dlm.locationCode = :locationCode ")
	List<DiscountDao> validateEmpowermentDiscountIds(@Param("locationCode") String locationCode,
			@Param("discountIds") List<String> discountIds, @Param("discountType") String discountType);

	@Query("Select d from DiscountDao d, DiscountExcludeMappingDao dem where d.id = dem.discount.id AND "
			+ "d.isActive = 1 AND dem.isActive = 1 AND d.id = :discountId AND (:complexityPercent is not null And (:complexityPercent >= dem.fromValue and"
			+ " :complexityPercent <= dem.toValue) OR (:makingChargePerGram is not null And (:makingChargePerGram >= dem.fromValue and "
			+ " :makingChargePerGram <=dem.toValue))) ")
	DiscountDao validateExcludeComplexityAndMakingCharge(@Param("discountId") String discountId,
			@Param("complexityPercent") BigDecimal complexityPercent,
			@Param("makingChargePerGram") BigDecimal makingChargePerGram);

	@Query("Select d from DiscountDao d, DiscountLocationMappingDao dlm where d.id = dlm.discount.id AND "
			+ "d.isActive = 1 AND dlm.isActive = 1 AND d.discountType = :discountType AND dlm.locationCode = :locationCode "
			+ " AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate AND json_value(d.configDetails,'$.data.minKarateEligibleForGEP')<=:karatage")
	// @formatter:off
		List<DiscountDao> getDiscountsBasedOnDiscountTypeAndLocationCodeAndKaratage(@Param("discountType") String discountType,@Param("businessDate")  Date businessDate, @Param("locationCode") String locationCode, @Param("karatage")BigDecimal karatage);

	// @formatter:off
	@Query("SELECT d FROM DiscountDao d, DiscountLocationMappingDao dlm, DiscountExcludeMappingDao dem "
			+ "	WHERE d.id = dlm.discount.id AND d.id = dem.discount.id "
			+ " AND d.discountType = :discountType "
			+ " AND dlm.locationCode = :locationCode "
			+ " AND (nullif(CHOOSE(1,:schemeCodes),'') IS NULL OR (dem.schemeCode IN (:schemeCodes)  AND dem.isActive = 1)) "
			+ " AND d.isActive = 1 AND dlm.isActive = 1 "
			+ " ORDER BY d.createdDate DESC")
	// @formatter:on
	List<DiscountDao> getRivaahGhsDiscounts(@Param("discountType") String discountType,
			@Param("locationCode") String locationCode, @Param("schemeCodes") List<String> schemeCodes);

	// @formatter:off
	@Query("SELECT d from DiscountDao d, DiscountLocationMappingDao dlm, DiscountExcludeMappingDao dem "
			+ " WHERE d.id = dlm.discount.id AND d.id = dem.discount.id "
			+"  AND d.id IN (:discountIds) "
			+ " AND dlm.locationCode = :locationCode "
			+ " AND dem.schemeCode IN (:schemeCodes) "
			+ " AND d.isActive = 1 AND dlm.isActive = 1 AND dem.isActive = 1 "
			+ " ORDER BY d.createdDate DESC")
	// @formatter:on
	List<DiscountDao> validateRivaahGhsDiscountIds(@Param("locationCode") String locationCode,
			@Param("discountIds") List<String> discountIds, @Param("schemeCodes") List<String> schemeCodes);

	// @formatter:off
	@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
					+ "discount_product_category_mapping dpcm "
					+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
					+ "dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id =:discountId "
					+ "AND dlm.location_code = :locationCode AND :businessDate "
					+ "between dlm.offer_start_date AND :offerEndDate AND dpm.product_group_code = :productGroupCode "
					+ "AND dpcm.product_category_code = :productCategoryCode")
	// @formatter:on
	DiscountDao validateItemRequestDetailsListwithGracePeriod(@Param("discountId") String discountId,
			@Param("businessDate") Date businessDate, @Param("locationCode") String locationCode,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("offerEndDate") Date offerEndDate);

	// @formatter:off
		@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
						+ "discount_product_category_mapping dpcm "
						+ "where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
						+ "dm.is_active = 1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 "
						+ "AND dm.id =:discountId AND dlm.location_code = :locationCode AND :businessDate "
						+ "between dlm.offer_start_date AND DATEADD(day, :offerGrace, dlm.offer_end_date) AND dpm.product_group_code = :productGroupCode "
						+ "AND dpcm.product_category_code = :productCategoryCode")
				// @formatter:on
	DiscountDao validateItemRequestDetailsListwithGraceAdditional(@Param("discountId") String discountId,
			@Param("businessDate") Date businessDate, @Param("locationCode") String locationCode,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("offerGrace") Integer offerGrace);

	// @formatter:off
		@Query(nativeQuery = true, value = "select dm.* from discount_master dm, discount_location_mapping dlm, discount_product_group_mapping dpm, "
				+ "	discount_product_category_mapping dpcm "
				+ "	where dm.id = dlm.discount_id AND dm.id = dpm.discount_id AND dm.id = dpcm.discount_id AND "
				+ " dm.is_active =1 AND dlm.is_active = 1 AND dpm.is_active = 1 AND dpcm.is_active = 1 AND dm.id = :discountId AND dlm.location_code = :locationCode AND :businessDate "
				+ " between dlm.offer_start_date AND :offerEndDate AND dpm.product_group_code = :productGroupCode "
				+ " AND dpcm.product_category_code = :productCategoryCode AND (dpm.karat_type is null or dpm.karat_type != 'TEP') ")
		// @formatter:on
	DiscountDao validateRequestDetailsWthGracePeriod(@Param("discountId") String discountId,
			@Param("businessDate") Date businessDate, @Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("locationCode") String locationCode,
			@Param("offerEndDate") Date offerEndDate);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT CAST(IIF(COUNT(dm.id) > 0 , 1, 0) AS bit)"
			+ " FROM discount_master dm, discount_product_group_mapping dpgm, "
			+ " discount_product_category_mapping dpcm, discount_exclude_mapping dem "
			+ " WHERE dm.id = dpgm.discount_id " 
			+ " AND dm.id = dpcm.discount_id " 
			+ " AND dm.id = dem.discount_id "
			+ " AND dm.id = :discountId "
			+ " AND dpgm.is_active = 1 AND dpgm.product_group_code = :productGroupCode "
			+ " AND dpcm.is_active = 1 AND dpcm.product_category_code = :productCategoryCode "
			+ " AND ((dem.is_active = 1 AND "
			+ "			("
			+ "				(dem.exclude_type = 'THEME_CODE' AND dem.theme_code = :themeCode) "
			+ "		 		OR (dem.exclude_type = 'ITEM_CODE' AND dem.is_excluded = 1 AND dem.item_code = :itemCode) "
			+ "		 		OR	(:complexityPct IS NOT NULL AND dem.exclude_type = 'COMPLEXITY_PERCENT' AND :complexityPct BETWEEN dem.from_value AND dem.to_value) "
			+ "		 		OR	(:makingChargePerGram IS NOT NULL AND dem.exclude_type = 'MC_PER_GRAM' AND :makingChargePerGram BETWEEN dem.from_value AND dem.to_value) "
			+ "			)"
			+ " ) OR 1=1)")
	// @formatter:on	
	Boolean validateItemForExcludeThemeAndItemCodeAndComplexityAndMakingCharge(@Param("discountId") String discountId,
			@Param("productGroupCode") String productGroupCode,
			@Param("productCategoryCode") String productCategoryCode, @Param("themeCode") String themeCode,
			@Param("itemCode") String itemCode, @Param("complexityPct") BigDecimal complexityPct,
			@Param("makingChargePerGram") BigDecimal makingChargePerGram);

	// @formatter:off
	@Query(nativeQuery = true, value = "SELECT CAST(IIF(COUNT(dm.id) > 0 , 1, 0) AS bit) " + 
			"			    FROM discount_master dm,  discount_exclude_mapping dem  " + 
			"			    WHERE dm.id = dem.discount_id  " + 
			"			    AND dm.id = :discountId " + 
			"			    AND dem.is_active = 1 AND  " + 
			"			   			( " + 
			"			   				(dem.exclude_type = 'THEME_CODE' AND dem.theme_code = :themeCode) " + 
			"			   		 		OR  (dem.exclude_type = 'ITEM_CODE' AND dem.is_excluded = 1 AND dem.item_code = :itemCode)  " + 
			"			   		 		OR	(:complexityPct IS NOT NULL AND dem.exclude_type = 'COMPLEXITY_PERCENT' AND :complexityPct  BETWEEN dem.from_value AND dem.to_value)  " + 
			"			   		 		OR	(:makingChargePerGram  IS NOT NULL AND dem.exclude_type = 'MC_PER_GRAM' AND :makingChargePerGram  BETWEEN dem.from_value AND dem.to_value) " + 
			"			   			) ")
	// @formatter:on
	Boolean validateExcludeDetails(@Param("discountId") String discountId, @Param("themeCode") String themeCode,
			@Param("itemCode") String itemCode, @Param("complexityPct") BigDecimal complexityPct,
			@Param("makingChargePerGram") BigDecimal makingChargePerGram);
}
