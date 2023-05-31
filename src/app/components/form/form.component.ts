import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

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
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent {
  matcher = new MyErrorStateMatcher();
  heroObj: Hero = new Hero();

  // FormGroup
  registerHeroGroup: FormGroup;
  constructor(
    private ref: MatDialogRef<FormComponent>,
    private crudService: CrudService
  ) {
    // create a reactive form
    this.registerHeroGroup = new FormGroup({
      nameFormControl: new FormControl('', [Validators.required]),
      abilityFormControl: new FormControl('', [Validators.required]),
      clanFormControl: new FormControl('', [Validators.required]),
      ageFormControl: new FormControl(0, [Validators.required]),
      xpFormControl: new FormControl('', [Validators.required]),
    });
  }

  // Add the hero to the json-server
  onSubmit() {
    const {
      nameFormControl,
      ageFormControl,
      abilityFormControl,
      clanFormControl,
      xpFormControl,
    } = this.registerHeroGroup.value;

    this.heroObj.name = nameFormControl;
    this.heroObj.age = ageFormControl;
    this.heroObj.ability = abilityFormControl;
    this.heroObj.clan = clanFormControl;
    this.heroObj.highestXP = xpFormControl;

    // adding to db.json
    this.crudService
      .addHero(this.heroObj)
      .pipe(
        tap((res) => {
          this.closePopup();
        })
      )
      .subscribe();
  }

  // close the form
  closePopup() {
    this.ref.close();
  }

  // form control
  getFormControl(formControlName: string) {
    return this.registerHeroGroup.get(formControlName);
  }
}
