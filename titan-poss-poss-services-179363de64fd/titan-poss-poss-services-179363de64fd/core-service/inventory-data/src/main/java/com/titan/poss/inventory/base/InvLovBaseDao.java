/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.inventory.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterAuditableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class InvLovBaseDao extends MasterAuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "lov_type")
	private String lovType;

	@Column(name = "code")
	private String code;

	@Column(name = "value")
	private String value;
}
