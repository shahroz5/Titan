/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Id;
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
public class CustomerTxnBaseDao extends MasterSyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "ulp_id")
	private String ulpId;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "customer_type")
	private String customerType;

	@Column(name = "title")
	private String title;

	@Column(name = "customer_name", columnDefinition = "NVARCHAR")
	private String customerName;

	@Column(name = "email_id")
	private String emailId;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "is_encrypted")
	private Boolean isEncrypted;

	@Column(name = "customer_id")
	private Integer customerId;

	@Column(name = "insti_tax_no")
	private String instiTaxNo;

	@Column(name = "cust_tax_no")
	private String custTaxNo;
	
	@Column(name = "cust_tax_no_old")
	private String custTaxNoOld;

	@Column(name = "passport_id")
	private String passportId;
}
