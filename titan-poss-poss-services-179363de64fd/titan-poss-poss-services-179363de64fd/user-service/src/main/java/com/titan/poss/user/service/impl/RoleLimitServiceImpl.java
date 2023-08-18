/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import static com.titan.poss.core.utils.CommonUtil.getAuthUser;
import static com.titan.poss.core.utils.CommonUtil.getLocationCode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.domain.constant.NotificationConstants;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.NotificationRequestDto;
import com.titan.poss.core.dto.StoreDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDaoExt;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dao.RoleLimitRequestDao;
import com.titan.poss.user.dao.RoleLimitRequestDetailsDao;
import com.titan.poss.user.dto.constants.RoleLimitRequestStatus;
import com.titan.poss.user.dto.constants.UserDocTypeEnum;
import com.titan.poss.user.dto.request.RoleChangeRequestDto;
import com.titan.poss.user.dto.request.RoleLimitApproveDto;
import com.titan.poss.user.dto.request.RoleLimitReqDto;
import com.titan.poss.user.dto.request.RoleLimitRequestDto;
import com.titan.poss.user.dto.response.RequestDetailsDto;
import com.titan.poss.user.dto.response.RequestedRoleDetails;
import com.titan.poss.user.dto.response.RoleLimitResponseDto;
import com.titan.poss.user.dto.response.TempRoleDetails;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.repository.RoleLimitRequestDetailsRepository;
import com.titan.poss.user.repository.RoleLimitRequestRepository;
import com.titan.poss.user.repository.RoleRepositoryExt;
import com.titan.poss.user.service.EngineService;
import com.titan.poss.user.service.LocationService;
import com.titan.poss.user.service.RoleLimitService;
import com.titan.poss.user.service.UserDocService;
import com.titan.poss.user.service.UserService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserRoleLimitService")
public class RoleLimitServiceImpl implements RoleLimitService {

	@Autowired
	LocationRoleConfigRepository locationRoleConfigRepository;

	@Autowired
	RoleLimitRequestRepository roleLimitReqRepo;

	@Autowired
	LocationService locationService;

	@Autowired
	RoleLimitRequestDetailsRepository roleLimitReqDetailsRepo;

	@Autowired
	RoleRepositoryExt roleRepository;

	@Autowired
	UserService userService;

	@Autowired
	UserDocService userDocService;

	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleMappingRepository;

	@Autowired
	private EngineService engineService;

	@Autowired
	EngineServiceClient engineServiceClient;

	private static final Logger LOGGER = LoggerFactory.getLogger(RoleLimitServiceImpl.class);

	private static final String SOME_ROLES_NOT_ASSIGNED_TO_STORE = "Some role(s) are not assigned to this location";
	private static final String ERR_UAM_031 = "ERR-UAM-031";
	private static final String ERR_UAM_002 = "ERR-UAM-002";

	private static final String DELIMTER = ";";

