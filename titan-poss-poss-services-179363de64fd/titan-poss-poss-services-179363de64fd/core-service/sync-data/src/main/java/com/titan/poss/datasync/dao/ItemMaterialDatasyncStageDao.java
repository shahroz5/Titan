/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "item_material_mapping_datasync_stage")
@EqualsAndHashCode(callSuper = false)
public class ItemMaterialDatasyncStageDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

	@Column(name = "item_code")
	private String item;

	@Column(name = "material_code")
	private String material;

	@Column(name = "no_of_materials", columnDefinition = "decimal")
	private BigDecimal noOfMaterials;

	@Column(name = "transfer_type")
	private String transferType;
	
	@Column(name = "is_active")
	private Boolean isActive;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;
	
	@Column(name = "created_by")
	private String createdBy;

	@Column(name = "created_date")
	private Date createdDate;

	@Column(name = "last_modified_by")
	private String lastModifiedBy;

	@Column(name = "last_modified_date")
	private Date lastModifiedDate;
	
	@Column(name = "sync_time")
	private Long syncTime;
	
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
