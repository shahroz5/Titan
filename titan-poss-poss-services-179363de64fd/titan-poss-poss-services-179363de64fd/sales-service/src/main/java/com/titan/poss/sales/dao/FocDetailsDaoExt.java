/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.titan.poss.sales.base.FocDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b> foc_details </b> table
 * 
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity
@Table(name = "foc_details")
@EqualsAndHashCode(callSuper = false)
public class FocDetailsDaoExt extends FocDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sales_txn_id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDaoExt salesTxn;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "foc_scheme_id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private FocSchemesDaoExt focScheme;

}
