/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.dao.VendorDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class VendorConfigSyncDto extends MasterSyncableEntity {

	private String configId;

	private String vendor;

	private String locationCode;

	private String orgCode;

	private String configDetails;

	private String connectionDetails;

	private Boolean isActive;
	
	private String correlationId;

	public VendorConfigDao getVendorConfigDao(VendorConfigSyncDto vendorConfigSyncDto) {
		VendorConfigDao vendorConfigDao = new VendorConfigDao();
		vendorConfigDao = (VendorConfigDao) MapperUtil.getObjectMapping(vendorConfigSyncDto, vendorConfigDao);

		if (vendorConfigSyncDto.getVendor() != null) {
			VendorDao vendorDao = new VendorDao();
			vendorDao.setVendorCode(vendorConfigSyncDto.getVendor());

			vendorConfigDao.setVendor(vendorDao);
		} else {
			vendorConfigDao.setVendor(null);
		}
		return vendorConfigDao;
	}

	public VendorConfigSyncDto() {

	}

	public VendorConfigSyncDto(VendorConfigDao vendorConfigDao) {
		MapperUtil.getObjectMapping(vendorConfigDao, this);

		if (vendorConfigDao.getVendor() != null) {
			this.vendor = vendorConfigDao.getVendor().getVendorCode();
		} else {
			this.vendor = null;
		}
	}

	public List<VendorConfigSyncDto> getSyncDtoList(List<VendorConfigDao> daoList) {
		List<VendorConfigSyncDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			VendorConfigSyncDto vendorConfigSyncDto = new VendorConfigSyncDto(dao);
			syncDtoList.add(vendorConfigSyncDto);
		});

		return syncDtoList;
	}

	public List<VendorConfigDao> getDaoList(List<VendorConfigSyncDto> syncDtos) {
		List<VendorConfigDao> daoList = new ArrayList<>();
		syncDtos.forEach(dto -> {
			VendorConfigSyncDto syncDto = new VendorConfigSyncDto();
			daoList.add(syncDto.getVendorConfigDao(dto));
		});
		return daoList;
	}
}
