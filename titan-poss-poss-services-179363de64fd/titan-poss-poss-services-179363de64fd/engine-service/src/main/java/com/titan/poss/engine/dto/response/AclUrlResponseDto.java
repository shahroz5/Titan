/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.dto.response;

import java.util.List;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Data
public class AclUrlResponseDto {

	private String url;

	private List<String> transactionCodes;
}
