/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.location.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.PincodeDao;
import com.titan.poss.location.repository.PincodeRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("enginePinCodeRepository")
public interface PincodeRepositoryExt extends PincodeRepository {

	PincodeDao findByPinCodeAndCountry(String pinCode, CountryDao countryCode);

}