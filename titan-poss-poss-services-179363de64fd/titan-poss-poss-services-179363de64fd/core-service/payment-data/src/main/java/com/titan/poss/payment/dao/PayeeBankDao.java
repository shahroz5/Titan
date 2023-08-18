/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "payee_bank_master")
@EqualsAndHashCode(callSuper = false)
public class PayeeBankDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "bank_code")
	private String bankCode;

	@Column(name = "owner_type")
	private String ownerType;

	@Column(name = "address")
	private String address;

	@Column(name = "state_name")
	private String stateName;

	@Column(name = "town_name")
	private String townName;

	@Column(name = "contact_person")
	private String contactPerson;

	@Column(name = "mail_id")
	private String mailId;

}
