/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.util.stream.Stream;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.dto.DataAuditDto;
import com.titan.poss.core.enums.CustomerTaxTypeEnum;
import com.titan.poss.core.enums.DestLocationTaxTypeEnum;
import com.titan.poss.core.enums.SrcLocationTaxTypeEnum;
import com.titan.poss.core.enums.TxnTaxTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.TaxConfigDto;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.TaxConfigValidationService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Component
public class TaxConfigValidationServiceImpl implements TaxConfigValidationService {

	@Autowired
	private DataAuditService dataAuditService;
	
	String flag = null;
	
	private static final String PRESENT = "present" ;
	

	@Override
	public boolean dataValidation(TaxConfigDto item) {
		if (!checkForNull(item)) {
			return false;
		}
		return checkForInvalidData(item);
	}


	private boolean checkForInvalidData(TaxConfigDto item) {
		
		Stream.of(CustomerTaxTypeEnum.values()).forEach(customerTaxType-> {
			if(customerTaxType.getValue().equals(item.getCustomerType()) || StringUtils.isEmpty(item.getCustomerType())) {
				flag = PRESENT;
			}
		});
		if(flag == null) {
		    saveErrorAudit(item, "Customer Type is not valid");
		    return false;
		}
		flag = null;
		Stream.of(SrcLocationTaxTypeEnum.values()).forEach(srcLocationTaxType-> {
			if(srcLocationTaxType.getValue().equals(item.getSourceBtqType()) || StringUtils.isEmpty(item.getSourceBtqType())) {
				flag = PRESENT;
			}
		});
		if(flag == null) {
		    saveErrorAudit(item, "Source Location Type is not valid");
		    return false;
		}
		flag = null;
		Stream.of(DestLocationTaxTypeEnum.values()).forEach(destLocationTaxType-> {
			if(destLocationTaxType.getValue().equals(item.getDestinationBtqType())|| StringUtils.isEmpty(item.getDestinationBtqType())) {
				flag = PRESENT;
			}
		});
		if(flag == null) {
		    saveErrorAudit(item, "Destination Location Type is not valid");
		    return false;
		}
		flag = null;
		Stream.of(TxnTaxTypeEnum.values()).forEach(txnTaxType-> {
			if(txnTaxType.getValue().equals(item.getTransactionType())) {
				flag = PRESENT;
			}
		});
		if(flag == null) {
		    saveErrorAudit(item, "Transaction Type is not valid");
		    return false;
		}
		if (!BooleanUtils.isTrue(item.getIsSameState()) && !BooleanUtils.isFalse(item.getIsSameState())) {
			saveErrorAudit(item, "is same state should be true or false");
			return false;
		}
		return true;
	}

	private boolean checkForNull(TaxConfigDto item) {
		if (StringUtils.isEmpty(item.getTransactionType())) {
			saveErrorAudit(item, "Transaction type cannot be empty");
			return false;
		}
//		if (StringUtils.isEmpty(item.getSourceBtqType())) {
//			saveErrorAudit(item, "Source Location Type cannot be empty");
//			return false;
//		}
//		if (StringUtils.isEmpty(item.getDestinationBtqType())) {
//			saveErrorAudit(item, "Destination Location Type cannot be empty");
//			return false;
//		}
//		if (StringUtils.isEmpty(item.getCustomerType())) {
//			saveErrorAudit(item, "Customer Type cannot be empty");
//			return false;
//			
//		}
		if (!BooleanUtils.isTrue(item.getIsSameState()) && !BooleanUtils.isFalse(item.getIsSameState())) {
			saveErrorAudit(item, "is Same state cannot be empty");
			return false;
		}
		return true;
	}

	private void saveErrorAudit(TaxConfigDto item, String errorMsg) {
		DataAuditDto dataAudit = new DataAuditDto();
		dataAudit.setPrimaryData(StringUtils.isEmpty(item.getTransactionType()) ? MapperUtil.getJsonString(item)
				: item.getTransactionType());
		dataAudit.setData(MapperUtil.getJsonString(item));
		dataAudit.setErrorMessage(errorMsg);
		dataAudit.setFileId(item.getFileAuditId());
		dataAudit.setErrorType(ErrorTypeEnum.ERROR.toString());
		dataAuditService.saveDataAudit(dataAudit);
	}

}
