package com.example.nbadbackend;

import org.apache.logging.log4j.Logger;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.net.UnknownHostException;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/public")
public class PublicController {

    Logger logger = org.apache.logging.log4j.LogManager.getLogger(PublicController.class);

    @GetMapping("/resource")
    public String publicResource() throws UnknownHostException {
        return "The public resource is accessible to anyone at "+ InetAddress.getLocalHost()+":8080";
    }

}
