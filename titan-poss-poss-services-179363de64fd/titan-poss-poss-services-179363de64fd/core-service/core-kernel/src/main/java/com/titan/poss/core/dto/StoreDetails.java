/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class StoreDetails extends BaseFieldsValidator implements Serializable {

	private static final long serialVersionUID = 1L;
	@NotNull
	private String companyName;
	private String cinNumber;
	private String corporateAddress;
	private String regdOffice;
	private Boolean isWalkInsDetailsMandatory;
	private Integer noOfDays;
	private Integer numberOfDaysToDisplay;
	private List<String> addressLines;
	private String phoneNumber1;
	private String phoneNumber2;
	private String contactNumber;
	@NotNull
	private String pincode;
	private String boutiqueEmailId;
	@NotNull
	private Boolean isDial;
	private Short maxRateRetryAttempt;
	@NotNull
	private Boolean isEinvoiceEnabled;
	private Boolean isHallmarkingEnabled;
	private String hallmarkRegistrationNumber;
	private BigDecimal hallmarkGSTPercentage;
	private String reviewLinkURL;
	//@JsonIgnore
	private Boolean isPanCardVerifyIntegrationEnabled;
	@PrePersist
	private void prePersist() {
		if(this.reviewLinkURL==null) {
			this.reviewLinkURL = "";
		}
	}
	
	
	@PreUpdate
	private void onPersist() {
		if(this.reviewLinkURL==null) {
			this.reviewLinkURL = "";
		}
	}
	
}
