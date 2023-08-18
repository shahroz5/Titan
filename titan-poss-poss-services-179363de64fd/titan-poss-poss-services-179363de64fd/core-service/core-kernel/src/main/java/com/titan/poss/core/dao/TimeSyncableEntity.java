/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dao;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class TimeSyncableEntity extends TimeAuditableEntity {

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;
}
