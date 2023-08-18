package com.titan.poss.report.service.impl;

import static net.sf.dynamicreports.report.builder.DynamicReports.cmp;

import java.awt.Color;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.utils.CryptoUtil;
import com.titan.poss.report.dao.ReportFieldsDao;
import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.service.ReportGenerator;

import lombok.extern.slf4j.Slf4j;
import net.sf.dynamicreports.jasper.builder.JasperReportBuilder;
import net.sf.dynamicreports.report.builder.DynamicReports;
import net.sf.dynamicreports.report.builder.column.Columns;
import net.sf.dynamicreports.report.builder.column.TextColumnBuilder;
import net.sf.dynamicreports.report.builder.component.ComponentBuilder;
import net.sf.dynamicreports.report.builder.component.TextFieldBuilder;
import net.sf.dynamicreports.report.builder.datatype.DataTypes;
import net.sf.dynamicreports.report.builder.style.StyleBuilder;
import net.sf.dynamicreports.report.builder.style.Styles;
import net.sf.dynamicreports.report.constant.HorizontalTextAlignment;
import net.sf.dynamicreports.report.constant.VerticalTextAlignment;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JRDesignBand;
import net.sf.jasperreports.engine.design.JRDesignStaticText;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.fill.JRSwapFileVirtualizer;
import net.sf.jasperreports.engine.type.HorizontalTextAlignEnum;
import net.sf.jasperreports.engine.type.VerticalTextAlignEnum;
import net.sf.jasperreports.engine.util.JRSwapFile;
@Slf4j
@Service
public class JasperReportGenerator  implements ReportGenerator   {

    private static final String REPORT_TEMP_DIR_PATH = "report.temp.dir.path";

    @Value("${date.format}")
    private String dateFormat;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String userName;

    @Value("${spring.datasource.password}")
    private String password;

    @Autowired
    private  Environment env;


     /**
     * Jasper Report geneartion main method
     * @param reportFields
     * @param reportMasterDao
     * @param query
     * @param outputPath
     */
    @Override
    public void generateReport(List<ReportFieldsDao> reportFields, ReportMasterDao reportMasterDao, String query,
                               String outputPath) {
        String swapFileTempPath = env.getProperty(REPORT_TEMP_DIR_PATH);
        File tempPathDirectory = new File(swapFileTempPath);
        if (!tempPathDirectory.exists()) {
            tempPathDirectory.mkdir();
        }
        JasperReportBuilder report = getReportBuilder(reportFields);
        JRSwapFileVirtualizer virtualizer = null;

        virtualizer = getFileVirtualizerProperty(swapFileTempPath);
        try (Connection conn = DriverManager.getConnection(url,userName,password)){
				log.info("Report Name ---- {}",reportMasterDao.getReportName());
				JRBeanCollectionDataSource createdData = getDecryptedData(reportFields,conn,query);
				log.info("total data size ---{}",createdData.getData().size());
				report.setColumnHeaderStyle(getColumnHeaderStyleProperty())
						.setTableOfContents(reportMasterDao.getTblContent()).setVirtualizer(virtualizer).ignorePageWidth()
						.setTemplateDesign(getJasperDesignProperties(reportMasterDao)).ignorePagination()
						.setDataSource(createdData)
						.noData(createErrorMessageComponent())
						// .noData(createComponent())
						// .setWhenNoDataType(null)
						.toXlsx(new FileOutputStream(outputPath));
		
//				report.setColumnHeaderStyle(getColumnHeaderStyleProperty())
//				.setTableOfContents(reportMasterDao.getTblContent()).setVirtualizer(virtualizer).ignorePageWidth()
//				.setTemplateDesign(getJasperDesignProperties(reportMasterDao)).ignorePagination()
//				.setDataSource(query,conn)
//				.noData(createErrorMessageComponent())
//				// .noData(createComponent())
//				// .setWhenNoDataType(null)
//				.toXlsx(new FileOutputStream(outputPath));
            	
        } catch (DRException | FileNotFoundException | SQLException e) {
            log.info("report generation error", e);
            throw new ServiceException("Problem in report generation","ERR-REPORT-012");
        } finally {

            virtualizer.cleanup();
        }
    }

