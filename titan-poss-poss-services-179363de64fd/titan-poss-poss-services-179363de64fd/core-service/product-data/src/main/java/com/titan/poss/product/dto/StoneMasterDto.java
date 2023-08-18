package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoneMasterDto {
	
	private String stoneCode;
	
	private String color;
	
	private BigDecimal stdWeight;
	
	private String stoneTypeCode;
	
	private String quality;
	
	private String shape;
	
	private BigDecimal stdValue;
	
	private BigDecimal ratePerCarat;
	
	private String currencyCode;
	
	private String weightUnit;
	
	private String correlationId;
	
	private String configDetails;
	
	private Boolean isActive;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	
	

}
