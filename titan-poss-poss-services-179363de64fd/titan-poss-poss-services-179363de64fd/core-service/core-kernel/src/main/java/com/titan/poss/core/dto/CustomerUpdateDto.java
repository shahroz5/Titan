/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.Past;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Customer Update Dto")
@Data
public class CustomerUpdateDto {

	@ApiModelProperty(position = 1, value = "title", name = "title", required = false, example = "Mr")
	@Size(min = 1, max = 5, message = "min length is {min} and max length is {max} for title")
	@JsonIgnore
	private String title;

	@ApiModelProperty(position = 2, value = "Customer Name", name = "customerName", required = false, example = "name")
	@Size(min = 2, max = 50, message = "customerName min length {min} and max length is {max}")
	@PatternCheck(regexp = RegExConstants.NAME_REGEX, nullCheck = true)
	private String customerName;

	@ApiModelProperty(position = 3, value = "Mobile Number", name = "mobileNumber", required = false, example = "9880123456")
	@PatternCheck(regexp = RegExConstants.MOBILE_REGEX, nullCheck = false)
	private String mobileNumber;

	@ApiModelProperty(position = 4, value = "Email Id", name = "emailId", required = false, example = "name@gmail.com")
	private String emailId;

	@ApiModelProperty(position = 5, value = "birthday", name = "birthday", required = false, example = "2000-06-04T05:33:11.946Z")
	@Past(message = "birthday must be a past date")
	private Date birthday;

	@ApiModelProperty(position = 6, value = "Spouse birthday", name = "ispouseBirthdayd", required = false, example = "2000-06-04T05:33:11.946Z")
	@Past(message = "spouseBirthday must be a past date")
	private Date spouseBirthday;

	@ApiModelProperty(position = 7, value = "anniversary", name = "anniversary", required = false, example = "2020-06-04T05:33:11.946Z")
	@PastOrPresent
	private Date anniversary;

	@ApiModelProperty(position = 8, value = "altContactNo", name = "altContactNo", required = false, example = "9880234567")
	@PatternCheck(regexp = RegExConstants.TELE_MOBILE_NO_REGEX, message = "Invalid Alternate contact number", nullCheck = false)
	private String altContactNo;

	@ApiModelProperty(position = 9, value = "Address Lines", name = "addressLines", required = false, example = "[\"House No\",\"Building name\",\"Street road\",\"Colony locality\"]")
	private List<String> addressLines;

	@ApiModelProperty(position = 10, value = "pincode", name = "pincode", required = false, example = "560059")
	@Size(min = 6, max = 6, message = "pincode length is {max}")
	@PatternCheck(regexp = RegExConstants.PIN_CODE_REGEX, message = "Invalid pincode", nullCheck = false)
	private String pincode;

	@ApiModelProperty(position = 11, value = "city", name = "city", required = false, example = "bangalore")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid city", nullCheck = false)
	private String city;

	@ApiModelProperty(position = 12, value = "state", name = "state", required = false, example = "karnataka")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_250, message = "Invalid state", nullCheck = false)
	private String state;

	@ApiModelProperty(position = 13, value = "country", name = "country", required = false, example = "india")
	@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPC_DOT_HPN, message = "Invalid country", nullCheck = false)
	private String country;

}
