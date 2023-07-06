import {
  AfterViewInit,
  ViewChild,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from '../gql/hero/hero';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormComponent } from '../components/form/form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { EditComponent } from '../components/edit/edit.component';
import { NgToastService } from 'ng-angular-popup';
import { Apollo } from 'apollo-angular';
import { GET_Heroes } from '../gql/hero-query';
import { DELETE_Hero } from '../gql/hero-mutation';
import { Observable, of, throwError } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit, AfterViewInit {
  @Input() title: string = 'My Heros List';

  constructor(
    private dialog: MatDialog,
    private toast: NgToastService,
    private apollo: Apollo
  ) {}

  // keep track of the form
  isButtonEnabled = true;
  dialogRef: MatDialogRef<FormComponent> | null = null;

  allHeros$: Observable<Hero[]> = of([]);

  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'clan',
    'ability',
    'highestXP',
    'action',
  ];
  displayDatas = new MatTableDataSource<Hero>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.displayDatas.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getAllHeros();
  }

  openForm() {
    if (this.isButtonEnabled) {
      this.isButtonEnabled = false;
      this.dialogRef = this.dialog.open(FormComponent, {
        width: '50%',
      });

      this.dialogRef.afterClosed().subscribe((result) => {
        this.isButtonEnabled = true;
        this.dialogRef = null;
        if (result) {
          this.ngOnInit();
        }
      });
    }
  }

  getAllHeros() {
    this.allHeros$ = this.apollo
      .watchQuery<{ allHeros: Hero[] }>({
        query: GET_Heroes,
      })
      .valueChanges.pipe(map((res) => res.data.allHeros));

    this.allHeros$.subscribe((heroes) => {
      this.displayDatas.data = heroes;
    });
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
        this.apollo
          .mutate<{ removeHero: Hero }>({
            mutation: DELETE_Hero,
            variables: {
              id: id.toString(),
            },
            update: (cache) => {
              const existingHeroes = cache.readQuery<{ allHeros: Hero[] }>({
                query: GET_Heroes,
              });

              if (existingHeroes && existingHeroes.allHeros) {
                const updatedHeroes = existingHeroes.allHeros.filter(
                  (hero) => hero.id !== id
                );

                cache.writeQuery({
                  query: GET_Heroes,
                  data: { allHeros: updatedHeroes },
                });
              }
            },
          })
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
            this.toast.success({
              detail: 'Success Message',
              summary: 'Hero delete successful',
              duration: 5000,
            });
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
