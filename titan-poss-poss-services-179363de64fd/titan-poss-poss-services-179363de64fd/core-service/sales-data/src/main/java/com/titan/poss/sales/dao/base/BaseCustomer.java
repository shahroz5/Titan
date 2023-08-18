/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao.base;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BaseCustomer extends MasterSyncableEntity {

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

	@Column(name = "email_id", columnDefinition = "NVARCHAR")
	private String emailId;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "is_encrypted")
	private Boolean isEncrypted;

	@Column(name = "insti_tax_no")
	private String instiTaxNo;

	@Column(name = "cust_tax_no")
	private String custTaxNo;

	@Column(name = "passport_id")
	private String passportId;

	@Column(name = "email_validation_details", columnDefinition = "NVARCHAR")
	private String emailValidationDetails;
	
	@PrePersist
	private void onPrePersist2() {
		if (this.getIsEncrypted() == null)
			this.setIsEncrypted(true);
		if (this.isEmailIdValidationInitiated == null)
			this.setIsEmailIdValidationInitiated(false);
		if (this.isEmailIdValidated == null)
			this.setIsEmailIdValidated(false);
	}

	@Column(name = "is_insti_tax_no_verified")
	private Boolean isInstiTaxNoVerified;

	@Column(name = "is_cust_tax_no_verified")
	private Boolean iscustTaxNoVerified;
	
	@Column(name = "is_email_id_validation_initiated")
	private Boolean isEmailIdValidationInitiated;

	@Column(name = "is_email_id_validated")
	private Boolean isEmailIdValidated;
	
	@Column(name = "cust_tax_no_old")
	private String custTaxNoOld;
	
	@Column(name = "is_cust_tax_matched")
	private Boolean isCustTaxMatched;
	
	@Column(name = "is_form60_matched")
	private Boolean isForm60Matched;
	
	@Column(name = "panholder_name")
	private String panHolderName;


}
