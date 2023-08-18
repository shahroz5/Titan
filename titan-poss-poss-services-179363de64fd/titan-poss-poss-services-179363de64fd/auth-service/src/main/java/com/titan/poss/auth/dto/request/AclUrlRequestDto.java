/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.auth.dto.request;

import java.util.Set;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AclUrlRequestDto {

	private Set<String> urls;
}
