/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dto;

import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MessageFilter {

	private List<String> filterPolicy;
	private List<String> queueType;
}
