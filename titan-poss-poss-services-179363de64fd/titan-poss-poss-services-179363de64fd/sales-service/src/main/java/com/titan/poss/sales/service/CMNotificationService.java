/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.io.File;
import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LocationCacheDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CMNotificationService {
	
	void sendNotification(String txnId, String invoiceType, boolean isReprint, List<File> emailFiles, LocationCacheDto storeDetails);


}
