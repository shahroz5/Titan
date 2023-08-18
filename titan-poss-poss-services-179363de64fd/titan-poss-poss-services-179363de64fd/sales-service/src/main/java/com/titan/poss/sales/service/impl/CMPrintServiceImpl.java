/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.domain.constant.DocumentBucketEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.PrintUtil;
import com.titan.poss.sales.constants.FtlTemplateName;
import com.titan.poss.sales.constants.InvoiceDocumentTypeEnum;
import com.titan.poss.sales.constants.PaymentCodeEnum;
import com.titan.poss.sales.constants.PrintDocumentTypeEnum;
import com.titan.poss.sales.constants.SalesConstants;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CreditNoteDaoExt;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dto.CreditNotePaymentOtherDetailsDto;
import com.titan.poss.sales.dto.CustomerDocumentDto;
import com.titan.poss.sales.dto.PrintableDto;
import com.titan.poss.sales.dto.constants.PrintCommonConstants;
import com.titan.poss.sales.dto.constants.PrintEnum;
import com.titan.poss.sales.dto.request.PrintRequestDto;
import com.titan.poss.sales.dto.response.CustomerDetailsDto;
import com.titan.poss.sales.dto.response.GhsPaymentOtherDetailsDto;
import com.titan.poss.sales.dto.response.SalesPaymentDto;
import com.titan.poss.sales.factory.DocumentFactory;
import com.titan.poss.sales.repository.BankDepositRepositoryExt;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CashMemoDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesTxnRepository;
import com.titan.poss.sales.service.CMNotificationService;
import com.titan.poss.sales.service.CMPrintService;
import com.titan.poss.sales.service.CommonPrintService;
import com.titan.poss.sales.service.CreditNoteService;
import com.titan.poss.sales.service.CustomerDocumentService;
import com.titan.poss.sales.service.CustomerService;
import com.titan.poss.sales.service.DocumentGenerator;
import com.titan.poss.sales.service.EngineService;
import com.titan.poss.sales.service.IntegrationService;
import com.titan.poss.sales.service.PaymentFacadeService;
import com.titan.poss.sales.utils.CMPrintUtil;

