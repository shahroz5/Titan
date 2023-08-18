/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang.BooleanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.UserOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.user.dao.AclDao;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.dao.RoleAclMappingDaoExt;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.RoleAclMappingSyncDtoExt;
import com.titan.poss.user.dto.SyncDataThreadLocal;
import com.titan.poss.user.dto.constants.LocationFormatEnum;
import com.titan.poss.user.dto.request.AddRoleDetailsDto;
import com.titan.poss.user.dto.request.LocationFormatRoleLimitDto;
import com.titan.poss.user.dto.request.UpdateRolesDetailDto;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.BaseRoleResponseDto;
import com.titan.poss.user.dto.response.RoleDto;
import com.titan.poss.user.dto.response.RoleListDto;
import com.titan.poss.user.dto.sync.RoleSyncDto;
import com.titan.poss.user.repository.AclRepository;
import com.titan.poss.user.repository.EmployeeRoleMappingRepositoryExt;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.repository.RoleAclMappingRepositoryExt;
import com.titan.poss.user.repository.RoleRepositoryExt;
import com.titan.poss.user.service.LocationService;
import com.titan.poss.user.service.RoleService;
import com.titan.poss.user.service.UserSyncDataService;
import com.titan.poss.user.util.RoleUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserRoleService")
public class RoleServiceImpl implements RoleService {

	@Autowired
	RoleRepositoryExt roleRepository;

	@Autowired
	RoleAclMappingRepositoryExt roleAclMappingRepository;

	@Autowired
	AclRepository aclRepository;

	@Autowired
	LocationRoleConfigRepository locationRoleConfigRepo;

	@Autowired
	EmployeeRoleMappingRepositoryExt employeeRoleRepository;

	@Autowired
	private UserSyncDataService userSyncDataService;

	@Autowired
	private RoleServiceImpl roleServiceImp;

