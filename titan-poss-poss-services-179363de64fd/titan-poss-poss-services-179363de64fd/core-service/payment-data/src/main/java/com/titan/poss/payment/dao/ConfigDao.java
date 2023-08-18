/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.payment.base.ConfigBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "payment_config_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class ConfigDao extends ConfigBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "config_id", columnDefinition = "uniqueidentifier")
	private String configId;

}
