
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

  // New user form
  newUser = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    role: 'Student'
  };

  // Edit user form
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

  // Reset new user form
  resetNewUser(): void {
    this.newUser = {
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      role: 'Student'
    };
  }

  // Add user (Admin)
  addUser(): void {

    if (
      !this.newUser.firstname.trim() ||
      !this.newUser.lastname.trim() ||
      !this.newUser.email.trim() ||
      !this.newUser.username.trim() ||
      !this.newUser.password ||
      !this.newUser.role
    ) {
      alert('Please fill in all fields.');
      return;
    }

    this.userService.addUser(this.newUser).subscribe({
      next: (response) => {
        alert(response.message || 'User created successfully!');

        this.resetNewUser();
        this.showForm = false;

        this.loadUsers();
      },
      error: (error) => {
        console.error(error);
        alert(error.error?.message || 'Error creating user.');
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
