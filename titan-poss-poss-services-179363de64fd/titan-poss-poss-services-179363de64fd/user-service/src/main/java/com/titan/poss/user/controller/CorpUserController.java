/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*  .
*/
package com.titan.poss.user.controller;

import static com.titan.poss.core.domain.acl.UserAccessControls.ADD_EDIT_USERS;
import static com.titan.poss.core.domain.acl.UserAccessControls.GENERATE_OTP;
import static com.titan.poss.core.domain.acl.UserAccessControls.VIEW_USERS;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_CORP_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.List;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.user.dto.constants.EmployeeTypeEnum;
import com.titan.poss.user.dto.request.CorporateAddUserDto;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.EmployeeLocationUpdateDto;
import com.titan.poss.user.dto.request.OtpRequestDetails;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;
import com.titan.poss.user.facade.CorpUserFacade;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * Controller for corporate user management
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping(value = "${user.base-url}/corp/users")
@PreAuthorize(IS_CORP_USER)
public class CorpUserController {

	@Autowired
	CorpUserFacade corpUserFacade;

	private static final String USER_VIEW_PERMISSION = START + VIEW_USERS + END;
	private static final String USER_ADD_EDIT_PERMISSION = START + ADD_EDIT_USERS + END;
	private static final String USER_GENERATE_OTP_PERMISSION = START + GENERATE_OTP + END;

