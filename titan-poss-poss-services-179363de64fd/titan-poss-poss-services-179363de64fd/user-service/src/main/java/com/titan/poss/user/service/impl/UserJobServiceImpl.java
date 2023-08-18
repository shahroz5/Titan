/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.auth.domain.OAuthToken;
import com.titan.poss.core.domain.constant.JobProcessStatusEnum;
import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.ClientLoginDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.VendorDto;
import com.titan.poss.core.dto.VendorUpdateDto;
import com.titan.poss.core.enums.SchedulerCodeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.service.clients.AuthServiceClient;
import com.titan.poss.core.service.clients.DataSyncServiceClient;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.TokenValidatorUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dao.SyncStaging;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.dao.UserOtpDao;
import com.titan.poss.user.dto.EmployeeRoleMappingSyncDtoExt;
import com.titan.poss.user.dto.response.EmployeeLocationDetails;
import com.titan.poss.user.dto.response.PublishResponse;
import com.titan.poss.user.dto.sync.EmployeeSyncDto;
import com.titan.poss.user.dto.sync.UserLoginSyncDto;
import com.titan.poss.user.repository.EmployeeRepositoryExt;
import com.titan.poss.user.repository.EmployeeRoleMappingRepository;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.repository.UserLoginRepositoryExt;
import com.titan.poss.user.repository.UserOtpRepository;
import com.titan.poss.user.repository.UserSyncStagingRepository;
import com.titan.poss.user.service.UserJobService;

import feign.Response;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserSchedulerService")
public class UserJobServiceImpl implements UserJobService {

	@Autowired
	@Qualifier("UserEmployeeRepositoryExt")
	EmployeeRepositoryExt employeeRepo;

	@Autowired
	EmployeeRoleMappingRepository employeeRoleMappingReo;

	@Autowired
	LocationRoleConfigRepository locationRoleConfigRepo;

	@Autowired
	@Qualifier("UserUserLoginRepositoryExt")
	UserLoginRepositoryExt userRepo;

	@Autowired
	UserOtpRepository userOtpRepo;

	@Autowired
	private DataSyncServiceClient dataSyncServiceClient;

	@Autowired
	private IntegrationServiceClient integrationServiceClient;

	@Autowired
	private AuthServiceClient authServiceClient;

	@Autowired
	private UserSyncStagingRepository userSyncStagingRepository;

	@Autowired
	private UserSyncDataServiceImpl userSyncDataSync;

	@Autowired
	private UserJobServiceImpl userJobService;

	@Value("${poss.auth.jwt-secret}")
	private String jwtSecret;

	@Value("${datasync.enable}")
	private boolean isEnabled;

	private String authorizationToken;

	@Value("${poss.user.password-expiry-in-days:90}")
	private short passwordExpiryInDays;

	@Value("${poss.user.last-login-days-range:90}")
	private short lastLoginDayRange;

	public static final String SYSTEM = "System";

	private static final String ERR_CORE_044 = "ERR-CORE-044";

	private static final Logger LOGGER = LoggerFactory.getLogger(UserJobServiceImpl.class);

