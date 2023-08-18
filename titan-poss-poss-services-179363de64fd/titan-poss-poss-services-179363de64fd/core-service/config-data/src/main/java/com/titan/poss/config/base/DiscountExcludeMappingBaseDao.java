/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

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
public class DiscountExcludeMappingBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "theme_code")
	private String themeCode;

	@Column(name = "exclude_type")
	private String excludeType;

	@Column(name = "is_excluded")
	private Boolean isExcluded;

	@Column(name = "from_value", columnDefinition = "decimal")
	private BigDecimal fromValue;

	@Column(name = "to_value", columnDefinition = "decimal")
	private BigDecimal toValue;

	@Column(name = "scheme_code")
	private String schemeCode;

	@Column(name = "src_sync_id", columnDefinition = "Integer")
	private Integer srcSyncId;

	@Column(name = "dest_sync_id", columnDefinition = "Integer")
	private Integer destSyncId;

}
