import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {

  isSignUp = false;
  form!: FormGroup;

  constructor( private fb: FormBuilder, private router: Router, private auth: AuthService ) { }

  ngOnInit(): void {
    if ( this.router.url === '/register' ) {
      this.isSignUp = true;
    }

    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  invalidForm() {
    return Object.values(this.form.controls).forEach( control => control.markAsTouched());
  }

  invalidInput(input: string): any {
    return this.form.get(input)?.invalid && this.form.get(input)?.touched;
  }

  login(): any {
    this.auth.login(this.form.value).subscribe({
      next: (resp: any) => {
        Swal.close();
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User/password invalid'
        });
      }
    });
  }

  register() {
    this.auth.register(this.form.value).subscribe({
      next: (resp: any) => {
        Swal.close();
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error creating account',
          text: err.message,
          confirmButtonColor: '#ff0253'
        });
      }
    });
  }

  onSubmit() {
    if ( this.form.invalid ) {
      this.invalidForm();
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
    });

    Swal.showLoading();

    if ( this.isSignUp ) {
      this.register();
    } else {
      this.login();
    }
  }

}
