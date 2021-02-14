import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http'
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  // accessing dev env var 
  baseUrl = environment.baseUrl;


  constructor(private http:HttpClient,  private _snackBar: MatSnackBar) { }

  // snackbar implementation
  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['blue-snackbar']
    });
  }


   // GET API Call to retrieve all countries
   getCountries() {
    
    let url = `${this.baseUrl}/countries`
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError.bind(this))
    );

   }

   // PUT API Call to update a country
   updateCountry(id:Number, body:any) {

    let url = `${this.baseUrl}/countries/${id}`
    return this.http.put<any>(url, body,  {headers : new HttpHeaders({ 'Content-Type': 'application/json' }), observe: 'response'}, )
    .pipe(
      catchError(this.handleError.bind(this))
    );
    
  }

   // DELETE API Call to delete a country
   deleteCountry(id:Number){

    let url = `${this.baseUrl}/countries/${id}`
    return this.http.delete(url)
   

   }

   // POST API Call to create a country
   createCountry(body: any){

    let url = `${this.baseUrl}/countries`
    return this.http.post<any>(url, body,  {observe: 'response'})
    .pipe(
      catchError(this.handleError.bind(this))
    );

   }

   // Error handling for requests
   private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      // this.openSnackBar('Error Occured','Close')
      this.openSnackBar(error.error.message,'Close')

      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error.message}`);
    }

    return throwError(
      'Something bad happened; please try again later.');
  }

  
  

}
