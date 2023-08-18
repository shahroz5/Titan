/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dao.AuditableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.MetalPriceConfigDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class MetalPriceConfigSyncDto extends AuditableEntity {

	private String id;

	private String metalTypeCode; // will be populated from Code material_master

	private BigDecimal basePrice;

	private String priceType; // will be populated from code location_lov_master

	private Date applicableDate;

	private String remarks;

	private String currencyCode;

	public MetalPriceConfigDao getMetalPriceConfigDao(MetalPriceConfigSyncDto metalPriceConfigSyncDto) {
		return (MetalPriceConfigDao) MapperUtil.getObjectMapping(metalPriceConfigSyncDto, new MetalPriceConfigDao());
	}
}
