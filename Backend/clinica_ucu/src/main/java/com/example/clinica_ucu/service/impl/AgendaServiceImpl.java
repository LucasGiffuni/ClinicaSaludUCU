package com.example.clinica_ucu.service.impl;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.clinica_ucu.ClinicaUcuApplication;
import com.example.clinica_ucu.model.Agenda;
import com.example.clinica_ucu.model.PeriodosActualizacion;
import com.example.clinica_ucu.model.response.DefaultResponse;
import com.example.clinica_ucu.model.response.InitCuposResponse;
import com.example.clinica_ucu.model.response.NewAgendaResponse;

@Service
public class AgendaServiceImpl {
    private Connection con;

    @Value("${spring.datasource.connectionString}")
    private String connectionString;
    @Value("${spring.datasource.databaseName}")
    private String databaseName;
    @Value("${spring.datasource.databaseUsername}")
    private String databaseUser;
    @Value("${spring.datasource.databasePassword}")
    private String databasePassword;

    private final Logger logger = LoggerFactory.getLogger(ClinicaUcuApplication.class);

    private void createConection() throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.con = DriverManager.getConnection(
                connectionString + databaseName, databaseUser, databasePassword);
    }

    public NewAgendaResponse crearAgenda(Agenda agenda) {

        try {
            createConection();
            String sql = " insert into Agenda (Ci, Fch_Agenda)"
                    + " values (?, ?)";

            PreparedStatement preparedStmt = con.prepareStatement(sql);

            preparedStmt.setInt(1, Integer.parseInt(agenda.getCi()));
            preparedStmt.setDate(2, Date.valueOf(agenda.getFch_Agenda()));

            preparedStmt.execute();

            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            NewAgendaResponse response = new NewAgendaResponse(defaultResponse, "Cita Agendada Correctamente");

            con.close();
            return response;

        } catch (ClassNotFoundException | NumberFormatException | SQLException e) {
            DefaultResponse defaultResponse = new DefaultResponse("400", "ERROR");
            NewAgendaResponse response = new NewAgendaResponse(defaultResponse,
                    "Funcionario ya agendado para esta fecha");

            return response;
        }

    }

    public List<PeriodosActualizacion> obtenerPeriodosDeActualizacion() throws SQLException, ClassNotFoundException {
        createConection();
        List<PeriodosActualizacion> periodos = new ArrayList<>();

        String sql = "select * from Periodos_Actualizacion";
        PreparedStatement preparedStmt = con.prepareStatement(sql);
        ResultSet rs = preparedStmt.executeQuery();
        while (rs.next()) {
            // PeriodosActualizacion u = new
            // PeriodosActualizacion(Integer.toString(rs.getInt(1)), rs.getString(2),
            // rs.getDate(3).toString(),
            // rs.getDate(4).toString());
            // periodos.add(u);
        }

        return periodos;
    }

    public InitCuposResponse inicializarPeriodo(PeriodosActualizacion periodo) {
        try {
            createConection();

            String sql = "insert into Periodos_Actualizacion (Año, Semestre, Fch_Inicio,Fch_Fin) values (?, ?, ?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setInt(1, Integer.parseInt(periodo.getAnio()));

            preparedStmt.setString(2, periodo.getSemestre());

            preparedStmt.setDate(3, Date.valueOf(periodo.getFch_Inicio()));
            preparedStmt.setDate(4, Date.valueOf(periodo.getFch_Fin()));
            preparedStmt.execute();
            con.close();

            prepareCupos(periodo);

            DefaultResponse defaultResponse = new DefaultResponse("200", "OK");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "Periodo y cupos inicializados correctamente");
            return response;

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            DefaultResponse defaultResponse = new DefaultResponse("400", "ERROR");
            InitCuposResponse response = new InitCuposResponse(defaultResponse,
                    "El periodo ingresado ya existe");
            return response;
        }

    }

    private void prepareCupos(PeriodosActualizacion periodo) throws ClassNotFoundException, SQLException {

        LocalDate initialDate = LocalDate.of(Integer.parseInt(periodo.getFch_Inicio().split("-")[0]),
                Integer.parseInt(periodo.getFch_Inicio().split("-")[1]),
                Integer.parseInt(periodo.getFch_Inicio().split("-")[2]));
        LocalDate finalDate = LocalDate.of(Integer.parseInt(periodo.getFch_Fin().split("-")[0]),
                Integer.parseInt(periodo.getFch_Fin().split("-")[1]),
                Integer.parseInt(periodo.getFch_Fin().split("-")[2]));
        ZoneId defaultZoneId = ZoneId.systemDefault();

        List<LocalDate> dates = initialDate.datesUntil(finalDate).toList();
        for (LocalDate localDate : dates) {
            createConection();
            String sql = "insert into Cupos (Fecha, CitasDisponibles) values (?, ?)";
            PreparedStatement preparedStmt = con.prepareStatement(sql);
            preparedStmt.setDate(1, Date.valueOf(localDate));
            preparedStmt.setInt(2, 5);

            preparedStmt.execute();
            con.close();
        }

    }

}