	@Override
	public RoleLimitResponseDto createRoleLimitRequest(RoleLimitRequestDto roleLimitRequestDto) {

		AuthUser authUser = getAuthUser();
		// Date currentDate CalendarUtils getCurrentDate()

		Set<String> roleLimitToAssign = checkIfRolesAreActive(roleLimitRequestDto, authUser);

		List<LocationRoleConfigDao> roleLimits = checkIfRolesBelongToLocation(authUser, roleLimitToAssign);

		Map<String, LocationRoleConfigDao> lrcByCode = roleLimits.stream()
				.collect(Collectors.toMap(lrc -> lrc.getRole().getRoleCode().toUpperCase(), lrc -> lrc));
		List<TempRoleDetails> results = roleLimitRequestDto.getRoleLimitReqDto().stream()
				.map(roleReqDto -> new TempRoleDetails(roleReqDto.getRoleCode(), roleReqDto.getReqValue(),
						lrcByCode.get(roleReqDto.getRoleCode().toUpperCase()).getUserLimit(),
						lrcByCode.get(roleReqDto.getRoleCode().toUpperCase()).getAssignedUsers()))
				.collect(Collectors.toList());

		checkIfReqRoleComplianceWithUserLimitAssignedUser(results);

		EmployeeDao employee = userService.getEmployeeDetailsWithErrorCheck(authUser.getUsername());
		EmployeeRoleMappingDaoExt employeeRoleMapping = employeeRoleMappingRepository
				.findOneByEmployeeEmployeeCodeAndIsPrimaryTrue(employee.getEmployeeCode());

		// remove custom update
		// CANCEL All existing PENDING task
		List<RoleLimitRequestDetailsDao> roleLimitReqDtlsListToCancel = roleLimitReqDetailsRepo
				.findByStatusAndLocationCode(RoleLimitRequestStatus.PENDING.name(), getLocationCode());
		roleLimitReqDtlsListToCancel.forEach(reqDtls -> reqDtls.setStatus(RoleLimitRequestStatus.CANCELLED.name()));
		roleLimitReqDetailsRepo.saveAll(roleLimitReqDtlsListToCancel);

		List<RoleLimitRequestDao> roleLimitRequestListToCancel = roleLimitReqRepo
				.findByStatusAndReqLocationCode(RoleLimitRequestStatus.PENDING.name(), getLocationCode());
		roleLimitRequestListToCancel
				.forEach(roleLimitReq -> roleLimitReq.setStatus(RoleLimitRequestStatus.CANCELLED.name()));
		roleLimitReqRepo.saveAll(roleLimitRequestListToCancel);

		CountryDetailsDto countryDetailsDto = engineService.getCountryDetails(getLocationCode());

		Integer reqDocNo = userDocService.getDocNumber(getLocationCode(),
				countryDetailsDto.getFiscalYear().shortValue(), UserDocTypeEnum.ROLE_LMT_REQ.name());

		RoleLimitRequestDao responseHeader = setRoleLimitHeader(roleLimitRequestDto, authUser, employee,
				employeeRoleMapping, reqDocNo, countryDetailsDto.getFiscalYear().shortValue());

		setRoleLimitDetail(roleLimitRequestDto, responseHeader);

		return (RoleLimitResponseDto) MapperUtil.getDtoMapping(responseHeader, RoleLimitResponseDto.class);
	}

	private void setRoleLimitDetail(RoleLimitRequestDto roleLimitRequestDto, RoleLimitRequestDao responseHeader) {
		List<RoleLimitRequestDetailsDao> roleLimitRequestDetails = new ArrayList<>();
		for (RoleLimitReqDto rlr : roleLimitRequestDto.getRoleLimitReqDto()) {
			RoleDao role = new RoleDao();
			role.setRoleCode(rlr.getRoleCode());
			RoleLimitRequestDetailsDao rlrDetails = new RoleLimitRequestDetailsDao();
			rlrDetails.setRole(role);
			rlrDetails.setReqValue(rlr.getReqValue());
			rlrDetails.setStatus(RoleLimitRequestStatus.PENDING.name());
			rlrDetails.setRoleLimitRequest(responseHeader);
			roleLimitRequestDetails.add(rlrDetails);
		}
		roleLimitReqDetailsRepo.saveAll(roleLimitRequestDetails);
	}

	private RoleLimitRequestDao setRoleLimitHeader(RoleLimitRequestDto roleLimitRequestDto, AuthUser authUser,
			EmployeeDao employee, EmployeeRoleMappingDaoExt employeeRoleMapping, Integer reqDocNo, Short fiscalYear) {
		RoleLimitRequestDao header = new RoleLimitRequestDao();
		header.setReqDocNo(reqDocNo);
		header.setReqFiscalYear(fiscalYear);
		header.setReqLocationCode(authUser.getLocationCode());
		header.setReqDocDate(CalendarUtils.getCurrentDate());
		header.setRequesterName(employee.getEmpName());
		header.setOwnerType(authUser.getLocType());
		header.setRequestRemarks(roleLimitRequestDto.getRequestRemarks());
		header.setRequesterContactNo(employee.getMobileNo());
		header.setStatus(RoleLimitRequestStatus.PENDING.name());

		String address = StringUtils.EMPTY;

		StoreDetails storeDetails = locationService.getLocationDetailsFromLocationCode(employee.getLocationCode(), true)
				.getStoreDetails();

		// 584c6ea98b0780ef45023317d6c4ceb6736defb6 to fetch list<T> field from json
		if (storeDetails != null) {
			address = storeDetails.getAddressLines().stream().collect(Collectors.joining(DELIMTER));
		}

		header.setAddress(address);

		header.setRoleName(employeeRoleMapping.getRole().getRoleName());
		return roleLimitReqRepo.save(header);
	}

