/*
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import static com.titan.poss.core.utils.CollectionUtil.containsAll;
import static com.titan.poss.core.utils.CollectionUtil.disjointCheckFailed;
import static com.titan.poss.core.utils.CollectionUtil.isContains;
import static com.titan.poss.core.utils.CollectionUtil.isEqualCollection;
import static com.titan.poss.core.utils.CollectionUtil.isSameString;
import static com.titan.poss.core.utils.CollectionUtil.setToUpperCase;
import org.springframework.util.CollectionUtils;
import static com.titan.poss.core.utils.CommonUtil.getAuthUser;
import static com.titan.poss.core.utils.CommonUtil.getLocationCode;
import static com.titan.poss.core.utils.CommonUtil.getOrgCode;
import static com.titan.poss.core.utils.CommonUtil.isAStoreUser;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.LocationCategoryEnum;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.OtpTypeEnum;
import com.titan.poss.core.domain.constant.SMSTypeEnum;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.OTPUtil;
import com.titan.poss.core.utils.PasswordHashUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.dao.UserOtpAttemptDao;
import com.titan.poss.user.dao.UserOtpDao;
import com.titan.poss.user.dto.EmployeeRoleMappingSyncDtoExt;
import com.titan.poss.user.dto.SendNotificationDto;
import com.titan.poss.user.dto.SyncDataThreadLocal;
import com.titan.poss.user.dto.constants.EmployeeTypeEnum;
import com.titan.poss.user.dto.constants.RoleTypeEnum;
import com.titan.poss.user.dto.constants.TimeTypeEnum;
import com.titan.poss.user.dto.constants.UniqueFieldEnum;
import com.titan.poss.user.dto.constants.UserDocTypeEnum;
import com.titan.poss.user.dto.request.CorporateUpdateUserDto;
import com.titan.poss.user.dto.request.OtpDetailsWoType;
import com.titan.poss.user.dto.request.OtpPasswordDto;
import com.titan.poss.user.dto.request.ResetPasswordDto;
import com.titan.poss.user.dto.request.UserLocationUpdate;
import com.titan.poss.user.dto.request.json.EmployeeAddressData;
import com.titan.poss.user.dto.response.EmpMobileReqDto;
import com.titan.poss.user.dto.response.EmployeeDto;
import com.titan.poss.user.dto.response.EmployeeListDto;
import com.titan.poss.user.dto.response.UserRoleDto;
import com.titan.poss.user.dto.sync.EmployeeSyncDto;
import com.titan.poss.user.dto.sync.UserLoginSyncDto;
import com.titan.poss.user.repository.EmployeeRepositoryExt;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.repository.RoleRepositoryExt;
import com.titan.poss.user.repository.UserLoginRepositoryExt;
import com.titan.poss.user.repository.UserOtpAttemptRepository;
import com.titan.poss.user.repository.UserOtpRepository;
import com.titan.poss.user.service.EngineService;
import com.titan.poss.user.service.IntegrationService;
import com.titan.poss.user.service.LocationService;
import com.titan.poss.user.service.PasswordPolicyService;
import com.titan.poss.user.service.RoleService;
import com.titan.poss.user.service.UserDocService;
import com.titan.poss.user.service.UserService;
import com.titan.poss.user.service.UserSyncDataService;
import com.titan.poss.user.util.NotificationDtoUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserService")
public class UserServiceImpl implements UserService {

	@Autowired
	UserLoginRepositoryExt userLoginRepo;

	@Autowired
	EmployeeRepositoryExt employeeRepo;

	@Autowired
	RoleRepositoryExt roleRepo;

	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleRepo;

	@Autowired
	LocationRoleConfigRepository locationRoleConfRepo;

	@Autowired
	UserOtpRepository userOtpRepo;

	@Autowired
	LocationService locationService;

	@Autowired
	RoleService roleService;

	@Autowired
	PasswordPolicyService passwordPolicyService;

	@Autowired
	IntegrationService integrationService;

	@Autowired
	private ApplicationContext context;

	@Autowired
	UserDocService userDocService;

	@Autowired
	private UserOtpAttemptRepository userOtpAttemptRepository;

	@Autowired
	private UserSyncDataService userSyncDataService;

	@Autowired
	private UserServiceImpl userServiceImp;

	@Autowired
	private EngineService engineService;

	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

	private static final Boolean IS_PRIMARY_ROLE = true;

	@Value("${poss.user.maxTempRole:1}")
	private Integer maxTempRole;

	@Value("${poss.user.otp.timeLength:3}")
	private Integer defaultOtpTime;

	@Value("${poss.user.otp.dateType:DAY}")
	private TimeTypeEnum defaultOtpDateType;

	@Value("${poss.user.otp.length:6}")
	private Short defaultOtpLength;

	@Value("${poss.user.otp.maxRetry:3}")
	private Short defaultOtpMaxRetry;

	@Value("${poss.notification.isSmsNotification:false}")
	private Boolean isSmsNotification;

	@Value("${poss.notification.isEmailNotification:true}")
	private Boolean isEmailotification;

	private static final String OFFICIAL_DOMAIN = "Titan";

	private static final String DEFAULT_DATE_FORMAT = "d/MMM/yy (E)";
	private static final String DEFAULT_TIME_FORMAT = "hh:mm a";

	private static final String SOME_ROLES_NOT_ASSIGNED_TO_STORE = "Some role(s) are not assigned to this location";
	private static final String ERR_UAM_031 = "ERR-UAM-031";

	private static final String INCORRECT_DATA_IN_DB = "Incorrect data in Database.";
	private static final String ERR_CORE_036 = "ERR-CORE-036";

	private static final String ERR_UAM_029 = "ERR-UAM-029";
	private static final String ERR_UAM_030 = "ERR-UAM-030";

	private static final String EMAIL_ID = "email id";
	private static final String MOBILE_NO = "mobile no";

	private static final Integer DEFAULT_ROLE_LIMIT_ADD = Integer.valueOf(1);
	private static final Integer DEFAULT_ROLE_LIMIT_REMOVE = Integer.valueOf(-1);

	private static final String NULL_POINTER_EXCEPTION = "Null Pointer Exception";

	private Set<String> setNullIfEmpty(Set<String> list) {
		return (list != null && list.isEmpty()) ? null : list;
	}

	@Override
	public void validateJson(JsonData jsonData) {
		String type = jsonData.getType();
		if (!"address".equals(type))
			throw new ServiceException("Invalid Request type & JSON type.JSON type : " + type, "ERR-CORE-014");

		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		List<String> str = new ArrayList<>();
		EmployeeAddressData employeeAddressData = null;
		employeeAddressData = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(),
				EmployeeAddressData.class);
		Set<ConstraintViolation<EmployeeAddressData>> violationsEmployee = validator.validate(employeeAddressData);
		violationsEmployee.forEach(violation -> str.add(violation.getMessage()));
		if (!violationsEmployee.isEmpty())
			throw new ServiceException("JSON format data error", "ERR-CORE-013", str);

	}

	private Page<EmployeeListDto> listUsers(String searchField1, String searchField2, String userType,
			String employeeType, Boolean isActive, Set<String> locationCodes, Set<String> regionCodes,
			Set<String> roleCodes, String orgCode, Pageable pageable) {

		List<String> storeUserTypes = List.of(UserTypeEnum.L1.name(), UserTypeEnum.L2.name(), UserTypeEnum.L3.name());
		String regionUserType = UserTypeEnum.REG.name();
		String orgUserType = UserTypeEnum.ORG.name();

		return employeeRepo.listAllEmployees(searchField1, searchField2, userType, employeeType, isActive,
				locationCodes, regionCodes, roleCodes, orgCode, storeUserTypes, regionUserType, orgUserType, pageable);
	}

	@Override
	public PagedRestResponse<List<EmployeeListDto>> listUsersDetails(String searchField1, String searchField2,
			String userType, String employeeType, Boolean isActive, Set<String> locationCodes, Set<String> regionCodes,
			Set<String> roleCodes, String orgCode, Pageable pageable) {
		locationCodes = setNullIfEmpty(locationCodes);
		regionCodes = setNullIfEmpty(regionCodes);
		roleCodes = setNullIfEmpty(roleCodes);

		Page<EmployeeListDto> employeesList = listUsers(searchField1, searchField2, userType, employeeType, isActive,
				locationCodes, regionCodes, roleCodes, orgCode, pageable);
		return new PagedRestResponse<>(employeesList);
	}

	@Override
	public EmployeeDto convertEmployeeToDto(EmployeeDao employee, Short depth) {
		EmployeeDto employeeDto = (EmployeeDto) MapperUtil.getDtoMapping(employee, EmployeeDto.class);
		employeeDto.setAddress(MapperUtil.getJsonFromString(employee.getAddress()));
		UserLoginDao userLogin = userLoginRepo.findOneByEmployeeEmployeeCode(employee.getEmployeeCode());
		if (userLogin != null) {
			employeeDto.setHasLoginAccess(true);
			employeeDto.setIsLoginActive(userLogin.getIsLoginActive());
			employeeDto.setIsLocked(userLogin.getIsLocked());
		}
		if (depth > 0)
			employeeDto.setRoles(getRoles(employee));

		return employeeDto;
	}

	/**
	 * returns all roles assigned to the employee
	 * 
	 * @param emp employee object
	 * @return Set<UserRoleDto>
	 */
	private Set<UserRoleDto> getRoles(EmployeeDao emp) {
		return employeeRoleRepo.listRolesDetailsAssignedToEmp(emp);
	}

	@Override 
	public void checkEmailAndMobileAndEmployeeCodeConstraint(String emailId, String mobileNo, String employeeCode) {
		int employeeEmailCount = 0;
		if (StringUtils.isNotBlank(emailId))
			employeeEmailCount = countEmail(emailId,employeeCode);
		int employeeMobileCount = countMobileNo(mobileNo,employeeCode);
		if (employeeEmailCount > 0 && employeeMobileCount > 0) {
			LOGGER.error("EmailId: {} is already used.", emailId);
			LOGGER.error("MobileNo: {} is already used.", mobileNo);
			throw new ServiceException("Provided email id & mobile no are already in use", "ERR-UAM-028");
		}
		if (StringUtils.isNotBlank(emailId))
			checkUniqueConstraint(employeeEmailCount, emailId, EMAIL_ID, ERR_UAM_029);
		checkUniqueConstraint(employeeMobileCount, mobileNo, MOBILE_NO, ERR_UAM_030);
	}

	@Override
	public Boolean isUniqueEmailOrMobile(String emailMobileEnum, String value) {
		Boolean isUnique = true;
		Optional<EmployeeDao> employeesDetail= Optional.of(new EmployeeDao());
		
		//getting emp details wrt mobile or email
		if(emailMobileEnum.equals(UniqueFieldEnum.MOBILE.name()))
		{
		 employeesDetail = getEmployeeDetailsWithMobileNo(value);
		}
		else if(emailMobileEnum.equals(UniqueFieldEnum.EMAIL.name()))
		{
			 employeesDetail = getEmployeeDetailsWithEmailId(value);
		}
		//return true if its new no.
		if(!employeesDetail.isPresent())
		{
			return isUnique;
		}
		//condition for emp transfer
		UserLoginDao userLoginDao = getUserLoginDetailsFromEmployee(employeesDetail.get());
		if(userLoginDao.getIsLoginActive())
		{
		if (emailMobileEnum.equals(UniqueFieldEnum.EMAIL.name()) && countEmail(value) > 0
				|| emailMobileEnum.equals(UniqueFieldEnum.MOBILE.name()) && countMobileNo(value) > 0)
			isUnique = false;
		}
		return isUnique;
	}

	@Override
	public void checkIfEmpExist(String empCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetails(empCode);
		if (employeesDetail.isPresent())
		{
			UserLoginDao userLoginDao = getUserLoginDetailsFromEmployee(employeesDetail.get());
			if(userLoginDao.getIsLoginActive())
			throw new ServiceException("Record already exist", "ERR-UAM-001");
		}
	}
	
	public Boolean checkifEmpCodeExist(String empCode)
	{
		Boolean isPresent=false;
		Optional<EmployeeDao> employeesDetail = getEmployeeDetails(empCode);
		if (employeesDetail.isPresent())
			isPresent=true;
		return isPresent;
	}

	@Override
	public EmployeeDao addEmployeWithCommonFieldAndLogIn(EmployeeDao employee, JsonData address, Boolean isLoginActive,
			Boolean hasLoginAccess) {
		employee.setHasLoginAccess(hasLoginAccess);
		employee.setIsActive(true);
		employee.setForcePasswordChange(true);
		employee.setOrgCode(getOrgCode());
		employee.setCreatedDate(new Date());
		employee.setAddress(MapperUtil.getStringFromJson(address));
		employee.setCreatedBy(CommonUtil.getAuthUser().getUsername());
		employee.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
		employee.setSrcSyncId(0);
		employee.setDestSyncId(0);
		EmployeeDao responseEmp = employeeRepo.save(employee);
		EmployeeSyncDto employeeSyncDto = new EmployeeSyncDto(responseEmp);
		// data sync
		if (SyncDataThreadLocal.getSyncData() == null) {
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(DataSyncUtil.createSyncData(employeeSyncDto, 0));
			SyncDataThreadLocal.setIntialSyncData(syncDatas);
		} else {
			SyncDataThreadLocal.setSyncData(DataSyncUtil.createSyncData(employeeSyncDto, 0));
		}
		createUserLogin(responseEmp, isLoginActive);
		return responseEmp;
	}

	/**
	 * Add time to current instant and makes second to 59.
	 * 
	 * @param timeType TimeType unit of time
	 * @param tempTime Integer value of time
	 * @return
	 */
	private Date addTime(TimeTypeEnum timeType, Integer tempTime) {
		Date expiryDate = CalendarUtils.getCurrentDate();
		if (timeType == TimeTypeEnum.MIN) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(tempTime, null, null, null, null, null);
		} else if (timeType == TimeTypeEnum.HOUR) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, tempTime, null, null, null, null);
		} else if (timeType == TimeTypeEnum.DAY) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, tempTime, null, null, null);
		} else if (timeType == TimeTypeEnum.WEEK) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, null, tempTime, null, null);
		} else if (timeType == TimeTypeEnum.MONTH) {
			expiryDate = CalendarUtils.addTimeToCurrentTime(null, null, null, null, tempTime, null);
		}
		return CalendarUtils.setSecondTo59(expiryDate);
	}

	/**
	 * Returns roles to delete for an employee
	 * 
	 * @param employee   employee object
	 * @param rolesInput set of roles to remove
	 * @return List<EmployeeRoleMapping>
	 */
	private List<EmployeeRoleMappingDaoExt> getEmployeeRoleBasedOnRolesToRemove(EmployeeDao employee,
			Set<String> rolesInput) {
		return employeeRoleRepo.findByEmployeeEmployeeCodeAndRoleRoleCodeIn(employee.getEmployeeCode(),
				rolesInput.stream().collect(Collectors.toList()));
	}

	/**
	 * returns set of roles for the provided 'role type'
	 * 
	 * @param roleToFilter RoleType Enum
	 * @return Set<String>
	 */
	private Set<String> getRolesBasedOnRoleType(RoleTypeEnum roleToFilter) {

		String accessType = "_____";
		switch (roleToFilter) {

		case CORP:
			accessType = "1____";
			break;
		case REG:
			accessType = "_1___";
			break;
		case L1:
			accessType = "__1__";
			break;
		case L2:
			accessType = "___1_";
			break;
		case L3:
			accessType = "____1";
			break;
		}

		List<RoleDao> roles = roleRepo.listByAccessType(accessType);
		return roles.stream().map(role -> role.getRoleCode().toUpperCase()).collect(Collectors.toSet());

	}

	@Override
	@Transactional
	public List<SendNotificationDto> checkEmailAndMobile(EmployeeDao employeesDetail, String emailId, String mobileNo) {
		Boolean checkNewEmail = false;
		Boolean checkNewMobile = false;
		List<SendNotificationDto> sendNotificationList = new ArrayList<>();

		// CONSIDER For updating, who don't have login access DOUBT
		if (StringUtils.isNotBlank(emailId) && !emailId.equalsIgnoreCase(employeesDetail.getEmailId()))
			checkNewEmail = true;
		if (StringUtils.isNotBlank(mobileNo) && !mobileNo.equalsIgnoreCase(employeesDetail.getMobileNo()))
			checkNewMobile = true;

		if (checkNewEmail || checkNewMobile) {
			checkEmailAndMobileAndEmployeeCodeConstraint(emailId, mobileNo, employeesDetail.getEmployeeCode() );
			if (checkNewEmail) {
//				checkEmailLogic(employeesDetail.getUserType(), emailId);
				employeesDetail.setEmailId(emailId);
				employeesDetail.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
				employeeRepo.save(employeesDetail);
			}
			if (checkNewMobile) {
				sendNotificationList.add(sendOtp(employeesDetail, OtpTypeEnum.MOBILENO_CHANGE.name(), mobileNo, false));
			}
		}
		return sendNotificationList;
	}

	private int countEmail(String emailId,String empCode) {
		return employeeRepo.countByEmailIdAndIsActiveAndEmployeeCodeNot(emailId, true, empCode);
	}
	
	private int countEmail(String emailId) {
		return employeeRepo.countByEmailIdAndIsActive(emailId, true);
	}

	private int countMobileNo(String mobileNo,String empCode) {
		return employeeRepo.countByMobileNoAndIsActiveAndEmployeeCodeNot(mobileNo, true,empCode);
	}
	
	private int countMobileNo(String mobileNo) {
		return employeeRepo.countByMobileNoAndIsActive(mobileNo, true);
	}

	private void checkUniqueConstraint(int count, String input, String uniqueFieldName, String errorCode) {
		if (count > 0) {
			LOGGER.error("{} is already used.", input);
			throw new ServiceException("Provided " + uniqueFieldName + " is already in use", errorCode);
		}
	}

	private UserLoginDao getUserLoginDetailsFromEmployee(EmployeeDao employee) {
		return userLoginRepo.findOneByEmployee(employee);
	}

	private void checkForResignation(EmployeeDao employee, CorporateUpdateUserDto corpUpdateDto) {
		if (corpUpdateDto.getResignationDate() != null) {
			employee.setResignationDate(corpUpdateDto.getResignationDate());

			if (CalendarUtils.getCurrentDate().after(employee.getResignationDate())
					|| CalendarUtils.getCurrentDate().equals(employee.getResignationDate())) {
				employee.setIsActive(false);

				UserLoginDao userLogin = userLoginRepo.findOneByEmployee(employee);
				userLogin.setIsLoginActive(false);
				userLogin.setSrcSyncId(userLogin.getSrcSyncId() + 1);
				userLogin.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
				userLogin = userLoginRepo.save(userLogin);
				// data sync
				UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto(userLogin);
				addToSyncDataThreadLocal(DataSyncUtil.createSyncData(userLoginSyncDto, 1));
				if (isAStoreUser(employee.getUserType())) {
					List<String> rolesAssigned = employeeRoleRepo.listRolesOfAnEmployee(employee);
					if (!rolesAssigned.isEmpty()) {

						Set<LocationRoleConfigDao> locationRoleConfigList = locationRoleConfRepo
								.findByLocationCodeAndRoleCodes(employee.getLocationCode(), rolesAssigned);

						locationRoleConfigList
								.forEach(lrc -> lrc.setAssignedUsers((short) (lrc.getAssignedUsers() - 1)));

						locationRoleConfRepo.saveAll(locationRoleConfigList);
					}
				}

				List<EmployeeRoleMappingDaoExt> employeeRoleList = employeeRoleRepo.findByEmployee(employee);
				employeeRoleList.forEach(empRole -> empRole.setSyncTime(new Date().getTime()));
				employeeRoleRepo.deleteAll(employeeRoleList);
				// data sync
				EmployeeRoleMappingSyncDtoExt empRoleMapSyncDto = new EmployeeRoleMappingSyncDtoExt();
				SyncDataThreadLocal.setSyncData(
						DataSyncUtil.createSyncData(empRoleMapSyncDto.getSyncDtoList(employeeRoleList), 3));
			}
		}
	}

	@Override
	@Transactional
	public List<SendNotificationDto> updateUserDetails(EmployeeDao employee, CorporateUpdateUserDto corpUpdateDto,
			JsonData address) {
		checkForResignation(employee, corpUpdateDto);

		if (StringUtils.isNotBlank(corpUpdateDto.getEmpName())) {
			employee.setEmpName(corpUpdateDto.getEmpName());
		}
		if (address != null) {
			employee.setAddress(MapperUtil.getStringFromJson(address));
		}
		if (corpUpdateDto.getJoiningDate() != null) {
			employee.setJoiningDate(corpUpdateDto.getJoiningDate());
		}
		if (corpUpdateDto.getBirthDate() != null) {
			employee.setBirthDate(corpUpdateDto.getBirthDate());
		}
		List<SendNotificationDto> sendNotificationList = checkForUserLoginUpdate(employee, corpUpdateDto);

		employee.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
		employee.setSrcSyncId(employee.getSrcSyncId() + 1);
		employee = employeeRepo.save(employee);
		// data sync
		EmployeeSyncDto employeeSyncDto = new EmployeeSyncDto(employee);
		addToSyncDataThreadLocal(DataSyncUtil.createSyncData(employeeSyncDto, 0));
		return sendNotificationList;

	}

	@Override
	public void checkIfEmployeeIsDeactivated(EmployeeDao emp) {
		if (!emp.getIsActive())
			throw new ServiceException("Employee details can't be updated as employee is in deactivated state",
					"ERR-UAM-056");

	}
	
	@Override
	public void deleteEmployeeRoleMappingIfExists(String empCode)
	{
		List<EmployeeRoleMappingDaoExt> employee = employeeRoleRepo.findByEmployeeEmployeeCode(empCode);
		if(!CollectionUtils.isEmpty(employee))
		{
			employeeRoleRepo.deleteAll(employee);
		}
		
	}

	private String getUserName(EmployeeDao emp, UserLoginDao ul) {
		String userName = null;
		try {

			userName = CommonUtil.getAuthUser().getUsername();
		} catch (Exception e) {
			if (emp != null)
				userName = emp.getEmployeeCode();
			if (userName == null && ul != null) {
				userName = ul.getUserName();
			}
		}
		return userName;
	}

	private List<SendNotificationDto> checkForUserLoginUpdate(EmployeeDao employee,
			CorporateUpdateUserDto corpUpdateDto) {
		UserLoginDao userLogin = getUserLoginDetailsFromEmployee(employee);
		List<SendNotificationDto> sendNotificationList = new ArrayList<>();
		// if both are blank, return directly
		if (corpUpdateDto.getIsLoginActive() == null)
			return Collections.emptyList();

		if (!userLogin.getIsLoginActive() && BooleanUtils.isTrue(corpUpdateDto.getIsLoginActive())) {
			OtpTypeEnum otpType;
			// even if login activated, it can be user was created with login deactivate &
			// has been activating for first time, hence new user OTP flow
			if (userLogin.getPassword() == null)
				otpType = OtpTypeEnum.INVITED;
			else
				otpType = OtpTypeEnum.LOGIN_ACTIVATED;
			sendNotificationList.add(sendOtp(employee, otpType.name(), null, false));

		} else if (userLogin.getIsLoginActive() && BooleanUtils.isFalse(corpUpdateDto.getIsLoginActive())) {
			userLogin.setIsLoginActive(false);
			//employee.setIsActive(false);
		}

		userLogin.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
		userLogin.setSrcSyncId(userLogin.getSrcSyncId() + 1);
		userLogin = userLoginRepo.save(userLogin);
		// data sync
		UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto(userLogin);
		addToSyncDataThreadLocal(DataSyncUtil.createSyncData(userLoginSyncDto, 1));

		return sendNotificationList;
	}

	// can change in future
	private RoleTypeEnum getRoleTypeBasedOnUserType(UserTypeEnum userType) {
		RoleTypeEnum roleType = null;
		if (userType == UserTypeEnum.L1)
			roleType = RoleTypeEnum.L1;
		else if (userType == UserTypeEnum.L2)
			roleType = RoleTypeEnum.L2;
		else if (userType == UserTypeEnum.L3)
			roleType = RoleTypeEnum.L3;
		else if (userType == UserTypeEnum.ORG)
			roleType = RoleTypeEnum.CORP;
		else if (userType == UserTypeEnum.REG)
			roleType = RoleTypeEnum.REG;
		else
			throw new ServiceException(INCORRECT_DATA_IN_DB, ERR_CORE_036, "roleType: " + roleType);
		return roleType;
	}

	private EmployeeTypeEnum getEmployeeTypefromString(String employeeType) {
		EmployeeTypeEnum employeeTypeEnum = null;
		try {
			employeeTypeEnum = EmployeeTypeEnum.valueOf(employeeType);
		} catch (IllegalArgumentException ex) {
			throw new ServiceException(INCORRECT_DATA_IN_DB, ERR_CORE_036, "employeeType: " + employeeType);
		}
		return employeeTypeEnum;
	}

	private UserTypeEnum getUserTypefromString(String userType) {
		UserTypeEnum userTypeEnum = null;
		try {
			userTypeEnum = UserTypeEnum.valueOf(userType);
		} catch (IllegalArgumentException ex) {
			throw new ServiceException(INCORRECT_DATA_IN_DB, ERR_CORE_036, "userType: " + userType);
		}
		return userTypeEnum;
	}

	// calling only on store user or reg user
	@Override
	public void checkEmailLogic(String userType, String emailId) {

		if (StringUtils.isBlank(emailId))
			return;

		String regexMail = "(?i)(.*)@(.*?)(?:\\.)(?:.*)";
		Pattern pattern = Pattern.compile(regexMail);
		Matcher matcher = pattern.matcher(emailId);
		if (!matcher.find())
			return;
		String firstMatch = matcher.group(1);
		String domain = matcher.group(2);
		String locCode = null;

		boolean isOfficialDomain = false;
		if (domain.equalsIgnoreCase(OFFICIAL_DOMAIN))
			isOfficialDomain = true;

		if ((userType.equals(UserTypeEnum.ORG.name()) || userType.equals(UserTypeEnum.REG.name())
				|| userType.equals(UserTypeEnum.L1.name())) && !isOfficialDomain)
			throw new ServiceException("organizational/ regional/ L1 user needs to provide corporate email id",
					"ERR-UAM-071", "Domain allowed: " + OFFICIAL_DOMAIN);

		if (isOfficialDomain) {
			String regexLocCode = "(?i)(?:btq|mgr|bos)(.*)";
			pattern = Pattern.compile(regexLocCode);
			matcher = pattern.matcher(firstMatch);
			if (matcher.find())
				locCode = matcher.group(1);
		}

		if (!isOfficialDomain || locCode == null)
			return;

		LOGGER.info("check if 'loc code' exist: {}", locCode);
		LocationCacheDto lr = locationService.getLocationDetailsFromLocationCode(locCode, false);
		if (lr != null)
			throw new ServiceException("EmailId containing 'location code' is not allowed for employee", "ERR-UAM-035",
					"'" + locCode + "' is not allowed in email id");
	}

	private Boolean isAllRoleContains(Collection<String> allAllowedRoles, Collection<String> addTempRoles,
			Collection<String> removeTempRoles, Collection<String> primaryRoles) {
		Boolean isValid = true;
		Set<String> roleCodes = new HashSet<>();
		Collections.addAll(roleCodes, addTempRoles.toArray(new String[0]));
		Collections.addAll(roleCodes, removeTempRoles.toArray(new String[0]));
		Collections.addAll(roleCodes, primaryRoles.toArray(new String[0]));
		if (!roleCodes.isEmpty() && !containsAll(allAllowedRoles, roleCodes)) {
			roleCodes.removeAll(allAllowedRoles);
			LOGGER.error("Roles which are requested, but not there in allowed list {}", roleCodes);
			isValid = false;
		}
		return isValid;
	}

	@Override
	public void updateTempRole(EmployeeDao emp, String updateTempRoleCode, Date startDate, Date expiryDate) {

		if (startDate == null && expiryDate == null)
			return;

		if (getEmployeeTypefromString(emp.getEmployeeType()) == EmployeeTypeEnum.TEMP)
			return;

		EmployeeRoleMappingDaoExt erm = employeeRoleRepo.findOneByEmployeeAndRoleRoleCodeAndIsPrimary(emp,
				updateTempRoleCode, false);
		if (erm == null)
			throw new ServiceException("Provided temporary role code is not assigned to the user", "ERR-UAM-068");

		Date currentDate = CalendarUtils.getTOdaysDocDate();
		if (startDate != null) {
			// if 'start time' of the role is before or now, can't edit
			if (CalendarUtils.beforeOrNow(erm.getStartDate(), currentDate))
				throw new ServiceException("Provided temporary role is already in active state", "ERR-UAM-069");
			erm.setStartDate(currentDate);
		}
		if (expiryDate != null) {
			if (erm.getExpiryDate().before(currentDate))
				throw new ServiceException("Provided temporary role is already expired", "ERR-UAM-070");
			erm.setExpiryDate(expiryDate);
		}
		if (erm.getStartDate().after(erm.getExpiryDate()))
			throw new ServiceException("Expiry time should be after start time", "ERR-UAM-072");

		erm.setSyncTime(new Date().getTime());
		erm = employeeRoleRepo.save(erm);
		// data sync
		EmployeeRoleMappingSyncDtoExt empRoleMapSyncDto = new EmployeeRoleMappingSyncDtoExt(erm);
		if (SyncDataThreadLocal.getSyncData() == null) {
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(DataSyncUtil.createSyncData(empRoleMapSyncDto, 4));
			SyncDataThreadLocal.setIntialSyncData(syncDatas);
		} else {
			SyncDataThreadLocal.setSyncData(DataSyncUtil.createSyncData(empRoleMapSyncDto, 4));
		}

	}

	@Override
	public void setStoreRoles(EmployeeDao employeesDetail, Set<String> addTempRoleCodes,
			Set<String> removeTempRoleCodes, String primaryRole, Date startDate, Date expiryDate, Boolean isFirstTime,
			Boolean isByAdmin) {

		if (EmployeeTypeEnum.TEMP.equals(getEmployeeTypefromString(employeesDetail.getEmployeeType()))) {
			addTempRoleCodes = new HashSet<>();
			removeTempRoleCodes = new HashSet<>();
		}

		// if all 3 are blank return
		if (CollectionUtils.isEmpty(addTempRoleCodes) && CollectionUtils.isEmpty(removeTempRoleCodes)
				&& StringUtils.isBlank(primaryRole))
			return;

		// set upper case
		addTempRoleCodes = setToUpperCase(addTempRoleCodes);
		removeTempRoleCodes = setToUpperCase(removeTempRoleCodes);
		Set<String> primaryRoles = new HashSet<>();
		if (StringUtils.isNotBlank(primaryRole))
			primaryRoles.add(primaryRole.toUpperCase());

		Set<String> allRolesInput = Stream.of(addTempRoleCodes, removeTempRoleCodes, primaryRoles)
				.flatMap(Collection::stream).collect(Collectors.toSet());

		Set<String> storeRolesCorpCanAssign = roleRepo.findStoreRolesCorpCanAccess();

		checkIfUserHasAccessToRole(isByAdmin, allRolesInput, storeRolesCorpCanAssign);

		// list lrc assigned to the store
		List<LocationRoleConfigDao> allowedRolesBasedOnStore = locationRoleConfRepo
				.findByLocationCodeAndIsDefaultAndIsActiveTrue(employeesDetail.getLocationCode(), false);
		if (allowedRolesBasedOnStore.isEmpty())
			throw new ServiceException("No roles have been assigned to this store", "ERR-UAM-023");

		// list role codes from lrc
		Set<String> allowedRoleCodesBasedOnStore = allowedRolesBasedOnStore.stream()
				.map(lrc -> lrc.getRole().getRoleCode().toUpperCase()).collect(Collectors.toSet());

		// all roles provided should be in assigned store roles, subset
		if (!isAllRoleContains(allowedRoleCodesBasedOnStore, addTempRoleCodes, removeTempRoleCodes, primaryRoles))
			throw new ServiceException(SOME_ROLES_NOT_ASSIGNED_TO_STORE, ERR_UAM_031);

		if (!isFirstTime) {
			// get existing roles assigned
			Set<String> rolesAssigned = getRoleCodesAssigned(employeesDetail);

			// rolesAssignable contains which roles can be added after removing which roles
			// are provided for remove
			Set<String> rolesAssignable = new HashSet<>(allowedRoleCodesBasedOnStore);
			rolesAssignable.removeAll(rolesAssigned);
			// roles trying to remove should be assigned, roles trying to add is must not br
			// assigned
			checkAllowedRolesAssigned(rolesAssigned, removeTempRoleCodes, rolesAssignable, addTempRoleCodes);
		}

		List<EmployeeRoleMappingDaoExt> existingPrimaryRoles = employeeRoleRepo
				.findByEmployeeEmployeeCodeAndIsPrimary(employeesDetail.getEmployeeCode(), IS_PRIMARY_ROLE);

		List<EmployeeRoleMappingDaoExt> existingTempRoles = employeeRoleRepo
				.findByEmployeeEmployeeCodeAndIsPrimary(employeesDetail.getEmployeeCode(), !IS_PRIMARY_ROLE);

		// check no of temporary roles limit crossed or not
		checkForTempRolePolicy(addTempRoleCodes, removeTempRoleCodes, existingTempRoles);

		Set<String> addCountRoles = new HashSet<>(addTempRoleCodes);
		Set<String> removeCountRoles = new HashSet<>(removeTempRoleCodes);

		Set<String> existingPrimaryRolesString = new HashSet<>();
		if (!isFirstTime) {
			existingPrimaryRolesString = existingPrimaryRoles.stream()
					.map(erl -> erl.getRole().getRoleCode().toUpperCase()).collect(Collectors.toSet());
			if (disjointCheckFailed(removeTempRoleCodes, existingPrimaryRolesString))
				throw new ServiceException("Primary role of an user can't be removed explicitly", "ERR-UAM-064");
		}
		// maintain roles whose assignedUser limit will update
		List<EmployeeRoleMappingDaoExt> finalEmpRoleToAdd = new ArrayList<>();

		// go only if primary role provided
		if (!primaryRoles.isEmpty() && !isEqualCollection(primaryRoles, existingPrimaryRolesString)) {
			addCountRoles.addAll(primaryRoles);
			finalEmpRoleToAdd.addAll(
					getEmployeeRoleBasedOnRolesToAdd(employeesDetail, primaryRoles, IS_PRIMARY_ROLE, null, null));
			if (!isFirstTime && !existingPrimaryRoles.isEmpty()) {
				checkRolesAssignedError(allowedRoleCodesBasedOnStore, existingPrimaryRolesString);
				removeCountRoles.addAll(existingPrimaryRolesString);
			}
		}

		List<LocationRoleConfigDao> finalLocRoleToAdd = new ArrayList<>();

		assignTempRolesStoreAndUpdateErm(employeesDetail, addTempRoleCodes, startDate, expiryDate,
				allowedRolesBasedOnStore, addCountRoles, finalLocRoleToAdd, finalEmpRoleToAdd);

		removeTempRolesStoreAndUpdateErm(employeesDetail, allowedRolesBasedOnStore, removeCountRoles,
				finalLocRoleToAdd);

		locationRoleConfRepo.saveAll(finalLocRoleToAdd);

	}

	private void checkIfUserHasAccessToRole(Boolean isByAdmin, Set<String> allRolesInput,
			Set<String> storeRolesCorpCanAssign) {

		if (isByAdmin && !storeRolesCorpCanAssign.containsAll(allRolesInput)) {
			throw new ServiceException("Admin can't assign roles to employee which are not accessible by corporate",
					"ERR-UAM-054", "Only assignable roles:- " + Arrays.toString(storeRolesCorpCanAssign.toArray()));
			// all roles should be subset or same as storeRolesCorpCanAssign
		} else if (!isByAdmin && !Collections.disjoint(storeRolesCorpCanAssign, allRolesInput)) {
			throw new ServiceException("SM can't update or assign roles employee which are accessible by corporate",
					"ERR-UAM-055", Arrays.toString(storeRolesCorpCanAssign.toArray()));
			// disjoint true storeRolesCorpCanAssign, and all provided roles to assig
		}
	}

	private void assignTempRolesStoreAndUpdateErm(EmployeeDao employeesDetail, Set<String> addTempRoleCodes,
			Date startDate, Date expiryDate, List<LocationRoleConfigDao> rolesForUserLocation, Set<String> addRoles,
			List<LocationRoleConfigDao> finalLocRoleToAdd, List<EmployeeRoleMappingDaoExt> finalEmpRoleToAdd) {

		if (!addRoles.isEmpty()) {
			finalLocRoleToAdd.addAll(getAssignRoles(addRoles, rolesForUserLocation, DEFAULT_ROLE_LIMIT_ADD));

			// manually generating empRoleMaps rows
			finalEmpRoleToAdd.addAll(getEmployeeRoleBasedOnRolesToAdd(employeesDetail, addTempRoleCodes,
					!IS_PRIMARY_ROLE, startDate, expiryDate));
			List<EmployeeRoleMappingDaoExt> employeeRoleMapping = employeeRoleRepo.saveAll(finalEmpRoleToAdd);

			// data sync
			EmployeeRoleMappingSyncDtoExt empRoleSyncDto = new EmployeeRoleMappingSyncDtoExt();
			if (SyncDataThreadLocal.getSyncData() == null) {
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(DataSyncUtil.createSyncData(empRoleSyncDto.getSyncDtoList(employeeRoleMapping), 2));
				SyncDataThreadLocal.setIntialSyncData(syncDatas);
			} else {
				SyncDataThreadLocal.setSyncData(
						DataSyncUtil.createSyncData(empRoleSyncDto.getSyncDtoList(employeeRoleMapping), 2));
			}
		}
	}

	/**
	 * @param employee   employee object
	 * @param rolesInput set of roles to add
	 * @param isPrimary  if any role is primary
	 * @param expiryDate 'expiry time' is required if roles are not primary
	 * @return List<EmployeeRoleMapping>
	 */
	private List<EmployeeRoleMappingDaoExt> getEmployeeRoleBasedOnRolesToAdd(EmployeeDao employee,
			Set<String> rolesInput, Boolean isPrimary, Date startDate, Date expiryDate) {
		List<EmployeeRoleMappingDaoExt> employeeRoleMaps = new ArrayList<>();
		rolesInput.forEach(roleCode -> {
			RoleDao role = new RoleDao();
			role.setRoleCode(roleCode);
			EmployeeRoleMappingDaoExt erm = new EmployeeRoleMappingDaoExt();
			erm.setEmployee(employee);
			erm.setRole(role);
			erm.setIsPrimary(isPrimary);
			erm.setStartDate(startDate);
			erm.setExpiryDate(expiryDate);
			erm.setSyncTime(new Date().getTime());
			employeeRoleMaps.add(erm);
		});

		return employeeRoleMaps;
	}

	private void removeTempRolesStoreAndUpdateErm(EmployeeDao employeesDetail,
			List<LocationRoleConfigDao> rolesForUserLocation, Set<String> removeRoles,
			List<LocationRoleConfigDao> finalRoleUpdates) {
		if (!removeRoles.isEmpty()) {
			finalRoleUpdates.addAll(getAssignRoles(removeRoles, rolesForUserLocation, DEFAULT_ROLE_LIMIT_REMOVE));
			List<EmployeeRoleMappingDaoExt> empRolesToRemove = getEmployeeRoleBasedOnRolesToRemove(employeesDetail,
					removeRoles);
			empRolesToRemove.forEach(empRole -> empRole.setSyncTime(new Date().getTime()));
			employeeRoleRepo.deleteAll(empRolesToRemove);
			EmployeeRoleMappingSyncDtoExt empRoleSyncDto = new EmployeeRoleMappingSyncDtoExt();
			if (SyncDataThreadLocal.getSyncData() == null) {
				List<SyncData> syncDatas = new ArrayList<>();
				syncDatas.add(DataSyncUtil.createSyncData(empRoleSyncDto.getSyncDtoList(empRolesToRemove), 3));
				SyncDataThreadLocal.setIntialSyncData(syncDatas);
			} else {
				SyncDataThreadLocal
						.setSyncData(DataSyncUtil.createSyncData(empRoleSyncDto.getSyncDtoList(empRolesToRemove), 3));
			}

		}
	}

	@Override
	public Boolean isStoreEmployeePartOfCorp(String empCode) {
		return employeeRoleRepo.isStoreEmployeePartOfCorp(empCode);
	}

	@Override
	public void setCorpRoles(EmployeeDao employeesDetail, Set<String> addTempRoleCodes, Set<String> removeTempRoleCodes,
			String primaryRole, Date startDate, Date expiryDate, Boolean isFirstTime) {

		// if all 3 are blank return
		if (CollectionUtils.isEmpty(addTempRoleCodes) && CollectionUtils.isEmpty(removeTempRoleCodes)
				&& StringUtils.isBlank(primaryRole))
			return;

		// set upper case
		addTempRoleCodes = setToUpperCase(addTempRoleCodes);
		removeTempRoleCodes = setToUpperCase(removeTempRoleCodes);
		Set<String> primaryRoles = new HashSet<>();
		if (StringUtils.isNotBlank(primaryRole))
			primaryRoles.add(primaryRole.toUpperCase());

		Set<String> allRolesInput = Stream.of(addTempRoleCodes, removeTempRoleCodes, primaryRoles)
				.flatMap(Collection::stream).collect(Collectors.toSet());

		// fetch userType of employee to see which roles are assignable
		UserTypeEnum userType = getUserTypefromString(employeesDetail.getUserType());
		RoleTypeEnum roleType = getRoleTypeBasedOnUserType(userType);

		Set<String> allowedRolesBasedOnUserType = getRolesBasedOnRoleType(roleType);
		String accessType = roleService.getAccessTypeLikeByRoleType(roleType.toString());
		if (roleRepo.countByActiveAndRoleTypeRoleCodeIn(accessType, allRolesInput) != allRolesInput.size())
			throw new ServiceException("Some roles are not assigned to the role type or inactive", "ERR-UAM-057");

		if (!isFirstTime) {
			// get existing roles assigned
			Set<String> rolesAssigned = getRoleCodesAssigned(employeesDetail);

			// rolesAssignable contains which roles can be added after removing which roles
			// are provided for remove
			Set<String> rolesAssignable = new HashSet<>(allowedRolesBasedOnUserType);
			rolesAssignable.removeAll(rolesAssigned);
			// roles trying to remove should be assigned, roles trying to add is must not br
			// assigned
			checkAllowedRolesAssigned(rolesAssigned, removeTempRoleCodes, rolesAssignable, addTempRoleCodes);
		}

		Set<String> addCountRoles = new HashSet<>(addTempRoleCodes);
		Set<String> removeCountRoles = new HashSet<>(removeTempRoleCodes);

		List<EmployeeRoleMappingDaoExt> finalEmpRoleToAdd = new ArrayList<>();

		// not rqd for 1st time
		List<EmployeeRoleMappingDaoExt> existingPrimaryRoles = employeeRoleRepo
				.findByEmployeeEmployeeCodeAndIsPrimary(employeesDetail.getEmployeeCode(), IS_PRIMARY_ROLE);
		// update take only count or string role, if not used anywhere
		List<EmployeeRoleMappingDaoExt> existingTempRoles = employeeRoleRepo
				.findByEmployeeEmployeeCodeAndIsPrimary(employeesDetail.getEmployeeCode(), !IS_PRIMARY_ROLE);

		// check no of temporary roles limit crossed or not
		checkForTempRolePolicy(addTempRoleCodes, removeTempRoleCodes, existingTempRoles);

		Set<String> existingPrimaryRolesString = new HashSet<>();
		if (!isFirstTime) {
			existingPrimaryRolesString = existingPrimaryRoles.stream()
					.map(erl -> erl.getRole().getRoleCode().toUpperCase()).collect(Collectors.toSet());
			if (disjointCheckFailed(removeTempRoleCodes, existingPrimaryRolesString))
				throw new ServiceException("Primary role of an user can't be removed explicitly", "ERR-UAM-064");

		}
		// go only if primary role provided
		if (!primaryRoles.isEmpty() && !isEqualCollection(primaryRoles, existingPrimaryRolesString)) {
			addCountRoles.addAll(primaryRoles);
			finalEmpRoleToAdd.addAll(
					getEmployeeRoleBasedOnRolesToAdd(employeesDetail, primaryRoles, IS_PRIMARY_ROLE, null, null));
			if (!isFirstTime && !existingPrimaryRoles.isEmpty()) {
				checkRolesAssignedError(allowedRolesBasedOnUserType, existingPrimaryRolesString);
				removeCountRoles.addAll(existingPrimaryRolesString);
			}

		}
		assignTempRolesCorpAndUpdateErm(employeesDetail, addTempRoleCodes, startDate, expiryDate, finalEmpRoleToAdd);

		removeTempRolesCorpAndUpdateErm(employeesDetail, removeCountRoles);

	}

	private void assignTempRolesCorpAndUpdateErm(EmployeeDao employeesDetail, Set<String> addTempRoleCodes,
			Date startDate, Date expiryDate, List<EmployeeRoleMappingDaoExt> finalEmpRoleToAdd) {
		if (!addTempRoleCodes.isEmpty()) {
			finalEmpRoleToAdd.addAll(getEmployeeRoleBasedOnRolesToAdd(employeesDetail, addTempRoleCodes,
					!IS_PRIMARY_ROLE, startDate, expiryDate));
		}
		employeeRoleRepo.saveAll(finalEmpRoleToAdd);
	}

	private void removeTempRolesCorpAndUpdateErm(EmployeeDao employeesDetail, Set<String> removeRoles) {
		if (!removeRoles.isEmpty()) {
			employeeRoleRepo.deleteAll(getEmployeeRoleBasedOnRolesToRemove(employeesDetail, removeRoles));
		}
	}

	private Set<String> getRoleCodesAssigned(EmployeeDao employeesDetail) {
		return getRoles(employeesDetail).stream().map(usr -> usr.getRoleCode().toUpperCase())
				.collect(Collectors.toSet());
	}

	private void checkForTempRolePolicy(Set<String> addTempRoleCodes, Set<String> removeTempRoleCodes,
			List<EmployeeRoleMappingDaoExt> existingTempRoles) {
		Integer newTempRoleCount = existingTempRoles.size() + addTempRoleCodes.size() - removeTempRoleCodes.size();
		if (newTempRoleCount > maxTempRole)
			throw new ServiceException("Temporary role limit is more than configured", "ERR-UAM-021",
					"Total temporary roles after request :- " + newTempRoleCount + ", allowed :- " + maxTempRole);
	}

	private void checkAllowedRolesAssigned(Set<String> rolesAssigned, Set<String> removeTempRoleCodes,
			Set<String> rolesAssignable, Set<String> addTempRoleCodes) {
		if (!containsAll(rolesAssigned, removeTempRoleCodes))
			throw new ServiceException("Role(s) trying to remove is not assigned to User", "ERR-UAM-016");
		if (!containsAll(rolesAssignable, addTempRoleCodes))
			throw new ServiceException("Role(s) trying to add is already assigned to User", "ERR-UAM-032");
	}

	private List<LocationRoleConfigDao> getAssignRoles(Collection<String> rolesToUpdate,
			List<LocationRoleConfigDao> roleForUserLocation, Integer changeValue) {
		List<LocationRoleConfigDao> roleLocationToUpdate = new ArrayList<>();
		try {
			roleLocationToUpdate = assignRoles(rolesToUpdate, roleForUserLocation, changeValue);
		} catch (NullPointerException e) {
			LOGGER.error(NULL_POINTER_EXCEPTION);
		}
		return roleLocationToUpdate;
	}

	private List<LocationRoleConfigDao> assignRoles(Collection<String> rolesToUpdate,
			List<LocationRoleConfigDao> roleForUserLocation, Integer changeValue) {

		// @formatter:off
		List<LocationRoleConfigDao> roleLocationToUpdate = roleForUserLocation.stream()
				.filter(roleLocation -> isValidRole(roleLocation, rolesToUpdate)).map(roleLocation -> {
					roleLocation.setAssignedUsers((short) (roleLocation.getAssignedUsers() + changeValue));
					if (changeValue.equals(DEFAULT_ROLE_LIMIT_REMOVE) && roleLocation.getAssignedUsers() < 0)
						roleLocation.setAssignedUsers((short) 0);
					return roleLocation;
				}).collect(Collectors.toList());

		if (changeValue.equals(DEFAULT_ROLE_LIMIT_ADD)) {
			Boolean isFailed = roleLocationToUpdate.stream()
					.anyMatch(roleLoc -> roleLoc.getAssignedUsers() > roleLoc.getUserLimit());
			if (isFailed)
				throw new ServiceException("For some role(s), assigned count is exceeding than user limit",
						"ERR-UAM-065");
		}

		return roleLocationToUpdate;
	}

	private Boolean isValidRole(LocationRoleConfigDao lrc, Collection<String> rolesToUpdate) {
		Boolean isValid = false;
		if (lrc == null)
			isValid = false;
		else {
			String roleCode = lrc.getRole().getRoleCode();
			isValid = isContains(rolesToUpdate, roleCode);
		}
		return isValid;
	}

	private void checkRolesAssignedError(Collection<String> allRolesAssigned, Collection<String> roles) {
		if (!containsAll(allRolesAssigned, roles))
			throw new ServiceException(SOME_ROLES_NOT_ASSIGNED_TO_STORE, ERR_UAM_031);
		// DOUBT may be not required
	}

	private Optional<EmployeeDao> getEmployeeDetails(String employeeCode, String locationCode) {
		return employeeRepo.findByEmployeeCodeAndLocationCodeAndOrgCode(employeeCode, locationCode, getOrgCode());
	}

	private Optional<UserLoginDao> getUserLoginDetails(String userName) {
		return userLoginRepo.findById(userName);
	}

	@Override
	public EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetails(employeeCode);
		return getEmpDetailsWithCheck(employeesDetail);
	}

	private Optional<EmployeeDao> getEmployeeDetails(String employeeCode) {
		return employeeRepo.findByEmployeeCodeAndOrgCodeAndIsActive(employeeCode, getOrgCode(),true);
	}
	
	private Optional<EmployeeDao> getEmployeeDetailsWithMobileNo(String mobileNo) {
		return employeeRepo.findByMobileNoAndOrgCodeAndIsActive(mobileNo, getOrgCode(),true);
	}
	
	private Optional<EmployeeDao> getEmployeeDetailsWithEmailId(String emailId) {
		return employeeRepo.findByEmailIdAndOrgCodeAndIsActive(emailId, getOrgCode(),true);
	}

	private EmployeeDao getEmployeeDetailsWithErrorCheckOutsideSecurity(String employeeCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetailsCheckOutsideSecurity(employeeCode);
		return getEmpDetailsWithCheck(employeesDetail);
	}

	private EmployeeDao getEmployeeDetailsWithOutsideSecurity(String employeeCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetailsCheckOutsideSecurity(employeeCode);
		EmployeeDao emp = null;
		if (employeesDetail.isPresent())
			emp = employeesDetail.get();
		return emp;
	}

	private Optional<EmployeeDao> getEmployeeDetailsCheckOutsideSecurity(String employeeCode) {
		return employeeRepo.findByEmployeeCode(employeeCode);
		}
	public Optional<EmployeeDao> getEmployeeDetailsById(String employeeCode) {
		return employeeRepo.findByEmployeeCode(employeeCode);
	}

	private EmployeeDao getEmpDetailsWithCheck(Optional<EmployeeDao> employeesDetail) {
		if (!employeesDetail.isPresent())
			throw new ServiceException("Record(s) not found", "ERR-UAM-002");
		return employeesDetail.get();
	}

	@Override
	public EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode, String locationCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetails(employeeCode, locationCode);
		return getEmpDetailsWithCheck(employeesDetail);
	}

	public UserLoginDao getUserLoginWithErrorCheck(String userName) {
		Optional<UserLoginDao> userLogins = getUserLoginDetails(userName);
		if (!userLogins.isPresent())
			throw new ServiceException("Record(s) not found", "ERR-UAM-002");
		return userLogins.get();
	}

	private Boolean isPasswordUpdateNeeded(OtpTypeEnum otpType) {
		Boolean isValid = false;
		if (otpType == OtpTypeEnum.INVITED || otpType == OtpTypeEnum.LOGIN_ACTIVATED
				|| otpType == OtpTypeEnum.FORGOT_PASSWORD) {
			isValid = true;
		}
		return isValid;
	}

	@Override
	public void otpUserPasswordVerify(OtpPasswordDto otpPasswordDto) {

		OtpTypeEnum otpType = OtpTypeEnum.valueOf(otpPasswordDto.getOtpType().toUpperCase());
		EmployeeDao emp = getEmployeeDetailsWithOutsideSecurity(otpPasswordDto.getEmpCode());

		if (emp == null) {
			LOGGER.info("Username is provided for verify OTP, but not present in system: {}",
					otpPasswordDto.getEmpCode());
			throw new ServiceException("Invalid OTP.", "ERR-UAM-013", -1);
		}

		UserLoginDao userLogin = userLoginRepo.findOneByEmployee(emp);
		UserOtpDao userOtpActive = verifyOtp(emp, otpPasswordDto.getOtp(), otpPasswordDto.getOtpType());

		UserServiceImpl userServiceImpl = context.getBean(UserServiceImpl.class);
		userServiceImpl.updateFieldsBasedOnOTP(otpPasswordDto.getNewPassword(), otpType, emp, userLogin, userOtpActive);
		// data sync
		if (emp.getLocationCode() != null) {
			Map<String, SyncStagingDto> syncStaging = userServiceImp.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.VERIFYOTP, emp.getLocationCode(), true);
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

	private UserOtpDao verifyOtp(EmployeeDao emp, String inputOtp, String otpType) {
		UserOtpDao userOtpActive = findOneValidOtpToken(emp, otpType);
		if (userOtpActive == null) {
			throw new ServiceException("Invalid OTP.", "ERR-UAM-013",
					"OTP is expired or not requested or used or deactivated due to uniqueness fail.");
		}
		Boolean isValidOtp = userOtpActive.getOtpToken().equals(inputOtp);
		if (!isValidOtp) {
			LOGGER.info("User: {} gave OTP:{}, assigned OTP: {}", emp.getEmpName(), inputOtp,
					userOtpActive.getOtpToken());
//			updateOtpRetry (emp, otpType, userOtpActive)
			updateOtpAttempt(emp, userOtpActive, inputOtp);
			throw new ServiceException("Wrong OTP", "ERR-UAM-014");
		}
		return userOtpActive;
	}

	@Transactional
	public void updateFieldsBasedOnOTP(String inuptPassword, OtpTypeEnum otpType, EmployeeDao employee,
			UserLoginDao userLogin, UserOtpDao userOtpActive) {

		if (isPasswordUpdateNeeded(otpType)) {
			String newHashedPassword = convertPasswordDecrypt2Hashed(inuptPassword, userLogin.getSalt());
			userLogin = passwordPolicyService.checkPasswordPolicy(userLogin, userLogin.getPassword(), newHashedPassword,
					inuptPassword);
			saveUserLoginForPassword(userLogin, newHashedPassword);
		}

		// delete from otp attempt?

		Integer changeRecordCount = 0;

		if (otpType == OtpTypeEnum.LOGIN_ACTIVATED || otpType == OtpTypeEnum.FORGOT_PASSWORD) {

			userLogin = updateUserLogin(employee, userLogin);

			// password change is true, then make it false as password is getting reset in
			// this flow
			if (employee.getForcePasswordChange())
				employee = updateForcePasswordChange(employee);

			changeRecordCount += 1;
		} else if (otpType == OtpTypeEnum.INVITED) {

			employee = updateForcePasswordChange(employee);

			userLogin = updateUserLogin(employee, userLogin);
			changeRecordCount += 1;

		} else if (otpType == OtpTypeEnum.MOBILENO_CHANGE) {

			if (employeeRepo.countByMobileNoAndIsActive(userOtpActive.getReqValue(), true) > 0) {
				throw new ServiceException("The entered mobile no is already in use. Please enter alternate mobile no.",
						ERR_UAM_030);
			}
			employee.setMobileNo(userOtpActive.getReqValue());

			employee.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
			employee.setSrcSyncId(employee.getSrcSyncId() + 1);
			employee = employeeRepo.save(employee);
			// data sync
			EmployeeSyncDto employeeSyncDto = new EmployeeSyncDto(employee);
			addToSyncDataThreadLocal(DataSyncUtil.createSyncData(employeeSyncDto, 0));
			changeRecordCount += 1;

		}

		if (changeRecordCount > 0) {
			userOtpActive.setIsActive(false);

			userOtpActive.setLastModifiedBy(userLogin.getUserName());
			userOtpRepo.save(userOtpActive);
			// success
			updateOtpAttempt(employee, userOtpActive, userOtpActive.getOtpToken());
		}
	}

	private EmployeeDao updateForcePasswordChange(EmployeeDao employee) {
		employee.setForcePasswordChange(false);

		employee.setLastModifiedBy(employee.getEmployeeCode());
		employee.setSrcSyncId(employee.getSrcSyncId() + 1);
		employee = employeeRepo.save(employee);
		// data sync
		EmployeeSyncDto employeeSyncDto = new EmployeeSyncDto(employee);
		addToSyncDataThreadLocal(DataSyncUtil.createSyncData(employeeSyncDto, 0));
		return employee;
	}

	private UserLoginDao updateUserLogin(EmployeeDao employee, UserLoginDao userLogin) {
		userLogin.setIsLoginActive(true);
		userLogin.setIsLocked(false);
		userLogin.setFailedAttempts(0);

		userLogin.setLastModifiedBy(employee.getEmployeeCode());
		userLogin.setSrcSyncId(userLogin.getSrcSyncId() + 1);
		userLogin = userLoginRepo.save(userLogin);
		// data sync
		UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto(userLogin);
		addToSyncDataThreadLocal(DataSyncUtil.createSyncData(userLoginSyncDto, 1));
		return userLogin;
	}

	public void deactivateOtpAsync(UserOtpDao userOtpActive, String employeeCode) {

		userOtpActive.setIsActive(false);
		userOtpActive.setLastModifiedBy(employeeCode);

		userOtpRepo.save(userOtpActive);

	}

	private void saveUserLoginForPassword(UserLoginDao userLogin, String newPassword) {

		userLogin.setPassword(newPassword);
		userLogin.setPasswordChangedDate(CalendarUtils.getCurrentDate());
		userLogin.setFailedAttempts(0);

		userLogin.setLastModifiedBy(userLogin.getUserName());
		userLogin.setSrcSyncId(userLogin.getSrcSyncId() + 1);
		userLogin = userLoginRepo.save(userLogin);
		// data sync
		UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto(userLogin);
		addToSyncDataThreadLocal(DataSyncUtil.createSyncData(userLoginSyncDto, 1));

	}

	/**
	 * @param syncData
	 */
	private void addToSyncDataThreadLocal(SyncData syncData) {
		if (SyncDataThreadLocal.getSyncData() == null) {
			List<SyncData> syncDatas = new ArrayList<>();
			syncDatas.add(syncData);
			SyncDataThreadLocal.setIntialSyncData(syncDatas);
		} else {
			SyncDataThreadLocal.setSyncData(syncData);
		}

	}

	private String convertPasswordDecrypt2Hashed(String encodedPassword, String salt) {
		return PasswordHashUtil.getSecurePassword(CryptoUtil.asymmetricDecrypt(encodedPassword, "password", false),
				salt);
	}

	@Override
	@Transactional
	public void resetUserPassword(ResetPasswordDto resetPasswordDto) {

		UserLoginDao userLogin = getUserLoginWithErrorCheck(getAuthUser().getUsername());
		String oldPassword = convertPasswordDecrypt2Hashed(resetPasswordDto.getOldPassword(), userLogin.getSalt());
		if (!oldPassword.equalsIgnoreCase(userLogin.getPassword()))
			throw new ServiceException("Incorrect password", "ERR-UAM-012");

		String newPassword = convertPasswordDecrypt2Hashed(resetPasswordDto.getNewPassword(), userLogin.getSalt());
		userLogin = passwordPolicyService.checkPasswordPolicy(userLogin, oldPassword, newPassword,
				resetPasswordDto.getNewPassword());

		saveUserLoginForPassword(userLogin, newPassword);
		// data sync
		String locationCode = getLocationCode();
		if (locationCode != null) {
			Map<String, SyncStagingDto> syncStaging = userServiceImp.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.CHANGEPSWD, locationCode, true);
			userSyncDataService.publishUserMessages(syncStaging);
		}
		SyncDataThreadLocal.unsetSyncData();
	}

	@Override
	@Transactional
	public SendNotificationDto sendOtp(EmployeeDao employee, String otpType, String reqValue, Boolean isReqByAdmin) {

		String lastModifiedBy = getUserName(employee, null);

		// update old otp of same type
		List<UserOtpDao> oldUserOtpList = userOtpRepo.findByEmployeeAndOtpTypeAndExpiryDateLessThanAndIsActiveTrue(
				employee, otpType, CalendarUtils.getCurrentDate());
		for (UserOtpDao oldOtp : oldUserOtpList) {
			oldOtp.setIsActive(false);
			oldOtp.setLastModifiedBy(lastModifiedBy);
		}
		userOtpRepo.saveAll(oldUserOtpList);

		checkUniqueContactDetails(otpType, reqValue, isReqByAdmin);

		UserLoginDao userLogin = getUserLoginDetailsFromEmployee(employee);
		
		if (isReqByAdmin)
			verifyValidRequest(otpType, userLogin);

		UserOtpDao userOtpActive = findOneValidOtpToken(employee, otpType);
		Map<String, String> data = new HashMap<>();
		if (userOtpActive == null
				|| (isContactChangeRequest(otpType) && !isSameString(userOtpActive.getReqValue(), reqValue))) {
			// update old otp
			List<UserOtpDao> userOtpList = userOtpRepo.findByEmployeeAndOtpTypeAndIsActiveTrue(employee, otpType);
			for (UserOtpDao oldOtp : userOtpList) {
				oldOtp.setIsActive(false);
				oldOtp.setLastModifiedBy(lastModifiedBy);
			}
			userOtpRepo.saveAll(userOtpList);

			LOGGER.debug("\nNo of old OTP got deactivated := {}", userOtpList.size());
			userOtpActive = generateOtpToken(employee, otpType, reqValue, lastModifiedBy);
		}
		String templateName = StringUtils.EMPTY;
		SMSTypeEnum smsType = null;
		NotificationType notificationType = null;
		if (OtpTypeEnum.valueOf(otpType.toUpperCase()) == OtpTypeEnum.LOGIN_ACTIVATED) {
			data.put("newStatus", "activated");
			templateName = "SendOtpUnlockedOrActivated.ftl";
			smsType = SMSTypeEnum.ACTIVATED;
			notificationType = NotificationType.USER_LOGIN_ACTIVATED;
		} else if (OtpTypeEnum.valueOf(otpType.toUpperCase()) == OtpTypeEnum.INVITED) {
			data.put("userName", userLogin.getUserName());
			templateName = "SendOtpInvited.ftl";
			smsType = SMSTypeEnum.INVITED;
			notificationType = NotificationType.USER_INVITED;
		} else if (OtpTypeEnum.valueOf(otpType.toUpperCase()) == OtpTypeEnum.FORGOT_PASSWORD) {
			data.put("time", CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DEFAULT_TIME_FORMAT));
			data.put("date", CalendarUtils.formatDateToString(CalendarUtils.getCurrentDate(), DEFAULT_DATE_FORMAT));
			templateName = "SendOtpForgotPassword.ftl";
			smsType = SMSTypeEnum.FORGOT_PASSWORD;
			notificationType = NotificationType.USER_FORGOT_PASSWORD;
		} else if (OtpTypeEnum.valueOf(otpType.toUpperCase()) == OtpTypeEnum.MOBILENO_CHANGE) {
			data.put("reqValue", reqValue);
			data.put("contactType", MOBILE_NO);
			templateName = "SendOtpContactDetailsChange.ftl";
			smsType = SMSTypeEnum.MOBILENO_CHANGE;
			notificationType = NotificationType.USER_MOBILENO_CHANGE;
		}

		data.put("name", StringUtil.getNameForEmail(employee.getEmpName()));
		data.put("otp", userOtpActive.getOtpToken());
		data.put("expiryTime", CalendarUtils.formatDateToString(userOtpActive.getExpiryDate(), DEFAULT_TIME_FORMAT));
		data.put("expiryDate", CalendarUtils.formatDateToString(userOtpActive.getExpiryDate(), DEFAULT_DATE_FORMAT));
		data.put("orgName", OFFICIAL_DOMAIN);
		String copyRight = new StringBuilder(100).append("&copy; ").append(OFFICIAL_DOMAIN).append(" Company LTD.")
				.toString();
		data.put("copyright", copyRight);

		LOGGER.debug("\n\nYour OTP\t:= {}", data.get("otp"));
		LOGGER.debug("\nOTP Expires at\t:= {} on {}", data.get("expiryDate"), data.get("expiryTime"));

		if (StringUtils.isBlank(templateName))
			return null;

		SendNotificationDto sendNotification = new SendNotificationDto();
		sendNotification.setData(data);
		sendNotification.setEmail(employee.getEmailId());
		sendNotification.setMobileNo(employee.getMobileNo());
		sendNotification.setTemplateName(templateName);
		sendNotification.setSmsType(smsType);
		sendNotification.setNotificationType(notificationType);
		sendNotification.setUserName(lastModifiedBy);
		return sendNotification;
	}

	// Why List? For multiple scenario in one flow can happen
	// For e.g, when mobile no changed, & login activated
	@Override
	public void triggerNotification(List<SendNotificationDto> sendNotificationList) {

		if (CollectionUtils.isEmpty(sendNotificationList))
			return;

//		convert List<SendNotificationDto> to notification DTO
		NotificationDto notificationDto = NotificationDtoUtil.convertToIntegrationDto(sendNotificationList);

//		call FIEGN client service
		integrationService.sendNotification(notificationDto);

	}

	private void verifyValidRequest(String otpType, UserLoginDao userLogin) {
		if ((OtpTypeEnum.INVITED.name().equalsIgnoreCase(otpType) && userLogin.getPassword() != null)
				|| (OtpTypeEnum.LOGIN_ACTIVATED.name().equalsIgnoreCase(otpType) && userLogin.getIsLoginActive()))
			throw new ServiceException(
					"OTP request is not valid. User may have been deactivated, or new user already updated password",
					"ERR-UAM-026");
	}

	private void checkUniqueContactDetails(String otpType, String reqValue, Boolean isReqByAdmin) {
		if (isReqByAdmin && OtpTypeEnum.MOBILENO_CHANGE.name().equalsIgnoreCase(otpType))
			checkUniqueConstraint(countMobileNo(reqValue), reqValue, MOBILE_NO, ERR_UAM_030);
	}

	private Boolean isContactChangeRequest(String otpType) {
		Boolean isValid = false;
		if (OtpTypeEnum.MOBILENO_CHANGE.name().equalsIgnoreCase(otpType))
			isValid = true;
		return isValid;
	}

	private UserOtpDao findOneValidOtpToken(EmployeeDao employee, String otpType) {
		return userOtpRepo.findOneByEmployeeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(employee, true,
				CalendarUtils.getCurrentDate(), otpType);
	}

	private UserOtpDao generateOtpToken(EmployeeDao employee, String otpType, String reqValue, String userName) {
		// delete from user otp attempt?

		Date expiryDate = addTime(defaultOtpDateType, defaultOtpTime);
		UserOtpDao userOtp = new UserOtpDao();
		userOtp.setEmployee(employee);
		userOtp.setOtpToken(OTPUtil.generateOtp(defaultOtpLength));
		userOtp.setExpiryDate(expiryDate);
		userOtp.setIsActive(true);
		userOtp.setOtpType(otpType.toUpperCase());
		userOtp.setReqValue(reqValue);
		userOtp.setCreatedBy(userName);
		userOtp.setLastModifiedBy(userName);
		userOtp.setCreatedDate(CalendarUtils.getCurrentDate());
		userOtp.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return userOtpRepo.save(userOtp);
	}

	public UserLoginDao createUserLogin(EmployeeDao emp, Boolean isLoginActive) {
		UserLoginDao userLogin = new UserLoginDao();
		String salt = PasswordHashUtil.getSalt();
		userLogin.setUserName(emp.getEmployeeCode());
		userLogin.setFailedAttempts(Integer.valueOf(0));
		userLogin.setIsLoginActive(isLoginActive);
		userLogin.setIsLocked(false);
		userLogin.setSalt(salt);
		userLogin.setEmployee(emp);
		userLogin.setCreatedBy(CommonUtil.getAuthUser().getUsername());
		userLogin.setLastModifiedBy(CommonUtil.getAuthUser().getUsername());
		userLogin.setCreatedDate(CalendarUtils.getCurrentDate());//when existing data is updated completely
		userLogin.setSrcSyncId(0);
		userLogin.setDestSyncId(0);
		userLogin = userLoginRepo.save(userLogin);
		// data sync
		UserLoginSyncDto userLoginSyncDto = new UserLoginSyncDto(userLogin);
		SyncDataThreadLocal.setSyncData(DataSyncUtil.createSyncData(userLoginSyncDto, 1));
		return userLogin;
	}

	@Override
	@Transactional
	public void generateOTPForgotPassword(OtpDetailsWoType otpPasswordDto) {
		EmployeeDao emp = getEmployeeDetailsWithOutsideSecurity(otpPasswordDto.getEmpCode());
		if (emp == null) {
			LOGGER.warn("Username is searched for forgot password, but not present in system: {}",
					otpPasswordDto.getEmpCode());
			throw new ServiceException("Username is searched for forgot password, but not present in system.","ERR-UAM-079");

		}

		UserLoginDao ul = getUserLoginDetailsFromEmployee(emp);
		if (ul.getPassword() == null || !ul.getIsLoginActive() || !emp.getIsActive())
			throw new ServiceException("User may be login deactivated/ invited/ resigned state", "ERR-UAM-058",
					"isLoginActive? " + ul.getIsLoginActive() + ", password there? " + (ul.getPassword() != null)
							+ ", isActive? " + emp.getIsActive());

		SendNotificationDto sendNotification = sendOtp(emp, OtpTypeEnum.FORGOT_PASSWORD.name(), null, true);

		triggerNotification(List.of(sendNotification));

	}

	@Override
	public String getAnyLocationCode(EmployeeDao emp) {
		String locationCode = null;
		String userType = emp.getUserType();
		if (userType.equals(UserTypeEnum.L1.toString()) || userType.equals(UserTypeEnum.L2.toString())
				|| userType.equals(UserTypeEnum.L3.toString())) {
			locationCode = emp.getLocationCode();
		} else if (userType.equals(UserTypeEnum.REG.toString())) {
			locationCode = emp.getRegionCode();
		} else if (userType.equals(UserTypeEnum.ORG.toString())) {
			locationCode = emp.getOrgCode();
		}
		return locationCode;
	}

	@Override
	public String getTempEmpCode(UserDocTypeEnum userDocType) {

		String locationCode = getLocationCode();

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(locationCode);
		Integer runningNumber = userDocService.getDocNumber(locationCode,
				countryDetailsDto.getFiscalYear().shortValue(), userDocType.name());

		return String.valueOf("TEMP_" + locationCode.toUpperCase() + "_" + runningNumber);
	}

	@Override
	public String checkOtpActiveForMobileNumberValidation(String userName) {
		EmployeeDao employee = getEmployeeDetailsWithErrorCheckOutsideSecurity(userName);

		UserOtpDao userOtp = userOtpRepo.findOneByEmployeeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(employee,
				Boolean.valueOf(true), CalendarUtils.getCurrentDate(), OtpTypeEnum.MOBILENO_CHANGE.name());

		if (userOtp == null)
			return null;

		return userOtp.getReqValue();
	}

	private void updateOtpAttempt(EmployeeDao emp, UserOtpDao userOtp, String inputOtp) {

		// delete from user otp attempt is required while generating otp?
		List<UserOtpAttemptDao> userOtpAttempts = userOtpAttemptRepository.findByUserOtp(userOtp);

		UserOtpAttemptDao userOtpAttemptDao = new UserOtpAttemptDao();
		userOtpAttemptDao.setUserOtp(userOtp);
		userOtpAttemptDao.setInputOtp(inputOtp);
		userOtpAttemptDao.setStatus(inputOtp.equals(userOtp.getOtpToken()));
		userOtpAttemptDao.setCreatedBy(emp.getEmployeeCode());
		userOtpAttemptDao.setLastModifiedBy(emp.getEmployeeCode());

		if (!userOtpAttempts.isEmpty() && inputOtp.equals(userOtp.getOtpToken())) {
			userOtpAttemptRepository.deleteAll(userOtpAttempts);
			userOtpAttempts.clear();
		}
		userOtpAttemptRepository.save(userOtpAttemptDao);

		userOtpAttempts.add(userOtpAttemptDao);

		if (userOtpAttempts.size() >= defaultOtpMaxRetry) {
			// deletion from user otp attempt is required here?
			UserServiceImpl userServiceImpl = context.getBean(UserServiceImpl.class);
			userServiceImpl.deactivateOtpAsync(userOtp, emp.getEmployeeCode());
			throw new ServiceException("Maximum OTP retry reached. Deactivating OTP. Please, generate again.",
					"ERR-UAM-075", defaultOtpMaxRetry);
		}

	}

	@Override
	@Transactional
	public void updateUserStatus(String locationCode, UserLocationUpdate userLocationUpdate) {

		List<EmployeeDao> employees = new ArrayList<>();
		// to activate -> where user is inactive and resignation date is not provided or
		// in future
		// to deactivate -> where user is active
		// It can handle for a particular store, region, organization

		LocationCategoryEnum locationCategory = LocationCategoryEnum.LOC;

		// UPDATE isActive state
		if (userLocationUpdate.getUserStatus() != null) {

			Boolean isActive = !userLocationUpdate.getUserStatus();

			if (isActive)
				employees = employeeRepo.listAllActiveByLocationCode(locationCode, locationCategory.name());
			else
				employees = employeeRepo.listAllActiveElligibleByLocationCode(locationCode, locationCategory.name(),
						CalendarUtils.getCurrentDate());

			employees.stream().forEach(emp -> emp.setIsActive(userLocationUpdate.getUserStatus()));
			employeeRepo.saveAll(employees);

		}

		// UPDATE brand code
		if (StringUtils.isNotBlank(userLocationUpdate.getBrandCode())) {
			employees.clear();
			employees = employeeRepo.listAllActiveByLocationCode(locationCode, locationCategory.name());
			employees.stream().forEach(emp -> emp.setBrandCode(userLocationUpdate.getBrandCode()));
			employeeRepo.saveAll(employees);
		}

	}

	@Override
	public EmpMobileReqDto getRequestedMobileNumber() {

		UserOtpDao userOtp = userOtpRepo
				.findOneByEmployeeEmployeeCodeAndIsActiveAndExpiryDateGreaterThanEqualAndOtpType(
						CommonUtil.getEmployeeCode(), Boolean.valueOf(true), CalendarUtils.getCurrentDate(),
						OtpTypeEnum.MOBILENO_CHANGE.name());

		EmpMobileReqDto empReqDetails = new EmpMobileReqDto();

		if (userOtp != null)
			empReqDetails.setRequestedMobileNo(userOtp.getReqValue());

		return empReqDetails;
	}
}
