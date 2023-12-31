package com.example.clinica_ucu.controllers;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.clinica_ucu.model.CarnetSalud;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.NewFuncionarioResponse;
import com.example.clinica_ucu.model.response.ObtenerReporteResponse;
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

    @PostMapping(value = "/funcionario/{CI}/cargarComprobante", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<DefaultResponse> subirComprobante(@RequestParam byte[] blob,
            @PathVariable(value = "CI") String CI)
            throws ClassNotFoundException, SQLException, IOException {

  

        return ResponseEntity.ok(funcionarioService.cargarComprobante(CI,blob));
    }

    @PostMapping(value = "/funcionario/{CI}/cargarCarnetSalud", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DefaultResponse> cargarCarnetSalud(@RequestBody String carnetSalud,
            @PathVariable(value = "CI") String CI)
            throws JsonMappingException, JsonProcessingException, SQLIntegrityConstraintViolationException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
        CarnetSalud data = mapper.readValue(carnetSalud, CarnetSalud.class);

        data.setCi(CI);

        return ResponseEntity.ok(funcionarioService.cargarCarnetSalud(data));
    }

    @GetMapping(value = "/funcionario/obtenerReporte", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ObtenerReporteResponse> obtenerReporte()
            throws JsonMappingException, JsonProcessingException, SQLIntegrityConstraintViolationException {

        return ResponseEntity.ok(funcionarioService.obtenerReporte());
    }
}
