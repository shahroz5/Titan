package com.titan.poss.inventory.service;

import org.springframework.stereotype.Service;

@Service
public interface InventoryDocMasterService {

	Integer getDocNumber(short year, String locationCode, String docType);

}
