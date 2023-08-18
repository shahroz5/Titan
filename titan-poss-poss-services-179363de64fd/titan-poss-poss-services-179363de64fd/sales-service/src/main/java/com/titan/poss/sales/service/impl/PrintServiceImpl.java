/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.titan.poss.core.domain.constant.CommonConstants;
import com.titan.poss.core.domain.constant.NotificationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.NotificationDto;
import com.titan.poss.core.dto.NotificationTypeDataDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.service.clients.IntegrationServiceClient;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.JsonUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PrintUtil;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.PrintFileTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.BankDepositDaoExt;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.OrderDaoExt;
import com.titan.poss.sales.dao.RevenueSummaryDaoExt;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.MetalRateListDto;
import com.titan.poss.sales.dto.PaymentDepositDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.OrderRepositoryExt;
import com.titan.poss.sales.repository.RevenueSummaryRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.CommonPrintService;
import com.titan.poss.sales.service.CommonTransactionService;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.PrintService;
import com.titan.poss.sales.utils.CMPrintUtil;
import com.titan.poss.sales.utils.SalesDateUtil;

import feign.Response;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class PrintServiceImpl implements PrintService {

	@Autowired
	private DocumentFactory documentFactory;

	@Autowired
	private Configuration freemarkerConfig;

	@Autowired
	BankDepositRepositoryExt bankDepositRepository;

	@Autowired
	CommonPrintService commonPrintService;

	@Autowired
	CustomerDocumentService customerDocumentService;

	@Autowired
	IntegrationService intgService;

	@Autowired
	private SalesTxnRepository salesTxnRepo;

	@Autowired
	private CancellationRepository cancelRepo;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private IntegrationServiceClient intgServiceClient;

	@Autowired
	private EngineService engineService;
	
	@Autowired
	private OrderRepositoryExt orderRepository;
	
	@Autowired
	private CommonTransactionService commonTransactionService;
	
	@Autowired
	private RevenueSummaryRepositoryExt revenueSummaryRepository;
	
	public static final String BANK_DEPOSIT = "bankDeposit";


	@Value("${docs.file.source.path}")
	String fileBasePath;

	/**
	 * This method will generate the pdf.
	 * 
	 * @param documentType
	 * @param txnId
	 * 
	 */
	@Override
	@Transactional
	public ResponseEntity<Resource> generateDocument(String documentTypeStr, String id, String fileTypeStr,
			String txnId, String invoiceTypeStr, Boolean lastTransactionPrint,PrintRequestDto printRequest,Boolean isReprint) {
		PrintDocumentTypeEnum documentType = PrintDocumentTypeEnum.valueOf(documentTypeStr);
		/*
		 * if (PrintDocumentTypeEnum.BILL_CANCELLATION.equals(documentType) && id ==
		 * null) { documentType =
		 * PrintDocumentTypeEnum.valueOf(PrintDocumentTypeEnum.CM_CANCELLATION.name());
		 * }
		 */
		String customerDocId = txnId;
		PrintFileTypeEnum fileType = PrintFileTypeEnum.valueOf(fileTypeStr);
		InvoiceDocumentTypeEnum invoiceType = InvoiceDocumentTypeEnum.valueOf(invoiceTypeStr);
		// if already there in DB, no need to generate again
		if (documentType.equals(PrintDocumentTypeEnum.BILL_CANCELLATION)  || documentType.equals(PrintDocumentTypeEnum.CREDIT_NOTE)) {
			throwErrorIfActiveRecordExists(id, documentType, fileTypeStr, invoiceType, lastTransactionPrint);
			customerDocId = id;
		} else if (documentType != PrintDocumentTypeEnum.DEPOSIT && documentType != PrintDocumentTypeEnum.COA
				&& !lastTransactionPrint)
			throwErrorIfActiveRecordExists(txnId, documentType, fileTypeStr, invoiceType, lastTransactionPrint);

		// call factory service to invoke appropriate service implementation w.r.t
		DocumentGenerator documentService = documentFactory.getDocumentService(documentType.name(), fileTypeStr);
		
		// get specific dto to bind FTL file
		PrintableDto printableDto = documentService.getPrintableDto(txnId, id);
		// if documentType is Deposit then list of transaction id's has to be passed.
		if(documentType == PrintDocumentTypeEnum.DEPOSIT) {
			printableDto = documentService.getPrintableto(printRequest);
		}

		// PrintableDto printableDto = documentService.getPrintableDto(txnId);

		// get document details to save in db and PDF creation
	
	
			CustomerDocumentDto customerDocuments = printableDto.getDocumentDetails();

		
		// generate PDF file to given path in local server
			ResponseEntity<Resource> response = null;
			String html = null;
			for(String template : printableDto.getTemplateName()){
				html = generateHtml(template , printableDto);
				String printHtml = removeLogoFromHtml(html);
				response = printPdfAndSave(template, printHtml,fileBasePath,
						customerDocuments.getDocumentPath(), isReprint, documentType);
			}

		// CASH, CHEQUE both
		if (documentType != PrintDocumentTypeEnum.DEPOSIT) {
			// file upload to online storage and save into DB.
			if(isReprint.equals(Boolean.FALSE)) {
				if (documentType == PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE
						|| documentType == PrintDocumentTypeEnum.GEP_DIGITAL_SIGNATURE) {
					customerDocuments.setTxnId(customerDocuments.getTxnId());
				}else {
					customerDocuments.setTxnId(customerDocId);
				}
				commonPrintService.uploadFileToOnlineBucketAndSaveToDb(customerDocuments);
				printRequest = null;
			}
		
		} else {
//			BankDepositDaoExt bankDepositDao = bankDepositRepository.findByIdAndLocationCode(txnId,
//					CommonUtil.getLocationCode());
			List<BankDepositDaoExt> bankDepositDaos = bankDepositRepository.findAllByIdAndLocationCode(printRequest.getTransactionIds(),CommonUtil.getLocationCode());
			List<BankDepositDaoExt> bankDepositListToUpdate = new ArrayList<>();
			if (fileType == PrintFileTypeEnum.CHEQUE_PRINT) {
				List<String> paymentCode = new ArrayList<>();
				paymentCode.add(PaymentCodeEnum.CHEQUE.name());
				paymentCode.add(PaymentCodeEnum.DD.name());
				bankDepositDaos.forEach(bankDepositDao -> {
				List<BankDepositDaoExt> depositDaoList = bankDepositRepository
						.findAllByPayeeBankNameAndDepositDateAndIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
								bankDepositDao.getPayeeBankName(), bankDepositDao.getDepositDate(), Boolean.FALSE,
								bankDepositDao.getLocationCode(), paymentCode);

				depositDaoList.forEach(bankDepositListToUpdate::add);});
			} else {
				List<String> paymentCode = new ArrayList<>();
				paymentCode.add(PaymentCodeEnum.CASH.name());
				 bankDepositDaos.forEach(bankDepositDao -> {
				List<BankDepositDaoExt> depositDaoList = bankDepositRepository
						.findAllByPayeeBankNameAndDepositDateAndIsBankingCompletedAndLocationCodeAndPaymentCodeIn(
								bankDepositDao.getPayeeBankName(), bankDepositDao.getDepositDate(), Boolean.FALSE,
								bankDepositDao.getLocationCode(), paymentCode);
				depositDaoList.forEach(bankDepositListToUpdate::add);
			});}
			bankDepositListToUpdate.forEach(bankDeposit -> {
				bankDeposit.setDocumentPath(customerDocuments.getDocumentPath());
				bankDeposit.setIsBankingCompleted(Boolean.TRUE);
				if(!bankDeposit.getDepositDate().equals(engineService.getBusinessDayInProgress().getBusinessDate())){
					RevenueSummaryDaoExt revenueSummary = revenueSummaryRepository
							.findByBusinessDateAndLocationCode(bankDeposit.getDepositDate(), CommonUtil.getLocationCode());
					List<BankDepositDaoExt> bankDepositDaoList = bankDepositRepository
							.findByLocationCodeAndDepositDateAndIsBankingCompleted(CommonUtil.getLocationCode(), bankDeposit.getDepositDate(), Boolean.TRUE);
					List<PaymentDepositDto> bankDepositDtoList = new ArrayList<>();
					if (!bankDepositDaoList.isEmpty()) {
						for (BankDepositDaoExt bankDeposits : bankDepositDaoList) {
							PaymentDepositDto paymentDeposit = new PaymentDepositDto();
							paymentDeposit.setDeposit(bankDeposits.getDepositAmount());
							paymentDeposit.setPaymentCode(bankDeposits.getPaymentCode());
							paymentDeposit.setTxnId(bankDeposits.getId());
							bankDepositDtoList.add(paymentDeposit);
						}
						JsonData depositJson = new JsonData();
						depositJson.setType(BANK_DEPOSIT);
						depositJson.setData(bankDepositDtoList);
						revenueSummary.setDepositDetails(MapperUtil.getJsonString(depositJson));
						revenueSummaryRepository.save(revenueSummary);
					}
				}
			});
			bankDepositRepository.saveAll(bankDepositListToUpdate);
		}

		
		// increase print count
		if (documentType == PrintDocumentTypeEnum.DEPOSIT) {
			invoiceTypeStr = "PRINT";
			increasePrintCountOnReprintForDeposit(printRequest, documentTypeStr, invoiceTypeStr);
		}
		else {
			increasePrintCountOnReprint(txnId, documentTypeStr, invoiceTypeStr);
			if(PrintDocumentTypeEnum.AB.name().equals(documentTypeStr) || PrintDocumentTypeEnum.CO.name().equals(documentTypeStr)) {
				if (invoiceType == InvoiceDocumentTypeEnum.MAIL || invoiceType == InvoiceDocumentTypeEnum.BOTH) {
					LocationCacheDto storeDetails = getStoreDetails(CommonUtil.getLocationCode());
					ResponseEntity<Resource> emailResponse = generateEmailDocument(html, customerDocuments);
					sendMailToInvoice(documentTypeStr, txnId, invoiceType, emailResponse, storeDetails);
				}
				if (invoiceType == InvoiceDocumentTypeEnum.MAIL)
					return ResponseEntity.ok().build();
			}
		}
		
		return response;

	}

	private String removeLogoFromHtml(String html) {
		Document doc = Jsoup.parse(html);
		Elements logoDivs = doc.select("div.page-header");
		if(null!=logoDivs) {
			Element logoDiv=logoDivs.first();
			if(null!=logoDiv)logoDiv.empty();
		}
		return doc.html();
	}

	private ResponseEntity<Resource> generateEmailDocument(String html, CustomerDocumentDto customerDocuments) {		
		String fileName = customerDocuments.getDocumentType().substring(customerDocuments.getDocumentType().lastIndexOf('/') + 1, customerDocuments.getDocumentType().length());
		String emailFileName = customerDocuments.getDocumentType().equals(PrintDocumentTypeEnum.AB.name()) ? "AdvanceBooking": "CustomerOrder";
		return PrintUtil.printPdfAndSave(html, fileBasePath,customerDocuments.getDocumentPath().replace(fileName+".pdf", emailFileName+".pdf"));
		
	}


	private ResponseEntity<Resource> printPdfAndSave(String template, String html, String fileBasePath, String documentPath,
			Boolean isReprint, PrintDocumentTypeEnum documentType) {
		int	noOfCopies = (documentType == PrintDocumentTypeEnum.CM && !isReprint  && !template.contains("_email")) 
				? getStoreDetails(CommonUtil.getLocationCode()).getPrintDetails().getNoOfInvoicecopiesforRegularOrQuickCM() 
						: 1;
		if (noOfCopies == 1) {
			return PrintUtil.printPdfAndSave(html, fileBasePath,documentPath);
		}else {
			return CMPrintUtil.printPdfAndSave(html, fileBasePath,documentPath, noOfCopies);
		}
	}

	public void sendMailToInvoice(String documentType, String txnId, InvoiceDocumentTypeEnum invoiceType, ResponseEntity<Resource> response, 
			LocationCacheDto storeDetails) {
				Optional<SalesTxnDao> salesTxns = salesTxnRepo.findById(txnId);
				if(salesTxns.isPresent()) {
					if(salesTxns.get().getCustomerId()!=null) {
						CustomerDetailsDto customer = customerService.getCustomer(salesTxns.get().getCustomerId());
						if(!StringUtils.isEmpty(customer.getEmailId())) {
							Map<String, String> data = new HashMap<>();
							OrderDaoExt orderDaoExt = orderRepository.findOneByIdAndSalesTxnLocationCode(txnId,	storeDetails.getLocationCode());
							NotificationType notfType = orderDaoExt.getIsFrozenRate() ? NotificationType.GR_FROZEN : NotificationType.GR_NON_FROZEN;
							data.put("docNo", String.valueOf(salesTxns.get().getDocNo()));
							data.put("docDate", SalesDateUtil.convertDateFormat(salesTxns.get().getDocDate()));
							data.put("transactionType", PrintDocumentTypeEnum.AB.name().equals(documentType) ? "an Advance Booking" : "Customer Order");
							data.put("locationCode", storeDetails.getTownName() + " - "+ storeDetails.getDescription());
							data.put("brandCode", storeDetails.getSubBrandCode());
							MetalRateListDto orderMetalRate = commonTransactionService
									.mapMetalRateJsonToDto(salesTxns.get().getMetalRateDetails());
							if (orderMetalRate.getMetalRates() != null) {
								Optional.ofNullable(orderMetalRate.getMetalRates().get("J").getRatePerUnit())
										.ifPresent(metalRate -> data.put("frozenRate", metalRate.toString()));
							}
							Map<String, File> fileAttachments = new HashMap<>();
							try {
								fileAttachments.put("invoiceDocument", new File(response.getBody().getFile().getAbsolutePath()));
							} catch (IOException e) {
								e.printStackTrace();
							}
							NotificationDto notificationDto = new NotificationDto();
							notificationDto.setEmailIds(Set.of(customer.getEmailId()));
							NotificationTypeDataDto notf = new NotificationTypeDataDto(notfType, data, null, fileAttachments);
							notificationDto.setNotificationTypeData(List.of(notf));
							notificationDto.setLocationCode(storeDetails.getLocationCode());
							Calendar calendar = Calendar.getInstance();
							calendar.setTime(salesTxns.get().getDocDate());
							notificationDto.setEmailSubject(storeDetails.getSubBrandCode()+  " Invoice - "+ (PrintDocumentTypeEnum.AB.name().equals(documentType) ? "Advance Booking" : "Customer Order" +" - "+storeDetails.getDescription())+" - "+calendar.get(Calendar.YEAR));
							intgServiceClient.sendNotification(notificationDto);
						}
					}
				}			
		}

	/**
	 * This method is used to check if existing record already exist then throw
	 * error for print implementation
	 * 
	 * @param txnId
	 * @param documentType
	 * @param fileType
	 */
	private void throwErrorIfActiveRecordExists(String txnId, PrintDocumentTypeEnum documentType, String fileType,
			InvoiceDocumentTypeEnum invoiceType, Boolean lastTransactionPrint) {

		CustomerDocumentsDao cd = getActiveExistingRecordIfAny(txnId, documentType.name(), fileType);
		if (cd != null && !documentType.equals(PrintDocumentTypeEnum.COA.name())
				&& lastTransactionPrint == Boolean.FALSE) {
			if (invoiceType == InvoiceDocumentTypeEnum.PRINT) {
				throw new ServiceException("Print already done once. Need to use reprint functionality",
						"ERR-SALE-271");
			} else if (invoiceType == InvoiceDocumentTypeEnum.MAIL) {
				throw new ServiceException("Mail already sent once. Need to use reprint functionality", "ERR-SALE-347");
			} else if (invoiceType == InvoiceDocumentTypeEnum.BOTH) {
				throw new ServiceException("Print and Mail already sent once. Need to use reprint functionality",
						"ERR-SALE-348");
			}

		}

	}

	private CustomerDocumentsDao getActiveExistingRecordIfAny(String txnId, String documentType, String fileType) {
		return customerDocumentService.getOldCustomerDocumentByInput(txnId, documentType, fileType);
	}

	/**
	 * 
	 * @param printableDto
	 * @return String
	 */
	private String generateHtml(String template, PrintableDto printableDto) {

		String html = null;

		try {
			// get the template from the resources folder
			Template t = freemarkerConfig.getTemplate(template);

			// bind the all values from DTO to FTL file and return the HTML string
			html = FreeMarkerTemplateUtils.processTemplateIntoString(t, printableDto);

		} catch (Exception e) {
			log.debug("HTML generation failed from template: {}", e);
			throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
		}

		return html;
	}

	@Override
	@Transactional
	public ResponseEntity<Resource> rePrintDocument(String documentTypeStr, String productCode, String fileTypeStr,
			String txnId, String invoiceType,PrintRequestDto printRequest) {

		PrintDocumentTypeEnum documentType = PrintDocumentTypeEnum.valueOf(documentTypeStr);

		if (documentType == PrintDocumentTypeEnum.DEPOSIT)
			return reprintDeposit(documentTypeStr, productCode, fileTypeStr, txnId, invoiceType,printRequest);
		else
			return reprintCustomerDocument(documentTypeStr, productCode, fileTypeStr, txnId, invoiceType,null);

	}

	private ResponseEntity<Resource> reprintDeposit(String documentTypeStr, String productCode, String fileTypeStr,
			String txnId, String invoiceType,PrintRequestDto printRequest) {

		BankDepositDaoExt bankDepositDao = bankDepositRepository.findByIdAndLocationCode(txnId,
				CommonUtil.getLocationCode());

		if (bankDepositDao == null)
			throw new ServiceException("Record not found.", "ERR-SALE-070");

		
		if (StringUtils.isBlank(bankDepositDao.getDocumentPath()))
			return generateDocument(documentTypeStr, productCode, fileTypeStr, txnId, invoiceType, false,printRequest,false);
		else {

			String path = fileBasePath + bankDepositDao.getDocumentPath();

			File localFIle = new File(path);

			// if exist in local, return file
			if (localFIle.exists()) {
				log.debug("Avalable in local. Fetching from: {}", path);

				return FileUtil.getFileResourceFromLocalDrive(path, MediaType.APPLICATION_PDF);
			}
			// PENDING check if synced or else generate
		}

		return null;

	}

	private ResponseEntity<Resource> reprintCustomerDocument(String documentTypeStr, String id, String fileTypeStr,
			String txnId, String invoiceType,PrintRequestDto printRequest) {
		PrintDocumentTypeEnum documentType = PrintDocumentTypeEnum.valueOf(documentTypeStr);
		/*
		 * if (PrintDocumentTypeEnum.BILL_CANCELLATION.equals(documentType) && id ==
		 * null) { documentType =
		 * PrintDocumentTypeEnum.valueOf(PrintDocumentTypeEnum.CM_CANCELLATION.name());
		 * }
		 */
		Boolean isReprint = false;
		CustomerDocumentsDao cd = new CustomerDocumentsDao();
		if (documentType.equals(PrintDocumentTypeEnum.BILL_CANCELLATION))
			cd = getActiveExistingRecordIfAny(id, documentTypeStr, fileTypeStr);
		else
			cd = getActiveExistingRecordIfAny(txnId, documentType.name(), fileTypeStr);

		// if record there in DB, get path & find in local
		// if fails check in online bucket, if not available there,
		// deactivate record, generate again
		// print didn't happen ever, or DB data removed

		if (cd != null) {

			String path = fileBasePath + cd.getDocumentPath();

			File localFIle = new File(path);

			// if exist in local, return file
			if (localFIle.exists()) {
				log.debug("Avalable in local. Fetching from: {}", path);

				ResponseEntity<Resource> res = FileUtil.getFileResourceFromLocalDrive(path, MediaType.APPLICATION_PDF);
				//sendMailToInvoice(documentType.name(), id, fileTypeStr, txnId, invoiceType, res,printRequest);
				// increase print count
				//increasePrintCountOnReprint(txnId, documentType.name(), invoiceType);
				isReprint = true;
				//return res;
			}
			// if not there in local, there in S3 download from there
			else if (cd.getIsSynced()) {
				log.debug("Not avalable in local. Fetching from online bucket: {}", path);

				ResponseEntity<Resource> res = getFileFromOnlineBucket(documentType.name(), id, fileTypeStr, txnId, cd,
						invoiceType,null);
				//sendMailToInvoice(documentTypeStr, id, fileTypeStr, txnId, invoiceType, res,printRequest);
				// increase print count
				//increasePrintCountOnReprint(txnId, documentType.name(), invoiceType);
				isReprint = true;
				//return res;

			} else {
				// if not synced
				log.debug("Local file doesn't exist. Not synced. Deactivating old one, generating new one");
				return deactivateCustomerDocAndGenerate(documentTypeStr, id, fileTypeStr, txnId, cd, invoiceType,null);
			}
		}

		if (documentType == PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE
				|| documentType == PrintDocumentTypeEnum.GEP_DIGITAL_SIGNATURE) {
			// generate again
			return generateDocument(documentType.name(), id, fileTypeStr, cd.getCustomer().getId(), invoiceType, true,null,isReprint);
		} else {
			// generate again
			return generateDocument(documentType.name(), id, fileTypeStr, txnId, invoiceType, true,null,isReprint);
		}
	}

	/**
	 * @param txnId
	 * @param documentTypeStr
	 */
	private void increasePrintCountOnReprint(String txnId, String documentTypeStr, String invoiceTypeStr) {

		if (PrintDocumentTypeEnum.getCancelDocTypes().contains(documentTypeStr))
			increaseCancelPrintCount(txnId);
		else
			increaseSalesPrintCount(txnId, invoiceTypeStr);

	}

	private void increasePrintCountOnReprintForDeposit(PrintRequestDto printRequest, String documentTypeStr, String invoiceTypeStr) {

		if (PrintDocumentTypeEnum.getCancelDocTypes().contains(documentTypeStr))
			increaseCancelPrintCountForDeposit(printRequest); 
		else
			increaseSalesPrintCountForDeposit(printRequest, invoiceTypeStr);

	}

	private ResponseEntity<Resource> getFileFromOnlineBucket(String documentTypeStr, String productCode,
			String fileTypeStr, String txnId, CustomerDocumentsDao cd, String invoiceType,PrintRequestDto printRequest) {

		String docPath = cd.getDocumentPath();

		// get file from online bucket & copy to server
		Response res = intgService.getFileInByteArrayResponse(docPath);
		int status = res.status();

		if (status == HttpStatus.OK.value()) {

			// return content from inter-service response
			try {
				ByteArrayResource bar = FileUtil.convertResoruceFromInputStream(res.body().asInputStream());
				return ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_DISPOSITION,
								"attachment; filename=" + FileUtil.getFileNameByPath(docPath))
						.contentType(MediaType.APPLICATION_PDF).body(bar);
			} catch (IOException e) {
				throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e);
			}

		} else {

			JsonNode jsonNode = JsonUtils.convertToJsonNode(res);

			String errCode = jsonNode.get(CommonConstants.CODE).asText();
			if (errCode != null && errCode.equals("ERR-INT-004")) {
				log.debug("File doesn't exist in S3, deactivating customer document, generating again");
				return deactivateCustomerDocAndGenerate(documentTypeStr, productCode, fileTypeStr, txnId, cd,
						invoiceType,printRequest);
			}

			// throw error
			if (jsonNode.get(CommonConstants.CODE) != null && jsonNode.get(CommonConstants.MESSAGE) != null)
				JsonUtils.throwServiceException(jsonNode);
			else
				throw new ServiceException("Online storage operation failed.", "ERR-INT-003", jsonNode);
		}
		// will never reach, but IDE was giving error to add
		return null;
	}

	private ResponseEntity<Resource> deactivateCustomerDocAndGenerate(String documentTypeStr, String productCode,
			String fileTypeStr, String txnId, CustomerDocumentsDao cd, String invoiceType,PrintRequestDto printRequest) {

		// deactivate
		customerDocumentService.deactivateCustomerDoc(cd);

		PrintDocumentTypeEnum documentType = PrintDocumentTypeEnum.valueOf(documentTypeStr);

		if (documentType == PrintDocumentTypeEnum.TEP_DIGITAL_SIGNATURE
				|| documentType == PrintDocumentTypeEnum.GEP_DIGITAL_SIGNATURE) {
			// generate again
			return generateDocument(documentTypeStr, productCode, fileTypeStr, cd.getCustomer().getId(), invoiceType,
					false,null,false);
		} else {
			// generate again
			return generateDocument(documentTypeStr, productCode, fileTypeStr, txnId, invoiceType, false,null,false);
		}
	}

	protected void increaseSalesPrintCount(String txnId, String invoiceTypeStr) {
		InvoiceDocumentTypeEnum invoiceType = InvoiceDocumentTypeEnum.valueOf(invoiceTypeStr);
		Optional<SalesTxnDao> salesTxns = salesTxnRepo.findById(txnId);
		if (salesTxns.isPresent()) {
			SalesTxnDao salesTxn = salesTxns.get();
			if (invoiceType == InvoiceDocumentTypeEnum.BOTH) {
				salesTxn.setPrints(salesTxn.getPrints() + 1);
				salesTxn.setEmailPrints(salesTxn.getEmailPrints() + 1);
			} else if (invoiceType == InvoiceDocumentTypeEnum.MAIL) {
				salesTxn.setEmailPrints(salesTxn.getEmailPrints() + 1);
			} else if (invoiceType == InvoiceDocumentTypeEnum.PRINT) {
				salesTxn.setPrints(salesTxn.getPrints() + 1);
			}
			salesTxnRepo.save(salesTxn);
		}
	}
	
	protected void increaseSalesPrintCountForDeposit(PrintRequestDto printRequest, String invoiceTypeStr) {
		InvoiceDocumentTypeEnum invoiceType = InvoiceDocumentTypeEnum.valueOf(invoiceTypeStr);
		List<SalesTxnDao> salesTxnDaos = new ArrayList<>();
		for(String id : printRequest.getTransactionIds()) {
			Optional<SalesTxnDao> salesTxns = salesTxnRepo.findById(id);
			if (salesTxns.isPresent()) {
				SalesTxnDao salesTxn = salesTxns.get();
				if (invoiceType == InvoiceDocumentTypeEnum.BOTH) {
					salesTxn.setPrints(salesTxn.getPrints() + 1);
					salesTxn.setEmailPrints(salesTxn.getEmailPrints() + 1);
				} else if (invoiceType == InvoiceDocumentTypeEnum.MAIL) {
					salesTxn.setEmailPrints(salesTxn.getEmailPrints() + 1);
				} else if (invoiceType == InvoiceDocumentTypeEnum.PRINT) {
					salesTxn.setPrints(salesTxn.getPrints() + 1);
				}
				//salesTxnRepo.save(salesTxn);
				salesTxnDaos.add(salesTxn);
			}
		}
		salesTxnRepo.saveAll(salesTxnDaos);
	}

	protected void increaseCancelPrintCount(String txnId) {
		Optional<CancelDao> cancels = cancelRepo.findById(txnId);
		if (cancels.isPresent()) {
			CancelDao cancel = cancels.get();
			cancel.setPrints((short) (cancel.getPrints() + 1));
			cancelRepo.save(cancel);
		}
	}
	
	protected void increaseCancelPrintCountForDeposit(PrintRequestDto printRequest) {
		List<CancelDao> cancelDaos = new ArrayList<>();
		for(String id : printRequest.getTransactionIds()) {
			Optional<CancelDao> cancels = cancelRepo.findById(id);
			if (cancels.isPresent()) {
				CancelDao cancel = cancels.get();
				cancel.setPrints((short) (cancel.getPrints() + 1));
				cancelDaos.add(cancel);
				//cancelRepo.save(cancel);
			}
		}
		cancelRepo.saveAll(cancelDaos);
	}

	protected LocationCacheDto getStoreDetails(String locationCode) {

		return engineService.getStoreLocation(locationCode);
	}

	@Override
	public ResponseEntity<String> verifyCustomerEmail(Integer customerId) {
		CustomerDetailsDto customer = customerService.getCustomer(customerId);
		if (customer.getEmailId() == null) {
			throw new ServiceException(SalesConstants.CUSTOMER_DOES_NOT_HAVE_VALID_CONTACT_INFORMATION,
					SalesConstants.ERR_SALE_029);
		}

		return new ResponseEntity<>("Success", HttpStatus.OK);
	}

	@Override
	public Map<String,PrintRequestDto> getIds(PrintRequestDto printRequest) {
		List<BankDepositDaoExt> bankDepositDaos = bankDepositRepository.findAllByIdAndLocationCode(printRequest.getTransactionIds(),CommonUtil.getLocationCode());
		List<String> bankDepositForHomeBank = new ArrayList<>();
		List<String> bankDepositForNonHomeBank = new ArrayList<>();
		Map<String,PrintRequestDto> bankDepositDaoss = new HashMap<>();
			List<String> paymentCode = new ArrayList<>();
			paymentCode.add(PaymentCodeEnum.CHEQUE.name());
			paymentCode.add(PaymentCodeEnum.DD.name());
			for(BankDepositDaoExt bankDepositDao :bankDepositDaos ) {
			

			if (!bankDepositDao.getPayerBankName().equalsIgnoreCase(bankDepositDao.getPayeeBankName()) ) {
					if (!bankDepositDao.getPayerBankName().equalsIgnoreCase(bankDepositDao.getPayeeBankName()) &&!(bankDepositForNonHomeBank.contains(bankDepositDao.getId()))) {
						bankDepositForNonHomeBank.add(bankDepositDao.getId());
					}	
			}
			
			else {
				
					if (bankDepositDao.getPayerBankName().equalsIgnoreCase(bankDepositDao.getPayeeBankName()) &&!(bankDepositForHomeBank.contains(bankDepositDao.getId())) ) {
						bankDepositForHomeBank.add(bankDepositDao.getId());
					}
			}
						
			}				
		
			bankDepositDaoss.put("homeBank",new PrintRequestDto(bankDepositForHomeBank));	
			bankDepositDaoss.put("nonHomeBank",new PrintRequestDto(bankDepositForNonHomeBank));
		return bankDepositDaoss;
	}
}
