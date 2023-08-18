/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dto;

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
public class ApplicationVersionSearchDto {

	private String location;

	private String epossUiVersion;

	private String possUiVersion;

	private String possServiceVersion;

	private String databaseVersion;

	private ApplicationVersionStatusEnum status;

}
