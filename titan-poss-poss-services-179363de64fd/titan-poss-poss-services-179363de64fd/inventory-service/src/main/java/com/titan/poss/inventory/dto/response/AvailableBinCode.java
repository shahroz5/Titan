/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.inventory.dto.response;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
public class AvailableBinCode {

	private String binCode;

	private Integer quantity;
}
