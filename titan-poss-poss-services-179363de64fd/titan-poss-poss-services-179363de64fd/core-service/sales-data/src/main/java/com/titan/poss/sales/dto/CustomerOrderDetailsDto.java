/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

import lombok.Data;

@Data
public class CustomerOrderDetailsDto {
	
	private String comOrderNumber;
	
	private String mobileNumber;
	
	private String customerName;
	
	private String itemCode;
	
	private BigDecimal grossWeight;
	
	private Short quantity;
	
	private String status;
	
	private Date comOrderDateTime;
	
	private Boolean autostn;
	
	private String requestType;
	
	private String requestBtq;
	
	private String requestBy;
	
	private Date deliveryDateTime;
	
	private BigDecimal orderValue;
	
	private String coStatus;
	
	private String lotNumber;
	
	private String rsoName;
	
	private Boolean isOccassion;
	
	private String specialOccasion;
	
	private Date dateOfOccasion;
	
	private Boolean ecelesteFlag;
	
	private String subType;
	
	private String cfaCode;
	
	private Boolean isDummyCode;

	private Boolean isSizing;

	private BigDecimal goldRate;
	
	private BigDecimal goldCharges;
	
	private BigDecimal makingCharges;
	
	private BigDecimal stoneCharges;
	
	private BigDecimal wtPerUnit;
	
	private BigDecimal stoneWt;

	private BigDecimal netWeight;

	private Boolean isItemCodeAvailable;

}
