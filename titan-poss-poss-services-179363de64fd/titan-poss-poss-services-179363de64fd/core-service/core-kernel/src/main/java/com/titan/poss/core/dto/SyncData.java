/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class SyncData implements Comparable<SyncData> {

	private Object data;
	private int order;

	@Override
	public int compareTo(SyncData syncData) {
		return (this.order - syncData.getOrder());
	}
}
