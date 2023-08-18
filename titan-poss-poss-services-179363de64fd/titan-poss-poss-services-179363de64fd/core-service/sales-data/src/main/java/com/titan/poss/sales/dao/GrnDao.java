/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.GrnBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "GRN")
@Table(name = "goods_return")
@EqualsAndHashCode(callSuper = false)
public class GrnDao extends GrnBaseDao{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@OneToOne(fetch = FetchType.LAZY)
	//@MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private CancelDao cancel;
}
