/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.SalesAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.EmployeeSignatureDto;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.core.dto.RoleAclConfigDto;
import com.titan.poss.core.dto.RoleLiteDto;
import com.titan.poss.core.dto.UserLoginDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.engine.dto.UserSessionDetailsDto;
import com.titan.poss.engine.dto.request.AclElementRequestDto;
import com.titan.poss.engine.dto.request.AclUrlRequestDto;
import com.titan.poss.engine.dto.response.AclElementResponseDto;
import com.titan.poss.engine.dto.response.AclUrlResponseDto;
import com.titan.poss.engine.dto.response.EmployeeDto;
import com.titan.poss.engine.service.UserService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * User Controller class.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("userEngineController")
@RequestMapping(value = "engine/v2/users")
public class UserController {

	@Autowired
	private UserService userService;

	private static final String CASHIER_VIEW_PERMISSION = START + SalesAccessControls.CASHIER_SIGNATURE_VIEW + END;
	private static final String CASHIER_ADD_EDIT_PERMISSION = START + SalesAccessControls.CASHIER_SIGNATURE_ADD_EDIT
			+ END;

	// @formatter:off
	@ApiOperation(value = "View a list of users", notes = "This API will list users based on:"
			+ "<br> **'location code(s)'** and **'primary role(s)'**<br><br>")
	// @formatter:on
	@ApiPageable
	@GetMapping(value = "")
	public PagedRestResponse<List<LiteEmployeeListDto>> listUsers(
			@ApiParam(value = "Provide location(s) to search employees of store(s) if other than loggedin user's location", required = false) @RequestParam(name = "locationCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCodes,
			@ApiParam(value = "Provide if you want to search employees by 'primary role(s)' assigned", required = false) @RequestParam(name = "roleCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String> roleCodes,
			@ApiParam(value = "Provide if you want to get by 'employee code'", required = false) @RequestParam(name = "employeeCode", required = false) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode,
			@ApiIgnore Pageable pageable) {
		return userService.listUsers(locationCodes, roleCodes, pageable, employeeCode);
	}
	
	// @formatter:off
		@ApiOperation(value = "View a list of users", notes = "This API will list users based on:"
				+ "<br> **'employee code(s)'**<br> **'location code(s)'** and **'primary role(s)'**<br><br>")
		// @formatter:on
		@ApiPageable
		@GetMapping(value = "/get")
		public PagedRestResponse<List<LiteEmployeeListDto>> getUsersList(
				@ApiParam(value = "Provide location(s) to search employees of store(s) if other than loggedin user's location", required = false) @RequestParam(name = "locationCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCodes,
				@ApiParam(value = "Provide if you want to search employees by 'primary role(s)' assigned", required = false) @RequestParam(name = "roleCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String> roleCodes,
				@ApiParam(value = "Provide if you want to get by 'employee code'", required = false) @RequestParam(name = "employeeCodes", required = false) Set<@PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String> employeeCodes) {
			return userService.listUsers(locationCodes, roleCodes, null, employeeCodes.stream().toArray(String[] ::new));
		}

	@ApiOperation(value = "Get profile details", notes = "This API will give profile details of the logged in user<br><br>"
			+ "\"requestedMobileNo\" in response is the requested mobileNo to change (if not null)<br>"
			+ "\"forcePasswordChange\" in response is to check whether user needs to be forced to change password<br>")
	@GetMapping(value = "/profile")
	public EmployeeDto getProfileDetails() {
		return userService.getProfile();
	}

	@ApiOperation(value = "Get role code list", notes = "This API will give role allowed for logged in user including temporary one also.")
	@GetMapping(value = "/profile/roles")
	public ListResponse<String> getRoleList() {
		return userService.getLoggedinUserRoleList();
	}

	@ApiOperation(value = "Get all active roles", notes = "This API will give all active roles.")
	@GetMapping(value = "/roles")
	public ListResponse<RoleLiteDto> getAllRoleList() {
		return userService.getAllActiveRoleList();
	}

	@ApiOperation(value = "Get role details", notes = "This API will give role details based on role code")
	@GetMapping(value = "/roles/{roleCode}")
	public RoleLiteDto getRoleDetails(
			@ApiParam(name = "roleCode", value = "'roleCode' to get details", required = true) @PathVariable("roleCode") @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String roleCode) {
		return userService.getRole(roleCode);
	}
	
	@ApiOperation(value = "Get role related configuration to access application", notes = "This API will give role related configuration to access application")
	@GetMapping(value = "/roles/access/{roleCode}/{aclCode}")
	public RoleAclConfigDto getRoleConfigDetails(
			@ApiParam(name = "roleCode", value = "'roleCode' to get details", required = true) @PathVariable("roleCode") @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String roleCode,
			@ApiParam(name = "aclCode", value = "'aclCode' to get details", required = true) @PathVariable("aclCode") @PatternCheck(regexp = RegExConstants.ROLE_CODE_REGEX) String aclCode) {
		return userService.getEmpRoleConfig(roleCode,aclCode);
	}

	@ApiOperation(value = "Get all active sessions", notes = "Accessible only for "
			+ "<button type=\"button\" style=\"pointer-events: none;border-radius: 12px; padding: center;opacity: 0.8;\">STORE USER</button><br/>"
			+ "This API will give all active sessions of logged in user's location.<br/>"
			+ "It will not list logged in username or same hostname logged in users.")
	@GetMapping(value = "/active-sessions")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<UserSessionDetailsDto> getAllActiveUserSession() {
		return userService.getAllActiveUserSession();
	}

	@ApiOperation(value = "Get ACL url mapping list", notes = "This API will give ACL url mapping lists.")
	@PostMapping(value = "/urls/acls")
	public ListResponse<AclUrlResponseDto> getAclList(
			@RequestBody @Valid @ApiParam(name = "body", value = "URL details are required to get ACL lists", required = true) AclUrlRequestDto aclUrlRequestDto) {
		return userService.getAclList(aclUrlRequestDto);
	}

	@ApiOperation(value = "Get ACL element mapping list", notes = "This API will give ACL element mapping lists.")
	@PostMapping(value = "/urls/elements/acls")
	public ListResponse<AclElementResponseDto> getAclElementList(
			@RequestBody @Valid @ApiParam(name = "body", value = "URL details are required to get ACL element lists", required = true) AclElementRequestDto aclElementRequestDto) {
		return userService.getAclElementList(aclElementRequestDto);
	}

	@PreAuthorize(CASHIER_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Upload Digital Signature", notes = "This api will upload the digital signature in the table")
	@PostMapping("digital-signature/upload/{employeeCode}")
	public HashMap<String, Object> uploadFile(
			@ApiParam(value = "employeeCode") @PathVariable(value = "employeeCode") String employeeCode,
			@ApiParam(value = "digital Signature") @NotNull @RequestBody(required = false) String digitalSignature) {
		return userService.uploadFile(digitalSignature, employeeCode);
	}

	@PreAuthorize(CASHIER_VIEW_PERMISSION)
	@ApiOperation(value = "Get Employee Details", notes = "This API will give employee details.")
	@GetMapping(value = "/employee-signature-details")
	public EmployeeSignatureDto getEmployeeSignatureDetails(
			@ApiParam(value = "Provide 'employee code'", required = true) @RequestParam(name = "employeeCode", required = false) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode) {
		return userService.getEmployeeSignatureDetails(employeeCode);
	}

	@ApiOperation(value = "Get Employee Signature", notes = "This API will give employee signature.")
	@GetMapping(value = "/employee-signature")
	public Map<String, String> getEmployeeSignature(
			@ApiParam(value = "Provide 'employee code'", required = true) @RequestParam(name = "employeeCode", required = true) @PatternCheck(regexp = RegExConstants.EMPCODE_REGEX) String employeeCode) {
		return userService.getEmployeeSignature(employeeCode);
	}
	
	@ApiOperation(value = "Get all employee master data of all locations", notes = "Get all employee master data of all locations.")
	@PostMapping(value = "/employee-master")
	public List<EmployeeMasterDto> getAllEmployeeList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return userService.getAllEmployeeList(edcBankRequestDto);
	}
	
	@ApiOperation(value = "Get all login master data of all locations", notes = "Get all login master data of all locations.")
	@PostMapping(value = "/login-master")
	public List<UserLoginDto> getAllLoginMasterList(
			@RequestBody(required = false) @Validated EdcBankRequestDto edcBankRequestDto) {
		return userService.getAllLoginMasterList(edcBankRequestDto);
	}

}
