/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxClassDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface TaxClassRepository extends JpaRepository<TaxClassDao, String> {

	/**
	 * This method will return the TaxClass details based on the taxClassCode.
	 * 
	 * @param taxClassCode
	 * @return TaxClass
	 */
	public TaxClassDao findOneByTaxClassCode(String taxClassCode);
	
}
