/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.TaxClassDao;

/**
 * @author  Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface TaxClassRepositoryExt extends TaxClassRepository {

	/**
	 * This method will return the list of TaxClass details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return Page<TaxClass>
	 */
	public Page<TaxClassDao> findByIsActive(Boolean isActive, Pageable pageable);


}