    /**
     * Building report component
     * @param reportFields
     * @return
     */
    private JasperReportBuilder getReportBuilder(List<ReportFieldsDao> reportFields) {

        JasperReportBuilder reportBuilder = DynamicReports.report();

        TextColumnBuilder<?> column = null;
        for (ReportFieldsDao reportFieldsData : reportFields) {
            switch (reportFieldsData.getFieldType()) {
                case "STRING":
                    column = Columns.column(reportFieldsData.getHeaderFieldName(), reportFieldsData.getFieldName(),
                            DataTypes.stringType());
                    break;
                case "BIGDECIMAL":
                    column = Columns.column(reportFieldsData.getHeaderFieldName(), reportFieldsData.getFieldName(),
                            DataTypes.bigDecimalType());
                    break;
                case "INTEGER":
                    column = Columns.column(reportFieldsData.getHeaderFieldName(), reportFieldsData.getFieldName(),
                            DataTypes.integerType());
                    break;
                default:
                    column = Columns.column(reportFieldsData.getHeaderFieldName(), reportFieldsData.getFieldName(),
                            DataTypes.stringType());
                    break;
            }
            reportBuilder
                    .addColumn(column
                            .setStyle(Styles.style()
                                    .setHorizontalTextAlignment(HorizontalTextAlignment.valueOf(reportFieldsData.getHrAlign()))
                                    .setFontSize(reportFieldsData.getFontSize())
                                    .setFontName(reportFieldsData.getFontName())
                                    .setVerticalTextAlignment(VerticalTextAlignment.valueOf(reportFieldsData.getVrAlign())))
                            .setWidth(reportFieldsData.getWidth()).setHeight(reportFieldsData.getHeight()));
        }

        return reportBuilder;
    }

    /**
     * Setting file virtualizer property
     * @param filePath
     * @return
     */
    private JRSwapFileVirtualizer getFileVirtualizerProperty(String filePath) {
        JRSwapFile swapFile = new JRSwapFile(filePath, 1024, 100);
        return new JRSwapFileVirtualizer(50, swapFile, true);
    }

    /**
     *Setting Column header style
     * @return
     */
    private StyleBuilder getColumnHeaderStyleProperty() {
        return Styles.style().bold().setVerticalTextAlignment(VerticalTextAlignment.MIDDLE)
                .setHorizontalTextAlignment(HorizontalTextAlignment.CENTER).setFontSize(15)
                .setBackgroundColor(Color.ORANGE).setForegroundColor(Color.ORANGE);
    }
    /**
     * Ading static text property
     * @param reportname
     * @return
     */
    private JRDesignStaticText getStaticTextProperty(String reportname) {
		JRDesignStaticText staticText = new JRDesignStaticText();
		staticText.setText(reportname);
		staticText.setX(0);
		staticText.setY(0);
		staticText.setVerticalTextAlign(VerticalTextAlignEnum.MIDDLE);
		staticText.setBold(Boolean.TRUE);
		staticText.setForecolor(Color.BLUE);
		staticText.setHeight(reportname.length()+30);
//		if (reportname.equalsIgnoreCase("SALES REPORT"))
//			staticText.setWidth(90);
//		else
			staticText.setWidth(90);
		staticText.setHorizontalTextAlign(HorizontalTextAlignEnum.CENTER);
		return staticText;
	}


    /**
     * Ading static text property
     * @param
     * @return
     */
    private JRDesignStaticText getFooterStaticTextProperty() {
        JRDesignStaticText staticText = new JRDesignStaticText();
        SimpleDateFormat dateFormats =  new SimpleDateFormat(dateFormat);
        staticText.setText("NOTE : Report generated as per date on :"+dateFormats.format(new Date()));
        staticText.setX(0);
        staticText.setY(0);
//        staticText.setVerticalTextAlign(VerticalTextAlignEnum.JUSTIFIED);
        staticText.setBold(Boolean.TRUE);
        staticText.setForecolor(Color.BLACK);
        staticText.setBackcolor(Color.ORANGE);
        staticText.setHeight(70);
        staticText.setWidth(90);
        staticText.setHorizontalTextAlign(HorizontalTextAlignEnum.CENTER);
        return staticText;
    }



