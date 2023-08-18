/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.repository.StateTaxMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineStateTaxMappingRepository")
public interface StateTaxMappingRepositoryExt extends StateTaxMappingRepository {

	/**
	 * 
	 * @param srcStateTaxCode
	 * @param status
	 * @return
	 */
	StateTaxMappingDao findByStateTaxCodeAndIsActive(String srcStateTaxCode, Boolean status);

	StateTaxMappingDao findByStateAndIsActiveTrue(StateDao state);
	
	StateTaxMappingDao findByStateStateIdAndIsActiveTrue(String  stateId);

}
