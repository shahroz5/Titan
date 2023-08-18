
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.ItemDatasyncStageDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemBulkSyncDto extends MasterSyncableEntity {

	private String itemCode;

	private String description;

	private BigDecimal stdWeight;

	private BigDecimal stdValue;

	private String complexity;

	private String productGroup;

	private String productCategory;

	private String brandCode;

	private String itemType;

	private Integer leadTime;

	private String orgCode;

	private String parentItem;

	private String itemDetails;

	private String configDetails;

	private Boolean isEditable;

	private String taxClassCode;

	private String pricingType;

	private String pricingGroupType;

	private BigDecimal purity;

	private BigDecimal karat;

	private BigDecimal stoneCharges;

	private String currencyCode;

	private String weightUnit;

	private BigDecimal priceFactor;

	private String correlationId;

	private String transferType;
	
	private Boolean isSaleable;

	private Boolean isReturnable;
	
	private Boolean isFocItem;
	
	private String hsnSacCode;
	
	private String totCategory;

	public ItemBulkSyncDto() {

	}

	public ItemBulkSyncDto(ItemDatasyncStageDao itemDatasyncStageDao) {
		MapperUtil.getObjectMapping(itemDatasyncStageDao, this);

	}

	public ItemDatasyncStageDao getItemDao(ItemBulkSyncDto itemSyncDto) {
		ItemDatasyncStageDao itemDao = new ItemDatasyncStageDao();
		itemDao = (ItemDatasyncStageDao) MapperUtil.getObjectMapping(itemSyncDto, itemDao);

		return itemDao;
	}

	public List<ItemDatasyncStageDao> getItemDaoList(List<ItemBulkSyncDto> syncDtoList) {
		List<ItemDatasyncStageDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemBulkSyncDto itemSyncDto = new ItemBulkSyncDto();
			daoList.add(itemSyncDto.getItemDao(syncDto));
		});
		return daoList;
	}

	public List<ItemBulkSyncDto> getItemSyncDtoList(List<ItemDatasyncStageDao> daoList) {
		List<ItemBulkSyncDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ItemBulkSyncDto syncDto = new ItemBulkSyncDto(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}

}
