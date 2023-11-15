package com.example.clinica_ucu.controllers;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.clinica_ucu.model.Agenda;
import com.example.clinica_ucu.model.Cupos;
import com.example.clinica_ucu.model.Funcionario;
import com.example.clinica_ucu.model.PeriodosActualizacion;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.InitCuposResponse;
import com.example.clinica_ucu.model.response.NewAgendaResponse;
import com.example.clinica_ucu.service.impl.AgendaServiceImpl;
import com.example.clinica_ucu.service.impl.FuncionarioServiceImpl;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;

@RestController
@CrossOrigin(origins = "*")
public class AgendaController {

    @Autowired
    private AgendaServiceImpl agendaService;

    @GetMapping(value = "/agenda/obtenerPeriodosActualizacion", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PeriodosActualizacion>> obtenerPeriodosActualizacion()
            throws JsonMappingException, JsonProcessingException, ClassNotFoundException, SQLException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

        return ResponseEntity.ok(agendaService.obtenerPeriodosDeActualizacion());
    }

    @GetMapping(value = "/agenda/obtenerFechasAgenda", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Cupos>> obtenerFechasAgenda(@RequestParam String anio, @RequestParam String semestre)
            throws JsonMappingException, JsonProcessingException, ClassNotFoundException, SQLException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));

        return ResponseEntity.ok(agendaService.obtenerFechasAgenda(anio, semestre));
    }

    @PostMapping(value = "/agenda/{CI}/crearAgenda", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NewAgendaResponse> agendar(@RequestParam String fecha,
            @PathVariable(value = "CI") String CI) throws JsonMappingException, JsonProcessingException, NumberFormatException, SQLException {

        NewAgendaResponse response = agendaService.crearAgenda(CI, fecha);
        if (response.getResponse().getCode().equals("400")) {
            return ResponseEntity.status(400).body(response);
        } else {
            return null;
        }

    }

    @PostMapping(value = "/agenda/cargarPeriodoActualizacion", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InitCuposResponse> cargarPeriodoActualizacion(@RequestBody String periodo)
            throws JsonMappingException, JsonProcessingException, ClassNotFoundException, SQLException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(
                VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
        PeriodosActualizacion data = mapper.readValue(periodo, PeriodosActualizacion.class);
        return ResponseEntity.ok(agendaService.inicializarPeriodo(data));
    }

}
