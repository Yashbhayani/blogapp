import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationServiceService } from 'src/app/services/registration-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  LoginForm!: FormGroup;
  actionBtn: string = 'Login';
  Authtoken: any;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private api: RegistrationServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      Email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$'),
        ]),
      ],
      Password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
      ],
    });
  }

  addLoginUser() {
    if (this.LoginForm.valid) {
      let data = {
        email: this.LoginForm.value.Email,
        password: this.LoginForm.value.Password,
      };
      this.api.Login(data).subscribe({
        next: (res) => {
          if (res.success) {
            this.LoginForm.reset();
            this.Authtoken = res.authToken;
            localStorage.setItem('token', this.Authtoken);
            localStorage.setItem('Userinfo', JSON.stringify(res.UDATA));
            this.toastr.success('success', 'Login Successfully');
            this.router.navigate(['/']);
          } else {
            this.toastr.warning(res.errors.code, res.errors.response);
          }
        },
        error: (er) => {
          this.toastr.error(er.statusText, er.error.errors);
        },
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
}
