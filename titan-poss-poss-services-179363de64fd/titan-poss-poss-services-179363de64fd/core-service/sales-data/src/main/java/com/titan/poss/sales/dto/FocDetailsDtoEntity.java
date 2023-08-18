/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import com.titan.poss.sales.base.FocDetailsBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class FocDetailsDtoEntity extends FocDetailsBaseDao {

	private static final long serialVersionUID = 1L;

	private String id;
	private String focSchemeId;
}
