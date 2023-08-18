/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.facade.impl;

import static com.titan.poss.core.utils.CommonUtil.getOrgCode;
import static com.titan.poss.core.utils.CommonUtil.isAStoreUser;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.EmployeeLocationDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeLocationMappingDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.SendNotificationDto;
import com.titan.poss.user.dto.SyncDataThreadLocal;
import com.titan.poss.user.dto.constants.EmployeeTypeEnum;
import com.titan.poss.user.dto.request.CorporateAddUserDto;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.EmployeeLocationUpdateDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;
import com.titan.poss.user.facade.CorpUserFacade;
import com.titan.poss.user.repository.EmployeeLocationMappingRepository;
import com.titan.poss.user.repository.EmployeeRepositoryExt;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.repository.RoleRepositoryExt;
import com.titan.poss.user.service.LocationService;
import com.titan.poss.user.service.UserService;
import com.titan.poss.user.service.UserSyncDataService;
import com.titan.poss.core.dto.EmployeeLocationDto;

/**
 * Facade implementation layer of corporate user controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
@Service("userService")
public class CorpUserFacadeImpl implements CorpUserFacade {

	@Autowired
	UserService userService;

	@Autowired
	LocationService locationService;
	
	@Autowired
	LocationRoleConfigRepository locationRoleConfRepo;

	@Autowired
	private UserSyncDataService userSyncDataService;

	@Autowired
	private CorpUserFacadeImpl corpUserFacade;

	@Autowired
	private EmployeeRepositoryExt employeeRepository;

	@Autowired
	EmployeeLocationMappingRepository employeeLocationMappingRepository;

	@Autowired
	RoleRepositoryExt roleRepository;
	
	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleMappingRepository;

	private static final Boolean IS_BY_ADMIN = true;

	@Override
	public PagedRestResponse<List<EmployeeListDto>> listUsers(String searchField, String userType, String employeeType,
			Boolean isActive, Set<String> locationCodes, Set<String> regionCodes, Set<String> roleCodes,
			Pageable pageable) {
		return userService.listUsersDetails(searchField, searchField, userType, employeeType, isActive, locationCodes,
				regionCodes, roleCodes, getOrgCode(), pageable);
	}

	@Override
	public EmployeeDto getUserDetails(String employeeCode) {
		return userService.convertEmployeeToDto(getEmployeeDetailsWithErrorCheck(employeeCode), (short) 1);

	}

	@Override
	@Transactional
	public void addUserDetails(CorporateAddUserDto addUserDto) {
		userService.validateJson(addUserDto.getAddress());

		userService.checkIfEmpExist(addUserDto.getEmployeeCode());
		
		userService.checkEmailAndMobileAndEmployeeCodeConstraint(addUserDto.getEmailId(), addUserDto.getMobileNo(),addUserDto.getEmployeeCode());

		
		Optional<EmployeeDao> empl = employeeRepository.findByEmployeeCode(addUserDto.getEmployeeCode());
		String previousLocation = null;
		if(empl.isPresent() && BooleanUtils.isTrue(empl.get().getIsActive()) && isAStoreUser(empl.get().getUserType())) {
			previousLocation = empl.get().getLocationCode();
		}
	
	
		
		EmployeeDao emp = (EmployeeDao) MapperUtil.getDtoMapping(addUserDto, EmployeeDao.class);
		emp.setEmployeeType(EmployeeTypeEnum.PERMANENT.name());

		if (StringUtils.isNotBlank(addUserDto.getLocationCode())) {

			LocationCacheDto resLocation = locationService
					.getLocationDetailsFromLocationCode(addUserDto.getLocationCode(), true);

			emp.setBrandCode(resLocation.getBrandCode());
			emp.setUserType(resLocation.getOwnerTypeCode());
			emp.setLocationCode(addUserDto.getLocationCode());

		} else if (StringUtils.isNotBlank(addUserDto.getRegionCode())) { // call regional

			locationService.getRegionDetailsFromRegionCode(addUserDto.getRegionCode());

			emp.setRegionCode(addUserDto.getRegionCode());
			emp.setUserType(UserTypeEnum.REG.name());

		} else {

			emp.setUserType(UserTypeEnum.ORG.name());
		}

//		userService.checkEmailLogic(emp.getUserType(), addUserDto.getEmailId());
		
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
		if (isAStoreUser(resEmp.getUserType()))
			userService.setStoreRoles(resEmp, addUserDto.getTempRoleCodes(), null, addUserDto.getPrimaryRoleCode(),
					addUserDto.getStartDate(), addUserDto.getExpiryDate(), true, IS_BY_ADMIN);

		else
			userService.setCorpRoles(resEmp, addUserDto.getTempRoleCodes(), null, addUserDto.getPrimaryRoleCode(),
					addUserDto.getStartDate(), addUserDto.getExpiryDate(), false);

		if (addUserDto.getIsLoginActive()) {
			SendNotificationDto sendNotification = userService.sendOtp(resEmp, OtpTypeEnum.INVITED.name(), null, false);

			userService.triggerNotification(List.of(sendNotification));

		}
		if (emp.getUserType().equalsIgnoreCase(UserTypeEnum.REG.name())) {
			RoleDao role = roleRepository.findOneByRoleCode(addUserDto.getPrimaryRoleCode());
			if (BooleanUtils.isTrue(role.getIsLocationMappingRequired())) {
				if (CollectionUtil.isEmpty(addUserDto.getAddLocations())) {
					throw new ServiceException("Location is not added, kindly map the user to at least one location.",
							"ERR-UAM-077");
				} else {
					Set<String> addLocation = addUserDto.getAddLocations();
					saveEmployeeLocation(emp.getEmployeeCode(), addLocation, null, null);
				}
			}
		}
		// Data sync -> only for store users
		if (isAStoreUser(resEmp.getUserType())) {
			Map<String, SyncStagingDto> syncStaging = corpUserFacade.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.CORPUSER_ADD, addUserDto.getLocationCode(), true);
			userSyncDataService.publishUserMessages(syncStaging);
		}
		SyncDataThreadLocal.unsetSyncData();
	}

	/**
	 * @param Map<String,  SyncStagingDto>
	 * @param operation
	 * @param locationCode
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveSyncStaging(List<SyncData> syncDataList, String operation,
			String locationCode, boolean isPublishToEGHS) {
		List<String> destinations = new ArrayList<>();
		destinations.add(locationCode);
		return userSyncDataService.getUserSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
	}

	@Override
	@Transactional
	public void updateUserDetails(String employeeCode, CorporateUpdateUserDto updateUserDto) {
		if (updateUserDto.getAddress() != null)
			userService.validateJson(updateUserDto.getAddress());

		EmployeeDao emp = getEmployeeDetailsWithErrorCheck(employeeCode);
		
		
		// deactivated users not allowed
		userService.checkIfEmployeeIsDeactivated(emp);

		// set roles
		if (isAStoreUser(emp.getUserType()))
			userService.setStoreRoles(emp, updateUserDto.getAddTempRoleCodes(), updateUserDto.getRemoveTempRoleCodes(),
					updateUserDto.getPrimaryRoleCode(), updateUserDto.getStartDate(), updateUserDto.getExpiryDate(),
					false, IS_BY_ADMIN);

		else {
			if(emp.getUserType().equalsIgnoreCase(UserTypeEnum.REG.name())) {
				
				RoleDao role = roleRepository.findOneByRoleCode(updateUserDto.getPrimaryRoleCode());
				if(role==null) {
					return ;
				}
				if(role.getIsLocationMappingRequired()!=null && role.getIsLocationMappingRequired().equals(Boolean.FALSE) ) {
					
					employeeLocationMappingRepository.deleteAllByEmployeeEmployeeCode(employeeCode);
					employeeLocationMappingRepository.flush();
				}
				if(role.getIsLocationMappingRequired()!=null && role.getIsLocationMappingRequired().equals(Boolean.TRUE)) {
					List<EmployeeLocationMappingDao> employeeMappingAll =employeeLocationMappingRepository.findByEmployeeEmployeeCode(employeeCode);
					if(CollectionUtil.isEmpty(employeeMappingAll)) {
						throw new ServiceException("Location is not added, kindly map the user to at least one location.",
								"ERR-UAM-077");
					}
				}
				userService.setCorpRoles(emp, updateUserDto.getAddTempRoleCodes(), updateUserDto.getRemoveTempRoleCodes(),
						updateUserDto.getPrimaryRoleCode(), updateUserDto.getStartDate(), updateUserDto.getExpiryDate(),
						false);
			}
			userService.setCorpRoles(emp, updateUserDto.getAddTempRoleCodes(), updateUserDto.getRemoveTempRoleCodes(),
					updateUserDto.getPrimaryRoleCode(), updateUserDto.getStartDate(), updateUserDto.getExpiryDate(),
					false);
		}
		if (StringUtils.isNotBlank(updateUserDto.getUpdateTempRoleCode()))
			userService.updateTempRole(emp, updateUserDto.getUpdateTempRoleCode(),
					updateUserDto.getUpdateTempStartTime(), updateUserDto.getUpdateTempExpiryTime());

		List<SendNotificationDto> sendNotificationList = new ArrayList<>();
		sendNotificationList.addAll(userService.updateUserDetails(emp, updateUserDto, updateUserDto.getAddress()));
		sendNotificationList
				.addAll(userService.checkEmailAndMobile(emp, updateUserDto.getEmailId(), updateUserDto.getMobileNo()));

		userService.triggerNotification(sendNotificationList);

		// Data sync
		if (isAStoreUser(emp.getUserType())) {

			Map<String, SyncStagingDto> syncStaging = corpUserFacade.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.CORPUSER_UPDATE, emp.getLocationCode(), true);
			userSyncDataService.publishUserMessages(syncStaging);
		}
		SyncDataThreadLocal.unsetSyncData();

	}

	@Override
	@Transactional
	public void sendOtp(String empCode, String otpTypeEnum, String reqValue) {
		EmployeeDao emp = getEmployeeDetailsWithErrorCheck(empCode);

		// deactivated users not allowed
		userService.checkIfEmployeeIsDeactivated(emp);

		SendNotificationDto sendNotification = userService.sendOtp(emp, otpTypeEnum, reqValue, IS_BY_ADMIN);

		userService.triggerNotification(List.of(sendNotification));
	}

	/**
	 * Returns employee details with null check
	 * 
	 * @param employeeCode primary key of Employee
	 * @return Employee employee object
	 */
	private EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode) {
		return userService.getEmployeeDetailsWithErrorCheck(employeeCode);
	}

	@Override
	public void employeeLocationMapping(String employeeCode, EmployeeLocationUpdateDto employeeLocationUpdateDto) {
		if (!CollectionUtil.isEmpty(employeeLocationUpdateDto.getUpdateLocations()))
			saveEmployeeLocation(employeeCode, null, null, employeeLocationUpdateDto.getUpdateLocations());

		if (!CollectionUtil.isEmpty(employeeLocationUpdateDto.getRemoveLocations()))
			saveEmployeeLocation(employeeCode, null, employeeLocationUpdateDto.getRemoveLocations(), null);

	}

	@Transactional
	public void saveEmployeeLocation(String employeeCode, Set<String> addLocations, Set<String> removeLocations,
			Set<String> updateLocations) {
		
		if (!CollectionUtils.isEmpty(addLocations)) {
			saveLocationsToDb(addLocations, employeeCode);
		}

		if (!CollectionUtils.isEmpty(removeLocations)) {
			
			List<EmployeeLocationMappingDao> deleteMappingList = new ArrayList<>();
			List<EmployeeLocationMappingDao> employeeMappingAll =employeeLocationMappingRepository.findByEmployeeEmployeeCode(employeeCode);
			List<EmployeeLocationMappingDao> locationDaoList = employeeLocationMappingRepository
					.findByEmployeeEmployeeCodeAndLocationCodeIn(employeeCode, removeLocations);
			
			if(employeeMappingAll.size()==locationDaoList.size() ) {
				throw new ServiceException("User should be associated with at least one location.",
						"ERR-UAM-078");
			}
			locationDaoList.forEach(locationDao -> {
				deleteMappingList.add(locationDao);
			});
			employeeLocationMappingRepository.deleteAll(locationDaoList);
		}

		if (!CollectionUtils.isEmpty(updateLocations)) {
			List<EmployeeLocationMappingDao> employeeLocationList = employeeLocationMappingRepository
					.findByEmployeeEmployeeCode(employeeCode);
			employeeLocationMappingRepository.deleteAll(employeeLocationList);
			employeeLocationMappingRepository.flush();
			saveLocationsToDb(updateLocations, employeeCode);
		}
		if(CollectionUtils.isEmpty(addLocations) && CollectionUtils.isEmpty(removeLocations) && CollectionUtils.isEmpty(updateLocations)) {
			throw new ServiceException("Location is not added, kindly map the user to at least one location.",
					"ERR-UAM-077");
		}

	}

	private void saveLocationsToDb(Set<String> locationCodes, String employeeCode) {
		EmployeeDao employee = employeeRepository.getOneByEmployeeCode(employeeCode);
		List<EmployeeLocationMappingDao> employeeLocationList = new ArrayList<>();
		locationCodes.forEach(location -> {
			EmployeeLocationMappingDao employeeLocMapping = new EmployeeLocationMappingDao();
			employeeLocMapping.setEmployee(employee);
			employeeLocMapping.setLocationCode(location);
			employeeLocationList.add(employeeLocMapping);
		});
		employeeLocationMappingRepository.saveAll(employeeLocationList);
	}

	@Override
	public ListResponse<EmployeeLocationDto> listEmployeeLocationMapping(String employeeCode) {

		EmployeeDao emp = getEmployeeDetailsWithErrorCheck(employeeCode);

		EmployeeLocationMappingDao employeeLocDao = new EmployeeLocationMappingDao();
		employeeLocDao.setEmployee(emp);

		List<EmployeeLocationMappingDao> employeeLocList = employeeLocationMappingRepository
				.findByEmployeeEmployeeCode(employeeCode); 
		List<EmployeeLocationDto> employeeLocDtoList = new ArrayList<>();
		for (EmployeeLocationMappingDao location : employeeLocList) {
			EmployeeLocationDto employeeLocationDto = new EmployeeLocationDto();
			employeeLocationDto.setId(location.getId());
			employeeLocationDto.setEmployeeCode(employeeCode);
			employeeLocationDto.setLocationCode(location.getLocationCode());
			employeeLocDtoList.add(employeeLocationDto);
		}
		return new ListResponse<>(employeeLocDtoList);
	}



}
