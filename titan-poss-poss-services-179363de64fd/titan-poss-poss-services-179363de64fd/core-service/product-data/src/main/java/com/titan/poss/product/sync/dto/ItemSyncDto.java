
/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ComplexityDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.dao.ProductGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ItemSyncDto extends MasterSyncableEntity {

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

	public ItemSyncDto() {

	}

	public ItemSyncDto(ItemDao itemDao) {
		MapperUtil.getObjectMapping(itemDao, this);
		if (itemDao.getComplexity() != null) {
			this.setComplexity(itemDao.getComplexity().getComplexityCode());
		} else {
			this.setComplexity(null);
		}

		if (itemDao.getProductCategory() != null) {
			this.setProductCategory(itemDao.getProductCategory().getProductCategoryCode());
		} else {
			this.setProductCategory(null);
		}

		if (itemDao.getProductGroup() != null) {
			this.setProductGroup(itemDao.getProductGroup().getProductGroupCode());
		} else {
			this.setProductGroup(null);
		}

		if (itemDao.getItemType() != null) {
			this.setItemType(itemDao.getItemType().getItemTypeCode());
		} else {
			this.setItemType(null);
		}

		if (itemDao.getParentItem() != null) {
			this.setParentItem(itemDao.getParentItem().getItemCode());
		} else {
			this.setParentItem(null);
		}

	}

	public ItemDao getItemDao(ItemSyncDto itemSyncDto) {
		ItemDao itemDao = new ItemDao();
		itemDao = (ItemDao) MapperUtil.getObjectMapping(itemSyncDto, itemDao);

		if (itemSyncDto.getComplexity() != null) {
			ComplexityDao complexityDao = new ComplexityDao();
			complexityDao.setComplexityCode(itemSyncDto.getComplexity());
			itemDao.setComplexity(complexityDao);
		} else {
			itemDao.setComplexity(null);
		}

		if (itemSyncDto.getProductCategory() != null) {
			ProductCategoryDao productCategoryDao = new ProductCategoryDao();
			productCategoryDao.setProductCategoryCode(itemSyncDto.getProductCategory());
			itemDao.setProductCategory(productCategoryDao);
		} else {
			itemDao.setProductCategory(null);
		}

		if (itemSyncDto.getProductGroup() != null) {
			ProductGroupDao productGroupDao = new ProductGroupDao();
			productGroupDao.setProductGroupCode(itemSyncDto.getProductGroup());
			itemDao.setProductGroup(productGroupDao);
		} else {
			itemDao.setProductGroup(null);
		}

		if (itemSyncDto.getItemType() != null) {
			ItemTypeDao itemTypeDao = new ItemTypeDao();
			itemTypeDao.setItemTypeCode(itemSyncDto.getItemType());
			itemDao.setItemType(itemTypeDao);
		} else {
			itemDao.setItemType(null);
		}

		if (itemSyncDto.getParentItem() != null) {
			ItemDao parent = new ItemDao();
			parent.setItemCode(itemSyncDto.getParentItem());
			itemDao.setParentItem(parent);
		} else {
			itemDao.setParentItem(null);
		}

		return itemDao;
	}

	public List<ItemDao> getItemDaoList(List<ItemSyncDto> syncDtoList) {
		List<ItemDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> {
			ItemSyncDto itemSyncDto = new ItemSyncDto();
			daoList.add(itemSyncDto.getItemDao(syncDto));
		});
		return daoList;
	}

	public List<ItemSyncDto> getItemSyncDtoList(List<ItemDao> daoList) {
		List<ItemSyncDto> syncDtoList = new ArrayList<>();
		daoList.forEach(dao -> {
			ItemSyncDto syncDto = new ItemSyncDto(dao);
			syncDtoList.add(syncDto);
		});
		return syncDtoList;
	}

}