	@Transactional
	public PublishResponse updateAllIsActiveTransactional() {
		List<EmployeeLocationDetails> employees = employeeRepo
				.listAllEmpEligibleForDeactivate(CalendarUtils.getCurrentDate());
		List<EmployeeLocationDetails> employeesCodesOfStore = employees.stream()
				.filter(empCode -> StringUtils.isNotBlank(empCode.getLocationCode())).collect(Collectors.toList());
		List<String> employeeCodes = employees.stream().map(EmployeeLocationDetails::getEmployeeCode)
				.collect(Collectors.toList());
		if (!employeesCodesOfStore.isEmpty()) {
			List<String> employeeCodesOfStore = employeesCodesOfStore.stream()
					.map(EmployeeLocationDetails::getEmployeeCode).collect(Collectors.toList());
			List<LocationRoleConfigDao> locRoleConfToUpdate = locationRoleConfigRepo
					.listLocationToUpdateByEmp(employeeCodesOfStore);
			// keep all lrc value from a list, for duplicate count no of duplicate for
			// (locationCode, roleCode) and add that no to final unique (locationCode,
			// roleCode)
			updateLrcAssignedCount(locRoleConfToUpdate);

		}
		List<UserLoginDao> userLoginList = new ArrayList<>();
		List<EmployeeDao> employeesToDeactivate = new ArrayList<>();
		List<EmployeeRoleMappingDao> employeeRoleMappingList = new ArrayList<>();
		if (!employees.isEmpty()) {
			// delete from employee role mapping
			employeeRoleMappingList = employeeRoleMappingReo.findByEmployeeEmployeeCodeIn(employeeCodes);
			employeeRoleMappingReo.deleteAll(employeeRoleMappingList);
			employeeRoleMappingList.forEach(erm -> erm.setSyncTime(new Date().getTime()));
			// deactivate employees
			employeesToDeactivate = employeeRepo
					.findByEmployeeCodeInOrderByEmployeeCodeAsc(employeeCodes.stream().collect(Collectors.toSet()));
			employeesToDeactivate.forEach(employee -> {
				employee.setIsActive(false);
				employee.setLastModifiedBy(SYSTEM);
				employee.setSrcSyncId(employee.getSrcSyncId() + 1);
			});
			employeesToDeactivate = employeeRepo.saveAll(employeesToDeactivate);

			// deactivate isLoginActive in UserLogin
			List<UserLoginDao> userLoginsToDeactivte = userRepo.findByEmployeeEmployeeCodeIn(employeeCodes);
			userLoginList = deactivateUserLoginList(userLoginsToDeactivte);

			LOGGER.info("No of employee got deactivated due to resignation date passed :- {}",
					employeesToDeactivate.size());
		}
		List<SyncStagingDto> syncStagingDtoList = syncStagging(employeesCodesOfStore, employeesToDeactivate,
				employeeRoleMappingList, userLoginList, UserOperationCodes.EMP_RESIGNATION);
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.USER_RESET_PASSWORD.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		PublishResponse publishResponse = new PublishResponse();
		publishResponse.setApiResponse(response);
		publishResponse.setSyncStagingDtoList(syncStagingDtoList);
		return publishResponse;
	}

