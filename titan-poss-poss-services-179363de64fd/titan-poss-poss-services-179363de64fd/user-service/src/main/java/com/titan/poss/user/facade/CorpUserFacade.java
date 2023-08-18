/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.user.dto.request.CorporateAddUserDto;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.EmployeeLocationUpdateDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;

/**
 * Facade layer of corporate user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CorpUserFacade {

	/**
	 * Returns list of employees list based on filter
	 * 
	 * @param searchField   can contains 'employee code' or 'employee name'
	 * @param userType      UserType Enum
	 * @param employeeType  employeeType Enum
	 * @param isActive      filter by active or deactivate roles if provided
	 * @param locationCodes filter by 'location codes' if provided
	 * @param regionCodes   filter by 'region codes' if provided
	 * @param roleCodes     filter by 'role codes' if provided
	 * @param pageable
	 * @return PagedRestResponse<List<EmployeeListDto>>
	 */
	public PagedRestResponse<List<EmployeeListDto>> listUsers(String searchField, String userType, String employeeType,
			Boolean isActive, Set<String> locationCodes, Set<String> regionCodes, Set<String> roleCodes,
			Pageable pageable);

	/**
	 * Get employee details by employeeCode
	 * 
	 * @param employeeCode primary key of Employee
	 * @return EmployeeDto
	 */
	public EmployeeDto getUserDetails(String employeeCode);

	/**
	 * Create a new user
	 * 
	 * @param addCorpDto DTO request containing user details
	 * @return void
	 */
	public void addUserDetails(CorporateAddUserDto addUserDto);

	/**
	 * Update an existing employee based on employeeCode provided
	 * 
	 * @param employeeCode  primary key of Employee
	 * @param corpUpdateDto DTO request containing user details
	 */
	public void updateUserDetails(String employeeCode, CorporateUpdateUserDto updateUsereDto);

	/**
	 * Send OTP to the employee for a particular category it is requested
	 * 
	 * @param empCode     primary key of Employee
	 * @param otpTypeEnum OTPType Enum as String
	 * @param reqValue    Requested Value needs to be update after validating OTP
	 */
	public void sendOtp(String empCode, String otpTypeEnum, String reqValue);

	/**
	 * This method will return the Employee details wrt to a location.
	 * 
	 * @param employeeCode
	 * 
	 * @return EmployeeLocationDto
	 */
	ListResponse<EmployeeLocationDto> listEmployeeLocationMapping(String employeeCode);

	/**
	 * This method will create/remove mapping between Employee and location.
	 * 
	 * @param employeeCode
	 * @param EmployeeLocationDto
	 * @return ruleLocationDto
	 */
	public void employeeLocationMapping(String employeeCode, EmployeeLocationUpdateDto employeeLocationUpdateDto);
	
	
}
