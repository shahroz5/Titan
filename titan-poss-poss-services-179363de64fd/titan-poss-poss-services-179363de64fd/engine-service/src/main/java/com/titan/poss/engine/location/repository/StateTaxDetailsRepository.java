/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.location.repository;

import com.titan.poss.location.dao.StateTaxDetailsDao;
import com.titan.poss.location.dao.StateTaxMappingDao;
import com.titan.poss.location.dao.TaxClassDao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("stateTaxDetailsRepository")
public interface StateTaxDetailsRepository extends JpaRepository<StateTaxDetailsDao, String> {

	/**
	 *
	 * @param stateTaxMappingDao
	 * @param taxDetails
	 * @return StateTaxDetailsDao
	 */
	StateTaxDetailsDao findByStateTaxMappingIdAndTaxClassCode(StateTaxMappingDao stateTaxMappingDao,
			TaxClassDao taxDetails);
}