	@Autowired
	private LocationService locationService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RoleServiceImpl.class);

	@Override
	public PagedRestResponse<List<RoleListDto>> listCorpRoles(String roleCode, String roleType, Boolean corpAccess,
			Boolean isActive, Pageable pageable) {
		String accessType = getAccessTypeLikeByRoleType(roleType);
		Page<RoleListDto> roleList = roleRepository.listRoles(roleCode, corpAccess, isActive, accessType, pageable);
		return new PagedRestResponse<>(roleList);
	}

	@Override
	public String getAccessTypeLikeByRoleType(String roleType) {
		String accessType = "_____";
		if (roleType != null) {
			switch (roleType) {

			case "CORP":
				accessType = "1____";
				break;
			case "REG":
				accessType = "_1___";
				break;
			case "L1":
				accessType = "__1__";
				break;
			case "L2":
				accessType = "___1_";
				break;
			case "L3":
				accessType = "____1";
				break;
			default:
				break;
			}

		}
		return accessType;
	}

	@Override
	public PagedRestResponse<List<RoleListDto>> listStoreRoles(String roleCode, String locationCode, Boolean isDefault,
			Boolean corpAccess, Boolean isActive, Pageable pageable) {

		Page<RoleListDto> roleList = roleRepository.getRolesForStore(roleCode, locationCode, isDefault, corpAccess,
				isActive, pageable);
		return new PagedRestResponse<>(roleList);

	}

	private void setRoleInLocFormats(RoleDto roleDto) {
		Set<LocationRoleConfigDao> locRoleConfigs = locationRoleConfigRepo
				.findByRoleRoleCodeAndIsDefault(roleDto.getRoleCode(), true);

		Set<LocationFormatRoleLimitDto> locationFormatRoleLimitDtoSet = new HashSet<>();

		locRoleConfigs.forEach(locRoleConfig -> {

			LocationFormatRoleLimitDto locationFormatRoleLimitDto = new LocationFormatRoleLimitDto();
			locationFormatRoleLimitDto
					.setLocationFormat(getLocationFormatfromString(locRoleConfig.getLocationCode()).name());
			locationFormatRoleLimitDto.setUserLimit(locRoleConfig.getUserLimit());

			locationFormatRoleLimitDtoSet.add(locationFormatRoleLimitDto);

		});

		roleDto.setRoleToLocationFormats(locationFormatRoleLimitDtoSet);
	}

	private LocationFormatEnum getLocationFormatfromString(String locationCode) {
		LocationFormatEnum locationFormatEnum = null;
		try {
			locationFormatEnum = LocationFormatEnum.valueOf(locationCode);
		} catch (IllegalArgumentException ex) {
			throw new ServiceException("Incorrect data in Database.", "ERR-CORE-036");
		}
		return locationFormatEnum;
	}

	@Override
	public RoleDto getRoleOfStore(String locationCode, String roleCode) {
		Optional<LocationRoleConfigDao> lrc = locationRoleConfigRepo
				.findOneByLocationCodeAndRoleRoleCodeAndIsDefault(locationCode, roleCode, false);
		if (!lrc.isPresent())
			throw new ServiceException("Record(s) not found", "ERR-UAM-002");
		RoleDao role = lrc.get().getRole();
		RoleDto roleDto = (RoleDto) MapperUtil.getDtoMapping(role, RoleDto.class);

		setRoleInLocFormats(roleDto);

		return setAcl(role, roleDto);

	}

	public List<String> listOwnerInfo(String accesssType) {

		List<String> ownerInfo = new ArrayList<>();
		try {
			String storeAccess = accesssType.substring(2, 5);
			if (storeAccess.charAt(0) == '1')
				ownerInfo.add(OwnerTypeEnum.L1.name());
			if (storeAccess.charAt(1) == '1')
				ownerInfo.add(OwnerTypeEnum.L2.name());
			if (storeAccess.charAt(2) == '1')
				ownerInfo.add(OwnerTypeEnum.L3.name());
		} catch (StringIndexOutOfBoundsException e) {
			LOGGER.error("{} is an invalid accessType", accesssType);
		}
		return ownerInfo;
	}

	@Override
	public RoleDto getRole(String roleCode) {
		RoleDao role = getRoleDetailsWithErrorCheck(roleCode);
		RoleDto roleDto = (RoleDto) MapperUtil.getDtoMapping(role, RoleDto.class);

		if (RoleUtil.isRoleBelongToBtq(role.getAccessType())) {
			setRoleInLocFormats(roleDto);
		}

		return setAcl(role, roleDto);
	}

	/**
	 * Setting ACL to provided role in roleDto
	 * 
	 * @param role    role object
	 * @param roleDto
	 * @return RoleDto
	 */
	private RoleDto setAcl(RoleDao role, RoleDto roleDto) {
		roleDto.setAclCodes(getAclBasedOnRole(role));
		return roleDto;
	}

	/**
	 * Returns ACL assigned to the role
	 * 
	 * @param role role object
	 * @return List<AclDto>
	 */
	private List<AclDto> getAclBasedOnRole(RoleDao role) {
		return roleAclMappingRepository.listAclByRoleCodeFields(role.getRoleCode());
	}

	/**
	 * Returns role object based on role code provided with null-safe
	 *
	 * @param roleCode primary key of Role
	 * @return Role
	 */
	@Override
	public RoleDao getRoleDetailsWithErrorCheck(String roleCode) {
		RoleDao role = roleRepository.findOneByRoleCode(roleCode);
		if (role == null)
			throw new ServiceException("Record(s) not found", "ERR-UAM-002");
		return role;
	}

	/**
	 * Returns role object based on role code provided
	 *
	 * @param roleCode primary key of Role
	 * @return Role
	 */
	private RoleDao getRoleFromRoleCode(String roleCode) {
		return roleRepository.findOneByRoleCode(roleCode);
	}

	private List<RoleDao> getRoleFromRoleName(String roleName) {
		return roleRepository.findByRoleName(roleName);
	}

	private List<LocationRoleConfigDao> setRoleToLocationRoleConfig(
			Set<LocationFormatRoleLimitDto> addRoleTolocationFormats, RoleDao role,
			Map<String, List<String>> locationsWithFormat) {

		List<LocationRoleConfigDao> rolesToAddForLocationFormat = new ArrayList<>();
		Map<String, Short> locationFormatWithLimit = new HashMap<>();

		Short userAssigned = 0;

		addRoleTolocationFormats.forEach(locFormat -> {

			locationFormatWithLimit.put(locFormat.getLocationFormat(), locFormat.getUserLimit());
			LocationRoleConfigDao lrc = new LocationRoleConfigDao();
			lrc.setLocationCode(locFormat.getLocationFormat());
			lrc.setRole(role);
			lrc.setUserLimit(locFormat.getUserLimit());
			lrc.setAssignedUsers(userAssigned);
			lrc.setDefault(true);

			rolesToAddForLocationFormat.add(lrc);
		});

		// locationsWithFormat iterate, fetch from dto's map location for max limit, add
		// to LocationRoleConfig
		locationsWithFormat.forEach((k, v) -> {
			Short userLimit = locationFormatWithLimit.get(k);
			v.forEach(loc -> {
				LocationRoleConfigDao lrc = new LocationRoleConfigDao();
				lrc.setLocationCode(loc);
				lrc.setRole(role);
				lrc.setUserLimit(userLimit);
				lrc.setAssignedUsers(userAssigned);
				lrc.setDefault(false);

				rolesToAddForLocationFormat.add(lrc);
			});
		});

		return rolesToAddForLocationFormat;
	}

	private void roleToLocationRoleConfig(Set<LocationFormatRoleLimitDto> addRoleToLocationFormats, RoleDao role,
			Boolean isAddRole, Map<String, List<String>> locationsWithFormat) {

		List<LocationRoleConfigDao> locationFormatsToAddRole;

		if (BooleanUtils.isTrue(isAddRole)) {
			locationFormatsToAddRole = setRoleToLocationRoleConfig(addRoleToLocationFormats, role, locationsWithFormat);

		} else {

			Set<String> locationCodes = new HashSet<>();
			addRoleToLocationFormats.forEach(locRole -> locationCodes.add(locRole.getLocationFormat()));

			locationFormatsToAddRole = locationRoleConfigRepo.listBasedOnRoleCodeAndLocation(role.getRoleCode(),
					locationCodes);

			addRoleToLocationFormats.forEach(roleToLf -> locationFormatsToAddRole.forEach(locFormat -> {
				if (roleToLf.getLocationFormat().equalsIgnoreCase(locFormat.getLocationCode())) {
					locFormat.setUserLimit(roleToLf.getUserLimit());

				}
			}));
		}
		locationRoleConfigRepo.saveAll(locationFormatsToAddRole);

	}

	@Override
	@Transactional
	public BaseRoleResponseDto addRoleDetails(AddRoleDetailsDto addRoleDetailsDto) {

		if (getRoleFromRoleCode(addRoleDetailsDto.getRoleCode()) != null)
			throw new ServiceException("Record(s) already exists", "ERR-UAM-001");

		List<RoleDao> rolesDescExisting = getRoleFromRoleName(addRoleDetailsDto.getRoleName());
		if (!rolesDescExisting.isEmpty()) {
			Map<String, String> roles = rolesDescExisting.stream()
					.collect(Collectors.toMap(RoleDao::getRoleCode, RoleDao::getRoleName));
			throw new ServiceException("Record(s) already exists", "ERR-UAM-076", roles, null);
		}

		RoleDao role = (RoleDao) MapperUtil.getDtoMapping(addRoleDetailsDto, RoleDao.class);
		role.setRoleCode(role.getRoleCode().toUpperCase());
		role.setIsActive(true);
		role.setAccessType(addRoleDetailsDto.getAccessType());
		role.setSrcSyncId(0);
		role.setDestSyncId(0);
		role = roleRepository.save(role);
		// data sync
		RoleSyncDto roleSyncDto = new RoleSyncDto(role);
		List<SyncData> syncDatas = new ArrayList<>();
		syncDatas.add(DataSyncUtil.createSyncData(roleSyncDto, 0));
		SyncDataThreadLocal.setIntialSyncData(syncDatas);

		BaseRoleResponseDto roleDto = (BaseRoleResponseDto) MapperUtil.getDtoMapping(role, BaseRoleResponseDto.class);
		setAcl(role, addRoleDetailsDto.getAddAclCodes(), null);

		if (RoleUtil.isRoleBelongToBtq(role.getAccessType())
				&& !CollectionUtils.isEmpty(addRoleDetailsDto.getAddRoleToLocationFormats())) {

			// Creating locationFilter object
			LocationFilterDto lfd = new LocationFilterDto();
			List<String> locationFormats = new ArrayList<>();
			addRoleDetailsDto.getAddRoleToLocationFormats().forEach(lf -> locationFormats.add(lf.getLocationFormat()));
			List<String> ownerTypes = listOwnerInfo(role.getAccessType());
			lfd.setLocationFormats(locationFormats);
			lfd.setOwnerTypeCodes(ownerTypes);

			// PENDING need to set LocationFilter DTO
			Map<String, List<String>> locationsWithFormat = locationService.getLocationByFilter(lfd);

			roleToLocationRoleConfig(addRoleDetailsDto.getAddRoleToLocationFormats(), role, true, locationsWithFormat);

			// Data sync
			Map<String, SyncStagingDto> syncStaging = roleServiceImp.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.ROLE_ADD, true);
			userSyncDataService.publishUserMessages(syncStaging);
		}

		SyncDataThreadLocal.unsetSyncData();
		return roleDto;
	}

	/**
	 * @param syncData
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> saveSyncStaging(List<SyncData> syncDataList, String operation,
			boolean isPublishToEGHS) {
		List<String> destinations = new ArrayList<>();
		return userSyncDataService.getUserSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * Activate/deactivate locations with respect to role object
	 * 
	 * @param role role object
	 */
	private void updateLocationsAssignedToRole(RoleDao role) {

		// only for store roles
		if (RoleUtil.isRoleBelongToBtq(role.getAccessType())) {

			List<LocationRoleConfigDao> locationRoleConfigList = locationRoleConfigRepo
					.findByRoleRoleCode(role.getRoleCode());

			// update location mapping for the role
			locationRoleConfigList.forEach(lrc -> lrc.setIsActive(role.getIsActive()));

			locationRoleConfigRepo.saveAll(locationRoleConfigList);

		}
	}

	@Override
	public Short countByRoleTypeAndCorpAccessTrue() {
		return roleRepository.countStoreCorpAccessRoles();
	}

	@Override
	@Transactional
	public void updateRoleDetails(RoleDao role, UpdateRolesDetailDto updateRolesDetailDto) {

		Boolean oldIsActive = role.getIsActive();
		role = (RoleDao) MapperUtil.getObjectMapping(updateRolesDetailDto, role);

		// take count from location_role_config sum, which will be faster PENDING Need
		// to discuss
		Integer count = 0;

		if ((updateRolesDetailDto.getIsActive() != null) && (!oldIsActive.equals(updateRolesDetailDto.getIsActive()))) {

			if (BooleanUtils.isFalse(updateRolesDetailDto.getIsActive())
					&& employeeRoleRepository.countByRoleRoleCode(role.getRoleCode()) > 0) {
				throw new ServiceException("Role requested for deactivation is assigned to some employees",
						"ERR-UAM-067", count);
			}
			// to activate/deactivate locations assigned to roles - (will happen only for
			// BTQ roles)
			updateLocationsAssignedToRole(role);

		}

		setAcl(role, updateRolesDetailDto.getAddAclCodes(), updateRolesDetailDto.getRemoveAclCodes());

		if (RoleUtil.isRoleBelongToBtq(role.getAccessType())
				&& !CollectionUtils.isEmpty(updateRolesDetailDto.getAddRoleToLocationFormats()))
			roleToLocationRoleConfig(updateRolesDetailDto.getAddRoleToLocationFormats(), role, false, null);
		role.setSrcSyncId(role.getSrcSyncId() + 1);
		role = roleRepository.save(role);
		// data sync
		if (RoleUtil.isRoleBelongToBtq(role.getAccessType())) {
			RoleSyncDto roleSyncDto = new RoleSyncDto(role);
			addToSyncDataThreadLocal(DataSyncUtil.createSyncData(roleSyncDto, 0));
			Map<String, SyncStagingDto> syncStaging = roleServiceImp.saveSyncStaging(SyncDataThreadLocal.getSyncData(),
					UserOperationCodes.ROLE_UPDATE, true);
			userSyncDataService.publishUserMessages(syncStaging);
		}
		SyncDataThreadLocal.unsetSyncData();
	}

	/**
	 * Set ACL to a role object
	 * 
	 * @param role           role object
	 * @param addAclCodes    ACL to add
	 * @param removeAclCodes ACL to remove
	 */
	private void setAcl(RoleDao role, Set<String> addAclCodes, Set<String> removeAclCodes) {
		if (CollectionUtils.isEmpty(addAclCodes) && CollectionUtils.isEmpty(removeAclCodes))
			return;

		List<AclDto> aclCodes = getAclBasedOnRole(role);
		List<String> acls = aclCodes.stream().map(AclDto::getAclCode).collect(Collectors.toList());

		if (!CollectionUtils.isEmpty(addAclCodes)) {
			if (!Collections.disjoint(acls, addAclCodes))
				throw new ServiceException("ACL(s) trying to add is already assigned to Role", "ERR-UAM-018");
			int countActiveAcl = aclRepository.countActiveAclIn(addAclCodes);
			if (countActiveAcl != addAclCodes.size())
				throw new ServiceException("Some requested Acl(s) are inactive or not present", "ERR-UAM-017");

			// not checking if role & acl access type is matching or not
			List<RoleAclMappingDaoExt> roleAcl2Add = getRoleAclObject(role, addAclCodes);

			List<RoleAclMappingDaoExt> roleAcl = roleAclMappingRepository.saveAll(roleAcl2Add);
			// data sync
			RoleAclMappingSyncDtoExt roleAclMappingSyncDto = new RoleAclMappingSyncDtoExt();
			addToSyncDataThreadLocal(DataSyncUtil.createSyncData(roleAclMappingSyncDto.getSyncDtoList(roleAcl), 1));

		}
		if (!CollectionUtils.isEmpty(removeAclCodes)) {
			List<String> removeAcls = removeAclCodes.stream().collect(Collectors.toList());
			if (!acls.containsAll(removeAcls))
				throw new ServiceException("ACL(s) trying to remove is not assigned to Role", "ERR-UAM-062");
			List<RoleAclMappingDaoExt> rolesToRemove = roleAclMappingRepository
					.findByRoleRoleCodeAndAclAclCodeIn(role.getRoleCode(), removeAcls);
			rolesToRemove.forEach(roleAcl -> roleAcl.setSyncTime(new Date().getTime()));
			roleAclMappingRepository.deleteAll(rolesToRemove);
			// data sync
			RoleAclMappingSyncDtoExt roleAclMappingSyncDto = new RoleAclMappingSyncDtoExt();
			addToSyncDataThreadLocal(
					DataSyncUtil.createSyncData(roleAclMappingSyncDto.getSyncDtoList(rolesToRemove), 2));
		}
	}

	/**
	 * @param roleAcl
	 * @param order
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

	/**
	 * Returns RoleAclMapping object to create based on role and ACL set provided
	 * 
	 * @param role     object
	 * @param aclInput
	 * @return
	 */
	private List<RoleAclMappingDaoExt> getRoleAclObject(RoleDao role, Set<String> aclInput) {
		List<RoleAclMappingDaoExt> roleAclMaps = new ArrayList<>();
		aclInput.forEach(aclCode -> {
			AclDao acl = new AclDao();
			acl.setAclCode(aclCode);
			RoleAclMappingDaoExt roleAclMapping = new RoleAclMappingDaoExt();
			roleAclMapping.setRole(role);
			roleAclMapping.setSyncTime(new Date().getTime());
			roleAclMapping.setAcl(acl);
			roleAclMaps.add(roleAclMapping);
		});
		return roleAclMaps;
	}

}
