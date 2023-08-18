/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import org.springframework.stereotype.Service;

import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpDto;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;
import com.titan.poss.user.dto.request.UserLocationUpdate;
import com.titan.poss.user.dto.response.EmployeeDto;

/**
 * Facade layer of user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface UserFacade {

	/**
	 * Checks if the entered mobile or email number is unique or not
	 * 
	 * @param emailMobileEnum
	 * @param value
	 * @return Boolean
	 */
	public Boolean isUniqueEmailOrMobile(String emailMobileEnum, String value);

	/**
	 * Reset user password
	 * 
	 * @param resetPasswordDto
	 */
	public void resetPassword(ResetPasswordDto resetPasswordDto);

	/**
	 * Verify OTP for password
	 * 
	 * @param otpPasswordDto
	 */
	public void otpUserPasswordVerify(OtpPasswordDto otpPasswordDto);

	/**
	 * Generate OTP for forgot password
	 * 
	 * @param otpDetails
	 */
	public void generateOtpForForgotPassword(OtpDetailsWoType otpDetails);

	/**
	 * Get profile details of a logged in user
	 * 
	 * @return
	 */
	public EmployeeDto getProfileDetails();

	/**
	 * Validate OTP for mobile number
	 */
	public void validateOtpForMobileNo(OtpDto otpDto);

	/**
	 * deactivate/activate location roles
	 * 
	 * @param userStatus
	 */
	public void updateUserStatus(String locationCode, UserLocationUpdate userStatus);

}
