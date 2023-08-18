/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.config.base.ExchangeConfigMasterBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@Entity
@Table(name = "exchange_config_master")
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigMasterDao extends ExchangeConfigMasterBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "config_id", columnDefinition = "uniqueidentifier")
	private String configId;

}
