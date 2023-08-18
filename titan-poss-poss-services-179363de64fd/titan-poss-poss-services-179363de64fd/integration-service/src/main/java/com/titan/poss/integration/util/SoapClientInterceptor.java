/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.client.WebServiceClientException;
import org.springframework.ws.client.support.interceptor.ClientInterceptor;
import org.springframework.ws.context.MessageContext;
import org.springframework.ws.soap.SoapBody;
import org.springframework.ws.soap.SoapEnvelope;
import org.springframework.ws.soap.SoapFault;
import org.springframework.ws.soap.SoapMessage;

import com.titan.poss.core.exception.ServiceException;


/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class SoapClientInterceptor implements ClientInterceptor{

	private static final Logger LOGGER = LoggerFactory.getLogger(SoapClientInterceptor.class);

	@Override
	public boolean handleRequest(MessageContext messageContext){
		return true;
	}

	@Override
	public boolean handleResponse(MessageContext messageContext){
		return true;
	}

	@Override
	public boolean handleFault(MessageContext messageContext){
		LOGGER.info("intercepted a fault...");
        SoapBody soapBody = getSoapBody(messageContext);
        SoapFault soapFault = soapBody.getFault();
        LOGGER.error(soapFault.getFaultStringOrReason());
        throw new ServiceException(soapFault.getFaultStringOrReason(),"Soap client exception");
        }

	private SoapBody getSoapBody(MessageContext messageContext) {
        SoapMessage soapMessage = (SoapMessage) messageContext.getResponse();
        SoapEnvelope soapEnvelope = soapMessage.getEnvelope();
        return soapEnvelope.getBody();
    }

	@Override
	public void afterCompletion(MessageContext messageContext, Exception ex) throws WebServiceClientException {
		/**
         * to do 
         */    		
	}
}
