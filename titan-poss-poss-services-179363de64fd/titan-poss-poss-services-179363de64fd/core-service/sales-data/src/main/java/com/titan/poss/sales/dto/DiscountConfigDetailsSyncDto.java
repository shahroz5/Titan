/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Sync DTO for <b>discount_config_details</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class DiscountConfigDetailsSyncDto extends SyncableEntity {

	private String id;
	private String discountCode;

	private String discountType;

	private String discountAttributes;

	private String basicCriteriaDetails;

	private String clubbableConfigDetails;

	private String grnConfigDetails;

	private String tepConfigDetails;

	private String orderConfigDetails;

	private String locationOfferDetails;

	private String linkedDiscountDetails;

	private String slabConfigDetails;

	private String highValueConfigDetails;

	private String appliedDiscountComponent;

	private String regularDiscountComponent;

	private String slabDiscountComponents;

	private String appliedDiscountMaster;

	private String appliedDiscountComponentType;

	private String productGroupDetails;

	private String productCategoryDetails;

	private String excludeConfigDetails;

	private String ghsExcludeProductGroupDetails;

	public DiscountConfigDetailsDao getDiscountConfigDao(DiscountConfigDetailsSyncDto discountConfigDetailsSyncDto) {
		return (DiscountConfigDetailsDao) MapperUtil.getObjectMapping(discountConfigDetailsSyncDto,
				new DiscountConfigDetailsDao());
	}

	public List<DiscountConfigDetailsDao> getDiscountConfigDaoList(List<DiscountConfigDetailsSyncDto> syncDtoList) {
		List<DiscountConfigDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(sync -> daoList.add(getDiscountConfigDao(sync)));
		return daoList;
	}
}
