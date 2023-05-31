import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent {
  message: string = 'Are you sure you want to delete this hero?';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent> // @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    // this.message = data.message;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
