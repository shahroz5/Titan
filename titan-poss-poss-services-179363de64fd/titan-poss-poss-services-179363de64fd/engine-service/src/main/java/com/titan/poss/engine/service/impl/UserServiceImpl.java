/*  Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import static com.titan.poss.core.utils.CommonUtil.getOrgCode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.EdcBanksDto;
import com.titan.poss.core.dto.EmployeeMasterDto;
import com.titan.poss.core.dto.EmployeeSignatureDto;
import com.titan.poss.core.dto.LiteEmployeeListDto;
import com.titan.poss.core.dto.RoleAclConfigDto;
import com.titan.poss.core.dto.RoleLiteDto;
import com.titan.poss.core.dto.UserLoginDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.dto.UserSessionDetailsDto;
import com.titan.poss.engine.dto.UserSessionDetailsResultDto;
import com.titan.poss.engine.dto.UserSessionDto;
import com.titan.poss.engine.dto.request.AclElementRequestDto;
import com.titan.poss.engine.dto.request.AclUrlRequestDto;
import com.titan.poss.engine.dto.response.AclElementResponseDto;
import com.titan.poss.engine.dto.response.AclUrlResponseDto;
import com.titan.poss.engine.dto.response.EmployeeDto;
import com.titan.poss.engine.dto.response.UserRoleDto;
import com.titan.poss.engine.service.IntegrationService;
import com.titan.poss.engine.service.UserService;
import com.titan.poss.engine.user.repository.AclElementMappingRepositoryExt;
import com.titan.poss.engine.user.repository.AclUrlMappingRepositoryExt;
import com.titan.poss.engine.user.repository.EmployeeRepository;
import com.titan.poss.engine.user.repository.EmployeeRoleMappingRepository;
import com.titan.poss.engine.user.repository.RoleAclMappingRepository;
import com.titan.poss.engine.user.repository.RoleRepository;
import com.titan.poss.engine.user.repository.UserLoginRepository;
import com.titan.poss.engine.user.repository.UserSessionRepository;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.user.dao.AclElementMappingDao;
import com.titan.poss.user.dao.AclUrlMappingDao;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.UserLoginDao;

import lombok.extern.slf4j.Slf4j;

/**
 * Service class for User.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service("engineUserService")
public class UserServiceImpl implements UserService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private UserLoginRepository userLoginRepository;

	@Autowired
	private AclUrlMappingRepositoryExt aclUrlMappingRepository;

	@Autowired
	private AclElementMappingRepositoryExt aclElementMappingRepository;

	@Autowired
	private RoleRepository roleRepo;

	@Autowired
	private UserSessionRepository userSessionRepo;

	@Autowired
	private IntegrationService integrationService;
	
	@Autowired
	private RoleAclMappingRepository roleAclMappingRepo;
	
	@Autowired
	private EmployeeRoleMappingRepository employeeRoleMappingRepo;

	/**
	 * This method will return the list of employee details.
	 * 
	 * @param locationCodes
	 * @param roleCodes
	 * @param employeeCode
	 * @param pageable
	 * @return PagedRestResponse<List<LiteEmployeeListDto>>
	 */
	@Override
	public PagedRestResponse<List<LiteEmployeeListDto>> listUsers(Set<String> locationCodes, Set<String> roleCodes,
			Pageable pageable, String... employeeCodes) {

		boolean isOfOwnStore = false;
		if (CollectionUtils.isEmpty(locationCodes)) {
			isOfOwnStore = true;
			locationCodes = Set.of(CommonUtil.getLocationCode());
		}

		boolean isEpossApp = CommonUtil.isEpossApp();
		log.debug("EPOSS APP ?: {}", isEpossApp);

		Page<LiteEmployeeListDto> liteEmployeeListDtoList = null;
		// if eposs API call DB
		// or if poss API is getting employee list of same location
		if (isEpossApp || isOfOwnStore) {

			liteEmployeeListDtoList = employeeRepository.listEmployees(locationCodes, roleCodes, Arrays.stream(employeeCodes).collect(
		            Collectors.toSet()),
					pageable);
			return new PagedRestResponse<>(liteEmployeeListDtoList);
		} else {

			return listUsersEposs(locationCodes, roleCodes, pageable, employeeCodes); // eposs call
		}

	}
	
	

	@SuppressWarnings("unchecked")
	private PagedRestResponse<List<LiteEmployeeListDto>> listUsersEposs(Set<String> locationCodes,
			Set<String> roleCodes, Pageable pageable, String... employeeCodes) {

		Map<String, String> reqParams = new HashMap<>();

		if (!CollectionUtil.isEmpty(locationCodes))
			reqParams.put("locationCodes", convertListToStr(locationCodes));

		if (!CollectionUtil.isEmpty(roleCodes))
			reqParams.put("roleCodes", convertListToStr(roleCodes));

		if (employeeCodes != null)
			reqParams.put("employeeCode", convertListToStr(Arrays.asList(employeeCodes)));

		reqParams.put("page", String.valueOf(pageable.getPageNumber()));
		reqParams.put("size", String.valueOf(pageable.getPageSize()));

		return callEposs(HttpMethod.GET, "api/engine/v2/users", reqParams, null, PagedRestResponse.class);
	}

	private String convertListToStr(Collection<?> collection) {

		String[] strArr = collection.stream().toArray(String[]::new);
		return String.join(",", strArr);
	}

	public <T> T callEposs(HttpMethod httpMethod, String relativeUrl, Map<String, String> requestParamters,
			Object requestBody, Class<T> className) {

		ApiResponseDto epossResponseDto = integrationService.callEpossAPI(httpMethod, relativeUrl, requestParamters,
				requestBody);

		// if 200, then return response
		if (epossResponseDto.getHttpResponseCode() == HttpStatus.OK.value()) {

			return MapperUtil.mapObjToClass(epossResponseDto.getResponse(), className);
		} else {
			// re-throw the error

			String errCode = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.CODE);
			String errMssg = JsonUtils.getValueFromJsonString(epossResponseDto.getResponse(), CommonConstants.MESSAGE);

			// if code & message is there in response then show service exception
			if (StringUtils.isNotBlank(errCode) && StringUtils.isNotBlank(errMssg)) {

				Object errCause = null;
				if (epossResponseDto.getResponse() != null)
					errCause = JsonUtils.getValueFromJson(epossResponseDto.getResponse(), CommonConstants.ERROR_CAUSE,
							Object.class);
				throw new ServiceException(errMssg, errCode, errCause);

			} else {
				// if code & message not there, then throw generic error message

				throw new ServiceException(SalesConstants.CALL_TO_EPOSS_FAILED, SalesConstants.ERR_INT_025,
						epossResponseDto.getResponse());
			}
		}
	}

	/**
	 * Returns employee details with null check
	 * 
	 * @param employeeCode primary key of
	 * @return Employee employee object
	 */
	@Override
	public EmployeeDao getEmployeeDetailsWithErrorCheck(String employeeCode) {
		Optional<EmployeeDao> employeesDetail = getEmployeeDetails(employeeCode);
		return getEmpDetailsWithCheck(employeesDetail);
	}

	private Optional<EmployeeDao> getEmployeeDetails(String employeeCode) {
		return employeeRepository.findByEmployeeCodeAndOrgCode(employeeCode, getOrgCode());
	}

	private EmployeeDao getEmpDetailsWithCheck(Optional<EmployeeDao> employeesDetail) {
		if (!employeesDetail.isPresent())
			throw new ServiceException("Record(s) not found", "ERR-UAM-002");
		return employeesDetail.get();
	}

	/**
	 * Convert DAO to DTO for Employee object
	 * 
	 * @param employee Employee object
	 * @param depth    to decide whether to show ACL list or not assigned to the
	 *                 employee
	 * @return
	 */
	@Override
	public EmployeeDto convertEmployeeToDto(EmployeeDao employee, Short depth) {
		EmployeeDto employeeDto = (EmployeeDto) MapperUtil.getDtoMapping(employee, EmployeeDto.class);
		employeeDto.setAddress(MapperUtil.getJsonFromString(employee.getAddress()));
		UserLoginDao userLogin = userLoginRepository.findOneByEmployeeEmployeeCode(employee.getEmployeeCode());
		employeeDto.setHasLoginAccess(false);
		if (userLogin != null) {
			employeeDto.setHasLoginAccess(true);
			employeeDto = (EmployeeDto) MapperUtil.getObjectMapping(userLogin, employeeDto);
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
		return employeeRepository.listRolesDetailsAssignedToEmp(emp);
	}

	@Override
	public EmployeeDto getProfile() {

		EmployeeDao empDao = getEmployeeDetailsWithErrorCheck(CommonUtil.getEmployeeCode());
		return convertEmployeeToDto(empDao, (short) 1);
	}

	@Override
	public ListResponse<String> getLoggedinUserRoleList() {

		String empCode = CommonUtil.getEmployeeCode();
		return new ListResponse<>(employeeRepository.listRoleCodes(empCode));

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

	@Override
	public ListResponse<RoleLiteDto> getAllActiveRoleList() {
		return new ListResponse<>(roleRepo.listActiveRoleCodes());
	}

	@Override
	public ListResponse<UserSessionDetailsDto> getAllActiveUserSession() {

		List<Object[]> results = userSessionRepo.getAllActiveSessionByLocationCode(CommonUtil.getStoreCode(),
				CalendarUtils.getCurrentDate());
		List<UserSessionDetailsResultDto> resultsDto = new ArrayList<>();

		String loggedInUserName = CommonUtil.getUserName();
		String loggedinHostName = CommonUtil.getAuthUser().getHostName();
		log.debug("Ignore userName: {}, hostName: {}", loggedInUserName, loggedinHostName);

		for (Object[] result : results) {

			// if userName match ignore or else if hostname there, then ignore that also
			if ((loggedInUserName.equals(result[0]))
					|| (loggedinHostName != null && loggedinHostName.equals(result[8])))
				continue;

			UserSessionDetailsResultDto resultDto = new UserSessionDetailsResultDto();
			resultDto.setUserName((String) result[0]);
			resultDto.setEmployeeCode((String) result[1]);
			resultDto.setEmployeeName((String) result[2]);
			resultDto.setMobileNo((String) result[3]);
			resultDto.setEmailId((String) result[4]);
			resultDto.setId((Integer) result[5]);
			resultDto.setLoginDate((Date) result[6]);
			resultDto.setExpiryDate((Date) result[7]);
			resultDto.setHostName((String) result[8]);
			resultsDto.add(resultDto);
		}
		// @formatter:off
		// group based on user name
		Map<String, List<UserSessionDetailsResultDto>> userNameGrouping = resultsDto.stream()
				.collect(Collectors.groupingBy(UserSessionDetailsResultDto::getUserName));
		// @formatter:on
		List<UserSessionDetailsDto> userSessions = new ArrayList<>();

		for (Map.Entry<String, List<UserSessionDetailsResultDto>> entry : userNameGrouping.entrySet()) {

			List<UserSessionDetailsResultDto> userResult = entry.getValue();
			UserSessionDetailsResultDto firstResult = userResult.get(0);
			UserSessionDetailsDto usd = (UserSessionDetailsDto) MapperUtil.getDtoMapping(firstResult,
					UserSessionDetailsDto.class);

			List<UserSessionDto> sessions = new ArrayList<>();
			for (UserSessionDetailsResultDto result : userResult)
				sessions.add((UserSessionDto) MapperUtil.getDtoMapping(result, UserSessionDto.class));
			usd.setSessions(sessions);

			userSessions.add(usd);
		}
		return new ListResponse<>(userSessions);
	}

	@Override
	public HashMap<String, Object> uploadFile(String digitalSignature, String employeeCode) {
		HashMap<String, Object> hashmap = new HashMap<>();
		EmployeeDao employee = employeeRepository.findByEmployeeCode(employeeCode).get();
		if (employee != null) {
			try {
				employee.setDigitalSignature(digitalSignature);
				employee = employeeRepository.save(employee);
				hashmap.put("message", "Signature Saved Successfully");
				hashmap.put("status", true);
				hashmap.put("digital_signature", employee.getDigitalSignature());
			} catch (Exception e) {
				throw new ServiceException("Error in file upload", "ERR-SALE-108");
			}

		} else {
			throw new ServiceException("Record(s) not found", "ERR-INV-029");
		}
		return hashmap;
	}

	@Override
	public EmployeeSignatureDto getEmployeeSignatureDetails(String employeeCode) {
		Optional<EmployeeDao> employee = employeeRepository.findByEmployeeCode(employeeCode);
		if (employee.isPresent()) {
			EmployeeSignatureDto employeeDto = (EmployeeSignatureDto) MapperUtil.getDtoMapping(employee.get(),
					EmployeeSignatureDto.class);
			employeeDto.setAddress(MapperUtil.getJsonFromString(employee.get().getAddress()));
			UserLoginDao userLogin = userLoginRepository
					.findOneByEmployeeEmployeeCode(employee.get().getEmployeeCode());
			employeeDto.setHasLoginAccess(false);
			if (userLogin != null) {
				employeeDto.setHasLoginAccess(true);
				employeeDto = (EmployeeSignatureDto) MapperUtil.getObjectMapping(userLogin, employeeDto);
			}

			return employeeDto;
		} else {
			throw new ServiceException("Record(s) not found", "ERR-INV-029");
		}
	}

	@Override
	public Map<String, String> getEmployeeSignature(String employeeCode) {
		Map<String, String> employeeSign = new HashMap<>();
		Optional<EmployeeDao> employee = employeeRepository.findByEmployeeCode(employeeCode);
		if (employee.isPresent() && employee.get().getDigitalSignature() != null) {
			employeeSign.put("emp_signature", employee.get().getDigitalSignature());
		}
		return employeeSign;
	}

	@Override
	public RoleLiteDto getRole(String roleCode) {
		return roleRepo.listRoleDetails(roleCode);
	}
	
	//getEmpRoleConfig
	@Override
	public RoleAclConfigDto getEmpRoleConfig(String empCode, String aclCode) {
		RoleAclConfigDto roleAclConfig = new RoleAclConfigDto() ;
		List<EmployeeRoleMappingDao> employeeRole =  employeeRoleMappingRepo.findByEmployeeCode(empCode);
		for(EmployeeRoleMappingDao employeeRoles : employeeRole) {
			String roleCode = employeeRoles.getRole().getRoleCode();
			List<String> roleAclMap = roleAclMappingRepo.listRoleAclCodes(roleCode);
			
			roleAclConfig.setRoleCode(roleCode);
			roleAclConfig.setIsAclActive(false);
			if(roleAclMap.contains(aclCode))
			{
				roleAclConfig.setIsAclActive(true);
				break;
			}
		}
		
		return roleAclConfig;
	}



	@Override
	public List<EmployeeMasterDto> getAllEmployeeList(EdcBankRequestDto edcBankRequestDto) {
		 List<Object[]> employeeMaster = new ArrayList();
		if(edcBankRequestDto.getFromDocDate() == null && edcBankRequestDto.getToDocDate() == null) {
			employeeMaster = employeeRepository.findByUniqueCombination();
			
		}else {
			employeeMaster = employeeRepository.findByUniqueCombinationWithDateRange(edcBankRequestDto);		
		}	
		 List<EmployeeMasterDto> employeeList = new ArrayList<EmployeeMasterDto>();
		 for (Object[] obj : employeeMaster) {
			 EmployeeMasterDto employee = new EmployeeMasterDto();
			 employee.setEmployeeCode((String) obj[0]);
			 employee.setEmployeeName((String) obj[1]);
			 employee.setEmailId((String) obj[2]);
			 employee.setMobileNo((String) obj[3]);
			 employee.setLocationCode((String) obj[4]);
			 employee.setOrgCode((String) obj[5]);
			 employee.setUserType((String) obj[6]);
			 employee.setHasLoginAccess((Boolean) obj[7]);
			 employee.setIsActive((Boolean) obj[8]);
			 employee.setCreatedBy((String) obj[9]);		
			 employee.setCreatedDate(((Date) obj[10]).getTime());
			 employee.setLastModifiedBy((String) obj[11]);
			 employee.setLastModifiedDate(((Date) obj[12]).getTime());
			 employee.setEmployeeType((String) obj[13]);
			 employee.setRoleCode((String) obj[14]);
			 employee.setDescription((String) obj[15]);
			 if((Date) obj[16] != null) {
				 employee.setStartDate(((Date) obj[16]).getTime());	 
			 }
			 if((Date) obj[17] != null) {
				 employee.setExpiryDate(((Date) obj[17]).getTime()); 
			 }
			
			 employee.setIsPrimary((Boolean) obj[18]);	
			 employeeList.add(employee);
		 }
		return employeeList;
	}



	@Override
	public List<UserLoginDto> getAllLoginMasterList(EdcBankRequestDto edcBankRequestDto) {
		 List<Object[]> loginMaster = new ArrayList();
		 if(edcBankRequestDto.getFromDocDate() == null && edcBankRequestDto.getToDocDate() == null) {
			 loginMaster = userLoginRepository.findByUniqueCombination();
		 }else {
			 loginMaster = userLoginRepository.findByUniqueCombinationWithDateRange(edcBankRequestDto);			 
		 }
		 List<UserLoginDto> loginList = new ArrayList<UserLoginDto>();
		 for (Object[] obj : loginMaster) {
			 UserLoginDto loginDto = new UserLoginDto();
			 loginDto.setUserName((String) obj[0]);
			 loginDto.setPassword((String) obj[1]);
			 loginDto.setEmployeeCode((String) obj[2]);
			 loginDto.setSalt((String) obj[3]);
			 if((Date) obj[4] != null) {
				 loginDto.setPasswordChangedDate(((Date) obj[4]).getTime()); 
			 }
			 loginDto.setIsLocked((Boolean) obj[5]);
			 loginDto.setIsLoginActive((Boolean) obj[6]);
			 loginDto.setCreatedBy((String) obj[7]);
			 loginDto.setCreatedDate(((Date) obj[8]).getTime());
			 loginDto.setLastModifiedBy((String) obj[9]);
			 loginDto.setLastModifiedDate(((Date) obj[10]).getTime());
			 if((Date) obj[11] != null) {
				 loginDto.setLastLoginDate(((Date) obj[11]).getTime()); 
			 }
			 loginDto.setPasswordHistory((String) obj[12]);
			 loginList.add(loginDto);
		 }
		
		return loginList;
	}
}
