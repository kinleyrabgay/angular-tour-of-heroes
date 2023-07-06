import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

import { ErrorStateMatcher } from '@angular/material/core';
import { Hero } from 'src/app/gql/hero/hero';
import { Apollo } from 'apollo-angular';
import { GET_Heroes } from 'src/app/gql/hero-query';
import { CREATE_Hero } from 'src/app/gql/hero-mutation';

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
  dialogRef: MatDialogRef<FormComponent> | null = null;

  // FormGroup
  registerHeroGroup: FormGroup;
  constructor(
    private ref: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: number; type: string },
    private apollo: Apollo,
    private toast: NgToastService
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
      abilityFormControl,
      clanFormControl,
      xpFormControl,
    } = this.registerHeroGroup.value;
    const ageFormControl = parseInt(
      this.registerHeroGroup.get('ageFormControl')?.value
    );

    this.apollo
      .mutate<{ createHero: Hero }>({
        mutation: CREATE_Hero,
        variables: {
          name: nameFormControl,
          age: ageFormControl,
          clan: clanFormControl,
          ability: abilityFormControl,
          highestXP: xpFormControl,
        },
        update: (cache, { data }) => {
          const existingHeroes = cache.readQuery<{ allHeros: Hero[] }>({
            query: GET_Heroes,
          });

          if (existingHeroes && data && data.createHero) {
            const updatedHeroes = [...existingHeroes.allHeros, data.createHero];

            cache.writeQuery({
              query: GET_Heroes,
              data: { allHeros: updatedHeroes },
            });
          }
        },
      })
      .subscribe(
        ({ data }: any) => {
          if (data) {
            this.toast.success({
              detail: 'Success Message',
              summary: 'Hero added successful',
              duration: 5000,
            });
            this.closePopup();
          }
        },
        (err) => {
          console.log(err);
        }
      );
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
