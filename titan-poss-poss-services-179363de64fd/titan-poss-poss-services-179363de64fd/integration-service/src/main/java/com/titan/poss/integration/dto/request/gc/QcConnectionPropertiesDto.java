/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.integration.dto.request.gc;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.titan.poss.core.domain.validator.BaseFieldsValidator;

import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel(description = "QC Connection properties Dto")
public class QcConnectionPropertiesDto extends BaseFieldsValidator {

	@JsonProperty("MerchantOutletName")
	private String merchantOutletName;

	@JsonProperty("AcquirerId")
	private String acquirerId;

	@JsonProperty("OrganizationName")
	private String organizationName;

	@JsonProperty("POSEntryMode")
	private Integer posEntryMode;

	@JsonProperty("POSTypeId")
	private Integer posTypeId;

	@JsonProperty("POSName")
	private String posName;

	@JsonProperty("TermAppVersion")
	private String termAppVersion;

	@JsonProperty("CurrentBatchNumber")
	private Integer currentBatchNumber;

	@JsonProperty("TerminalId")
	private String terminalId;

	@JsonProperty("MID")
	private String mid;

	@JsonProperty("UserName")
	private String userName;

	@JsonProperty("Password")
	private String password;

	@JsonProperty("ForwardingEntityId")
	private String forwardingEntityId;

	@JsonProperty("ForwardingEntityPassword")
	private String forwardingEntityPassword;

	@JsonProperty("DateAtClient")
	private String dateAtClient;

	@JsonProperty("IsForwardingEntityExists")
	private Boolean isForwardingEntityExists;

}
