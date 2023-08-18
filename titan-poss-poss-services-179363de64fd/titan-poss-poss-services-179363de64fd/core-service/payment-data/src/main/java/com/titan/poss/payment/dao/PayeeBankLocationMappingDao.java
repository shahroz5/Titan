/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.payment.base.PayeeBankLocationMappingBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO class for <b>payee_bank_location_mapping</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "payee_bank_location_mapping")
@EqualsAndHashCode(callSuper = false)
public class PayeeBankLocationMappingDao extends PayeeBankLocationMappingBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
