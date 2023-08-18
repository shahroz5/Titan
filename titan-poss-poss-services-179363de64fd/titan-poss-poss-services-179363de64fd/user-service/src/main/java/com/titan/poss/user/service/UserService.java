/*  
 * Copyright 2019. Titan Company Limited
 * 
 */
package com.titan.poss.user.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Pageable;

import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dto.SendNotificationDto;
import com.titan.poss.user.dto.constants.UserDocTypeEnum;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;
import com.titan.poss.user.dto.request.UserLocationUpdate;
import com.titan.poss.user.dto.response.EmpMobileReqDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface UserService {

	/**
	 * Validates JSON in user access management
	 * 
	 * @param jsonData
	 */
	void validateJson(JsonData jsonData);

	/**
	 * Returns list of employees list based on filter
	 * 
	 * @param searchField1  can contains 'employee code' or 'employee name'
	 * @param searchField2  can contains 'employee code' or 'employee name'
	 * @param userType      UserType Enum
	 * @param isActive      filter by active or deactivate roles if provided
	 * @param locationCodes filter by 'location codes' if provided
	 * @param regionCodes   filter by 'region codes' if provided
	 * @param roleCodes     filter by 'role codes' if provided
	 * @param pageable
	 * @return PagedRestResponse<List<EmployeeListDto>>
	 */
	PagedRestResponse<List<EmployeeListDto>> listUsersDetails(String searchField1, String searchField2, String userType,
			String employeeType, Boolean isActive, Set<String> locationCodes, Set<String> regionCodes,
			Set<String> roleCodes, String orgCode, Pageable pageable);

	/**
	 * Send OTP to the employee for a particular category it is requested
	 * 
	 * @param empCode      primary key of Employee
	 * @param otpTypeEnum  OTPType Enum as String
	 * @param reqValue     Requested Value needs to be update after validating OTP
	 * @param isReqByAdmin if the OTP request is sent by 'Admin' or 'Store Manager'
	 */
	SendNotificationDto sendOtp(EmployeeDao emp, String otpTypeEnum, String reqValue, Boolean isReqByAdmin);

	/**
	 * Returns employee details with null check
	 * 
	 * @param employeeCode primary key of
	 * @return Employee employee object
	 */
	EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode);

	/**
	 * Returns employee details with null check and location code check
	 * 
	 * @param employeeCode primary key of Employee
	 * @return Employee employee object
	 */
	EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode, String locationCode);

	/**
	 * Check if a store employee is under Admin like 'Store Manager'
	 * 
	 * @param empCode primary key of Employee
	 * @return Boolean
	 */
	Boolean isStoreEmployeePartOfCorp(String empCode);

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
	 * Add common fields in employee for store or corporate user creation flow
	 * 
	 * @param employee      Employee object
	 * @param address       Address of employee
	 * @param isLoginActive field to know if 'login access' is given
	 * @return
	 */
	EmployeeDao addEmployeWithCommonFieldAndLogIn(EmployeeDao employee, JsonData address, Boolean isLoginActive,
			Boolean hasLoginAccess);

	/**
	 * To check if employee exists on the provided employee code with duplicate-safe
	 * 
	 * @param empCode primary key of Employee
	 */
	void checkIfEmpExist(String empCode);

	/**
	 * To check if provided 'email id' or 'mobile no' provided are unique with
	 * duplicate-safe
	 * 
	 * @param emailId  'email id' field
	 * @param mobileNo 'mobile no' field
	 */
	//void checkEmailAndMobileConstraint(String emailId, String mobileNo);
	
	void checkEmailAndMobileAndEmployeeCodeConstraint(String emailId, String mobileNo,String employeeCode);

	/**
	 * @param employee      Employee object
	 * @param corpUpdateDto update object for employee
	 * @param address       address field
	 */
	List<SendNotificationDto> updateUserDetails(EmployeeDao employee, CorporateUpdateUserDto corpUpdateDto,
			JsonData address);

	/**
	 * To check if email provided is of valid as per business logic based on 'user
	 * type'
	 * 
	 * @param userType userType of the employee
	 * @param emailId  'email id' field
	 */
	void checkEmailLogic(String userType, String emailId);

	void setStoreRoles(EmployeeDao employeesDetail, Set<String> addTempRoleCodes, Set<String> removeTempRoleCodes,
			String primaryRole, Date startDate, Date expiryDate, Boolean isFirstTime, Boolean isByAdmin);

	void setCorpRoles(EmployeeDao employeesDetail, Set<String> addTempRoleCodes, Set<String> removeTempRoleCodes,
			String primaryRole, Date startDate, Date expiryDate, Boolean isFirstTime);

	/**
	 * Check if provided employee is in deactivated state, deactive-safe
	 * 
	 * @param emp employee object
	 */
	void checkIfEmployeeIsDeactivated(EmployeeDao emp);

	/**
	 * Update 'email id' or 'mobile no' of an employee
	 * 
	 * @param employeesDetail employee object
	 * @param emailId         'email id' field
	 * @param mobileNo        'mobile no' field
	 * 
	 * @return Employee employee object
	 */
	List<SendNotificationDto> checkEmailAndMobile(EmployeeDao employeesDetail, String emailId, String mobileNo);

	/**
	 * Check if value is unique for type provided
	 * 
	 * @param emailMobileEnum Email
	 * @param value           value to check if unique or not
	 * @return Boolean
	 */
	Boolean isUniqueEmailOrMobile(String emailMobileEnum, String value);

	/**
	 * Reset password of a logged in user
	 * 
	 * @param resetPasswordDto contains 'old password' & 'new password'
	 */
	void resetUserPassword(ResetPasswordDto resetPasswordDto);

	/**
	 * Verifying if provided OTP details are valid & update user details based on
	 * OTP type
	 * 
	 * @param otpPasswordDto OTP details to verify
	 */
	void otpUserPasswordVerify(OtpPasswordDto otpPasswordDto);

	/**
	 * Generating OTP for provided user na,e OTP type
	 * 
	 * @param otpPasswordDto OTP details to verify
	 */
	void generateOTPForgotPassword(OtpDetailsWoType otpPasswordDto);

	/**
	 * Trigger Mail or SMS after OTP generation
	 * 
	 */
	void triggerNotification(List<SendNotificationDto> sendList);

	/**
	 * @param EmployeeDao          employee object
	 * @param updateTempRoleCode   Temporary role of an user to update
	 * @param updateTempStartTime  updated start time of temporary role code
	 *                             provided
	 * @param updateTempExpiryTime updated end time of temporary role code provided
	 */
	void updateTempRole(EmployeeDao emp, String updateTempRoleCode, Date updateTempStartTime,
			Date updateTempExpiryTime);

	/**
	 * @param userDocType
	 * @return
	 */
	String getTempEmpCode(UserDocTypeEnum userDocType);

	/**
	 * Check if OTP is present for validation of mobile number
	 * 
	 * @return
	 */
	String checkOtpActiveForMobileNumberValidation(String userName);

	/**
	 * @param userStatus
	 */
	void updateUserStatus(String locationCode, UserLocationUpdate userStatus);

	/**
	 * @param emp
	 * @return
	 */
	String getAnyLocationCode(EmployeeDao emp);

	EmpMobileReqDto getRequestedMobileNumber();
	
	 Optional<EmployeeDao> getEmployeeDetailsById(String employeeCode);
	
	 void deleteEmployeeRoleMappingIfExists(String empCode);
	 Boolean checkifEmpCodeExist(String empCode);

}