/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import java.util.Date;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * DTO class for add a temporary store employee details
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class StoreAddTemporaryUserDto extends BaseAddUserDto {

	@NotNull
	@Future
	Date resignationDate;

}
