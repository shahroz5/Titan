/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.user.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.UserSessionsDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Repository("EngineUserSessionRepository")
public interface UserSessionRepository extends JpaRepository<UserSessionsDao, Integer> {

	// @formatter:off
	@Query(nativeQuery = true, value =  "\r\n" +     
			  "SELECT ul.user_name, em.employee_code, em.emp_name, em.mobile_no, em.email_id, "
			  + "us.id, us.login_date, us.expiry_date, us.host_name  \r\n" + 
			  "FROM (SELECT * FROM user_session WHERE IS_active = 1 AND expiry_date > :currentTime) us \r\n" + 
			  "INNER JOIN user_login ul \r\n" + 
			  "	ON us.user_name = ul.user_name \r\n" + 
			  "INNER JOIN employee_master em \r\n" + 
			  "	ON ul.employee_code = em.employee_code \r\n" + 
			  "WHERE em.location_code = :locationCode \r\n" )
	// @formatter:on
	List<Object[]> getAllActiveSessionByLocationCode(@Param("locationCode") String locationCode,
			@Param("currentTime") Date currentTime);

}
