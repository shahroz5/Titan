/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;
import java.util.List;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@ApiModel(description = "Customer Dto")
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerDto extends CustomerLoyaltyDto {

	@ApiModelProperty(position = 1, value = "Customer Name", name = "customerName", required = false, example = "name")
	private String customerName;

	@ApiModelProperty(position = 2, value = "title", name = "title", allowableValues = "Mr, Mrs, M/s", required = false, example = "Mr")
	private String title;

	@ApiModelProperty(position = 3, value = "Mobile Number", name = "mobileNumber", required = false, example = "9880123456")
	private String mobileNumber;

	@ApiModelProperty(position = 4, value = "Email Id", name = "emailId", required = false, example = "abc@gmail.com")
	private String emailId;

	@ApiModelProperty(position = 5, value = "birthday", name = "birthday", required = false, example = "01-Jan-2000")
	private Date birthday;

	@ApiModelProperty(position = 6, value = "Spouse birthday", name = "ispouseBirthdayd", required = false, example = "01-Jan-2000")
	private Date spouseBirthday;

	@ApiModelProperty(position = 7, value = "anniversary", name = "anniversary", required = false, example = "01-Jan-2000")
	private Date anniversary;

	@ApiModelProperty(position = 8, value = "altContactNo", name = "altContactNo", required = false, example = "9880234567")
	private String altContactNo;

	@ApiModelProperty(position = 9, value = "Address Lines", name = "addressLines", required = false, example = "[\"House No\",\"Building name\",\"Street road\",\"Colony locality\"]")
	private List<String> addressLines;

	@ApiModelProperty(position = 10, value = "pincode", name = "pincode", required = false, example = "560059")
	private String pincode;

	@ApiModelProperty(position = 11, value = "city", name = "city", required = false, example = "bangalore")
	private String city;

	@ApiModelProperty(position = 12, value = "state", name = "state", required = false, example = "karnataka")
	private String state;

	@ApiModelProperty(position = 13, value = "country", name = "country", required = false, example = "india")
	private String country;
	
	@ApiModelProperty(position = 14, value = "zone", name = "zone", required = false, example = "zone1")
	private String zone;
	
	@ApiModelProperty(position = 15, value = "catchmentarea", name = "catchmentname", required = false, example = "zone")
	private String catchmentarea;

	@Override
	public String toString() {
//		return "CustomerDto [customerName=" + customerName + ", title=" + title + ", mobileNumber=" + mobileNumber
		return "CustomerDto [responseCode=" + getResponseCode() + ", responseMessage()=" + getResponseMessage()
				+ ", customerName=" + customerName + ", title=" + title + ", mobileNumber=" + mobileNumber
				+ ", emailId=" + emailId + ", birthday=" + birthday + ", spouseBirthday=" + spouseBirthday
				+ ", anniversary=" + anniversary + ", altContactNo=" + altContactNo + ", addressLines=" + addressLines
				+ ", pincode=" + pincode + ", city=" + city + ", state=" + state + ", country=" + country
				+ ", getUlpId()=" + getUlpId() + ", pointBalance=" + getPointBalance() + ", currentTier="
				+ getCurrentTier() + ", rnrollmentDate=" + getEnrollmentDate() + ", isMemberBlocked="
				+ getIsMemberBlocked() + ", zone=" + zone + ", catchmentarea=" + catchmentarea + "]";
	}
}