	private void checkIfReqRoleComplianceWithUserLimitAssignedUser(List<TempRoleDetails> results) {
		// check for requested role is not same as user_limit
		Boolean isReqEqLimit = results.stream().anyMatch(trd -> trd.getReqValue().equals(trd.getUserLimit()));
		if (isReqEqLimit)
			throw new ServiceException("Requested value is same as user limit for some role(s)", "ERR-UAM-037");

		// check for request role not less than assigned_users
		Boolean isReqGteLimit = results.stream().anyMatch(trd -> trd.getReqValue() < trd.getAssignedUsers());
		if (isReqGteLimit)
			throw new ServiceException("Requested value is less than assigned user for some role(s)", "ERR-UAM-038");
	}

	private List<LocationRoleConfigDao> checkIfRolesBelongToLocation(AuthUser authUser, Set<String> roleLimitToAssign) {
		List<LocationRoleConfigDao> roleLimits = locationRoleConfigRepository
				.findByLocationCode(authUser.getLocationCode());

		List<String> roleCodesAssigned = roleLimits.stream().map(lrc -> lrc.getRole().getRoleCode().toUpperCase())
				.collect(Collectors.toList());
		if (!roleCodesAssigned.containsAll(roleLimitToAssign))
			throw new ServiceException(SOME_ROLES_NOT_ASSIGNED_TO_STORE, ERR_UAM_031);
		return roleLimits;
	}

	private Set<String> checkIfRolesAreActive(RoleLimitRequestDto roleLimitRequestDto, AuthUser authUser) {
		Set<String> roleLimitToAssign = roleLimitRequestDto.getRoleLimitReqDto().stream()
				.map(rlr -> rlr.getRoleCode().toUpperCase()).collect(Collectors.toSet());
		List<String> inActiveRolesRequested = roleRepository.listByActiveRoleCodeIn(roleLimitToAssign);
		if (!inActiveRolesRequested.isEmpty()) {
			LOGGER.error("BTQ: {} requested for roles which are inactive: {}", authUser.getLocationCode(),
					inActiveRolesRequested);
			throw new ServiceException(SOME_ROLES_NOT_ASSIGNED_TO_STORE, ERR_UAM_031);
		}
		return roleLimitToAssign;
	}

	@Override
	public PagedRestResponse<List<RoleLimitResponseDto>> listAllRequests(String locationCode, String status,
			Integer docNo, Pageable pageable) {
		Example<RoleLimitRequestDao> criteria = listRequestsCriteria(locationCode, status, docNo);
		Page<RoleLimitRequestDao> requestsList = roleLimitReqRepo.findAll(criteria, pageable);
		if (requestsList.isEmpty())
			return new PagedRestResponse<>(requestsList);
		// @formatter:off
		List<RoleLimitResponseDto> requests = new ArrayList<>();
		requestsList.getContent().stream()
				.forEach(rl -> {
					
					RoleLimitResponseDto rlrd =  (RoleLimitResponseDto) MapperUtil.getDtoMapping(rl, RoleLimitResponseDto.class);
					rlrd.setAddress(convertStringToList(rl.getAddress()));

					requests.add(rlrd);
				});
		// @formatter:on	

		return new PagedRestResponse<>(requests, requestsList);
	}

	/**
	 * Returns criteria for list role limit request
	 * 
	 * @param locationCode location code to filter if provided
	 * @param status       status to filter if provided
	 * @return
	 */
	private Example<RoleLimitRequestDao> listRequestsCriteria(String locationCode, String status, Integer docNo) {
		RoleLimitRequestDao roleLimitRequest = new RoleLimitRequestDao();
		roleLimitRequest.setReqLocationCode(locationCode);
		roleLimitRequest.setStatus(status);
		roleLimitRequest.setReqDocNo(docNo);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		return Example.of(roleLimitRequest, matcher);
	}

