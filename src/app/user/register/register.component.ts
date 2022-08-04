import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validator/register-validators';
import { Emailtaken } from '../validator/emailtaken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private emailTaken: Emailtaken
  ) {

  }

  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);

  age = new FormControl("", [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ]);
  password = new FormControl("", [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);

  confirm_password = new FormControl("", [Validators.required]);
  phoneNumber = new FormControl("", [Validators.required, Validators.minLength(13), Validators.maxLength(13)])

  showAlert = false
  alertMsg = "Please wait, Your account is being created";
  alertColor = 'blue'

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match("password", 'confirm_password')])

  async register() {
    this.showAlert = true;
    this.alertMsg = "Please wait, Your account is being created";
    this.alertColor = "blue",
      this.inSubmission = true

    try {
      this.auth.createUser(this.registerForm.value)
    }
    catch (e) {
      console.log(e);
      this.alertMsg = "an unexpect error occurred",
        this.alertColor = "red",
        this.inSubmission = false
      return
    }

    this.alertMsg = "succes! your account has benn created"
    this.alertColor = 'green'

  }

}
