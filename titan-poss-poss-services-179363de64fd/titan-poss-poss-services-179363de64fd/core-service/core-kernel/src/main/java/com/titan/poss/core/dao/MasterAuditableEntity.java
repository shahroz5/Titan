/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.core.dao;

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
public class MasterAuditableEntity extends AuditableEntity {

	@Column(name = "is_active")
	private Boolean isActive;

	@PrePersist
	private void onPrePersist() {
		if (this.getIsActive() == null)
			this.setIsActive(true);
	}
}
