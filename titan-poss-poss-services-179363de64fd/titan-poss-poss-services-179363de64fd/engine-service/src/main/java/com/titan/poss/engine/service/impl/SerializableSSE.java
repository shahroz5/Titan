/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.service.impl;

import java.io.Serializable;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class SerializableSSE extends SseEmitter implements Serializable{
	
	private static final long serialVersionUID = 1L;

	public SerializableSSE() {
	    }

	    public SerializableSSE(Long timeout) {
	        super(timeout);
	    }
}
