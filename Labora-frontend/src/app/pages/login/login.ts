
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  message = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  onLogin() {
    this.message = 'Connexion en cours...';

    this.auth.login(this.username, this.password).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        console.log('UTILISATEUR CONNECTÉ :', response.user);

        this.message = 'Connexion réussie !';

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {
        this.message =
          error.error?.message || 'Erreur de connexion au serveur.';
      }
    });
  }
}
