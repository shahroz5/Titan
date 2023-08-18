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

import com.titan.poss.core.dao.SyncableEntity;

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
public class CustomerVisitBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "business_date")
	@Temporal(TemporalType.DATE)
	private Date businessDate;

	@Column(name = "walkins")
	private Integer walkins;

	@Column(name = "invoice_count")
	private Integer noOfInvoice;

	@Column(name = "purchaser_count")
	private Integer purchaserCount;

	@Column(name = "non_purchaser_count")
	private Integer nonPurchaserCount;

}
