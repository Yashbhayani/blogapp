import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css'],
})
export class ForgotpassComponent {
  hide = true;
  hidew=true;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ForgotpassComponent>
  ) {}

  modeval: any = 'indeterminate';
  DD = "";
}