	public List<SyncStagingDto> syncStagging(List<EmployeeLocationDetails> employeesCodesOfStore,
			List<EmployeeDao> employeesToDeactivate, List<EmployeeRoleMappingDao> employeeRoleMappingList,
			List<UserLoginDao> userLoginList, String operation) {
		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		employeesCodesOfStore.forEach(emp -> {
			List<String> destinations = new ArrayList<>();
			destinations.add(emp.getLocationCode());
			List<SyncData> syncDataList = new ArrayList<>();
			if (employeesToDeactivate!=null && !employeesToDeactivate.isEmpty()) {
				List<EmployeeDao> empLoc = employeesToDeactivate.stream()
						.filter(employess -> emp.getEmployeeCode().equals(employess.getEmployeeCode()))
						.collect(Collectors.toList());
				if (!empLoc.isEmpty()) {
					List<EmployeeSyncDto> employeeSync = empLoc.stream().map(EmployeeSyncDto::new)
							.collect(Collectors.toList());
					syncDataList.add(DataSyncUtil.createSyncData(employeeSync, 0));
				}
			}
			if (employeeRoleMappingList!=null && !employeeRoleMappingList.isEmpty()) {
				List<EmployeeRoleMappingDao> empRoleMappingList = employeeRoleMappingList.stream()
						.filter(erm -> emp.getEmployeeCode().equals(erm.getEmployee().getEmployeeCode()))
						.collect(Collectors.toList());
				if (!empRoleMappingList.isEmpty()) {
					List<EmployeeRoleMappingSyncDtoExt> employeeLocSync = empRoleMappingList.stream()
							.map(EmployeeRoleMappingSyncDtoExt::new).collect(Collectors.toList());
					syncDataList.add(DataSyncUtil.createSyncData(employeeLocSync, 3));
				}
			}
			if (userLoginList!=null && !userLoginList.isEmpty()) {
				List<UserLoginDao> userLogList = userLoginList.stream()
						.filter(ul -> emp.getEmployeeCode().equals(ul.getEmployee().getEmployeeCode()))
						.collect(Collectors.toList());
				if (!userLogList.isEmpty()) {
					List<UserLoginSyncDto> userLoginSync = userLogList.stream()
							.map(UserLoginSyncDto::new).collect(Collectors.toList());
					syncDataList.add(DataSyncUtil.createSyncData(userLoginSync, 1));
				}
			}
			SyncStagingDto userSyncDto = new SyncStagingDto();
			MessageRequest userMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
					MessageType.GENERAL.toString(), DestinationType.SELECTIVE.toString());
			userSyncDto.setMessageRequest(userMsgRequest);
			String userMsg = MapperUtil.getJsonString(userMsgRequest);
			SyncStaging userSyncStaging = new SyncStaging();
			userSyncStaging.setMessage(userMsg);
			userSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			userSyncStaging = userSyncStagingRepository.save(userSyncStaging);
			userSyncDto.setId(userSyncStaging.getId());
			syncDtoList.add(userSyncDto);
		});
		return syncDtoList;

	}

	public List<UserLoginDao> deactivateUserLoginList(List<UserLoginDao> usersToDeactivate) {
		usersToDeactivate.forEach(user -> {
			user.setIsLoginActive(false);
			user.setLastModifiedBy(SYSTEM);
			user.setSrcSyncId(user.getSrcSyncId() + 1);
		});
		return userRepo.saveAll(usersToDeactivate);
	}

	public void updateLrcAssignedCount(List<LocationRoleConfigDao> locationRoleConfigToUpdate) {

		Map<Integer, LocationRoleConfigDao> updateAssignMap = new HashMap<>();
		locationRoleConfigToUpdate.forEach(lrc -> {
			if (updateAssignMap.containsKey(lrc.getId())) {
				LocationRoleConfigDao particularLrc = updateAssignMap.get(lrc.getId());
				updateAssignedCount(updateAssignMap, lrc, particularLrc);
			} else {
				LocationRoleConfigDao particularLrc = lrc;
				updateAssignedCount(updateAssignMap, lrc, particularLrc);
			}

		});
		locationRoleConfigToUpdate.clear();
		locationRoleConfigToUpdate = updateAssignMap.values().stream().collect(Collectors.toList());
		locationRoleConfigRepo.saveAll(locationRoleConfigToUpdate);
	}

	private void updateAssignedCount(Map<Integer, LocationRoleConfigDao> updateAssignMap, LocationRoleConfigDao lrc,
			LocationRoleConfigDao particularLrc) {
		particularLrc.setAssignedUsers((short) (particularLrc.getAssignedUsers() - 1));
		updateAssignMap.put(lrc.getId(), particularLrc);
	}

	@Transactional
	public PublishResponse deactivateLoginUserBasedOnPasswordExpiryDateTransactional() {
		Date date = setNPastNegativeDays(passwordExpiryInDays);

		// list users based on password change date
		List<UserLoginDao> usersToDeactivate = userRepo
				.findByIsLoginActiveTrueAndPasswordChangedDateLessThanEqualAndEmployeeUserTypeNot(date, "API");
		usersToDeactivate = deactivateUserLoginList(usersToDeactivate);

		LOGGER.info("No of employee got login deactivated due to password expiry time check :- {}",
				usersToDeactivate.size());
		List<EmployeeLocationDetails> employeesCodesOfStore = new ArrayList<>();
		usersToDeactivate.forEach(
				user -> employeesCodesOfStore.add(new EmployeeLocationDetails(user.getEmployee().getEmployeeCode(),
						user.getEmployee().getLocationCode())));
		List<SyncStagingDto> syncDto = syncStagging(employeesCodesOfStore, null, null, usersToDeactivate,
				UserOperationCodes.USER_PASWORD);
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.USER_DEACTIVATE_PASSWORD.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		PublishResponse apiResponse = new PublishResponse();
		apiResponse.setApiResponse(response);
		apiResponse.setSyncStagingDtoList(syncDto);
		return apiResponse;
	}

	@Transactional
	public PublishResponse deactivateLoginUserBasedOnLastLoginDateTransactional() {
		Date date = setNPastNegativeDays(lastLoginDayRange);
		LOGGER.info("Login Date to check before  :- {}", date);

		// deactivate users based on last login date
		List<UserLoginDao> usersToDeactivate = userRepo
				.findByIsLoginActiveTrueAndLastLoginDateLessThanEqualAndEmployeeUserTypeNot(date, "API");
		usersToDeactivate = deactivateUserLoginList(usersToDeactivate);

		LOGGER.info("No of employee got login deactivated due to password expiry time :- {}", usersToDeactivate.size());
		SchedulerResponseDto response = new SchedulerResponseDto();
		List<EmployeeLocationDetails> employeesCodesOfStore = new ArrayList<>();
		usersToDeactivate.forEach(
				user -> employeesCodesOfStore.add(new EmployeeLocationDetails(user.getEmployee().getEmployeeCode(),
						user.getEmployee().getLocationCode())));
		List<SyncStagingDto> syncDto = syncStagging(employeesCodesOfStore, null, null, usersToDeactivate,
				UserOperationCodes.USER_DATE);
		response.setCode(SchedulerCodeEnum.USER_DEACTIVATE_LOGIN.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		PublishResponse apiResponse = new PublishResponse();
		apiResponse.setApiResponse(response);
		apiResponse.setSyncStagingDtoList(syncDto);
		return apiResponse;
	}

	private Date setNPastNegativeDays(short days) {
		Calendar cal = Calendar.getInstance();
		days *= -1;
		cal.add(Calendar.DATE, days);
		return cal.getTime();
	}

	@Transactional
	public PublishResponse removeTempRolesTransactional() {

		List<LocationRoleConfigDao> locationRoleConfigToUpdate = locationRoleConfigRepo
				.listLocationToUpdate(CalendarUtils.getCurrentDate());
		// keep all lrc value from a list, for duplicate count no of duplicate for
		// (locationCode, roleCode) and add that no to final unique (locationCode,
		// roleCode)
		// can try list with ordered unique key, will be fast
		updateLrcAssignedCount(locationRoleConfigToUpdate);

		// delete employee role mapping
		List<EmployeeRoleMappingDao> employeeRoleMappingList = employeeRoleMappingReo
				.findByIsPrimaryFalseAndExpiryTimeLessThan(CalendarUtils.getCurrentDate());
		employeeRoleMappingReo.deleteAll(employeeRoleMappingList);
		List<EmployeeLocationDetails> employeesCodesOfStore = new ArrayList<>();
		employeeRoleMappingList.forEach(emp -> {
			emp.setSyncTime(new Date().getTime());
			employeesCodesOfStore.add(new EmployeeLocationDetails(emp.getEmployee().getEmployeeCode(),
					emp.getEmployee().getLocationCode()));
		});
		List<SyncStagingDto> syncDto = syncStagging(employeesCodesOfStore, null, employeeRoleMappingList, null,
				UserOperationCodes.USER_TEMP);
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.USER_REMOVE_TEMP_ROLES.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		PublishResponse apiResponse = new PublishResponse();
		apiResponse.setApiResponse(response);
		apiResponse.setSyncStagingDtoList(syncDto);
		return apiResponse;
	}

	@Transactional
	public PublishResponse assignMobileNoAfterExpiryTimeTransactional() {

		List<UserOtpDao> userOtps = userOtpRepo.findByIsActiveAndOtpTypeAndExpiryDateLessThanEqualOrderByEmployeeAsc(
				true, OtpTypeEnum.MOBILENO_CHANGE.name(), CalendarUtils.getCurrentDate());
		Set<String> mobileNos = userOtps.stream().map(UserOtpDao::getReqValue).collect(Collectors.toSet());
		PublishResponse publishResonse = new PublishResponse();
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.USER_ASSIGN_MOBILE.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		if (userOtps.isEmpty()) {
			publishResonse.setApiResponse(response);
			return publishResonse;
		}
		// list all user OTP invalid, as those mobile no already used by someone else
		List<UserOtpDao> userOtpsReqAlreadyassigned = userOtpRepo.listUserOtpByMobileNoIn(mobileNos);

		List<UserOtpDao> userOtpToDeactivate = new ArrayList<>(userOtps);

		if (!userOtpsReqAlreadyassigned.isEmpty()) {
			List<String> empName = userOtpsReqAlreadyassigned.stream()
					.map(userOtp -> userOtp.getEmployee().getEmployeeCode()).collect(Collectors.toList());

			String eName = Arrays.toString(empName.toArray());
			LOGGER.error("Some employess requested mobile no is already assigned to others.\nEmployee codes:- {}",
					eName);

			// remove those from future changes
			userOtps.removeAll(userOtpsReqAlreadyassigned);
		}
		Set<String> employeeCodes = userOtps.stream().map(userOtp -> userOtp.getEmployee().getEmployeeCode())
				.collect(Collectors.toSet());
		List<EmployeeDao> employees = employeeRepo.findByEmployeeCodeInOrderByEmployeeCodeAsc(employeeCodes);

		if (employees.size() < userOtps.size())
			throw new ServiceException("Some employee records not found based on fetched employees from user-otp",
					"ERR-UAM-073");
		for (int i = 0; i < userOtps.size(); i++) {
			EmployeeDao emp = employees.get(i);
			UserOtpDao userOtp = userOtps.get(i);
			emp.setMobileNo(userOtp.getReqValue());
			emp.setLastModifiedBy(SYSTEM);
			emp.setSrcSyncId(emp.getSrcSyncId() + 1);
			employees.set(i, emp);
		}

		employees = employeeRepo.saveAll(employees);

		// lock users
		List<UserLoginDao> usersToBlock = userRepo
				.findByEmployeeEmployeeCodeIn(employeeCodes.stream().collect(Collectors.toList()));
		usersToBlock.forEach(user -> {
			user.setIsLocked(true);
			user.setFailedAttempts(0);
			user.setLastModifiedBy(SYSTEM);
			user.setSrcSyncId(user.getSrcSyncId() + 1);
		});
		usersToBlock = userRepo.saveAll(usersToBlock);

		// deactivate user OTPs'
		userOtpToDeactivate.forEach(userOtp -> {
			userOtp.setIsActive(false);
			userOtp.setLastModifiedBy(SYSTEM);
		});
		userOtpRepo.saveAll(userOtpToDeactivate);
		List<EmployeeLocationDetails> employeesCodesOfStore = employees.stream()
				.map(emp -> new EmployeeLocationDetails(emp.getEmployeeCode(), emp.getLocationCode()))
				.collect(Collectors.toList());
		List<SyncStagingDto> syncStagingDtoList = syncStagging(employeesCodesOfStore, employees, null, usersToBlock,
				UserOperationCodes.MOBILE_EXPIRE);
		publishResonse.setApiResponse(response);
		publishResonse.setSyncStagingDtoList(syncStagingDtoList);
		return publishResonse;
	}

	@Override
	public SchedulerResponseDto publishToDataSync() {
		try {
			if (StringUtils.isEmpty(authorizationToken) || !TokenValidatorUtil.isValidExpVal(authorizationToken)
					|| !TokenValidatorUtil.isValidJWT(authorizationToken, jwtSecret)) {
				authorizationToken = getToken();
			}
			List<SyncStaging> syncStagingList = new ArrayList<>();
			int i = -1;
			do {
				Pageable pageable = PageRequest.of(++i, 100, Sort.by("createdDate").ascending());
				syncStagingList.clear();
				syncStagingList = userSyncStagingRepository.findSyncStagingDetails(pageable);
				if (!syncStagingList.isEmpty()) {
					List<String> syncIdList = new ArrayList<>();
					syncStagingList.forEach(syncStaging -> {
						Response response = dataSyncServiceClient.publishWithToken("Bearer " + authorizationToken,
								MapperUtil.getObjectMapperInstance().convertValue(
										MapperUtil.getJsonFromString(syncStaging.getMessage()), MessageRequest.class));
						if (response.status() == 200) {
							syncIdList.add(syncStaging.getId());
						}
					});
					if (!syncIdList.isEmpty())
						userSyncStagingRepository.updateSyncStatus(syncIdList);
				}
			} while (!syncStagingList.isEmpty());
			userSyncStagingRepository.deletePublishedMessage();
		} catch (Exception e) {
			throw new ServiceException(e.getMessage(), ERR_CORE_044);
		}
		SchedulerResponseDto response = new SchedulerResponseDto();
		response.setCode(SchedulerCodeEnum.USER_DATA_SYNC.toString());
		response.setStatus(JobProcessStatusEnum.COMPLETED.toString());
		return response;
	}

	private String getToken() {
		VendorDto vendorDto = integrationServiceClient.getVendor(VendorCodeEnum.POSS_TITAN.toString());
		authorizationToken = getAuthHeaderToken(vendorDto);
		return authorizationToken;
	}

	private String getAuthHeaderToken(VendorDto vendorDto) {
		List<String> credentials = TokenValidatorUtil
				.verifyDetails(MapperUtil.getJsonString(vendorDto.getVendorDetails()));
		String userName = credentials.get(0);
		String password = credentials.get(1);
		String token = credentials.get(2);
		String exp = credentials.get(3);
		boolean isNewTokenReq = false;

		if (!TokenValidatorUtil.isValidExpVal(exp) || !TokenValidatorUtil.isValidJWT(token, jwtSecret)) {
			isNewTokenReq = true;
		}
		if (isNewTokenReq) {
			OAuthToken oauthToken = null;
			ClientLoginDto clientLogin = new ClientLoginDto(userName, password);
			oauthToken = authServiceClient.generateToken(clientLogin);
			token = oauthToken.getAccessToken();
			exp = oauthToken.getExpiresAt();

			Object obj = MapperUtil.getJsonFromString(MapperUtil.getJsonString(vendorDto.getVendorDetails().getData()));
			@SuppressWarnings("unchecked")
			Map<String, String> vendorDetailsMap = (Map<String, String>) obj;
			vendorDetailsMap.put("token", token);
			vendorDetailsMap.put("exp", exp);
			Map<String, Object> vendorMap = new LinkedHashMap<>();
			vendorMap.put("type", "TOKEN");
			vendorMap.put("data", vendorDetailsMap);
			VendorUpdateDto vendorUpdateDto = (VendorUpdateDto) MapperUtil.getObjectMapping(vendorDto,
					new VendorUpdateDto());
			vendorUpdateDto.setVendorDetails(
					MapperUtil.getObjectMapperInstance().convertValue(vendorMap, Object.class));
			integrationServiceClient.updateVendor(vendorDto.getVendorCode(), vendorUpdateDto);
		}
		return token;
	}

	@Override
	public SchedulerResponseDto updateAllIsActive() {
		PublishResponse response = userJobService.updateAllIsActiveTransactional();
		return publish(response);
	}

	@Override
	public SchedulerResponseDto deactivateLoginUserBasedOnPasswordExpiryDate() {
		PublishResponse response = userJobService.deactivateLoginUserBasedOnPasswordExpiryDateTransactional();
		return publish(response);
	}

	@Override
	public SchedulerResponseDto deactivateLoginUserBasedOnLastLoginDate() {
		PublishResponse response = userJobService.deactivateLoginUserBasedOnLastLoginDateTransactional();
		return publish(response);
	}

	@Override
	public SchedulerResponseDto removeTempRoles() {
		PublishResponse response = userJobService.removeTempRolesTransactional();
		return publish(response);
	}

	@Override
	public SchedulerResponseDto assignMobileNoAfterExpiryTime() {
		PublishResponse response = userJobService.assignMobileNoAfterExpiryTimeTransactional();
		return publish(response);
	}

	private SchedulerResponseDto publish(PublishResponse response) {
		if(response.getSyncStagingDtoList()!=null && !response.getSyncStagingDtoList().isEmpty())
			response.getSyncStagingDtoList().forEach(syncDto -> userSyncDataSync.publishUserMessagesToQueue(syncDto));
		ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		return mapper.convertValue(response.getApiResponse(), new TypeReference<SchedulerResponseDto>() {
		});
	}

}
