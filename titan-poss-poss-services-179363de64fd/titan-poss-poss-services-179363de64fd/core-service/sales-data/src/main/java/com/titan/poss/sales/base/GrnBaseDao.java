/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;

import com.titan.poss.core.dao.SyncableEntity;

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
public class GrnBaseDao extends SyncableEntity implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Column(name = "metal_rate_details", columnDefinition = "NVARCHAR")
	private String metalRateDetails;

	@Column(name = "src_location_code")
	private String srcLocationCode;

	@Column(name = "foc_recover_value", columnDefinition = "decimal")
	private BigDecimal focRecoverValue;
	
	@Column(name = "rounding_variance", columnDefinition = "decimal")
	private BigDecimal roundingVariance;


	@Column(name = "is_migrated")
	private Boolean isMigrated;

	@PrePersist
	private void onPrePersist2() {
		if (this.isMigrated == null) {
			this.isMigrated = false;
		}
		
	}
	
}
