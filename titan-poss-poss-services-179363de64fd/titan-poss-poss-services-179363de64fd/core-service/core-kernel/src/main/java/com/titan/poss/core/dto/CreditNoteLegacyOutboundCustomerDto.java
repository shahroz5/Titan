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
public class CreditNoteLegacyOutboundCustomerDto {

	private String locationCode;

	private Integer customerNo;

	private String title;

	private String name;

	private String mailId;

	private String resTelNo;

	private String offTelNo;

	private String address1;

	private String address2;

	private Boolean isActive;

	private String remarks;

	private String mobileNo;

	private Date birthday;

	private Date anniversary;

	private String pinCode;

	private Date loyaltyDate;

	private Integer loyaltyPoints;

	private String loginId;

	private String createdDate;

	private String lastModifiedId;

	private String lastModifiedDate;

	@NotNull(message = "stateCode cannot be null")
	private Integer stateCode;

	private Date spouseBirthday;

	@NotNull(message = "townCode cannot be null")
	private Integer townCode;

	private String loyaltyNo;

	private String tataLoyaltyNumber;

	private Integer seqNo;

	// mark1
	private Integer oracleSeqNo;

	private Boolean canSendSms;

	private Integer interBtqCustomerNo;

	private String interBtqLocationCode;

	private String panCardNo;

	private String form60;

	private Boolean isHardCopySubmitted;

	private Date hardCopySubmittedDate;

	private String address3;

	private String catchmentArea;

	private String otherChannelMembershipId;

	private String otherChannelName;

	private String ulpMembershipId;

	private String tempUlpId;

	private Boolean isUlpIssued;

	private Boolean isUlpActive;

	private String idProofType;

	private String idProofNumber;

	private String idProofFileName;

	private String townName;

	private Boolean isIndian;

	private Boolean isNri;

	private String gstRegNo;

	private Boolean isGstEnabled;

	private String ulpState;

	private String ulpCity;

	// mark2
	private String panCardReentered;

	private Date panCardModifiedDate;

	private String form60IdType;

	private String form60Pincode;

	private Boolean isForm60HardCopy;

	private String form60NriIdType;

	private String form60NriIdNo;

	private String form60NriPinCode;

	private Boolean form60NriHardCopy;

	private Boolean isEmailVerified;

	private Boolean isEmailValidationSuccess;

	private Boolean isGSTValidated;

	private Boolean refusedMobileNo;

	private Integer isMigratedeGHS;

}
