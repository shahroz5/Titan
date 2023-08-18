/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.core.dto;

import java.io.Serializable;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper=true)
public class ApplicableL3StoresData extends ApplicableL1L2StoresData implements Serializable{

	private static final long serialVersionUID = 1L;

	
}
