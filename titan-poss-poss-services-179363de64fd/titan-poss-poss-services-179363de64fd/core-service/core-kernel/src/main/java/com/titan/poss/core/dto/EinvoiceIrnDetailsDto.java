/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EinvoiceIrnDetailsDto {

	private String transactionId;

	private String docNo;

	private Date docDate;

	private String sellerGstn;

	private String sellerName;

	private String sellerAddress1;

	private String sellerAddress2;

	private Integer sellerPinCode;

	private String sellerlocation;

	private String buyerGstn;

	private String buyerName;

	private String buyerAddress1;

	private String buyerAddress2;

	private Integer buyerPinCode;

	private String buyerlocation;

	private BigDecimal otherCharge = BigDecimal.ZERO;

	private List<EinvoiceItemDetailsDto> einvoiceItemDetailsDto;
    
	
	private String serviceType;
	
	private String id ;
	
	private String secrt ;
	
	private String gstin; ;
	
	private String batchId ;
	
	private String regRev;
	
	private String ecmGstin;
	
	private String userGstin ;
	
	private String erpRefid;
	
	private String irn ;
	
	private String sellerTrdNm ;
	
	private String sellerState ;
	
	private String sellerPh ;
	
	private String sellerEm ;
	
	private String buyerTrdNm ;
	
	private String buyerState ;
	
	private String buyerPh ;
	
	private String buyerEm ;
	
	private String mnHsn ;
	
	private String expDtls;
	
	private String dispDtls;
	
	private String shipDtls;
	
	private String addlDocDtls;
	
	private String refDtls;
	
	private String payDtls;
	
	BigDecimal stCesVal=BigDecimal.ZERO;

}
