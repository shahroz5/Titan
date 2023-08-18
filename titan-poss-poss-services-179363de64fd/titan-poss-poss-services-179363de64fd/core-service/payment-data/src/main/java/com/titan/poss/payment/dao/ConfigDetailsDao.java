/*
Copyright 2019. 
Titan Company Limited All rights reserved.
  
*/
package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.payment.base.ConfigDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "payment_config_transaction_mapping")
@EqualsAndHashCode(callSuper = false)
public class ConfigDetailsDao extends ConfigDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "config_id", referencedColumnName = "config_id")
	private ConfigDao configId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "transaction_type", referencedColumnName = "transaction_type")
	private TransactionDao transactionDao;

}
