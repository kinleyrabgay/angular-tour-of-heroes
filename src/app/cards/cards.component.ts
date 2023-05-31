import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../components/form/form.component';
import { CrudService } from '../api/crud.service';
import { tap, catchError } from 'rxjs/operators';
import { Hero } from '../model/hero';
import { throwError } from 'rxjs';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  dialogRef: MatDialogRef<FormComponent> | null = null;
  isButtonEnabled = true;
  heroesArr: Hero[] = [];

  constructor(private dialog: MatDialog, private crudService: CrudService) {}
  ngOnInit(): void {
    this.getAllHero();
  }

  // get hero
  getAllHero() {
    this.crudService
      .getAllHero()
      .pipe(
        tap((res) => {
          this.heroesArr = res;
          console.log(this.heroesArr);
        }),
        catchError((err) => {
          alert('Unable to get list of heroes');
          throw err;
        })
      )
      .subscribe();
  }

  // deleteHero(id: number): void {
  //   if (confirm('Are you sure you want to delete this hero?')) {
  //     this.crudService
  //       .deleteHero(id)
  //       .pipe(
  //         catchError((error: any) => {
  //           console.log(error);
  //           alert('Unable to delete hero');
  //           return throwError(error);
  //         })
  //       )
  //       .subscribe(() => {
  //         this.heroesArr = this.heroesArr.filter((h: Hero) => h.id !== id);
  //         // Refresh the table data after delete
  //         this.ngOnInit();
  //       });
  //   }
  // }

  deleteHero(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {
        message: 'Are you sure you want to delete this hero?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.crudService
          .deleteHero(id)
          .pipe(
            catchError((error: any) => {
              console.log(error);
              alert('Unable to delete hero');
              return throwError(error);
            })
          )
          .subscribe(() => {
            this.heroesArr = this.heroesArr.filter((h: Hero) => h.id !== id);
            // Refresh the table data after delete
            this.ngOnInit();
          });
      }
    });
  }

  openForm() {
    if (this.isButtonEnabled) {
      this.isButtonEnabled = false;
      this.dialogRef = this.dialog.open(FormComponent, {
        width: '50%',
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.isButtonEnabled = true;
        this.dialogRef = null;
        this.ngOnInit();
      });
    }
  }
}
