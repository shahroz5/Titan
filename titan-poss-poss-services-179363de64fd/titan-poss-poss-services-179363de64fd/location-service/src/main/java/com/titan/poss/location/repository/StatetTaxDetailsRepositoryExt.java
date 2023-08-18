/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.StateTaxDetailsDaoExt;
import com.titan.poss.location.dao.StateTaxMappingDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface StatetTaxDetailsRepositoryExt extends JpaRepository<StateTaxDetailsDaoExt, String> {

	/**
	 * @param idList
	 * @return
	 */
	List<StateTaxDetailsDaoExt> findByIdIn(List<String> idList);

	/**
	 * @param stateTaxMappingId
	 * @return List<StateTaxDetailsDao>
	 */
	List<StateTaxDetailsDaoExt> findByStateTaxMappingId(StateTaxMappingDao stateTaxMappingId);
}
