/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.dto.request.json;

import java.io.Serializable;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class AbDiscount implements Serializable {

	private static final long serialVersionUID = 1L;

	private Boolean preview;

	private Boolean regular;

	private Boolean ab;

	private Boolean postAB;

	private Boolean postRegular;

}
