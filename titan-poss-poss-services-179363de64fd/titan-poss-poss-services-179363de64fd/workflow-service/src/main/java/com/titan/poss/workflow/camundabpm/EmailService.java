package com.titan.poss.workflow.camundabpm;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;


import java.nio.charset.StandardCharsets;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailService {
	
	private static final Logger LOGGER = Logger.getLogger(EmailService.class.getName());
	
	@Autowired
	private Configuration config;
	
	@Value("${spring.mail.host}")
	private String hostName;

	@Value("${spring.mail.port}")
	private Integer port;

	@Value("${spring.mail.username}")
	private String username;

	@Value("${spring.mail.password}")
	private String password;
	
	@Value("${spring.mail.protocol:smtp}")
	private String protocol;

	// permanent
	@Value("${spring.mail.properties.mail.smtp.auth: false}")
	private String smtpAuth;

	@Value("${spring.mail.properties.mail.smtp.timeout}")
	private String mailTimeOut;

	@Value("${spring.mail.properties.mail.smtp.starttls.enable}")
	private String smtpStarttlsEnabled;
	
	@Async
	public void sendApprovalNotification(EmailDto model, String template) throws MessagingException, IOException, TemplateException {
		
		JavaMailSenderImpl emailSender = getJavaMailObject();
		LOGGER.log(Level.INFO, () -> "##### Started Sending Approval Notification Email ####");
		
		try {
			MimeMessage message = emailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
					StandardCharsets.UTF_8.name());

			Template t = config.getTemplate(template);
			String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model.getModel());

			helper.setTo(model.getTo());
			helper.setText(html, true);
			helper.setSubject(model.getSubject());
			
			emailSender.send(message);

		} catch (MessagingException | IOException | TemplateException e) {
			 LOGGER.log(Level.WARNING, "Could not send email to Task Approver. User Email ID is either Not Valid OR Cannot be Resolved.", e);
		}
	}

	private JavaMailSenderImpl getJavaMailObject() {

		JavaMailSenderImpl jmailSender = new JavaMailSenderImpl();
		jmailSender.setHost(hostName);
		jmailSender.setPort(port);
		jmailSender.setProtocol(protocol);

		jmailSender.setUsername(username);
		jmailSender.setPassword(password);

		Properties props = jmailSender.getJavaMailProperties();
		props.put("mail.smtp.auth", smtpAuth);
		props.put("mail.smtp.timeout", mailTimeOut);
		props.put("mail.smtp.starttls.enable", smtpStarttlsEnabled);
		props.put("mail.sender", username);
		props.put("mail.sender.alias", "POSS.DevTeam");
		
		jmailSender.setJavaMailProperties(props);

		return jmailSender;
	}

}
