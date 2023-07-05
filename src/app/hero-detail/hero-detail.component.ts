import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CrudService } from '../api/crud.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Hero } from '../model/hero';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { EditComponent } from '../components/edit/edit.component';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { FormComponent } from '../components/form/form.component';
import { Apollo } from 'apollo-angular';
import { GET_Heroes, Heros_ById } from '../gql/hero-query';
import { DELETE_Hero } from '../gql/hero-mutation';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  title: string = 'Hero Detail Page';

  // keep track of the form
  isButtonEnabled = true;
  dialogRef: MatDialogRef<FormComponent> | null = null;

  heroesArr: Hero[] = [];
  heroObj: Hero = new Hero();
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
    private route: ActivatedRoute,
    private location: Location,
    private apollo: Apollo,
    private toast: NgToastService
  ) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit(): void {
    this.displayDatas.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.apollo
      .watchQuery<{ allHeros: Hero[] }>({
        query: Heros_ById,
        variables: {
          heroFilter: {
            id: id,
          },
        },
      })
      .valueChanges.subscribe(({ data }) => {
        const heroObj = data.allHeros[0];
        this.displayDatas.data = [heroObj];
      });
  }

  goBack(): void {
    this.location.back();
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
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
