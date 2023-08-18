/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.DiscountLocationMappingDao;
import com.titan.poss.config.repository.DiscountLocationMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineDiscountLocationMappingRepository")
public interface DiscountLocationMappingRepositoryExt extends DiscountLocationMappingRepository {

	@Query("Select dlm from DiscountLocationMappingDao dlm where dlm.discount.id = :discountId AND dlm.locationCode = :locationCode AND :businessDate between dlm.offerStartDate AND dlm.offerEndDate")
	DiscountLocationMappingDao getLocationDetails(@Param("discountId") String discountId,
			@Param("locationCode") String locationCode, @Param("businessDate") Date businessDate);
	
	@Query("Select dlm from DiscountLocationMappingDao dlm where dlm.discount.id = :discountId AND dlm.locationCode = :locationCode ")
	DiscountLocationMappingDao getEmpowermentLocationConfigDetails(@Param("discountId") String discountId,
			@Param("locationCode") String locationCode);

}
