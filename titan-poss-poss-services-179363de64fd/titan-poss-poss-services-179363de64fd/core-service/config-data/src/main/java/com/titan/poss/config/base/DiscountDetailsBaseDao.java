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
public class DiscountDetailsBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "min_value", columnDefinition = "decimal")
	private BigDecimal minValue;

	@Column(name = "max_value", columnDefinition = "decimal")
	private BigDecimal maxValue;

	@Column(name = "slab_name")
	private String slabName;

	@Column(name = "discount_category")
	private String discountCategory;

	@Column(name = "eligibility_details")
	private String eligibility;

	@Column(name = "regular_config_details", columnDefinition = "nvarchar")
	private String regularConfigDetails;

	@Column(name = "preview_config_details", columnDefinition = "nvarchar")
	private String previewConfigDetails;

	@Column(name = "ab_config_details", columnDefinition = "nvarchar")
	private String abConfigDetails;

	@Column(name = "co_config_details", columnDefinition = "nvarchar")
	private String coConfigDetails;

	@Column(name = "row_id")
	private Integer rowId;

	@Column(name = "is_single")
	private Boolean isSingle;

	@Column(name = "discount_percent")
	private String discountPercent;

	@Column(name = "config_details", columnDefinition = "nvarchar")
	private String configDetails;

	@Column(name = "rivaah_config_details", columnDefinition = "nvarchar")
	private String rivaahConfigDetails;

}
