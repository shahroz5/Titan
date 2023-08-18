/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base DAO for <b>discount_details</b> table
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class DiscountDetailsBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "discount_id", columnDefinition = "uniqueidentifier")
	private String discountId;

	@Column(name = "discount_code")
	private String discountCode;

	@Column(name = "discount_type")
	private String discountType;

	@Column(name = "discount_sub_type")
	private String discountSubType;

	@Column(name = "applicable_level")
	private String applicableLevel;

	@Column(name = "discount_value", columnDefinition = "Decimal")
	private BigDecimal discountValue;

	@Column(name = "discount_value_details", columnDefinition = "NVARCHAR")
	private String discountValueDetails;

	@Column(name = "reference_id")
	private String referenceId;

	@Column(name = "reference_type")
	private String referenceType;

	@Column(name = "status")
	private String status;
	
	@Column(name = "is_edited")
	private Boolean isEdited;

	@Column(name = "is_auto_applied")
	private Boolean isAutoApplied;

	@Column(name = "reason")
	private String reason;

	@Column(name = "clubbed_discount_id")
	private String clubbedDiscountId;

	@Column(name = "cumulative_discount_id")
	private String cumulativeDiscountId;

	@Column(name = "linked_discount_id")
	private String linkedDiscountId;

	@Column(name = "gep_config_details_id", columnDefinition = "uniqueidentifier")
	private String gepConfigDetailsId;

	@Column(name = "rivaah_card_discount_id", columnDefinition = "uniqueidentifier")
	private String rivaahCardDiscountId;
}
