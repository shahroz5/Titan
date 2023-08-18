/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountItemMappingSyncDto extends MasterSyncableEntity {

	private String id;

	private String discount;

	private String itemCode;

	private String lotNumber;

	private String locationCode;

	private Date startDate;

	private Date endDate;

	private Date previewStartDate;

	private Date previewEndDate;

	private Boolean isTransferredLocation;

	private Boolean isPreviewApplicable;

	private String regularConfigDetails;

	private String previewConfigDetails;

	private String correlationId;

	public DiscountItemMappingSyncDto() {

	}

	public DiscountItemMappingDao getDiscountItemDao(DiscountItemMappingSyncDto discountItemSyncDto) {
		DiscountItemMappingDao discountItem = new DiscountItemMappingDao();
		discountItem = (DiscountItemMappingDao) MapperUtil.getObjectMapping(discountItemSyncDto, discountItem);

		if (discountItemSyncDto.getDiscount() != null) {
			DiscountDao discountDao1 = new DiscountDao();
			discountDao1.setId(discountItemSyncDto.getDiscount());

			discountItem.setDiscount(discountDao1);
		} else {
			discountItem.setDiscount(null);
		}
		return discountItem;
	}

	public List<DiscountItemMappingDao> getDaoList(List<DiscountItemMappingSyncDto> discItemMappingSyncDtos) {
		List<DiscountItemMappingDao> itemMappingDaos = new ArrayList<>();
		discItemMappingSyncDtos.forEach(syncDto -> {
			DiscountItemMappingSyncDto dto = new DiscountItemMappingSyncDto();
			itemMappingDaos.add(dto.getDiscountItemDao(syncDto));
		});
		return itemMappingDaos;
	}

	public DiscountItemMappingSyncDto(DiscountItemMappingDao discountitem) {

		MapperUtil.getObjectMapping(discountitem, this);

		if (discountitem.getDiscount() != null) {
			this.setDiscount(discountitem.getDiscount().getId());
		} else {
			this.setDiscount(null);
		}
	}

	public List<DiscountItemMappingSyncDto> getSyncDtos(List<DiscountItemMappingDao> daoExts) {
		List<DiscountItemMappingSyncDto> syncDtoExts = new ArrayList<>();
		daoExts.forEach(dao -> {
			DiscountItemMappingSyncDto syncDtoExt = new DiscountItemMappingSyncDto(dao);
			syncDtoExts.add(syncDtoExt);
		});
		return syncDtoExts;

	}
	
	
}
