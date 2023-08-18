/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.StateDaoExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface StateRepositoryExt extends JpaRepository<StateDaoExt, String> {

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param stateCode
	 * @return State
	 */
	public StateDaoExt findOneByStateId(String stateId);
	
	/**
	 * This method will return the list of State details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<State>
	 */
	public Page<StateDaoExt> findByIsActive(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param description
	 * @return State
	 */
	public StateDaoExt findOneByDescription(String description);
	
	/**
	 * This method will return the state details based on the stateCode and
	 * stateName.
	 *	  
	 * @param stateName
	 * @param stateCode
	 * @return StateDao
	 */
	StateDaoExt findByDescriptionAndStateCode(String stateName, String stateCode);

	/**
	 * @param regionCodes
	 * @param countryCodes
	 * @param pageable
	 * @return Page<StateDaoExt>
	 */
	@Query("select s from StateDaoExt s where s.isActive = true and s.stateId in "
			+ "(select distinct(state.stateId) from LocationDao where (region.regionCode in(:regionCodes) "
			+ "OR nullif(CHOOSE(1,:regionCodes),'') IS NULL) and (country.countryCode in(:countryCodes) "
			+ "OR nullif(CHOOSE(1,:countryCodes),'') IS NULL) and isActive = true )")
	public Page<StateDaoExt> getStateLists(@Param("regionCodes") List<String> regionCodes,
			@Param("countryCodes") List<String> countryCodes, Pageable pageable);


}
