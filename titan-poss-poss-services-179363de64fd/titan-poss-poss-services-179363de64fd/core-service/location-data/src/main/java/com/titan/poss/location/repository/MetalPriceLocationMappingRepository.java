/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.location.dao.MetalPriceLocationMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface MetalPriceLocationMappingRepository extends JpaRepository<MetalPriceLocationMappingDao, String> {

	@Transactional
	@Modifying
	@Query("delete from MetalPriceLocationMappingDao m where m.id in(:ids) OR nullif(CHOOSE(1,:ids),'') IS NULL ")
	void deleteWithIds(@Param("ids") List<String> ids);

	/**
	 * @param locationCode
	 * @param metalTypeCode
	 * @param applicableDate
	 * @return MetalPriceLocationMappingDao
	 */
	@Query("select m from MetalPriceLocationMappingDao m where m.applicableDate= :applicableDate and m.location.locationCode=:locationCode and m.metalTypeCode = :metalTypeCode")
	MetalPriceLocationMappingDao findByUniqueCombination(@Param("locationCode") String locationCode,
			@Param("metalTypeCode") String metalTypeCode, @Param("applicableDate") Date applicableDate);
}
