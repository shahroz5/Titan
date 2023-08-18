/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.payment.base.CashbackBaseDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity
@Table(name = "cashback_master")
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class CashbackDao extends CashbackBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "cashback_id", columnDefinition = "uniqueidentifier")
	private String id;

}
