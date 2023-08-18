/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class GepConfigExcludeMappingDto {

	private String itemCode;

	private Boolean isExcluded;
	
	private String id;

	private String configId;
	
	private String themeCode;
	
	private String fileAuditId;

	private String createdBy;

	private Date createdDate;

	private String lastModifiedBy;

	private Date lastModifiedDate;
	
    private Integer srcSyncId;
	
	private Integer destSyncId;


}
