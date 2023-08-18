/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.sales.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Dto to add regular customer details.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
//@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RegularCustomerCreateDto extends AddressDetails {

	@PatternCheck(regexp = RegExConstants.CATCHMENT_NAME_REGEX, nullCheck = true)
	private String catchmentName;

	// date format
//	@DateTimeFormat(iso = ISO.DATE)
//	@Past(message = "birthday must be a past date")
//	@JsonFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private String birthday;

//	@DateTimeFormat(iso = ISO.DATE)
//	@Past(message = "spouseBirthday must be a past date")
//	@JsonFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private String spouseBirthday;

//	@DateTimeFormat(iso = ISO.DATE)
//	@PastOrPresent
//	@JsonFormat(pattern = "yyyy-MM-dd")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private String anniversary;

	@NotNull(message = "Please provide canSendSMS")
	private Boolean canSendSMS;

	@PatternCheck(regexp = RegExConstants.TELE_MOBILE_NO_REGEX)
	private String altContactNo;

	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50)
	private String idProof;

	private Boolean form60;

	@PatternCheck(regexp = RegExConstants.ALPHA_NUMERIC_REGEX_MAX_20)
	private String idNumber;

	private String form60Number;
	
	private String form60IdType;
	
	@NotNull
	private Boolean isHardCopySubmitted;

	@Override
	public String toString() {
		return "RegularCustomerCreateDto [catchmentName=" + catchmentName + ", birthday=" + birthday
				+ ", spouseBirthday=" + spouseBirthday + ", anniversary=" + anniversary + ", canSendSMS=" + canSendSMS
				+ ", altContactNo=" + altContactNo + ", idProof=" + idProof + ", form60=" + form60 + ", idNumber="
				+ idNumber + ", form60Number=" + form60Number + ", form60IdType=" + form60IdType
				+ ", isHardCopySubmitted=" + isHardCopySubmitted + "]";
	}

	

}
