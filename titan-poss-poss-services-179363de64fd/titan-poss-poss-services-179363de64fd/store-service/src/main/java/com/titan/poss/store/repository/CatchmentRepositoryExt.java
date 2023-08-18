/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dao.CatchmentId;
import com.titan.poss.store.dto.response.CatchmentDto;

/**
 * Handles repository operations for <b>Catchment</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("storeCatchmentRepositoryExt")
public interface CatchmentRepositoryExt extends CatchmentRepository {

	/**
	 * This method will return the list of Catchment details based on searchField
	 * for a particular locationCode.
	 * 
	 * @param searchField
	 * @param locationCode
	 * @param pageable
	 * @return Page<CatchmentDto>
	 */
	// @formatter:off
	@Query("SELECT new com.titan.poss.store.dto.response.CatchmentDto(cm.catchmentId.catchmentCode, cm.description, cm.isActive ,cm.isEditable) \r\n"
			+ " From CatchmentDao cm \r\n"
			+ " WHERE cm.isActive=true \r\n"
			+ " AND (cm.catchmentId.catchmentCode LIKE %:searchField%) \r\n"
			+ " AND (cm.catchmentId.locationCode = :locationCode)")
	// @formatter:on
	Page<CatchmentDto> listAllCatchment(@Param("searchField") String searchField,
			@Param("locationCode") String locationCode, Pageable pageable);

	CatchmentDao findOneByCatchmentIdAndDescription(CatchmentId catchmentId, String description);

	CatchmentDao findOneByCatchmentIdLocationCodeAndDescription(String locationCode, String description);
}
