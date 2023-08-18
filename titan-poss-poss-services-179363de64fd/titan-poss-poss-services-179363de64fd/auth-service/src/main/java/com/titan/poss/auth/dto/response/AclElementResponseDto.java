/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.auth.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AclElementResponseDto extends AclUrlResponseDto {

	private String element;
	private String authorisedStrategy;
	private String unauthorisedStrategy;
}
