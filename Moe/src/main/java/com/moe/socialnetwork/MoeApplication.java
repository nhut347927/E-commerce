package com.moe.socialnetwork;

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
		SpringApplication.run(MoeApplication.class, args);
	}

}
