/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.base;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.SyncTimeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigStoneMappingBaseDao extends SyncTimeDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "stone_type_code")
	private String stoneTypeCode;

	@Column(name = "stone_quality")
	private String stoneQuality;

	@Column(name = "deduction_percent", columnDefinition = "DECIMAL")
	private BigDecimal dedutionPercent;
}
