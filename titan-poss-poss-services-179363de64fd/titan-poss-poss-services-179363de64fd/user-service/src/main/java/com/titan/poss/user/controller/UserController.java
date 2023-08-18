/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.ADD_EDIT_USERS;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.user.dto.constants.UniqueFieldEnum;
import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpDto;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;
import com.titan.poss.user.dto.request.UserLocationUpdate;
import com.titan.poss.user.dto.response.EmpMobileReqDto;
import com.titan.poss.user.facade.UserFacade;
import com.titan.poss.user.service.UserService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * Controller for user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("CorpUserController")
@RequestMapping(value = "${user.base-url}/users")
@Validated
public class UserController {

	@Autowired
	private UserFacade userFacade;

	@Autowired
	private UserService userService;

	static final String UNIQUE_CHECK_PERMISSION = START + ADD_EDIT_USERS + END;

	// @formatter:off
	@ApiOperation(value = "Verify if email/ mobile no. is already assigned or not", notes = "This API will check if the provided email/mobile no. is already assigned to a user or not<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Unique Type:</span><br>" 
			+ "<ul>"
			+ "	<li>EMAIL</li>"
			+ "	<li>MOBILE</li>"
			+ "</ul>")
	// @formatter:on
	@GetMapping(value = "/unique-checks")
	@PreAuthorize(UNIQUE_CHECK_PERMISSION)
	public Boolean isUniqueEmailOrMobile(
			@ApiParam(name = "uniqueType", value = "'uniqueType' to check uniqueness", allowableValues = "EMAIL, MOBILE", required = true) @RequestParam(name = "uniqueType") @ValueOfEnum(enumClass = UniqueFieldEnum.class) String uniqueType,
			@ApiParam(name = "value", value = "'value' of email/mobile no. ", required = true) @RequestParam(name = "value") @PatternCheck(regexp = RegExConstants.ALPHANUMERIC_OR_EMAIL_REGEX, nullCheck = true) String value) {
		return userFacade.isUniqueEmailOrMobile((uniqueType != null) ? uniqueType : null, value);
	}

	@ApiOperation(value = "Reset password for a user", notes = "This API will reset password for a logged in user<br>"
			+ "When user is loggedin & wants to change password, then user needs to access this API.")
	@PatchMapping(value = "/change-password")
	public void resetUserPassword(
			@ApiParam(name = "body", value = "Password object to reset password", required = true) @RequestBody @Valid ResetPasswordDto resetPasswordDto) {
		userFacade.resetPassword(resetPasswordDto);
	}

	// @formatter:off
	@ApiOperation(value = "Verify user password", notes = "This API will verify OTP and password for a user<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">OTP Type:</span><br>" 
			+ "<ul>"
			+ "	<li>INVITED</li>" 
			+ "	<li>LOGIN_ACTIVATED</li>" 
			+ "	<li>FORGOT_PASSWORD</li>" 
			+ "</ul>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "<li>For verifying contact details, user don't need to send password and service is not considering too.</li>"
			+ "<li>Password change is required for INVITED, LOGIN_ACTIVATED, FORGOT_PASSWORD status</li></ul>")
	// @formatter:on
	@PatchMapping(value = "/verify-otp")
	public void otpUserPasswordVerify(
			@ApiParam(name = "body", value = "Otp Password object that needs to be verified", required = true) @RequestBody @Valid OtpPasswordDto otpPasswordDto) {

		userFacade.otpUserPasswordVerify(otpPasswordDto);
	}

	@ApiOperation(value = "Generate OTP for forgot password", notes = "This API will generate OTP for forgot password<br>"
			+ "<br>**Note** : It will always give **200**, even if user doesn't exist, so that no one can get to know username by any means")
	@PostMapping(value = "/forgot-password")
	public void generateOtpForForgotPassword(
			@ApiParam(name = "body", value = "OTP object containing employee code to send mail on his/ her registered email id", required = true) @RequestBody @Valid OtpDetailsWoType otpDetails) {

		userFacade.generateOtpForForgotPassword(otpDetails);
	}

	@ApiOperation(value = "Validate mobile number", notes = "This API will validate otp for mobile number validation of a logged in user")
	@PatchMapping(value = "/validate-mobile-number")
	public void validateOtpForMobileNo(
			@ApiParam(name = "body", value = "OTP object that needs to be verified for mobile number validation", required = true) @RequestBody @Valid OtpDto otpDto) {
		userFacade.validateOtpForMobileNo(otpDto);
	}

	// @formatter:off
	@ApiOperation(value = "Update users status", notes = "This API will activate/ deactivate users of a particular store/ region/ orgnaization"
			+ " This will only be used in inter-service. UI is not supposed to consume this API."
			+ " This API will be called at master level. For example when a store got deactivated, it will internally call this API to deactivate user of that store."
			+ "	Similarly when activated, calling this API will activate users of that store which are elligible.</br></br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Location Category Type:</span><br>" 
			+ "<ul>"
			+ "	<li>LOC -> to deactivate users of a particular store</li>"
			+ "	<li>REG -> to deactivate users of a particular region</li>"
			+ "</ul>")
	// @formatter:on
	@PatchMapping(value = "/location/{locationCode}")
	public void updateUserStatus(@PathVariable("locationCode") @NotNull String locationCode,
			@ApiParam(name = "body", required = true) @RequestBody @Valid UserLocationUpdate userLocationUpdate) {
		userFacade.updateUserStatus(locationCode, userLocationUpdate);
	}

	@ApiOperation(value = "Get pending mobile number", notes = "This API will get requested mobile number for loggedin user which are yet to validate, if available for verification.")
	@GetMapping(value = "/mobile-number")
	public EmpMobileReqDto getRequestedMobileNumber() {
		return userService.getRequestedMobileNumber();
	}

}
