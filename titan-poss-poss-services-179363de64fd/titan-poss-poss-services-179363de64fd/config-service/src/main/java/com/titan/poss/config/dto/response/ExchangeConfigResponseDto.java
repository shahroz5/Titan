/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.dto.response;

import java.util.Date;

import com.titan.poss.config.dto.request.ExchangeUpdateConfigDto;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class ExchangeConfigResponseDto extends ExchangeUpdateConfigDto {

	private String configId;

	private String configType;

	private Date createdDate;
}
