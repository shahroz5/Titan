/* Copyright 2019. Titan Company Limited
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
public class BusinessDayBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "status")
	private String status;

	@Column(name = "business_date")
	@Temporal(TemporalType.DATE)
	private Date businessDate;

	@Column(name = "fiscal_year")
	private Integer fiscalYear;

	@Column(name = "skip_banking")
	private Boolean skipBanking;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "is_ghs_bod_done")
	private Boolean isGHSBODDone;

	@Column(name = "is_ghs_eod_done")
	private Boolean isGHSEODDone;
	
	@Column(name = "is_ghs_file_uploaded")
	private Boolean isGHSFileUploaded;

	@Column(name = "rate_fetch_attempts")
	private Short rateFetchAttempts;
	
//	@Column(name = "is_service_bod_done")
//	private Boolean isSERVICEBODDone;
//
//	@Column(name = "is_service_eod_done")
//	private Boolean isSERVICEEODDone;
	
	@Column(name = "is_service_file_uploaded")
	private Boolean isServiceFileUploaded;

}

