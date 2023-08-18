/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.titan.poss.sales.dto.ManualBillTxnDetailsDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class AdvanceDto extends BaseAdvanceDto {

	private String remarks;
	private Date confirmedTime;

	private String currencyCode;

	private Integer cnDocNo;

	private List<CnGrfBasicDto> mergedCNs;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private Object frozenRateDetails;

	private ManualBillTxnDetailsDto manualBillDetails;

	private Object advanceDetails;

	private Date invokeTime;

	private Integer invokeCount;

	@Override
	public String toString() {
		return "AdvanceDto [remarks=" + remarks + ", confirmedTime=" + confirmedTime + ", currencyCode=" + currencyCode
				+ ", cnDocNo=" + cnDocNo + ", mergedCNs=" + mergedCNs + ", frozenRateDetails=" + frozenRateDetails
				+ ", advanceDetails=" + advanceDetails + ", getRemarks()=" + getRemarks() + ", getConfirmedTime()="
				+ getConfirmedTime() + ", getCurrencyCode()=" + getCurrencyCode() + ", getCnDocNo()=" + getCnDocNo()
				+ ", getMergedCNs()=" + getMergedCNs() + ", getFrozenRateDetails()=" + getFrozenRateDetails()
				+ ", getManualBillDetails()=" + getManualBillDetails() + ", getAdvanceDetails()=" + getAdvanceDetails()
				+ ", hashCode()=" + hashCode() + "]";
	}

}
