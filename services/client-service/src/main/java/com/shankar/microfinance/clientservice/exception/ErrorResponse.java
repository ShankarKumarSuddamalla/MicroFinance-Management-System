package com.shankar.microfinance.clientservice.exception;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ErrorResponse {
    private LocalDateTime timeStamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ErrorResponse(){}
    public ErrorResponse(LocalDateTime timeStamp,int status,String error,String message,String path){
        this.timeStamp=timeStamp;
        this.status=status;
        this.error=error;
        this.message=message;
        this.path=path;
    }

}
