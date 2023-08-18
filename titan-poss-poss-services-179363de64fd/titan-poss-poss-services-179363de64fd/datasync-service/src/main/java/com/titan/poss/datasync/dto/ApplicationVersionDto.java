/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

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
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ApplicationVersionDto {

	private String id;
	private String locationCode;
	private String status;
	private String epossUiVersion;
	private String possUiVersion;
	private String possServiceVersion;
	private String databaseVersion;
	private String downloadUrl;
	private boolean isPublished;

}
