package com.titan.poss.core.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class ItemStoneMappingDto {
	
//	@JsonProperty("ItemCode")
	private String itemCode;
	
//	@JsonProperty("NoOfStones")
	private Short noOfStones;
	
//	@JsonProperty("StoneCode")
	private String stoneCode;
	
//	@JsonProperty("LoginID")
	private String createdBy;
	
//	@JsonProperty("CreatedDate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date createdDate;
	
//	@JsonProperty("LastModifiedID")
	private String lastModifiedBy;
	
//	@JsonProperty("LastModifiedDate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
	private Date lastModifiedDate;
	
//	@JsonProperty("IsActive")
	private Boolean isActive;

}
	