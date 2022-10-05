import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user!: string;

  constructor( public auth: AuthService, private router: Router ) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout()
      .then(() => this.router.navigateByUrl('/login'));
  }

}
