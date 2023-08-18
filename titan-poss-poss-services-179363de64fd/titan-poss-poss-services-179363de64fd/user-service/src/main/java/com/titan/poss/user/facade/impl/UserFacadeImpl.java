/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.getAuthUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpDto;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;
import com.titan.poss.user.dto.request.UserLocationUpdate;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.facade.UserFacade;
import com.titan.poss.user.service.UserService;

/**
 * Facade implementation layer of user role controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserFacade")
public class UserFacadeImpl implements UserFacade {

	@Autowired
	UserService userService;

	@Override
	public Boolean isUniqueEmailOrMobile(String emailMobileEnum, String value) {

		return userService.isUniqueEmailOrMobile(emailMobileEnum, value);
		
	}

	@Override
	public void resetPassword(ResetPasswordDto resetPasswordDto) {
		userService.resetUserPassword(resetPasswordDto);

	}

	@Override
	public void otpUserPasswordVerify(OtpPasswordDto otpPasswordDto) {

		if (OtpTypeEnum.MOBILENO_CHANGE.name().equals(otpPasswordDto.getOtpType()))
			return;

		userService.otpUserPasswordVerify(otpPasswordDto);

	}

	@Override
	public void generateOtpForForgotPassword(OtpDetailsWoType otpDetails) {
		userService.generateOTPForgotPassword(otpDetails);

	}

	@Override
	public EmployeeDto getProfileDetails() {

		EmployeeDto employeeDto = userService.convertEmployeeToDto(
				userService.getEmployeeDetailsWithErrorCheck(getAuthUser().getUsername()), (short) 1);

		employeeDto.setRequestedMobileNo(
				userService.checkOtpActiveForMobileNumberValidation(employeeDto.getEmployeeCode()));

		return employeeDto;
	}

	@Override
	public void validateOtpForMobileNo(OtpDto otpDto) {
		OtpPasswordDto otpPasswordDto = new OtpPasswordDto();

		otpPasswordDto.setOtp(otpDto.getOtp());
		otpPasswordDto.setOtpType(OtpTypeEnum.MOBILENO_CHANGE.name());
		otpPasswordDto.setEmpCode(getAuthUser().getUsername());

		userService.otpUserPasswordVerify(otpPasswordDto);
	}

	@Override
	public void updateUserStatus(String locationCode, UserLocationUpdate userStatus) {

		userService.updateUserStatus(locationCode, userStatus);
	}

}
