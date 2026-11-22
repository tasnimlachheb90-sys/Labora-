
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-manage-users',
  imports: [FormsModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {

  users: any[] = [];
  message = 'Chargement des utilisateurs...';

  showForm = false;
  showEditForm = false;

  newUser = {
    firstname: '',
    lastname: '',
    username: '',
    password: ''
  };

  editedUser = {
    id: 0,
    firstname: '',
    lastname: '',
    username: ''
  };

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.message = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.message = 'Erreur lors du chargement des utilisateurs.';
        this.cdr.detectChanges();
      }
    });
  }

  // Add user
  addUser(): void {
    this.userService.addUser(this.newUser).subscribe({
      next: (response) => {
        alert(response.message);
        this.newUser = {
          firstname: '',
          lastname: '',
          username: '',
          password: ''
        };
        this.showForm = false;
        this.loadUsers();
      },
      error: (error) => {
        alert(error.error?.message || 'Erreur lors de la création.');
      }
    });
  }

  // Delete user
  deleteUser(id: number): void {
    const confirmation = confirm(
      'Are you sure you want to delete this user?'
    );

    if (confirmation) {
      this.userService.deleteUser(id).subscribe({
        next: (response) => {
          alert(response.message || 'User deleted successfully!');
          this.loadUsers();
        },
        error: (error) => {
          console.error(error);
          alert(error.error?.message || 'Error deleting user.');
        }
      });
    }
  }

  // Open edit form
  editUser(user: any): void {
    this.editedUser = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username
    };

    this.showEditForm = true;
    this.showForm = false;
  }

  // Update user
  updateUser(): void {
    this.userService.updateUser(
      this.editedUser.id,
      {
        firstname: this.editedUser.firstname,
        lastname: this.editedUser.lastname,
        username: this.editedUser.username
      }
    ).subscribe({
      next: (response) => {
        alert(response.message || 'User updated successfully!');
        this.showEditForm = false;
        this.loadUsers();
      },
      error: (error) => {
        console.error(error);
        alert(error.error?.message || 'Error updating user.');
      }
    });
  }

}
