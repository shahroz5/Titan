/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.PincodeDaoExt;


/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("locationPinCodeRepository")
public interface PincodeRepositoryExt extends JpaRepository<PincodeDaoExt, String> {

	
	PincodeDaoExt findByPinCodeAndCountry(String pinCode, CountryDao countryCode);

	/**
	 * @param id
	 * @return
	 */
	PincodeDaoExt findOneById(String id);
	
}