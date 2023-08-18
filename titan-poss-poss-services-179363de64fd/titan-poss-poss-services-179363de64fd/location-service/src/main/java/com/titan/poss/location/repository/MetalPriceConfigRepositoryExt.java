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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MetalPriceConfigDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository

public interface MetalPriceConfigRepositoryExt extends JpaRepository<MetalPriceConfigDaoExt, String> {
	
	@Query("select m from MetalPriceConfigDaoExt m where ( (m.applicableDate= :applicableDate)"
			+ "and (m.metalTypeCode= :metalTypeCode OR :metalTypeCode IS NULL) and  (m.id= :id OR :id IS NULL)  )")
	Page<MetalPriceConfigDaoExt> findByCombination(@Param("metalTypeCode") String metalTypeCode,
			@Param("applicableDate") Date applicableDate, @Param("id") String id, Pageable pageable);

	@Query("select m from MetalPriceConfigDaoExt m where ( (m.applicableDate= :applicableDate)"
			+ " and (m.priceType= :priceType) and (m.metalTypeCode= :metalTypeCode OR :metalTypeCode IS NULL)  )")
	List<MetalPriceConfigDaoExt> findByPriceTypeAndMetalCodeAndApplicableDate(@Param("priceType") String priceType,
			@Param("metalTypeCode") String metalTypeCode, @Param("applicableDate") Date applicableDate);

	/**
	 * @param metalTypeCode
	 * @param applicableDate
	 * @param priceType
	 * @param pageable
	 */
	@Query("select m from MetalPriceConfigDaoExt m where ( (m.applicableDate= :applicableDate)"
			+ " and (m.priceType= :priceType) and (m.metalTypeCode= :metalTypeCode OR :metalTypeCode IS NULL)) order by m.createdDate DESC")
	List<MetalPriceConfigDaoExt> findByMetalTypeAndAppDateAndPriceType(@Param("metalTypeCode") String metalTypeCode,
			@Param("applicableDate") Date applicableDate, @Param("priceType") String priceType, Pageable pageable);

	/**
	 * @param applicableDate
	 * @param metalTypeCode
	 * @param string
	 * @return
	 */
	MetalPriceConfigDaoExt findByApplicableDateAndMetalTypeCodeAndPriceType(Date applicableDate, String metalTypeCode,
			String priceType);

	/**
	 * method used for comparing existing priceChangeTime time and coming request
	 * time
	 * 
	 * @param metalTypeCode
	 * @param priceType
	 * @param applicableDate
	 * @return
	 */
	@Query("select m from MetalPriceConfigDaoExt m where ( (m.applicableDate= :applicableDate)"
			+ " and (m.priceType= :priceType) and (m.metalTypeCode= :metalTypeCode OR :metalTypeCode IS NULL)) order by m.lastModifiedDate DESC")
	List<MetalPriceConfigDaoExt> findByMetalTypeCodeAndPriceTypeAndApplicableDate(
			@Param("metalTypeCode") String metalTypeCode, @Param("priceType") String priceType,
			@Param("applicableDate") Date applicableDate, Pageable pageable);

}
