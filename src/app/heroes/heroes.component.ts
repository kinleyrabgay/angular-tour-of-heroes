import {
  AfterViewInit,
  ViewChild,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CrudService } from '../api/crud.service';
import { catchError, tap } from 'rxjs/operators';
import { Hero } from '../model/hero';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { FormComponent } from '../components/form/form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { EditComponent } from '../components/edit/edit.component';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit, AfterViewInit {
  @Input() title: string = 'My Heros List';

  // keep track of the form
  isButtonEnabled = true;
  dialogRef: MatDialogRef<FormComponent> | null = null;

  heroesArr: Hero[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'clan',
    'ability',
    'highestXP',
    'action',
  ];
  displayDatas = new MatTableDataSource<Hero>(this.heroesArr);

  constructor(
    private crudService: CrudService,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.displayDatas.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllHero();
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

  // get hero
  getAllHero() {
    this.crudService
      .getAllHero()
      .pipe(
        tap((res) => {
          this.heroesArr = res;
          // set data source after API call
          this.displayDatas.data = this.heroesArr;
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
      console.log(result);
      if (result) {
        this.crudService
          .deleteHero(id)
          .pipe(
            catchError((error: any) => {
              console.log(error);
              this.toast.error({
                detail: 'Error Message',
                summary: 'Failed to delete the hero',
                duration: 5000,
              });
              return throwError(error);
            })
          )
          .subscribe(() => {
            this.displayDatas.data = this.displayDatas.data.filter(
              (h: Hero) => h.id !== id
            );
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
        type: 'edit',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
