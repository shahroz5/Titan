/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class DiscountProductGroupMappingBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "product_group_code")
	private String productGroupCode;

	@Column(name = "min_eligible_karat", columnDefinition = "decimal")
	private BigDecimal eligibleKarat;

	@Column(name = "karat_type")
	private String karatType;

	@Column(name = "product_type")
	private String productType;

}
