/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.titan.poss.core.dao.TimeAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "location_queue")
public class LocationQueueDao extends TimeAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "is_active")
	private Boolean isActive;

	@Column(name = "last_sync_time")
	private Date lastSyncTime;

	@OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
	private List<LocationQueueMappingDao> locationQueueList;

	@PrePersist
	private void onPrePersist() {
		if (this.getIsActive() == null)
			this.setIsActive(true);
	}

}
