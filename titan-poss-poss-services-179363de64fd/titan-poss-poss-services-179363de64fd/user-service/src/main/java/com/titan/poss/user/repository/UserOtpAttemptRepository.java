/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.UserOtpAttemptDao;
import com.titan.poss.user.dao.UserOtpDao;

/**
 * Reposiotry class for <b>user_otp_attempt</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserOtpAttemptRepository")
public interface UserOtpAttemptRepository extends JpaRepository<UserOtpAttemptDao, Integer> {

	List<UserOtpAttemptDao> findByUserOtp(UserOtpDao userOtp);

}
