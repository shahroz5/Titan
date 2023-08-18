/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.location.dao.MetalPriceLocationMappingDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface MetalPriceLocationMappingRepositoryExt extends JpaRepository<MetalPriceLocationMappingDaoExt, String> {

//and  '2020-01-30 23:59:59.999'
	@Query("select m from MetalPriceLocationMappingDaoExt m where ("
			+ "(m.location.locationCode in(:locationCodes) OR nullif(CHOOSE(1,:locationCodes),'') IS NULL) "
			+ " AND (m.metalTypeCode = :metalTypeCode) " + " AND m.applicableDate= :applicableDate )")
	List<MetalPriceLocationMappingDaoExt> getMetalPriceLocationMappingWithCombination(
			@Param("locationCodes") List<String> locationCodes, @Param("metalTypeCode") String metalTypeCode,
			@Param("applicableDate") Date applicableDate);

	@Transactional
	@Modifying
	@Query("delete from MetalPriceLocationMappingDaoExt m where m.id in(:ids) OR nullif(CHOOSE(1,:ids),'') IS NULL ")
	void deleteWithIds(@Param("ids") List<String> ids);

	@Query("select m from MetalPriceLocationMappingDaoExt m where (" + "(m.metalPriceConfig.id=:id ) "
			+ "AND (m.metalPriceConfig.metalTypeCode=:metalTypeCode ) "
			+ "AND (m.market.marketCode in(:marketCodes) OR nullif(CHOOSE(1,:marketCodes),'') IS NULL) AND "
			+ "(m.location.locationCode in(:locationCodes) OR nullif(CHOOSE(1,:locationCodes),'') IS NULL))")
	Page<MetalPriceLocationMappingDaoExt> findByMetalConfig(@Param("id") String id,
			@Param("metalTypeCode") String metalTypeCode, @Param("marketCodes") List<String> marketCodes,
			@Param("locationCodes") List<String> locationCodes, Pageable pageable);

	/**
	 * @param deletingIds
	 * @return
	 */

	@Query("select m from MetalPriceLocationMappingDaoExt m where m.id in(:deleteIds)")
	List<MetalPriceLocationMappingDaoExt> getWithIds(@Param("deleteIds") List<String> deletingIds);

	/**
	 * @param applicableDate
	 * @param locationCode
	 * @return
	 */
	@Query("select m from MetalPriceLocationMappingDaoExt m where m.applicableDate= :applicableDate and m.location.locationCode=:locationCode")
	List<MetalPriceLocationMappingDaoExt> findByApplicableDateAndLocationCode(
			@Param("applicableDate") Date applicableDate, @Param("locationCode") String locationCode);

}