	@Override
	public RequestDetailsDto getRoleRequestDetails(Integer id) {
		List<RequestedRoleDetails> roleDetails = roleLimitReqDetailsRepo.getRoleDetails(id);
		RequestDetailsDto requestDetailsDto;

		Optional<RoleLimitRequestDao> roleLimitRequests = roleLimitReqRepo.findById(id);
		RoleLimitRequestDao rlrd;

		if (roleLimitRequests.isPresent()) {
			requestDetailsDto = (RequestDetailsDto) MapperUtil.getDtoMapping(roleLimitRequests.get(),
					RequestDetailsDto.class);
			rlrd = roleLimitRequests.get();
		} else {
			throw new ServiceException("Record(s) not found.", ERR_UAM_002);
		}

		requestDetailsDto.setAddress(convertStringToList(rlrd.getAddress()));

		Set<RequestedRoleDetails> reqRoleDetails = new HashSet<>();
		reqRoleDetails.addAll(roleDetails);
		requestDetailsDto.setRequestedRoleDetails(reqRoleDetails);

		return requestDetailsDto;
	}

	private List<String> convertStringToList(String str) {
		if (StringUtils.isBlank(str))
			return new ArrayList<>();
		String[] strArray = str.split(DELIMTER);
		return Arrays.asList(strArray);
	}

	@Override
	public void roleLimitChange(String locationCode, RoleChangeRequestDto roleChangeRequestDto) {

		List<LocationRoleConfigDao> rolesInLocation = locationRoleConfigRepository.findByLocationCode(locationCode);

		if (CollectionUtils.isEmpty(rolesInLocation)) {
			throw new ServiceException("No roles have been assigned to this store", "ERR-UAM-023");
		}

		Set<String> rolesAssigned = new HashSet<>();
		rolesInLocation.forEach(role -> rolesAssigned.add(role.getRole().getRoleCode().toUpperCase()));

		Set<String> rolesRequested = new HashSet<>();
		roleChangeRequestDto.getRoles().forEach(role -> rolesRequested.add(role.getRoleCode().toUpperCase()));

		if (!rolesAssigned.containsAll(rolesRequested)) {
			throw new ServiceException(SOME_ROLES_NOT_ASSIGNED_TO_STORE, ERR_UAM_031);
		}

		roleChangeRequestDto.getRoles().forEach(role -> rolesInLocation.forEach(roleInLocation -> {
			if (role.getRoleCode().equalsIgnoreCase(roleInLocation.getRole().getRoleCode())) {
				if (role.getReqValue() < roleInLocation.getAssignedUsers()) {
					throw new ServiceException("Requested limit is less than assigned limit", "ERR-UAM-045");
				}
				roleInLocation.setUserLimit(role.getReqValue());
			}
		}));

		locationRoleConfigRepository.saveAll(rolesInLocation);
	}

	@Override
	public void roleLimitApprove(Integer id, RoleLimitApproveDto roleLimitApproveDto) {

		Optional<RoleLimitRequestDao> roleLimitRequest = roleLimitReqRepo.findById(id);

		List<RoleLimitRequestDetailsDao> rolesRequested = roleLimitReqDetailsRepo.findByRoleLimitRequestId(id);

		if ((!roleLimitRequest.isPresent()) || CollectionUtils.isEmpty(rolesRequested))
			throw new ServiceException("Record(s) not found", ERR_UAM_002);

		if (!roleLimitRequest.get().getStatus().equalsIgnoreCase(RoleLimitRequestStatus.PENDING.name()))
			throw new ServiceException("Request is already processed", "ERR-UAM-051");

		RoleLimitRequestStatus status = RoleLimitRequestStatus.valueOf(roleLimitApproveDto.getStatus());

		// @formatter:off
		switch (status) {

			case REJECTED:
				rolesRequested.forEach(roleRequested -> roleRequested.setStatus(RoleLimitRequestStatus.REJECTED.name()));
				roleLimitReqDetailsRepo.saveAll(rolesRequested);
				setApprovalDetails(RoleLimitRequestStatus.REJECTED.name(), roleLimitApproveDto.getApprovalRemarks(),
						roleLimitRequest.get());
				break;
	
			case APPROVED:
				// TEMP DUMMY DOUBT?
				if (roleLimitApproveDto.getRoles().size() != rolesRequested.size())
					throw new ServiceException("Role(s) for approve are not same number as roles requested for approval",
							"ERR-UAM-053");
				setLocationCodeAndRoles(roleLimitRequest.get().getReqLocationCode(), roleLimitApproveDto, rolesRequested);
				setApprovalDetails(RoleLimitRequestStatus.APPROVED.name(), roleLimitApproveDto.getApprovalRemarks(),
						roleLimitRequest.get());
				break;
	
			case PARTIAL_APPROVED:
				// TEMP DUMMY DOUBT?
				if (roleLimitApproveDto.getRoles().size() >= rolesRequested.size())
					throw new ServiceException(
							"Role(s) for partial approve should not be same as roles requested for approval",
							"ERR-UAM-047");
				setLocationCodeAndRoles(roleLimitRequest.get().getReqLocationCode(), roleLimitApproveDto, rolesRequested);
				setApprovalDetails(RoleLimitRequestStatus.PARTIAL_APPROVED.name(), roleLimitApproveDto.getApprovalRemarks(),
						roleLimitRequest.get());
				break;
	
			case PENDING:
			case CANCELLED:
			default:
				return;
		}
		// @formatter:on

		NotificationRequestDto nr = new NotificationRequestDto();
		nr.setNotificationCode(NotificationConstants.REQ_SENT_ROLE_INCREASE);
		Map<String, String> prop = new HashMap<>();
		prop.put("DOC_DATE", CalendarUtils.formatToDisplayDate(roleLimitRequest.get().getReqDocDate()));
		nr.setProperties(prop);
//		engineServiceClient.publishEvent(nr);
	}

