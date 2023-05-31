import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
export class FormComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  heroObj: Hero = new Hero();

  // FormGroup
  registerHeroGroup: FormGroup;
  constructor(
    private ref: MatDialogRef<FormComponent>,
    private crudService: CrudService
  ) {
    this.registerHeroGroup = new FormGroup({
      nameFormControl: new FormControl('', [Validators.required]),
      abilityFormControl: new FormControl('', [Validators.required]),
      clanFormControl: new FormControl('', [Validators.required]),
      ageFormControl: new FormControl('', [Validators.required]),
      xpFormControl: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  // Add the hero to the json-server
  onSubmit() {
    const {
      nameFormControl,
      ageFormControl,
      abilityFormControl,
      clanFormControl,
      xpFormControl,
    } = this.registerHeroGroup.value;

    this.heroObj = {
      id: 0,
      name: nameFormControl,
      age: ageFormControl,
      ability: abilityFormControl,
      clan: clanFormControl,
      highestXP: xpFormControl,
    };

    console.log(this.heroObj);
  }

  closePopup() {
    this.ref.close();
  }

  getFormControl(formControlName: string) {
    return this.registerHeroGroup.get(formControlName);
  }
}
