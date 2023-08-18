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

import com.titan.poss.sales.base.GrnDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@Entity(name = "GRNDetailsExt")
@Table(name = "goods_return_details")
@EqualsAndHashCode(callSuper = false)
public class GrnDetailsDaoExt extends GrnDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "goods_return_id", referencedColumnName = "id")
	private GrnDaoExt grn;

	@Override
	public String toString() {
		return "GrnDetailsDaoExt [id=" + id + ", getItemCode()=" + getItemCode() + ", getLotNumber()=" + getLotNumber()
				+ ", getTotalQuantity()=" + getTotalQuantity() + ", getFinalValue()=" + getFinalValue()
				+ ", getInventoryId()=" + getInventoryId() + "]";
	}

}
