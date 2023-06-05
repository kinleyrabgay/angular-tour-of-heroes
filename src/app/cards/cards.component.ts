import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormComponent } from '../components/form/form.component';
import { CrudService } from '../api/crud.service';
import { tap, catchError } from 'rxjs/operators';
import { Hero } from '../model/hero';
import { throwError } from 'rxjs';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { EditComponent } from '../components/edit/edit.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css'],
})
export class CardsComponent implements OnInit {
  dialogRef: MatDialogRef<FormComponent> | null = null;
  isButtonEnabled = true;
  heroesArr: Hero[] = [];

  constructor(
    private dialog: MatDialog,
    private crudService: CrudService,
    private toast: NgToastService
  ) {}
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
          this.toast.error({
            detail: 'Error Message',
            summary: 'Failed to get hero list',
            duration: 5000,
          });
          throw err;
        })
      )
      .subscribe();
  }

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
              this.toast.error({
                detail: 'Error Message',
                summary: 'Failed to delete the hero',
                duration: 5000,
              });
              return throwError(error);
            })
          )
          .subscribe(() => {
            this.heroesArr = this.heroesArr.filter((h: Hero) => h.id !== id);
            this.toast.success({
              detail: 'Success Message',
              summary: 'Hero delete successful',
              duration: 5000,
            });
            // Refresh the table data after delete
            this.ngOnInit();
          });
      }
    });
  }

  editHero(id: number): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '50%',
      data: {
        message: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.ngOnInit();
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
