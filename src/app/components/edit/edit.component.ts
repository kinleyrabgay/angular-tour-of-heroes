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
import { Hero } from 'src/app/gql/hero/hero';
import { Apollo } from 'apollo-angular';
import { Heros_ById } from 'src/app/gql/hero-query';
import { UPDATE_Hero } from 'src/app/gql/hero-mutation';

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
  // dialogRef: MatDialogRef<EditComponent> | null = null;

  // FormGroup
  editHeroGroup: FormGroup;
  constructor(
    public ref: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: number },
    private toast: NgToastService,
    private apollo: Apollo
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
    this.apollo
      .watchQuery<{ allHeros: Hero[] }>({
        query: Heros_ById,
        variables: {
          heroFilter: {
            id: this.data.message,
          },
        },
      })
      .valueChanges.subscribe(({ data }) => {
        const heroObj = data.allHeros[0];
        console.log(heroObj);

        // Set the value of the form group
        this.editHeroGroup.setValue({
          nameFormControl: heroObj.name,
          ageFormControl: heroObj.age,
          clanFormControl: heroObj.clan,
          abilityFormControl: heroObj.ability,
          xpFormControl: heroObj.highestXP,
        });
      });
  }

  // Add the hero to the json-server
  onSubmit() {
    const {
      nameFormControl,
      abilityFormControl,
      clanFormControl,
      xpFormControl,
    } = this.editHeroGroup.value;

    const ageFormControl = parseInt(
      this.editHeroGroup.get('ageFormControl')?.value
    );
    const heroId = this.data.message;

    // Perform the mutation to update the hero
    this.apollo
      .mutate<{ updateHero: Hero }>({
        mutation: UPDATE_Hero,
        variables: {
          id: heroId,
          name: nameFormControl,
          age: ageFormControl,
          clan: clanFormControl,
          ability: abilityFormControl,
          highestXP: xpFormControl,
        },
      })
      .subscribe(({ data }) => {
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
