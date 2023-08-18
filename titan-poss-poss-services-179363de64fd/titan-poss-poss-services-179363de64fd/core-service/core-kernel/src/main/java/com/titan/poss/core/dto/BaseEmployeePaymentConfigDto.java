package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class BaseEmployeePaymentConfigDto {

	private String id;

	private Date approvalDate;

	private String employeeCode;

	private BigDecimal eligibleAmount;

	private Date validityDate;

	private String documentDetails;

	private String employeeDetails;

	private String status;

	private String config_type;

	private BigDecimal redeemedAmount;

	private String correlationId;

	private String loanConfigDetails;
	
	private Boolean isEmployeeConfiguredAtEposs;
}
