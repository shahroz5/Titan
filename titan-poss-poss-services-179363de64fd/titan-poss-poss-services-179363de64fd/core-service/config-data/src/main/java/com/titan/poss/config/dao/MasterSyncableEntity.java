/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class MasterSyncableEntity extends AuditableEntity {

	@Column(name = "is_active")
	public Boolean isActive;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;

	@PrePersist
	private void onPrePersist() {
		if (this.getSrcSyncId() == null && this.getDestSyncId() == null) {
			this.setSrcSyncId(0);
			this.setDestSyncId(0);
		}
		if (this.getIsActive() == null) {
			this.setIsActive(true);
		}

	}
}
