/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao.base;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Base DAO class for <b>customer_payment</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class CustomerPaymentBaseDao extends SyncableEntity implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "customer_type")
	private String customerType;

	@Column(name = "customer_identifier_1")
	private String customerIdentifier1;

	@Column(name = "customer_identifier_2")
	private String customerIdentifier2;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "payment_type")
	private String paymentType;

	@Column(name = "instrument_no")
	private String instrumentNo;

	@Column(name = "paid_amount", columnDefinition = "decimal")
	private BigDecimal paidAmount;

	@Column(name = "cash_amount", columnDefinition = "decimal")
	private BigDecimal cashAmount;

	@Column(name = "txn_type")
	private String txnType;

	@Column(name = "payment_date")
	@Temporal(TemporalType.DATE)
	private Date paymentDate;// business date of payment confirmation

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "instrument_date", length = 23)
	private Date instrumentDate;

	@Column(name = "store_type")
	private String storeType;

	@Column(name = "state_code")
	private String stateCode;

	@Column(name = "country_code")
	private String countryCode;

	@Column(name = "company_name")
	private String companyName;
	
	@Column(name="location_pan_number")
	private String locationPanNumber;

}
