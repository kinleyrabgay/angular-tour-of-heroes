import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, tap } from 'rxjs/operators';
import { NgToastService } from 'ng-angular-popup';

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { CrudService } from 'src/app/api/crud.service';
import { Hero } from 'src/app/model/hero';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  heroObj: Hero = new Hero();
  // dialogRef: MatDialogRef<EditComponent> | null = null;

  // FormGroup
  editHeroGroup: FormGroup;
  constructor(
    public ref: MatDialogRef<EditComponent>,
    private crudService: CrudService,
    @Inject(MAT_DIALOG_DATA) public data: { message: number },
    private toast: NgToastService
  ) {
    // create a reactive form
    this.editHeroGroup = new FormGroup({
      nameFormControl: new FormControl('', [Validators.required]),
      abilityFormControl: new FormControl('', [Validators.required]),
      clanFormControl: new FormControl('', [Validators.required]),
      ageFormControl: new FormControl(0, [Validators.required]),
      xpFormControl: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.crudService
      .getHeroById(this.data.message)
      .pipe(
        tap((res) => {
          this.heroObj = res;
          this.editHeroGroup.setValue({
            nameFormControl: this.heroObj.name,
            abilityFormControl: this.heroObj.ability,
            clanFormControl: this.heroObj.clan,
            ageFormControl: this.heroObj.age,
            xpFormControl: this.heroObj.highestXP,
          });
        }),
        catchError((err) => {
          alert('Unable to get hero data');
          throw err;
        })
      )
      .subscribe();
  }

  // Add the hero to the json-server
  onSubmit() {
    const {
      nameFormControl,
      ageFormControl,
      abilityFormControl,
      clanFormControl,
      xpFormControl,
    } = this.editHeroGroup.value;

    this.heroObj.name = nameFormControl;
    this.heroObj.age = ageFormControl;
    this.heroObj.ability = abilityFormControl;
    this.heroObj.clan = clanFormControl;
    this.heroObj.highestXP = xpFormControl;

    console.log(this.heroObj);

    // adding to db.json
    this.crudService
      .editHero(this.heroObj)
      .pipe(
        tap((res) => {
          if (res) {
            this.toast.success({
              detail: 'Success Message',
              summary: `Detail update for ${this.heroObj.name} successful`,
              duration: 5000,
            });
            this.closePopup();
          }
        })
      )
      .subscribe(() => {
        this.onYesClick();
      });
  }

  // close the form
  closePopup() {
    this.ref.close();
  }

  // form control
  getFormControl(formControlName: string) {
    return this.editHeroGroup.get(formControlName);
  }

  onNoClick(): void {
    this.ref.close(false);
  }

  onYesClick(): void {
    this.ref.close(true);
  }
}
