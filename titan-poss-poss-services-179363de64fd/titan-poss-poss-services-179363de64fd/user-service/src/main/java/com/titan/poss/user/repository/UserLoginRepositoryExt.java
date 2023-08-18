/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.UserLoginDao;

/**
 * Handles repository operations for <b>UserLogin</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserUserLoginRepositoryExt")
public interface UserLoginRepositoryExt extends UserLoginRepository {

	UserLoginDao findOneByEmployeeEmployeeCode(String employeeCode);

	UserLoginDao findOneByEmployee(EmployeeDao employee);

}
