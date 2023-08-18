package com.titan.poss.integration.dto;
import lombok.Data;
@Data
public class CmForCustomerReqDto {

	private String locationCode;
	private String itemCode;
	private String customerMobileNo;
	private String customerId;
	private Boolean isMigratedIgnored;
}
