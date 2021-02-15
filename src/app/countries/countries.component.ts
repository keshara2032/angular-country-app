import {OnInit, Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CountriesService} from '../countries.service'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CreateCountryDialogComponent } from '../create-country-dialog/create-country-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';


// interface for a country object
export interface CountryElement {
  id: number;
  country_name: string;
  capital: string;
  population: number;
  readlock:boolean
}


@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})


export class CountriesComponent implements OnInit,AfterViewInit {


  displayedColumns: string[] = ['country_name', 'capital', 'population','actions'];
  dataSource = new MatTableDataSource();

  data: CountryElement[] = [];
  outline = 'outline'

  input:any = {country_name:'', capital:'', population:'', disabled:false}
  output: JSON;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private countryService:CountriesService , public dialog:MatDialog , private _snackBar: MatSnackBar){}

  ngOnInit() {
    // Initializing the table with API call to retrieve countries from the server
    this.getAll()
  }

  ngAfterViewInit() {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }

//Middleware to call create country api
  private createCountry(data:JSON){

    this.countryService.createCountry(data)
    .subscribe(resp => {

      console.log(resp)
        this.getAll()
    })


  }

//Middleware to call update country api
  private updateCountry(id:Number, data:any){

    this.countryService.updateCountry(id,data)
    .subscribe(resp => {

      this.countryService.openSnackBar('Successfully Updated', 'Close')
      console.log(resp)
      this.getAll()

    }, error => {
      // the errorMessage will be passed here in this "error" variable
      console.log(error)
      this.getAll()

    });


  }


//Middleware to call get all countries api
  private getAll() {
    this.countryService.getCountries().subscribe(data =>{
      this.data = [];

      for (let index = 0; index < data.length; index++) {
        const element = data[index];

      const country: CountryElement =   {id: element.id, country_name: element.country_name, capital: element.capital,  population: element.population, readlock:true};
      
  
      this.data.push(country)
      this.data = this.data.slice();
        
      }
      this.dataSource.data = this.data
    })
  }


  //Middleware to call get all countries api
  private deleteCountry(id:Number) {

    this.countryService.deleteCountry(id).subscribe(resp =>{

      console.log(resp)
      this.countryService.openSnackBar('Successfully Deleted', 'Close')
      this.getAll()

    })
  }

//Popup form for creating a country
  openDialog(){

    let dialogRef = this.dialog.open(CreateCountryDialogComponent, {data: this.input});
 
    dialogRef.afterClosed().subscribe( result => {

      if(result == 'true'){

        this.output = <JSON>this.input;
        this.createCountry(this.output )
        this.input =  {country_name:'', capital:'', population:'', disabled:false}

      }

    })

  }

//method to search the table and show filtered results
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

// event handler for edit button
  public redirectToEdit = (id: string) => {


    let index = this.data.findIndex(element => element.id === parseInt(id));

    this.data[index].readlock = !this.data[index].readlock;
    
  }

// event handler for update button
  redirectToUpdate(id: string)  {

    let index = this.data.findIndex(element => element.id === parseInt(id));

    this.data[index].readlock = true;

    this.updateCountry(parseInt(id),this.data[index])


  }

// event handler for delete button
  public redirectToDelete = (id: string) => {

    this.deleteCountry(parseInt(id))
  }


}


