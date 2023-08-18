/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.ADD_EDIT_USERS;
import static com.titan.poss.core.domain.acl.UserAccessControls.GENERATE_OTP;
import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_USERS;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
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

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.constants.EmployeeTypeEnum;
import com.titan.poss.user.dto.request.OtpRequestDetails;
import com.titan.poss.user.dto.request.StoreAddTemporaryUserDto;
import com.titan.poss.user.dto.request.StoreAddUserDto;
import com.titan.poss.user.dto.request.StoreUpdateUserDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;
import com.titan.poss.user.facade.StoreUserFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for store user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController
@RequestMapping(value = "${user.base-url}/location/users")
@PreAuthorize(IS_STORE_USER)
public class StoreUserController {

	@Autowired
	StoreUserFacade storeUserFacade;

	private static final String USER_VIEW_PERMISSION = START + VIEW_USERS + END;
	private static final String USER_ADD_EDIT_PERMISSION = START + ADD_EDIT_USERS + END;
	private static final String USER_GENERATE_OTP = START + GENERATE_OTP + END;

	@ApiOperation(value = "View list of users of a store", notes = "This API will list all users of a particular store"
			+ "<br>You can filter by **'employee code'** or **'employee name'** or **'primary role(s)'**")
	@ApiPageable
	@GetMapping(value = "")
	@PreAuthorize(USER_VIEW_PERMISSION)
	public PagedRestResponse<List<EmployeeListDto>> listUsers(
			@ApiParam(value = "Provide if you want to search by 'employee code' or 'employee name'", required = false) @RequestParam(name = "searchField", required = false) @Size(max = 40, message = "max length of searchField is 40") @PatternCheck(regexp = RegExConstants.EMPCODE_OR_NAME) String searchField,
			@ApiParam(value = "Provide if you want to search employees by 'primary role(s)' assigned", required = false) @RequestParam(name = "roleCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String> roleCodes,
			@ApiParam(value = "Provide if you want to search employees by 'employee type'", allowableValues = "PERMANENT, TEMP", required = false) @RequestParam(name = "employeeType", required = false) @ValueOfEnum(enumClass = EmployeeTypeEnum.class) String employeeType,
			@ApiParam(value = "Provide if you want to search employees by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return storeUserFacade.listUsers(searchField, (employeeType != null) ? employeeType : null, isActive, roleCodes,
				pageable);

	}

	@ApiOperation(value = "Get details of a store employee by 'employee code'", notes = "This API will list employee details of a store based on **employee code**. "
			+ "It also lists all primary and temporary role codes assigned to the employee")
	@GetMapping(value = "/{employeeCode}")
	@PreAuthorize(USER_VIEW_PERMISSION)
	public EmployeeDto getStoreUserDetails(
			@ApiParam(name = "employeeCode", value = "'employee code' to get details", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode) {
		// check in db, if not there fetch from HRMS
		return storeUserFacade.getUserDetailsDto(employeeCode);
	}

	// @formatter:off
	@ApiOperation(value = "Add a store user", notes = "This API will add a store user<br><br>"
			+ "Logged in user can create emplolyees of his/ her store.<br><br>"
			+ "Address Format:<br>\r\n" + 
			"<pre>" + 
			"{\r\n" + 
			"    \"type\": \"address\",\r\n" + 
			"    \"data\": \r\n" + 
			"    {\r\n" + 
			"        \"line1\": \"DS Max Silicon\",\r\n" + 			
			"    	\"line2\": \"RR Layout, RR Nagar\",\r\n" + 
			"    	\"city\": \"Bangalore\",\r\n" + 
			"    	\"state\": \"Karnataka\",\r\n" + 
			"    	\"pincode\": \"751024\",\r\n" + 
			"    	\"country\": \"India\"\r\n" + 
			"    }\r\n" + 
			"}\r\n" + 
			"</pre><br>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "	<li><b>'birth date'</b>, <b>'temporary role code(s)'</b>, <b>'joning date'</b>, <b>'email id'</b>  are optional.</li>"
			+ "	<li><b>'email id'</b>, <b>'mobile no'</b> should be unique.</li>"
			+ "	<li>Upon successful creation of user and user will be in login active state, user will get OTP which he needs to verify to able to login to system.</li>"
			+ "</ul>")
	// @formatter:on
	@PostMapping(value = "")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void addUserDetails(
			@ApiParam(name = "body", value = "User object that needs to be created", required = true) @RequestBody @Valid StoreAddUserDto addUserDto) {
		storeUserFacade.addUserDetails(addUserDto);
	}

	@ApiOperation(value = "Update user details", notes = "This API will update store user details based on employee code<br><br>"
	// @formatter:off
			+ "<li><font size=\"2\">'Store Manager' can't assign 'SM' role</font></li>"
			+ "<li><font size=\"2\">'Store Manager' can't edit own data</font></li><br>"
			+ "Address Format:\r\n" + 
			"<pre>" + 
			"{\r\n" + 
			"    \"data\": \r\n" + 
			"    {\r\n" + 
			"        \"line1\": \"DS Max Silicon\",\r\n" + 			
			"    	\"line2\": \"RR Layout, RR Nagar\",\r\n" + 
			"    	\"city\": \"Bangalore\",\r\n" + 
			"    	\"state\": \"Karnataka\",\r\n" + 
			"    	\"pincode\": \"751024\",\r\n" + 
			"    	\"country\": \"India\"\r\n" + 
			"    },\r\n" + 
			"    \"type\": \"address\"\r\n" + 
			"}\r\n" + 
			"</pre><br>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "<li>If user's login is deactivated, upon activating login, user will be unlocked too if the user is locked.</li></ul>")
	// @formatter:on
	@PatchMapping(value = "/{employeeCode}")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void updateUserDetails(
			@ApiParam(name = "employeeCode", value = "'employee code' to update details", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode,
			@ApiParam(name = "body", value = "User object that needs to be edited", required = true) @RequestBody @Valid StoreUpdateUserDto updateUserDto) {
		storeUserFacade.updateUserDetails(employeeCode, updateUserDto);
	}

	// @formatter:off
	@ApiOperation(value = "Resend OTP for a store user", notes = "This API will resend OTP upon 'expiry time' is over or user didn't get mail.<br>"
			+ " It will be working as \"resend\" button.&nbsp;<button type=\"button\">RESEND OTP</button><br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">OTP Type:</span><br>" 
			+ "<ul>"
			+ "	<li>LOGIN_ACTIVATED</li>" 
			+ "	<li>INVITED</li>" 
			+ "	<li>FORGOT_PASSWORD</li>" 
			+ "	<li>MOBILENO_CHANGE</li>"
			+ "</ul>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "<li>'requested value' is required for changing contact details (\"MOBILENO_CHANGE\").</li></ul>")
	// @formatter:on
	@PostMapping(value = "/generate-otps")
	@PreAuthorize(USER_GENERATE_OTP)
	public void generateOtp(
			@ApiParam(name = "body", value = "OTP details that needs to be generated", required = true) @RequestBody @Valid OtpRequestDetails otpRequestDetails) {
		storeUserFacade.sendOtp(otpRequestDetails.getEmpCode(), otpRequestDetails.getOtpType(),
				otpRequestDetails.getRequestedValue(), true);
	}

	// @formatter:off
	@ApiOperation(value = "Add a temporary store user", notes = "This API will add a temporary store user<br><br>"
			+ "Logged in user can create temporary emplolyees of his/ her store.<br><br>"
			+ "Address Format:<br>\r\n" + 
			"<pre>" + 
			"{\r\n" + 
			"    \"type\": \"address\",\r\n" + 
			"    \"data\": \r\n" + 
			"    {\r\n" + 
			"        \"line1\": \"DS Max Silicon\",\r\n" + 			
			"    	\"line2\": \"RR Layout, RR Nagar\",\r\n" + 
			"    	\"city\": \"Bangalore\",\r\n" + 
			"    	\"state\": \"Karnataka\",\r\n" + 
			"    	\"pincode\": \"751024\",\r\n" + 
			"    	\"country\": \"India\"\r\n" + 
			"    }\r\n" + 
			"}\r\n" + 
			"</pre><br>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "	<li><b>'resignation date'</b> is mandatory.</li>"
			+ "	<li><b>'birth date'</b>, <b>'temporary role code(s)'</b>, <b>'joning date'</b>, <b>'email id'</b>  are optional.</li>"
			+ "	<li>If <b>'joining date'</b> is not provided, system will take current date as 'joining date'.</li>"
			+ "	<li><b>'email id'</b>, <b>'mobile no'</b> should be unique.</li>"
			+ "	<li>Upon successful creation of temporary user and user will be in login active state, user will get OTP which he/she needs to verify to be able to login to the system.</li>"
			+ "</ul>")
	// @formatter:on
	@PostMapping(value = "/temp-users")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void addTemporaryUser(
			@ApiParam(name = "body", value = "User object that needs to be created", required = true) @RequestBody @Valid StoreAddTemporaryUserDto addTempUserDto) {
		storeUserFacade.addTemporaryEmployee(addTempUserDto);
	}
}
