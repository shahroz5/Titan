package com.titan.poss.product.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.product.dao.LotDetailsIdDao;
import com.titan.poss.product.dao.StoneDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LotStoneDetailsDto {
	
	private String itemCode;
	
	private String lotNumber;
	
	private Short lineItemNo;
	
	private String stoneCode;
	
	private BigDecimal stoneWeight;
	
	private Short noOfStones;
	
	private String weightUnit;
	
	private String correlationId;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;

	

}
