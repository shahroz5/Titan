/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.payment.dto.request;

import java.util.Set;

import com.titan.poss.payment.dto.ConfigDetailDto;
import com.titan.poss.payment.dto.UpdateConfigDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ConfigDetailsUpdate {

	private Set<ConfigDetailDto> addConfigs;

	private Set<UpdateConfigDto> updateConfigs;

	private Set<String> removeConfigs;

}
