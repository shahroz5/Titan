/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class CreditNoteLegacyInboundCustomerDto {

	@NotNull(message = "locationCode cannot be null")
	private String locationCode;

	@NotNull(message = "customerNo cannot be null")
	private Integer customerNo;

	private String title;

	private String name;

	private String mailId;

	private String address1;

	private String address2;

	private Boolean isActive;

	private String mobileNo;

	private Date birthday;

	private Date anniversary;

	private String pinCode;

	private Date loyaltyDate;

	private Integer loyaltyPoints;

	private String loginId;

	private Date createdDate;

	private String lastModifiedId;

	private Date lastModifiedDate;

	private Date spouseBirthday;

	private String loyaltyNo;

	private Boolean canSendSms;

	private Integer interBtqCustomerNo;

	private String interBtqLocationCode;

	private String panCardNo;

	private String form60;

	private Boolean isHardCopySubmitted;

	private Date hardCopySubmittedDate;

	private String address3;

	private String catchmentArea;

	private String ulpMembershipId;

	private String tempUlpId;

	private Boolean isUlpIssued;

	private Boolean isUlpActive;

	private String idProofType;

	private String idProofNumber;

	private String townName;

	private Boolean isIndian;

	private Boolean isNri;

	private String gstRegNo;

	private String ulpState;

	private String ulpCity;

	private String panCardNoReentered;

	private Date panCardModifiedDate;

	private Boolean isEmailVerified;

	private Boolean isEmailValidationSuccess;

}
