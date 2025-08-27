package com.moe.socialnetwork;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
/**
 * Author: nhutnm379
 */
@SpringBootApplication
@EnableScheduling
public class MoeApplication {

	public static void main(String[] args) {
		  // Load .env vào System properties
        // Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        // dotenv.entries().forEach(entry -> {
        //     System.setProperty(entry.getKey(), entry.getValue());
        // });
         TimeZone.setDefault(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
		SpringApplication.run(MoeApplication.class, args);
	}

}
