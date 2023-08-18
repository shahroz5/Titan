/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.UserOtpDao;

/**
 * Handles repository operations for <b>UserOtp</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserOtpRepository")
public interface UserOtpRepository extends JpaRepository<UserOtpDao, Integer> {

	UserOtpDao findOneByEmployeeAndIsActiveAndExpiryDateGreaterThanEqual(EmployeeDao employee, Boolean isActive,
			Date date);

	UserOtpDao findOneByEmployeeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(EmployeeDao employee,
			Boolean isActive, Date date, String otpType);

	UserOtpDao findOneByEmployeeAndIsActive(EmployeeDao employee, Boolean isActive);

	public List<UserOtpDao> findByEmployeeAndOtpTypeAndExpiryDateLessThanAndIsActiveTrue(EmployeeDao employee,
			String otpType, Date date);

	public List<UserOtpDao> findByEmployeeAndOtpTypeAndIsActiveTrue(EmployeeDao employee, String otpType);

	List<UserOtpDao> findByIsActiveAndOtpTypeAndExpiryDateLessThanEqualOrderByEmployeeAsc(Boolean isActive,
			String otpType, Date date);

	@Query("SELECT uo FROM UserOtp uo WHERE uo.reqValue IN"
			+ " (SELECT em.mobileNo FROM UserEmployee em where em.mobileNo IN (:mobileNos))")
	List<UserOtpDao> listUserOtpByMobileNoIn(@Param("mobileNos") Set<String> mobileNos);

	UserOtpDao findOneByEmployeeEmployeeCodeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(String empCode,
			Boolean isActive, Date date, String otpType);

}
