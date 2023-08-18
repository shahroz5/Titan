/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;

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
public class ExchangeConfigExcludeMappingBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "item_code")
	private String itemCode;

	@Column(name = "theme_code")
	private String themeCode;

	@Column(name = "is_excluded")
	private Boolean isExcluded;

	@Column(name = "correlation_id", columnDefinition = "uniqueidentifier")
	private String correlationId;

}
