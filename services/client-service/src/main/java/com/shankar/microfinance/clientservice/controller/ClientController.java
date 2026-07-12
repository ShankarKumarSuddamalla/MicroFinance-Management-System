package com.shankar.microfinance.clientservice.controller;

import com.shankar.microfinance.clientservice.dto.request.ClientRequest;
import com.shankar.microfinance.clientservice.dto.response.ClientResponse;
import com.shankar.microfinance.clientservice.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

//    @PostMapping
//    public ResponseEntity<ClientResponse> createClient(
//            @Valid @RequestBody ClientRequest request) {
//
//        ClientResponse response = clientService.createClient(request);
//
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
@PostMapping
public ResponseEntity<ClientResponse> createClient(

        @RequestHeader("X-Auth-User-Id")
        Long authUserId,

        @Valid
        @RequestBody
        ClientRequest request) {

    ClientResponse response = clientService.createClient(
            request,
            authUserId
    );

    return ResponseEntity.status(HttpStatus.CREATED)
            .body(response);

}

    @GetMapping("/{clientNumber}")
    public ResponseEntity<ClientResponse> getClient(
            @PathVariable String clientNumber) {

        return ResponseEntity.ok(
                clientService.getClientByClientNumber(clientNumber));
    }

    @GetMapping
    public ResponseEntity<Page<ClientResponse>> getAllClients(@RequestParam(defaultValue = "0")
                                                              int page,
                                                              @RequestParam(defaultValue = "10")
                                                              int size,
                                                              @RequestParam(defaultValue = "firstName")
                                                              String sortBy) {
        return ResponseEntity.ok(
                clientService.getAllClients(page, size, sortBy));
    }

    @PutMapping("/{clientNumber}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable String clientNumber,
            @Valid @RequestBody ClientRequest request) {

        return ResponseEntity.ok(
                clientService.updateClient(clientNumber, request));
    }

    @DeleteMapping("/{clientNumber}")
    public ResponseEntity<Void> deleteClient(
            @PathVariable String clientNumber) {

        clientService.deleteClient(clientNumber);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mobile/{mobileNumber}")
    public ResponseEntity<ClientResponse> getByMobile(
            @PathVariable String mobileNumber) {

        return ResponseEntity.ok(
                clientService.getClientByMobile(mobileNumber));
    }

    @GetMapping("/aadhaar/{aadhaarNumber}")
    public ResponseEntity<ClientResponse> getByAadhaar(
            @PathVariable String aadhaarNumber) {

        return ResponseEntity.ok(
                clientService.getClientByAadhaar(aadhaarNumber));
    }

    @GetMapping("/pan/{panNumber}")
    public ResponseEntity<ClientResponse> getByPan(
            @PathVariable String panNumber) {

        return ResponseEntity.ok(
                clientService.getClientByPan(panNumber));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientResponse>> searchByName(
            @RequestParam String firstName) {

        return ResponseEntity.ok(
                clientService.searchByFirstName(firstName));
    }

}