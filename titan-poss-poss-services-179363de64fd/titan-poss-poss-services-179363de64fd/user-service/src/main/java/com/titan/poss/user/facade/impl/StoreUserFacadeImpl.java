/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.getAuthUser;
import static com.titan.poss.core.utils.CommonUtil.getLocationCode;
import static com.titan.poss.core.utils.CommonUtil.getLoggedInUserType;
import static com.titan.poss.core.utils.CommonUtil.getOrgCode;
import static com.titan.poss.core.utils.CommonUtil.isAStoreUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dto.SendNotificationDto;
import com.titan.poss.user.dto.SyncDataThreadLocal;
import com.titan.poss.user.dto.constants.EmployeeTypeEnum;
import com.titan.poss.user.dto.constants.UserDocTypeEnum;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.StoreAddTemporaryUserDto;
import com.titan.poss.user.dto.request.StoreAddUserDto;
import com.titan.poss.user.dto.request.StoreUpdateUserDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;
import com.titan.poss.user.facade.StoreUserFacade;
import com.titan.poss.user.repository.EmployeeRepositoryExt;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.service.UserService;
import com.titan.poss.user.service.UserSyncDataService;

/**
 * Facade implementation layer of store user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StoreUserFacadeImpl implements StoreUserFacade {

	@Autowired
	UserService userService;
	
	@Autowired
	private EmployeeRepositoryExt employeeRepository;
	
	@Autowired
	LocationRoleConfigRepository locationRoleConfRepo;
	
	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleMappingRepository;

	@Autowired
	private UserSyncDataService userSyncDataService;

	@Autowired
	private StoreUserFacadeImpl strUserFacadeImpl;

	private static final Boolean IS_BY_ADMIN = false;

	@Override
	public PagedRestResponse<List<EmployeeListDto>> listUsers(String searchField, String employeeType, Boolean isActive,
			Set<String> roleCodes, Pageable pageable) {
		// can set from logged in user token, but again query needs to search 2
		// parameters. so, excluding.
		return userService.listUsersDetails(searchField, searchField, null, employeeType, isActive,
				Set.of(getLocationCode()), null, roleCodes, getOrgCode(), pageable);
	}

	@Override
	public EmployeeDto getUserDetailsDto(String employeeCode) {
		return userService.convertEmployeeToDto(getStoreEmpDetailsWithErrorCheck(employeeCode), (short) 1);
	}

	@Override
	@Transactional
	public void updateUserDetails(String employeeCode, StoreUpdateUserDto updateUserDto) {
		if (updateUserDto.getAddress() != null)
			userService.validateJson(updateUserDto.getAddress());
		CorporateUpdateUserDto corpUpdateDto = (CorporateUpdateUserDto) MapperUtil.getDtoMapping(updateUserDto,
				CorporateUpdateUserDto.class);
		EmployeeDao emp = getStoreEmpDetailsWithCorpAccessCheck(employeeCode);

		// deactivated users not allowed
		userService.checkIfEmployeeIsDeactivated(emp);

		List<SendNotificationDto> sendNotificationList = new ArrayList<>();

		sendNotificationList.addAll(userService.updateUserDetails(emp, corpUpdateDto, updateUserDto.getAddress()));

		userService.setStoreRoles(emp, corpUpdateDto.getAddTempRoleCodes(), corpUpdateDto.getRemoveTempRoleCodes(),
				corpUpdateDto.getPrimaryRoleCode(), corpUpdateDto.getStartDate(), corpUpdateDto.getExpiryDate(), false,
				IS_BY_ADMIN);

		if (StringUtils.isNotBlank(updateUserDto.getUpdateTempRoleCode()))
			userService.updateTempRole(emp, updateUserDto.getUpdateTempRoleCode(),
					updateUserDto.getUpdateTempStartTime(), updateUserDto.getUpdateTempExpiryTime());

		sendNotificationList
				.addAll(userService.checkEmailAndMobile(emp, corpUpdateDto.getEmailId(), corpUpdateDto.getMobileNo()));

		userService.triggerNotification(sendNotificationList);
		// Data sync
		Map<String, SyncStagingDto> syncStaging = strUserFacadeImpl.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
				UserOperationCodes.STOREUSER_UPDATE, true);
		userSyncDataService.publishUserMessages(syncStaging);
		SyncDataThreadLocal.unsetSyncData();

	}

	@Override
	@Transactional
	public void sendOtp(String empCode, String otpTypeEnum, String reqValue, Boolean isReqByAdmimn) {
		EmployeeDao emp = getStoreEmpDetailsWithErrorCheck(empCode);

		// deactivated users not allowed
		userService.checkIfEmployeeIsDeactivated(emp);

		SendNotificationDto sendNotification = userService.sendOtp(emp, otpTypeEnum, reqValue, isReqByAdmimn);

		userService.triggerNotification(List.of(sendNotification));
	}

	/**
	 * Get an employee details of a store with
	 * 
	 * @param empCode primary key of Employee
	 * @return Employee
	 */
	public EmployeeDao getStoreEmpDetailsWithErrorCheck(String empCode) {
		return userService.getEmployeeDetailsWithErrorCheck(empCode, getLocationCode());
	}

	/**
	 * Get an employee details of a store with is updatable check
	 * 
	 * @param empCode primary key of Employee
	 * @return Employee
	 */
	public EmployeeDao getStoreEmpDetailsWithCorpAccessCheck(String empCode) {
		EmployeeDao emp = userService.getEmployeeDetailsWithErrorCheck(empCode, getLocationCode());
		if (userService.isStoreEmployeePartOfCorp(empCode))
			throw new ServiceException("SM can't update or assign roles employee which are accessible by corporate",
					"ERR-UAM-055");
		return emp;
	}

	@Override
	@Transactional
	public void addUserDetails(@Valid StoreAddUserDto addUserDto) {
		userService.validateJson(addUserDto.getAddress());

		userService.checkIfEmpExist(addUserDto.getEmployeeCode());
		
		userService.checkEmailAndMobileAndEmployeeCodeConstraint(addUserDto.getEmailId(), addUserDto.getMobileNo(), addUserDto.getEmployeeCode());

//		userService.checkEmailLogic(getLoggedInUserType(), addUserDto.getEmailId());
		
		Optional<EmployeeDao> empl = employeeRepository.findByEmployeeCode(addUserDto.getEmployeeCode());
		String previousLocation = null;
		if(empl.isPresent() && BooleanUtils.isTrue(empl.get().getIsActive()) && isAStoreUser(empl.get().getUserType())) {
			previousLocation = empl.get().getLocationCode();
		}

		EmployeeDao emp = (EmployeeDao) MapperUtil.getDtoMapping(addUserDto, EmployeeDao.class);

		emp.setBrandCode(CommonUtil.getAuthUser().getBrandCode());
		emp.setLocationCode(getLocationCode());
		emp.setUserType(getAuthUser().getLocType());
		emp.setEmployeeType(EmployeeTypeEnum.PERMANENT.name());

		EmployeeDao resEmp = userService.addEmployeWithCommonFieldAndLogIn(emp, addUserDto.getAddress(),
				addUserDto.getIsLoginActive(), addUserDto.getIsLoginActive());

		//method to delete roles if the employee exists previously
		if(userService.checkifEmpCodeExist(emp.getEmployeeCode()))
		{ 
			if(previousLocation != null) {
				//update role location config
				//query employee_role_mapping table to get prev roles --- List<> (list of roles)
				List<EmployeeRoleMappingDaoExt> ermd = employeeRoleMappingRepository.findByEmployeeEmployeeCode(emp.getEmployeeCode());
				if(!ermd.isEmpty())
				{
					
					 Set<LocationRoleConfigDao> lrcd = locationRoleConfRepo.findByLocationCodeAndRoleCodes(previousLocation, ermd.stream().map(erm->erm.getRole().getRoleCode()).collect(Collectors.toList()));
					//update location_role_config table based on roles and previousLocation
					 if(!CollectionUtils.isEmpty(lrcd)) {
					 lrcd.forEach(lrcDao->{
						 lrcDao.setAssignedUsers((short) (lrcDao.getAssignedUsers()-1));
					 });
					 locationRoleConfRepo.saveAll(lrcd);}
				}
				
			}
			 userService.deleteEmployeeRoleMappingIfExists(resEmp.getEmployeeCode());
		}
		userService.setStoreRoles(resEmp, addUserDto.getTempRoleCodes(), null, addUserDto.getPrimaryRoleCode(),
				addUserDto.getStartDate(), addUserDto.getExpiryDate(), true, IS_BY_ADMIN);

		if (addUserDto.getIsLoginActive()) {
			SendNotificationDto sendNotification = userService.sendOtp(resEmp, OtpTypeEnum.INVITED.name(), null, false);

			userService.triggerNotification(List.of(sendNotification));
		}
		// Data sync
		Map<String, SyncStagingDto> syncStaging = strUserFacadeImpl.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
				UserOperationCodes.STOREUSER_ADD, true);
		userSyncDataService.publishUserMessages(syncStaging);
		SyncDataThreadLocal.unsetSyncData();
	}

	/**
	 * @param syncDataList
	 * @param operation
	 * @return SyncStaging
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveSyncStaging(List<SyncData> syncDataList, String operation,
			boolean isPublishToEGHS) {
		List<String> destinations = new ArrayList<>();
		destinations.add(getLocationCode());
		return userSyncDataService.getUserSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
	}

	@Override
	@Transactional
	public void addTemporaryEmployee(@Valid StoreAddTemporaryUserDto addTempUserDto) {
		userService.validateJson(addTempUserDto.getAddress());
		
		userService.checkEmailAndMobileAndEmployeeCodeConstraint(addTempUserDto.getEmailId(), addTempUserDto.getMobileNo(),addTempUserDto.getEmployeeCode());

		userService.checkEmailLogic(getLoggedInUserType(), addTempUserDto.getEmailId());

		EmployeeDao emp = (EmployeeDao) MapperUtil.getDtoMapping(addTempUserDto, EmployeeDao.class);

		emp.setEmployeeCode(userService.getTempEmpCode(UserDocTypeEnum.TEMP_EMP_NO));

		emp.setBrandCode(CommonUtil.getAuthUser().getBrandCode());
		emp.setLocationCode(getLocationCode());
		emp.setUserType(getAuthUser().getLocType());
		emp.setEmployeeType(EmployeeTypeEnum.TEMP.name());

		EmployeeDao resEmp = userService.addEmployeWithCommonFieldAndLogIn(emp, addTempUserDto.getAddress(),
				addTempUserDto.getIsLoginActive(), addTempUserDto.getIsLoginActive());

		userService.setStoreRoles(resEmp, null, null, addTempUserDto.getPrimaryRoleCode(), null, null, true,
				IS_BY_ADMIN);

		if (addTempUserDto.getIsLoginActive()) {
			SendNotificationDto sendNotification = userService.sendOtp(resEmp, OtpTypeEnum.INVITED.name(), null, false);

			userService.triggerNotification(List.of(sendNotification));
		}
		// Data sync
		Map<String, SyncStagingDto> syncStaging = strUserFacadeImpl.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
				UserOperationCodes.STORETEMPORARYUSER_ADD, true);
		userSyncDataService.publishUserMessages(syncStaging);
		SyncDataThreadLocal.unsetSyncData();
	}
}
