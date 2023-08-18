/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * DTO class for generating OTP without type, as type is hard code for this
 * scenario
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class OtpDetailsWoType extends BaseOtpDetails {

}
