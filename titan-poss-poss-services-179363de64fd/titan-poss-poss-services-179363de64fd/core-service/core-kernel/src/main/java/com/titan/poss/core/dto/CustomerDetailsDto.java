/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class CustomerDetailsDto {
	
	private String locationCode;
	
	@JsonProperty("customerNo")
	private Integer customerId;
	
	private String title;
	
	@JsonProperty("name")
	private String customerName;
	
	@JsonProperty("mailId")
	private String emailId;
	
	private String address1;
	
	private String address2;
	
	private Boolean isActive;
	
	@JsonProperty("mobileNo")
	private String mobileNumber;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date birthday;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date anniversary;
	
	private Integer pinCode;
	
	@JsonProperty("loginId")
	private String createdBy;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;
	
	@JsonProperty("lastModifiedId")
	private String lastModifiedBy;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;
	
	private String stateCode;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date spouseBirthday;
	
	private String townCode;
	
	private Boolean canSendSMS;
	
	private String panCardNo;
	
	private String form60;
	
	private Boolean isHardCopySubmitted;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date hardCopySubmittedDate;
	
	private String catchmentArea;
	
	@JsonProperty("ulpMembershipId")
	private String ulpId;
	
	@JsonProperty("idProofType")
	private String idProof;
	
	@JsonProperty("idProofNumber")
	private String idNumber;
	
	private String gstRegNo;
	
	private String resTelNo;
	
	private String offTelNo;
	
	@JsonProperty("form60IdType")
	private String form60IdType;
	

	
}
