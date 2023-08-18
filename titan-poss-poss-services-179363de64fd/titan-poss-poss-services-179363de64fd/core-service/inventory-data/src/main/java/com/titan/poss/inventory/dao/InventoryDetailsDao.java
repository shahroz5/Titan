/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import com.titan.poss.inventory.base.InventoryDetailsBaseDao;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * The persistent class for the inventory_details database table.
 * 
 */
@Data
@AllArgsConstructor
@Builder
@Entity
@Table(name = "inventory_details")
@EqualsAndHashCode(callSuper = false)
public class InventoryDetailsDao extends InventoryDetailsBaseDao {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	public InventoryDetailsDao() {
		// Empty Constructor
	}

	
	@PrePersist
	private void onPrePersist2() {
		if (this.getIsHallmarked() == null) {
			this.setIsHallmarked(false);
		}
		if (this.getRequestQuantity() == null) {
			this.setRequestQuantity((short)(0));
		}
	}


	@Override
	public String toString() {
		return "InventoryDetailsDao [id=" + id + ", getBinCode()=" + getBinCode() + ", getBinGroupCode()="
				+ getBinGroupCode() + ", getPreviousBinCode()=" + getPreviousBinCode() + ", getPreviousBinGroupCode()="
				+ getPreviousBinGroupCode() + ", getLotNumber()=" + getLotNumber() + ", getTotalQuantity()="
				+ getTotalQuantity() + "]";
	}

}