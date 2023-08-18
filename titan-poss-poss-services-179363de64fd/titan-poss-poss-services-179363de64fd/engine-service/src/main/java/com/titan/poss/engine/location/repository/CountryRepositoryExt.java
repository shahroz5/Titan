/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.location.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.repository.CountryRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("engineCountryRepository")
public interface CountryRepositoryExt extends CountryRepository {

	/**
	 * This method will return the Country details based on the description.
	 * 
	 * @param description
	 * @return Country
	 */
	CountryDao findOneByDescription(String description);

	/**
	 * @param countryCode
	 */
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE country_master SET fiscal_year = (country_master.fiscal_year + 1) where country_code = :countryCode")
	Integer updateFiscalYear(@Param("countryCode")String countryCode);
	
	@Query("Select cm FROM com.titan.poss.location.dao.CountryDao cm, com.titan.poss.location.dao.LocationDao lm WHERE cm.countryCode = lm.country.countryCode AND lm.locationCode = :locationCode")
	CountryDao getCountryDetails(@Param("locationCode") String locationCode);


}
