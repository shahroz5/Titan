/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.dao;

import com.titan.poss.core.dao.AuditableEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class ReportLovBaseDao  extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "lov_type")
	private String lovType;

	@Column(name = "code")
	private String code;

	@Column(name = "value")
	private String value;

	@Column(name = "is_active")
	private Boolean isActive;
}
