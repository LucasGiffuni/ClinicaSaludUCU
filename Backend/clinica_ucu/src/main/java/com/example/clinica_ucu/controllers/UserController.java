package com.example.clinica_ucu.controllers;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.crypto.Data;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.token.Token;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.example.clinica_ucu.ClinicaUcuApplication;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.TokenInfo;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.security.JwtUtilService;
import com.example.clinica_ucu.service.impl.UserServiceImpl;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    private static final Logger logger = LoggerFactory.getLogger(ClinicaUcuApplication.class);

    @PostMapping("/public/createUser")
    public ResponseEntity<DefaultResponse> createUser(@RequestParam String user, @RequestParam String clave)
            throws NoSuchAlgorithmException {

        return ResponseEntity.ok(userService.createUser(user, clave));
    }

    @GetMapping("/public/validateUser")
    public ResponseEntity<DefaultResponse> validateUser(@RequestParam String user, @RequestParam String clave)
            throws NoSuchAlgorithmException {

        return ResponseEntity.ok(userService.validateUser(user, clave));
    }

    @PostMapping(value = "/funcionario/{CI}/createFuncionario", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DefaultResponse> createFuncionario(@RequestBody String funcionario,
            @PathVariable(value = "CI") String CI)
            throws JsonMappingException, JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
        Funcionario data = mapper.readValue(funcionario, Funcionario.class);

        data.setLogId(CI);

        return ResponseEntity.ok(userService.createFuncionario(data));
    }

}
