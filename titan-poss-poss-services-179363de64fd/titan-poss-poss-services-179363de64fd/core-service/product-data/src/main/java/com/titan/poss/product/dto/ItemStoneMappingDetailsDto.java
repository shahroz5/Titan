package com.titan.poss.product.dto;



import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemStoneMappingDetailsDto {
	
	private String id;
	
	private String correlationId;	
	
	private String itemCode;
	
	private String stoneCode;
	
	private Short noOfStones;
	
	private String createdBy;
	
	private Date createdDate;
	
	private String lastModifiedBy;
	
	private Date lastModifiedDate;
	
	private Boolean isActive;

}
