import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { AuthService } from '../services/auth.service';
import { HelpingService } from '../services/HelpingServices/helpingService';
import { LoginServer } from './login.server';

type AuthMessageType = 'error' | 'success' | 'info';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  log_in = true;
  sign_in = false;
  isSubmitting = false;
  showPassword = false;
  formMessage = '';
  formMessageType: AuthMessageType = 'info';

  user: { name: string; email: string; password: string } = {
    name: '',
    email: '',
    password: '',
  };

  constructor(
    private loginServer: LoginServer,
    private helpingService: HelpingService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {
    addIcons({
      arrowForwardOutline,
      eyeOffOutline,
      eyeOutline,
      lockClosedOutline,
      mailOutline,
      personOutline,
      sparklesOutline,
    });
  }

  ngOnInit(): void {
    this.showLogin();
    if (this.route.snapshot.queryParamMap.has('sessionExpired')) {
      const message = 'Sua sessão expirou. Entre novamente para continuar.';
      this.setMessage(message, 'info');
      this.helpingService.showToast(message, 'medium');
    }
  }

  showRegister(): void {
    this.log_in = false;
    this.sign_in = true;
    this.showPassword = false;
    this.clearMessage();
  }

  showLogin(message = '', type: AuthMessageType = 'info'): void {
    this.log_in = true;
    this.sign_in = false;
    this.showPassword = false;
    if (message) this.setMessage(message, type);
    else this.clearMessage();
  }

  store(): void {
    const name = this.user.name.trim();
    const email = this.user.email.trim().toLowerCase();

    if (!name) return this.setMessage('Informe seu nome para criar a conta.', 'error');
    if (!email) return this.setMessage('Informe seu e-mail.', 'error');
    if (!this.isValidEmail(email)) return this.setMessage('Confira o formato do seu e-mail.', 'error');
    if (this.user.password.length < 8) {
      return this.setMessage('A senha precisa ter pelo menos 8 caracteres.', 'error');
    }

    this.user.name = name;
    this.user.email = email;
    this.isSubmitting = true;
    this.clearMessage();

    this.loginServer.createUser({ name, email, password: this.user.password }).subscribe({
      next: () => {
        this.user.password = '';
        this.showLogin('Sua conta foi criada. Entre com seu e-mail e senha.', 'success');
        this.helpingService.showToast('Conta criada com sucesso!', 'success');
      },
      error: error => {
        if (this.isDuplicateEmailError(error)) {
          this.user.password = '';
          this.showLogin('Este e-mail já tem uma conta. Entre com sua senha para continuar.', 'info');
          return;
        }

        const backendFieldMessage = error?.error?.errors?.email?.[0]
          ?? error?.error?.errors?.name?.[0]
          ?? error?.error?.errors?.password?.[0];
        this.setMessage(backendFieldMessage ?? 'Não foi possível criar a conta. Confira os dados e tente novamente.', 'error');
      },
    }).add(() => this.finishSubmitting());
  }

  login(): void {
    const email = this.user.email.trim().toLowerCase();
    if (!email || !this.user.password) return this.setMessage('Informe seu e-mail e sua senha.', 'error');
    if (!this.isValidEmail(email)) return this.setMessage('Confira o formato do seu e-mail.', 'error');

    this.user.email = email;
    this.isSubmitting = true;
    this.clearMessage();

    this.authService.login({ email, password: this.user.password }).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/');
      },
      error: error => {
        const message = error?.status === 401
          ? 'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
          : error?.error?.errors?.email?.[0]
            ?? error?.error?.errors?.password?.[0]
            ?? 'Não foi possível entrar agora. Tente novamente em instantes.';
        this.setMessage(message, 'error');
      },
    }).add(() => this.finishSubmitting());
  }

  clearMessage(): void {
    this.formMessage = '';
    this.changeDetector.markForCheck();
  }

  private setMessage(message: string, type: AuthMessageType): void {
    this.formMessage = message;
    this.formMessageType = type;
    this.changeDetector.markForCheck();
  }

  private finishSubmitting(): void {
    this.isSubmitting = false;
    this.changeDetector.markForCheck();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isDuplicateEmailError(error: any): boolean {
    const emailErrors: string[] = error?.error?.errors?.email ?? [];
    const message = [error?.error?.message, ...emailErrors].join(' ').toLowerCase();
    return error?.status === 422 && /already been taken|already exists|has already|unique|taken|já (está )?cadastrad|já existe/.test(message);
  }
}
