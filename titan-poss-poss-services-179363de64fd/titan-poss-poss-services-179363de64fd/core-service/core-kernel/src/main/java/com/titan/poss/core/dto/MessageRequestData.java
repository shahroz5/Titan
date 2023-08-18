/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MessageRequestData {

	private List<SyncData> syncData;

	@NotNull
	private String operation; // Process name like

}
