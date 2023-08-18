/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.location.repository.StateRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineStateRepository")
public interface StateRepositoryExt extends StateRepository {

	// @formatter:off
	@Query(value = "SELECT new com.titan.poss.core.dto.StateLiteDto(state.id, state.stateCode, state.description, \r\n"
			+ " CASE \r\n"
			+ "		WHEN (stateTax.isActive = 1) THEN stateTax.stateTaxCode \r\n"
			+ "     ELSE null \r\n"
			+ " END ) \r\n"
			+ " FROM com.titan.poss.location.dao.StateDao state \r\n"
			+ " LEFT JOIN com.titan.poss.location.dao.StateTaxMappingDao stateTax \r\n"
			+ " 	ON state = stateTax.state \r\n"
			+ " WHERE state.country.countryCode = :countryCode AND state.isActive = 1",
			countQuery = "SELECT COUNT(st) FROM com.titan.poss.location.dao.StateDao st \r\n"
					+ " WHERE st.country.countryCode = :countryCode AND st.isActive = 1")
	// @formatter:on
	Page<StateLiteDto> getStateDetails(@Param("countryCode") String countryCode, Pageable pageable);

}
