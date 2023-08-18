/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.titan.poss.core.dao.SyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "payer_bank_config_details")
@EqualsAndHashCode(callSuper = false)
public class PayerDetailsDao extends SyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier", updatable = false)
	private String id;

	@ManyToOne
	@JoinColumn(name = "bank_name", referencedColumnName = "bank_name")
	private PayerBankDao payerBank;

	@ManyToOne
	@JoinColumn(name = "config_id", referencedColumnName = "id")
	private PayerConfigDao payerBankConfig;

}
