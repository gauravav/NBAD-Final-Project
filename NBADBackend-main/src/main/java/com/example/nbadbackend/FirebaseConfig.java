package com.example.nbadbackend;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Objects;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() {
        try {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(
                            Objects.requireNonNull(getClass().getResourceAsStream("/firebase-config.json"))))
                    .build();

            return FirebaseApp.initializeApp(options);
        } catch (Exception e) {
            throw new RuntimeException("Error initializing Firebase", e);
        }
    }
}

