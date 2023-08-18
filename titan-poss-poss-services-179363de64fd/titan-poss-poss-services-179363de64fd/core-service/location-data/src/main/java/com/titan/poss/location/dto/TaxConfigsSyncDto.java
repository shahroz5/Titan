/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.TaxConfigsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class TaxConfigsSyncDto extends MasterSyncableEntity {

	private String id;

	private String txnType;

	private String srcLocationTaxType;

	private String destLocationTaxType;

	private String srcLocationApplicableTax;

	private String destLocationApplicableTax;

	private String customerTaxType;

	private Boolean isSameState;

	private Boolean srcTaxApplicable;

	private String applicableTax;

	private String correlationId;
	
	public TaxConfigsDao getTaxConfigsDao(TaxConfigsSyncDto taxConfigsSyncDto) {
		return (TaxConfigsDao) MapperUtil.getObjectMapping(taxConfigsSyncDto, new TaxConfigsDao());
	}
	
	public TaxConfigsSyncDto getTaxConfigsSyncDto(TaxConfigsDao taxConfigsDao) {
		return (TaxConfigsSyncDto) MapperUtil.getObjectMapping(taxConfigsDao, new TaxConfigsSyncDto());
	}

}
