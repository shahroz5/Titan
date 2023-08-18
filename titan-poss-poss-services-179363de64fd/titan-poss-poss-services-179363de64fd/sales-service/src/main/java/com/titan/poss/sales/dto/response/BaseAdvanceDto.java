/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto.response;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
public abstract class BaseAdvanceDto {

	private String id;
	private String status;
	private Integer customerId;
	private Date docDate;
	private Integer docNo;
	private Short fiscalYear;
	private String employeeCode;
	private BigDecimal finalValue;
	private String custTaxNo;
	private String custTaxNoOld;
	private String mobileNo;
	private String emailId;
	private String customerName;
	private String instiTaxNo;
	private String passportId;

	public BaseAdvanceDto(String id, String status, Integer customerId, Date docDate, Integer docNo, Short fiscalYear,
			String employeeCode, BigDecimal finalValue) {
		super();
		this.id = id;
		this.status = status;
		this.customerId = customerId;
		this.docDate = docDate;
		this.docNo = docNo;
		this.fiscalYear = fiscalYear;
		this.employeeCode = employeeCode;
		this.finalValue = finalValue;
	}

}
