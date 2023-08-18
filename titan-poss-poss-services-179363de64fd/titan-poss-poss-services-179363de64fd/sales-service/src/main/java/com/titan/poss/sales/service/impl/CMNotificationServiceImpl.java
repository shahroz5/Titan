/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;
import java.io.File;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.ApplicationPropertiesUtil;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CMNotificationService;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.CustomerService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CMNotificationServiceImpl implements CMNotificationService{
	
	@Autowired
	private CustomerService customerService;
	
	@Autowired
	private SalesTxnRepositoryExt salesTxnRepo;
	
	@Autowired
	private IntegrationServiceClient intgServiceClient;
	
	@Autowired
	CustomerDocumentService customerDocumentService;
	
	@Value("${docs.file.source.path}")
	String fileBasePath;
	
	String txnId;
	
	@Override
	public void sendNotification(String txnId, String invoiceType, boolean isReprint, List<File> emailFiles, LocationCacheDto storeDetails) {
		CustomerDocumentsDao customerDocuments = customerDocumentService.getOldCustomerDocumentByInput(txnId, PrintDocumentTypeEnum.CM.name(), PrintFileTypeEnum.INVOICE_PRINT.name());
		SalesTxnDaoExt salesTxn = salesTxnRepo.findByIdAndLocationCode(txnId, customerDocuments.getLocationCode());
			
		Map<String, String> data = new HashMap<>();
		data.put("pincode", storeDetails.getStoreDetails().getPincode());
		data.put("address", String.join(",", storeDetails.getStoreDetails().getAddressLines()));
		data.put("phoneNumber", storeDetails.getStoreDetails().getPhoneNumber1());
		data.put("reviewLinkURL", storeDetails.getStoreDetails().getReviewLinkURL());
		data.put("boutiqueName", storeDetails.getSubBrandCode() + " " + storeDetails.getTownName() + " - "
				+ storeDetails.getDescription());
		data.put("brandCode", storeDetails.getSubBrandCode());
			
		Map<String, File> fileAttachments = new HashMap<>();
		emailFiles.stream()
		.forEach(file->fileAttachments.put(FilenameUtils.removeExtension(file.getName()), file));
		
		NotificationDto notificationDto = new NotificationDto();
		CustomerDetailsDto customer = customerService.getCustomer(salesTxn.getCustomerId());
		if (customer!=null) {
			data.put("name", customer.getCustomerName());
			if(customer.getEmailId() != null && !invoiceType.equals(InvoiceDocumentTypeEnum.PRINT.name()))
				notificationDto.setEmailIds(Set.of(customer.getEmailId()));
			if(customer.getMobileNumber() !=null && !isReprint && customerDocuments.getSrcSyncId()==1) {
				String apiEndPoint = "/api/integration/v2/document/download/file-path1?path=";
				String s3Url = ApplicationPropertiesUtil.getProperty("epossbase.url") + apiEndPoint + customerDocuments.getDocumentPath();
				data.put("s3InvoiceUrl", s3Url);
				notificationDto.setMobileNo(customer.getMobileNumber());
			}
		}
			NotificationTypeDataDto notf = new NotificationTypeDataDto(NotificationType.MAIL_INVOICE, data, null, fileAttachments);
			notificationDto.setNotificationTypeData(List.of(notf));
			notificationDto.setLocationCode(customerDocuments.getLocationCode());
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(salesTxn.getDocDate());
			notificationDto.setEmailSubject(storeDetails.getSubBrandCode()+  " Invoice - "+PrintDocumentTypeEnum.CM.name() +" - "+storeDetails.getDescription()+" - "+calendar.get(Calendar.YEAR));
			if(null!=notificationDto.getMobileNo() || null!=notificationDto.getEmailIds())
			intgServiceClient.sendNotification(notificationDto);
	}

}
