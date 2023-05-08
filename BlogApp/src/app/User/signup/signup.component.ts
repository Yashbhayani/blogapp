import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationServiceService } from 'src/app/services/registration-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  gender = ['Male', 'Female', 'Other'];
  UserForm!: FormGroup;
  Authtoken: any;
  actionBtn: string = 'Signup';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private api: RegistrationServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.UserForm = this.formBuilder.group({
      Surname: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      MobileNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
      Email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ]),
      ],
      Birthdate: ['', Validators.required],
      Password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
      ],
      Gender: ['', Validators.required],
    });
  }

  addUser() {
    if (this.UserForm.valid) {
      const d = new Date(this.UserForm.value.Birthdate);
      
      let Birth = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
      let data = {
        Surname: this.UserForm.value.Surname,
        FirstName: this.UserForm.value.FirstName,
        LastName: this.UserForm.value.LastName,
        MobileNumber: this.UserForm.value.MobileNumber,
        Email: this.UserForm.value.Email,
        Birthdate: Birth,
        Password: this.UserForm.value.Password,
        Gender: this.UserForm.value.Gender,
      };

      this.api.Signup(data).subscribe({
        next: (res) => {
          this.Authtoken = res.authToken;
          if (res.success) {
            this.UserForm.reset();
            this.toastr.success('success', 'Account is Created');
          } else {
            this.toastr.warning(res.error);
          }
        },
        error: () => {
          this.toastr.error('Error while adding the information.');
        },
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
}