	/**
	 * @param locationCode        location code for which request is working upon
	 * @param roleLimitApproveDto DTO object containing role limit approval details
	 * @param rolesApproved       roles for which needs to update
	 */
	private void setLocationCodeAndRoles(String locationCode, RoleLimitApproveDto roleLimitApproveDto,
			List<RoleLimitRequestDetailsDao> rolesApproved) {

		RoleChangeRequestDto roleChangeRequestDto = new RoleChangeRequestDto();
		roleChangeRequestDto.setRoles(roleLimitApproveDto.getRoles());

		Set<String> roles = new HashSet<>();
		roleLimitApproveDto.getRoles().forEach(role -> roles.add(role.getRoleCode()));

		Set<String> rolesReq = new HashSet<>();
		rolesApproved.forEach(role -> rolesReq.add(role.getRole().getRoleCode()));

		if (!rolesReq.containsAll(roles))
			throw new ServiceException("Record(s) not found", ERR_UAM_002);

		roleLimitChange(locationCode, roleChangeRequestDto);

		roleLimitApproveDto.getRoles().forEach(role -> rolesApproved.forEach(roleRequested -> {
			if (role.getRoleCode().equalsIgnoreCase(roleRequested.getRole().getRoleCode())) {
				roleRequested.setStatus(RoleLimitRequestStatus.APPROVED.name());
				roleRequested.setApprovedValue(role.getReqValue());
			}
		}));

		rolesApproved.forEach(roleRequested -> {
			if (roleRequested.getStatus().equalsIgnoreCase(RoleLimitRequestStatus.PENDING.name()))
				roleRequested.setStatus(RoleLimitRequestStatus.REJECTED.name());
		});

		roleLimitReqDetailsRepo.saveAll(rolesApproved);
	}

	/**
	 * @param status           status to provide to the request
	 * @param approvalRemarks  remarks by admin while taking action on the request
	 * @param roleLimitRequest role limit request object
	 */
	private void setApprovalDetails(String status, String approvalRemarks, RoleLimitRequestDao roleLimitRequest) {

		roleLimitRequest.setStatus(status);
		roleLimitRequest.setApprovedBy(getAuthUser().getUsername()); // UNAME
		roleLimitRequest.setApprovalDate(CalendarUtils.getCurrentDate());
		roleLimitRequest.setApprovalRemarks(approvalRemarks);
		roleLimitReqRepo.save(roleLimitRequest);

	}

	@Override
	public Boolean isRequestOfSameStore(int id) {

		Boolean isvalid = false;
		Optional<RoleLimitRequestDao> roleLimitRequest = roleLimitReqRepo.findById(id);
		if (roleLimitRequest.isPresent()
				&& getLocationCode().equalsIgnoreCase(roleLimitRequest.get().getReqLocationCode()))
			isvalid = true;
		return isvalid;

	}

}
