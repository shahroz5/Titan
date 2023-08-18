/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.OrganizationDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class OrganizationSyncDto extends MasterSyncableEntity {
	
	public OrganizationSyncDto() {
	}

	private String orgCode;

	private String description;

	private String parentOrganization;
	
	public OrganizationSyncDto(OrganizationDao organization) {
		MapperUtil.getObjectMapping(organization, this);
		if (organization.getParentOrganization() != null) {
			this.setParentOrganization(organization.getParentOrganization().getOrgCode());
		} else {
			this.setParentOrganization(null);
		}
	
	}
	
	public OrganizationDao getOrganizationDao(OrganizationSyncDto organizationSyncDto) {
		OrganizationDao organizationDao = (OrganizationDao) MapperUtil.getObjectMapping(organizationSyncDto, new OrganizationDao());

		if (organizationSyncDto.getParentOrganization() != null) {
			OrganizationDao parent = new OrganizationDao();
			parent.setOrgCode(organizationSyncDto.getParentOrganization());
			organizationDao.setParentOrganization(parent);
		}
		else {
			organizationDao.setParentOrganization(null);
		}
		return organizationDao;

	}
}
