import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/services';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public title = '';
  public authType = '';
  public form: FormGroup;
  public complete = false;
  public error = false;
  public isSubmitting = false;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(data => {
      this.authType = data[data.length - 1].path;
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';

      if (this.authType === 'register') {
        this.form.addControl('username', new FormControl('', Validators.required));
        this.form.addControl('confirmPassword', new FormControl('', Validators.required));
        // @ts-ignore
        this.form.setValidators(this.checkPasswords);
      }
    });
  }

  public submit(): void {
    this.isSubmitting = true;
    switch (this.authType) {
      case 'login':
        this.authService.login(this.form.value.email, this.form.value.password)
          .subscribe(val => this.processSubmit(val));
        break;
      case 'register':
        this.authService.register(this.form.value.email,
          this.form.value.username,
          this.form.value.password).subscribe(val => this.processSubmit(val));
        break;
      default:
        throw new Error(`Wrong auth type: ${this.authType}`);
    }
  }

  private processSubmit(res: boolean): void {
    this.complete = res;
    this.isSubmitting = false;
    if (!this.complete) {
      this.form.reset();
      this.error = true;
    } else {
      this.router.navigate(['./']);
    }
  }

  checkPasswords(group: FormGroup): null | {notSame: boolean} { // here we have the 'passwords' group
    let password: any;
    // @ts-ignore
    password = group.get('password').value;
    // @ts-ignore
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : { notSame: true };
  }

  onInputChanged(): void {
    this.complete = false;
    this.error = false;
  }

}
