
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  firstname = '';
  lastname = '';
  email = '';
  username = '';
  password = '';

  message = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onRegister() {

    this.message = 'Inscription en cours...';

    const user = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.auth.register(user).subscribe({

      next: (response: any) => {
        this.message = 'Inscription réussie !';
        console.log('USER REGISTERED:', response.user);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },

      error: (error: any) => {
        this.message =
          error.error?.message || 'Erreur lors de l’inscription.';
      }

    });
  }
}
