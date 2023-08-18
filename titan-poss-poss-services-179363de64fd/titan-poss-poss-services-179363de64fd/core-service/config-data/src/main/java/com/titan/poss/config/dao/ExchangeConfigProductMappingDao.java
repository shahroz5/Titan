/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.config.base.ExchangeConfigProductMappingBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@Entity
@Table(name = "exchange_config_product_mapping")
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigProductMappingDao extends ExchangeConfigProductMappingBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne
	@JoinColumn(name = "config_id")
	private ExchangeConfigMasterDao exchangeConfig;

	@ManyToOne
	@JoinColumn(name = "range_id")
	private RangeMasterDao range;

}
