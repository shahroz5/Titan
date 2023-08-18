/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.repository;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.titan.poss.location.dao.MetalPriceConfigStageDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface MetalPriceConfigStagingRepository extends JpaRepository<MetalPriceConfigStageDao, String> {

	/**
	 * @param referenceId
	 */
	@Modifying
	@Transactional
	@Query(value = "Delete from MetalPriceConfigStageDao m where m.correlationId=:correlationId")
	void deleteByCorrelationId(@Param("correlationId") String correlationId);

	/**
	 * @param metalType
	 * @param applicableDate
	 * @param metalPriceType
	 * @param pageable
	 * @return
	 */
	@Query("select m from MetalPriceConfigStageDao m where ( (m.applicableDate= :applicableDate)"
			+ " and (m.priceType= :priceType)) order by m.createdDate ASC")
	List<MetalPriceConfigStageDao> findByMetalTypeAndAppDateAndPriceType(@Param("applicableDate") Date applicableDate,
			@Param("priceType") String priceType);

}
