/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SignatureFactory {

	String sign(String certPath, String input);
}
