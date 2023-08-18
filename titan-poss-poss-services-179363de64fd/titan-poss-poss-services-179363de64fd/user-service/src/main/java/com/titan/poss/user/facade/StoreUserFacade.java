/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dto.request.StoreAddTemporaryUserDto;
import com.titan.poss.user.dto.request.StoreAddUserDto;
import com.titan.poss.user.dto.request.StoreUpdateUserDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;

/**
 * Facade layer of store user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface StoreUserFacade {

	/**
	 * Returns list of employees list based on filter of a store
	 * 
	 * @param searchField can contains 'employee code' or 'employee name'
	 * @param isActive    filter by active or deactivate roles if provided
	 * @param roleCodes   filter by 'role codes' if provided
	 * @param pageable
	 * @return PagedRestResponse<List<EmployeeListDto>>
	 */
	public PagedRestResponse<List<EmployeeListDto>> listUsers(String searchField, String employeeType, Boolean isActive,
			Set<String> roleCodes, Pageable pageable);

	/**
	 * Get employee details by employeeCode of a store
	 * 
	 * @param employeeCode primary key of Employee
	 * @return EmployeeDto
	 */
	public EmployeeDto getUserDetailsDto(String employeeCode);

	/**
	 * Create a new user of a store
	 * 
	 * @param addUserDto DTO request containing user details
	 * @return void
	 */
	public void addUserDetails(StoreAddUserDto addUserDto);

	/**
	 * Update an existing employee based on employeeCode provided of a store
	 * 
	 * @param employeeCode   primary key of Employee
	 * @param updateUsereDto DTO request containing user details
	 */
	public void updateUserDetails(String employeeCode, StoreUpdateUserDto updateUsereDto);

	/**
	 * Send OTP to the employee for a particular category it is requested of a store
	 * 
	 * @param empCode       primary key of Employee
	 * @param otpTypeEnum   OTPType Enum as String
	 * @param reqValue      Requested Value needs to be update after validating OTP
	 * @param isReqByAdmimn if the request is sent by admin or system
	 */
	public void sendOtp(String empName, String otpTypeEnum, String reqValue, Boolean isReqByAdmimn);

	/**
	 * Create a new temporary user of a store
	 * 
	 * @param addTempUserDto DTO request containing temporary user details
	 * @return void
	 */
	public void addTemporaryEmployee(StoreAddTemporaryUserDto addTempUserDto);

}