import feign.Response;
import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.MalformedTemplateNameException;
import freemarker.template.Template;
import freemarker.template.TemplateNotFoundException;
import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class CMPrintServiceImpl implements CMPrintService {

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
	private EngineService engineService;

	@Autowired
	private CashMemoDetailsRepositoryExt cashMemoDetailsRepo;

	@Value("${docs.file.source.path}")
	String fileBasePath;

	@Autowired
	CMNotificationService notificationService;

	@Autowired
	private PaymentFacadeService paymentFacadeService;

	@Autowired
	private CreditNoteService creditNoteService;

	/**
	 * This method will generate the pdf.
	 * 
	 * @param documentType
	 * @param txnId
	 * @param coaPrintFilesToMerge
	 * 
	 */
	@Override
	@Transactional
	public ResponseEntity<Resource> generateDocument(String documentTypeStr, String id, String fileType, String txnId,
			String invoiceTypeStr, Boolean lastTransactionPrint, PrintRequestDto printRequest, Boolean isReprint) {
		CustomerDocumentsDao customerDocumnets = customerDocumentService.getOldCustomerDocumentByInput(txnId,
				PrintDocumentTypeEnum.CM.name(), fileType);
		LocationCacheDto storeDetails = getStoreDetails(CommonUtil.getLocationCode());
		if (!isReprint && PrintDocumentTypeEnum.CM.name().equals(documentTypeStr))
			throwErrorIfActiveRecordExists(txnId, PrintDocumentTypeEnum.valueOf(documentTypeStr), fileType,
					InvoiceDocumentTypeEnum.valueOf(invoiceTypeStr), lastTransactionPrint, customerDocumnets);

		PrintDocumentTypeEnum documentType = PrintDocumentTypeEnum.valueOf(documentTypeStr);
		Map<String, File> doucments = null;
		List<File> emailFiles = new ArrayList<File>();
		if (isReprint) {
			switch (documentType) {
			case COA:
				if (null == id || id.isEmpty() || id.isBlank())
					throw new ServiceException("Mandatory Parameters are missing", "ERR-SALE-347");
				doucments = generateCOAdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
						lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				break;
			case CM:
				doucments = generateCMdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
						lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				File cmMailFile = (null != doucments.get(PrintCommonConstants.EMAIL))
						? doucments.get(PrintCommonConstants.EMAIL).getAbsoluteFile()
						: null;
				if (null != cmMailFile)
					emailFiles.add(cmMailFile);
				if (!emailFiles.isEmpty())
					notificationService.sendNotification(txnId, invoiceTypeStr, isReprint, emailFiles, storeDetails);
				break;
			default:
				break;
			}
		} else {
			switch (documentType) {
			case COA:
				doucments = generateCOAdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
						lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				break;
			case CM:
				doucments = generateCMdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
						lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				File cmMailFile = (null != doucments.get(PrintCommonConstants.EMAIL))
						? doucments.get(PrintCommonConstants.EMAIL).getAbsoluteFile()
						: null;
				if (null != cmMailFile)
					emailFiles.add(cmMailFile);
				Map<String, File> coaDocs = generateCOAdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
						lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				File coaMailFile = (null != coaDocs.get(PrintCommonConstants.EMAIL))
						? coaDocs.get(PrintCommonConstants.EMAIL).getAbsoluteFile()
						: null;
				if (null != coaMailFile)
					emailFiles.add(coaMailFile);
				notificationService.sendNotification(txnId, invoiceTypeStr, isReprint, emailFiles, storeDetails);
				if (!InvoiceDocumentTypeEnum.MAIL.name().equals(invoiceTypeStr) || !isReprint)
					generateCNdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr, lastTransactionPrint,
							printRequest, isReprint, null, customerDocumnets, storeDetails);
				break;
			case CREDIT_NOTE:
				if (!InvoiceDocumentTypeEnum.MAIL.name().equals(invoiceTypeStr))
					doucments = generateCNdocuments(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
							lastTransactionPrint, printRequest, isReprint, null, customerDocumnets, storeDetails);
				break;
			default:
				break;
			}

		}

		increasePrintCountOnReprint(txnId, documentTypeStr, invoiceTypeStr);

		try {
			if (null != doucments.get(PrintCommonConstants.PRINT))
				return ResponseEntity.ok()
						.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + documentTypeStr)
						.contentType(MediaType.APPLICATION_PDF)
						.body(new UrlResource(Paths.get(doucments.get("PRINT").getAbsolutePath()).toUri()));
			else
				return ResponseEntity.ok().build();
		} catch (MalformedURLException e) {
			throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
		}

	}

	private Map<String, File> generateCNdocuments(String documentTypeStr, String id, String fileType, String txnId,
			String invoiceTypeStr, Boolean lastTransactionPrint, PrintRequestDto printRequest, Boolean isReprint,
			Object object, CustomerDocumentsDao customerDocumnets, LocationCacheDto storeDetails) {
		Map<String, File> finalDocs = new HashMap<>();
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();
		customerDocument.setDocumentType(PrintDocumentTypeEnum.CREDIT_NOTE.name());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setTxnId(txnId);
		String path = fileBasePath + generateFilePath(customerDocument);
		String folderPath = path.substring(0, path.lastIndexOf('/'));
		List<File> coaPrintFilesToMerge = new ArrayList<File>();
		List<File> coaEmailFilesToMerge = new ArrayList<File>();
		List<CreditNoteDaoExt> creditNotes = getCreditNotesIfAny(txnId);
		if (null != creditNotes && !creditNotes.isEmpty()) {
			List<String> itemCodeList = (isReprint) ? List.of(id)
					: creditNotes.stream().map(cn -> cn.getId()).collect(Collectors.toList());
			for (String temCode : itemCodeList) {
				Map<String, File> documents = generateDocumentsAndSave(PrintDocumentTypeEnum.CREDIT_NOTE.name(),
						temCode, fileType, txnId, invoiceTypeStr, isReprint, temCode, customerDocumnets, storeDetails);
				if (null != documents.get(PrintCommonConstants.PRINT))
					coaPrintFilesToMerge.add(documents.get(PrintCommonConstants.PRINT));
				if (null != documents.get(PrintCommonConstants.EMAIL))
					coaEmailFilesToMerge.add(documents.get(PrintCommonConstants.EMAIL));
			}
		}
		if (!coaPrintFilesToMerge.isEmpty())
			finalDocs.put(PrintCommonConstants.PRINT, CMPrintUtil.mergeFiles(coaPrintFilesToMerge, folderPath,
					PrintDocumentTypeEnum.CREDIT_NOTE.name() + "_PRINT"));
		if (!coaEmailFilesToMerge.isEmpty())
			finalDocs.put(PrintCommonConstants.EMAIL,
					CMPrintUtil.mergeFiles(coaEmailFilesToMerge, folderPath, PrintDocumentTypeEnum.CREDIT_NOTE.name()));
		return finalDocs;
	}

	private List<CreditNoteDaoExt> getCreditNotesIfAny(String txnId) {
		List<CreditNoteDaoExt> creditNotes = new ArrayList<CreditNoteDaoExt>();
		ListResponse<SalesPaymentDto> listResponsePayment = paymentFacadeService.getPaymentDetails(txnId, null, null,
				null);
		Set<String> creditNoteIds = new HashSet<String>();
		for (SalesPaymentDto payment : listResponsePayment.getResults()) {
			PaymentCodeEnum paymentCode = PaymentCodeEnum.valueOfPaymentCode(payment.getPaymentCode().toUpperCase());
			if (null != paymentCode) {
				String cnId = null;
				if(!StringUtils.isEmpty(payment.getCreditNoteId()))
					cnId = payment.getCreditNoteId();
				else if (paymentCode.equals(PaymentCodeEnum.CREDIT_NOTE)) {
					CreditNotePaymentOtherDetailsDto cnDetails = MapperUtil.getObjectMapperInstance()
							.convertValue(payment.getOtherDetails().getData(), CreditNotePaymentOtherDetailsDto.class);
					cnId = cnDetails.getNewCnId();
				} else if (paymentCode.equals(PaymentCodeEnum.GHS_ACCOUNT)) {
					GhsPaymentOtherDetailsDto ghsDetails = MapperUtil.getObjectMapperInstance()
							.convertValue(payment.getOtherDetails().getData(), GhsPaymentOtherDetailsDto.class);
					cnId = ghsDetails.getCreditNoteId();
				}
				if(!StringUtils.isEmpty(cnId)) creditNoteIds.add(cnId);
			}
		}
		String locationCode= CommonUtil.getLocationCode();
		creditNoteIds.forEach(creditNoteId -> creditNotes.add(creditNoteService.findByIdAndLocationCode(creditNoteId, locationCode)));
		List<CreditNoteDaoExt> opencreditNotes=creditNotes.stream().filter(cn->cn.getStatus().equals("OPEN")).collect(Collectors.toList());
		return opencreditNotes;
	}

	private Map<String, File> generateCMdocuments(String documentTypeStr, String id, String fileType, String txnId,
			String invoiceTypeStr, Boolean lastTransactionPrint, PrintRequestDto printRequest, Boolean isReprint,
			Object object, CustomerDocumentsDao customerDocumnets, LocationCacheDto storeDetails) {
		Map<String, File> documents = generateDocumentsAndSave(documentTypeStr, id, fileType, txnId, invoiceTypeStr,
				isReprint, null, customerDocumnets, storeDetails);
		if (null != documents.get(PrintCommonConstants.EMAIL)) {
			List<File> filesToMerge = new ArrayList<File>();
			filesToMerge.add(documents.get(PrintCommonConstants.EMAIL));
			CustomerDocumentDto customerDocument = new CustomerDocumentDto();
			customerDocument.setDocumentType(PrintDocumentTypeEnum.CM.name());
			customerDocument.setLocationCode(CommonUtil.getLocationCode());
			customerDocument.setTxnId(txnId);
			customerDocument.setFileType(fileType);		
			String filePath = generateFilePath(customerDocument);
			String path = fileBasePath + filePath;
			String folderPath = path.substring(0, path.lastIndexOf('/'));
			File backPage = generateBackPage(FtlTemplateName.CM_BACK, storeDetails.getSubBrandCode(), folderPath, documentTypeStr);
			filesToMerge.add(backPage);		
			documents.put(PrintCommonConstants.EMAIL,
						CMPrintUtil.mergeFiles(filesToMerge, folderPath, PrintDocumentTypeEnum.CM.name()));
			uploadCmEmailFileToOnlineBucket(customerDocument, filePath,	customerDocumnets);
			}
		
		return documents;

	}

	private Map<String, File> generateCOAdocuments(String documentTypeStr, String id, String fileType, String txnId,
			String invoiceTypeStr, Boolean lastTransactionPrint, PrintRequestDto printRequest, Boolean isReprint,
			Object object, CustomerDocumentsDao customerDocumnets, LocationCacheDto storeDetails) {
		Map<String, File> finalDocs = new HashMap<>();
		CustomerDocumentDto customerDocument = new CustomerDocumentDto();
		customerDocument.setDocumentType(PrintDocumentTypeEnum.COA.name());
		customerDocument.setLocationCode(CommonUtil.getLocationCode());
		customerDocument.setTxnId(txnId);
		List<File> coaPrintFilesToMerge = new ArrayList<File>();
		List<File> coaEmailFilesToMerge = new ArrayList<File>();
		List<String> itemCodeList = (isReprint) ? List.of(id)
				: cashMemoDetailsRepo.findByCashMemoDaoId(txnId).stream().map(cashMemo -> cashMemo.getId())
						.collect(Collectors.toList());

		String path = fileBasePath + generateFilePath(customerDocument);
		String folderPath = path.substring(0, path.lastIndexOf('/'));
		for (String itemCode : itemCodeList) {
			Map<String, File> documents = generateDocumentsAndSave(PrintDocumentTypeEnum.COA.name(), itemCode, fileType,
					txnId, invoiceTypeStr, isReprint, itemCode, customerDocumnets, storeDetails);
			if (null != documents.get(PrintCommonConstants.PRINT))
				coaPrintFilesToMerge.add(documents.get(PrintCommonConstants.PRINT));
			if (null != documents.get(PrintCommonConstants.EMAIL))
				coaEmailFilesToMerge.add(documents.get(PrintCommonConstants.EMAIL));
		}
		if (!coaPrintFilesToMerge.isEmpty())
			finalDocs.put(PrintCommonConstants.PRINT, CMPrintUtil.mergeFiles(coaPrintFilesToMerge, folderPath,
					PrintDocumentTypeEnum.COA.name() + "_PRINT"));
		if (!coaEmailFilesToMerge.isEmpty()) {
			File backPage = generateBackPage(FtlTemplateName.COA_BACK, storeDetails.getSubBrandCode(), folderPath, documentTypeStr);
			List<File> filesWithBackPage = coaEmailFilesToMerge.stream().flatMap(file -> Stream.of(file, backPage)).collect(Collectors.toList());
			finalDocs.put(PrintCommonConstants.EMAIL,
					CMPrintUtil.mergeFiles(filesWithBackPage, folderPath, PrintDocumentTypeEnum.COA.name()));
		}
		return finalDocs;
	}

	private File generateBackPage(String template, String brandCode, String folderPath, String documentTypeStr) {
		String backPageFilePath = folderPath + "/" + FilenameUtils.getBaseName(template)+".pdf";
		File localFIle = new File(backPageFilePath);
		if (localFIle.exists()) 
			return localFIle;
		Template t;
		StringWriter out = new StringWriter();
		try {
			t = freemarkerConfig.getTemplate(template);
			Map<String, String> obj = new HashMap<String, String>();
			obj.put("brandCode", brandCode);
			t.process(obj, out);
		} catch (Exception e) {
			log.debug("HTML generation failed from template: {}", e);
			throw new ServiceException("Issue in PDF creation", "ERR-CORE-045", e.getMessage());
		}		
		String html = out.toString();
		try {
			return printPdfAndSave(html, "", backPageFilePath).getBody().getFile();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return localFIle;		
	}

	private ResponseEntity<Resource> printPdfAndSave(String html, String fileBasePath, String documentPath) {
		return PrintUtil.printPdfAndSave(html, fileBasePath, documentPath);
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
			InvoiceDocumentTypeEnum invoiceType, Boolean lastTransactionPrint, CustomerDocumentsDao cd) {
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

	private ResponseEntity<Resource> getFileFromOnlineBucket(String documentTypeStr, String productCode,
			String fileTypeStr, String txnId, CustomerDocumentsDao cd, String invoiceType,
			PrintRequestDto printRequest) {

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

		}
		return null;
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

	protected void increaseCancelPrintCount(String txnId) {
		Optional<CancelDao> cancels = cancelRepo.findById(txnId);
		if (cancels.isPresent()) {
			CancelDao cancel = cancels.get();
			cancel.setPrints((short) (cancel.getPrints() + 1));
			cancelRepo.save(cancel);
		}
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
	public Map<String, PrintRequestDto> getIds(PrintRequestDto printRequest) {
		return null;
	}

	public Map<String, File> generateDocumentsAndSave(String documentType, String id, String fileType, String txnId,
			String invoiceType, Boolean isReprint, String itemCode, CustomerDocumentsDao customerDocumnets, LocationCacheDto storeDetails) {
		PrintDocumentTypeEnum printDocumentTypeEnum = PrintDocumentTypeEnum.valueOf(documentType);
		InvoiceDocumentTypeEnum invoiceDocumentTypeEnum = InvoiceDocumentTypeEnum.valueOf(invoiceType);
		int noOfCopies = (printDocumentTypeEnum.equals(PrintDocumentTypeEnum.CM) && !isReprint)
				? storeDetails.getPrintDetails().getNoOfInvoicecopiesforRegularOrQuickCM()
				: 1;
		Set<String> requiredDocs = listRequiredDocuments(printDocumentTypeEnum, id, fileType, txnId,
				invoiceDocumentTypeEnum, isReprint, noOfCopies, itemCode);
		List<File> collectedfiles = new ArrayList<File>();
		String folderPath = null;
		final String productCode = null == itemCode ? PrintCommonConstants.EMPTY
				: PrintCommonConstants.UNDERSCORE + itemCode;
		if (null != customerDocumnets) {
			String path = fileBasePath + customerDocumnets.getDocumentPath();
			folderPath = path.substring(0, path.lastIndexOf('/'));
			File localFIle = new File(folderPath);
			if (localFIle.exists()) {
				log.debug("Avalable in local. Fetching from: {}", folderPath);
				collectedfiles
						.addAll(getRequiredFilesFromLocalDrive(folderPath, requiredDocs, documentType, productCode));
			} else if (customerDocumnets.getIsSynced()) {
				log.debug("Not avalable in local. Fetching from online bucket: {}", path);
				collectedfiles.addAll(getRequiredFilesOnlineBucket(productCode, invoiceType, customerDocumnets,
						fileType, txnId, folderPath, requiredDocs, documentType));
			}
		}
		requiredDocs = pendingFilesToCollect(requiredDocs, collectedfiles, productCode);
		Map<String, File> processedDocs = new HashMap<>();
		if (!requiredDocs.isEmpty()) {
			DocumentGenerator documentService = documentFactory.getDocumentService(documentType, fileType);
			PrintableDto printableDto = documentService.getPrintableDto(txnId, id);
			CustomerDocumentDto customerDocuments = printableDto.getDocumentDetails();
			folderPath = customerDocuments.getDocumentPath().substring(0,
					customerDocuments.getDocumentPath().lastIndexOf('/'));
			for (String template : printableDto.getTemplateName()) {
				String html = generateHtml(template, printableDto);
				for (String doc : requiredDocs) {
					if (doc.contains(template.substring(0, template.lastIndexOf(".")).toUpperCase())) {
						String htm = doc.contains(PrintCommonConstants.OFFICE_COPY)
								? html.replace("CUSTOMER COPY", "OFFICE COPY")
								: html;
						try {
							collectedfiles.add(
									printPdfAndSave(htm, fileBasePath, folderPath + "/" + doc + ".pdf").getBody().getFile());
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		if (null != folderPath && !collectedfiles.isEmpty())
			processedDocs = processDocuments(collectedfiles, noOfCopies, fileBasePath + folderPath, documentType);
		return processedDocs;
	}

	private Set<String> pendingFilesToCollect(Set<String> requiredDocs, List<File> collectedfiles, String productCode) {
		Set<String> documentsToGenerate = new HashSet<String>();
		documentsToGenerate.addAll(requiredDocs);
		if (null != requiredDocs && !requiredDocs.isEmpty()) {
			for (String doc : requiredDocs) {
				for (File file : collectedfiles) {
					if (file.getName().contains(doc)) {
						documentsToGenerate.remove(doc);
					}
				}
			}
		}
		return documentsToGenerate;
	}

	private void uploadCmEmailFileToOnlineBucket(CustomerDocumentDto customerDocuments, String filePath,
			CustomerDocumentsDao dbDoc) {
		if (null == dbDoc) {
			customerDocuments.setDocumentPath(filePath);
			commonPrintService.uploadFileToOnlineBucketAndSaveToDb(customerDocuments);
		} else {
			commonPrintService.uploadFileToOnlineBucket(filePath);
		}

	}

	private Map<String, File> processDocuments(List<File> collectedfiles, int noOfCopies, String folderPath,
			String documentType) {
		Map<String, File> finalDocs = new HashMap<>();
		List<File> printDocs = collectedfiles.stream()
				.filter(file -> file.getName().contains(PrintCommonConstants.PRINT_CUSTOMER_COPY)
						|| file.getName().contains(PrintCommonConstants.PRINT_OFFICE_COPY))
				.collect(Collectors.toList());
		List<File> emailDocs = collectedfiles.stream()
				.filter(file -> file.getName().equals(documentType + ".pdf")
						|| file.getName().contains(PrintCommonConstants.EMAIL_CUSTOMER_COPY)
						|| file.getName().contains(PrintCommonConstants.EMAIL_OFFICE_COPY))
				.collect(Collectors.toList());
		if (!printDocs.isEmpty()) {
			if (printDocs.size() > 1) {
				File mergedPrintDos = mergeDocuments(printDocs, noOfCopies, folderPath, documentType, false);
				finalDocs.put(PrintCommonConstants.PRINT, mergedPrintDos);
			} else {
				finalDocs.put(PrintCommonConstants.PRINT, printDocs.get(0));
			}
		}
		if (!emailDocs.isEmpty()) {
			if (emailDocs.size() > 1) {
				File mergedemailDos = mergeDocuments(emailDocs, noOfCopies, folderPath, documentType, true);
				finalDocs.put(PrintCommonConstants.EMAIL, mergedemailDos);
			} else {
				finalDocs.put(PrintCommonConstants.EMAIL, emailDocs.get(0));
			}
		}
		return finalDocs;
	}

	private File mergeDocuments(List<File> collectedfiles, int noOfCopies, String folderPath, String documentType,
			boolean isEmailDos) {
		String outputFileName = (isEmailDos) ? documentType
				: documentType + PrintCommonConstants.UNDERSCORE + PrintCommonConstants.PRINT;
		List<File> filesToMerge = new ArrayList<File>();
		filesToMerge.addAll(collectedfiles);
		int iterationCount = Math.abs(filesToMerge.size() - noOfCopies);
		Optional<File> officeCopy = filesToMerge.stream()
				.filter(file -> file.getName().contains(PrintCommonConstants.OFFICE_COPY)).findFirst();
		if (officeCopy.isPresent()) {
			for (int i = 0; i < iterationCount; i++) {
				filesToMerge.add(officeCopy.get());
			}
		}
		return CMPrintUtil.mergeFiles(filesToMerge, folderPath, outputFileName);
	}

	private Collection<? extends File> getRequiredFilesOnlineBucket(String productCode, String invoiceType,
			CustomerDocumentsDao cd, String fileType, String txnId, String folderPath, Set<String> requiredDocs,
			String documentType) {
		List<File> files = new ArrayList<File>();
		File file = new File(folderPath);
		if (file.exists()) {
			for (File f : file.listFiles()) {
				if (requiredDocs.contains(f.getName().replace(productCode + ".pdf", ""))) {
					ResponseEntity<Resource> resource = getFileFromOnlineBucket(documentType, null, fileType, txnId, cd,
							invoiceType, null);
					if (null != resource)
						try {
							files.add(resource.getBody().getFile());
						} catch (IOException e) {
							e.printStackTrace();
						}
				}
			}
		}
		return files;
	}

	private List<File> getRequiredFilesFromLocalDrive(String path, Set<String> requiredDocs, String documentType,
			String productCode) {
		List<File> files = new ArrayList<File>();
		for (File file : new File(path).listFiles()) {
			if (requiredDocs.contains(file.getName().replace(productCode + ".pdf", "")))
				files.add(file);
		}
		return files;
	}

	private Set<String> listRequiredDocuments(PrintDocumentTypeEnum documentType, String id, String fileType,
			String txnId, InvoiceDocumentTypeEnum invoiceType, Boolean isReprint, int noOfCopies, String itemCode) {
		List<String> requiredDocuments = new ArrayList<String>();
		itemCode = null == itemCode ? PrintCommonConstants.EMPTY : PrintCommonConstants.UNDERSCORE + itemCode;
		String enumString = documentType.name() + "_" + (isReprint ? "REPRINT" : PrintCommonConstants.PRINT) + "_"
				+ invoiceType;
		List<String> list = Enum.valueOf(PrintEnum.class, enumString).getValue();
		requiredDocuments.addAll(list);
		if (!isReprint && PrintDocumentTypeEnum.CM.equals(documentType)
				&& !InvoiceDocumentTypeEnum.MAIL.equals(invoiceType)) {
			if (noOfCopies > 1)
				requiredDocuments.add(documentType.name() + PrintCommonConstants.UNDERSCORE
						+ PrintCommonConstants.PRINT_OFFICE_COPY + itemCode);
		}
		final String itemCodeStr = itemCode;
		return new HashSet<>(
				requiredDocuments.stream().map(doc -> doc = doc + itemCodeStr).collect(Collectors.toList()));
	}

	String generateFilePath(CustomerDocumentDto customerDocument) {

		DocumentBucketEnum baseFolder = DocumentBucketEnum.valueOf(DocumentBucketEnum.CUSTOMER_TRANSACTION.name());

		// @formatter:off
		return new StringBuilder().append("/") // /
				.append(baseFolder.getBucketName()).append("/") // nap-customer-transactions/
				.append(customerDocument.getLocationCode()).append("/") // CPD/
//				.append(customerDocument.getCustomerMasterId()).append("/")			// <CUSTOMER-MASTER-UUID>/
				.append(customerDocument.getTxnId()).append("/") // <TXN-UUID>/
				.append(customerDocument.getDocumentType()).append(".").append(FileExtensionEnum.PDF.getValue()) // GC_PRINTS.pdf
				.toString();
		// @formatter:on
	}

}
