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
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.MarketMarkupMappingStage;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("locationMarketMarkupStage")
public interface MarketMarkupMappingStageRepository extends JpaRepository<MarketMarkupMappingStage, String> {

	/**
	 * @param referenceId
	 */
	@Modifying
	@Transactional
	@Query(value = "Delete from MarketMarkupMappingStage m where m.correlationId=:correlationId")
	void deleteByCorrelationId(@Param("correlationId") String correlationId);

	/**
	 * @param metalTypeCode
	 * @param priceType
	 * @param applicableDate
	 * @return
	 */
	List<MarketMarkupMappingStage> findByApplicableDate(@Param("applicableDate") Date applicableDate);

	/**
	 * @param applicableDate
	 * @param metalTypeCode
	 * @return
	 */
	List<MarketMarkupMappingStage> findByApplicableDateAndMetalTypeCode(@Param("applicableDate") Date applicableDate,
			@Param("metalTypeCode") String metalTypeCode);

}
