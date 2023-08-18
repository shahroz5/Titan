/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;

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
public class AccountDetailsBaseDao extends SyncableEntity implements Serializable {/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name = "account_type")
	private String accountType;

	@Column(name = "account_no")
	private String accountNo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer_id", referencedColumnName = "customer_id")
	@JoinColumn(name = "location_code", referencedColumnName = "location_code")
	private CustomerLocationMappingDao customerLocationMap;

	@Column(name = "account_customer_id")
	private Integer accountCustomerId;

	@Column(name = "enrolled_location_code")
	private String enrolledLocationCode;

	@Column(name = "maturity_location_code")
	private String maturityLocationCode;

	@Column(name = "fiscal_year")
	private Integer fiscalYear;

	@Column(name = "scheme")
	private String scheme;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "maturity_date", length = 23)
	private Date maturityDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "enrollment_date", length = 23)
	private Date enrolledDate;

	@Column(name = "status")
	private String status;

	@Column(name = "passbook_no")
	private String passbookNo;

	@Column(name = "balance", columnDefinition = "DECIMAL")
	private BigDecimal balance;

	@Column(name = "discount", columnDefinition = "DECIMAL")
	private BigDecimal discount;

	@Column(name = "min_utilization_pct", columnDefinition = "DECIMAL")
	private BigDecimal minUtilizationPct;

	@Column(name = "is_proofs_available")
	private Boolean isProofsAvailable;

	@Column(name = "is_redeemable")
	private Boolean isRedeemable;

	@Column(name = "cash_collected", columnDefinition = "DECIMAL")
	private BigDecimal cashCollected;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "pdc_details", columnDefinition = "NVARCHAR")
	private String pdcDetails;

	@Column(name = "cfa_details", columnDefinition = "NVARCHAR")
	private String cfaDetails;

	@Column(name = "other_details", columnDefinition = "NVARCHAR")
	private String otherDetails;

}
