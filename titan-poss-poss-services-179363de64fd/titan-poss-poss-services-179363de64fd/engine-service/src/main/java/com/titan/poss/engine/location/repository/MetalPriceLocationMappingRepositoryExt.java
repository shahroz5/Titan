/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.location.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.location.dao.MetalPriceLocationMappingDao;
import com.titan.poss.location.repository.MetalPriceLocationMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineMetalPriceLocationMappingRepository")
public interface MetalPriceLocationMappingRepositoryExt extends MetalPriceLocationMappingRepository {

	@Query("select m from MetalPriceLocationMappingDao m where (m.location.locationCode=:locationCode and m.metalTypeCode=:metalTypeCode and m.applicableDate=:applicableDate)")
	MetalPriceLocationMappingDao findOneByLocationCodeAndMetalTypeCodeAndApplicableDate(
			@Param("locationCode") String locationCode, @Param("metalTypeCode") String metalTypeCode,
			@Param("applicableDate") Date applicableDate);

	// @formatter:off
	@Query(nativeQuery = true, 
			value = "SELECT mm.item_type_code, mm.description, pm.offset, pm.karat, pm.purity, "
			+ " mplm.metal_rate, mplm.applicable_date, mplm.currency_code " 
			+ " FROM " +"locations.dbo.metal_price_location_mapping  mplm "
			+ "	LEFT JOIN " + "products.dbo.item_type_master mm " 
			+ "	ON mplm.metal_type_code = mm.item_type_code"
			+ "	LEFT JOIN " + "products.dbo.purity_master pm "
			+ "	ON pm.item_type_code = mm.item_type_code" 
			+ " WHERE mplm.location_code = :locationCode "
			+ " AND mplm.applicable_date = :applicableDate"
			+ "	AND pm.is_active = :isActive AND "
			+ "(:isDisplayed IS NULL OR pm.is_displayed = :isDisplayed) AND mm.is_active = :isActive "
			+ " AND (:offset IS NULL OR pm.offset = :offset)")
	// @formatter:on
	public List<Object[]> getMetalRate(@Param("isActive") Boolean isActive, @Param("locationCode") String locationCode,
			@Param("applicableDate") String applicableDate, @Param("offset") BigDecimal offset,
			@Param("isDisplayed") Boolean isDisplayed);
	
	@Query(nativeQuery = true, 
			value = "SELECT * FROM " +"locations.dbo.metal_price_location_mapping  mplm " 
			+ " WHERE mplm.location_code = :locationCode AND mplm.applicable_date = :applicableDate)")
	// @formatter:on
	public List<Object[]> findAllByLocationCodeAndCurrentDate(@Param("locationCode") String locationCode,@Param("applicableDate") String applicableDate);
	
	
	// @formatter:off   
	@Query(nativeQuery = true, 
				value = "SELECT mplm.location_code, mplm.metal_type_code, mplm.metal_rate, mplm.applicable_date,mp.price_type, mplm.created_by, mplm.created_date, mplm.last_modified_by, mplm.last_modified_date "
				+ " FROM metal_price_location_mapping  mplm "
				+ "	LEFT JOIN locations.dbo.metal_price_config mp ON mp.metal_type_code = mplm.metal_type_code  "
				+ "AND  mplm.applicable_date = mp.applicable_date"
				+ " WHERE mplm.location_code = :locationCode AND mplm.metal_type_code in ('J','L') AND mplm.applicable_date = :applicableDate ") 
	// @formatter:on
	public List<Object[]> getMetalRates(@Param("locationCode") String locationCode,
				@Param("applicableDate")  Date applicableDate);
		
	

}
