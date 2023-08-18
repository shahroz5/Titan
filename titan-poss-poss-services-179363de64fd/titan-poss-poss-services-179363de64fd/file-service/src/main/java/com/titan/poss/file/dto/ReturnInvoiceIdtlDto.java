/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ReturnInvoiceIdtlDto {
	
	private String type;
	
	private String constant1;
	
	private String l3BoutiqueCode;
	
	private Integer documentNumber1;
	
	private String productGroup;
	
	private String constant2;
	
	private Integer documentNumber2;
	
	private Date transactionDate;
	
	private Date fy;
	
	private String constant3;
	
	private String sapCode;
	
	private Integer slNo;
	
	private String variantType;
	
	private String itemCode;
	
	private BigDecimal unitPriceWithoutTax;
	
	private Integer qty;
	
	private BigDecimal weight;
	
	private BigDecimal totalValuePlusTax;
	
	private String lotNumber;
	
	private BigDecimal actualF1;
	
	private BigDecimal diamondWeight;
	
	private BigDecimal otherStoneWeight;
	
	private BigDecimal igstPer;
	
	private BigDecimal igstValue;
	
	private BigDecimal cgstPer;
	
	private BigDecimal cgstValue;
	
	private BigDecimal sgstPer;
	
	private BigDecimal sgstValue;
	
	private BigDecimal utgstPer;
	
	private BigDecimal utgstValue;
	
	private BigDecimal goNewWt;
	
	private BigDecimal ptNewWt;
	
	private BigDecimal stnNetWt;
	
	private BigDecimal siNetWt;
	
	private BigDecimal otherNetWt;
	
	private String fileId;
	

}
