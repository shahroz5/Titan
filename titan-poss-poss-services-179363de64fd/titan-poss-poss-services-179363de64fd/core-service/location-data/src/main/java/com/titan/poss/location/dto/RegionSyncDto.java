/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.OrganizationDao;
import com.titan.poss.location.dao.RegionDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class RegionSyncDto extends MasterSyncableEntity {

	private String regionCode;

	private String description;

	private String parentRegion;

	private String organization;

	private String configDetails;

	public RegionSyncDto() {

	}

	public RegionSyncDto(RegionDao region) {
		MapperUtil.getObjectMapping(region, this);
		if (region.getParentRegion() != null) {
			this.setParentRegion(region.getParentRegion().getRegionCode());
		} else {
			this.setParentRegion(null);
		}
		
		if (region.getOrganization() != null) {
			this.setOrganization(region.getOrganization().getOrgCode());
		} else {
			this.setOrganization(null);
		}
	}

	public RegionDao getRegionDao(RegionSyncDto regionSyncDto) {
		RegionDao region = (RegionDao) MapperUtil.getObjectMapping(regionSyncDto, new RegionDao());

		if (regionSyncDto.getParentRegion() != null) {
			RegionDao parent = new RegionDao();
			parent.setRegionCode(regionSyncDto.getParentRegion());
			region.setParentRegion(parent);
		}
		else {
			region.setParentRegion(null);
		}
		
		if (regionSyncDto.getOrganization() != null) {
			OrganizationDao orgDao = new OrganizationDao();
			orgDao.setOrgCode(regionSyncDto.getOrganization());
			region.setOrganization(orgDao);
		}
		else {
			region.setOrganization(null);
		}
		
		return region;

	}
}
