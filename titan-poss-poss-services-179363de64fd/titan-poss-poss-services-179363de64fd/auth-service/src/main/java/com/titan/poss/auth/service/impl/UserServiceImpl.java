package com.titan.poss.auth.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.auth.dao.EmployeeDao;
import com.titan.poss.auth.dao.UserLoginDao;
import com.titan.poss.auth.dto.request.AclElementRequestDto;
import com.titan.poss.auth.dto.request.AclUrlRequestDto;
import com.titan.poss.auth.dto.response.AclElementResponseDto;
import com.titan.poss.auth.dto.response.AclUrlResponseDto;
import com.titan.poss.auth.repository.AclElementMappingRepositoryExt;
import com.titan.poss.auth.repository.AclUrlMappingRepositoryExt;
import com.titan.poss.auth.repository.UserLoginRepository;
import com.titan.poss.auth.service.IntegrationService;
import com.titan.poss.auth.service.UserService;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.domain.constant.SMSTypeEnum;
import com.titan.poss.core.domain.constant.UserTypeEnum;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.user.dao.AclElementMappingDao;
import com.titan.poss.user.dao.AclUrlMappingDao;
import com.titan.poss.user.dto.SendNotificationDto;
import com.titan.poss.user.util.NotificationDtoUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("AuthUserService")
public class UserServiceImpl implements UserService {

	@Autowired
	private UserLoginRepository userLoginRepository;

	@Autowired
	private IntegrationService integrationService;

	@Autowired
	private LocationRepository locationRepo;

	@Autowired
	private AclUrlMappingRepositoryExt aclUrlMappingRepository;

	@Autowired
	private AclElementMappingRepositoryExt aclElementMappingRepository;

	@Value("${poss.auth.password-expiry-in-days:90}")
	private int passwordExpiryInDays;

	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

	@Override
	@Transactional
	public UserLoginDao verifyUser(String username, String brandCode, boolean isApiUserAllowed) {
		UserLoginDao user = userLoginRepository.findByUserName(username);
		if (user == null) {
			throw new ServiceException("User does not exist", "ERR-AUTH-017", "null");
		}
		EmployeeDao emp = user.getEmployee();
		boolean isApiUser = emp.getUserType().equals(UserTypeEnum.API.name());

		// if store user, check if provided brandCode is same as logging in
		// To avoid other user logging in to MIA, & vice versa
		if (isApiUserAllowed != isApiUser)
			throw new ServiceException("User is not allowed to login in this flow", "ERR-AUTH-001",
					"UserType :- " + emp.getUserType() + ", User allowed :- "
							+ ((isApiUserAllowed) ? "" : "other than ") + "API User");

		if (!isApiUser)
			checkForLocationSpecificCheck(brandCode, emp);

		if (!emp.getIsActive()) {
			throw new ServiceException("User is in deactivated state", "ERR-AUTH-014");
		}
		if (!user.getIsLoginActive() || user.getIsLocked()) {
			throw new ServiceException("User Login is not active", "ERR-AUTH-005",
					"isLoginActive:" + user.getIsLoginActive() + ", isLocked:" + user.getIsLocked());
		}
		if (emp.getForcePasswordChange())
			throw new ServiceException("Password expired. Please use forgot password option to reset the password.", "ERR-AUTH-013",
					"force password Change: " + emp.getForcePasswordChange());

		if (!isApiUser
				&& CalendarUtils.addNnoOfDays(passwordExpiryInDays, user.getPasswordChangedDate()).before(new Date())) {
			throw new ServiceException("Password expired. Please use forgot password option to reset the password.", "ERR-AUTH-013",
					"password changed date: " + user.getPasswordChangedDate() + ", password change is required after: "
							+ CalendarUtils.addNnoOfDays(passwordExpiryInDays, user.getPasswordChangedDate()));
		}
		return user;
	}

