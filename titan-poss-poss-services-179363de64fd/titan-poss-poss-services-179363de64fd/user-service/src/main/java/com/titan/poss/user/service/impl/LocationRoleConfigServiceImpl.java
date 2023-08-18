/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.OwnerTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.user.dao.LocationRoleConfigDao;
import com.titan.poss.user.repository.LocationRoleConfigRepository;
import com.titan.poss.user.service.LocationRoleConfigService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserLocationRoleConfigService")
public class LocationRoleConfigServiceImpl implements LocationRoleConfigService {

	@Autowired
	private LocationRoleConfigRepository locationRoleConfigRepository;

	/**
	 * This method will copy roles of locationFormat to requested LocationCode and
	 * change isDefault to false.
	 * 
	 * @param locationCode
	 * @param locationFormat
	 * @param ownerType
	 */
	@Transactional
	@Override
	public void setLocationRoleLimit(String locationCode, String locationFormat, String ownerType) {

		// check if any roles assigned already,
		// if yes, throw error as roles should be assigned when a store get created
		List<LocationRoleConfigDao> locationRoleExists = locationRoleConfigRepository.findByLocationCode(locationCode);
		if (!locationRoleExists.isEmpty()) {
			throw new ServiceException("Record(s) already exist", "ERR-UAM-001");
		}

		OwnerTypeEnum ot = OwnerTypeEnum.valueOf(ownerType);
		String accessType = getAccessTypeByOwnerType(ot);

		// list roles assigned to the LF &
		List<LocationRoleConfigDao> locationRoleConfigList = locationRoleConfigRepository
				.listByLocCodeAndIsDefaultAndAccessType(locationFormat, true, accessType);

		// check if any roles assigned to that LF
		if (locationRoleConfigList.isEmpty()) {
			throw new ServiceException("Role(s) not found for the requested location format & owner type",
					"ERR-UAM-039", locationCode + " : " + locationFormat + " : " + ownerType);
		}

		List<LocationRoleConfigDao> newLocationRoleList = new ArrayList<>();
		locationRoleConfigList.forEach(locationRole -> {
			LocationRoleConfigDao locationRoleConfig = new LocationRoleConfigDao();
			locationRoleConfig.setRole(locationRole.getRole());

			// if any role is deactivated for LF,
			// assign that to location with user limit 0 & deactivate it
			if (BooleanUtils.isFalse(locationRole.getIsActive())) {
				locationRoleConfig.setUserLimit((short) 0);
				locationRoleConfig.setIsActive(locationRole.getIsActive());
			} else {
				locationRoleConfig.setUserLimit(locationRole.getUserLimit());
			}
			locationRoleConfig.setAssignedUsers(locationRole.getAssignedUsers());
			locationRoleConfig.setLocationCode(locationCode);
			locationRoleConfig.setDefault(false);

			newLocationRoleList.add(locationRoleConfig);
		});

		locationRoleConfigRepository.saveAll(newLocationRoleList);
	}

	private String getAccessTypeByOwnerType(OwnerTypeEnum ot) {
		String accessType = "____";
		switch (ot) {
		case L1:
			accessType = "__1__";
			break;
		case L2:
			accessType = "___1_";
			break;
		case L3:
			accessType = "____1";
			break;
		default:
			break;
		}
		return accessType;
	}

}
