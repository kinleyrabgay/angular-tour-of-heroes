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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { throwError } from 'rxjs';
import { FormComponent } from '../components/form/form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
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

  constructor(private crudService: CrudService, private dialog: MatDialog) {}

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
          console.log(this.heroesArr);
        }),
        catchError((err) => {
          alert('Unable to get list of heroes');
          throw err;
        })
      )
      .subscribe();
  }

  deleteHero(id: number): void {
    if (confirm('Are you sure you want to delete this hero?')) {
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
          this.displayDatas.data = this.displayDatas.data.filter(
            (h: Hero) => h.id !== id
          );
          // Refresh the table data after delete
          this.ngOnInit();
        });
    }
  }

  // TUTORIAL-1 (IN-MEMORY)
  // getHeroes(): void {
  //   this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  // }

  // add(name: string): void {
  //   name = name.trim();
  //   if (!name) {
  //     return;
  //   }
  //   this.heroService.addHero({ name } as Hero).subscribe((hero) => {
  //     this.heroes.push(hero);
  //   });
  // }

  // delete(hero: Hero): void {
  //   this.heroes = this.heroes.filter((h) => h !== hero);
  //   this.heroService.deleteHero(hero.id).subscribe();
  // }

  // deleteHero(hero: Hero): void {
  //   console.log('Called H');
  //   this.heroes = this.heroes.filter((h) => h !== hero);
  //   this.heroService.deleteHero(hero.id).subscribe();
  // }
}

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }
