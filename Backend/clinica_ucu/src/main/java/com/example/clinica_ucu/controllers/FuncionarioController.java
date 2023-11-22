package com.example.clinica_ucu.controllers;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.clinica_ucu.model.CarnetSalud;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.NewFuncionarioResponse;
import com.example.clinica_ucu.service.impl.FuncionarioServiceImpl;
import com.example.clinica_ucu.service.impl.UserServiceImpl;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;

@RestController
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private FuncionarioServiceImpl funcionarioService;

    @PostMapping(value = "/funcionario/{CI}/createFuncionario", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NewFuncionarioResponse> createFuncionario(@RequestBody String funcionario,
            @PathVariable(value = "CI") String CI)
            throws JsonMappingException, JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
        Funcionario data = mapper.readValue(funcionario, Funcionario.class);
        data.setCI(CI);

        return ResponseEntity.ok(funcionarioService.createFuncionario(data));
    }

    @PostMapping(value = "/funcionario/{CI}/cargarCarnetSalud", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DefaultResponse> subirComprobante(@RequestParam MultipartFile  file,
            @PathVariable(value = "CI") String CI)
            throws JsonMappingException, JsonProcessingException, ClassNotFoundException, SQLException {

  

        return ResponseEntity.ok(funcionarioService.cargarComprobante(CI,file));
    }

    @PostMapping(value = "/funcionario/{CI}/cargarCarnetSalud", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DefaultResponse> cargarCarnetSalud(@RequestBody String carnetSalud,
            @PathVariable(value = "CI") String CI)
            throws JsonMappingException, JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
        CarnetSalud data = mapper.readValue(carnetSalud, CarnetSalud.class);

        data.setCi(CI);

        return ResponseEntity.ok(funcionarioService.cargarCarnetSalud(data));
    }
}
