/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.OrganizationDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BrandSyncDto extends MasterSyncableEntity {

	private String brandCode;

	private String description;

	private String parentBrand;

	private String organization;

	private String configDetails;

	private String panCardDetails;

	private String customerDetails;

	private String taxDetails;

	private String cmDetails;
	
	private String brandTcsDetails;

	public BrandSyncDto() {

	}

	public BrandSyncDto(BrandDao brand) {
		MapperUtil.getObjectMapping(brand, this);
		this.organization = brand.getOrganization().getOrgCode();
		this.parentBrand = brand.getParentBrand().getBrandCode();
	}

	public BrandDao getBrandDao(BrandSyncDto brandSyncDto) {
		BrandDao brand = new BrandDao();
		brand = (BrandDao) MapperUtil.getObjectMapping(brandSyncDto, brand);

		OrganizationDao organizationDao = new OrganizationDao();
		organizationDao.setOrgCode(brandSyncDto.getOrganization());

		brand.setOrganization(organizationDao);

		BrandDao parentBrnd = new BrandDao();
		parentBrnd.setBrandCode(brandSyncDto.getParentBrand());

		brand.setParentBrand(parentBrnd);
		return brand;
	}
}
