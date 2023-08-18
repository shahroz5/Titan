/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import com.titan.poss.core.response.JsonData;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ApiModel(description = "Vendor Config Dto")
@Data
public class VendorConfigDto {

	@ApiModelProperty(position = 1, value = "configId", name = "configId", example = "DBD64F7C-3665-4836-B03D-977DC3588D86")
	private String configId;

	@ApiModelProperty(position = 2, value = "Vendor Code", name = "vendorCode", example = "QC")
	private String vendorCode;

	@ApiModelProperty(position = 3, value = "Location code", name = "locationCode", example = "PNA")
	private String locationCode;

	@ApiModelProperty(position = 4, value = "orgCode", name = "orgCode", example = "TJEW")
	private String orgCode;

	@ApiModelProperty(position = 5, value = "configDetails", notes = "Config Details required for contacting the third party API's. This is usually given by the third parties and inserted to our system through file upload or API.", name = "configDetails", example = "{\"TerminalId\": \"TQ:Tanishq-SCLP-POS-01\"}")
	private JsonData configDetails;

	@ApiModelProperty(position = 6, value = "connectionDetails", notes = "Connection details are data needed to connect with third party api's. This is the response from the third party initilization api", name = "connectionDetails", example = "{\"MerchantOutletName\":\"Tanishq-Corporate\",\"AcquirerId\":\"Tanishq SCLP\",\"OrganizationName\":\"Tanishq SCLP\",\"POSEntryMode\":2,\"POSTypeId\":1,\"POSName\":\"Tanishq-SCLP-POS-01\",\"TermAppVersion\":null,\"CurrentBatchNumber\":10678290,\"TerminalId\":\"TQ:Tanishq-SCLP-POS-01\",\"MID\":null,\"UserName\":\"manager\",\"Password\":\"welcome\",\"ForwardingEntityId\":\"tanishq.com\",\"ForwardingEntityPassword\":\"tanishq.com\",\"DateAtClient\":\"2020-06-18T11:27:06\",\"IsForwardingEntityExists\":true}")
	private String connectionDetails;

	@ApiModelProperty(position = 7, value = "isActive", name = "isActive", example = "true")
	private Boolean isActive;
}
