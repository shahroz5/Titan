/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.config.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.config.dao.FocSchemeLocationMappingDao;
import com.titan.poss.config.repository.FocSchemeLocationMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Repository
public interface FocSchemeLocationMappingRepositoryExt extends FocSchemeLocationMappingRepository {

	@Query("Select fsl from FocSchemeLocationMappingDao fsl "
			+ "inner Join FocSchemeMasterDao fsm on fsl.focSchemeMasterDao.id = fsm.id "
			+ "where (:mobileNo IS NULL OR fsl.mobileNo = :mobileNo) "
			+ "AND (:currentDate >= fsl.startDate AND :currentDate <= fsl.endDate) "
			+ "AND fsl.locationCode = :locationCode AND "
			+ "fsm.name = 'FOC_BLOCKING_FOR_CUSTOMER' AND fsm.manualFoc = 1 AND fsl.isActive=1")
	List<FocSchemeLocationMappingDao> getFocBlockedForCustomer(@Param("locationCode") String locationCode,
			@Param("mobileNo") String mobileNo, @Param("currentDate") Date currentDate);

	@Query("Select fsl from FocSchemeLocationMappingDao fsl "
			+ "inner Join FocSchemeMasterDao fsm on fsl.focSchemeMasterDao.id = fsm.id "
			+ "where (:currentDate >= fsl.startDate AND :currentDate <= fsl.endDate) "
			+ "AND (:locationCode IS NULL or fsl.locationCode = :locationCode) "
			+ "AND fsm.name = 'FOC_BLOCKING_FOR_STORE' AND fsm.manualFoc = 1 AND fsl.isActive=1")

	FocSchemeLocationMappingDao focBlockedForLocationExist(@Param("locationCode") String locationCode,
			@Param("currentDate") Date currentDate);

}
