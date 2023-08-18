/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>customer_ulp</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "customer_ulp")
@EqualsAndHashCode(callSuper = false)
public class CustomerUlpDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ulp_id", columnDefinition = "NVARCHAR")
	private String ulpId;

	@Column(name = "point_balance", columnDefinition = "decimal")
	private BigDecimal pointBalance;

	@Column(name = "current_tier")
	private String currentTier;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "enrollment_date")
	private Date enrollmentDate;

	@Column(name = "is_member_blocked")
	private Boolean isMemberBlocked;

	@Column(name = "is_pulse_customer")
	private Boolean isPulseCustomer;

	@Column(name = "loyalty_details", columnDefinition = "NVARCHAR")
	private String loyaltyDetails;

}
