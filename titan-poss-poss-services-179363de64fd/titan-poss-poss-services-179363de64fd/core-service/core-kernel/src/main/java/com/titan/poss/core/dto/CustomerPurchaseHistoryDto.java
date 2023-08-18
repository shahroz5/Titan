package com.titan.poss.core.dto;

import java.math.BigDecimal;
import java.util.Date;

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
public class CustomerPurchaseHistoryDto {
	
	private String ItemCode;
	
	private String LotNo;
	
	private String ProductCategory;
	
	private Short Qty;
	
	private BigDecimal Wt;
	
	private String BTQ;
	
	private Integer docno;
	
	private Date Docdate;
	
	private BigDecimal PrediscountTotalValue;
	
	private String ProductType;
	
	private String StoneValue;
	
	private BigDecimal Karatage;
	
	private String Mobileno;
	
	private String TotalStones;
	
	private String cfaproductcode;
	
	private String HSN_Code;
	
	private Short fiscalYear;
	
	private String isGRN;
	
	//private BigDecimal PreDiscountValue;

}
