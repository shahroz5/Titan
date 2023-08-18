/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.core.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.titan.poss.core.domain.validator.ValueOfEnum;

import lombok.Data;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
public class MessageRequest {

	private MessageRequestData messageRequestData;
	private List<String> destinations;
	private String source; 
	@NotNull
	@ValueOfEnum(enumClass = DestinationType.class)
	private String destinationType;
	@NotNull
	@ValueOfEnum(enumClass = MessageType.class)
	private String messageType; // GEN or PRIORITY


}
