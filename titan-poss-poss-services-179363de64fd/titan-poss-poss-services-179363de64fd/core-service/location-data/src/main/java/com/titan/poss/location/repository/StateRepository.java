/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.StateDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface StateRepository extends JpaRepository<StateDao, String> {

	/**
	 * This method will return the State details based on the stateCode.
	 * 
	 * @param stateCode
	 * @return State
	 */
	public StateDao findOneByStateId(String stateId);

	/**
	 * This method will return the state details based on the stateCode and
	 * stateName.
	 * 
	 * @param stateName
	 * @param stateCode
	 * @return StateDao
	 */
	StateDao findByDescriptionAndStateCode(String stateName, String stateCode);

	/**
	 * @param stateName
	 * @return StateDao
	 */
	StateDao findByDescription(String stateName);
}
