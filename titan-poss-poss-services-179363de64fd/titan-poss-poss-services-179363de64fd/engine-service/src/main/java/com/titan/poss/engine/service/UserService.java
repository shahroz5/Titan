/*  Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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
import com.titan.poss.user.dao.EmployeeDao;

/**
 * Service interface for User.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("EngineUserService")
public interface UserService {

	/**
	 * This method will return the list of employee details.
	 * 
	 * @param locationCodes
	 * @param roleCodes
	 * @param employeeCode
	 * @param pageable
	 * @return PagedRestResponse<List<LiteEmployeeListDto>>
	 */
	PagedRestResponse<List<LiteEmployeeListDto>> listUsers(Set<String> locationCodes, Set<String> roleCodes,
			Pageable pageable, String... employeeCode);

	/**
	 * Returns employee details with null check
	 * 
	 * @param employeeCode primary key of
	 * @return Employee employee object
	 */
	EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode);

	/**
	 * Convert DAO to DTO for Employee object
	 * 
	 * @param employee Employee object
	 * @param depth    to decide whether to show ACL list or not assigned to the
	 *                 employee
	 * @return
	 */
	EmployeeDto convertEmployeeToDto(EmployeeDao employee, Short depth);

	/**
	 * Get profile of logged in user
	 * 
	 * @return
	 */
	EmployeeDto getProfile();

	/**
	 * List roles for logged in user
	 * 
	 * @return
	 */
	ListResponse<String> getLoggedinUserRoleList();

	/**
	 * Get ACL URL mapping lists.
	 * 
	 * @param aclUrlRequestDto
	 * @return ListResponse<AclUrlResponseDto>
	 */
	ListResponse<AclUrlResponseDto> getAclList(AclUrlRequestDto aclUrlRequestDto);

	/**
	 * Get ACL element mapping lists
	 * 
	 * @param aclUrlRequestDto
	 * @return ListResponse<AclElementResponseDto>
	 */
	ListResponse<AclElementResponseDto> getAclElementList(AclElementRequestDto aclElementRequestDto);

	/**
	 * @return
	 */
	ListResponse<RoleLiteDto> getAllActiveRoleList();

	/**
	 * @return
	 */
	ListResponse<UserSessionDetailsDto> getAllActiveUserSession();

	HashMap<String, Object> uploadFile(String digitalSignature, String employeeCode);

	EmployeeSignatureDto getEmployeeSignatureDetails(String employeeCode);

	Map<String, String> getEmployeeSignature(String employeeCode);

	RoleLiteDto getRole(String roleCode);
	
	RoleAclConfigDto getEmpRoleConfig(String empCode, String aclCode);
	
	List<EmployeeMasterDto> getAllEmployeeList(EdcBankRequestDto edcBankRequestDto);
	
	List<UserLoginDto> getAllLoginMasterList(EdcBankRequestDto edcBankRequestDto);
	

}