	// @formatter:off
	@ApiOperation(value = "View a list of all users", notes = "This API will list all users"
			+ "<br>You can filter by **'employee code'** or **'employee name'** or **'location code(s)'** or **'region code(s)'** or **'primary role(s)'**<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">User Type:</span><br>" 
			+ "<ul>"
			+ "	<li>L1</li>"
			+ "	<li>L2</li>" 
			+ "	<li>L3</li>" 
			+ "	<li>REG</li>" 
			+ "	<li>ORG</li>"
			+ "</ul>")
	// @formatter:on
	@ApiPageable
	@GetMapping(value = "")
	public PagedRestResponse<List<EmployeeListDto>> listUsers(
			@ApiParam(value = "Provide if you want to search by 'employee code' or 'employee name'", required = false) @RequestParam(name = "searchField", required = false) @Size(max = 40, message = "max length of searchField is 40") @PatternCheck(regexp = RegExConstants.EMPCODE_OR_NAME) String searchField,
			@ApiParam(value = "Provide if you want to search employees of store(s)", required = false) @RequestParam(name = "locationCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX, nullCheck = false) String> locationCodes,
			@ApiParam(value = "Provide if you want to search employees of a region(s)", required = false) @RequestParam(name = "regionCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX, nullCheck = false) String> regionCodes,
			@ApiParam(value = "Provide if you want to search employees by 'primary role(s)' assigned", required = false) @RequestParam(name = "roleCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX, nullCheck = false) String> roleCodes,
			@ApiParam(value = "Provide if you want to search employees by 'user type'", allowableValues = "L1, L2, L3, REG, ORG", required = false) @RequestParam(name = "userType", required = false) @ValueOfEnum(enumClass = UserTypeEnum.class) String userType,
			@ApiParam(value = "Provide if you want to search employees by 'employee type'", allowableValues = "PERMANENT, TEMP", required = false) @RequestParam(name = "employeeType", required = false) @ValueOfEnum(enumClass = EmployeeTypeEnum.class) String employeeType,
			@ApiParam(value = "Provide if you want to search employees by 'is active'", required = false) @RequestParam(name = "isActive", required = false) Boolean isActive,
			@ApiIgnore Pageable pageable) {
		return corpUserFacade.listUsers(searchField, (userType != null) ? userType : null,
				(employeeType != null) ? employeeType : null, isActive, locationCodes, regionCodes, roleCodes,
				pageable);
	}

	@ApiOperation(value = "Get user details by 'employee code'", notes = "This API will list employee details based on **'employee code'**."
			+ " It also lists all primary and temporary role codes assigned to the employee")
	@GetMapping(value = "/{employeeCode}")
	@PreAuthorize(USER_VIEW_PERMISSION)
	public EmployeeDto getUserDetails(
			@ApiParam(name = "employeeCode", value = "'employee code' to get details", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode) {
		return corpUserFacade.getUserDetails(employeeCode);
	}

	// @formatter:off
	@ApiOperation(value = "Add a user", notes = "This API will create an **'organization user'** or **'regional user'** or **'Store Manager'** for stores<br><br>"
			+ "<b>UserType</b>"
			+ "<ul>"
			+ "	<li>L1</li>"
			+ "	<li>L2</li>"
			+ "	<li>L3</li>"
			+ "	<li>REG</li>"
			+ "	<li>ORG</li>"
			+ "</ul>"
			+ "<b><span style=\"font-size:14px;\">RoleType</span></b>"
			+ "<ul>"
			+ "	<li>BTQ</li>"
			+ "	<li>REG</li>"
			+ "	<li>CORP</li>"
			+ "</ul>"
			+ "<table style=\"width:250px;\">" 
			+ "  <tr>" 
			+ "    <td>L1, L2, L3</td>"  
			+ "    <td>-></td>" 
			+ "    <td>BTQ (Store User)</td>"  
			+ "  </tr>" 
			+ "  <tr>"  
			+ "    <td>REG</td>"  
			+ "    <td>-></td>"  
			+ "    <td>REG (Regional User)</td>"  
			+ "  </tr>" 
			+ "  <tr>"  
			+ "    <td>ORG</td>"  
			+ "    <td>-></td>"  
			+ "    <td>ORG (Organizational User)</td>"  
			+ "  </tr>\r\n" 
			+ "</table>\r\n<br>"  
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "	<li>If <b>'location code'</b> provided, Store user.</li>"
			+ "	<li>If <b>'region code'</b> provided, Regional user.</li>"
			+ "	<li>If both are empty, Organizational user.</li>"
			+ "</ul>" +
			"Address Format:" +
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
			+ "	<li>'birth date'</b>, <b>'temporary role code(s)'</b>, <b>'joning date'</b>, <b>'email id'</b> are optional.</li>"
			+ "	<li><b>'email id'</b>, <b>'mobile no'</b> should be unique.</li>"
			+ "	<li>Upon successful creation of user and user is in login active state, user will get OTP which he needs to verify to able to login to system.</li>"
			+ "</ul>")
	// @formatter:on
	@PostMapping(value = "")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void addUserDetails(
			@ApiParam(name = "body", value = "User object that needs to be created", required = true) @RequestBody @Valid CorporateAddUserDto addUserDto) {
		corpUserFacade.addUserDetails(addUserDto);
	}

	// @formatter:off
	@ApiOperation(value = "Update user details", notes = "This API will update a user for **'organization user'** or **'regional user'** or **'store user'**<br>"
			+ "Admin can't assign any store roles other than **SM** role for a store user<br><br>"+
			"Address Format:" +
			"<pre>" + 
			"{\r" + 
			"    \"data\":\r" + 
			"    {\r" + 
			"        \"line1\": \"DS Max Silicon\",\r" + 			
			"        \"line2\": \"RR Layout, RR Nagar\",\r" + 
			"        \"city\": \"Bangalore\",\r" + 
			"        \"state\": \"Karnataka\",\r" + 
			"        \"pincode\": \"751024\",\r" + 
			"        \"country\": \"India\"\r" + 
			"    },\r" + 
			"    \"type\": \"address\"\r" + 
			"}" + 
			"</pre>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "<li>If user's login is deactivated, upon activating login, user will be unlocked too if the user is locked.</li></ul>")
	// @formatter:on
	@PatchMapping(value = "/{employeeCode}")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void updateUserDetails(
			@ApiParam(name = "employeeCode", value = "'employee code' to edit", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode,
			@ApiParam(name = "body", value = "User object that needs to be edited", required = true) @RequestBody @Valid CorporateUpdateUserDto updateUserDto) {
		corpUserFacade.updateUserDetails(employeeCode, updateUserDto);
	}

	// @formatter:off
	@ApiOperation(value = "Resend OTP for an user", notes = "This API will resend OTP upon 'expiry time' is over or user didn't get mail.<br>"
			+ " It will be working as \"resend\" button.&nbsp;<button type=\"button\">RESEND OTP</button><br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">OTP Type:</span><br>" 
			+ "<ul>"
			+ "	<li>LOGIN_ACTIVATED</li>" 
			+ "	<li>INVITED</li>" 
			+ "	<li>FORGOT_PASSWORD</li>" 
			+ "	<li>MOBILENO_CHANGE</li></ul><br>"
			+ "<ul style=\"padding-left: 0;list-style-position: inside;\">"
			+ "<li>'requested value' is required for changing contact details (\"MOBILENO_CHANGE\").</li></ul>")
	// @formatter:on
	@PostMapping(value = "/generate-otps")
	@PreAuthorize(USER_GENERATE_OTP_PERMISSION)
	public void generateOtp(
			@ApiParam(name = "body", value = "OTP object that needs to be created", required = true) @RequestBody @Valid OtpRequestDetails otpRequestDetails) {
		corpUserFacade.sendOtp(otpRequestDetails.getEmpCode(), otpRequestDetails.getOtpType(),
				otpRequestDetails.getRequestedValue());
	}
	/**
	 * This method will return the list of Employee Location mapping details based
	 * on isActive.
	 * 
	 * @param employeeCode
	 * @param isActive
	 * @return ListResponse<EmployeeLocationDto>
	 */
	@ApiOperation(value = "API to get the list of Employee Location mapping details for a given employeeCode", notes = "This API returns the list of Employee location mapping details based on employeeCode")
	@GetMapping("/{employeeCode}/locations")
	@PreAuthorize(USER_VIEW_PERMISSION)
	public ListResponse<EmployeeLocationDto> listEmployeeLocationMapping(
			@ApiParam(name = "employeeCode", value = "employee code", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode) {

		return corpUserFacade.listEmployeeLocationMapping(employeeCode);
	}

	/**
	 * This method will create/remove mapping between employee and location.
	 * 
	 * @param employeeCode
	 * @param EmployeeLocationDto
	 */

	@ApiOperation(value = "Create/Remove Mapping between Employee Code and locations", notes = "This API creates/removes Mapping between RuleId and locations"
			+ "</br></br>It takes the following inputs:</br>"
			+ "</br></t> addLocations: locationCodes will be mapped to respected EmployeeCode</br>"

			+ "</br></t> removeLocations: will delete the locations mapped to EmployeeCode - hard delete</br>")
	@PatchMapping(value = "/{employeeCode}/locations")
	@PreAuthorize(USER_ADD_EDIT_PERMISSION)
	public void employeeLocationMapping(
			@ApiParam(name = "employeeCode", value = "employee code", required = true) @PathVariable("employeeCode") @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX, nullCheck = true) String employeeCode,
			@RequestBody @Valid EmployeeLocationUpdateDto employeeLocationUpdateDto) {
		corpUserFacade.employeeLocationMapping(employeeCode, employeeLocationUpdateDto);

	}
	
	

}
