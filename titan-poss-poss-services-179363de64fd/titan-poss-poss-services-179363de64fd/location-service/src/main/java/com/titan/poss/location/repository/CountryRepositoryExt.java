/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CountryDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("countryRepoExt")
public interface CountryRepositoryExt extends CountryRepository {

	/**
	 * This method will return the Country details based on the description.
	 * 
	 * @param description
	 * @return Country
	 */
	public CountryDao findOneByDescription(String description);

}
