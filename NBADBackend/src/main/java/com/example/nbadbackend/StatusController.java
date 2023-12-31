package com.example.nbadbackend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class StatusController {

    @GetMapping("/status")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("Running");
    }
}
