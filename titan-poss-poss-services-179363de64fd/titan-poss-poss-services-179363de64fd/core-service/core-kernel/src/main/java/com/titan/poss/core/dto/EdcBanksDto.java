package com.titan.poss.core.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class EdcBanksDto {
	
	private String bankName;
	
	private String createdBy;
	
	private Long createdDate;
	
	private Boolean isActive;
	
    private String lastModifiedBy;
	
	private Long lastModifiedDate;

	private String locationCode;
	

}
