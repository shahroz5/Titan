/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.dao;

import java.io.Serializable;

import javax.persistence.Column;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class DatasyncId implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(columnDefinition = "uniqueidentifier")
	private String id;

	private String destination;

}
