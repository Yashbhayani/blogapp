import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class RegistrationServiceService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:5000';
  }

  Login(data: any) {
    return this.http.post<any>('http://localhost:5000/auth/login', data);
  }

  Signup(data: any) {
    return this.http.post<any>('http://localhost:5000/auth/register', data);
  }

}
