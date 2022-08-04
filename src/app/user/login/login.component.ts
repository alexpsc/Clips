import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credential = {
    email: "",
    password: ""
  }
  showAlert = false
  alertMsg = "Please wait! We are loggin you in."
  alertColor = "blue"
  isSubmission = false

  constructor(
    private auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true
    this.alertMsg = "Please wait! We are loggin you in."
    this.alertColor = "blue"
    this.isSubmission = true
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credential.email, this.credential.password
      )
    } catch (e) {
      this.isSubmission = false
      this.alertMsg = "an unexpected error occured"
      this.alertColor = "red"
      console.log(e);
      return

    }
    this.alertMsg = "Succes! You are now logged in."
    this.alertColor = "green"
  }

}
