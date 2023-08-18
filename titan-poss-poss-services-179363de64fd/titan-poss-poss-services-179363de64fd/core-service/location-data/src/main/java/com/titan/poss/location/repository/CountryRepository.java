/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CountryDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository
public interface CountryRepository extends JpaRepository<CountryDao, String>{

	CountryDao findOneByCountryCode(String string);
	
	@Query("Select cm FROM CountryDao cm, LocationDao lm WHERE cm.countryCode = lm.country.countryCode AND lm.locationCode = :locationCode")
	CountryDao getCountryDetails(@Param("locationCode") String locationCode);


}