	private void checkForLocationSpecificCheck(String brandCode, EmployeeDao emp) {

		AppTypeEnum appName = AppTypeEnum.valueOf(ApplicationPropertiesUtil.getProperty("app.name"));

		// if store user, then only do brand check
		if (CommonUtil.isAStoreUser(emp.getUserType())) {

			LocationDao locationDao = locationRepo.findOneByLocationCode(emp.getLocationCode());

			Boolean isOffline = BooleanUtils.isTrue(locationDao.getIsOffline());

			// offline user can't login to EPOSS
			// & online user can't login to POSS
			if (appName == AppTypeEnum.EPOSS && isOffline)
				throw new ServiceException("Offline store users can't login to EPOSS", "ERR-AUTH-002");
			else if (appName == AppTypeEnum.POSS && !isOffline)
				throw new ServiceException("Online store users can't login to POSS", "ERR-AUTH-012");

			if (!locationDao.getIsActive())
				throw new ServiceException("Loaction is in deactivate state", "ERR-AUTH-006");

			// Brand check
			String brandCodeOfUser = emp.getBrandCode();
			boolean isBrandOfUserEmpty = StringUtils.isEmpty(brandCodeOfUser);

			if (isBrandOfUserEmpty)
				LOGGER.error("User is not having brandcode even if user belongs to store, empCode:{}",
						emp.getEmployeeCode());
			if (!brandCode.equalsIgnoreCase(locationDao.getBrand().getBrandCode()))
				throw new ServiceException("User belongs to different brand", "ERR-AUTH-010",
						"Input brand: " + brandCode + ", location's brand: " + locationDao.getBrand().getBrandCode());

		} else if (appName == AppTypeEnum.POSS) {
			// non store user can't login to POSS
			throw new ServiceException("This User can't login to POSS", "ERR-AUTH-021",
					"Corporate user trying to login into POSS");
		}
	}

	@Override
	@Transactional
	public UserLoginDao saveUser(UserLoginDao user) {
		user.setLastModifiedDate(CalendarUtils.getCurrentDate());
		return userLoginRepository.save(user);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void saveUserLogin(UserLoginDao ul) {
		saveUser(ul);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public void throwMaxLoginTryReachedErr(Integer maxRetryAttempt) {
		throw new ServiceException("User Login maximum password retry failed", "ERR-AUTH-015", maxRetryAttempt);
	}

	@Override
	@Transactional
	public void sendLockedNotification(UserLoginDao userLogin) {

		EmployeeDao employee = userLogin.getEmployee();

		Map<String, String> data = new HashMap<>();
		data.put("name", employee.getEmpName());

		SendNotificationDto sendMail = new SendNotificationDto();
		sendMail.setData(data);
		sendMail.setEmail(employee.getEmailId());
		sendMail.setMobileNo(employee.getMobileNo());
		sendMail.setTemplateName("SendLockedNotification.ftl");
		sendMail.setSmsType(SMSTypeEnum.LOCKED);
		sendMail.setNotificationType(NotificationType.USER_LOCKED);

		triggerNotification(List.of(sendMail), getAnyLocationCode(employee));

	}

	private String getAnyLocationCode(EmployeeDao emp) {
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

	@Transactional
	public void triggerNotification(List<SendNotificationDto> sendNotificationList, String locationCode) {

		if (CollectionUtils.isEmpty(sendNotificationList))
			return;

//		convert List<SendNotificationDto> to notification DTO
		NotificationDto notificationDto = NotificationDtoUtil.convertToIntegrationDto(sendNotificationList);
		// since API user, sending locationCode
		notificationDto.setLocationCode(locationCode);

//		call FEIGN client service with API token
		integrationService.sendNotification(notificationDto);

	}

	@Override
	public ListResponse<AclUrlResponseDto> getAclList(AclUrlRequestDto aclUrlRequestDto) {
		List<AclUrlResponseDto> aclUrlRespList = new ArrayList<>();
		List<AclUrlMappingDao> aclUrlList = aclUrlMappingRepository.findByUrlIn(aclUrlRequestDto.getUrls());
		aclUrlList.forEach(record -> {
			AclUrlResponseDto aclUrlResp = new AclUrlResponseDto();
			List<String> transactionList = new ArrayList<>(Arrays.asList(record.getAclCodes().split(",")));
			aclUrlResp.setTransactionCodes(transactionList);
			aclUrlResp.setUrl(record.getUrl());
			aclUrlRespList.add(aclUrlResp);
		});
		return new ListResponse<>(aclUrlRespList);
	}

	@Override
	public ListResponse<AclElementResponseDto> getAclElementList(AclElementRequestDto aclElementRequestDto) {
		List<AclElementResponseDto> aclElementRespList = new ArrayList<>();
		List<AclElementMappingDao> aclElementList = aclElementMappingRepository
				.findByUrl(aclElementRequestDto.getUrl());
		aclElementList.forEach(record -> {
			AclElementResponseDto aclElementResp = (AclElementResponseDto) MapperUtil.getDtoMapping(record,
					AclElementResponseDto.class);
			List<String> transactionList = new ArrayList<>(Arrays.asList(record.getAclCodes().split(",")));
			aclElementResp.setTransactionCodes(transactionList);
			aclElementRespList.add(aclElementResp);
		});
		return new ListResponse<>(aclElementRespList);
	}

}
