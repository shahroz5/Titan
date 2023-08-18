/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.sales.base.BusinessDayBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DAO for <b>Business Day</b> table.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "BusinessDayDao")
@Table(name = "business_day_master")
@EqualsAndHashCode(callSuper = false)
public class BusinessDayDao extends BusinessDayBaseDao {/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
