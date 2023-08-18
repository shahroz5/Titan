/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.config.base.ExchangeConfigDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@Entity
@Table(name = "exchange_config_details")
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigDetailsDao extends ExchangeConfigDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "config_id")
	private ExchangeConfigMasterDao exchangeConfig;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "range_id")
	private RangeMasterDao range;

}
