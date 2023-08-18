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
public class RevenueSummaryBaseDao extends SyncableEntity implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "business_date")
	@Temporal(TemporalType.DATE)
	private Date businessDate;

	@Column(name = "revenue_details", columnDefinition = "nvarchar")
	private String revenueDetails;

	@Column(name = "deposit_details", columnDefinition = "nvarchar")
	private String depositDetails;

	@Column(name = "ghs_revenue_details", columnDefinition = "nvarchar")
	private String ghsRevenueDetails;
	
	@Column(name = "service_revenue_details", columnDefinition = "nvarchar")
	private String serviceRevenueDetails;

}