    /**
     * Setting jasper design property
     * @param reportMasterDao
     * @return
     */
    private JasperDesign getJasperDesignProperties(ReportMasterDao reportMasterDao) {
        JRDesignBand headerBand = new JRDesignBand();
        headerBand.setHeight(reportMasterDao.getReportDescription().length()+30);
        headerBand.addElement(getStaticTextProperty(reportMasterDao.getReportDescription()));
        JRDesignBand footerBand = new JRDesignBand();
        footerBand.setHeight(70);
        footerBand.addElement(getFooterStaticTextProperty());
        JasperDesign jasperDesign = new JasperDesign();
        jasperDesign.setName(reportMasterDao.getReportName());
        jasperDesign.setLeftMargin(reportMasterDao.getLtMargin());
        jasperDesign.setPageFooter(footerBand);
        jasperDesign.setRightMargin(reportMasterDao.getRtMargin());
        jasperDesign.setTopMargin(reportMasterDao.getTpMargin());
        jasperDesign.setBottomMargin(reportMasterDao.getBtMargin());
        jasperDesign.setProperty("net.sf.jasperreports.export.xls.white.page.background", "false");
        jasperDesign.setProperty("net.sf.jasperreports.export.xls.detect.cell.type", "true");
        jasperDesign.setProperty("net.sf.jasperreports.text.truncate.at.char","true");
        jasperDesign.setProperty("net.sf.jasperreports.text.truncate.suffix","true");
        jasperDesign.setProperty("net.sf.jasperreports.print.keep.full.text","true");
        jasperDesign.setProperty("async", "true");
        jasperDesign.setPageHeader(headerBand);
        return jasperDesign;
    }
    private ComponentBuilder<?, ?> createErrorMessageComponent() {
        TextFieldBuilder<String> cmpset = cmp.text("No Data Found For Your Search Parameter");
        StyleBuilder errorStyle = Styles.style().bold().setBackgroundColor(Color.ORANGE).setForegroundColor(Color.BLUE);
        cmpset.setStyle(errorStyle);
        return cmpset;
    }
    
	private JRBeanCollectionDataSource getDecryptedData(List<ReportFieldsDao> reportFields, Connection conn, String query) {
		try {
			Statement selectStatement = conn.createStatement();
			ResultSet rs = selectStatement.executeQuery(query);
			ResultSetMetaData md = rs.getMetaData();
			int columns = md.getColumnCount();
			List<String> listDecimal = reportFields.stream()
					.filter(ele -> ele.getFieldType().equalsIgnoreCase("BIGDECIMAL")).map(e -> e.getFieldName())
					.collect(Collectors.toList());
//			List<String> listString = List.of("Doc No", "Fiscal Year", "Customer No");
			
			List<String> listString = reportFields.stream()
					.filter(ele -> (ele.getFieldType().equalsIgnoreCase("STRING") && ele.getIsEncrypted().equals(false))).map(e -> e.getFieldName())
					.collect(Collectors.toList());
			List<String> listInteger = reportFields.stream()
					.filter(ele -> (ele.getFieldType().equalsIgnoreCase("INTEGER") && ele.getIsEncrypted().equals(false))).map(e -> e.getFieldName())
					.collect(Collectors.toList());
			
 //			List<String> encryptList = List.of("Customer Name", "Mobile No", "PAN Card/Form 60","GST No");
			List<String> encryptList =reportFields.stream()
					.filter(ele -> ele.getIsEncrypted().equals(true)).map(e -> e.getFieldName())
					.collect(Collectors.toList());

			List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
			while (rs.next()) {
				Map<String, Object> row = new HashMap<String, Object>(columns);
				for (int i = 1; i <= columns; ++i) {
					if (encryptList.contains(md.getColumnName(i).toString())) {
						if (rs.getObject(i) != null) {
							String encryptedData = rs.getObject(i).toString();
//							log.info("encryptData {}", encryptedData);
							try {
								String decryptedData = CryptoUtil.decrypt(encryptedData, null);
//								log.info("inside try decryptedData {}", decryptedData);
								row.put(md.getColumnName(i), decryptedData);
							} catch(Exception e) {
//								log.info("inside catch decryptedData {}", encryptedData);
								row.put(md.getColumnName(i), encryptedData);
							}
						} else {
							row.put(md.getColumnName(i), rs.getObject(i));
						}

					} else if (listString.contains(md.getColumnName(i).toString())) {
						if (rs.getObject(i) != null) {
							row.put(md.getColumnName(i), String.valueOf(rs.getObject(i)));
						} else {
							row.put(md.getColumnName(i), rs.getObject(i));
						}

					} else if (listDecimal.contains(md.getColumnName(i).toString())) {
						if (rs.getObject(i) != null) {
							row.put(md.getColumnName(i), new BigDecimal(rs.getObject(i).toString()));
						} else {
							row.put(md.getColumnName(i), rs.getObject(i));
						}

					} else if (listInteger.contains(md.getColumnName(i).toString())) {
						
						if (rs.getObject(i) != null) {
							
							row.put(md.getColumnName(i), Integer.valueOf(String.valueOf(rs.getObject(i))));
						} else {
							row.put(md.getColumnName(i), rs.getObject(i));
						}

					} else {
						if (rs.getObject(i) != null) {
							row.put(md.getColumnName(i), rs.getObject(i).toString());
						} else {
							row.put(md.getColumnName(i), rs.getObject(i));

						}

					}

				}
				rows.add(row);
			}

			JRBeanCollectionDataSource createdData = new JRBeanCollectionDataSource(rows);
	      return createdData;

		} catch ( SQLException e) {
		
			throw new ServiceException("Problem in report generation", "ERR-REPORT-012");
		}
   }


}
