/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.UserLoginDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserUserLoginRepository")
public interface UserLoginRepository extends JpaRepository<UserLoginDao, String> {

	/**
	 * 
	 * This method will return the UserLogin details based on the userName.
	 * 
	 * @param userName
	 * @return UserLoginDao
	 */
	UserLoginDao findOneByUserName(String userName);
	
	List<UserLoginDao> findByIsLoginActiveTrueAndPasswordChangedDateLessThanEqualAndEmployeeUserTypeNot(
			@Param("dateToCheck") Date dateToCheck, @Param("userTypeNotAllowed") String userTypeNotAllowed);

	List<UserLoginDao> findByIsLoginActiveTrueAndLastLoginDateLessThanEqualAndEmployeeUserTypeNot(
			@Param("dateToCheck") Date dateToCheck, @Param("userTypeNotAllowed") String userTypeNotAllowed);

	List<UserLoginDao> findByEmployeeEmployeeCodeIn(List<String> employeeCodes);
	
	List<UserLoginDao> findByEmployeeHasLoginAccess(String empCode);

}
