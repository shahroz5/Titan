/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.user.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.UserOtpDao;

/**
 * Handles repository operations for <b>UserOtp</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineUserOtpRepository")
public interface UserOtpRepository extends JpaRepository<UserOtpDao, Integer> {

	UserOtpDao findOneByEmployeeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(EmployeeDao employee,
			Boolean isActive, Date date, String otpType);

}
