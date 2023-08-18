/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.titan.poss.config.base.RangeMasterBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@Entity
@Table(name = "range_master")
@EqualsAndHashCode(callSuper = false)
public class RangeMasterDao extends RangeMasterBaseDao implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(columnDefinition = "uniqueidentifier")
	private String id;

}
