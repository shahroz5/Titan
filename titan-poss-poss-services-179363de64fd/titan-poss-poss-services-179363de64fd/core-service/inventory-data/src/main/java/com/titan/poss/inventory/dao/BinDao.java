/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dao;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.inventory.base.BinBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@Entity
@Table(name = "bin_master")
@EqualsAndHashCode(callSuper = false)
public class BinDao extends BinBaseDao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id", columnDefinition = "uniqueidentifier")
	private String id;

}
