/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.math.BigDecimal;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class EinvoiceItemDetailsDto {

	private Integer serialNo;

	private String hsnCode;

	private BigDecimal cgstAmount = BigDecimal.ZERO; 

	private BigDecimal sgstAmount = BigDecimal.ZERO; 

	private BigDecimal igstAmount= BigDecimal.ZERO; 

	private BigDecimal cessAmount= BigDecimal.ZERO; 

	private BigDecimal discount= BigDecimal.ZERO; 

	private Integer quantity; 
	
	private String unit;

	private BigDecimal unitPrice= BigDecimal.ZERO;

	private BigDecimal cessRate= BigDecimal.ZERO; 

	private BigDecimal igstRate= BigDecimal.ZERO;

	private BigDecimal sgstRate= BigDecimal.ZERO; 

	private BigDecimal cgstRate= BigDecimal.ZERO; 
	
	private String prdDesc;
	
    private  String  ordLineRef;
	
	private  String  orgCntry;
	
	private  String  prdSlno;
	
	private  String  bchDtls;
	
	private Integer freeQty;
	
	private BigDecimal preTaxVal=BigDecimal.ZERO;
	
	private BigDecimal cesNonAdvlAmt=BigDecimal.ZERO;
	
	private BigDecimal stateCesRt=BigDecimal.ZERO;
	
	private BigDecimal stateCesAmt=BigDecimal.ZERO;
	
	private BigDecimal stateCesNonAdvlAmt=BigDecimal.ZERO;
	
	private BigDecimal othChrg=BigDecimal.ZERO;
	
	private BigDecimal utgstAmount = BigDecimal.ZERO; 
	
	private BigDecimal utgstRate= BigDecimal.ZERO; 
	

}
