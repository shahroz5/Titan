/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.product.sync.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.product.dao.ItemTypeDao;
import com.titan.poss.product.dao.ProductGroupDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class ProductGroupSyncDto extends MasterSyncableEntity {

	private String productGroupCode;

	private String description;

	private String orgCode;

	private String configDetails;

	private String plainStudded;

	private String itemType;

	private String pricingType;

	private String pricingDetails;

	private Boolean isMia;

	private String plainStuddedTep;

	private String plainStuddedGrn;

	private String plainStuddedGrf;

	public ProductGroupSyncDto() {

	}

	public ProductGroupSyncDto(ProductGroupDao productGroupDao) {
		MapperUtil.getObjectMapping(productGroupDao, this);
		if (productGroupDao.getItemType() != null) {
			this.setItemType(productGroupDao.getItemType().getItemTypeCode());
		} else {
			this.setItemType(null);
		}
	}

	public ProductGroupDao getProductGroupDao(ProductGroupSyncDto productGroupSyncDto) {
		ProductGroupDao productGroupDao = new ProductGroupDao();
		productGroupDao = (ProductGroupDao) MapperUtil.getObjectMapping(productGroupSyncDto, productGroupDao);

		if (productGroupSyncDto.getItemType() != null) {
			ItemTypeDao itemTypeDao = new ItemTypeDao();
			itemTypeDao.setItemTypeCode(productGroupSyncDto.getItemType());
			productGroupDao.setItemType(itemTypeDao);
		} else {
			productGroupDao.setItemType(null);
		}
		return productGroupDao;
	}
}
