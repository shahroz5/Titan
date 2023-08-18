/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.base;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
public class CustomerCouponBaseDao extends MasterSyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "coupon_type")
	private String couponType;

	@Column(name = "coupon_code")
	private String couponCode;

	@Column(name = "doc_date")
	@Temporal(TemporalType.DATE)
	private Date docDate;

	@Column(name = "reference_id")
	private String refId;

	@Column(name = "status")
	private String status;

	@Column(name = "expiry_date")
	@Temporal(TemporalType.DATE)
	private Date expiryDate;

	@Column(name = "attempts")
	private Integer attempts;

	@Column(name = "total_count")
	private Integer totalCount;

}
