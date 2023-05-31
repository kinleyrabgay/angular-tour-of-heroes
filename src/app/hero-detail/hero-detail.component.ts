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

import { HeroService } from '../hero.service';
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
    private location: Location
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
    this.crudService.getHeroById(id).subscribe((res) => {
      this.heroObj = res;
      this.title = res.name;
      this.heroesArr.push(this.heroObj);
      this.displayDatas.data = this.heroesArr;
      console.log(this.heroesArr);
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
